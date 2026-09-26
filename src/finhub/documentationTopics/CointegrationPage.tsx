import React from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  Zap,
  ChevronRight,
  ListChecks,
  Network,
  Code2
} from "lucide-react";
import { ZScoreChartWidget } from "../tradeTopic/ZScoreChartWidget";
import { PipelineFlowchartWidget } from "./PipelineFlowchartWidget";
import { CodeSnippetViewer } from "./CodeSnippetViewer";
import { cointegrationSnippets } from "../../constants";

interface DocumentationSectionProps {
  id: string;
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  isLast?: boolean;
}

const DocumentationSection: React.FC<DocumentationSectionProps> = ({ id, title, icon: Icon, children, isLast }) => {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative pl-8 md:pl-0 mb-32 scroll-mt-24">
      {/* Timeline line */}
      {!isLast && (
        <div className="hidden md:block absolute left-0 top-8 bottom-[-128px] w-px bg-zinc-200 dark:bg-zinc-800" />
      )}
      
      <div className="md:pl-12 relative">
        {/* Timeline dot (The "Knob") */}
        <div className="hidden md:block absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-950 z-10" />
        
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            {Icon && <Icon className="w-5 h-5 text-emerald-500" />}
            <h2 id={`${id}-title`} className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
              {title}
            </h2>
          </div>
          <div className="h-1 w-20 bg-emerald-500 rounded-full" />
        </header>

        <div className="space-y-16">
          {children}
        </div>
      </div>
    </section>
  );
};

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="relative pl-8 md:pl-0 group">
      {/* Sub-knob */}
      <div className="hidden md:block absolute left-[-44px] top-2 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-emerald-500 transition-colors ring-4 ring-white dark:ring-zinc-950 z-10" />
      
      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

const LogicBlock: React.FC<{
  type: string;
  rule: string;
  description: string;
  action: string;
  status?: "passed" | "failed" | "neutral";
}> = ({ type, rule, description, action, status = "neutral" }) => {
  return (
    <div className="group relative bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {type}
            </span>
            {status === "passed" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                <CheckCircle2 className="w-3 h-3" /> Passed
              </span>
            )}
            {status === "failed" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                <XCircle className="w-3 h-3" /> Failed
              </span>
            )}
          </div>
          
          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
            {description.split('.')[0]}
          </h4>
          
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description.split('.').slice(1).join('.')}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-black rounded-lg border border-zinc-800">
              <code className="text-xs font-mono text-emerald-400">{rule}</code>
            </div>
          </div>
        </div>

        <div className="md:w-48 shrink-0">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Action</span>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-emerald-500" />
              {action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CointegrationPage: React.FC = () => {
  const sections = [
    { id: "coint-overview", label: "Overview" },
    { id: "coint-rules", label: "Trading rules" },
    { id: "coint-pipeline", label: "Checking pipeline" },
    { id: "coint-examples", label: "Pair examples" },
    { id: "coint-actions", label: "Action and exit tables" },
    { id: "coint-code", label: "Code snippets" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <nav aria-label="Cointegration guide sections" className="mb-12 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">On this page</p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-emerald-500/50 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-emerald-300">
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <DocumentationSection id="coint-overview" title="Overview" icon={Activity}>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Cointegration trading, often referred to as "Pairs Trading," is a market-neutral strategy that exploits the statistical relationship between two historically correlated assets. Unlike simple correlation, cointegration implies a long-term equilibrium where the spread between prices is mean-reverting.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              Statistical Edge
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We use the Engle-Granger two-step method to identify pairs whose residual spread may be stationary and suitable for further mean-reversion analysis.
            </p>
          </div>
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              Risk Neutrality
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Holding offsetting positions may reduce exposure to broad market moves, but it does not remove market, model, execution, or liquidity risk.
            </p>
          </div>
        </div>
      </DocumentationSection>

      <DocumentationSection id="coint-rules" title="Trading Rules" icon={ListChecks}>
        <div className="space-y-16">
          <SubSection title="Entry Criteria">
            <ZScoreChartWidget />
            <div className="grid grid-cols-1 gap-4">
              <LogicBlock 
                type="Prerequisite"
                rule="len(df) >= 100"
                description="Data Sufficiency. Minimum of 100 aligned data points required for statistical significance."
                action="Proceed to Validation"
              />
              <LogicBlock 
                type="Prerequisite"
                rule="is_cointegrated == True"
                description="Stationarity Check. The pair must pass the Engle-Granger test with p-value < 0.05."
                action="Proceed to Validation"
              />
              <LogicBlock 
                type="Trigger"
                rule="Z-Score > entry_z"
                description="Short Spread Signal. Sell Symbol A and Buy Symbol B when the spread is overextended to the upside."
                action="Execute Short Spread"
              />
              <LogicBlock 
                type="Trigger"
                rule="Z-Score < -entry_z"
                description="Long Spread Signal. Buy Symbol A and Sell Symbol B when the spread is overextended to the downside."
                action="Execute Long Spread"
              />
            </div>
          </SubSection>

          <SubSection title="Exit Criteria">
            <div className="grid grid-cols-1 gap-4">
              <LogicBlock 
                type="Take Profit"
                rule="|Z-Score| <= exit_z"
                description="Mean Reversion. Close both positions when the spread returns to its historical mean."
                action="Realize Profit"
                status="passed"
              />
              <LogicBlock 
                type="Stop Loss"
                rule="|Z-Score| > stop_loss_z"
                description="Statistical Blowout. Exit immediately if the spread diverges beyond 3 standard deviations."
                action="Cut Loss"
                status="failed"
              />
              <LogicBlock 
                type="Time Exit"
                rule="duration > max_time"
                description="Stagnation Filter. Force exit if the trade fails to revert within the expected half-life window."
                action="Liquidate Position"
              />
            </div>
          </SubSection>
        </div>
      </DocumentationSection>

      <DocumentationSection id="coint-pipeline" title="Checking Pipeline" icon={Network}>
        <div className="space-y-12">
          <SubSection title="Discovery Process">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              The discovery pipeline uses a brute-force combinatorial approach to find cointegrated pairs from a universe of symbols. Each pair must survive a 5-stage filtration process.
            </p>
            <PipelineFlowchartWidget />
          </SubSection>

          <SubSection title="Filtration Stages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { stage: "1. Alignment", process: "Timestamp synchronization", pass: "len(df) > 100", desc: "Ensures both symbols have overlapping historical data." },
                { stage: "2. Correlation", process: "Pearson coefficient check", pass: "|corr| > 0.7", desc: "Pre-filter to discard unrelated assets early." },
                { stage: "3. Cointegration", process: "Engle-Granger test", pass: "p-value < 0.05", desc: "The core statistical test for stationarity." },
                { stage: "4. Half-Life", process: "OU Model regression", pass: "HL < 100 bars", desc: "Ensures the mean reversion happens fast enough." }
              ].map((s, i) => (
                <div key={i} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.stage}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-mono border border-emerald-500/20">{s.pass}</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{s.process}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </div>
      </DocumentationSection>

      <DocumentationSection id="coint-examples" title="Pair Examples" icon={Activity}>
        <div className="space-y-12">
          <SubSection title="Combinatorial Evaluation">
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Illustrative scanner input · fixed sample</span>
              </div>
              <code className="text-sm text-emerald-400 font-mono leading-relaxed block">
                [EURUSD, GBPUSD, USDCHF, AUDUSD, NZDUSD, USDCAD]
              </code>
              <p className="mt-3 text-xs leading-5 text-zinc-400">The symbol list and evaluation values on this page are examples; they are not connected to a live scanner.</p>
            </div>
          </SubSection>

          <SubSection title="Evaluation Results">
            <div className="grid grid-cols-1 gap-4">
              {[
                { pair: "EURUSD / GBPUSD", status: "passed", reason: "High correlation (0.85) and strong mean reversion (p=0.01).", metrics: "HL: 45 | Corr: 0.85" },
                { pair: "AUDUSD / NZDUSD", status: "passed", reason: "Geographic economic coupling leads to stable cointegration.", metrics: "HL: 60 | Corr: 0.90" },
                { pair: "EURUSD / USDCHF", status: "failed", reason: "High correlation but non-stationary spread (p=0.15).", metrics: "HL: N/A | Corr: 0.92" },
                { pair: "GBPUSD / USDCAD", status: "failed", reason: "Insufficient correlation (0.30) for pairs trading.", metrics: "HL: N/A | Corr: 0.30" }
              ].map((ex, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{ex.pair}</h4>
                      <span className="text-[10px] font-mono text-zinc-400">{ex.metrics}</span>
                    </div>
                    <p className="text-xs text-zinc-500 max-w-md leading-relaxed">{ex.reason}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div aria-hidden="true" className={`p-2 rounded-full ${ex.status === "passed" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                      {ex.status === "passed" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold ${ex.status === "passed" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                      Example {ex.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SubSection>
        </div>
      </DocumentationSection>

      <DocumentationSection id="coint-actions" title="Action & Exit Tables" icon={ListChecks}>
        <div className="space-y-12">
          <SubSection title="Execution Matrix">
            <div className="bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <div className="p-6 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Order Routing Logic</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Automated Execution Layer</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <p className="px-6 pt-4 text-xs leading-5 text-zinc-400">Illustrative rule mapping only; order routing is not running from this table.</p>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/30 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                      <th className="p-6">Trigger</th>
                      <th className="p-6">Direction</th>
                      <th className="p-6">Sym 1 Action</th>
                      <th className="p-6">Sym 2 Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {[
                      { trigger: "Z > 2.0", dir: "Short Spread", s1: "SELL", s2: "BUY", color: "text-red-500" },
                      { trigger: "Z < -2.0", dir: "Long Spread", s1: "BUY", s2: "SELL", color: "text-emerald-500" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-900/50 transition-colors group">
                        <td className="p-6">
                          <code className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{row.trigger}</code>
                        </td>
                        <td className="p-6 font-bold text-zinc-200">{row.dir}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${row.s1 === "SELL" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                            {row.s1}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${row.s2 === "SELL" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                            {row.s2}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SubSection>
        </div>
      </DocumentationSection>

      <DocumentationSection id="coint-code" title="Code Snippets" icon={Code2} isLast>
        <CodeSnippetViewer snippets={cointegrationSnippets} />
      </DocumentationSection>
    </div>
  );
};
