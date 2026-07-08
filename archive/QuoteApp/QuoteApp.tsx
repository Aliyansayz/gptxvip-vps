
import React, { useState } from 'react';
import { Share2, ChevronRight, Copy, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { QUOTES, QuoteData, ThemeVariant } from './quotesData';

// --- Background Components ---

const TealBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <circle cx="15" cy="15" r="10" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
        <circle cx="0" cy="0" r="45" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" fill="none" strokeDasharray="8 8" />
        <circle cx="0" cy="0" r="90" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" fill="none" strokeDasharray="12 12" />
        <circle cx="100" cy="100" r="60" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />
    </svg>
);

const SunsetBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 100 Q 50 50 100 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
        <path d="M0 90 Q 50 40 100 90" stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="0.5" />
        <path d="M0 80 Q 50 30 100 80" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="0.5" />
        <circle cx="80" cy="20" r="15" fill="url(#sun-gradient)" opacity="0.3" />
        <defs>
            <radialGradient id="sun-gradient">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

const MidnightBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 50 }).map((_, i) => (
            <circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={Math.random() * 0.5}
                fill="white"
                opacity={Math.random() * 0.7}
            />
        ))}
        <path d="M 20 20 L 25 35 L 40 40 L 25 45 L 20 60 L 15 45 L 0 40 L 15 35 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />
    </svg>
);

const ForestBackground = () => (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 100 C 30 60, 70 60, 100 100 L 100 100 L 0 100 Z" fill="rgba(255,255,255,0.1)" />
        <path d="M0 100 C 40 70, 80 90, 100 100 L 100 100 L 0 100 Z" fill="rgba(255,255,255,0.1)" />
        <circle cx="90" cy="10" r="30" fill="rgba(255,255,255,0.05)" />
        <path d="M 50 0 L 50 100" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
    </svg>
);

// --- Main Component ---

const QuoteApp: React.FC = () => {
    const handleShare = (quote: QuoteData) => {
        navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
        toast.success("Quote copied to clipboard!");
    };

    const getThemeStyles = (theme: string) => {
        switch (theme as ThemeVariant) {
            case 'teal':
                return {
                    card: 'bg-gradient-to-br from-[#2D9C8D] to-[#0C4D58]',
                    button: 'bg-[#1AA892] hover:bg-[#148f7c]',
                    text: 'text-teal-100',
                    bgComponent: <TealBackground />
                };
            case 'sunset':
                return {
                    card: 'bg-gradient-to-br from-orange-400 to-rose-600',
                    button: 'bg-orange-500 hover:bg-orange-600',
                    text: 'text-orange-100',
                    bgComponent: <SunsetBackground />
                };
            case 'midnight':
                return {
                    card: 'bg-gradient-to-br from-indigo-500 to-slate-900',
                    button: 'bg-indigo-600 hover:bg-indigo-700',
                    text: 'text-indigo-100',
                    bgComponent: <MidnightBackground />
                };
            case 'forest':
                return {
                    card: 'bg-gradient-to-br from-emerald-500 to-teal-900',
                    button: 'bg-emerald-600 hover:bg-emerald-700',
                    text: 'text-emerald-100',
                    bgComponent: <ForestBackground />
                };
            default:
                 return {
                    card: 'bg-slate-800',
                    button: 'bg-slate-700',
                    text: 'text-white',
                    bgComponent: null
                };
        }
    };

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-black/50 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4 font-heading tracking-wide">Daily Inspiration</h1>
                    <p className="text-muted-foreground">Empowering voices and timeless wisdom.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {QUOTES.map((quote, index) => {
                        const styles = getThemeStyles(quote.theme);
                        return (
                            <div 
                                key={index} 
                                className={`relative rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${styles.card} flex flex-col`}
                            >
                                {/* Dynamic Background SVG */}
                                <div className="absolute inset-0 opacity-50">
                                    {styles.bgComponent}
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    
                                    {/* Header */}
                                    <div className="mb-6 flex items-center space-x-2 opacity-70">
                                        <span className="h-px w-4 bg-white"></span>
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Quote</span>
                                    </div>

                                    {/* Quote */}
                                    <div className="relative mb-6 flex-grow">
                                        <Quote className="absolute -top-4 -left-2 w-8 h-8 text-white opacity-20 transform -scale-x-100" />
                                        <p className="text-xl font-bold text-white leading-relaxed italic font-serif relative z-10 px-2">
                                            {quote.text}
                                        </p>
                                    </div>

                                    {/* Author & Footer */}
                                    <div className="mt-auto pt-6 border-t border-white/10">
                                        <p className="text-lg text-white font-semibold mb-4">
                                            {quote.author}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/80 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                                                {quote.category}
                                            </span>
                                            
                                            <button 
                                                onClick={() => handleShare(quote)}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                                                title="Copy Quote"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuoteApp;
