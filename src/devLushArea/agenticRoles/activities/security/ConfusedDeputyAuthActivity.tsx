import React, { useState } from 'react';
import { KeyRound, ShieldAlert, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

export const ConfusedDeputyAuthActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [tokenMode, setTokenMode] = useState<'shared_service_account' | 'user_obo_scoped_jwt'>('shared_service_account');
  const [rlsEnabled, setRlsEnabled] = useState(false);

  const crossTenantBlocked = tokenMode === 'user_obo_scoped_jwt' && rlsEnabled;

  const handleEnforceOboRls = () => {
    setTokenMode('user_obo_scoped_jwt');
    setRlsEnabled(true);
    toast.success('Propagated OAuth OBO user JWT and enforced Postgres Row-Level Security.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleEnforceOboRls}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-500 cursor-pointer"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Enforce OBO JWT + RLS
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
            <KeyRound className="h-4 w-4 text-red-600 dark:text-red-400" />
            MCP Tool Identity & Tenant Boundary Inspector
          </span>
          <span className="font-mono text-xs text-slate-500">
            Caller: `alice@tenant-a.io` → Target: `invoice #9941 (tenant-b)`
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">MCP Auth Token</span>
            <p className={`mt-1 text-sm font-bold font-mono ${tokenMode === 'user_obo_scoped_jwt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {tokenMode === 'user_obo_scoped_jwt' ? 'OBO JWT (tenant_id=tenant-a)' : 'BILLING_ADMIN_MASTER_KEY'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Postgres RLS Policy</span>
            <p className={`mt-1 text-sm font-bold font-mono ${rlsEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {rlsEnabled ? 'ENFORCED (tenant_id = jwt.tid)' : 'DISABLED (Table-Wide Read)'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Query Outcome</span>
            <p className={`mt-1 text-sm font-bold font-mono ${crossTenantBlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {crossTenantBlocked ? '403 / 0 Rows (Isolated)' : 'LEAKED: Tenant-B Invoice'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={tokenMode === 'shared_service_account'}
              onClick={() => setTokenMode('shared_service_account')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                tokenMode === 'shared_service_account'
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              Shared Service Account Key
            </button>
            <button
              type="button"
              aria-pressed={tokenMode === 'user_obo_scoped_jwt'}
              onClick={() => setTokenMode('user_obo_scoped_jwt')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                tokenMode === 'user_obo_scoped_jwt'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
              }`}
            >
              User OBO Scoped JWT
            </button>
          </div>

          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={rlsEnabled}
              onChange={(e) => setRlsEnabled(e.target.checked)}
              className="h-4 w-4 accent-red-600"
            />
            <span>Enforce Database Row-Level Security (RLS)</span>
          </label>
        </div>

        <div
          role="status"
          className={`flex items-start gap-2 rounded-lg p-3 text-xs leading-5 ${
            crossTenantBlocked
              ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border border-rose-500/30 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200'
          }`}
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {crossTenantBlocked
              ? 'Confused deputy eliminated: the MCP server and database deterministically bind the query to `tenant-a` via signed JWT claims.'
              : 'Confused deputy active: without both user-scoped OBO identity and database RLS, the agent can be tricked into reading cross-tenant rows.'}
          </span>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default ConfusedDeputyAuthActivity;
