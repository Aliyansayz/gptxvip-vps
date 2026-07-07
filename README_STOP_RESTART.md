# App Stop, Restart & Logging Guide

This app runs in the background using a `tmux` session named **`gptxvip`**. The session manages two critical services:
1. The Vite Production Preview Server
2. The Cloudflare Tunnel (`gptx-vip-linux`)

Here is a quick reference on how to manage this background process.

## 🛑 How to Stop the App
To completely stop the application and close the Cloudflare tunnel, you must kill the tmux session:
```bash
tmux kill-session -t gptxvip
```

## 🔄 How to Restart the App
If you need to restart the server (e.g. after running a new build or fetching new code), stop the current session and start a new one:
```bash
# 1. Kill the running session
tmux kill-session -t gptxvip

# 2. Run the tmux launcher script
./start_tmux.sh
```

## 📋 How to View Live Terminal Logs
If you want to view the real-time server and tunnel logs, you can attach to the running tmux session:
```bash
tmux attach -t gptxvip
```

### Detaching from Logs (IMPORTANT)
When you are attached to the tmux session, **DO NOT press `Ctrl+C`** unless you want to stop the app!
To safely leave the logs running in the background and return to your main terminal, press:
**`Ctrl+B`**, then press **`D`**.
