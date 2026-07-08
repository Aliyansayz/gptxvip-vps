
import React, { useState, useEffect } from 'react';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { HeartIcon, ActivityIcon, BookOpenText, ChevronDownIcon, PillIcon, LightbulbIcon, XCircleIcon } from '../../icons';
import { Activity, Stethoscope } from 'lucide-react';

interface ModuleProps {
    exercise: Exercise;
    onAnswered: (correct: boolean) => void;
}

import { CardiologyAnalogyVisual } from './CardiologyVisuals';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

const TheoryPane: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;

    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-red-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />

                        {(analogy || application) && <hr className="border-border opacity-50" />}

                        {analogy && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-4 h-4 text-yellow-500" />
                                    Real Life Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <CardiologyAnalogyVisual title={title} analogy={analogy} />
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-emerald-500" />
                                    Clinical Application
                                </h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Components for each Topic ---

const AnatomyView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleClick = (part: string) => {
        if (showResult) return;
        setSelected(part);
        const correct = part === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Structure!");
        else toast.error("Incorrect Structure.");
    };

    return (
        <div className="space-y-6">
            <div className="relative h-80 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                <svg viewBox="0 0 200 200" className="h-full w-auto animate-pulse" style={{animationDuration: '1.2s'}}>
                    {/* Simplified Heart with Conduction System */}
                    <path d="M60 50 Q 30 30, 20 80 Q 10 150, 100 190 Q 190 150, 180 80 Q 170 30, 140 50 Q 100 80, 60 50" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                    
                    {/* SA Node */}
                    <g onClick={() => handleClick("SA Node")} className="cursor-pointer hover:opacity-80">
                        <circle cx="50" cy="60" r="6" fill="#fbbf24" className="animate-ping" style={{animationDuration: '1.2s'}} />
                        <circle cx="50" cy="60" r="4" fill="#f59e0b" />
                        <text x="30" y="55" fill="white" fontSize="8" fontWeight="bold">SA Node</text>
                    </g>
 
                    {/* AV Node */}
                    <g onClick={() => handleClick("AV Node")} className="cursor-pointer hover:opacity-80">
                        <circle cx="90" cy="90" r="5" fill="#f59e0b" />
                        <text x="100" y="90" fill="white" fontSize="8" fontWeight="bold">AV Node</text>
                    </g>
 
                    {/* Pathways */}
                    <path d="M50 60 Q 70 70, 90 90" stroke="#fbbf24" strokeDasharray="3 2" strokeWidth="1.5" fill="none" className="animate-dash" />
                    <path d="M90 90 L 95 110 L 80 140" stroke="#fbbf24" strokeWidth="2" fill="none" />
                    <path d="M95 110 L 110 140" stroke="#fbbf24" strokeWidth="2" fill="none" />
                    
                    {/* Purkinje */}
                    <g onClick={() => handleClick("Purkinje Fibers")} className="cursor-pointer hover:opacity-80">
                        <path d="M80 140 Q 60 160, 40 120" stroke="#fbbf24" strokeWidth="1" fill="none" />
                        <path d="M110 140 Q 130 160, 160 120" stroke="#fbbf24" strokeWidth="1" fill="none" />
                        <text x="100" y="170" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Purkinje Fibers</text>
                    </g>
                </svg>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-slate-400">
                    <Activity className="w-4 h-4" />
                    <span>Rate: 60 BPM</span>
                </div>
            </div>
            {showResult && <div className="text-center font-bold text-lg p-3 rounded bg-muted/50">{selected === exercise.answer ? <span className="text-green-500">Correct! The SA Node initiates the rhythm.</span> : <span className="text-red-500">Incorrect. Try again.</span>}</div>}
        </div>
    );
};

const HemodynamicsView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    const [afterload, setAfterload] = useState(50);
    const [bp, setBp] = useState(120);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Simple simulation logic: Higher afterload = Higher BP required to pump
        setBp(120 + (afterload - 50) * 1.5);
    }, [afterload]);

    const check = () => {
        const correct = afterload > 70; // Assuming question asks for increased afterload
        setSubmitted(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Relationship Observed");
        else toast.error("Try increasing the afterload more.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-6 rounded-xl border border-border">
                <div className="text-center w-1/3">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-2">Afterload (Resistance)</div>
                    <input type="range" min="0" max="100" value={afterload} onChange={(e) => setAfterload(Number(e.target.value))} className="w-full mt-2 accent-red-500 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer" disabled={submitted}/>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">→</div>
                <div className="text-center w-1/3 bg-card border rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-1">Systolic BP</div>
                    <div className="text-4xl font-mono text-red-500 font-bold">{Math.round(bp)} <span className="text-sm text-muted-foreground">mmHg</span></div>
                </div>
            </div>
            
            <div className="h-48 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-slate-700">
                {/* Visualizing vessel constriction */}
                <div className="flex items-center w-full px-12 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-xs">Heart</div>
                    <div 
                        className="h-16 bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300 rounded-r-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse" 
                        style={{ width: '40%', animationDuration: `${60000 / (60 + (afterload/2))}ms` }} // Heart beats faster with more resistance
                    />
                    {/* The Vessel */}
                    <div className="flex-1 h-20 mx-2 flex flex-col justify-center relative">
                        <div className="w-full bg-pink-300 transition-all duration-300 absolute top-0" style={{ height: `${20 + (afterload/3)}px` }} /> {/* Top Wall */}
                        <div className="w-full bg-pink-300 transition-all duration-300 absolute bottom-0" style={{ height: `${20 + (afterload/3)}px` }} /> {/* Bottom Wall */}
                        <div className="w-full h-full flex items-center justify-center">
                             {/* Arrows indicating flow */}
                             <div className="flex space-x-8 opacity-50">
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                             </div>
                        </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold text-xs">Body</div>
                </div>
                <span className="absolute bottom-2 text-slate-400 text-xs font-mono">Arterial Diameter Simulation</span>
            </div>

            {!submitted && (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { if(afterload > 60) check(); else { setSubmitted(true); onAnswered(false); toast.error("Incorrect"); } }} className="p-4 border rounded-lg hover:bg-muted font-medium transition-colors">BP Increases</button>
                    <button onClick={() => { setSubmitted(true); onAnswered(false); toast.error("Incorrect"); }} className="p-4 border rounded-lg hover:bg-muted font-medium transition-colors">BP Decreases</button>
                </div>
            )}
        </div>
    );
};

const ImagingView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    const [view, setView] = useState<'normal' | 'dilated'>('normal');
    const [submitted, setSubmitted] = useState(false);

    const handleAnswer = (option: string) => {
        const correct = option === exercise.answer;
        setSubmitted(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Interpretation!");
        else toast.error("Incorrect.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setView('normal')} className={`px-6 py-2 rounded-full font-medium transition-colors ${view === 'normal' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>Normal Heart</button>
                <button onClick={() => setView('dilated')} className={`px-6 py-2 rounded-full font-medium transition-colors ${view === 'dilated' ? 'bg-red-600 text-white shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>Dilated CM</button>
            </div>

            <div className="h-72 bg-black rounded-xl border-4 border-slate-800 relative flex items-center justify-center overflow-hidden">
                {/* Simulated Echo Cone */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_70%)] z-10 pointer-events-none"></div>
                <div className="w-full h-full border-t-[120px] border-l-[80px] border-r-[80px] border-t-slate-900/90 border-l-transparent border-r-transparent opacity-40 absolute top-0 pointer-events-none"></div>
                
                {/* Sector Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] border border-cyan-900/30 rounded-full opacity-30" style={{clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}></div>

                <svg viewBox="0 0 200 200" className="h-full w-full max-w-sm">
                    {/* Heart Walls */}
                    {view === 'normal' ? (
                        <path d="M70 60 Q 100 180, 130 60" fill="none" stroke="#e2e8f0" strokeWidth="15" className="animate-pulse origin-top" style={{animationDuration: '0.8s'}} />
                    ) : (
                        <path d="M50 60 Q 100 220, 150 60" fill="none" stroke="#e2e8f0" strokeWidth="5" className="animate-pulse origin-top" style={{animationDuration: '0.6s'}} />
                    )}
                    {/* Blood Pool (Simulated) */}
                    {view === 'normal' ? (
                         <path d="M78 60 Q 100 170, 122 60" fill="#1e293b" className="animate-pulse origin-top" style={{animationDuration: '0.8s'}}/>
                    ) : (
                         <path d="M55 60 Q 100 210, 145 60" fill="#1e293b" className="animate-pulse origin-top" style={{animationDuration: '0.6s'}}/>
                    )}
                </svg>
                
                {/* Info Overlay */}
                <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-xs bg-black/50 p-2 rounded border border-cyan-900">
                    FR: 60Hz <br/>
                    D: 16cm <br/>
                    MI: 1.2 <br/>
                    {view === 'normal' ? 'EF: 65%' : 'EF: 30%'}
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-white text-xs font-bold uppercase">Live</span>
                </div>
            </div>

            <div className="grid gap-2">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={submitted} className="p-4 text-left border rounded-lg hover:bg-muted transition-colors disabled:opacity-50">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LabsView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    return (
        <div className="space-y-6">
            <div className="h-72 bg-card border rounded-xl p-6 relative flex flex-col">
                <div className="flex-1 relative border-l border-b border-muted-foreground/30">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none">
                        {[...Array(24)].map((_, i) => <div key={i} className="border-r border-t border-muted-foreground/10"></div>)}
                    </div>

                    {/* Chart Bars/Lines */}
                    <div className="absolute inset-0 flex items-end px-2 pb-0 gap-4">
                        {/* Time Axis Markers implicitly spaced */}
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-blue-400/50 h-[10%] rounded-t transition-all hover:bg-blue-400"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Myoglobin (1hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-green-500/50 h-[40%] rounded-t transition-all hover:bg-green-500"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">CK-MB (12hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600 h-[90%] rounded-t shadow-lg hover:brightness-110 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (24hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600/60 h-[60%] rounded-t hover:bg-red-600/80 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (48hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600/30 h-[30%] rounded-t hover:bg-red-600/50 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (5 days)</span>
                        </div>
                    </div>
                </div>
                
                {/* X Axis Label */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                    <span>Onset</span>
                    <span>1 Day</span>
                    <span>5 Days</span>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 space-y-2 bg-background/80 p-3 rounded-lg border shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm"></div> <span className="text-xs font-bold">Troponin</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> <span className="text-xs">CK-MB</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> <span className="text-xs">Myoglobin</span></div>
                </div>
            </div>
            
            <div className="grid gap-2">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        onAnswered(correct);
                        if(correct) toast.success("Correct Analysis"); else toast.error("Incorrect");
                    }} className="p-4 border rounded-lg hover:bg-muted text-left transition-colors">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const PharmaView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    const [hr, setHr] = useState(100);
    const [drugGiven, setDrugGiven] = useState<string | null>(null);
    const [trace, setTrace] = useState<number[]>(new Array(50).fill(50));

    useEffect(() => {
        const interval = setInterval(() => {
            setTrace(prev => {
                const next = [...prev.slice(1), 50 + Math.random() * 10 - 5];
                return next;
            });

            if (drugGiven === 'Beta Blocker' && hr > 60) {
                setHr(h => Math.max(60, h - 1));
            } else if (drugGiven && drugGiven !== 'Beta Blocker') {
                setHr(100); // Reset or maintain high
            }
        }, 100);
        return () => clearInterval(interval);
    }, [drugGiven, hr]);

    const handleGive = (drug: string) => {
        setDrugGiven(drug);
        if (drug === 'Beta Blocker') {
            setTimeout(() => {
                onAnswered(true);
                toast.success("Heart Rate Decreasing!");
            }, 1000);
        } else {
            toast.info("No significant change in HR.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-black text-green-500 font-mono p-6 rounded-xl border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs opacity-50 uppercase tracking-widest">HR Monitor</div>
                <div className="flex items-center justify-center gap-6 mb-4">
                    <HeartIcon className="w-12 h-12 text-red-600 animate-pulse" style={{animationDuration: `${60/hr}s`}} />
                    <div className="text-6xl font-bold tracking-tighter">{Math.round(hr)} <span className="text-xl font-normal opacity-70">BPM</span></div>
                </div>
                {/* Live Trace */}
                <div className="h-16 flex items-end gap-[2px] opacity-70">
                    {trace.map((val, i) => (
                        <div key={i} className="bg-green-500 w-1 rounded-t-sm" style={{ height: `${val}%`, opacity: i/50 }} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <button onClick={() => handleGive("Beta Blocker")} className="group p-4 bg-card border rounded-xl hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PillIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="font-bold text-sm">Beta Blocker</span>
                </button>
                <button onClick={() => handleGive("Diuretic")} className="group p-4 bg-card border rounded-xl hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PillIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="font-bold text-sm">Diuretic</span>
                </button>
                <button onClick={() => handleGive("Statin")} className="group p-4 bg-card border rounded-xl hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PillIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="font-bold text-sm">Statin</span>
                </button>
            </div>
            
            <p className="text-center text-muted-foreground text-sm bg-muted/50 p-2 rounded">Goal: Treat Tachycardia (HR {'>'} 100)</p>
        </div>
    );
};

const PathoView: React.FC<ModuleProps> = ({ exercise, onAnswered }) => {
    // Visualizing plaque rupture
    const [ruptured, setRuptured] = useState(false);

    return (
        <div className="space-y-6">
            <div 
                className="h-48 bg-pink-50 dark:bg-pink-950/20 rounded-xl relative overflow-hidden flex items-center border border-pink-200 cursor-pointer group" 
                onClick={() => setRuptured(true)}
            >
                <div className="absolute top-2 left-4 text-xs font-bold text-red-800 uppercase z-20 group-hover:scale-105 transition-transform">Click to Simulate Rupture</div>
                
                {/* Artery Walls */}
                <div className="absolute top-0 w-full h-6 bg-red-800 shadow-sm z-10"></div>
                <div className="absolute bottom-0 w-full h-6 bg-red-800 shadow-sm z-10"></div>
                
                {/* Plaque */}
                <div className={`absolute bottom-6 left-1/3 w-40 h-20 bg-yellow-200 rounded-t-full border-t-4 border-yellow-400 transition-all duration-300 origin-bottom ${ruptured ? 'scale-y-75 border-red-600 border-dashed' : ''}`}>
                    {/* Lipid Core */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-yellow-400 rounded-t-full opacity-50 blur-sm"></div>
                </div>
                
                {/* Blood Flow Particles */}
                <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className={`flex gap-4 animate-flow ${ruptured ? 'opacity-20' : ''}`}>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
                        ))}
                    </div>
                </div>

                {ruptured && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <div className="w-24 h-24 bg-red-600 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white p-2 rounded-full shadow-lg animate-bounce">
                                <XCircleIcon className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {exercise.options?.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswered(opt === exercise.answer)}
                        className="p-4 bg-card border rounded-xl hover:bg-muted transition-colors text-left font-medium"
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const AdvancedCardiologyModules = {
    PharmaView,
    PathoView
};