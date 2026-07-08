import React, { useState, useEffect } from 'react';
import { X, Quote, Copy } from 'lucide-react';
import { QUOTES, QuoteData, ThemeVariant } from './quotesData';
import { toast } from 'sonner';

interface QuotePopupProps {
    onClose: () => void;
}

const QuotePopup: React.FC<QuotePopupProps> = ({ onClose }) => {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        // Select a random quote
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);
    }, []);

    useEffect(() => {
        // Timer for auto-close
        if (timeLeft <= 0) {
            onClose();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onClose]);

    const handleCopy = () => {
        if (quote) {
            navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
            toast.success("Quote copied!");
        }
    };

    if (!quote) return null;

    const getThemeStyles = (theme: string) => {
        switch (theme as ThemeVariant) {
            case 'teal':
                return 'bg-gradient-to-br from-[#2D9C8D] to-[#0C4D58] text-teal-100';
            case 'sunset':
                return 'bg-gradient-to-br from-orange-400 to-rose-600 text-orange-100';
            case 'midnight':
                return 'bg-gradient-to-br from-indigo-500 to-slate-900 text-indigo-100';
            case 'forest':
                return 'bg-gradient-to-br from-emerald-500 to-teal-900 text-emerald-100';
            default:
                return 'bg-slate-800 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-down">
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${getThemeStyles(quote.theme)}`}>
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                    <div 
                        className="h-full bg-white/80 transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 15) * 100}%` }}
                    />
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className="mb-6 opacity-80">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Daily Inspiration</span>
                    </div>

                    <div className="relative mb-6">
                        <Quote className="absolute -top-4 -left-2 w-8 h-8 opacity-20 transform -scale-x-100" />
                        <p className="text-xl font-serif italic leading-relaxed px-4">
                            {quote.text}
                        </p>
                        <Quote className="absolute -bottom-4 -right-2 w-8 h-8 opacity-20" />
                    </div>

                    <div className="mb-8">
                        <p className="font-semibold text-lg opacity-90">
                            — {quote.author}
                        </p>
                        <span className="text-xs opacity-60 mt-1 block uppercase tracking-wider">
                            {quote.category}
                        </span>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm"
                    >
                        <Copy className="w-3 h-3" />
                        Copy Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuotePopup;
