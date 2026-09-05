#!/usr/bin/env bash
set -u

BASE_URL="${WARMUP_URL:-http://127.0.0.1:3030}"
LOG_PREFIX="[$(date -Is)]"

warm() {
  local name="$1"
  local url="$2"
  local attempts=0

  while [ "$attempts" -lt 3 ]; do
    attempts=$((attempts + 1))
    if curl -fsS --max-time 10 "$url" >/dev/null; then
      echo "$LOG_PREFIX $name warmup OK"
      return 0
    fi
    echo "$LOG_PREFIX $name warmup failed (attempt $attempts/3)" >&2
    sleep 1
  done

  return 1
}

# Use the real homepage as the local process health check. This avoids relying
# on a separate health route and prevents false PM2 restarts after deployments.
if ! curl -fsS --max-time 5 "$BASE_URL/" >/dev/null 2>&1; then
  echo "$LOG_PREFIX Next.js homepage check failed; asking PM2 to restart tip4serv-store" >&2
  if command -v pm2 >/dev/null 2>&1; then
    pm2 restart tip4serv-store --update-env >/dev/null 2>&1 || true
  fi
  sleep 3
fi

warm "products" "$BASE_URL/api/products" || echo "$LOG_PREFIX Products warmup failed; Tip4Serv may be unavailable" >&2
warm "categories" "$BASE_URL/api/categories" || echo "$LOG_PREFIX Categories warmup failed; Tip4Serv may be unavailable" >&2
warm "store" "$BASE_URL/api/store" || echo "$LOG_PREFIX Store warmup failed; Tip4Serv may be unavailable" >&2
warm "shop" "$BASE_URL/shop" || true

echo "$LOG_PREFIX Steampunk SMP cache warmup completed"
