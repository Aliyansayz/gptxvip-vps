import React, { useMemo } from 'react';
import { Exercise } from '../../../types';

export type CellType = 
    'rbc' | 'rbc-sickle' | 'rbc-target' | 'rbc-schistocyte' | 'rbc-micro' | 'rbc-macro' | 'rbc-crenated' |
    'wbc-neutrophil' | 'wbc-lymphocyte' | 'wbc-band' | 'wbc-hyperseg' | 'wbc-toxic' | 'wbc-blast' | 'wbc-blast-auer' | 'wbc-smudge' |
    'platelet' | 'platelet-clump';

export type BloodCell = {
  id: string;
  type: CellType;
  x: number;
  y: number;
  size: number;
  rotation?: number;
};

export const useBloodCells = (pattern: string = 'normal') => {
    return useMemo(() => {
        const newCells: BloodCell[] = [];
        let id = 0;
        
        const width = 300;
        const height = 300;

        const addRBCs = (count: number, typeFn: () => CellType, sizeFn: () => number) => {
            for (let i = 0; i < count; i++) {
                newCells.push({
                    id: `rbc-${id++}`,
                    type: typeFn(),
                    x: Math.random() * (width - 20) + 10,
                    y: Math.random() * (height - 20) + 10,
                    size: sizeFn(),
                    rotation: Math.random() * 360
                });
            }
        };

        const addWBCs = (count: number, type: CellType) => {
            for (let i = 0; i < count; i++) {
                newCells.push({
                    id: `wbc-${id++}`,
                    type: type,
                    x: Math.random() * (width - 40) + 20,
                    y: Math.random() * (height - 40) + 20,
                    size: type.includes('blast') ? 16 : 14,
                });
            }
        };

        const addPlatelets = (count: number, type: CellType = 'platelet') => {
            for (let i = 0; i < count; i++) {
                newCells.push({
                    id: `plt-${id++}`,
                    type: type,
                    x: Math.random() * (width - 10) + 5,
                    y: Math.random() * (height - 10) + 5,
                    size: 3,
                    rotation: Math.random() * 360
                });
            }
        };

        if (pattern === 'normal') {
            addRBCs(40, () => 'rbc', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            addPlatelets(15);
        } else if (pattern === 'anemia') {
            addRBCs(35, () => 'rbc-micro', () => 6 + Math.random());
            addWBCs(1, 'wbc-lymphocyte');
            addPlatelets(15);
        } else if (pattern === 'sickle') {
            addRBCs(20, () => 'rbc', () => 8);
            addRBCs(15, () => 'rbc-sickle', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            addPlatelets(20);
        } else if (pattern === 'target') {
            addRBCs(10, () => 'rbc', () => 7);
            addRBCs(25, () => 'rbc-target', () => 7.5);
            addWBCs(1, 'wbc-neutrophil');
            addPlatelets(12);
        } else if (pattern === 'schistocyte') {
            addRBCs(20, () => 'rbc', () => 8);
            addRBCs(15, () => 'rbc-schistocyte', () => 7);
            addWBCs(1, 'wbc-neutrophil');
            addPlatelets(5);
        } else if (pattern === 'infection') {
            addRBCs(35, () => 'rbc', () => 8);
            addWBCs(3, 'wbc-toxic');
            addWBCs(2, 'wbc-band');
            addPlatelets(15);
        } else if (pattern === 'hyperseg') {
            addRBCs(20, () => 'rbc-macro', () => 10);
            addWBCs(2, 'wbc-hyperseg');
            addPlatelets(10);
        } else if (pattern === 'leukemia') {
            addRBCs(20, () => 'rbc', () => 8);
            addWBCs(10, 'wbc-blast');
            addPlatelets(3);
        } else if (pattern === 'aml') {
            addRBCs(15, () => 'rbc', () => 8);
            addWBCs(8, 'wbc-blast-auer');
            addWBCs(4, 'wbc-blast');
            addPlatelets(2);
        } else if (pattern === 'cll') {
            addRBCs(25, () => 'rbc', () => 8);
            addWBCs(8, 'wbc-lymphocyte');
            addWBCs(4, 'wbc-smudge');
            addPlatelets(10);
        } else if (pattern === 'clumping') {
            addRBCs(35, () => 'rbc', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            for(let k=0; k<3; k++) {
                const cx = Math.random() * 200 + 50;
                const cy = Math.random() * 200 + 50;
                for(let p=0; p<8; p++) {
                    newCells.push({id:`plt-c-${k}-${p}`, type: 'platelet', x: cx + Math.random()*10, y: cy + Math.random()*10, size: 3});
                }
            }
        } else if (pattern === 'thrombocytopenia') {
            addRBCs(40, () => 'rbc', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            addPlatelets(2);
        } else if (pattern === 'aplastic') {
            addRBCs(5, () => 'rbc', () => 8);
            addWBCs(1, 'wbc-lymphocyte');
        } else if (pattern === 'artifact') {
            addRBCs(40, () => 'rbc-crenated', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            addPlatelets(15);
        } else {
            addRBCs(40, () => 'rbc', () => 8);
            addWBCs(2, 'wbc-neutrophil');
            addPlatelets(15);
        }

        return newCells;
    }, [pattern]);
};

export const renderCell = (cell: BloodCell) => {
    switch (cell.type) {
        case 'rbc':
        case 'rbc-micro':
        case 'rbc-macro':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-red-300 stroke-red-500" strokeWidth="0.5" />
                    <circle cx={cell.x} cy={cell.y} r={cell.size * 0.3} fill="#fff1f2" fillOpacity="0.6" />
                </g>
            );
        case 'rbc-crenated':
            const points = [];
            for(let i=0; i<10; i++){
                const angle = (i/10)*Math.PI*2;
                const r = i%2===0 ? cell.size : cell.size*0.7;
                points.push(`${cell.x + Math.cos(angle)*r},${cell.y + Math.sin(angle)*r}`);
            }
            return <polygon points={points.join(' ')} className="fill-red-300 stroke-red-500" strokeWidth="0.5" />;
        case 'rbc-sickle':
            return (
                <path 
                  d={`M ${cell.x-cell.size} ${cell.y} Q ${cell.x} ${cell.y-cell.size*1.5} ${cell.x+cell.size} ${cell.y} Q ${cell.x} ${cell.y+cell.size*0.5} ${cell.x-cell.size} ${cell.y}`} 
                  className="fill-red-400 stroke-red-600" 
                  transform={`rotate(${cell.rotation}, ${cell.x}, ${cell.y})`}
                  strokeWidth="0.5"
                />
            );
        case 'rbc-target':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-red-300 stroke-red-500" strokeWidth="0.5" />
                    <circle cx={cell.x} cy={cell.y} r={cell.size * 0.6} fill="none" stroke="#fff1f2" strokeWidth="1" />
                    <circle cx={cell.x} cy={cell.y} r={cell.size * 0.2} fill="#ef4444" />
                </g>
            );
        case 'rbc-schistocyte':
            return (
                <path 
                  d={`M ${cell.x-cell.size} ${cell.y+cell.size/2} L ${cell.x} ${cell.y-cell.size} L ${cell.x+cell.size} ${cell.y+cell.size/2} Z`}
                  className="fill-red-300 stroke-red-500"
                  transform={`rotate(${cell.rotation}, ${cell.x}, ${cell.y})`}
                  strokeWidth="0.5"
                />
            );
        case 'platelet':
        case 'platelet-clump':
            return <ellipse cx={cell.x} cy={cell.y} rx={cell.size} ry={cell.size * 0.7} className="fill-violet-400 stroke-violet-600" strokeWidth="0.5" transform={`rotate(${cell.rotation}, ${cell.x}, ${cell.y})`} />;
        
        case 'wbc-neutrophil':
        case 'wbc-toxic':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-purple-100 stroke-purple-300" strokeWidth="1" />
                    <circle cx={cell.x-4} cy={cell.y-2} r={4} fill="#581c87" />
                    <circle cx={cell.x+4} cy={cell.y-2} r={4} fill="#581c87" />
                    <circle cx={cell.x} cy={cell.y+4} r={4} fill="#581c87" />
                    {cell.type === 'wbc-toxic' && (
                        <>
                          <circle cx={cell.x-6} cy={cell.y} r={1} fill="#4c1d95" />
                          <circle cx={cell.x+6} cy={cell.y+2} r={1} fill="#4c1d95" />
                          <circle cx={cell.x} cy={cell.y-6} r={1} fill="#4c1d95" />
                        </>
                    )}
                </g>
            );
        case 'wbc-band':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-purple-100 stroke-purple-300" strokeWidth="1" />
                    <path d={`M ${cell.x-6} ${cell.y-2} Q ${cell.x} ${cell.y+10} ${cell.x+6} ${cell.y-2}`} fill="none" stroke="#581c87" strokeWidth="5" strokeLinecap="round" />
                </g>
            );
        case 'wbc-hyperseg':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-purple-100 stroke-purple-300" strokeWidth="1" />
                    <circle cx={cell.x-5} cy={cell.y-3} r={3} fill="#581c87" />
                    <circle cx={cell.x+5} cy={cell.y-3} r={3} fill="#581c87" />
                    <circle cx={cell.x-7} cy={cell.y+3} r={3} fill="#581c87" />
                    <circle cx={cell.x+7} cy={cell.y+3} r={3} fill="#581c87" />
                    <circle cx={cell.x} cy={cell.y+6} r={3} fill="#581c87" />
                    <circle cx={cell.x} cy={cell.y-6} r={3} fill="#581c87" />
                </g>
            );
        case 'wbc-lymphocyte':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-blue-100 stroke-blue-300" strokeWidth="1" />
                    <circle cx={cell.x} cy={cell.y} r={cell.size * 0.8} fill="#1e40af" />
                </g>
            );
        case 'wbc-blast':
        case 'wbc-blast-auer':
            return (
                <g>
                    <circle cx={cell.x} cy={cell.y} r={cell.size} className="fill-purple-200 stroke-purple-400" strokeWidth="1" />
                    <circle cx={cell.x} cy={cell.y} r={cell.size * 0.85} fill="#4c1d95" opacity="0.9" />
                    <circle cx={cell.x-3} cy={cell.y-3} r={2} fill="#a78bfa" opacity="0.5" />
                    <circle cx={cell.x+4} cy={cell.y+2} r={2} fill="#a78bfa" opacity="0.5" />
                    {cell.type === 'wbc-blast-auer' && (
                        <line x1={cell.x-6} y1={cell.y+4} x2={cell.x+2} y2={cell.y+8} stroke="#ef4444" strokeWidth="1.5" />
                    )}
                </g>
            );
        case 'wbc-smudge':
            return (
                <g opacity="0.6">
                    <path d={`M ${cell.x-8} ${cell.y-5} Q ${cell.x} ${cell.y-10} ${cell.x+10} ${cell.y-2} Q ${cell.x+12} ${cell.y+8} ${cell.x+2} ${cell.y+12} Q ${cell.x-8} ${cell.y+10} ${cell.x-10} ${cell.y+2} Z`} fill="#4c1d95" />
                </g>
            );
        default: return null;
    }
};

export const HematologyInfographic: React.FC<{ pattern?: string }> = ({ pattern }) => {
    if (!pattern || pattern === 'normal') {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">Analogy: The Well-Planned City</h4>
                <div className="relative h-24 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center">
                    <div className="absolute inset-x-0 h-2 bg-white/20 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-400"></div>
                    <div className="flex gap-2 animate-slide-ltr items-center w-[200%]">
                        {Array.from({length: 20}).map((_, i) => {
                            const isWBC = i % 10 === 0;
                            const isPlt = i % 5 === 0 && !isWBC;
                            return (
                                <div key={i} className={`rounded-full shadow-sm flex items-center justify-center ${isWBC ? 'w-8 h-8 bg-purple-500' : isPlt ? 'w-3 h-3 bg-blue-400' : 'w-6 h-6 bg-red-400'}`}>
                                    {isWBC && <span className="text-[8px] text-white">👮</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex justify-between px-4 mt-2 text-[10px] text-muted-foreground">
                    <span>Commuters (RBC)</span>
                    <span>Police (WBC)</span>
                </div>
            </div>
        );
    }
    
    if (pattern === 'anemia') {
        return (
             <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
                <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Analogy: Budget Cuts</h4>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center opacity-50 grayscale">
                        <div className="w-12 h-12 rounded-full border-4 border-red-400 bg-red-100 flex items-center justify-center text-[10px]">Normal</div>
                    </div>
                    <div className="text-xl font-bold text-muted-foreground">→</div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-red-400 bg-white flex items-center justify-center text-[8px]">Micro</div>
                        <span className="text-[10px] text-red-500 font-bold mt-1">Empty!</span>
                    </div>
                </div>
            </div>
        );
    }

    if (['leukemia'].includes(pattern)) {
         return (
             <div className="my-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
                <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Analogy: Overcrowding</h4>
                <div className="grid grid-cols-6 gap-1 bg-white dark:bg-black/20 p-2 rounded-lg border border-dashed border-purple-300">
                    {Array.from({length: 18}).map((_, i) => (
                        <div key={i} className={`w-full aspect-square rounded-sm flex items-center justify-center text-[8px] ${i < 15 ? 'bg-purple-500 text-white' : 'bg-red-300 text-red-900'}`}>
                            {i < 15 ? 'Squatter' : 'Work'}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground">Squatters (Blasts) taking up all the space.</p>
            </div>
        );
    }

    if (pattern === 'sickle') {
        return (
            <div className="my-4 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl border border-pink-100 dark:border-pink-900">
                <h4 className="text-[10px] font-bold text-pink-600 uppercase tracking-widest text-center mb-4">Analogy: Traffic Jam</h4>
                <div className="relative h-20 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center">
                    <div className="absolute inset-x-0 h-12 bg-gray-400/50"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-16 h-6 bg-red-600 rounded transform -rotate-12 flex items-center justify-center shadow-lg z-10">
                        <span className="text-[8px] text-white font-bold">Sickle Cell</span>
                    </div>
                    <div className="absolute left-10 w-8 h-8 rounded-full bg-red-400"></div>
                    <div className="absolute left-4 w-8 h-8 rounded-full bg-red-400"></div>
                </div>
            </div>
        );
    }

    if (pattern === 'target') {
        return (
            <div className="my-4 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900">
                <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest text-center mb-4">Analogy: The Baggy Suit</h4>
                <div className="flex justify-center items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-teal-500 bg-teal-100 flex items-center justify-center relative">
                            <div className="w-8 h-8 rounded-full border border-teal-400 bg-teal-200"></div>
                        </div>
                        <span className="text-[10px] mt-1 text-muted-foreground">Normal Fit</span>
                    </div>
                    <div className="text-xl text-muted-foreground">vs</div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-2 border-teal-600 bg-teal-50 flex items-center justify-center relative">
                             <div className="w-4 h-4 rounded-full bg-teal-600 absolute"></div>
                             <div className="w-10 h-10 rounded-full border-2 border-dashed border-teal-400 absolute"></div>
                        </div>
                        <span className="text-[10px] mt-1 text-teal-600 font-bold">Excess Membrane</span>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Too much membrane (fabric) for the hemoglobin (body) inside.
                </p>
            </div>
        );
    }

    if (pattern === 'schistocyte') {
        return (
            <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
                <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Analogy: The Razor Wire</h4>
                <div className="relative h-20 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                    <div className="absolute w-full h-full pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-[2px] h-full bg-slate-400 rotate-12 opacity-50"></div>
                        <div className="absolute top-0 left-2/4 w-[2px] h-full bg-slate-400 -rotate-12 opacity-50"></div>
                        <div className="absolute top-0 left-3/4 w-[2px] h-full bg-slate-400 rotate-45 opacity-50"></div>
                    </div>
                    <div className="absolute left-0 w-8 h-8 bg-red-400 rounded-full animate-slide-ltr"></div>
                    <div className="absolute left-1/2 -translate-x-4 w-4 h-8 bg-red-500 rounded-l-full animate-pulse"></div>
                    <div className="absolute right-10 flex flex-col gap-2 opacity-80">
                         <div className="w-4 h-3 bg-red-400 rounded-t-full rotate-45"></div>
                         <div className="w-3 h-4 bg-red-400 rounded-b-full -rotate-12"></div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Red blood cells are sliced as they pass through fibrin strands in small vessels.
                </p>
            </div>
        );
    }

    if (pattern === 'infection') {
        return (
            <div className="my-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Analogy: Emergency Draft</h4>
                <div className="flex justify-center items-end gap-2 h-20">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-12 bg-blue-600 rounded-t-lg flex items-center justify-center text-white text-xs">Vet</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-10 bg-blue-400 rounded-t-lg flex items-center justify-center text-white text-xs">Cadet</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-10 bg-blue-400 rounded-t-lg flex items-center justify-center text-white text-xs">Cadet</div>
                        <div className="w-full h-1 bg-yellow-400 mt-1"></div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground">Sending untrained cadets (Bands) to the front lines.</p>
            </div>
        );
    }

    if (pattern === 'hyperseg') {
        return (
            <div className="my-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
                <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Analogy: Bureaucratic Delay</h4>
                <div className="flex justify-center items-center gap-4">
                    <div className="relative w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-300">
                        <div className="grid grid-cols-3 gap-1 p-2">
                            {Array.from({length:6}).map((_,i) => <div key={i} className="w-3 h-3 bg-purple-600 rounded-full"></div>)}
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Cell nucleus keeps growing complex while waiting for DNA paperwork (B12) to divide.
                </p>
            </div>
        );
    }

    if (pattern === 'aml') {
        return (
            <div className="my-4 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900">
                <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest text-center mb-4">Analogy: Defective Product</h4>
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center relative border-4 border-rose-300 shadow-sm">
                        <div className="w-10 h-10 bg-rose-400 rounded-full opacity-30 absolute"></div>
                        <div className="w-1 h-10 bg-red-600 rotate-45 absolute shadow-sm rounded-full"></div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    The "Auer Rod" is the factory stamp of the Myeloid line defect.
                </p>
            </div>
        );
    }

    if (pattern === 'cll') {
        return (
            <div className="my-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Analogy: Fragile Elders</h4>
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-indigo-200 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                            <span className="text-[8px] text-indigo-800">Normal</span>
                        </div>
                    </div>
                    <div className="text-xl text-muted-foreground">vs</div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center relative opacity-80">
                            <div className="absolute w-full h-full bg-indigo-400 opacity-20 blur-md rounded-full scale-125"></div>
                            <span className="text-[8px] text-indigo-800 font-bold">Smudge</span>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Fragile cells that burst during slide preparation ("Smudge Cells").
                </p>
            </div>
        );
    }

    if (pattern === 'clumping') {
        return (
            <div className="my-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Analogy: The Group Huddle</h4>
                <div className="flex justify-around items-center">
                    <div className="border-2 border-dashed border-indigo-300 p-2 rounded-lg relative bg-white dark:bg-black/20">
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1 rounded">Count: 1</div>
                        <div className="flex -space-x-2">
                            <div className="w-4 h-4 bg-indigo-500 rounded-full border border-white"></div>
                            <div className="w-4 h-4 bg-indigo-500 rounded-full border border-white"></div>
                            <div className="w-4 h-4 bg-indigo-500 rounded-full border border-white"></div>
                            <div className="w-4 h-4 bg-indigo-500 rounded-full border border-white"></div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">vs</div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-50"></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full opacity-50"></div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Machine counts a clump as one cell, causing false low platelet count.
                </p>
            </div>
        );
    }

    if (pattern === 'thrombocytopenia') {
        return (
            <div className="my-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
                <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Analogy: The Leaking Dam</h4>
                <div className="relative h-16 bg-blue-100 dark:bg-blue-900/20 rounded border-b-4 border-slate-400 flex items-end overflow-hidden">
                    <div className="absolute inset-0 bg-blue-200/20"></div>
                    <div className="absolute bottom-[-4px] left-1/4 w-1 h-6 bg-red-500 animate-drip"></div>
                    <div className="absolute bottom-[-4px] left-2/4 w-1 h-6 bg-red-500 animate-drip" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-[-4px] left-3/4 w-1 h-6 bg-red-500 animate-drip" style={{animationDelay: '1s'}}></div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Not enough plugs (platelets) to stop the tiny daily leaks in vessels.
                </p>
            </div>
        );
    }

    if (pattern === 'aplastic') {
        return (
            <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-100 dark:border-yellow-900">
                <h4 className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest text-center mb-4">Analogy: Ghost Town</h4>
                <div className="grid grid-cols-4 gap-2 p-2 bg-yellow-100/50 rounded-lg">
                    {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="aspect-square bg-white dark:bg-yellow-950/30 border border-yellow-200 rounded flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-yellow-50 border border-yellow-100"></div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Factory floor replaces workers with empty fat cells.
                </p>
            </div>
        );
    }

    if (pattern === 'artifact') {
        return (
            <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Analogy: Distorted Lens</h4>
                <div className="flex justify-center items-center gap-4">
                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center text-xs">:)</div>
                    <div className="text-xl text-muted-foreground">→</div>
                    <div className="w-10 h-10 bg-red-200 flex items-center justify-center text-xs" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'}}>:(</div>
                </div>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    The cell is fine, the picture (preparation) is bad. Drying causes crenation.
                </p>
            </div>
        );
    }

    return null;
};
