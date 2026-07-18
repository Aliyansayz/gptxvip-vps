import React, { useRef, useEffect } from "react";
import { Database, Activity, Layers, Box, Shield, Network, Target, Zap, BarChart3, Cpu, Circle } from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  Database, Activity, Layers, Box, Shield, Network, Target, Zap, BarChart3, Cpu, Circle
};
import { JourneyNode, ProjectJourneyData } from "./types";
import { ScrollProgressRibbon } from "./ScrollProgressRibbon";
import { TextRevealOnScroll } from "./TextRevealOnScroll";

interface Props {
  nodes: JourneyNode[];
  progress: number;
  canvas: ProjectJourneyData['canvas'];
  lockedNodeId?: string;
  subScroll?: number;
}

const NodeExpansion: React.FC<{ 
  step: JourneyNode; 
  isFocusExpanded: boolean; 
  subScroll: number; 
  isDarkVariant?: boolean;
}> = ({ step, isFocusExpanded, subScroll, isDarkVariant }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isFocusExpanded) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      scrollRef.current.scrollTop = maxScroll * ((subScroll || 0) / 100);
    }
  }, [subScroll, isFocusExpanded]);

  return (
    <div className={`transition-[height,opacity,margin] duration-[500ms] ease-in-out relative flex w-full ${isFocusExpanded && step.details ? 'h-[160px] opacity-100 mt-3' : 'h-0 opacity-0 mt-0 overflow-hidden'}`}>
      {isFocusExpanded && <ScrollProgressRibbon scrollPct={subScroll || 0} />}
      <div 
        ref={scrollRef} 
        className="overflow-hidden flex flex-col gap-2 relative z-10 w-full pl-8 pr-1 py-1 h-full"
      >
        {step.details?.map((detail: any, idx: number) => {
           const IconComponent = IconMap[detail.icon] || Circle;
           return (
              <div 
                key={idx} 
                className={`${isDarkVariant ? 'bg-black/20 border-white/10' : 'bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700'} p-2 rounded-xl border text-left shrink-0 shadow-sm relative`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className={`w-3.5 h-3.5 min-w-[14px] ${isDarkVariant ? 'text-emerald-200' : 'text-emerald-500'}`} />
                  <span className={`${isDarkVariant ? 'text-white' : 'text-slate-800 dark:text-zinc-200'} font-bold text-[11px] leading-tight break-words whitespace-normal`}>{detail.title}</span>
                </div>
                {detail.content?.[0] && detail.content[0].type === 'paragraph' && (
                  <TextRevealOnScroll 
                     text={detail.content[0].sentences.join(' ')}
                     className={`text-[10px] leading-[1.3] break-words whitespace-normal ${isDarkVariant ? 'text-emerald-50' : 'text-slate-700 dark:text-zinc-300'}`}
                     containerRef={scrollRef}
                     subScroll={subScroll || 0}
                  />
                )}
              </div>
           );
        })}
      </div>
    </div>
  );
};

export const JourneyNodes: React.FC<Props> = ({ nodes, progress, canvas, lockedNodeId, subScroll }) => {
  return (
    <>
      {nodes.map((step) => {
        // Calculate proximity for dynamic tracking
        const distance = step.progress - progress;
        let state = 'inactive';
        let proximity = 0;

        if (distance <= 0) {
          state = 'active';
          proximity = 1;
        } else if (distance < 0.1) {
          state = 'approaching';
          proximity = 1 - (distance / 0.1);
        }

        const isFinish = step.type === "milestone";
        const isActiveOrApproaching = state === 'active' || state === 'approaching';
        
        // Define if this is the purely focused active balloon
        const isFocusExpanded = lockedNodeId === step.id;

        // Calculate absolute position based on canvas metrics + percentages
        const xPos = (step.position.x_percent / 100) * canvas.width;
        const yPos = (step.position.y_percent / 100) * canvas.height;

        // Smart dynamic bounds placing natively tracking viewport sides safely wrapping tooltips smoothly horizontally 
        const isRightAligned = step.position.x_percent <= 60;
        const positionClasses = isRightAligned 
            ? 'left-[calc(100%+12px)] origin-left' 
            : 'right-[calc(100%+12px)] origin-right';

        return (
          <div 
            key={step.id}
            className={`absolute z-20 flex flex-col items-center will-change-transform ${isFocusExpanded ? 'z-50' : ''}`}
            style={{ 
              left: `${xPos}px`, 
              top: `${yPos}px`, 
              transform: state === 'active' 
                ? 'translate(-50%, -50%) scale(1.05)' 
                : `translate(-50%, -50%) scale(${1 + proximity * 0.05})`,
              filter: state === 'active' 
                ? 'grayscale(0%) opacity(100%)' 
                : `grayscale(${100 - proximity * 100}%) opacity(${60 + proximity * 40}%)`,
              transition: 'transform 0.1s ease-out, filter 0.1s ease-out'
            }}
          >
            {isFinish ? (
              <div className={`transition-all duration-[500ms] ease-in-out ${isFocusExpanded ? 'w-[200px] max-w-[200px]' : 'w-[155px] max-w-[155px]'} rounded-[28px] p-4 flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-[3px] ${isActiveOrApproaching ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-transparent text-white shadow-[0_25px_50px_rgba(16,185,129,0.3)] animate-[float_4s_ease-in-out_infinite]' : 'bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-700'}`}>
                <span className="text-[32px] mb-1.5 leading-none">🚀</span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-center leading-tight">{step.title}</span>
                
                {/* Milestone Expansion internal sub window explicitly mapped dynamically vertically structured tracking sub scroll */}
                <NodeExpansion 
                  step={step} 
                  isFocusExpanded={isFocusExpanded} 
                  subScroll={subScroll || 0}
                  isDarkVariant={true} 
                />
              </div>
            ) : (
              <>
                {/* Vertically Centered Tooltip Card */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${positionClasses} ${isFocusExpanded ? 'w-[200px] max-w-[200px]' : 'w-[155px] max-w-[155px]'} bg-white dark:bg-zinc-900 px-3.5 py-3 rounded-2xl text-left shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-[400ms] z-30 border-[2px] ${isActiveOrApproaching ? 'border-emerald-500 scale-100 opacity-100' : 'border-slate-200 dark:border-zinc-700 scale-95 opacity-90'}`}>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-zinc-400 mb-0.5 font-bold">Phase {step.phase}</div>
                  <div className="text-[13px] font-extrabold text-slate-900 dark:text-zinc-100 leading-tight">{step.title}</div>
                  
                  {/* EXPANDING CONTENT mapped efficiently tracking inner component scroll mapping explicitly tightly */}
                  <NodeExpansion 
                    step={step} 
                    isFocusExpanded={isFocusExpanded} 
                    subScroll={subScroll || 0}
                    isDarkVariant={false} 
                  />
                </div>
                
                {/* Proximity Track Dot */}
                <div className={`w-5 h-5 bg-white dark:bg-zinc-800 border-[3.5px] rounded-full flex items-center justify-center transition-all duration-400 z-10 relative ${isActiveOrApproaching ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-300 dark:border-zinc-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-400 ${isActiveOrApproaching ? 'bg-emerald-500' : 'bg-transparent'}`} />
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};
