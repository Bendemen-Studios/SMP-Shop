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
    if curl -fsS --max-time 20 "$url" >/dev/null; then
      echo "$LOG_PREFIX $name warmup OK"
      return 0
    fi
    echo "$LOG_PREFIX $name warmup failed (attempt $attempts/3)" >&2
    sleep 2
  done

  return 1
}

# First make sure the local Next.js process is alive. If it is not, let PM2
# recover it and then give the application a moment to come back online.
if ! curl -fsS --max-time 8 "$BASE_URL/api/health" >/dev/null 2>&1; then
  echo "$LOG_PREFIX Next.js health check failed; asking PM2 to restart tip4serv-store" >&2
  if command -v pm2 >/dev/null 2>&1; then
    pm2 restart tip4serv-store --update-env >/dev/null 2>&1 || true
  fi
  sleep 5
fi

# These requests intentionally do not use Cache-Control: no-cache. The goal is
# to exercise the same cached Next.js/Tip4Serv paths that visitors use.
if ! warm "products" "$BASE_URL/api/products"; then
  echo "$LOG_PREFIX Products warmup failed; Tip4Serv may be unavailable" >&2
fi

if ! warm "categories" "$BASE_URL/api/categories"; then
  echo "$LOG_PREFIX Categories warmup failed; Tip4Serv may be unavailable" >&2
fi

warm "shop" "$BASE_URL/shop" || true
warm "home" "$BASE_URL/" || true

echo "$LOG_PREFIX Steampunk SMP cache warmup completed"
