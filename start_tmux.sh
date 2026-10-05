#!/bin/bash

set -euo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

SESSION_NAME="gptxvip"

# Check if the tmux session already exists
if ! tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Starting gptxvip app in a detached tmux session..."
  # Create a detached session named 'gptxvip' and run start.sh
  tmux new-session -d -s "$SESSION_NAME" -c "$PROJECT_DIR" './start.sh'
  echo "✅ App is now running in the background!"
else
  echo "⚠️ The tmux session '$SESSION_NAME' is already running."
fi

echo ""
echo "👉 To view the live terminal output, run: tmux attach -t $SESSION_NAME"
echo "👉 To leave the live output running in the background again, press: Ctrl+B, then D"
echo "🛑 To stop the app completely, run: tmux kill-session -t $SESSION_NAME"
