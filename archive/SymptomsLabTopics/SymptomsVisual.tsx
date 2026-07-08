import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Activity,
  HeartPulse,
  LucideIcon,
  AlertTriangle,
} from "lucide-react";

interface VisualWrapperProps {
  children: React.ReactNode;
  title: string;
  Icon: LucideIcon;
}

const VisualWrapper: React.FC<VisualWrapperProps> = ({
  children,
  title,
  Icon,
}) => (
  <div className="mt-6 border dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40">
    <div className="flex items-center gap-2 px-4 py-3 border-b dark:border-slate-800 bg-white dark:bg-slate-900/50">
      <Icon size={16} className="text-slate-600 dark:text-slate-400" />
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {title}
      </span>
    </div>
    <div className="relative p-8 flex items-center justify-center min-h-[220px]">
      {children}
    </div>
  </div>
);

const HealthyBaselineVisual = () => (
  <div className="relative flex items-center justify-center">
    <motion.div
      animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"
    />
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-16 h-16 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center rotate-45"
    >
      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-400/20 rounded-lg flex items-center justify-center -rotate-45">
        <Activity size={24} className="text-emerald-400" />
      </div>
    </motion.div>
  </div>
);

const HyperglycemiaVisual = () => (
  <div className="relative w-full max-w-[200px] h-20 flex items-center">
    <div className="absolute inset-0 h-8 my-auto border-y border-cyan-500/30 bg-cyan-500/5 rounded-full" />
    <div className="flex w-full justify-around items-center h-full relative">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 40], opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-2 h-2 bg-yellow-400 rounded-sm rotate-45 border border-yellow-200/50 shadow-[0_0_5px_rgba(250,204,21,0.5)]"
        />
      ))}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -right-4 flex flex-col gap-1"
      >
        <div className="text-[8px] text-cyan-400 font-bold uppercase tracking-tighter">
          Osmotic Pressure
        </div>
        <div className="w-full h-[1px] bg-cyan-400/50" />
      </motion.div>
    </div>
  </div>
);

const FatigueVisual = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
          className="w-8 h-8 rounded-full border border-red-900/30 bg-red-950/20"
        />
      ))}
    </div>
    <div className="w-32 h-4 border border-slate-700 bg-slate-900 rounded-sm p-[2px] overflow-hidden">
      <motion.div
        animate={{ x: ["-100%", "0%"], opacity: [0, 1] }}
        className="w-1/4 h-full bg-red-500/40"
      />
    </div>
    <span className="text-[9px] text-red-500 font-mono uppercase tracking-widest">
      Reserve Critical
    </span>
  </div>
);

const DyspneaVisual = () => (
  <div className="relative">
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
      }}
      transition={{ duration: 5, repeat: Infinity }}
      className="w-24 h-24 rounded-full border-2 border-cyan-500/20 flex items-center justify-center p-2"
    >
      <div className="w-full h-full rounded-full bg-cyan-900/20 border border-cyan-500/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-[1px] bg-red-500/40"
        />
      </div>
    </motion.div>
    <div className="absolute inset-0 flex items-center justify-center">
      <Zap size={20} className="text-yellow-500/40" />
    </div>
  </div>
);

const ArrhythmiaVisual = () => (
  <div className="w-full max-w-[240px] h-24 relative overflow-hidden bg-black/40 rounded-lg border border-slate-800">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 240 100"
      className="opacity-60"
    >
      <motion.path
        d="M 0 50 L 40 50 L 50 10 L 60 90 L 70 50 L 110 50 L 115 40 L 120 60 L 125 30 L 130 70 L 135 50 L 180 50 L 190 20 L 200 80 L 210 50 L 240 50"
        fill="transparent"
        stroke="#f87171"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
    <div className="absolute top-2 right-2 flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-red-500 animate-ping rounded-full" />
      <span className="text-[8px] text-red-500 font-bold font-mono">
        SIGNAL FRAGMENTATION
      </span>
    </div>
  </div>
);

const AKIVisual = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-20 h-28 border-x-2 border-slate-700/50 relative overflow-hidden rounded-b-3xl">
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800/40 border-b border-slate-700" />
      <motion.div
        animate={{ y: [0, 60] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-12 left-2 right-2 h-[2px] bg-orange-500/40 blur-[1px]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center justify-center">
          <AlertTriangle size={16} className="text-orange-500/40" />
        </div>
      </div>
    </div>
    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">
      Glomerular Mesh Integrity Low
    </span>
  </div>
);

const NeuropathyVisual = () => (
  <div className="flex flex-col items-center justify-center gap-6">
    <div className="relative w-48 h-12 flex items-center justify-between">
      <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="relative z-10 w-8 h-4 bg-slate-700/50 border border-slate-600 rounded-sm"
        >
          {i === 2 && (
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -top-1 -left-1 w-10 h-6 border border-yellow-400/40 rounded-sm bg-yellow-400/10"
            />
          )}
        </div>
      ))}
      <motion.div
        animate={{ x: [0, 192] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-2 h-2 bg-cyan-400 rounded-full blur-[1px]"
      />
    </div>
    <div className="flex items-center gap-2 text-yellow-500/60 font-mono text-[9px] uppercase tracking-widest">
      <Zap size={10} /> Demyelination Leak Detected
    </div>
  </div>
);

const HypothyroidismVisual = () => (
  <div className="relative flex items-center justify-center h-24">
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute w-32 h-20 bg-purple-500/10 rounded-[50%] blur-xl"
    />
    <div className="relative flex gap-1">
      <motion.div 
        animate={{ rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-10 h-16 bg-purple-500/10 border-2 border-purple-500/30 rounded-full -rotate-12" 
      />
      <motion.div 
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-10 h-16 bg-purple-500/10 border-2 border-purple-500/30 rounded-full rotate-12" 
      />
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
       <Activity size={16} className="text-purple-400/50 mb-1" />
       <span className="text-[7px] text-purple-400/60 font-bold uppercase tracking-widest">Metabolic Sluggishness</span>
    </div>
  </div>
);

const AnemiaVisual = () => (
  <div className="flex gap-4 items-center h-20">
    <div className="flex flex-col gap-1.5 h-full justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: i % 2 === 0 ? [-2, 2, -2] : [2, -2, 2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-10 h-2 bg-red-900/10 border border-red-500/20 rounded-full"
        />
      ))}
    </div>
    <div className="relative w-20 h-20 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.5], opacity: [1, 0], y: [40, -40] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="text-red-500 font-bold text-xs"
      >
        O₂
      </motion.div>
      <div className="absolute inset-0 bg-red-500/5" />
    </div>
  </div>
);

const AsthmaVisual = () => (
  <div className="relative w-40 h-24 flex items-center justify-center">
    <svg width="160" height="80" viewBox="0 0 160 80">
      <motion.path
        d="M 10 40 Q 40 10 80 40 Q 120 70 150 40"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ strokeWidth: [4, 1.5, 4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.path
        d="M 10 40 Q 40 10 80 40 Q 120 70 150 40"
        fill="none"
        stroke="#fb7185"
        strokeWidth="12"
        strokeLinecap="round"
        className="opacity-10"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
      <Zap size={10} className="text-rose-400" />
      <span className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Smooth Muscle Constriction</span>
    </div>
  </div>
);

const DehydrationVisual = () => (
  <div className="flex gap-2">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex flex-col gap-1 items-center">
         <motion.div
           animate={{ 
             scale: [0.9, 0.7, 0.9],
             borderRadius: ["30%", "50%", "30%"]
           }}
           transition={{ duration: 4, delay: i * 0.3, repeat: Infinity }}
           className="w-6 h-6 border border-cyan-800/40 bg-cyan-900/10"
         />
         <div className="w-1 h-3 bg-slate-800 rounded-full" />
      </div>
    ))}
    <div className="ml-4 flex flex-col justify-center">
       <span className="text-[10px] font-black text-cyan-600/60 uppercase -rotate-90 origin-left">Structural Collapse</span>
    </div>
  </div>
);

const HypoglycemiaVisualComponent = () => (
  <div className="relative">
     <div className="flex gap-1 items-center">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
            className={`w-1 h-8 ${i < 3 ? 'bg-red-500' : 'bg-slate-700'} rounded-full`}
          />
        ))}
     </div>
     <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full" />
  </div>
);

export const SymptomsVisual: React.FC<{ symptomId: number }> = ({
  symptomId,
}) => {
  switch (symptomId) {
    case 0:
      return (
        <VisualWrapper title="Metabolic Equilibrium" Icon={Activity}>
          <HealthyBaselineVisual />
        </VisualWrapper>
      );
    case 1:
      return (
        <VisualWrapper title="Osmotic Shift Schematic" Icon={Zap}>
          <HyperglycemiaVisual />
        </VisualWrapper>
      );
    case 2:
      return (
        <VisualWrapper title="Energy Deficit Model" Icon={Zap}>
          <FatigueVisual />
        </VisualWrapper>
      );
    case 3:
      return (
        <VisualWrapper title="Alveolar Resistance Map" Icon={Activity}>
          <DyspneaVisual />
        </VisualWrapper>
      );
    case 4:
      return (
        <VisualWrapper title="Electrophysiological Chaos" Icon={HeartPulse}>
          <ArrhythmiaVisual />
        </VisualWrapper>
      );
    case 5:
      return (
        <VisualWrapper title="Filtration Barrier Failure" Icon={AlertTriangle}>
          <AKIVisual />
        </VisualWrapper>
      );
    case 6:
      return (
        <VisualWrapper title="Axon-Demyelination Spark" Icon={Zap}>
          <NeuropathyVisual />
        </VisualWrapper>
      );
    case 7:
      return (
        <VisualWrapper title="Thyroid Metabolic Deceleration" Icon={Activity}>
          <HypothyroidismVisual />
        </VisualWrapper>
      );
    case 8:
      return (
        <VisualWrapper title="Hemoglobin Oxygen Transport" Icon={Activity}>
          <AnemiaVisual />
        </VisualWrapper>
      );
    case 9:
      return (
        <VisualWrapper title="Airway Caliber Obstruction" Icon={Activity}>
          <AsthmaVisual />
        </VisualWrapper>
      );
    case 10:
      return (
        <VisualWrapper title="Cellular Osmolality Compression" Icon={AlertTriangle}>
          <DehydrationVisual />
        </VisualWrapper>
      );
    case 11:
      return (
        <VisualWrapper title="Neural Energy Failure" Icon={Zap}>
          <HypoglycemiaVisualComponent />
        </VisualWrapper>
      );
    default:
      return null;
  }
};
