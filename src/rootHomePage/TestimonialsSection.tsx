import React from 'react';
import { Star, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            quote: "devLush AgentOS redlined over 400 vendor contracts during our acquisition phase without requiring outside counsel. The accuracy on liability caps is extraordinary.",
            name: "Marcus Thorne",
            role: "General Counsel, FinTech Global",
            metric: "Saved $340k in legal fees",
            initials: "MT",
            colorClass: "bg-cyan-500 text-zinc-950"
        },
        {
            quote: "Finhub's fundamental equity engine parsed 10 years of SEC filings and normalized GAAP vs non-GAAP EBITDA across our 60 portfolio companies in under 3 minutes. The DCF models are audit-ready.",
            name: "Victoria Vance",
            role: "Chief Investment Officer, Horizon Equity",
            metric: "3-Minute 10-K DCF Modeling",
            initials: "VV",
            colorClass: "bg-emerald-500 text-zinc-950"
        },
        {
            quote: "Our DTC brand recovered $1.8M in abandoned cart revenue across Q4 with zero customer service intervention. The WhatsApp agent logic feels remarkably human.",
            name: "Elena Rostova",
            role: "VP Ecommerce, RetailX Global",
            metric: "$1.8M Revenue Recovered",
            initials: "ER",
            colorClass: "bg-amber-500 text-zinc-950"
        },
        {
            quote: "SOC 2 compliance used to take 3 months of manual screenshot gathering. The SOC 2 Auditor agent maintains 24/7 continuous evidence tracking automatically.",
            name: "David Chen",
            role: "CISO, CloudScale Systems",
            metric: "100% Continuous Compliance",
            initials: "DC",
            colorClass: "bg-purple-500 text-zinc-950"
        }
    ];

    return (
        <section id="testimonials" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-8 sm:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                    Enterprise Validation
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Trusted by Enterprise Leaders &amp; Investment Teams
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                    Verified results across autonomous operations, equity valuation, and high-security compliance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {testimonials.map((t, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-cyan-500/40 hover:shadow-xl transition-all"
                    >
                        <div className="space-y-3 text-left">
                            <div className="flex gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                                "{t.quote}"
                            </p>
                        </div>

                        <div className="space-y-3 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 text-left">
                            <div className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-500 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{t.metric}</span>
                            </div>

                            <div className="flex items-center gap-2.5 sm:gap-3">
                                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 shadow-sm ${t.colorClass}`}>
                                    {t.initials}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs truncate">
                                        {t.name}
                                    </h4>
                                    <p className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
