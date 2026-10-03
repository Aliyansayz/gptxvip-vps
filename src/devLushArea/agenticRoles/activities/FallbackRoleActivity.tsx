import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { AgenticRoleExercise, AgentLogEntry } from '../agenticRoleTypes';
import RoleActivityFrame from '../views/components/RoleActivityFrame';
import AgentTerminalLog from '../views/components/AgentTerminalLog';

export interface ActivityComponentProps {
  step: number;
  exercises: AgenticRoleExercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: any;
  onComplete?: () => void;
}

export default function FallbackRoleActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<AgentLogEntry[]>(exercise?.logs?.slice(0, 1) || []);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runSample = () => {
    setRunning(true);
    setLogs([]);
    const sample = exercise.logs?.length ? exercise.logs : [{ timestamp: '00:00:01', level: 'info' as const, message: 'Review the case evidence and compare the available decisions.' }];
    timers.current = sample.map((log, index) => setTimeout(() => {
      setLogs(previous => [...previous, log]);
      if (index === sample.length - 1) setRunning(false);
    }, (index + 1) * 500));
  };

  return (
    <RoleActivityFrame exercise={exercise} onComplete={onComplete} toolbar={<button type="button" disabled={running} onClick={runSample} className="min-h-11 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"><Play className="mr-2 inline h-4 w-4" />{running ? 'Playing sample…' : 'Run sample analysis'}</button>}>
      <AgentTerminalLog logs={logs} isStreaming={running} />
      {exercise?.roleSpecificData && <details className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"><summary className="cursor-pointer text-sm font-semibold">Inspect the example data</summary><pre className="mt-4 max-h-80 overflow-auto text-xs leading-6">{JSON.stringify(exercise.roleSpecificData, null, 2)}</pre></details>}
    </RoleActivityFrame>
  );
}
