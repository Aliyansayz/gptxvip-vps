
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { CheckCircle, XCircle, Atom, Play, Flame, Activity, ScanBarcode, Layers, Zap } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface ChapterProps {
  labData: LabData;
  onComplete: () => void;
  onBack: () => void;
  step: number;
  setStep: (updater: number | ((s: number) => number)) => void;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
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
                    <BookOpenText className="w-5 h-5 text-violet-500" />
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
                        
                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}

                        
                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
                        )}
                        {(analogy || application) && <hr className="border-border opacity-50" />}
                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-3 h-3 text-blue-500" /> Application
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

// --- Theory Visuals ---

export const FoldingFunnelVisual = () => (
    <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900">
        <h4 className="text-[10px] font-bold text-violet-600 uppercase tracking-widest text-center mb-4">Energy Funnel</h4>
        <div className="flex justify-center">
            <svg viewBox="0 0 200 150" className="w-full h-32">
                {/* Funnel Shape */}
                <path d="M 10 10 Q 100 150, 190 10" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                {/* Unfolded State (High Energy) */}
                <circle cx="20" cy="20" r="5" fill="#ef4444" />
                <text x="30" y="25" fontSize="10" fill="#ef4444">Unfolded (High Energy)</text>
                {/* Folded State (Low Energy) */}
                <circle cx="100" cy="130" r="5" fill="#22c55e" />
                <text x="110" y="135" fontSize="10" fill="#22c55e">Native (Low Energy)</text>
                {/* Path */}
                <path d="M 20 20 Q 60 80, 100 130" fill="none" stroke="#cbd5e1" strokeDasharray="4 2" />
            </svg>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Proteins naturally fold to find their lowest energy state.</p>
    </div>
);

export const StructureHierarchyTheoryVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Building Blocks</h4>
        <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-[8px] mt-1">Primary</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex flex-col items-center">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M 5 0 Q 15 5, 5 10 Q -5 15, 5 20" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
                <span className="text-[8px] mt-1">Secondary</span>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 blur-[1px]"></div>
                <span className="text-[8px] mt-1">Tertiary</span>
            </div>
        </div>
    </div>
);

export const DenaturationTheoryVisual = () => (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Heat = Chaos</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">3D</div>
            <div className="text-red-500 font-bold text-lg">🔥</div>
            <svg width="40" height="20" viewBox="0 0 40 20">
                <path d="M 0 10 Q 10 0, 20 10 T 40 10" fill="none" stroke="#ef4444" strokeWidth="2" />
            </svg>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Heat breaks weak bonds, causing the protein to unravel.</p>
    </div>
);

export const MassSpecTheoryVisual = () => (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-900">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center mb-4">Sorting by Weight</h4>
        <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            <div className="w-8 h-8 rounded-full bg-blue-600"></div>
            <div className="text-slate-400">→</div>
            <div className="flex flex-col items-end gap-1 border-l-2 border-b-2 border-slate-400 p-1 w-16 h-12">
                <div className="w-1 h-2 bg-blue-600"></div>
                <div className="w-1 h-4 bg-blue-500"></div>
                <div className="w-1 h-8 bg-blue-400"></div>
            </div>
        </div>
    </div>
);

export const GelTheoryVisual = () => (
    <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl border border-cyan-100 dark:border-cyan-900">
        <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest text-center mb-4">Molecular Sieve</h4>
        <div className="relative h-20 bg-cyan-200/50 rounded border border-cyan-300 overflow-hidden">
            {/* Mesh pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxwYXRoIGQ9Ik0gMCA0IEwgNCAwIiBzdHJva2U9IiNhNWYzbfc2IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-50"></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 animate-bounce" style={{animationDuration: '1.5s'}}></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Small molecules move faster through the gel mesh than large ones.</p>
    </div>
);

export const WesternBlotTheoryVisual = () => (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Antibody Sandwich</h4>
        <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 bg-indigo-500 rounded-sm"></div>
            <div className="text-xs">Target</div>
            <div className="text-indigo-400">↓</div>
            <div className="text-blue-500 font-bold">Y</div>
            <div className="text-[8px]">Primary Ab</div>
            <div className="text-indigo-400">↓</div>
            <div className="text-red-500 font-bold">Y*</div>
            <div className="text-[8px]">Secondary Ab</div>
        </div>
    </div>
);

// --- Visual Components ---

const FoldingVisual: React.FC<{ progress: number }> = ({ progress }) => {
    // Calculate protein folding positions based on progress (0-100)
    const t = progress / 100;
    
    // Simple 8-residue chain
    const basePositions = [
      { x: 50, y: 100, type: 'phobic' }, { x: 100, y: 100, type: 'philic' }, 
      { x: 150, y: 100, type: 'phobic' }, { x: 200, y: 100, type: 'philic' }, 
      { x: 250, y: 100, type: 'phobic' }, { x: 300, y: 100, type: 'philic' },
      { x: 350, y: 100, type: 'phobic' }, { x: 400, y: 100, type: 'philic' }
    ];
    
    // Folded state: phobics cluster in middle (approx 225, 150)
    const foldedPositions = [
      { x: 200, y: 140 }, { x: 150, y: 100 }, 
      { x: 220, y: 160 }, { x: 280, y: 100 }, 
      { x: 240, y: 140 }, { x: 320, y: 150 },
      { x: 225, y: 120 }, { x: 180, y: 60 }
    ];

    const currentPositions = basePositions.map((base, i) => ({
      x: base.x + (foldedPositions[i].x - base.x) * t,
      y: base.y + (foldedPositions[i].y - base.y) * t,
      type: base.type
    }));

    return (
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="absolute top-2 left-2 text-xs font-bold text-blue-500 uppercase">Aqueous Environment (H₂O)</div>
            <svg viewBox="0 0 450 250" className="w-full h-64">
                {/* Water molecules bg */}
                {Array.from({length: 20}).map((_, i) => (
                    <circle key={i} cx={Math.random()*450} cy={Math.random()*250} r={2} fill="#bfdbfe" opacity={0.5} />
                ))}

                {/* Chain */}
                <path 
                    d={`M ${currentPositions.map(p => `${p.x},${p.y}`).join(' L ')}`} 
                    fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
                />

                {/* Residues */}
                {currentPositions.map((pos, i) => (
                    <g key={i}>
                        <circle 
                            cx={pos.x} cy={pos.y} r={12} 
                            fill={pos.type === 'phobic' ? '#f59e0b' : '#3b82f6'} 
                            stroke="white" strokeWidth="2"
                        />
                        <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                            {pos.type === 'phobic' ? 'Φ' : '+'}
                        </text>
                    </g>
                ))}
            </svg>
            <div className="flex justify-center gap-6 mt-2 text-xs font-medium">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Hydrophobic</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Hydrophilic</div>
            </div>
        </div>
    );
};

const StructureLevelsVisual: React.FC<{ level: string }> = ({ level }) => {
    return (
        <div className="h-64 bg-slate-50 dark:bg-slate-900 rounded-xl border flex items-center justify-center p-8 relative overflow-hidden">
            {level === 'Primary' && (
                <div className="flex items-center animate-fade-in gap-1 flex-wrap justify-center">
                    {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                {String.fromCharCode(65 + i)}
                            </div>
                            {i < 9 && <div className="w-4 h-1 bg-slate-400"></div>}
                        </div>
                    ))}
                    <p className="absolute bottom-4 text-muted-foreground text-sm">Sequence of Amino Acids</p>
                </div>
            )}
            {level === 'Secondary' && (
                <div className="flex gap-12 animate-fade-in">
                    <div className="flex flex-col items-center">
                        <svg viewBox="0 0 50 150" className="w-24 h-48 drop-shadow-lg">
                            <path d="M 25 10 Q 50 20, 25 30 Q 0 40, 25 50 Q 50 60, 25 70 Q 0 80, 25 90 Q 50 100, 25 110 Q 0 120, 25 130" fill="none" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-bold mt-2">Alpha Helix</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <svg viewBox="0 0 80 150" className="w-24 h-48 drop-shadow-lg">
                            <path d="M 10 10 L 30 30 L 50 10 M 10 50 L 30 70 L 50 50 M 10 90 L 30 110 L 50 90" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                            <line x1="20" y1="30" x2="20" y2="50" stroke="black" strokeDasharray="2 2" strokeOpacity="0.5" />
                        </svg>
                        <span className="text-sm font-bold mt-2">Beta Sheet</span>
                    </div>
                </div>
            )}
            {level === 'Tertiary' && (
                <div className="animate-fade-in relative">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
                        <path d="M 50 150 C 20 100, 80 50, 100 100 C 120 150, 180 100, 150 50 C 120 0, 20 50, 50 150" 
                              fill="none" stroke="#8b5cf6" strokeWidth="12" strokeLinecap="round" />
                        {/* Disulfide bond */}
                        <line x1="65" y1="120" x2="135" y2="70" stroke="#fbbf24" strokeWidth="4" strokeDasharray="4 2" />
                        <circle cx="65" cy="120" r="4" fill="#f59e0b"/>
                        <circle cx="135" cy="70" r="4" fill="#f59e0b"/>
                    </svg>
                    <p className="absolute -bottom-6 w-full text-center text-muted-foreground text-sm">3D Folding (with S-S bridges)</p>
                </div>
            )}
            {level === 'Quaternary' && (
                <div className="animate-fade-in relative">
                    <div className="grid grid-cols-2 gap-0">
                        <div className="w-24 h-24 bg-red-400 rounded-full opacity-80 blur-sm translate-x-4 translate-y-4"></div>
                        <div className="w-24 h-24 bg-blue-400 rounded-full opacity-80 blur-sm -translate-x-4 translate-y-4"></div>
                        <div className="w-24 h-24 bg-green-400 rounded-full opacity-80 blur-sm translate-x-4 -translate-y-4"></div>
                        <div className="w-24 h-24 bg-yellow-400 rounded-full opacity-80 blur-sm -translate-x-4 -translate-y-4"></div>
                    </div>
                    <p className="absolute -bottom-8 w-full text-center text-muted-foreground text-sm">Multiple Subunits (e.g. Hemoglobin)</p>
                </div>
            )}
        </div>
    );
};

const DenaturationVisual: React.FC<{ temp: number }> = ({ temp }) => {
    // Temp 0-100. At 0: folded. At 100: unravelled.
    const t = temp / 100;
    
    // Simple path morph
    // Folded: M 50 150 C 20 100, 80 50, 100 100 C 120 150, 180 100, 150 50
    // Unfolded: M 20 100 C 60 120, 100 80, 140 100 C 180 120, 220 80, 260 100
    
    // Simulating chaos with animation speed
    const shakeSpeed = 0.1 + (t * 2); 

    return (
        <div className="h-64 bg-slate-50 dark:bg-slate-900 rounded-xl border p-4 flex flex-col items-center justify-center relative">
            <div className={`absolute inset-0 bg-red-500 transition-opacity duration-500 pointer-events-none`} style={{opacity: t * 0.2}}></div>
            <div className="absolute top-2 right-2 flex items-center gap-1 font-bold text-red-500">
                <Flame className="w-5 h-5" /> {37 + (t * 60)}°C
            </div>
            
            <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                <path 
                    d={t < 0.5 
                        ? "M 100 150 C 70 100, 130 50, 150 100 C 170 150, 230 100, 200 50" // Folded
                        : "M 50 100 C 100 130, 150 70, 200 100 C 250 130, 300 70, 350 100" // Unfolded
                    }
                    fill="none" 
                    stroke={t < 0.5 ? "#8b5cf6" : "#64748b"} 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{
                        animation: `shake ${1/shakeSpeed}s infinite linear`,
                        transformOrigin: 'center'
                    }}
                />
            </svg>
            <style>{`@keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }`}</style>
            
            <div className="mt-4 text-center font-bold text-lg">
                {t < 0.5 ? <span className="text-green-500">Functional</span> : <span className="text-red-500">Denatured (Inactive)</span>}
            </div>
        </div>
    );
};

const MassSpecVisual: React.FC = () => {
    // Static mass spec chart
    return (
        <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border p-4 relative flex items-end">
            {/* Grid */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 border-l border-b border-slate-300 dark:border-slate-700 m-8"></div>
            
            {/* Peaks */}
            <div className="absolute bottom-8 left-8 right-8 top-8 flex items-end">
                <div className="w-[10%] h-[20%] bg-blue-200 mx-1"></div>
                <div className="w-[5%] h-[80%] bg-violet-600 mx-1 relative group cursor-pointer">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1200 Da</div>
                </div>
                <div className="w-[15%] h-[10%] bg-blue-200 mx-1"></div>
                <div className="w-[5%] h-[60%] bg-violet-500 mx-1 relative group cursor-pointer">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">850 Da</div>
                </div>
                <div className="w-[20%] h-[5%] bg-blue-200 mx-1"></div>
                <div className="w-[5%] h-[40%] bg-violet-400 mx-1 relative group cursor-pointer">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">400 Da</div>
                </div>
            </div>
            
            <div className="absolute bottom-2 w-full text-center text-xs font-mono text-muted-foreground">Mass-to-Charge Ratio (m/z) →</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono text-muted-foreground">Intensity</div>
        </div>
    );
};

const GelVisual: React.FC = () => {
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (running && progress < 100) {
            const timer = setTimeout(() => setProgress(p => p + 1), 20);
            return () => clearTimeout(timer);
        }
    }, [running, progress]);

    const start = () => {
        setRunning(true);
        setProgress(0);
    };

    return (
        <div className="space-y-4">
            <div className="h-64 bg-slate-800 rounded-xl border-4 border-slate-600 relative overflow-hidden shadow-inner p-4">
                <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>- Cathode</span>
                    <span>+ Anode</span>
                </div>
                
                {/* Gel Slab */}
                <div className="w-full h-full bg-blue-900/30 relative rounded">
                    {/* Wells */}
                    <div className="absolute top-0 left-4 w-8 h-2 bg-slate-700/50"></div>
                    <div className="absolute top-0 left-16 w-8 h-2 bg-slate-700/50"></div>
                    <div className="absolute top-0 left-28 w-8 h-2 bg-slate-700/50"></div>

                    {/* Bands */}
                    {/* Lane 1: Marker */}
                    {[10, 30, 50, 70, 90].map((y, i) => (
                        <div key={`m-${i}`} className="absolute left-4 w-8 h-1 bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]" style={{ top: `${y}%` }}></div>
                    ))}

                    {/* Lane 2: Sample (Moving) */}
                    <div className="absolute left-16 w-8 h-1 bg-violet-400 shadow-[0_0_5px_rgba(167,139,250,0.8)]" style={{ top: `${progress * 0.8}%`, opacity: progress > 0 ? 1 : 0 }}></div>
                    <div className="absolute left-16 w-8 h-1 bg-violet-400 shadow-[0_0_5px_rgba(167,139,250,0.8)]" style={{ top: `${progress * 0.5}%`, opacity: progress > 0 ? 1 : 0 }}></div>
                    <div className="absolute left-16 w-8 h-1 bg-violet-400 shadow-[0_0_5px_rgba(167,139,250,0.8)]" style={{ top: `${progress * 0.2}%`, opacity: progress > 0 ? 1 : 0 }}></div>
                </div>
            </div>
            <button onClick={start} disabled={running && progress < 100} className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 disabled:opacity-50">Run Gel</button>
        </div>
    );
};

const WesternBlotVisual: React.FC = () => {
    const [step, setStep] = useState(0); // 0: Blank, 1: Primary Ab, 2: Secondary Ab, 3: Detect

    return (
        <div className="space-y-4">
            <div className="h-40 bg-white border rounded-lg flex items-center justify-center relative shadow-sm">
                <span className="absolute top-2 left-2 text-xs text-muted-foreground">Nitrocellulose Membrane</span>
                
                {/* Target Band */}
                <div className={`w-4 h-12 rounded transition-all duration-1000 ${step === 3 ? 'bg-black shadow-[0_0_10px_black]' : 'bg-transparent'}`}></div>
                
                {/* Visualizing Antibodies */}
                {step >= 1 && (
                    <div className="absolute">
                        <div className="text-xs text-blue-500 font-bold -translate-y-8">Y (Primary)</div>
                    </div>
                )}
                {step >= 2 && (
                    <div className="absolute">
                        <div className="text-xs text-red-500 font-bold -translate-y-12">Y* (Secondary + Enzyme)</div>
                    </div>
                )}
            </div>
            
            <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2 text-xs bg-blue-100 text-blue-700 rounded border border-blue-200">1. Add Primary Ab</button>
                <button onClick={() => setStep(2)} className="flex-1 py-2 text-xs bg-red-100 text-red-700 rounded border border-red-200">2. Add Secondary Ab</button>
                <button onClick={() => setStep(3)} className="flex-1 py-2 text-xs bg-gray-800 text-white rounded">3. Develop (ECL)</button>
            </div>
        </div>
    );
};

// --- Main Lab Component ---

export const ProteomicsLab: React.FC<ChapterProps> = ({ onComplete, exercises, infoVisible, infoPlacement, step, setStep }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Custom states for simulations
  const [foldingProgress, setFoldingProgress] = useState(0);
  const [temp, setTemp] = useState(37);

  // Sync internal step with prop step if needed, or just use prop exercises
  // The Runner passes 'exercises' which is the array of interactive_questions.
  // We use 'step' from props to determine which exercise to show.
  
  const question = exercises[step];

  if (!question) return <div>Loading...</div>;

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if(correct) toast.success("Correct!"); else toast.error("Incorrect.");
  };

  const nextQuestion = () => {
    setStep(s => s + 1);
    setShowResult(false);
    setSelectedAnswer(null);
    setFoldingProgress(0);
    setTemp(37);
  };

  const renderVisual = () => {
      switch(question.componentId) {
          case 'folding_sim':
              return (
                  <div className="space-y-4">
                      <FoldingVisual progress={foldingProgress} />
                      <input type="range" min="0" max="100" value={foldingProgress} onChange={(e) => setFoldingProgress(Number(e.target.value))} className="w-full" />
                      <p className="text-center text-xs text-muted-foreground">Drag to Fold</p>
                  </div>
              );
          case 'structure_hierarchy':
              return (
                  <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 mb-4">
                          {['Primary', 'Secondary', 'Tertiary', 'Quaternary'].map(l => (
                              <button key={l} onClick={() => setSelectedAnswer(l)} className={`text-xs py-1 px-2 rounded border ${selectedAnswer === l ? 'bg-violet-600 text-white' : 'bg-card hover:bg-muted'}`}>{l}</button>
                          ))}
                      </div>
                      <StructureLevelsVisual level={selectedAnswer || 'Tertiary'} />
                  </div>
              );
          case 'denaturation_lab':
              return (
                  <div className="space-y-4">
                      <DenaturationVisual temp={temp} />
                      <input type="range" min="0" max="100" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-red-500" />
                      <p className="text-center text-xs text-muted-foreground">Temperature</p>
                  </div>
              );
          case 'mass_spec_lab':
              return <MassSpecVisual />;
          case 'gel_electrophoresis_sim':
              return <GelVisual />;
          case 'western_blot_sim':
              return <WesternBlotVisual />;
          default:
              return <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground">Visual Placeholder</div>;
      }
  };

  const ExerciseContent = (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                <Atom className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading text-2xl tracking-wide text-card-foreground">{question.title}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-background text-muted-foreground">Proteomics</span>
            </div>
        </div>
      </div>
      
      <p className="text-lg font-medium text-foreground">{question.prompt}</p>

      {renderVisual()}

      {question.type === 'interactive-visual' && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {question.options.map(opt => (
                <button 
                    key={opt} 
                    onClick={() => handleSelectAnswer(opt)} 
                    disabled={showResult}
                    className={`p-4 border rounded-lg text-left transition-all ${selectedAnswer === opt ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'hover:bg-muted'}`}
                >
                    {opt}
                </button>
            ))}
          </div>
      )}

      {showResult && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
            <div className="mt-0.5">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
              
              {isCorrect && step < exercises.length - 1 && (
                  <button 
                    onClick={nextQuestion} 
                    className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Next Exercise <Play className="w-4 h-4 fill-current" />
                  </button>
              )}
              {isCorrect && step === exercises.length - 1 && (
                   <button 
                    onClick={onComplete} 
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:brightness-110 transition-all"
                  >
                    Complete Chapter
                  </button>
              )}
            </div>
          </div>
        )}
    </div>
  );

  const theoryVisual = (() => {
      switch(question.componentId) {
          case 'folding_sim': return <FoldingFunnelVisual />;
          case 'structure_hierarchy': return <StructureHierarchyTheoryVisual />;
          case 'denaturation_lab': return <DenaturationTheoryVisual />;
          case 'mass_spec_lab': return <MassSpecTheoryVisual />;
          case 'gel_electrophoresis_sim': return <GelTheoryVisual />;
          case 'western_blot_sim': return <WesternBlotTheoryVisual />;
          default: return null;
      }
  })();

  return (
    <BioLabLayout
        exerciseContent={ExerciseContent}
        theoryContent={<TheoryPane exercise={question} visual={theoryVisual} />}
        infoVisible={infoVisible}
        infoPlacement={infoPlacement}
    />
  );
}
