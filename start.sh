#!/bin/bash

echo "Starting Vite production preview server on port 5173..."
npm run preview -- --port 5173 --host &
PREVIEW_PID=$!

echo "Waiting a few seconds for the server to start..."
sleep 3

echo "Starting Cloudflare tunnel 'gptx-vip-linux'..."
# Run the tunnel in the foreground so the script stays active
cloudflared tunnel run gptx-vip-linux

# When the tunnel is stopped (e.g. by pressing Ctrl+C), kill the preview server as well
echo "Stopping Vite preview server..."
kill $PREVIEW_PID
