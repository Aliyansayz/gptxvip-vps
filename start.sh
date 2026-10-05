#!/bin/bash

set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

# An interrupted build can leave only copied public files in dist.
if [[ ! -s dist/index.html || ! -d dist/assets ]]; then
  echo "Production build is missing or incomplete; rebuilding..."
  npm run build
fi

if [[ ! -s dist/index.html || ! -d dist/assets ]]; then
  echo "Production build is incomplete; refusing to start." >&2
  exit 1
fi

echo "Starting Vite production preview server on port 5173..."
# Run Vite directly so cleanup targets the server rather than an npm wrapper.
node node_modules/vite/bin/vite.js preview --port 5173 --strictPort --host &
PREVIEW_PID=$!
trap 'kill "$PREVIEW_PID" 2>/dev/null || true' EXIT

echo "Waiting for the server to start..."
READY=false
for attempt in {1..30}; do
  if ! kill -0 "$PREVIEW_PID" 2>/dev/null; then
    echo "Preview server exited before it was ready." >&2
    exit 1
  fi
  if curl --fail --silent --output /dev/null http://127.0.0.1:5173/; then
    READY=true
    break
  fi
  sleep 1
done
if [[ "$READY" != true ]]; then
  echo "Preview server did not become ready." >&2
  exit 1
fi

echo "Starting Cloudflare tunnel 'gptx-vip-linux'..."
# Run the tunnel in the foreground so the script stays active
cloudflared tunnel run gptx-vip-linux
