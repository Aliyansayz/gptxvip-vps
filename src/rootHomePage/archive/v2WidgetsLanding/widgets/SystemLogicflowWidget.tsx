import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  GitBranch,
  SlidersHorizontal,
} from 'lucide-react';
import { seed as taxiSeed } from '../../../../prototype/taxi-demand-eda-agent/data/sampleTaxiData';
import {
  computeChartSeries,
  computeKpiStats,
  filterRideRecords,
} from '../../../../prototype/taxi-demand-eda-agent/workflow/edaEngine';
import { seed as saasSeed } from '../../../../prototype/saas-metrics-kit/data';
import { seed as ledgerSeed } from '../../../../prototype/ledgerline/data';
import { closing as ledgerClosing } from '../../../../prototype/ledgerline/formulas';
import { seed as crmSeed } from '../../../../prototype/orbit-crm/data';
import { forecast as crmForecast } from '../../../../prototype/orbit-crm/formulas';
import { getPrototypeUrl } from '../../../../prototype/registry';
import { Reveal } from '../../../../shared/components/Reveal';

export interface SystemLogicflowWidgetProps {
  onRequestAdaptation: (surfaceName: string, note?: string) => void;
}

const SYSTEM_STAGES = [
  {
    step: '01',
    title: 'Ingest & Validate',
    module: 'csvParser / data contracts',
    input: 'CSV, ledger postings, or CRM/API payloads',
    transform: 'Strict type validation, currency separation & timestamp normalization',
    output: 'Clean domain records',
  },
  {
    step: '02',
    title: 'Scope & Slice',
    module: 'filterRideRecords() / planFilter',
    input: 'User horizon, account, or plan filter',
    transform: 'Filters active cohorts, currencies, weather, or pipeline stages',
    output: 'Deterministic slice window',
  },
  {
    step: '03',
    title: 'Formula Engine',
    module: 'formulas.ts / computeKpiStats()',
    input: 'Scoped ledger & event rows',
    transform: 'Computes MRR bridges, weighted forecasts, closing balances, or KPI deltas',
    output: 'Auditable numeric vectors',
  },
  {
    step: '04',
    title: 'Intent & Routing',
    module: 'runComputationalAnalysis()',
    input: 'Operator query or workflow trigger',
    transform: 'Maps user intent to deterministic analytical branches or agent rules',
    output: 'Targeted action branch',
  },
  {
    step: '05',
    title: 'Chart & Brief Synthesis',
    module: 'Visual Widgets + Report Builder',
    input: 'Aggregated series + branch state',
    transform: 'Renders SVG chart widgets, executive findings, and CSV/print outputs',
    output: 'Interactive surface view',
  },
  {
    step: '06',
    title: 'HITL & Audit Trail',
    module: 'Approval Gate + Audit Log',
    input: 'Proposed dispatch, refund, or triage action',
    transform: 'Records actor, timestamp, and before/after diff prior to mutation',
    output: 'Verified operational state',
  },
] as const;

type EngineMode = 'systems' | 'agents';
type SeasonChoice = 'All' | 'Winter' | 'Summer';
type WeatherChoice = 'All' | 'Snowy' | 'Clear';
type PlanFilter = 'All' | 'Scale' | 'Growth' | 'Starter';

export const SystemLogicflowWidget: React.FC<SystemLogicflowWidgetProps> = ({
  onRequestAdaptation,
}) => {
  const [activeStageIdx, setActiveStageIdx] = useState(2);
  const [engineMode, setEngineMode] = useState<EngineMode>('systems');
  const [season, setSeason] = useState<SeasonChoice>('All');
  const [weather, setWeather] = useState<WeatherChoice>('All');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('All');

  const filtered = useMemo(
    () =>
      filterRideRecords(taxiSeed.records, {
        season,
        weather,
        dayType: 'All',
      }),
    [season, weather],
  );
  const kpis = useMemo(() => computeKpiStats(filtered, taxiSeed.records), [filtered]);
  const series = useMemo(() => computeChartSeries(filtered), [filtered]);
  const maxHourly = useMemo(
    () => Math.max(1, ...series.hourlyData.map((row) => Number(row['Overall Average'] || 0))),
    [series.hourlyData],
  );

  const scopedSubs = useMemo(
    () =>
      planFilter === 'All'
        ? saasSeed.subscriptions
        : saasSeed.subscriptions.filter((s) => s.plan === planFilter),
    [planFilter],
  );
  const activeMrr = scopedSubs
    .filter((s) => s.status !== 'churned')
    .reduce((sum, s) => sum + s.monthlyCents, 0);
  const usdAccount = ledgerSeed.accounts[0];
  const usdClosing = ledgerClosing(usdAccount, ledgerSeed.entries);
  const crmTotals = crmForecast(crmSeed.deals);

  const activeStage = SYSTEM_STAGES[activeStageIdx];

  return (
    <section
      id="system-logicflow"
      className="border-b border-slate-200 bg-[#F8FAFC] py-14 sm:py-16"
      aria-labelledby="system-logicflow-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0369A1]">
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                02 / System &amp; Agent Engine Architecture
              </span>
              <h2
                id="system-logicflow-heading"
                className="text-2xl font-medium leading-[1.06] tracking-[-0.04em] text-[#0F172A] sm:text-4xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Deterministic system math paired with{' '}
                <span className="text-[#0284C7]">
                  verifiable agent loops.
                </span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-base leading-relaxed text-slate-600">
              Every financial system and telemetry agent runs on typed formulas and explicit human approval boundaries.
            </p>
          </div>
        </Reveal>

        {/* 6-Stage Interactive Pipeline Strip */}
        <div
          className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6"
          role="tablist"
          aria-label="System and agent execution stages"
        >
          {SYSTEM_STAGES.map((stage, idx) => {
            const selected = idx === activeStageIdx;
            return (
              <button
                key={stage.step}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveStageIdx(idx)}
                className={`group flex cursor-pointer flex-col rounded-xl border p-3.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                  selected
                    ? 'border-[#14B8A6] bg-[#0B131E] text-white shadow-md'
                    : 'border-slate-200 bg-white text-[#0F172A] hover:border-[#38BDF8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      selected
                        ? 'bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                        : 'bg-[#CCFBF1] text-[#0F766E]'
                    }`}
                  >
                    {stage.step}
                  </span>
                  <Cpu
                    className={`h-3.5 w-3.5 ${selected ? 'text-[#5EEAD4]' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="mt-2.5 text-xs font-bold leading-snug"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stage.title}
                </span>
                <span
                  className={`mt-1 truncate font-mono text-[10px] ${
                    selected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.module}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lower Split: Stage Contract + Dual-Engine Live Recalculation */}
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          {/* Left: Stage Contract Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700/60 bg-[#0B131E] p-5 text-white shadow-lg lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                  Stage {activeStage.step} Contract
                </span>
                <span className="rounded-full border border-[#38BDF8]/30 bg-[#0EA5E9]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#38BDF8]">
                  {activeStage.module}
                </span>
              </div>

              <h3
                className="mt-4 text-xl font-medium tracking-[-0.025em] text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {activeStage.title}
              </h3>

              <dl className="mt-4 space-y-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    Input Schema
                  </dt>
                  <dd className="mt-1 font-medium text-white">{activeStage.input}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                    Deterministic Transform
                  </dt>
                  <dd className="mt-1 leading-relaxed text-slate-200">
                    {activeStage.transform}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-300">
                    Output Artifact
                  </dt>
                  <dd className="mt-1 font-medium text-white">{activeStage.output}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <a
                href={getPrototypeUrl(engineMode === 'systems' ? 'saas-metrics-kit' : 'taxi-demand-eda-agent')}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
              >
                <span>
                  Open {engineMode === 'systems' ? 'Ledger Engine' : 'Agent Logicflow'}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#5EEAD4]" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() =>
                  onRequestAdaptation(
                    engineMode === 'systems'
                      ? 'Deterministic Business System Engine'
                      : 'Agent & Telemetry Logicflow',
                    `We want to wire a 6-stage deterministic ${engineMode === 'systems' ? 'system formula engine' : 'agent pipeline'} (starting at ${activeStage.title}) to our internal datasets.`,
                  )
                }
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] px-4 py-2 text-xs font-bold text-[#0B131E] transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Connect Data</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right: Live Engine Recalculation (Business Systems OR Agent Telemetry) */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CCFBF1] text-[#0F766E]">
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3
                      className="text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Live Engine Recalculation
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Switch between Business Systems math and Agent Telemetry EDA.
                    </p>
                  </div>
                </div>

                {/* Engine Mode Switch */}
                <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
                  <button
                    type="button"
                    aria-pressed={engineMode === 'systems'}
                    onClick={() => setEngineMode('systems')}
                    className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                      engineMode === 'systems'
                        ? 'bg-gradient-to-r from-[#0D9488] to-[#0284C7] text-white'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    Business Systems
                  </button>
                  <button
                    type="button"
                    aria-pressed={engineMode === 'agents'}
                    onClick={() => setEngineMode('agents')}
                    className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                      engineMode === 'agents'
                        ? 'bg-[#0B131E] text-[#5EEAD4]'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    Agent Telemetry
                  </button>
                </div>
              </div>

              {engineMode === 'systems' ? (
                <>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-xs font-semibold text-slate-600">
                      Filter SaaS Subscription Tier:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(['All', 'Scale', 'Growth', 'Starter'] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          aria-pressed={planFilter === tier}
                          onClick={() => setPlanFilter(tier)}
                          className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                            planFilter === tier
                              ? 'border-[#0D9488] bg-[#0D9488] text-white'
                              : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#2DD4BF]'
                          }`}
                        >
                          {tier === 'All' ? 'All Plans' : tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Live System KPI Cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-teal-200/70 bg-[#F0FDFA] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                        Scoped MRR
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#0F766E]">
                        ${Math.round(activeMrr / 100).toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-teal-700/80">
                        {scopedSubs.length} accounts
                      </p>
                    </div>
                    <div className="rounded-xl border border-sky-200/70 bg-[#F0F9FF] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0369A1]">
                        USD Closing
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#0369A1]">
                        ${Math.round(usdClosing / 100).toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-sky-700/80">Ledgerline balance</p>
                    </div>
                    <div className="rounded-xl border border-violet-200/70 bg-[#F5F3FF] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6D28D9]">
                        CRM Weighted
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#6D28D9]">
                        ${Math.round(crmTotals.weighted / 100).toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-violet-700/80">Orbit forecast</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50 p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Closed Won
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-emerald-700">
                        ${Math.round(crmTotals.won / 100).toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-emerald-700/80">booked value</p>
                    </div>
                  </div>

                  {/* Account Breakdown Horizontal Bullet Bars (Zero Baseline + Quota Target) */}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0F172A]">
                        Account Monthly Value vs $500 Target
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Zero-base Â· Plan: {planFilter}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      {scopedSubs.map((sub) => {
                        const pct = sub.monthlyCents / 79900;
                        const targetLeft = (50000 / 79900) * 100;
                        return (
                          <div key={sub.id} className="grid grid-cols-[110px_1fr_72px] items-center gap-2 text-xs">
                            <span className="truncate font-medium text-[#0F172A]">
                              {sub.account} <span className="text-[10px] text-slate-500">({sub.plan})</span>
                            </span>
                            <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full origin-left rounded-full ${
                                  sub.status === 'churned'
                                    ? 'bg-[#F43F5E]'
                                    : sub.status === 'past_due'
                                      ? 'bg-[#38BDF8]'
                                      : 'bg-[#10B981]'
                                }`}
                                style={{ transform: `scaleX(${pct})` }}
                              />
                              <span
                                aria-hidden="true"
                                className="absolute inset-y-0 w-0.5 bg-[#64748B]"
                                style={{ left: `${targetLeft}%` }}
                              />
                            </div>
                            <span className="text-right font-mono text-[11px] font-bold tabular-nums text-[#0F172A]">
                              ${Math.round(sub.monthlyCents / 100)}/mo
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {(['All', 'Winter', 'Summer'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={season === item}
                        onClick={() => setSeason(item)}
                        className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${
                          season === item
                            ? 'border-[#0D9488] bg-[#0D9488] text-white'
                            : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#2DD4BF]'
                        }`}
                      >
                        {item === 'All' ? 'All Seasons' : item}
                      </button>
                    ))}
                    <span className="mx-0.5 text-slate-300" aria-hidden="true">|</span>
                    {(['All', 'Snowy', 'Clear'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={weather === item}
                        onClick={() => setWeather(item)}
                        className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                          weather === item
                            ? 'border-[#0284C7] bg-[#0284C7] text-white'
                            : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#38BDF8]'
                        }`}
                      >
                        {item === 'All' ? 'Any Weather' : item}
                      </button>
                    ))}
                  </div>

                  {/* 4 Deterministic KPI Cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-teal-200/70 bg-[#F0FDFA] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                        Total Rides
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#0F766E]">
                        {kpis.totalRides.toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[10px] text-teal-700/80 tabular-nums">
                        {kpis.activeIntervals} intervals
                      </p>
                    </div>
                    <div className="rounded-xl border border-sky-200/70 bg-[#F0F9FF] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0369A1]">
                        Avg Fare
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#0369A1]">
                        ${kpis.avgFare.toFixed(2)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-sky-700/80">per trip</p>
                    </div>
                    <div className="rounded-xl border border-violet-200/70 bg-[#F5F3FF] p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6D28D9]">
                        Avg Duration
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#6D28D9]">
                        {kpis.avgDuration.toFixed(1)}m
                      </p>
                      <p className="mt-0.5 text-[10px] text-violet-700/80">congestion index</p>
                    </div>
                    <div className="rounded-xl border border-rose-200/70 bg-rose-50 p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-700">
                        Holiday Delta
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-rose-700">
                        {kpis.holidayDifference > 0 ? '+' : ''}
                        {kpis.holidayDifference.toFixed(1)}%
                      </p>
                      <p className="mt-0.5 text-[10px] text-rose-700/80">vs workdays</p>
                    </div>
                  </div>

                  {/* Crisp Pure-CSS Hourly Distribution Bar Visualizer */}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0F172A]">
                        Hourly Demand Distribution (Avg Rides / Slot)
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {filtered.length === 0 ? 'No matching slice' : `${season} Â· ${weather}`}
                      </span>
                    </div>

                    {filtered.length === 0 ? (
                      <div className="flex h-28 items-center justify-center text-xs text-slate-500">
                        No snowy intervals occur in Summer â€” switch to Winter or Any Weather.
                      </div>
                    ) : (
                      <div className="mt-3 grid h-28 grid-cols-5 items-end gap-3 border-b border-[#64748B]/40 pb-1 pt-4">
                        {series.hourlyData.map((row) => {
                          const val = Number(row['Overall Average'] || 0);
                          const scaleY = val / maxHourly;
                          const isPeak = val === maxHourly && val > 0;
                          return (
                            <div key={row.hour} className="flex h-full flex-col items-center justify-end gap-1.5">
                              <span className="font-mono text-[10px] font-bold tabular-nums text-slate-600">
                                {val}
                              </span>
                              <div className="flex h-full w-full flex-1 items-end overflow-hidden rounded-t-sm">
                                <div
                                  className={`h-full w-full origin-bottom rounded-t-sm transition-[transform,background-color] duration-200 ease-out ${
                                    isPeak ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                                  }`}
                                  style={{ transform: `scaleY(${scaleY})` }}
                                  title={`${row.hour}: ${val} avg rides`}
                                />
                              </div>
                              <span className="font-mono text-[10px] text-slate-500">
                                {row.hour}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemLogicflowWidget;
