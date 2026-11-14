import React, { useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

type MentionItem = {
  id: string;
  handle: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  botProbability: number;
  snippet: string;
};

const DEFAULT_MENTIONS: MentionItem[] = [
  { id: 'm1', handle: '@claire_ops', sentiment: 'negative', botProbability: 0.06, snippet: 'Checkout charged my card twice and threw a 502 error.' },
  { id: 'm2', handle: '@dev_marcus', sentiment: 'negative', botProbability: 0.09, snippet: 'Anyone else unable to complete orders right now? Support queue stuck.' },
  { id: 'm3', handle: '@promo_dealz_99', sentiment: 'neutral', botProbability: 0.89, snippet: 'Check bio for free crypto airdrop!!!' },
];

export const SocialListeningTriageActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [filterBots, setFilterBots] = useState(true);
  const [promoQueuePaused, setPromoQueuePaused] = useState(false);
  const [escalatedToHuman, setEscalatedToHuman] = useState(false);

  const listening = (currentExercise?.roleSpecificData as any)?.data?.listeningTriage;
  const mentions: MentionItem[] = listening?.mentions || DEFAULT_MENTIONS;
  const zScore = listening?.mentionVelocityZScore ?? 4.9;
  const negativePct = listening?.negativeSentimentPct ?? 78;
  const botRatio = listening?.botClusterRatio ?? 0.12;

  const visibleMentions = filterBots
    ? mentions.filter((m) => m.botProbability < 0.5)
    : mentions;

  const handleEnforceGuardrails = () => {
    setPromoQueuePaused(true);
    setEscalatedToHuman(true);
    toast.success('Paused 6 scheduled promo posts and escalated authentic incident brief to Comms Lead.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleEnforceGuardrails}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 cursor-pointer"
        >
          <PauseCircle className="h-3.5 w-3.5" />
          Pause Promos & Escalate
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-rose-500/40 bg-rose-50 p-3 dark:bg-rose-950/30">
            <span className="text-xs font-mono uppercase text-rose-700 dark:text-rose-300">Velocity Z-Score</span>
            <p className="mt-1 text-xl font-bold font-mono text-rose-700 dark:text-rose-400">+{zScore.toFixed(1)}σ</p>
            <span className="text-xs text-rose-600 dark:text-rose-300">Alert threshold: +3.0σ</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Negative Share</span>
            <p className="mt-1 text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{negativePct}%</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Trailing 15-min window</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Bot Cluster Ratio</span>
            <p className="mt-1 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {Math.round(botRatio * 100)}%
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Authentic customer spike</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              Live Brand Mention Triage
            </span>
            <button
              type="button"
              aria-pressed={filterBots}
              onClick={() => setFilterBots((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                filterBots
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              {filterBots ? 'Bot Spam Filtered' : 'Showing All Mentions'}
            </button>
          </div>

          <ul className="space-y-2.5">
            {visibleMentions.map((m) => (
              <li key={m.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{m.handle}</span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500">Bot prob: {Math.round(m.botProbability * 100)}%</span>
                    <span className={`rounded-full px-2 py-0.5 font-bold uppercase ${
                      m.sentiment === 'negative'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {m.sentiment}
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-slate-700 dark:text-slate-300">{m.snippet}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {promoQueuePaused ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
            <span>
              Scheduled Queue (6 promo posts):{' '}
              <strong className={promoQueuePaused ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                {promoQueuePaused ? 'AUTO-PAUSED' : 'ARMED (publishing in 20m)'}
              </strong>
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            Human Escalation: {escalatedToHuman ? 'Draft queued for Comms Lead approval' : 'Pending triage'}
          </span>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default SocialListeningTriageActivity;
