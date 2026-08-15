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
        <section id="roi-calculator" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-5 space-y-4 text-left">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                        Enterprise ROI Modeler
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                        Calculate Your Enterprise Fleet Financial Savings
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Adjust team size and average hourly rates to project annual operational savings achieved through autonomous AI agents and financial valuation automation.
                    </p>
                    <div className="space-y-2 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Based on benchmarked 28.4 hours saved per employee / month</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Average enterprise payback achieved in &lt; {paybackMonths} months</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
                        {/* Slider 1: Team Size */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-cyan-500" /> Knowledge & Ops Team Size:
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
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
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> Fully Loaded Hourly Cost ($/hr):
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                                    ${hourlyRate} / hour
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-2xl border border-cyan-500/25">
                            <div>
                                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium block">
                                    Annual Working Hours Saved:
                                </span>
                                <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mt-1">
                                    <Clock className="w-5 h-5 text-cyan-500" />
                                    {hoursSaved.toLocaleString()} hrs
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium block">
                                    Projected Annual Cost Reduction:
                                </span>
                                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-500 mt-1 block">
                                    ${annualSavings.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Lead Hook */}
                        <button
                            onClick={handleEmailReport}
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Full Financial Model & Breakdown</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RoiCalculator;
