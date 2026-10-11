import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroCandlestickChart } from './HeroCandlestickChart';
import { Zap, BookOpen, ArrowRight } from 'lucide-react';

const WORDS = ['ENABLE', 'OPTIMIZE', 'VISUALIZE'];

export const HeroHeader: React.FC<{ onInitializeEngine?: () => void }> = ({ onInitializeEngine }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-[100vw] ml-[calc(-50vw+50%)] min-h-[640px] sm:min-h-[700px] flex items-center justify-center bg-transparent dark:bg-zinc-950 overflow-hidden border-y border-zinc-200/50 dark:border-zinc-800/50 mb-12 shadow-[0_0_50px_rgba(34,211,238,0.05)] dark:shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-colors">
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
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(255,255,255,0.85)_100%)] dark:bg-[radial-gradient(circle,transparent_30%,rgba(9,9,11,0.95)_100%)] z-[15] pointer-events-none transition-colors" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center w-full max-w-5xl mx-auto">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-tight leading-none text-center">
              <span className="inline-flex items-center justify-center gap-x-2 text-zinc-900/95 dark:text-white/95 transition-colors">
                <span className="rotating-text window relative inline-block h-[1.2em] overflow-hidden align-bottom text-left min-w-[150px] sm:min-w-[200px] md:min-w-[260px]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={WORDS[wordIndex]}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 right-0 text-cyan-600 dark:text-cyan-400 font-black block select-none transition-colors"
                    >
                      {WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span>THE</span>
              </span>
              <span className="neon-text-gradient bg-clip-text text-transparent text-5xl sm:text-6xl md:text-7xl font-black block mt-1">ALGORITHM</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-zinc-600 dark:text-zinc-300 mb-10 sm:mb-14 max-w-3xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors">
              Interactive light systems blending algorithmic theory, high-frequency execution simulations, and deep visual documentation into a singular digital experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
              <button 
                  type="button"
                  disabled={!onInitializeEngine}
                  onClick={onInitializeEngine}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] select-none cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span className="uppercase tracking-widest text-xs sm:text-sm">Initialize Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                  href="#bento-features"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('bento-features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 rounded-2xl transition-all duration-200 uppercase tracking-widest text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Lab Docs</span>
              </a>
          </div>
      </div>
    </div>
  );
};
