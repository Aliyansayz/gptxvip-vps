import { useLoggerStore } from './store';
import { LogLevel } from './types';

export function systemDeployLog(
  level: LogLevel,
  source: string,
  message: string
) {
  useLoggerStore.getState().addLog({
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
    level,
    source,
    message,
  });
}
