import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, BeakerIcon } from '../../icons';
import { CheckCircle, XCircle, Droplet, ArrowRight, Zap, Activity } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

const TheoryPane: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
                    {exercise.theory.title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground custom-scrollbar overflow-y-auto max-h-[calc(100vh-20rem)] pr-2 animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: exercise.theory.content }} />
                </div>
            )}
        </div>
    );
};

// --- 1. Basic Principles: Spectrophotometry ---
export const ClinicalBasics: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [concentration, setConcentration] = useState(10);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const exercise = exercises[step];

    const absorbance = (concentration * 0.05).toFixed(2);
    const transmission = Math.max(0, 100 - (concentration * 0.9));

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct relationship!");
        else toast.error("Incorrect.");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center relative overflow-hidden">
                {/* Light Source */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-200 rounded-full blur-md animate-pulse"></div>
                
                {/* Light Beam */}
                <div 
                    className="h-4 bg-gradient-to-r from-yellow-200 to-transparent absolute left-8 top-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ width: '80%', opacity: transmission / 100 }}
                ></div>

                {/* Cuvette */}
                <div className="w-24 h-40 border-2 border-slate-500 relative z-10 bg-slate-800/50 backdrop-blur-sm flex items-end">
                    <div 
                        className="w-full transition-colors duration-300" 
                        style={{ 
                            height: '80%', 
                            backgroundColor: `rgba(16, 185, 129, ${concentration / 100})` 
                        }}
                    ></div>
                </div>

                {/* Detector Readout */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-black border border-slate-700 p-2 rounded font-mono text-green-500 w-32 text-center">
                    <div className="text-xs text-slate-500">ABSORBANCE</div>
                    <div className="text-2xl">{absorbance}</div>
                </div>
            </div>

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between text-sm font-medium">
                    <span>Solute Concentration</span>
                    <span>{concentration}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" value={concentration} 
                    onChange={(e) => setConcentration(Number(e.target.value))} 
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-2 gap-3">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => !showResult && setSelectedAnswer(opt)} 
                        className={`p-3 border rounded text-left transition-colors ${selectedAnswer === opt ? 'bg-emerald-600 text-white border-emerald-700' : 'hover:bg-muted'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && <button onClick={handleCheck} disabled={!selectedAnswer} className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Check Answer</button>}
            
            {showResult && (
                <div className={`p-4 rounded border ${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                    {isCorrect ? 'Correct! Linear relationship.' : 'Incorrect.'}
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

// --- 2. Acid-Base Balance ---
export const AcidBaseBalance: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const exercise = exercises[step];

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Diagnosis Confirmed"); else toast.error("Incorrect Diagnosis");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">pH</div>
                    <div className="text-3xl font-mono font-bold">7.25</div>
                    <div className="text-xs bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full mt-2 inline-block">ACIDIC</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">pCO₂</div>
                    <div className="text-3xl font-mono font-bold">60</div>
                    <div className="text-xs text-muted-foreground">mmHg</div>
                    <div className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full mt-2 inline-block">HIGH</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">HCO₃⁻</div>
                    <div className="text-3xl font-mono font-bold">26</div>
                    <div className="text-xs text-muted-foreground">mEq/L</div>
                    <div className="text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full mt-2 inline-block">NORMAL</div>
                </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                <div className="text-center w-1/2 border-r border-border">
                    <div className="font-bold text-sm mb-2">Respiratory Component</div>
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-xs">Lungs</span>
                        <div className="w-16 h-8 bg-blue-200 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold">CO₂</div>
                    </div>
                    <div className="text-xs mt-1 text-red-500 font-bold">Retaining Acid</div>
                </div>
                <div className="text-center w-1/2">
                    <div className="font-bold text-sm mb-2">Metabolic Component</div>
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-xs">Kidneys</span>
                        <div className="w-16 h-8 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold">HCO₃</div>
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">No Compensation</div>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-2 gap-3">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => !showResult && setSelectedAnswer(opt)} 
                        className={`p-3 border rounded text-left transition-colors ${selectedAnswer === opt ? 'bg-cyan-600 text-white' : 'hover:bg-muted'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && <button onClick={handleCheck} disabled={!selectedAnswer} className="w-full py-2 bg-cyan-600 text-white rounded font-bold">Diagnose</button>}
            
            {showResult && (
                <div className={`p-4 rounded border ${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                    <p className="font-bold mb-1">{isCorrect ? 'Correct Diagnosis' : 'Incorrect'}</p>
                    <p className="text-sm">{exercise.explanation}</p>
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

// --- 3. Enzymology (Drag & Drop) ---
export const Enzymology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [dropped, setDropped] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    const items = [
        { id: 'ALT', label: 'ALT', target: 'liver' },
        { id: 'CK-MB', label: 'CK-MB', target: 'heart' },
        { id: 'Amylase', label: 'Amylase', target: 'pancreas' }
    ];

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('id', id);
    };

    const handleDrop = (e: React.DragEvent, target: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        setDropped(prev => ({ ...prev, [id]: target }));
    };

    const check = () => {
        const correct = items.every(i => dropped[i.id] === i.target);
        setShowResult(true);
        if (correct) toast.success("All enzymes correctly matched!");
        else toast.error("Some matches are incorrect.");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="relative h-96 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4">
                {/* Simplified Body Map */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center border border-red-300"
                        onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'heart')}>
                    <div className="text-center">
                        <Activity className="w-8 h-8 mx-auto text-red-500 mb-1" />
                        <span className="text-xs font-bold text-red-500 uppercase">Heart</span>
                        <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                            {Object.entries(dropped).filter(([_, t]) => t === 'heart').map(([id]) => (
                                <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-red-200">{id}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute top-40 right-10 w-40 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center border border-orange-300"
                        onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'liver')}>
                    <div className="text-center">
                        <span className="text-xs font-bold text-orange-600 uppercase">Liver</span>
                        <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                            {Object.entries(dropped).filter(([_, t]) => t === 'liver').map(([id]) => (
                                <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-orange-200">{id}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute top-52 left-10 w-32 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center border border-yellow-300"
                        onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'pancreas')}>
                    <div className="text-center">
                        <span className="text-xs font-bold text-yellow-600 uppercase">Pancreas</span>
                        <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                            {Object.entries(dropped).filter(([_, t]) => t === 'pancreas').map(([id]) => (
                                <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-yellow-200">{id}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
                {items.map(item => (
                    !dropped[item.id] && (
                        <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item.id)} 
                            className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold rounded-lg cursor-grab active:cursor-grabbing border border-emerald-300 shadow-sm">
                            {item.label}
                        </div>
                    )
                ))}
            </div>

            {!showResult && <button onClick={check} className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Verify Placement</button>}
            
            {showResult && (
                <div className="p-4 rounded border bg-muted/50">
                    <p>{exercise.explanation}</p>
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

// --- 4. Proteins (Electrophoresis) ---
export const ProteinsLipids: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [view, setView] = useState<'normal' | 'patho'>('normal');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setView('normal')} className={`px-4 py-1 rounded-full text-sm font-bold ${view === 'normal' ? 'bg-blue-500 text-white' : 'bg-muted'}`}>Normal</button>
                <button onClick={() => setView('patho')} className={`px-4 py-1 rounded-full text-sm font-bold ${view === 'patho' ? 'bg-red-500 text-white' : 'bg-muted'}`}>Pathology</button>
            </div>

            <div className="h-64 bg-white dark:bg-slate-900 border rounded-xl relative p-4 flex items-end">
                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-6 pointer-events-none border-b border-l border-slate-300 dark:border-slate-700 m-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="border-r border-slate-200 dark:border-slate-800 h-full"></div>)}
                </div>
                
                {/* Graph */}
                <svg viewBox="0 0 100 50" className="w-full h-full relative z-10" preserveAspectRatio="none">
                    {view === 'normal' ? (
                        <path d="M0,50 Q10,50 15,10 Q20,50 30,45 Q40,40 50,42 Q60,40 70,40 Q80,35 85,38 Q90,40 100,50" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="0.5" />
                    ) : (
                        <path d="M0,50 Q10,50 15,10 Q20,50 30,45 Q40,40 50,42 Q60,40 70,40 Q80,5 85,5 Q90,40 100,50" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="0.5" />
                    )}
                </svg>
                
                {/* Labels */}
                <div className="absolute bottom-2 left-0 w-full flex justify-between px-8 text-[10px] text-muted-foreground font-bold uppercase">
                    <span>Albumin</span>
                    <span>α1</span>
                    <span>α2</span>
                    <span>β</span>
                    <span className={view === 'patho' ? 'text-red-500 font-extrabold' : ''}>Gamma</span>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-2 gap-3">
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => !showResult && setSelectedAnswer(opt)} 
                        className={`p-3 border rounded text-left transition-colors ${selectedAnswer === opt ? 'bg-indigo-600 text-white' : 'hover:bg-muted'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && <button onClick={() => {
                const correct = selectedAnswer === exercise.answer;
                setShowResult(true);
                if(correct) toast.success("Correct Diagnosis"); else toast.error("Incorrect");
            }} disabled={!selectedAnswer} className="w-full py-2 bg-indigo-600 text-white rounded font-bold">Identify Condition</button>}
            
            {showResult && (
                <div className="p-4 bg-muted/50 rounded border text-sm">
                    {exercise.explanation}
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

// --- 5. Carbohydrate Metabolism ---
export const CarbMetabolism: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [glucoseLevel, setGlucoseLevel] = useState(150); // Starting High
    const [hormone, setHormone] = useState<'None' | 'Insulin' | 'Glucagon'>('None');
    const [isAnimating, setIsAnimating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setGlucoseLevel(prev => {
                    if (hormone === 'Insulin') return Math.max(80, prev - 2);
                    if (hormone === 'Glucagon') return Math.min(200, prev + 2);
                    return prev;
                });
            }, 50);
            
            const timeout = setTimeout(() => {
                setIsAnimating(false);
                if (hormone === 'Insulin' && glucoseLevel > 140) { // Check logic after sim
                    // Logic check done inside visual
                }
            }, 3000);
            return () => { clearInterval(interval); clearTimeout(timeout); };
        }
    }, [isAnimating, hormone]);

    const handleInject = (h: 'Insulin' | 'Glucagon') => {
        setHormone(h);
        setIsAnimating(true);
        if (h === 'Insulin') {
            setTimeout(() => { setShowResult(true); toast.success("Glucose Normalized!"); }, 3000);
        } else {
            toast.error("Glucose is rising further!");
        }
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                        <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-muted-foreground uppercase">Blood Glucose</div>
                        <div className={`text-3xl font-mono font-bold ${glucoseLevel > 120 ? 'text-red-500' : 'text-green-500'}`}>
                            {Math.round(glucoseLevel)} <span className="text-sm text-muted-foreground">mg/dL</span>
                        </div>
                    </div>
                </div>
                {isAnimating && <Activity className="w-6 h-6 text-blue-500 animate-pulse" />}
            </div>

            <div className="relative h-64 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-xl overflow-hidden">
                {/* Blood Vessel */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-32 bg-red-500/10 border-y border-red-300 dark:border-red-800 relative">
                        {/* Glucose Particles */}
                        {Array.from({ length: Math.floor(glucoseLevel / 10) }).map((_, i) => (
                            <div key={i} className="absolute w-2 h-2 bg-white rounded-full shadow-sm animate-float"
                                    style={{ 
                                        left: `${Math.random() * 100}%`, 
                                        top: `${Math.random() * 100}%`,
                                        animationDuration: `${2 + Math.random()}s`
                                    }} 
                            />
                        ))}
                        {/* Hormone Particles */}
                        {isAnimating && Array.from({ length: 10 }).map((_, i) => (
                            <div key={`h-${i}`} className={`absolute w-3 h-3 ${hormone === 'Insulin' ? 'bg-blue-500' : 'bg-orange-500'} rounded-sm animate-pulse`}
                                    style={{ 
                                        left: `${Math.random() * 100}%`, 
                                        top: `${Math.random() * 100}%`,
                                        animationDuration: `${1 + Math.random()}s`
                                    }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleInject('Insulin')} disabled={isAnimating || showResult} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex flex-col items-center">
                    <span>Insulin</span>
                    <span className="text-[10px] font-normal opacity-80">Lowers Glucose</span>
                </button>
                <button onClick={() => handleInject('Glucagon')} disabled={isAnimating || showResult} className="p-3 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold flex flex-col items-center">
                    <span>Glucagon</span>
                    <span className="text-[10px] font-normal opacity-80">Raises Glucose</span>
                </button>
                <button disabled className="p-3 bg-gray-400 text-white rounded font-bold flex flex-col items-center cursor-not-allowed">
                    <span>Cortisol</span>
                    <span className="text-[10px] font-normal opacity-80">Stress Hormone</span>
                </button>
            </div>
            
            {showResult && (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded border border-green-200 dark:border-green-800">
                    <p className="font-bold">Correct Action!</p>
                    <p className="text-sm">{exercise.explanation}</p>
                </div>
            )}
        </div>
    );

    return (
        <MedLabLayout
            title={exercise.title}
            prompt={exercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
