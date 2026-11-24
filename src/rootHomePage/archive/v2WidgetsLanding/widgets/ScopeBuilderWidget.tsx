import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Code2, Layers, ShieldCheck } from 'lucide-react';
import { templates } from '../../../../devLushArea/agentMarketplace/data/templates';

export interface ScopeSelection {
  surface: string;
  dataSource: string;
  governance: string;
  brief: string;
}

export interface ScopeBuilderWidgetProps {
  onApplyScope: (selection: ScopeSelection) => void;
}

const SURFACE_OPTIONS = [
  'Analytics & BI System',
  'Finance & SaaS Ledger',
  'Ops, CRM & Dispatch',
  'Agent & Automation System',
] as const;

const DATA_OPTIONS = [
  'SQL / Data Warehouse',
  'REST / GraphQL APIs',
  'CRM / ERP / Stripe',
  'CSV & Internal Logs',
] as const;

const GOVERNANCE_OPTIONS = [
  'Deterministic System Rules',
  'Human-in-the-Loop Agent',
  'Hybrid System + Copilot',
] as const;

export const ScopeBuilderWidget: React.FC<ScopeBuilderWidgetProps> = ({
  onApplyScope,
}) => {
  const [surface, setSurface] = useState<string>(SURFACE_OPTIONS[0]);
  const [dataSource, setDataSource] = useState<string>(DATA_OPTIONS[0]);
  const [governance, setGovernance] = useState<string>(GOVERNANCE_OPTIONS[0]);
  const [applied, setApplied] = useState(false);

  const buildBrief = (s: string, d: string, g: string) =>
    `Starting surface: ${s}\nPrimary data source: ${d}\nExecution model: ${g}\n\nGoal: Adapt this interactive system/agent surface for our team workflow and review architecture options.`;

  const triggerApply = (s: string, d: string, g: string) => {
    const brief = buildBrief(s, d, g);
    onApplyScope({ surface: s, dataSource: d, governance: g, brief });
    setApplied(true);
    window.setTimeout(() => setApplied(false), 1800);
  };

  const pillClass = (selected: boolean) =>
    `min-h-11 cursor-pointer rounded-xl border px-3.5 py-2 text-left text-xs font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
      selected
        ? 'border-transparent bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E] shadow-xs'
        : 'border-white/15 bg-white/[0.06] text-slate-200 hover:border-[#2DD4BF]/50 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
          <span>04 / Scope Your System or Agent</span>
        </div>
        <h2
          id="contact-heading"
          className="mt-3 text-2xl font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Configure your brief in{' '}
          <span className="text-[#5EEAD4]">
            3 clicks.
          </span>
        </h2>
        <p className="mt-2.5 max-w-[54ch] text-base leading-relaxed text-slate-300">
          Pick your closest starting system, data source, and execution model to pre-fill your technical brief for{' '}
          <a
            href="mailto:hello@gptx.vip"
            className="font-mono text-[#5EEAD4] underline underline-offset-4 hover:text-[#38BDF8]"
          >
            hello@gptx.vip
          </a>
          .
        </p>
      </div>

      {/* 3-Step Interactive Scope Pills */}
      <div className="space-y-4 rounded-2xl border border-[#2DD4BF]/20 bg-[#0B131E]/80 p-4 sm:p-5">
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
            1. Closest starting surface
          </p>
          <div className="flex flex-wrap gap-2">
            {SURFACE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={surface === option}
                onClick={() => {
                  setSurface(option);
                  triggerApply(option, dataSource, governance);
                }}
                className={pillClass(surface === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
            2. Primary data source
          </p>
          <div className="flex flex-wrap gap-2">
            {DATA_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={dataSource === option}
                onClick={() => {
                  setDataSource(option);
                  triggerApply(surface, option, governance);
                }}
                className={pillClass(dataSource === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-violet-300">
            3. Execution &amp; control model
          </p>
          <div className="flex flex-wrap gap-2">
            {GOVERNANCE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={governance === option}
                onClick={() => {
                  setGovernance(option);
                  triggerApply(surface, dataSource, option);
                }}
                className={pillClass(governance === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
            <span>
              {applied ? 'Brief synced to inquiry form' : 'Clicking any option updates your brief'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => triggerApply(surface, dataSource, governance)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/15 px-4 py-2 text-xs font-bold text-[#5EEAD4] transition-[background-color,transform] duration-150 ease-out hover:bg-[#2DD4BF]/25 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
          >
            <span>Load Brief</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Verifiable Delivery Proof Strip */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 p-3">
          <Layers className="h-4 w-4 text-[#5EEAD4]" aria-hidden="true" />
          <p className="mt-1.5 text-xs font-bold text-white">
            {templates.length} Live Surfaces
          </p>
          <p className="mt-0.5 text-[11px] text-slate-300">
            Testable right in the browser before commitment.
          </p>
        </div>
        <div className="rounded-xl border border-[#38BDF8]/25 bg-[#0EA5E9]/10 p-3">
          <Code2 className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
          <p className="mt-1.5 text-xs font-bold text-white">
            Source-Owned Build
          </p>
          <p className="mt-0.5 text-[11px] text-slate-300">
            Clean React + TypeScript architecture with no lock-in.
          </p>
        </div>
        <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-3">
          <div className="flex items-center gap-1.5 text-violet-300">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="mt-1.5 text-xs font-bold text-white">
            Direct Builder Reply
          </p>
          <p className="mt-0.5 text-[11px] text-slate-300">
            Answered directly within 1 business day â€” no sales queue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScopeBuilderWidget;
