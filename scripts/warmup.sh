#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${WARMUP_URL:-http://127.0.0.1:3030}"

curl -fsS --max-time 20 -H 'Cache-Control: no-cache' "$BASE_URL/api/products" >/dev/null
curl -fsS --max-time 20 -H 'Cache-Control: no-cache' "$BASE_URL/api/categories" >/dev/null

# Warm the Next.js shell as well so the first visitor after an idle period is fast.
curl -fsS --max-time 20 "$BASE_URL/shop" >/dev/null
curl -fsS --max-time 20 "$BASE_URL/" >/dev/null

echo "[$(date -Is)] Steampunk SMP cache warmup completed"
