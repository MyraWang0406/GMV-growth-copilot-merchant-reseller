#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/stop-frontend.sh" || true
"$DIR/stop-backend.sh" || true
echo "stopped components"
