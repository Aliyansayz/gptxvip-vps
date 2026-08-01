import React, { useState } from 'react';
import { DollarSign, Clock, Users } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
    const [teamSize, setTeamSize] = useState(25);
    const [hourlyRate, setHourlyRate] = useState(65);

    const hoursSaved = teamSize * 728; // ~728 hrs saved per worker annually
    const annualSavings = hoursSaved * hourlyRate;

    return (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                        ROI Calculator
                    </span>
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        Calculate Your Enterprise Fleet Savings
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Adjust team size and average hourly rates to project annual operational savings achieved through autonomous AI agents.
                    </p>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
                        {/* Slider 1 */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-cyan-500" /> Ops & Legal Team Size:
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                    {teamSize} Team Members
                                </span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-full accent-cyan-500 cursor-pointer"
                            />
                        </div>

                        {/* Slider 2 */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-emerald-500" /> Avg. Hourly Cost ($/hr):
                                </label>
                                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                    ${hourlyRate} / hour
                                </span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="250"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full accent-cyan-500 cursor-pointer"
                            />
                        </div>

                        {/* Calculations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            <div>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
                                    Annual Hours Saved:
                                </span>
                                <span className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-1 mt-1">
                                    <Clock className="w-5 h-5 text-cyan-500" />
                                    {hoursSaved.toLocaleString()} hrs
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
                                    Est. Annual Cost Reduction:
                                </span>
                                <span className="text-2xl font-black font-mono text-emerald-500 mt-1 block">
                                    ${annualSavings.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
