export interface ConsoleLogEntry {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  source: string;
  message: string;
}

export function createConsoleLogEntry(level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string): ConsoleLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    level,
    source,
    message
  };
}
