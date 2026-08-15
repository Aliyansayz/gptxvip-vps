import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, CheckCircle2, XCircle, Search, Sparkles, Terminal, ShieldCheck, Globe, BarChart3 } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const SerpIntentAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'terminal' | 'entities'>('serp');

  const serpData = (currentExercise?.roleSpecificData as any)?.data || {
    targetKeyword: "Enterprise Cloud Backup Cost Comparison",
    searchVolume: 14200,
    searchIntent: "commercial",
    serpCompetitors: [
      { rank: 1, url: "https://techradar.com/cloud-backup-pricing", title: "Best Cloud Backup 2026: Pricing Compared", intentScore: 0.95, domainAuthority: 88 },
      { rank: 2, url: "https://cloudstorage.io/calculator", title: "Interactive Enterprise Storage Cost Estimator", intentScore: 0.92, domainAuthority: 79 },
      { rank: 3, url: "https://forbes.com/advisor/cloud-backup", title: "Enterprise Cloud Backup Cost Analysis", intentScore: 0.89, domainAuthority: 92 }
    ]
  };

  const handleRunAudit = () => {
    setIsScraping(true);
    toast.info("Dispatched autonomous SERP crawler across Google Search API...");
    setTimeout(() => {
      setIsScraping(false);
      toast.success("SERP intent decomposition completed with 94.2% confidence!");
    }, 1200);
  };

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct intent classification!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect analysis. Review the SERP competitor breakdown.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <Search className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'SERP Intent & Semantic Gap Auditing'}
            </h2>
            <p className="text-xs text-slate-400">
              SEO Agentic Analyst • Day 1 Mission (Step {step + 1} of {exercises.length})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleRunAudit}
            disabled={isScraping}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            {isScraping ? 'Scraping SERP...' : 'Audit Live SERP'}
          </button>
        </div>
      </div>

      {/* 2-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SERP Inspector & Terminal (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('serp')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeTab === 'serp' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SERP Decomposition
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeTab === 'terminal' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Agent Logs
                </button>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Query: "{serpData.targetKeyword}"</span>
            </div>

            <div className="p-4 min-h-[260px] max-h-[340px] overflow-y-auto custom-scrollbar">
              {activeTab === 'serp' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
                    <span>Rank / Snippet</span>
                    <span>Intent Match</span>
                    <span>Domain Authority</span>
                  </div>
                  {serpData.serpCompetitors?.map((comp: any) => (
                    <div key={comp.rank} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-1 max-w-[65%]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">#{comp.rank}</span>
                          <span className="text-white font-medium truncate">{comp.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          {comp.url}
                        </div>
                      </div>
                      <div className="text-center font-mono text-emerald-400">
                        {(comp.intentScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-center font-mono text-slate-300">
                        DA {comp.domainAuthority}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-xs text-slate-300 space-y-2">
                  {currentExercise?.logs?.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className="text-emerald-400 font-bold">[{log.level.toUpperCase()}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Candidate Assessment (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Candidate Intent Analysis
              </span>

              <p className="text-xs text-slate-400 font-sans">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-emerald-500 bg-emerald-500/10 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isEvaluated}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isEvaluated && (
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Correct Decision:' : 'Evaluation:'}</p>
                  <p className="text-slate-300 text-[11px]">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => { setIsEvaluated(false); setSelectedOption(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : <div className="text-[11px] text-slate-500 font-mono">Select target strategy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Submit Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerpIntentAuditActivity;
