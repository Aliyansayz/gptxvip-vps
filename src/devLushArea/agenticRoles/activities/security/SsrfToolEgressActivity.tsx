import React, { useState } from 'react';
import { Globe, Network, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

type ProbeCase = {
  id: string;
  label: string;
  initialUrl: string;
  redirectHop: string;
  resolvedIp: string;
  cidrRange: string;
  isInternal: boolean;
};

const PROBES: ProbeCase[] = [
  {
    id: 'imdsv1-redirect',
    label: '302 Redirect -> Cloud IMDS Metadata',
    initialUrl: 'https://partner-preview.example/doc',
    redirectHop: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/prod-role',
    resolvedIp: '169.254.169.254',
    cidrRange: '169.254.0.0/16 (Link-Local)',
    isInternal: true,
  },
  {
    id: 'dns-rebind-redis',
    label: 'DNS Rebinding -> Internal Redis',
    initialUrl: 'https://rebind-attacker.example/feed',
    redirectHop: 'None (A-record TTL=0 rebind)',
    resolvedIp: '127.0.0.1:6379',
    cidrRange: '127.0.0.0/8 (Loopback)',
    isInternal: true,
  },
  {
    id: 'safe-public',
    label: 'Legitimate Public Documentation',
    initialUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
    redirectHop: 'None',
    resolvedIp: '104.18.12.22',
    cidrRange: 'Public Unicast',
    isInternal: false,
  },
];

export const SsrfToolEgressActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedProbeId, setSelectedProbeId] = useState<string>('imdsv1-redirect');
  const [policyMode, setPolicyMode] = useState<'naive_regex' | 'socket_cidr_proxy'>('naive_regex');

  const probe = PROBES.find((p) => p.id === selectedProbeId) || PROBES[0];
  const blocked = policyMode === 'socket_cidr_proxy' && probe.isInternal;
  const leaked = policyMode === 'naive_regex' && probe.isInternal;

  const handleEnableSocketGuard = () => {
    setPolicyMode('socket_cidr_proxy');
    toast.success('Activated socket-level CIDR deny-list on all redirect hops + IMDSv2 hop-limit=1.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleEnableSocketGuard}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-500 cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Enable Socket CIDR Proxy
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Network className="h-4 w-4 text-red-600 dark:text-red-400" />
            Agent `fetch_url` Egress Firewall Simulator
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={policyMode === 'naive_regex'}
              onClick={() => setPolicyMode('naive_regex')}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                policyMode === 'naive_regex'
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              Naive URL Regex (`^https://`)
            </button>
            <button
              type="button"
              aria-pressed={policyMode === 'socket_cidr_proxy'}
              onClick={() => setPolicyMode('socket_cidr_proxy')}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                policyMode === 'socket_cidr_proxy'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              Socket CIDR Proxy + IMDSv2
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROBES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selectedProbeId === item.id}
              onClick={() => setSelectedProbeId(item.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                selectedProbeId === item.id
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 font-mono text-xs space-y-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-slate-500">1. Initial Tool URL</div>
            <div className="break-all font-bold text-slate-900 dark:text-white">{probe.initialUrl}</div>
            <div className="text-slate-500 pt-1">2. Redirect / DNS Resolution</div>
            <div className="break-all text-slate-700 dark:text-slate-300">{probe.redirectHop}</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3.5 font-mono text-xs space-y-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-slate-500">3. Resolved Socket IP & CIDR</div>
            <div className="font-bold text-slate-900 dark:text-white">
              {probe.resolvedIp} · <span className="text-slate-500">{probe.cidrRange}</span>
            </div>
            <div className="text-slate-500 pt-1">4. Egress Verdict</div>
            <div
              className={`inline-flex rounded-full px-2.5 py-0.5 font-bold ${
                leaked
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                  : blocked
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
              }`}
            >
              {leaked
                ? 'SSRF BREACH: Internal Metadata Exposed'
                : blocked
                  ? 'BLOCKED AT SOCKET DIALER (CIDR Deny-List)'
                  : 'ALLOWED: Verified Public Unicast'}
            </div>
          </div>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default SsrfToolEgressActivity;
