import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { Network, Loader2 } from "lucide-react";

interface ClassNode {
  name: string;
  icon: string;
  description: string;
}

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  x: string;
  y: string;
  direction: "right" | "left";
  color: "emerald" | "teal" | "blue" | "indigo" | "purple" | "rose";
  icon: string;
  classes: ClassNode[];
}

const colorStyles = {
  emerald: "bg-emerald-500 text-white dark:text-emerald-950 shadow-emerald-500/20",
  teal: "bg-teal-500 text-white dark:text-teal-950 shadow-teal-500/20",
  blue: "bg-blue-500 text-white dark:text-blue-950 shadow-blue-500/20",
  indigo: "bg-indigo-500 text-white dark:text-indigo-950 shadow-indigo-500/20",
  purple: "bg-purple-500 text-white dark:text-purple-950 shadow-purple-500/20",
  rose: "bg-rose-500 text-white dark:text-rose-950 shadow-rose-500/20",
};

export const DocumentationMap: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [activeClass, setActiveClass] = useState<ClassNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/documentation-map.json?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setPhases(data.phases || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const activePhase = phases.find((p) => p.id === activePhaseId);

  // Reset active class when phase changes
  React.useEffect(() => {
    setActiveClass(null);
  }, [activePhaseId]);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[800px] flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
        <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Loading Map Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[800px] p-8 md:p-12 flex flex-col items-center justify-center transition-colors duration-300">
      <header className="mb-16 text-center">
        <h1 className="transition-colors duration-300">Documentation Map</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm transition-colors duration-300">
          System architecture circuit and execution flow.
        </p>
      </header>

      <div className="w-full overflow-x-auto pb-12 no-scrollbar flex justify-center">
        <div className="relative w-full max-w-full min-w-[1000px] aspect-[1.6/1]">
          {/* SVG Circuit Background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
          >
            {/* Base Track */}
            <path
              d="M 166 100 L 833 100 A 40 40 0 0 1 873 140 L 873 460 A 40 40 0 0 1 833 500 L 166 500 A 40 40 0 0 1 126 460 L 126 140 A 40 40 0 0 1 166 100 Z"
              fill="none"
              stroke="currentColor"
              className="text-zinc-300 dark:text-zinc-800 transition-colors duration-300"
              strokeWidth="4"
            />
            {/* Animated Signal Trace */}
            <motion.path
              d="M 166 100 L 833 100 A 40 40 0 0 1 873 140 L 873 460 A 40 40 0 0 1 833 500 L 166 500 A 40 40 0 0 1 126 460 L 126 140 A 40 40 0 0 1 166 100 Z"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="150 2075"
              animate={{ strokeDashoffset: [2225, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="opacity-50"
            />
          </svg>

          {/* Nodes */}
          {phases.map((phase) => {
            const isActive = activePhaseId === phase.id;
            const isRight = phase.direction === "right";
            const PhaseIcon = (Icons as any)[phase.icon] || Icons.Circle;

            return (
              <div
                key={phase.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: phase.x, top: phase.y }}
              >
                <motion.button
                  onClick={() => setActivePhaseId(isActive ? null : phase.id)}
                  animate={{
                    scale: isActive ? 0.9 : 1,
                    paddingRight:
                      isActive && isRight
                        ? "1rem"
                        : isRight
                          ? "2.5rem"
                          : "1.25rem",
                    paddingLeft:
                      isActive && !isRight
                        ? "1rem"
                        : !isRight
                          ? "2.5rem"
                          : "1.25rem",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex items-center gap-3 py-4 px-5
                    ${colorStyles[phase.color]} font-black uppercase tracking-tighter text-sm
                    ${isRight ? "rounded-l-none rounded-r-[30px]" : "rounded-r-none rounded-l-[30px]"}
                    shadow-xl transition-colors duration-300 w-56
                    ${isActive ? "ring-2 ring-zinc-900/50 dark:ring-white/50 ring-offset-4 ring-offset-white dark:ring-offset-zinc-950" : ""}
                  `}
                >
                  <span
                    className={`absolute top-1 ${isRight ? "left-4" : "right-4"} text-[9px] font-mono opacity-60 tracking-[0.2em]`}
                  >
                    {phase.subtitle}
                  </span>

                  {isRight && <PhaseIcon className="w-5 h-5" />}
                  <span
                    className={`mt-2 text-left leading-tight flex-1 ${!isRight && "text-right"}`}
                  >
                    {phase.title}
                  </span>
                  {!isRight && <PhaseIcon className="w-5 h-5" />}
                </motion.button>
              </div>
            );
          })}

          {/* Central Classes Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 min-h-[16rem] h-auto flex items-center justify-center z-0">
            <AnimatePresence mode="wait">
              {activePhase ? (
                <motion.div
                  key={activePhase.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="flex flex-col gap-4 w-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/50 shadow-2xl transition-colors duration-300"
                >
                  <div className="text-center mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors duration-300">
                    <h3 className="text-lg transition-colors duration-300">
                      {activePhase.title}
                    </h3>
                    <p className="text-zinc-500 text-xs font-mono tracking-widest mt-1 transition-colors duration-300">
                      {activePhase.subtitle} CLASSES
                    </p>
                  </div>

                  <div
                    className="flex flex-col gap-3 relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 transition-colors duration-300 max-h-[240px] overflow-y-auto pr-2"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {activePhase.classes.map((cls, idx) => {
                      const ClassIcon = (Icons as any)[cls.icon] || Icons.Circle;
                      return (
                        <div key={cls.name} className="relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "1.5rem" }}
                            className="absolute -left-6 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 transition-colors duration-300"
                          />
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setActiveClass(cls)}
                            className={`flex items-center gap-3 p-2.5 w-full text-left border rounded-xl transition-all duration-300 ${
                              activeClass?.name === cls.name
                                ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 shadow-sm"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                            }`}
                          >
                            <div
                              className={`transition-colors duration-300 ${activeClass?.name === cls.name ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}
                            >
                              <ClassIcon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-xs font-mono transition-colors duration-300 ${activeClass?.name === cls.name ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-700 dark:text-zinc-300"}`}
                            >
                              {cls.name}
                            </span>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-700 transition-colors duration-300"
                >
                  <Network className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-xs font-mono uppercase tracking-widest text-center">
                    Select a node on the circuit
                    <br />
                    to inspect classes
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Contextual Pane */}
          <AnimatePresence>
            {activeClass && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 w-80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-6 rounded-l-3xl border-y border-l border-zinc-200/80 dark:border-zinc-800/50 shadow-2xl z-20"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-zinc-100">
                    {(() => {
                        const PaneIcon = (Icons as any)[activeClass.icon] || Icons.Circle;
                        return <PaneIcon className="w-4 h-4" />;
                    })()}
                  </div>
                  <h4 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 uppercase tracking-widest leading-tight">
                    {activeClass.name}
                  </h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                      Purpose
                    </span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeClass.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                      Context
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${colorStyles[activePhase!.color].split(' ')[0]}`}></span>
                      Active in {activePhase?.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
