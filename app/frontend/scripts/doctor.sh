#!/usr/bin/env bash
set -euo pipefail

echo "== doctor =="
echo "[1/6] where am I?"
pwd
echo

echo "[2/6] node/npm"
node -v || true
npm -v || true
echo

echo "[3/6] list listening ports (look for :3010)"
ss -ltnp | sed -n '1,200p' || true
echo

echo "[4/6] quick curl to local 3010 (inside codespace container)"
curl -sS -I http://127.0.0.1:3010/ | head -n 5 || true
echo

echo "[5/6] environment hints"
echo "CODESPACES=${CODESPACES:-}"
echo "GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}"
echo

echo "[6/6] reminder"
echo "Don't use http://localhost:3010 on your laptop."
echo "Use Ports panel -> 3010 -> Open in Browser (https://<codespace>-3010.app.github.dev/)."
