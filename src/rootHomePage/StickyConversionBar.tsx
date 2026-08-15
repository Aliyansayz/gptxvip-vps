import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BarChart3, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface StickyConversionBarProps {
    onBookDemo: () => void;
    onNavigateFinhub: () => void;
}

export const StickyConversionBar: React.FC<StickyConversionBarProps> = ({
    onBookDemo,
    onNavigateFinhub
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 450 && !isDismissed) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-40 bg-zinc-950/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-cyan-500/10 text-white flex items-center justify-between gap-3"
                >
                    <div className="flex items-center gap-2.5 pl-1 hidden xs:flex">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-zinc-100">
                                Ready for Autonomous Swarms?
                            </p>
                            <p className="text-[10px] text-zinc-400">
                                Deploy zero-trust agents &amp; valuation engine in 15 mins.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full xs:w-auto justify-end">
                        <button
                            onClick={onNavigateFinhub}
                            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                        >
                            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Finhub</span>
                        </button>

                        <button
                            onClick={onBookDemo}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                            <span>Deploy Swarm</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors ml-1 cursor-pointer"
                            aria-label="Dismiss banner"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyConversionBar;
