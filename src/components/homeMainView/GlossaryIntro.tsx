import React from 'react';
import { BookOpen } from 'lucide-react';

export const GlossaryIntro: React.FC = () => {
  return (
    <div className="w-full space-y-4 mt-12 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-white">Frequently Asked Questions</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FaqItem 
          q="What does this platform do?"
          a="This platform provides actionable visual intuition for technical components often abstracted away by Algorithmic Trading Engines. It lets you visualize Order Book Microstructures, Momentum indicators, and simulated pipeline logic in real-time."
        />
        <FaqItem 
          q="What is Market Microstructure?"
          a="It examines how the Limit Order Book (LOB) aggregates Bid/Ask levels. You can watch matching engines walk the book, resolve liquidity, and simulate execution at granular latency levels."
        />
        <FaqItem 
          q="What is a Limit Order Book (LOB)?"
          a="A continuous auction system where resting Buy (Bid) and Sell (Ask) orders are queued by price and time priority. The Matching Engine cross-references aggressive market orders against this book."
        />
        <FaqItem 
          q="What is the Bid-Ask Spread?"
          a="The difference between the highest price a buyer is willing to pay (Bid) and the lowest price a seller is willing to accept (Ask). Tighter spreads typically indicate higher liquidity."
        />
        <FaqItem 
          q="How is a Z-Score used in trading?"
          a="It's a statistical measurement describing a value's relationship to the mean, measured in standard deviations. For example, a volume Z-Score of +3.0 signifies an extreme outlier event, often a breakout or capitulation."
        />
        <FaqItem 
          q="What does ADX (Average Directional Index) measure?"
          a="It's a non-directional indicator that measures the strength of a trend. High ADX means a strong trend (up or down), while low ADX means a choppy or ranging market."
        />
        <FaqItem 
          q="What is Squeeze Momentum?"
          a="A volatility indicator combining Bollinger Bands and Keltner Channels to identify periods of consolidation preceding explosive directional moves."
        />
      </div>
    </div>
  );
};

const FaqItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
      >
        <h3 className="text-sm font-bold text-cyan-50/90">{q}</h3>
        <span className={`text-cyan-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
          {a}
        </div>
      )}
    </div>
  );
};
