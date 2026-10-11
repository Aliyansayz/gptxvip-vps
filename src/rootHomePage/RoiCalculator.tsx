import React, { useState } from 'react';
import { DollarSign, Clock, Users, ArrowRight, Sparkles, Download, CheckCircle2 } from 'lucide-react';

interface RoiCalculatorProps {
    onOpenLeadModal?: (prefillNote?: string) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenLeadModal }) => {
    const [teamSize, setTeamSize] = useState(25);
    const [hourlyRate, setHourlyRate] = useState(75);

    const hoursSaved = teamSize * 728; // ~728 hrs saved per knowledge worker annually
    const annualSavings = hoursSaved * hourlyRate;
    const paybackMonths = 1.2;

    const handleEmailReport = () => {
        if (onOpenLeadModal) {
            onOpenLeadModal(`ROI Calculation: Team Size ${teamSize}, Hourly Rate $${hourlyRate}/hr, Estimated Annual Savings $${annualSavings.toLocaleString()}`);
        }
    };

    return (
        <section id="roi-calculator" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                <div className="lg:col-span-5 space-y-4 text-left">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                        Enterprise ROI Modeler
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                        Calculate Your Enterprise Fleet Financial Savings
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        Adjust team size and average hourly rates to project annual operational savings achieved through autonomous AI agents and financial valuation automation.
                    </p>
                    <div className="space-y-2 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Based on benchmarked 28.4 hours saved per employee / month</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Average enterprise payback achieved in &lt; {paybackMonths} months</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-8 space-y-5 shadow-xl text-left">
                        {/* Slider 1: Team Size */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <label className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-cyan-500" /> Team Size:
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                                    {teamSize} Members
                                </span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="250"
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-full accent-cyan-500 cursor-pointer"
                            />
                        </div>

                        {/* Slider 2: Hourly Rate */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <label className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> Hourly Cost ($/hr):
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                                    ${hourlyRate} / hr
                                </span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="250"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                        </div>

                        {/* Calculated Results Panel */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-xl sm:rounded-2xl border border-cyan-500/25">
                            <div>
                                <span className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 font-medium block">
                                    Annual Hours Saved:
                                </span>
                                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                                    {hoursSaved.toLocaleString()} hrs
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 font-medium block">
                                    Projected Cost Reduction:
                                </span>
                                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-emerald-500 mt-0.5 block">
                                    ${annualSavings.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Lead Hook */}
                        <button
                            onClick={handleEmailReport}
                            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Full Financial Model</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RoiCalculator;
