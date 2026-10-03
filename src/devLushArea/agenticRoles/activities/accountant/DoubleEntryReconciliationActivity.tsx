import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Scale } from 'lucide-react';

export const DoubleEntryReconciliationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isReconciling, setIsReconciling] = useState(false);
  const [balanceTilt, setBalanceTilt] = useState(0); // 0 = perfectly level

  const entries = [
    { id: "JE-01", account: "Accounts Receivable (EUR)", debit: 10500, credit: 0, verified: true },
    { id: "JE-02", account: "Cash - Silicon Valley Bank", debit: 11000, credit: 0, verified: true },
    { id: "JE-03", account: "Realized FX Gain", debit: 0, credit: 500, verified: true }
  ];

  const handleReconcile = () => {
    setIsReconciling(true);
    setBalanceTilt(8); // simulate initial wobble
    toast.info("Reconciling multi-currency general ledger invariants...");

    setTimeout(() => {
      setBalanceTilt(-4);
      setTimeout(() => {
        setBalanceTilt(0);
        setIsReconciling(false);
        toast.success("Ledger Balanced! Debits = Credits = $11,000.00 USD (Invariant Verified).");
      }, 400);
    }, 500);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleReconcile}
            disabled={isReconciling}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            {isReconciling ? 'Balancing...' : 'Run Auto-Reconciler'}
          </button>}>

    {/* Animated SVG Balance Scale HUD */}
    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm text-center space-y-2 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Double-Entry Balance Equilibrium Scale</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">DEBITS = CREDITS = $11,000</span>
      </div>

      <div className="h-[120px] flex items-center justify-center relative">
        <svg className="w-64 h-24" viewBox="0 0 240 90">
          {/* Stand Pillar */}
          <rect x="116" y="20" width="8" height="60" fill="#475569" rx="2" />
          <rect x="90" y="76" width="60" height="8" fill="#334155" rx="3" />
          <circle cx="120" cy="20" r="6" fill="#F59E0B" />

          {/* Rotating Beam */}
          <g
            style={{
              transformOrigin: '120px 20px',
              transform: `rotate(${balanceTilt}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <rect x="30" y="18" width="180" height="4" fill="#F59E0B" rx="2" />
            {/* Left Pan (Debits) */}
            <line x1="45" y1="20" x2="45" y2="48" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 25,48 Q 45,58 65,48 Z" fill="#059669" />
            {/* Right Pan (Credits) */}
            <line x1="195" y1="20" x2="195" y2="48" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 175,48 Q 195,58 215,48 Z" fill="#06B6D4" />
          </g>
        </svg>
      </div>
    </div>

    {/* Journal Entries List */}
    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2 shadow-sm">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>General Ledger Journal Entries</span>
        <span className="text-amber-700 dark:text-amber-400">Base: USD</span>
      </div>
      {entries.map((entry) => (
        <div key={entry.id} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="space-y-0.5">
            <span className="font-mono text-slate-500 text-sm">{entry.id}</span>
            <div className="text-slate-900 dark:text-white font-medium">{entry.account}</div>
          </div>
          <div className="flex items-center gap-4 font-mono text-sm">
            <div className="text-right">
              <span className="text-sm text-slate-500 block">DEBIT</span>
              <span className={entry.debit > 0 ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-600"}>
                ${entry.debit.toLocaleString()}.00
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-500 block">CREDIT</span>
              <span className={entry.credit > 0 ? "text-cyan-700 dark:text-cyan-400 font-bold" : "text-slate-600"}>
                ${entry.credit.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    </RoleActivityFrame>
  );
};

export default DoubleEntryReconciliationActivity;
