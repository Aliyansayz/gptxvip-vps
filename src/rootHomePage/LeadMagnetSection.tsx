import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Shield, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const LeadMagnetSection: React.FC = () => {
    const [workEmail, setWorkEmail] = useState('');
    const [industry, setIndustry] = useState('Equity Valuation & Accounting');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!workEmail || !workEmail.includes('@')) {
            toast.error('Please enter a valid work email address.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('Your 2026 Enterprise Benchmark Report has been dispatched to ' + workEmail + '!');
        }, 600);
    };

    return (
        <section id="lead-magnet" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-5 sm:p-10 lg:p-12 overflow-hidden text-white shadow-2xl">
                {/* Glow Accents */}
                <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                    
                    {/* Left Column: Report Highlights */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Free 2026 Enterprise Whitepaper</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-50 leading-tight">
                            The 2026 Enterprise Multi-Agent Benchmark &amp; Security Blueprint
                        </h2>

                        <p className="text-xs sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                            A comprehensive 54-page guide detailing multi-stage DCF intrinsic valuation models, SEC 10-K/10-Q accounting forensic benchmarks, ReAct loop execution, and SOC 2 continuous audit automation.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-xs text-zinc-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Zero-Data Retention Architecture</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>DCF &amp; Multi-Factor Valuation Benchmarks</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Legal Playbook Redlining Prompts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Full ROI &amp; Capital Allocation Matrix</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Lead Capture Form */}
                    <div className="lg:col-span-5">
                        <div className="rounded-xl sm:rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 sm:p-8 space-y-4 shadow-xl">
                            <div className="space-y-1 text-left">
                                <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                    <span>Download Instant PDF Copy</span>
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    Instant PDF access delivered directly to your work email.
                                </p>
                            </div>

                            {isSubmitted ? (
                                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                                    <h4 className="text-sm font-bold text-emerald-300">Report Dispatched!</h4>
                                    <p className="text-xs text-zinc-400">
                                        Check your inbox at <span className="font-mono text-white">{workEmail}</span>.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                            Work Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                                            <input
                                                type="email"
                                                required
                                                value={workEmail}
                                                onChange={(e) => setWorkEmail(e.target.value)}
                                                placeholder="you@enterprise.com"
                                                className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                            Primary Industry Focus
                                        </label>
                                        <select
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
                                        >
                                            <option value="Equity Valuation & Accounting">Equity Valuation &amp; Accounting</option>
                                            <option value="Ecommerce & Retail">Ecommerce &amp; DTC Brands</option>
                                            <option value="Legal & Compliance">Corporate Legal &amp; IP</option>
                                            <option value="Supply Chain">Supply Chain &amp; Logistics</option>
                                            <option value="Cybersecurity">Enterprise Cybersecurity</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Generating Download...</span>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                <span>Download Free Whitepaper</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[10px] text-zinc-500 text-center">
                                        Zero spam guarantee. Unsubscribe anytime with 1 click.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LeadMagnetSection;
