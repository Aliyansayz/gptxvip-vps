import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Code2, X } from 'lucide-react';
import { HFTJourneyExplainerQuestion, HFTJourneyExplainerNode } from '../../../types';

interface HFTJourneyExplainerProps {
    question: HFTJourneyExplainerQuestion;
    themeColor?: string;
    onBack: () => void;
    isDarkMode?: boolean;
}

const HFTNodeExpansion: React.FC<{ 
    node: HFTJourneyExplainerNode; 
    isFocusExpanded: boolean; 
    subScroll: number; 
    setActiveSnippet: (s: any) => void;
}> = ({ node, isFocusExpanded, subScroll, setActiveSnippet }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (scrollRef.current && isFocusExpanded) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        scrollRef.current.scrollTop = maxScroll * ((subScroll || 0) / 100);
      }
    }, [subScroll, isFocusExpanded]);
  
    return (
      <div className={`transition-all duration-[500ms] ease-in-out relative flex w-full ${isFocusExpanded && node.classes && node.classes.length > 0 ? 'h-[60px] opacity-100 mt-2 pt-1 border-t border-slate-100' : 'h-0 opacity-0 mt-0 overflow-hidden border-t border-transparent'}`}>
        {isFocusExpanded && (
            <div className="absolute left-0 top-1 bottom-1 w-2 flex justify-center pointer-events-none z-10 py-1">
                <div className="w-[1.5px] h-full bg-slate-200 relative rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 w-full bg-emerald-500 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(5, subScroll)}%` }}
                    />
                </div>
            </div>
        )}
        <div 
          ref={scrollRef} 
          className="overflow-y-auto flex flex-col gap-1 relative z-10 w-full pl-3 pr-1 py-1 h-full scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {node.classes?.map((cls, idx) => (
              <button 
                  key={idx} 
                  onClick={() => cls.snippet && setActiveSnippet({ name: cls.name, code: cls.snippet })}
                  className="text-left px-1.5 flex-grow-0 py-1.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 hover:border-emerald-200 cursor-pointer transition-colors group flex items-start justify-between shrink-0 mb-1"
              >
                  <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex items-center gap-1">
                          <Code2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                          <span className="text-[8px] font-mono font-bold text-slate-700 group-hover:text-emerald-700 transition-colors truncate">{cls.name}</span>
                      </div>
                      {cls.desc && <div className="text-[7px] text-slate-500 leading-tight pl-3.5 pr-1 text-left whitespace-normal break-words">{cls.desc}</div>}
                  </div>
                  {cls.snippet && <div className="text-[6px] uppercase tracking-wider text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 mt-0.5 bg-emerald-100 px-1 py-0.5 rounded">View</div>}
              </button>
          ))}
        </div>
      </div>
    );
};

export const HFTJourneyExplainer: React.FC<HFTJourneyExplainerProps> = ({ question, themeColor, onBack, isDarkMode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapWorldRef = useRef<HTMLDivElement>(null);
    const weaveCanvasRef = useRef<HTMLCanvasElement>(null);
    const ribbonHeadRef = useRef<HTMLDivElement>(null);

    const [currentProgress, setCurrentProgress] = useState(0);
    const [statusText, setStatusText] = useState("Ready");
    const [activeSnippet, setActiveSnippet] = useState<{name: string, code: string} | null>(null);
    const targetScrollProgress = useRef(0);
    
    const lockedNodeRef = useRef<number | null>(null);
    const subScrollRef = useRef<number>(0);
    const lockedNodeIdStateRef = useRef<number | null>(null);
    const subScrollStateRef = useRef<number>(0);

    const [lockedNodeId, setLockedNodeId] = useState<number | null>(null);
    const [subScroll, setSubScroll] = useState<number>(0);

    const nodes = question.nodes || [];
    
    // Sort nodes to ensure proper sequential lines
    const sortedNodes = useMemo(() => {
        return [...nodes].sort((a, b) => a.id - b.id);
    }, [nodes]);

    const points = useMemo(() => {
        return sortedNodes.map(n => ({ x: n.x, y: n.y }));
    }, [sortedNodes]);

    const sortedNodesRef = useRef(sortedNodes);
    sortedNodesRef.current = sortedNodes;

    const LERP_FACTOR = 0.08;
    const CAMERA_SCALE = 1.8;
    const RADIUS = 15;
    const SPIRAL_TURNS = 24;

    const pathData = useMemo(() => {
        let totalLen = 0;
        const segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            const dist = Math.sqrt(Math.pow(points[i + 1].x - points[i].x, 2) + Math.pow(points[i + 1].y - points[i].y, 2));
            segments.push({ start: points[i], end: points[i + 1], dist, cumulative: totalLen });
            totalLen += dist;
        }
        return { segments, totalPathLength: totalLen };
    }, [points]);

    const pathDataRef = useRef(pathData);
    pathDataRef.current = pathData;

    const getPointAtProgress = (p: number) => {
        if (pathData.segments.length === 0) return points.length > 0 ? { x: points[0].x, y: points[0].y, angle: 0 } : { x: 0, y: 0, angle: 0 };
        
        const targetDist = p * pathData.totalPathLength;
        for (let i = 0; i < pathData.segments.length; i++) {
            const seg = pathData.segments[i];
            if (targetDist >= seg.cumulative && targetDist <= seg.cumulative + seg.dist) {
                const t = (targetDist - seg.cumulative) / (seg.dist || 1);
                return {
                    x: seg.start.x + (seg.end.x - seg.start.x) * t,
                    y: seg.start.y + (seg.end.y - seg.start.y) * t,
                    angle: Math.atan2(seg.end.y - seg.start.y, seg.end.x - seg.start.x)
                };
            }
        }
        const last = points[points.length - 1];
        const secondLast = points[points.length - 2] || last;
        return { 
            x: last.x, 
            y: last.y, 
            angle: Math.atan2(last.y - secondLast.y, last.x - secondLast.x) 
        };
    };

    const draw3DWeave = (p: number, currentSmoothedProgress: number) => {
        if (!weaveCanvasRef.current) return;
        const ctx = weaveCanvasRef.current.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, weaveCanvasRef.current.width, weaveCanvasRef.current.height);
        if (points.length < 2) return;

        const segments = 500;
        const axisRotation = currentSmoothedProgress * Math.PI * 2.5;

        for (let strand = 0; strand < 2; strand++) {
            const phase = strand * Math.PI;
            let prevX: number | null = null, prevY: number | null = null;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                if (t > p && p < 1) continue;

                const basePt = getPointAtProgress(t);
                const twistAngle = (t * Math.PI * SPIRAL_TURNS) + phase;
                const leadingEdgeTaper = Math.min(1, (p - t) / 0.04);
                if (leadingEdgeTaper <= 0 && p < 1) continue;

                const currentRadius = RADIUS * Math.sqrt(Math.max(0, leadingEdgeTaper));
                const localY = Math.sin(twistAngle) * currentRadius;
                const zDepth = Math.cos(twistAngle) * currentRadius;

                const cosR = Math.cos(axisRotation);
                const sinR = Math.sin(axisRotation);
                const rotatedY = localY * cosR - zDepth * sinR;
                const rotatedZ = localY * sinR + zDepth * cosR;

                const finalX = basePt.x + (-Math.sin(basePt.angle) * rotatedY);
                const finalY = basePt.y + (Math.cos(basePt.angle) * rotatedY);

                if (prevX !== null && prevY !== null) {
                    const depthFactor = (rotatedZ + RADIUS) / (RADIUS * 2);
                    const alpha = (0.2 + (depthFactor * 0.75)) * (t > p ? 0 : 1);

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                    ctx.lineWidth = 1.2 + (depthFactor * 2.5);
                    ctx.lineCap = 'round';
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(finalX, finalY);
                    ctx.stroke();
                }
                prevX = finalX; prevY = finalY;
            }
        }
    };

    useEffect(() => {
        let currentSmoothedProgress = 0;
        let animationFrameId: number;

        const animate = () => {
            currentSmoothedProgress += (targetScrollProgress.current - currentSmoothedProgress) * LERP_FACTOR;
            const activePt = getPointAtProgress(currentSmoothedProgress);
            
            draw3DWeave(currentSmoothedProgress, currentSmoothedProgress);
            setCurrentProgress(currentSmoothedProgress);

            if (ribbonHeadRef.current) {
                ribbonHeadRef.current.style.left = `${activePt.x}px`;
                ribbonHeadRef.current.style.top = `${activePt.y}px`;
            }

            if (containerRef.current && mapWorldRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const tx = (containerRect.width / 2) - (activePt.x * CAMERA_SCALE);
                const ty = (containerRect.height / 2) - (activePt.y * CAMERA_SCALE);
                mapWorldRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${CAMERA_SCALE})`;
            }

            if (currentSmoothedProgress < 0.05) setStatusText("System Idle");
            else if (currentSmoothedProgress < 0.3) setStatusText("Market Ingress");
            else if (currentSmoothedProgress < 0.8) setStatusText("Internal Signal Processing");
            else if (currentSmoothedProgress < 0.98) setStatusText("Safety Guardrails Active");
            else setStatusText("Trade Executed");

            // Sync states avoiding loops
            if (lockedNodeRef.current !== lockedNodeIdStateRef.current) {
                lockedNodeIdStateRef.current = lockedNodeRef.current;
                setLockedNodeId(lockedNodeRef.current);
            }
            if (subScrollRef.current !== subScrollStateRef.current) {
                subScrollStateRef.current = subScrollRef.current;
                setSubScroll(subScrollRef.current);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [pathData, points]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            if (lockedNodeRef.current !== null) {
                const nextSubScroll = subScrollRef.current + (e.deltaY * 0.1);
                if (nextSubScroll > 100) {
                    subScrollRef.current = 100;
                    lockedNodeRef.current = null;
                    targetScrollProgress.current = Math.min(1, targetScrollProgress.current + 0.005);
                } else if (nextSubScroll < 0) {
                    subScrollRef.current = 0;
                    lockedNodeRef.current = null;
                    targetScrollProgress.current = Math.max(0, targetScrollProgress.current - 0.005);
                } else {
                    subScrollRef.current = nextSubScroll;
                }
                return;
            }

            const scrollAmount = e.deltaY * 0.0008;
            const nextTarget = targetScrollProgress.current + scrollAmount;
            
            let triggerNode = null;
            let startSubScroll = 0;
            
            for (let i = 0; i < sortedNodesRef.current.length; i++) {
                const node = sortedNodesRef.current[i];
                if (!node.classes || node.classes.length === 0) continue;
                
                const nodeDist = i === 0 ? 0 : pathDataRef.current.segments[i - 1].cumulative + pathDataRef.current.segments[i - 1].dist;
                const nodeProgress = nodeDist / pathDataRef.current.totalPathLength;
                
                const prev = targetScrollProgress.current;
                const next = nextTarget;
                
                if (prev < nodeProgress && next >= nodeProgress) {
                    triggerNode = node;
                    startSubScroll = 0;
                    break;
                }
                
                if (prev > nodeProgress && next <= nodeProgress) {
                    triggerNode = node;
                    startSubScroll = 100;
                    break;
                }
            }
            
            if (triggerNode) {
                lockedNodeRef.current = triggerNode.id;
                subScrollRef.current = startSubScroll;
                const idx = sortedNodesRef.current.findIndex(n => n.id === triggerNode.id);
                const nDist = idx === 0 ? 0 : pathDataRef.current.segments[idx - 1].cumulative + pathDataRef.current.segments[idx - 1].dist;
                targetScrollProgress.current = nDist / pathDataRef.current.totalPathLength;
            } else {
                targetScrollProgress.current = Math.max(0, Math.min(1, nextTarget));
            }
        };

        let lastTouchY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            lastTouchY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = lastTouchY - currentY;
            lastTouchY = currentY;
            
            if (lockedNodeRef.current !== null) {
                const nextSubScroll = subScrollRef.current + (deltaY * 0.1);
                if (nextSubScroll > 100) {
                    subScrollRef.current = 100;
                    lockedNodeRef.current = null;
                    targetScrollProgress.current = Math.min(1, targetScrollProgress.current + 0.005);
                } else if (nextSubScroll < 0) {
                    subScrollRef.current = 0;
                    lockedNodeRef.current = null;
                    targetScrollProgress.current = Math.max(0, targetScrollProgress.current - 0.005);
                } else {
                    subScrollRef.current = nextSubScroll;
                }
                e.preventDefault();
                return;
            }

            const scrollAmount = deltaY * 0.0008;
            const nextTarget = targetScrollProgress.current + scrollAmount;
            
            let triggerNode = null;
            let startSubScroll = 0;
            
            for (let i = 0; i < sortedNodesRef.current.length; i++) {
                const node = sortedNodesRef.current[i];
                if (!node.classes || node.classes.length === 0) continue;
                
                const nodeDist = i === 0 ? 0 : pathDataRef.current.segments[i - 1].cumulative + pathDataRef.current.segments[i - 1].dist;
                const nodeProgress = nodeDist / pathDataRef.current.totalPathLength;
                
                const prev = targetScrollProgress.current;
                const next = nextTarget;
                
                if (prev < nodeProgress && next >= nodeProgress) {
                    triggerNode = node;
                    startSubScroll = 0;
                    break;
                }
                
                if (prev > nodeProgress && next <= nodeProgress) {
                    triggerNode = node;
                    startSubScroll = 100;
                    break;
                }
            }
            
            if (triggerNode) {
                lockedNodeRef.current = triggerNode.id;
                subScrollRef.current = startSubScroll;
                const idx = sortedNodesRef.current.findIndex(n => n.id === triggerNode.id);
                const nDist = idx === 0 ? 0 : pathDataRef.current.segments[idx - 1].cumulative + pathDataRef.current.segments[idx - 1].dist;
                targetScrollProgress.current = nDist / pathDataRef.current.totalPathLength;
            } else {
                targetScrollProgress.current = Math.max(0, Math.min(1, nextTarget));
            }
            e.preventDefault();
        };

        const wrapper = document.getElementById('hft-scroll-container');
        if (wrapper) {
            wrapper.addEventListener('wheel', handleWheel, { passive: false });
            wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
            wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        return () => {
            if (wrapper) {
                wrapper.removeEventListener('wheel', handleWheel);
                wrapper.removeEventListener('touchstart', handleTouchStart);
                wrapper.removeEventListener('touchmove', handleTouchMove);
            }
        };
    }, []);

    // Full Screen Overlay styling
    return (
        <div className="w-full h-full relative overflow-hidden transition-colors duration-500 bg-slate-50 overscroll-none" id="hft-scroll-container">
            {/* Header / Back */}
            <div className="absolute top-4 left-4 z-[100] flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-full transition-all duration-500 shadow-2xl backdrop-blur-xl bg-white/50 hover:bg-white text-slate-900 border-slate-200"
                >
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Exit Explainer
                </button>
            </div>

            {/* Viewport tracking wrapper */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">Scroll to explore pipeline</div>
                <div ref={containerRef} className="relative w-[1100px] h-[650px] max-w-[95vw] max-h-[85vh] rounded-[32px] border shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden pointer-events-auto bg-white border-slate-200">
                    <div ref={mapWorldRef} className="absolute top-0 left-0 w-[1100px] h-[650px] origin-top-left will-change-transform">
                        <div className="absolute top-[-2000px] bottom-[-2000px] left-[-2000px] right-[-2000px] z-10" style={{ backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                        
                        <div className="absolute top-[40px] left-[50px] z-[5] pointer-events-none drop-shadow-md text-left">
                            <h2 className={`text-[8px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full inline-block border ${themeColor === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-indigo-700 bg-indigo-50 border-indigo-200'}`}>HFT Pipeline</h2>
                            <h1 className="text-sm font-black mt-0.5 tracking-tight text-slate-900 drop-shadow-sm whitespace-nowrap">{question.title || 'HFT Engine Pipeline'}</h1>
                        </div>

                        <canvas ref={weaveCanvasRef} width="1100" height="650" className="absolute inset-0 z-10 pointer-events-none" />
                        <div ref={ribbonHeadRef} className="absolute top-0 left-0 w-3 h-3 border-[3px] rounded-full z-25 -ml-[6px] -mt-[6px] will-change-transform z-30 bg-white border-emerald-500 shadow-[0_0_15px_4px_rgba(16,185,129,0.2)]" />

                        {sortedNodes.map((node, idx) => {
                            const nodeDist = idx === 0 ? 0 : pathData.segments[idx - 1].cumulative + pathData.segments[idx - 1].dist;
                            const nodeProgress = pathData.totalPathLength > 0 ? nodeDist / pathData.totalPathLength : 0;
                            const distance = nodeProgress - currentProgress;
                            
                            let state = 'inactive';
                            let proximity = 0;

                            if (distance <= 0) {
                                state = 'active';
                                proximity = 1;
                            } else if (distance < 0.1) {
                                state = 'approaching';
                                proximity = 1 - (distance / 0.1);
                            }

                            const isActiveOrApproaching = state === 'active' || state === 'approaching';
                            const isFocusExpanded = lockedNodeId === node.id;

                            return (
                                <div 
                                    key={node.id} 
                                     className={`absolute z-20 flex flex-col items-center will-change-transform ${isFocusExpanded ? 'z-50' : ''}`} 
                                    style={{ 
                                        left: node.x, 
                                        top: node.y,
                                        transform: state === 'active' 
                                            ? 'translate(-50%, -100%) scale(1.05)' 
                                            : `translate(-50%, -100%) scale(${1 + proximity * 0.05})`,
                                        filter: state === 'active' 
                                            ? 'grayscale(0%) opacity(100%)' 
                                            : `grayscale(${100 - proximity * 100}%) opacity(${60 + proximity * 40}%)`,
                                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease-out'
                                    }}
                                >
                                    {(node as any).isStart ? (
                                        <div className="flex flex-col items-center -mt-2">
                                            <div className="bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5 text-[7px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                                                Start
                                            </div>
                                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mt-1 animate-ping" />
                                        </div>
                                    ) : !node.isFinish ? (
                                        <>
                                            <div className={`relative p-1 rounded-[12px] text-left shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-[400ms] z-30 border-[1.5px] bg-white pointer-events-none -mt-4 ${isFocusExpanded ? 'w-[150px] max-w-[150px]' : 'w-[70px] max-w-[70px]'} ${isActiveOrApproaching ? 'border-emerald-500 scale-100 opacity-100' : 'border-slate-200 scale-95 opacity-90'}`}>
                                                {node.phase && <div className="text-[8px] uppercase tracking-[0.1em] text-slate-500 mb-0.5 font-bold">Phase {node.phase}</div>}
                                                <div className={`${isFocusExpanded ? 'text-[8.5px]' : 'text-[11px]'} font-extrabold text-slate-900 leading-tight transition-all duration-300`}>{node.title}</div>
                                                <div className="text-[8.5px] font-medium text-slate-600 mt-0.5 leading-tight">{node.desc}</div>
                                                
                                                <div className="pointer-events-auto">
                                                    <HFTNodeExpansion 
                                                        node={node}
                                                        isFocusExpanded={isFocusExpanded}
                                                        subScroll={subScroll}
                                                        setActiveSnippet={setActiveSnippet}
                                                    />
                                                </div>
                                            </div>
                                            {/* Proximity Track Dot */}
                                            <div className={`w-5 h-5 bg-white border-[3.5px] rounded-full flex items-center justify-center transition-all duration-400 z-10 absolute bottom-[0px] translate-y-1/2 left-1/2 -translate-x-1/2 ${isActiveOrApproaching ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-300'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-400 ${isActiveOrApproaching ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className={`transition-all duration-[500ms] ease-in-out ${isFocusExpanded ? 'w-[150px] max-w-[150px]' : 'w-[70px] max-w-[70px]'} rounded-[20px] p-1 flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-[2px] bg-white border-slate-300 -mt-8 ${isActiveOrApproaching ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-transparent text-white shadow-[0_25px_50px_rgba(16,185,129,0.3)] animate-[float_4s_ease-in-out_infinite]' : ''}`}>
                                            <span className="text-[24px] mb-1 leading-none">🚀</span>
                                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-center leading-tight">{node.title}</span>
                                            <div className="text-[7px] font-bold text-center uppercase tracking-wider leading-tight mt-0.5 opacity-80">{node.desc.split('💰')[0] || node.desc}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Stats */}
                    <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center z-30 backdrop-blur-md px-6 py-4 rounded-2xl border shadow-xl pointer-events-none bg-white/90 border-slate-200">
                        <div className="flex gap-10 w-full justify-between items-center">
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Pipe State</div>
                                <div className="font-bold text-lg text-slate-800">{statusText}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Latency Optimization</div>
                                <div className="font-mono font-bold text-lg text-emerald-500">{Math.round(currentProgress * 100)}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Snippet Overlay */}
                    <AnimatePresence>
                        {activeSnippet && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8 pointer-events-auto"
                                onClick={() => setActiveSnippet(null)}
                            >
                                <motion.div 
                                    initial={{ y: 20, scale: 0.95 }}
                                    animate={{ y: 0, scale: 1 }}
                                    exit={{ y: 20, scale: 0.95 }}
                                    onClick={e => e.stopPropagation()}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden w-[500px] max-w-full flex flex-col"
                                >
                                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-emerald-500" />
                                            <span className="font-mono font-bold text-sm text-slate-700">{activeSnippet.name}</span>
                                        </div>
                                        <button onClick={() => setActiveSnippet(null)} className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4 bg-slate-900 overflow-x-auto">
                                        <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed">
                                            <code>{activeSnippet.code}</code>
                                        </pre>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
