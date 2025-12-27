#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PIDFILE="$ROOT_DIR/backend.pid"
if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo "killed backend pid $PID"
    rm -f "$PIDFILE"
    exit 0
  else
    echo "backend pid $PID not running; removing pidfile"
    rm -f "$PIDFILE"
    exit 0
  fi
else
  echo "no backend pidfile"
  exit 0
fi
