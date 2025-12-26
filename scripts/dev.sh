#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[dev] root: $ROOT"

# ---- helpers ----
kill_if_running () {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file" || true)"
    if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "[dev] stopping old pid $pid ($pid_file)"
      kill "$pid" || true
      sleep 1
    fi
    rm -f "$pid_file"
  fi
}

# ---- stop old ----
kill_if_running "frontend.pid"
kill_if_running "backend.pid"

# ---- start backend (FastAPI) ----
echo "[dev] starting backend on 0.0.0.0:8000"
cd "$ROOT/app/api"

# 最稳：如果你仓库没有 requirements.txt，就用最小依赖把服务跑起来
python -m venv .venv >/dev/null 2>&1 || true
source .venv/bin/activate
python -m pip install -U pip >/dev/null
python -m pip install -U uvicorn fastapi >/dev/null

# 按你仓库常见结构：main.py 里通常 app = FastAPI()
# 如果不是 main:app，你后面再改成正确入口即可
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > "$ROOT/backend.log" 2>&1 &
echo $! > "$ROOT/backend.pid"

# ---- start frontend (Next) ----
echo "[dev] starting frontend on 0.0.0.0:3010"
cd "$ROOT/app/frontend"
npm install >/dev/null 2>&1 || true

# 强制绑定 host/port，避免只监听 localhost 导致 Codespaces 502
nohup npx next dev -H 0.0.0.0 -p 3010 > "$ROOT/frontend.log" 2>&1 &
echo $! > "$ROOT/frontend.pid"

cd "$ROOT"

echo "[dev] wait a bit..."
sleep 2

echo "[dev] ports:"
ss -ltnp | egrep ':(3010|8000)\b' || true

echo "[dev] curl checks:"
curl -sS -I http://127.0.0.1:8000/openapi.json | head -n 3 || true
curl -sS -I http://127.0.0.1:3010/ | head -n 3 || true

echo "[dev] done. use Ports panel -> 3010/8000 -> Open in Browser"
