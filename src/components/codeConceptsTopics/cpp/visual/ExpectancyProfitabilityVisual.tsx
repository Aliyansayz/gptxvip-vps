import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingUp, Info } from 'lucide-react';

interface ExerciseProps {
  exercise: any;
  onComplete: () => void;
}

export const ExpectancyProfitabilityVisual: React.FC<ExerciseProps> = ({ exercise }) => {
  const winRates = [20, 30, 40, 50, 60, 70];
  const rewardRiskRatios = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
  const [selectedCell, setSelectedCell] = useState<{wr: number, rr: number} | null>(null);

  const calculateExpectancy = (wr: number, rr: number) => {
    // Expectancy = (Win% * Avg Win) - (Loss% * Avg Loss)
    // normalized to Avg Loss = 1
    return (wr / 100 * rr) - ((100 - wr) / 100 * 1);
  };

  const getColor = (expectancy: number) => {
    if (expectancy > 1) return 'bg-emerald-600';
    if (expectancy > 0.5) return 'bg-emerald-500';
    if (expectancy > 0) return 'bg-emerald-400';
    if (expectancy > -0.2) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Expectancy Heatmap</h4>
            </div>
            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-4">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-500" /> Negative</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500" /> Positive</div>
            </div>
          </div>

          <div className="relative overflow-x-auto bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
             <div className="grid grid-cols-7 gap-1">
                <div />
                {winRates.map(wr => (
                  <div key={wr} className="text-[10px] font-black text-center text-zinc-400 uppercase tracking-tight">{wr}%</div>
                ))}

                {rewardRiskRatios.reverse().map(rr => (
                  <React.Fragment key={rr}>
                    <div className="text-[10px] font-black flex items-center justify-end pr-2 text-zinc-400 uppercase tracking-tight h-10">{rr}x</div>
                    {winRates.map(wr => {
                      const expectancy = calculateExpectancy(wr, rr);
                      const isSelected = selectedCell?.wr === wr && selectedCell?.rr === rr;
                      return (
                        <motion.button
                          key={`${wr}-${rr}`}
                          whileHover={{ scale: 0.95 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedCell({ wr, rr })}
                          className={`h-10 rounded-lg transition-all border-2 ${isSelected ? 'border-white scale-110 shadow-2xl z-20 ring-4 ring-emerald-500/20' : 'border-transparent'} ${getColor(expectancy)}`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
             </div>
             <div className="mt-4 flex justify-center text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Win Probability →</div>
             <div className="absolute left-1 top-1/2 -rotate-90 origin-center text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em] -translate-x-1/2">Risk-Reward ↑</div>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col pt-8">
          <AnimatePresence mode="wait">
            {selectedCell ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key="stats"
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl h-fit"
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h5 className="text-xs font-black text-white uppercase tracking-widest italic">Calculated Edge</h5>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Configuration</p>
                    <p className="text-sm font-black text-white italic">
                      {selectedCell.wr}% WR @ {selectedCell.rr}:1 RR
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Expectancy Rate</p>
                    <div className={`text-2xl font-mono font-black ${calculateExpectancy(selectedCell.wr, selectedCell.rr) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {calculateExpectancy(selectedCell.wr, selectedCell.rr).toFixed(2)} R
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 italic leading-relaxed pt-2">
                    Ex: For every $1000 risked, this setup yields a mathematical profit of ${ (calculateExpectancy(selectedCell.wr, selectedCell.rr) * 1000).toFixed(0) } per trade on average.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center opacity-30">
                <Info className="w-8 h-8 mb-4 text-zinc-400" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Select a point on the matrix to run probability analysis</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
