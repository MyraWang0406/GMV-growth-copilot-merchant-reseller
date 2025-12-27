#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/start-backend.sh"
"$DIR/start-frontend.sh"
echo "started components; tailing logs (backend then frontend). Ctrl-C to exit tail."
tail -n 200 -f "$DIR/../backend.log" &
tail -n 200 -f "$DIR/../frontend.log"
