#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONT_DIR="$ROOT_DIR/app/frontend"
PIDFILE="$ROOT_DIR/frontend.pid"
LOGFILE="$ROOT_DIR/frontend.log"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "frontend already running, pid=$(cat $PIDFILE)"
  exit 0
fi

cd "$FRONT_DIR"
nohup npm run dev -- --hostname 0.0.0.0 --port 3010 > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
echo "frontend started, pid=$(cat $PIDFILE)"
