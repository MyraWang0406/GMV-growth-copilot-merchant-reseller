#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PIDFILE="$ROOT_DIR/backend.pid"
LOGFILE="$ROOT_DIR/backend.log"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "backend already running, pid=$(cat $PIDFILE)"
  exit 0
fi

cd "$ROOT_DIR"
nohup python -m uvicorn app.api.main:app --host 0.0.0.0 --port 8000 --app-dir "$ROOT_DIR" --log-level info > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
echo "backend started, pid=$(cat $PIDFILE)"
