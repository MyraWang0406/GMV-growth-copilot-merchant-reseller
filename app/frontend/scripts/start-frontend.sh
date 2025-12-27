#!/usr/bin/env bash
set -euo pipefail

# scripts/ 在 app/frontend/scripts
# 所以 frontend 根目录是：app/frontend
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[frontend] cd ${FRONTEND_DIR}"
cd "${FRONTEND_DIR}"

echo "[frontend] node=$(node -v 2>/dev/null || echo 'missing') npm=$(npm -v 2>/dev/null || echo 'missing')"

if [ ! -d "node_modules" ]; then
  echo "[frontend] Installing dependencies..."
  npm install
fi

echo "[frontend] Starting Next dev on 0.0.0.0:3010 ..."
# Use exec so signals propagate and PID is the actual node process
exec npm run dev
