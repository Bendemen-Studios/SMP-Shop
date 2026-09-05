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
    if curl -fsS --connect-timeout 3 --max-time 8 "$url" >/dev/null; then
      echo "$LOG_PREFIX $name warmup OK"
      return 0
    fi
    echo "$LOG_PREFIX $name warmup failed (attempt $attempts/3)" >&2
    sleep 1
  done

  return 1
}

# Lightweight health check. Only restart PM2 when the local app itself is down;
# a Tip4Serv outage must not cause the webshop process to restart repeatedly.
if ! warm "health" "$BASE_URL/api/health"; then
  echo "$LOG_PREFIX Next.js health check failed; asking PM2 to restart tip4serv-store" >&2
  if command -v pm2 >/dev/null 2>&1; then
    pm2 restart tip4serv-store --update-env >/dev/null 2>&1 || true
  fi
  sleep 3

  if ! warm "health-after-restart" "$BASE_URL/api/health"; then
    echo "$LOG_PREFIX Next.js is still unavailable; skipping cache warmup" >&2
    exit 1
  fi
fi

# Use the normal cached routes. Do not bypass the cache here.
warm "products" "$BASE_URL/api/products" || echo "$LOG_PREFIX Products unavailable (Tip4Serv may be down)" >&2
warm "categories" "$BASE_URL/api/categories" || echo "$LOG_PREFIX Categories unavailable (Tip4Serv may be down)" >&2
warm "shop" "$BASE_URL/shop" || true
warm "home" "$BASE_URL/" || true

echo "$LOG_PREFIX Steampunk SMP cache warmup completed"
