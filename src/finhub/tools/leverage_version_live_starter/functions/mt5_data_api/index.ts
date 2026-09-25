export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private isIntentionalClose = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000;
  private maxReconnectDelay = 10000;
  private url: string;
  private config: any;
  private onMessageCallback: (event: MessageEvent) => void;
  private onOpenCallback?: () => void;
  private onCloseCallback?: () => void;
  private onErrorCallback?: (err: Event) => void;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    url: string,
    config: any,
    onMessage: (event: MessageEvent) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: (err: Event) => void
  ) {
    this.url = url;
    this.config = config;
    this.onMessageCallback = onMessage;
    this.onOpenCallback = onOpen;
    this.onCloseCallback = onClose;
    this.onErrorCallback = onError;
    this.connect();
  }

  private connect() {
    if (this.ws) {
      this.clearTimeouts();
      this.ws.close();
      this.ws = null;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log("Connected to Python Live Market Feed backend.");
      
      this.ws?.send(JSON.stringify({
        symbol_id: this.config.symbol_id,
        time_interval: this.config.time_interval,
        time_frequency: this.config.time_frequency,
        latency_rate: this.config.latency_rate
      }));
      
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
      
      if (this.onOpenCallback) this.onOpenCallback();
    };

    this.ws.onmessage = this.onMessageCallback;

    this.ws.onerror = (err) => {
      if (this.onErrorCallback) this.onErrorCallback(err);
    };

    this.ws.onclose = () => {
      if (this.onCloseCallback) this.onCloseCallback();

      if (!this.isIntentionalClose) {
        this.attemptReconnect();
      }
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached. Could not connect to Market Feed.");
      return;
    }

    this.reconnectAttempts++;
    // Exponential backoff with a cap
    const delay = Math.min(
      this.maxReconnectDelay,
      this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1)
    );

    console.log(`Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearTimeouts() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public close() {
    this.isIntentionalClose = true;
    this.clearTimeouts();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getReadyState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }
}

export function connectMT5WebSocket(
  config: {
    symbol_id: string;
    time_interval: string;
    time_frequency: string;
    latency_rate: number;
  },
  onMessage: (event: MessageEvent) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (err: Event) => void
): ReconnectingWebSocket {
  return new ReconnectingWebSocket(
    "ws://localhost:8000/ws/market_feed",
    config,
    onMessage,
    onOpen,
    onClose,
    onError
  );
}