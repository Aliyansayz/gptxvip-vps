# GPTX VIP - Live Server Management

This application is configured to run in the background using a `tmux` session, ensuring it stays online even if you disconnect from the VPS.

## Getting Started
If you ever restart the VPS, you can simply run the background script:
```bash
./start_tmux.sh
```
And you're good to go!

## Helpful `tmux` Commands

- **To view the live console output:**
  ```bash
  tmux attach -t gptxvip
  ```

- **To disconnect and let it run in the background again:**
  Press `Ctrl + B`, then press `D`

- **To stop the server entirely:**
  ```bash
  tmux kill-session -t gptxvip
  ```
