import React from 'react';
import { Quote, Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            quote: "devLush AgentOS redlined over 400 vendor contracts during our acquisition phase without requiring outside counsel. The accuracy on liability caps is extraordinary.",
            name: "Marcus Thorne",
            role: "General Counsel, FinTech Global",
            initials: "MT",
            colorClass: "bg-cyan-500 text-zinc-950"
        },
        {
            quote: "Our DTC brand recovered $1.8M in abandoned cart revenue across Q4 with zero customer service intervention. The WhatsApp agent logic feels remarkably human.",
            name: "Elena Vance",
            role: "VP Ecommerce, RetailX Group",
            initials: "EV",
            colorClass: "bg-emerald-500 text-zinc-950"
        },
        {
            quote: "SOC 2 compliance used to take 3 months of manual screenshot gathering. The SOC 2 Auditor agent maintains 24/7 continuous evidence tracking automatically.",
            name: "David Chen",
            role: "CISO, CloudScale Systems",
            initials: "DC",
            colorClass: "bg-purple-500 text-zinc-950"
        }
    ];

    return (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 border-t border-zinc-200 dark:border-zinc-800 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Enterprise Validation
                </span>
                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    Trusted by Enterprise Operational Leaders
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-cyan-500/40 transition-all"
                    >
                        <div className="space-y-3">
                            <div className="flex gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                "{t.quote}"
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs ${t.colorClass}`}>
                                {t.initials}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs">
                                    {t.name}
                                </h4>
                                <p className="text-[11px] text-zinc-500">
                                    {t.role}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
