import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroCandlestickChart } from './HeroCandlestickChart';

const WORDS = ['ENABLE', 'OPTIMIZE', 'VISUALIZE'];

export const HeroHeader: React.FC<{ onInitializeEngine?: () => void }> = ({ onInitializeEngine }) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[100vw] ml-[calc(-50vw+50%)] min-h-[700px] flex items-center justify-center bg-zinc-950 overflow-hidden border-y border-zinc-800/50 mb-12 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
      <style>
        {`
          .rotating-text {
            font-size: inherit;
            line-height: 1.2;
            display: inline-block;
          }
          .window {
            display: inline-block;
            vertical-align: bottom;
            perspective: 1200px;
          }
        `}
      </style>

      {/* Background Chart Layer */}
      <HeroCandlestickChart />

      {/* Light Leak Layer */}
      <div className="light-leak-overlay z-10">
          <div className="leak leak-cyan"></div>
          <div className="leak leak-white"></div>
      </div>

      {/* Vignette Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(9,9,11,0.95)_100%)] z-[15] pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 py-32 flex flex-col items-center w-full max-w-5xl mx-auto">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 tracking-tight leading-none text-center">
              <span className="inline-flex items-center justify-center gap-x-2 text-white/95">
                <span className="rotating-text window relative inline-block h-[1.2em] overflow-hidden align-bottom text-left min-w-[150px] sm:min-w-[200px] md:min-w-[260px]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={WORDS[wordIndex]}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 right-0 text-cyan-400 font-black block select-none"
                    >
                      {WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span>THE</span>
              </span>
              <span className="neon-text-gradient bg-clip-text text-transparent text-5xl sm:text-6xl md:text-7xl font-black block mt-1">ALGORITHM</span>
          </h1>

          <p className="text-base md:text-xl text-zinc-300 mb-14 max-w-3xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Interactive light systems blending algorithmic theory, high-frequency execution simulations, and deep visual documentation into a singular digital experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full sm:w-auto">
              <button 
                  onClick={onInitializeEngine}
                  style={{ transform: 'skewY(-2deg)' }}
                  className="w-full sm:w-auto group relative px-12 py-5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black rounded-none overflow-hidden transition-all hover:pr-14 shadow-[0_0_30px_rgba(34,211,238,0.4)] select-none cursor-pointer"
              >
                  <div style={{ transform: 'skewY(2deg)' }} className="flex items-center justify-center relative w-full h-full">
                    <span className="relative z-10 uppercase tracking-widest text-sm">Initialize Engine</span>
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-lg font-bold text-zinc-950">→</span>
                  </div>
              </button>
              <button 
                  style={{ transform: 'skewY(-2deg)' }}
                  className="w-full sm:w-auto px-12 py-5 bg-zinc-900/50 backdrop-blur-xl border border-zinc-700/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] font-bold rounded-none transition-all duration-300 uppercase tracking-widest text-sm"
              >
                  <div style={{ transform: 'skewY(2deg)' }}>Explore Documentation</div>
              </button>
          </div>
      </div>
    </div>
  );
};
