import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Play,
  Terminal,
  Wallet,
} from 'lucide-react';
import { seed } from '../../../../prototype/taxi-demand-eda-agent/data/sampleTaxiData';
import { getPrototypeUrl, type PrototypeId } from '../../../../prototype/registry';
import { SurfaceChartWidget } from './SurfaceChartWidget';

export interface HeroAgentSurfaceWidgetProps {
  onRequestAdaptation: (surfaceName: string, note?: string) => void;
}

type WorkbenchTab = 'analytics' | 'ledger' | 'agents';

interface StreamEvent {
  id: string;
  time: string;
  agent: string;
  tone: string;
  text: string;
}

const INITIAL_STREAM: StreamEvent[] = [
  {
    id: 'e-1',
    time: '10:42:01',
    agent: 'TAXI DEMAND',
    tone: 'text-[#5EEAD4] border-[#2DD4BF]/35 bg-[#2DD4BF]/10',
    text: 'Parsed 180 hourly intervals. Computed Winter vs Summer climate friction regression.',
  },
  {
    id: 'e-2',
    time: '10:42:04',
    agent: 'RECON AGENT',
    tone: 'text-[#38BDF8] border-[#0EA5E9]/35 bg-[#0EA5E9]/10',
    text: 'ASN-3912 lookup complete: mapped api-v2.target.io and admin-staging.target.io.',
  },
  {
    id: 'e-3',
    time: '10:42:08',
    agent: 'ANALYZER',
    tone: 'text-violet-300 border-violet-400/35 bg-violet-500/15',
    text: 'Correlated exposed bundle token + parameter IDOR -> Risk 92%. Paused for human sign-off.',
  },
];

const STREAM_POOL: Omit<StreamEvent, 'id' | 'time'>[] = [
  {
    agent: 'DISPATCH HITL',
    tone: 'text-emerald-300 border-emerald-400/35 bg-emerald-500/15',
    text: 'Rerouted 4 at-risk deliveries around East Corridor congestion (+6.2% on-time lift).',
  },
  {
    agent: 'SCANNER',
    tone: 'text-rose-300 border-rose-400/35 bg-rose-500/15',
    text: 'AST pass flagged unescaped eval() in auth-helper.chunk.js:412 -> patch brief drafted.',
  },
  {
    agent: 'TAXI DEMAND',
    tone: 'text-[#5EEAD4] border-[#2DD4BF]/35 bg-[#2DD4BF]/10',
    text: 'Recalculated 17:00 rush surge coefficient -> elevated snowy-day fare elasticity verified.',
  },
  {
    agent: 'ANALYZER',
    tone: 'text-[#38BDF8] border-[#0EA5E9]/35 bg-[#0EA5E9]/10',
    text: 'Triaged /v1/graphql deleteTenant mutation -> priority elevated to Critical (94% confidence).',
  },
];

const TAB_CONFIG: Record<
  WorkbenchTab,
  { label: string; shortLabel: string; prototype: PrototypeId; surfaceName: string; icon: React.ElementType }
> = {
  analytics: {
    label: 'Analytics',
    shortLabel: 'Analytics',
    prototype: 'pulse-analytics',
    surfaceName: 'Pulse Analytics',
    icon: BarChart3,
  },
  ledger: {
    label: 'Cash Flow',
    shortLabel: 'Cash Flow',
    prototype: 'ledgerline',
    surfaceName: 'Ledgerline',
    icon: Wallet,
  },
  agents: {
    label: 'Agent Stream',
    shortLabel: 'Agents',
    prototype: 'taxi-demand-eda-agent',
    surfaceName: 'Taxi Demand EDA Agent',
    icon: Terminal,
  },
};

export const HeroAgentSurfaceWidget: React.FC<HeroAgentSurfaceWidgetProps> = ({
  onRequestAdaptation,
}) => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('analytics');
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>(INITIAL_STREAM);
  const [stepCounter, setStepCounter] = useState(0);

  const emitNextEvent = () => {
    const template = STREAM_POOL[stepCounter % STREAM_POOL.length];
    const ts = new Date().toTimeString().slice(0, 8);
    setStreamEvents((prev) => [
      { id: `live-${Date.now()}-${stepCounter}`, time: ts, ...template },
      ...prev.slice(0, 2),
    ]);
    setStepCounter((count) => count + 1);
  };

  const activeMeta = TAB_CONFIG[activeTab];

  return (
    <div
      className="relative rounded-2xl border border-white/12 bg-[#0F172A]/90 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.45)] sm:p-5"
      role="region"
      aria-label="Live Systems and Agent Surface preview"
    >
      {/* Calm Header (noise reduced: no decorative dots or competing pills) */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <span className="font-mono text-xs font-medium text-slate-300">
          Live Surface Preview
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-[#5EEAD4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" aria-hidden="true" />
          Interactive
        </span>
      </div>

      {/* Single-Tier 3-Tab Switcher (Hick's & Fitts's Law: min-h-11, single choice layer) */}
      <div
        className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
        role="tablist"
        aria-label="System and agent widget views"
      >
        {(Object.keys(TAB_CONFIG) as WorkbenchTab[]).map((tabId) => {
          const item = TAB_CONFIG[tabId];
          const Icon = item.icon;
          const active = activeTab === tabId;
          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tabId)}
              className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                active
                  ? 'bg-[#2DD4BF] text-[#0B131E] shadow-xs'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden truncate sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="mt-4 min-h-[256px]">
        {activeTab !== 'agents' ? (
          <SurfaceChartWidget prototype={activeMeta.prototype} compact />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 font-mono">
                <Activity className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
                <span>4 archetypes Â· {seed.records.length} intervals</span>
              </span>
              <button
                type="button"
                onClick={emitNextEvent}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-[#38BDF8]/40 bg-[#0EA5E9]/15 px-3.5 py-2 font-mono text-xs font-semibold text-[#38BDF8] transition-[background-color,transform] duration-150 ease-out hover:bg-[#0EA5E9]/25 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                <span>Trigger Step</span>
              </button>
            </div>

            <div className="space-y-2.5" aria-live="polite">
              {streamEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-[border-color,background-color] duration-150 ease-out hover:border-[#2DD4BF]/35"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${event.tone}`}
                    >
                      {event.agent}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-slate-400">
                      {event.time}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-200">
                    {event.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conversion Footer (Fitts's Law: min-h-11 targets, quiet secondary hierarchy) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
        <a
          href={getPrototypeUrl(activeMeta.prototype)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-200 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
        >
          <span>Open {activeMeta.surfaceName}</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#5EEAD4]" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() =>
            onRequestAdaptation(
              activeMeta.surfaceName,
              `I tested the live ${activeMeta.surfaceName} widget on the landing page and want to discuss adapting this system for our workflow.`,
            )
          }
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 px-4 py-2 text-xs font-semibold text-[#5EEAD4] transition-[background-color,border-color,transform] duration-150 ease-out hover:border-[#2DD4BF]/70 hover:bg-[#2DD4BF]/20 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
        >
          <span>Adapt Surface</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default HeroAgentSurfaceWidget;
