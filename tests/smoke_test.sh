#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Running smoke tests against local services..."
echo -n "Checking backend /health... "
curl -sS "http://127.0.0.1:8000/health" | grep -q "status" && echo "OK" || (echo "FAILED"; exit 2)
echo -n "Checking frontend /... "
curl -sS -I http://127.0.0.1:3010/ | head -n 1 | grep -q "200" && echo "OK" || (echo "FAILED"; exit 3)
echo -n "Checking proxy -> dashboard... "
curl -sS "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7" | grep -q "overview" && echo "OK" || (echo "FAILED"; exit 4)
echo "All smoke tests passed"
