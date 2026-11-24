import React, { useMemo, useState } from 'react';
import type { PrototypeId } from '../../../../prototype/registry';
import { events as pulseEvents } from '../../../../prototype/pulse-analytics/data';
import { seed as ledgerSeed } from '../../../../prototype/ledgerline/data';
import { closing as ledgerClosing, signed as ledgerSigned } from '../../../../prototype/ledgerline/formulas';
import { seed as saasSeed } from '../../../../prototype/saas-metrics-kit/data';
import { seed as crmSeed, stages as crmStages } from '../../../../prototype/orbit-crm/data';
import { forecast as crmForecast } from '../../../../prototype/orbit-crm/formulas';
import { seed as fundSeed } from '../../../../prototype/fundview/data';
import { seed as chainSeed } from '../../../../prototype/chainpulse/data';
import { seed as adSeed } from '../../../../prototype/adsphere/data';
import { seed as storeSeed } from '../../../../prototype/storefront-pro/data';
import { seed as clinicSeed } from '../../../../prototype/clinicare/data';
import { seed as hqSeed } from '../../../../prototype/hq-admin/data';
import { seed as insightSeed } from '../../../../prototype/insight-boards/data';
import { analyticsData as pmAnalytics } from '../../../../prototype/project-management/data';
import { seed as taxiSeed } from '../../../../prototype/taxi-demand-eda-agent/data/sampleTaxiData';
import { computeChartSeries, filterRideRecords } from '../../../../prototype/taxi-demand-eda-agent/workflow/edaEngine';

export interface SurfaceChartWidgetProps {
  prototype: PrototypeId;
  compact?: boolean;
}

const fmtDollars = (cents: number) =>
  `$${Math.round(cents / 100).toLocaleString()}`;

export const SurfaceChartWidget: React.FC<SurfaceChartWidgetProps> = ({
  prototype,
  compact = false,
}) => {
  const [pulseChannel, setPulseChannel] = useState<'All' | 'Organic' | 'Paid'>('All');
  const [ledgerAcctId, setLedgerAcctId] = useState<'usd' | 'eur'>('usd');
  const [fundId, setFundId] = useState<'atlas' | 'cedar'>('atlas');
  const [chainAsset, setChainAsset] = useState<'ETH' | 'BTC'>('ETH');
  const [taxiWeather, setTaxiWeather] = useState<'All' | 'Snowy' | 'Clear'>('All');
  const [insightTenantId, setInsightTenantId] = useState<'north' | 'grove' | 'ember'>('north');
  const [pmView, setPmView] = useState<'velocity' | 'progress'>('velocity');

  const frameClass = `relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B131E] text-white ${
    compact ? 'min-h-[210px] p-3.5' : 'min-h-[236px] p-4'
  }`;

  const pillBtn = (active: boolean) =>
    `inline-flex min-h-9 cursor-pointer items-center rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
      active
        ? 'bg-[#2DD4BF] text-[#0B131E]'
        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
    }`;

  const taxiSeries = useMemo(() => {
    if (prototype !== 'taxi-demand-eda-agent') return null;
    const filtered = filterRideRecords(taxiSeed.records, {
      season: 'All',
      weather: taxiWeather,
      dayType: 'All',
    });
    return computeChartSeries(filtered);
  }, [prototype, taxiWeather]);

  if (prototype === 'pulse-analytics') {
    const scoped = pulseChannel === 'All'
      ? pulseEvents
      : pulseEvents.filter((e) => e.channel === pulseChannel);
    const steps = ['Visit', 'Signup', 'Activate', 'Purchase'] as const;
    const counts = steps.map((step) => ({
      step,
      users: new Set(scoped.filter((e) => e.event === step).map((e) => e.userId)).size,
    }));
    const topUsers = Math.max(1, counts[0]?.users || 1);
    const convRate = Math.round(((counts[3]?.users || 0) / topUsers) * 100);
    const targetConvRate = 30;

    return (
      <div className={frameClass} aria-label="Pulse Analytics activation funnel widget">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              Staged Bar Funnel Â· Target {targetConvRate}%
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {convRate}% Visit â†’ Purchase ({topUsers} users)
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['All', 'Organic', 'Paid'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                aria-pressed={pulseChannel === ch}
                onClick={() => setPulseChannel(ch)}
                className={pillBtn(pulseChannel === ch)}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Tufte Staged Bar Funnel: zero baseline, uniform series hue, direct delta labels */}
        <div className="my-auto space-y-2.5 pt-3">
          {counts.map((row, idx) => {
            const pct = Math.round((row.users / topUsers) * 100);
            const prevUsers = idx > 0 ? counts[idx - 1].users : row.users;
            const dropPct = idx > 0 && prevUsers > 0 ? Math.round(((row.users - prevUsers) / prevUsers) * 100) : 0;
            const ratio = row.users / topUsers;
            return (
              <div key={row.step} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-200">
                    0{idx + 1}. {row.step}
                    {dropPct < 0 && (
                      <span className="ml-1.5 font-mono text-[10px] text-[#F43F5E]">
                        {dropPct}%
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-bold tabular-nums text-white">
                    {row.users} <span className="text-slate-400">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full transition-transform duration-200 ease-out ${
                      idx === counts.length - 1 && convRate >= targetConvRate ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                    }`}
                    style={{ transform: `scaleX(${ratio})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'ledgerline') {
    const account = ledgerSeed.accounts.find((a) => a.id === ledgerAcctId) || ledgerSeed.accounts[0];
    const acctEntries = ledgerSeed.entries.filter((e) => e.accountId === account.id);
    const closingCents = ledgerClosing(account, ledgerSeed.entries);
    const credits = acctEntries.filter((e) => e.direction === 'credit').reduce((s, e) => s + e.amountCents, 0);
    const debits = acctEntries.filter((e) => e.direction === 'debit').reduce((s, e) => s + e.amountCents, 0);
    const sym = account.currency === 'EUR' ? 'â‚¬' : '$';
    const fmt = (c: number) => `${sym}${Math.round(c / 100).toLocaleString()}`;
    const bars = [
      { label: 'Opening', val: account.openingBalanceCents, display: fmt(account.openingBalanceCents), color: 'bg-[#64748B]' },
      { label: 'Credits', val: credits, display: `+${fmt(credits)}`, color: 'bg-[#10B981]' },
      { label: 'Debits', val: debits, display: `-${fmt(debits)}`, color: 'bg-[#F43F5E]' },
      { label: 'Closing', val: closingCents, display: fmt(closingCents), color: 'bg-[#38BDF8]' },
    ];
    const maxVal = Math.max(1, ...bars.map((b) => Math.abs(b.val)));

    return (
      <div className={frameClass} aria-label="Ledgerline cash-flow bridge widget">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              Cash-Flow Bridge Â· {account.currency}
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              Closing: {fmt(closingCents)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['usd', 'eur'] as const).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={ledgerAcctId === id}
                onClick={() => setLedgerAcctId(id)}
                className={pillBtn(ledgerAcctId === id)}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Zero-baseline semantic bridge pillars (no box gridlines, direct tabular labels) */}
        <div className="mt-3 grid h-28 grid-cols-4 items-end gap-3 border-b border-[#64748B]/40 pb-1 pt-2">
          {bars.map((bar) => {
            const scale = Math.abs(bar.val) / maxVal;
            return (
              <div key={bar.label} className="flex h-full flex-col items-center justify-end gap-1">
                <span className="font-mono text-[10px] font-bold tabular-nums text-slate-200">
                  {bar.display}
                </span>
                <div className="flex h-full w-full flex-1 items-end overflow-hidden rounded-t-sm">
                  <div
                    className={`h-full w-full origin-bottom rounded-t-sm transition-transform duration-200 ease-out ${bar.color}`}
                    style={{ transform: `scaleY(${scale})` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">{bar.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 font-mono text-[10px] text-slate-400">
          <span>{acctEntries.length} postings Â· zero-base</span>
          <span className="text-[#10B981]">Net delta: {fmt(acctEntries.reduce((s, e) => s + ledgerSigned(e), 0))}</span>
        </div>
      </div>
    );
  }

  if (prototype === 'saas-metrics-kit') {
    const activeMrr = saasSeed.subscriptions
      .filter((s) => s.status !== 'churned')
      .reduce((sum, s) => sum + s.monthlyCents, 0);
    const categories = ['new', 'expansion', 'contraction', 'churn'] as const;
    const deltas = categories.map((kind) => ({
      kind,
      val: saasSeed.movements
        .filter((m) => m.kind === kind)
        .reduce((n, m) => n + m.deltaCents, 0),
    }));
    const netDelta = deltas.reduce((s, d) => s + d.val, 0);
    const startCents = Math.max(0, activeMrr - netDelta);
    let running = startCents;
    const waterfall = [
      { label: 'Start', from: 0, to: startCents, val: startCents },
      ...deltas.map((d) => {
        const from = running;
        running += d.val;
        return { label: d.kind.slice(0, 6), from, to: running, val: d.val };
      }),
      { label: 'End', from: 0, to: activeMrr, val: activeMrr },
    ];
    const maxV = Math.max(1, ...waterfall.map((w) => Math.max(w.from, w.to)));

    return (
      <div className={frameClass} aria-label="SaaS Metrics Kit MRR movement bridge">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              MRR Waterfall Bridge
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              Active MRR: {fmtDollars(activeMrr)} / mo
            </p>
          </div>
          <span className="rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#5EEAD4]">
            5 Accounts
          </span>
        </div>

        <svg viewBox="0 0 420 120" className="mt-2 h-32 w-full" role="img" aria-label="MRR movement bridge chart">
          {/* Mandatory zero baseline + benchmark line */}
          <line x1="12" x2="408" y1="98" y2="98" stroke="#64748B" strokeOpacity="0.45" />
          <line
            x1="12"
            x2="408"
            y1={98 - (startCents / maxV) * 76}
            y2={98 - (startCents / maxV) * 76}
            stroke="#64748B"
            strokeDasharray="3 3"
            strokeOpacity="0.55"
          />
          {waterfall.map((b, i) => {
            const top = 98 - (Math.max(b.from, b.to) / maxV) * 76;
            const h = Math.max(2, (Math.abs(b.to - b.from) / maxV) * 76);
            const x = 18 + i * 65;
            const fill =
              b.val < 0
                ? '#F43F5E'
                : i === 0
                  ? '#64748B'
                  : i === waterfall.length - 1
                    ? '#38BDF8'
                    : '#10B981';
            return (
              <g key={b.label}>
                <rect x={x} y={top} width="46" height={h} rx="3" fill={fill} opacity={0.94} />
                <text x={x + 23} y={Math.max(12, top - 4)} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontFamily="monospace">
                  {b.val < 0
                    ? `-${fmtDollars(Math.abs(b.val))}`
                    : i > 0 && i < waterfall.length - 1
                      ? `+${fmtDollars(b.val)}`
                      : fmtDollars(b.val)}
                </text>
                <text x={x + 23} y="112" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (prototype === 'orbit-crm') {
    const totals = crmForecast(crmSeed.deals);
    const stageCounts = crmStages.slice(0, 4).map((stage) => {
      const items = crmSeed.deals.filter((d) => d.stage === stage);
      return {
        stage,
        count: items.length,
        cents: items.reduce((s, d) => s + d.valueCents, 0),
      };
    });
    const maxStage = Math.max(1, ...stageCounts.map((s) => s.cents));

    return (
      <div className={frameClass} aria-label="Orbit CRM weighted revenue forecast chart">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              Weighted Pipeline Funnel
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {fmtDollars(totals.weighted)} weighted Â· {fmtDollars(totals.raw)} open
            </p>
          </div>
          <span className="rounded-full border border-slate-500/40 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-300">
            {crmSeed.deals.length} deals
          </span>
        </div>

        {/* Uniform primary stage fill, semantic #10B981 strictly on Won, zero baseline */}
        <div className="my-auto space-y-2.5 pt-3">
          {stageCounts.map((item) => {
            const ratio = item.cents / maxStage;
            return (
              <div key={item.stage} className="grid grid-cols-[78px_1fr_64px] items-center gap-2 text-[11px]">
                <span className="font-mono capitalize text-slate-200">
                  {item.stage} ({item.count})
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full ${
                      item.stage === 'won' ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                    }`}
                    style={{ transform: `scaleX(${ratio})` }}
                  />
                </div>
                <span className="text-right font-mono font-bold tabular-nums text-white">
                  {fmtDollars(item.cents)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'fundview') {
    const pts = fundSeed.nav.filter((n) => n.fundId === fundId);
    const first = pts[0];
    const rows = pts.map((p) => ({
      period: p.period,
      nav: first?.navCents ? (p.navCents / first.navCents) * 100 : 100,
      bench: first?.benchmarkIndex ? (p.benchmarkIndex / first.benchmarkIndex) * 100 : 100,
    }));
    const min = Math.min(95, ...rows.flatMap((r) => [r.nav, r.bench]));
    const max = Math.max(110, ...rows.flatMap((r) => [r.nav, r.bench]));
    const x = (i: number) => 22 + (i * 356) / Math.max(1, rows.length - 1);
    const y = (v: number) => 96 - ((v - min) / Math.max(1, max - min)) * 74;
    const latest = rows.at(-1);
    const delta = latest ? latest.nav - latest.bench : 0;

    return (
      <div className={frameClass} aria-label="Fundview NAV versus benchmark chart">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              NAV vs Dashed Benchmark (Base 100)
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {latest?.nav.toFixed(1)}{' '}
              <span className={delta >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}>
                ({delta >= 0 ? '+' : ''}{delta.toFixed(1)} vs bench)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['atlas', 'cedar'] as const).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={fundId === id}
                onClick={() => setFundId(id)}
                className={pillBtn(fundId === id)}
              >
                {id === 'atlas' ? 'Atlas' : 'Cedar'}
              </button>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 400 116" className="mt-2 h-32 w-full" role="img" aria-label="Fund NAV performance line chart">
          <line x1="20" x2="380" y1={y(100)} y2={y(100)} stroke="#64748B" strokeOpacity="0.35" strokeDasharray="2 3" />
          <polyline
            fill="none"
            stroke="#64748B"
            strokeDasharray="4 4"
            strokeWidth="2"
            points={rows.map((r, i) => `${x(i)},${y(r.bench)}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="2.5"
            points={rows.map((r, i) => `${x(i)},${y(r.nav)}`).join(' ')}
          />
          {rows.map((r, i) => (
            <g key={r.period}>
              <circle cx={x(i)} cy={y(r.nav)} r="3.5" fill="#2DD4BF" />
              {(i === 0 || i === Math.floor(rows.length / 2) || i === rows.length - 1) && (
                <text x={x(i)} y="112" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                  {r.period}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (prototype === 'chainpulse') {
    const candles = chainSeed.candles[chainAsset] || [];
    const max = Math.max(...candles.map((c) => c.high));
    const min = Math.min(...candles.map((c) => c.low));
    const y = (v: number) => 12 + ((max - v) / Math.max(1, max - min)) * 78;
    const step = 360 / Math.max(1, candles.length);
    const last = candles.at(-1);

    return (
      <div className={frameClass} aria-label="ChainPulse OHLC candlestick chart">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              OHLC Market Terminal
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {chainAsset} ${last?.close.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['ETH', 'BTC'] as const).map((asset) => (
              <button
                key={asset}
                type="button"
                aria-pressed={chainAsset === asset}
                onClick={() => setChainAsset(asset)}
                className={pillBtn(chainAsset === asset)}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 380 112" className="mt-2 h-32 w-full" role="img" aria-label={`${chainAsset} candlestick chart`}>
          {/* Single reference close benchmark (stripped box gridlines per Data-Ink ratio) */}
          {last && (
            <line
              x1="10"
              x2="370"
              y1={y(last.close)}
              y2={y(last.close)}
              stroke="#64748B"
              strokeDasharray="3 3"
              strokeOpacity="0.45"
            />
          )}
          {candles.map((c, i) => {
            const up = c.close >= c.open;
            const color = up ? '#10B981' : '#F43F5E';
            const cx = 14 + step * (i + 0.5);
            return (
              <g key={c.time}>
                <line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1.5" />
                <rect
                  x={14 + step * (i + 0.2)}
                  y={Math.min(y(c.open), y(c.close))}
                  width={Math.max(4, step * 0.58)}
                  height={Math.max(3, Math.abs(y(c.close) - y(c.open)))}
                  rx="1"
                  fill={color}
                />
              </g>
            );
          })}
          <text x="14" y="106" fontSize="9" fill="#94a3b8" fontFamily="monospace">
            {candles[0]?.time.slice(5, 10)}
          </text>
          <text x="366" y="106" textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
            {last?.time.slice(5, 10)} Â· {candles.length} bars
          </text>
        </svg>
      </div>
    );
  }

  if (prototype === 'adsphere') {
    const channels = adSeed.campaigns.map((camp) => {
      const rows = adSeed.performance.filter((p) => p.campaignId === camp.id);
      const spend = rows.reduce((s, r) => s + r.spendCents, 0);
      const rev = rows.reduce((s, r) => s + r.revenueCents, 0);
      const roas = spend > 0 ? rev / spend : 0;
      return { name: camp.channel, roas, rev, spend, status: camp.status };
    });
    const targetRoas = 2.5;
    const maxRoas = Math.max(targetRoas, ...channels.map((c) => c.roas));

    return (
      <div className={frameClass} aria-label="AdSphere channel ROAS comparison widget">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              Channel ROAS vs {targetRoas.toFixed(1)}x Target
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {adSeed.campaigns.length} active channels tracked
            </p>
          </div>
          <span className="rounded-full border border-slate-500/40 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">
            Bullet Benchmark
          </span>
        </div>

        {/* Horizontal bullet bars: zero baseline, benchmark line, semantic beat/below coloring */}
        <div className="my-auto space-y-2.5 pt-3">
          {channels.map((ch) => {
            const beat = ch.roas >= targetRoas;
            return (
              <div key={ch.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white">
                    {ch.name}{' '}
                    <span className="font-mono text-[10px] text-slate-400">
                      ({fmtDollars(ch.rev)} rev)
                    </span>
                  </span>
                  <span className={`font-mono font-bold tabular-nums ${beat ? 'text-[#10B981]' : 'text-[#38BDF8]'}`}>
                    {ch.roas.toFixed(2)}x ROAS
                  </span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full ${beat ? 'bg-[#10B981]' : 'bg-[#38BDF8]'}`}
                    style={{ transform: `scaleX(${ch.roas / maxRoas})` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 w-0.5 bg-[#64748B]"
                    style={{ left: `${(targetRoas / maxRoas) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'storefront-pro') {
    const maxStock = Math.max(1, ...storeSeed.products.map((p) => p.stock));
    return (
      <div className={frameClass} aria-label="Storefront Pro inventory health chart">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              Inventory vs Reorder Target
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {storeSeed.products.filter((p) => p.stock <= p.reorderPoint).length} SKUs below reorder floor
            </p>
          </div>
          <span className="rounded-full border border-[#F43F5E]/35 bg-[#F43F5E]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F43F5E]">
            Stock Alert
          </span>
        </div>

        {/* Bullet bars with explicit reorder threshold tick (#64748B) & zero baseline */}
        <div className="my-auto space-y-2.5 pt-3">
          {storeSeed.products.map((prod) => {
            const low = prod.stock <= prod.reorderPoint;
            const thresholdLeft = Math.min(96, (prod.reorderPoint / maxStock) * 100);
            return (
              <div key={prod.id} className="grid grid-cols-[110px_1fr_54px] items-center gap-2 text-[11px]">
                <span className="truncate text-slate-200">{prod.name}</span>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full ${
                      low ? 'bg-[#F43F5E]' : 'bg-[#10B981]'
                    }`}
                    style={{ transform: `scaleX(${prod.stock / maxStock})` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 w-0.5 bg-[#64748B]"
                    style={{ left: `${thresholdLeft}%` }}
                  />
                </div>
                <span className="text-right font-mono text-[10px] font-bold tabular-nums text-white">
                  {prod.stock} / {prod.reorderPoint}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'project-management') {
    const bars = pmAnalytics.statsBar;
    const maxVal = Math.max(1, ...bars.map((b) => b.a + b.b));
    return (
      <div className={frameClass} aria-label="Project Management sprint velocity chart">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              {pmView === 'velocity' ? 'Sprint Throughput' : 'Delivery Gauge'}
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {pmView === 'velocity' ? '5-Week Task Velocity Â· zero-base' : '60% Milestone Progress'}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setPmView('velocity')} className={pillBtn(pmView === 'velocity')}>
              Velocity
            </button>
            <button type="button" onClick={() => setPmView('progress')} className={pillBtn(pmView === 'progress')}>
              Gauge
            </button>
          </div>
        </div>

        {pmView === 'velocity' ? (
          <div className="mt-3 grid h-28 grid-cols-5 items-end gap-2.5 border-b border-[#64748B]/40 pb-1 pt-2">
            {bars.map((b) => (
              <div key={b.name} className="flex h-full flex-col items-center justify-end gap-1">
                <span className="font-mono text-[9px] text-slate-200 tabular-nums">{b.a + b.b}</span>
                <div className="flex h-full w-full flex-1 items-end overflow-hidden rounded-t-sm">
                  <div
                    className="h-full w-full origin-bottom rounded-t-sm bg-[#38BDF8]"
                    style={{ transform: `scaleY(${(b.a + b.b) / maxVal})` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-slate-400">{b.name.replace('Week ', 'W')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-auto flex items-center justify-around pt-3">
            <svg viewBox="0 0 120 75" className="h-24 w-36" role="img" aria-label="60 percent completion gauge">
              <path d="M 15 65 A 45 45 0 0 1 105 65" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
              <path d="M 15 65 A 45 45 0 0 1 82 25" fill="none" stroke="#2DD4BF" strokeWidth="10" strokeLinecap="round" />
              <text x="60" y="62" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ffffff" fontFamily="monospace">
                60%
              </text>
            </svg>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-white">On Progress</p>
              <p className="font-mono text-[10px] text-slate-300">4 Active Workstreams</p>
              <p className="font-mono text-[10px] text-[#38BDF8]">Kanban + Analytics</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (prototype === 'insight-boards') {
    const tenant = insightSeed.tenants.find((t) => t.id === insightTenantId) || insightSeed.tenants[0];
    const rows = insightSeed.usage.filter((u) => u.tenantId === tenant.id && u.metric === 'sessions');
    const maxS = Math.max(1, ...rows.map((r) => r.value));
    const totalRev = insightSeed.usage
      .filter((u) => u.tenantId === tenant.id && u.metric === 'revenue')
      .reduce((s, r) => s + r.value, 0);

    return (
      <div className={frameClass} aria-label="Insight Boards multi-tenant usage chart">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              Tenant Sessions Â· {tenant.name}
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              ${totalRev.toLocaleString()} sample revenue
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {(['north', 'grove', 'ember'] as const).map((tid) => (
              <button
                key={tid}
                type="button"
                aria-pressed={insightTenantId === tid}
                onClick={() => setInsightTenantId(tid)}
                className={pillBtn(insightTenantId === tid)}
              >
                {tid === 'north' ? 'NS' : tid === 'grove' ? 'GC' : 'ES'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid h-28 grid-cols-5 items-end gap-2.5 border-b border-[#64748B]/40 pb-1 pt-2">
          {rows.map((r) => (
            <div key={r.id} className="flex h-full flex-col items-center justify-end gap-1">
              <span className="font-mono text-[9px] text-slate-200 tabular-nums">{r.value}</span>
              <div className="flex h-full w-full flex-1 items-end overflow-hidden rounded-t-sm">
                <div
                  className="h-full w-full origin-bottom rounded-t-sm bg-[#2DD4BF] transition-transform duration-200 ease-out"
                  style={{ transform: `scaleY(${r.value / maxS})` }}
                />
              </div>
              <span className="font-mono text-[9px] text-slate-400">{r.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (prototype === 'clinicare') {
    const statuses = ['scheduled', 'checked-in', 'in-room', 'completed'] as const;
    const total = Math.max(1, clinicSeed.appointments.length);
    return (
      <div className={frameClass} aria-label="CliniCare patient flow distribution">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              Patient Flow Â· Zero-Base
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {total} active visits Â· {clinicSeed.clinicians.length} clinicians
            </p>
          </div>
          <span className="rounded-full border border-[#10B981]/35 bg-[#10B981]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
            Masked PII
          </span>
        </div>

        <div className="my-auto space-y-2.5 pt-3">
          {statuses.map((st) => {
            const count = clinicSeed.appointments.filter((a) => a.status === st).length;
            const ratio = count / total;
            return (
              <div key={st} className="grid grid-cols-[88px_1fr_36px] items-center gap-2 text-[11px]">
                <span className="font-mono capitalize text-slate-200">{st}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full ${
                      st === 'completed' ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                    }`}
                    style={{ transform: `scaleX(${ratio})` }}
                  />
                </div>
                <span className="text-right font-mono font-bold tabular-nums text-white">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'hq-admin') {
    const roles = ['admin', 'editor', 'viewer'] as const;
    const total = Math.max(1, hqSeed.members.length);
    return (
      <div className={frameClass} aria-label="HQ Admin workspace seat distribution">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
              Workspace Access Â· RBAC Share
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              {hqSeed.workspaces.length} spaces Â· {total} members
            </p>
          </div>
          <span className="rounded-full border border-[#38BDF8]/30 bg-[#0EA5E9]/15 px-2 py-0.5 font-mono text-[10px] text-[#38BDF8]">
            Zero-Base
          </span>
        </div>

        <div className="my-auto space-y-2.5 pt-3">
          {roles.map((role) => {
            const count = hqSeed.members.filter((m) => m.role === role).length;
            return (
              <div key={role} className="grid grid-cols-[72px_1fr_44px] items-center gap-2 text-[11px]">
                <span className="font-mono capitalize text-slate-200">{role}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full origin-left rounded-full bg-[#38BDF8]"
                    style={{ transform: `scaleX(${count / total})` }}
                  />
                </div>
                <span className="text-right font-mono font-bold tabular-nums text-white">
                  {count} seat{count === 1 ? '' : 's'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (prototype === 'logistics') {
    const slaTarget = 95;
    const corridors = [
      { region: 'North Hub', sla: 97.4 },
      { region: 'Central Express', sla: 91.2 },
      { region: 'East Depot', sla: 96.8 },
      { region: 'South Loop', sla: 95.5 },
    ];
    return (
      <div className={frameClass} aria-label="Fulfillr fleet readiness and SLA bullet telemetry">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
              Route SLA vs {slaTarget}% Benchmark
            </span>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              97.4% Top Hub Â· 3 Corridors On-Target
            </p>
          </div>
          <span className="rounded-full border border-[#10B981]/35 bg-[#10B981]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10B981]">
            HITL Ready
          </span>
        </div>

        {/* Horizontal Bullet Bars: zero baseline 0..100% + explicit 95% target tick (#64748B) */}
        <div className="my-auto space-y-2.5 pt-3">
          {corridors.map((c) => {
            const onTarget = c.sla >= slaTarget;
            return (
              <div key={c.region} className="grid grid-cols-[106px_1fr_54px] items-center gap-2 text-[11px]">
                <span className="truncate text-slate-200">{c.region}</span>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full origin-left rounded-full ${
                      onTarget ? 'bg-[#10B981]' : 'bg-[#F43F5E]'
                    }`}
                    style={{ transform: `scaleX(${c.sla / 100})` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 w-0.5 bg-[#64748B]"
                    style={{ left: `${slaTarget}%` }}
                  />
                </div>
                <span className={`text-right font-mono text-[10px] font-bold tabular-nums ${onTarget ? 'text-white' : 'text-[#F43F5E]'}`}>
                  {c.sla}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: taxi-demand-eda-agent
  const hourly = taxiSeries?.hourlyData || [];
  const maxHourly = Math.max(1, ...hourly.map((h) => Number(h['Overall Average'] || 0)));

  return (
    <div className={frameClass} aria-label="Taxi Demand EDA Agent hourly demand chart">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
            Hourly Demand Â· Zero-Base
          </span>
          <p className="font-mono text-xs font-bold text-white tabular-nums">
            17:00 Peak: {hourly.find((h) => h.hour === '17:00')?.['Overall Average'] ?? 0} rides/hr
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['All', 'Snowy', 'Clear'] as const).map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={taxiWeather === w}
              onClick={() => setTaxiWeather(w)}
              className={pillBtn(taxiWeather === w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid h-28 grid-cols-5 items-end gap-2.5 border-b border-[#64748B]/40 pb-1 pt-2">
        {hourly.map((row) => {
          const val = Number(row['Overall Average'] || 0);
          const scale = val / maxHourly;
          const isPeak = val === maxHourly && val > 0;
          return (
            <div key={row.hour} className="flex h-full flex-col items-center justify-end gap-1">
              <span className="font-mono text-[10px] font-bold tabular-nums text-slate-200">
                {val}
              </span>
              <div className="flex h-full w-full flex-1 items-end overflow-hidden rounded-t-sm">
                <div
                  className={`h-full w-full origin-bottom rounded-t-sm transition-transform duration-200 ease-out ${
                    isPeak ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                  }`}
                  style={{ transform: `scaleY(${scale})` }}
                />
              </div>
              <span className="font-mono text-[9px] text-slate-400">{row.hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurfaceChartWidget;
