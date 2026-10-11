import { connectMT5WebSocket, ReconnectingWebSocket } from '../../mt5_data_api/index';
import { systemDeployLog } from '../developerLogConsole/utils';

let marketSocket: ReconnectingWebSocket | null = null;

export function startAlphaDataSource(
  config: {
    mode: 'Local Simulation' | 'Live Market Feed';
    symbol_id: string;
    time_interval: string;
    time_frequency: string;
    latency_rate: number;
    livedataprovider?: string;
  },
  onTickCallback: (tickData: any) => void,
  onLog?: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string) => void
) {
  // Cleanup any lingering connection before establishing a new configuration
  if (marketSocket) {
    if (onLog) onLog('INFO', 'WebSocket', 'Closing previous connection before starting new one.');
    systemDeployLog('INFO', 'WebSocket', 'Closing previous connection before starting new one.');
    marketSocket.close();
    marketSocket = null;
  }

  if (config.mode === 'Live Market Feed') {
    if (onLog) onLog('INFO', 'WebSocket', `Initializing connection to Live Market Feed for ${config.symbol_id}...`);
    systemDeployLog('INFO', 'WebSocket', `Initializing connection to Live Market Feed for ${config.symbol_id}...`);
    marketSocket = connectMT5WebSocket(
      config,
      (event) => {
        let response: { type?: string; message?: string; data?: Record<string, any> };
        try {
          response = JSON.parse(event.data);
        } catch {
          if (onLog) onLog('WARN', 'WebSocket', 'Ignored an invalid market feed message.');
          return;
        }
        if (response.type === 'tick') {
          const tick = response.data;
          if (!tick || !Number.isFinite(Number(tick.price))) return;
          onTickCallback({
            price: tick.price,
            oldPrice: tick.old_price,
            volume: tick.volume,
            side: tick.side,
            time: tick.epoch,
          });
        } else if (response.type === 'error') {
          const message = typeof response.message === 'string' ? response.message : 'The broker feed is unavailable.';
          if (onLog) onLog('ERROR', 'WebSocket', message);
          systemDeployLog('ERROR', 'WebSocket', message);
        }
      },
      () => {
        console.log("WebSocket connected.");
        if (onLog) onLog('SUCCESS', 'WebSocket', 'Connected to MT5 WebSocket successfully.');
        systemDeployLog('SUCCESS', 'WebSocket', 'Connected to MT5 WebSocket successfully.');
      },
      () => {
        console.log("Live Market Feed connection securely closed.");
        if (onLog) onLog('WARN', 'WebSocket', 'Live Market Feed connection isolated and closed.');
        systemDeployLog('WARN', 'WebSocket', 'Live Market Feed connection isolated and closed.');
      },
      (err) => {
        console.error("Live Market Feed network error:", err);
        if (onLog) onLog('ERROR', 'WebSocket', `Network error encountered: ${JSON.stringify(err)}`);
        systemDeployLog('ERROR', 'WebSocket', `Network error encountered: ${JSON.stringify(err)}`);
      }
    );
  } else {
    // Fallback to local simulation logic
    console.log("Starting local simulation mode.");
    if (onLog) onLog('INFO', 'DataFeed', 'Starting local simulation mode data generation.');
    systemDeployLog('INFO', 'DataFeed', 'Starting local simulation mode data generation.');
  }
}

export function stopAlphaDataSource(onLog?: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string) => void) {
  if (marketSocket) {
    if (onLog) onLog('INFO', 'WebSocket', 'Executing manual shutdown of Live Market Feed.');
    systemDeployLog('INFO', 'WebSocket', 'Executing manual shutdown of Live Market Feed.');
    marketSocket.close();
    marketSocket = null;
  }
}
