import { create } from 'zustand';
import { LogEntry } from './types';

interface LoggerState {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
}

const MAX_LOGS = 1000;

export const useLoggerStore = create<LoggerState>((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => {
      const newLogs = [...state.logs, log];
      if (newLogs.length > MAX_LOGS) {
        newLogs.shift();
      }
      return { logs: newLogs };
    }),
  clearLogs: () => set({ logs: [] }),
}));
