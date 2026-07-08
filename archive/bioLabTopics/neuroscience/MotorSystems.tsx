import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

// --- Visual Components ---

const DominoAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 60" className="w-48 h-16 opacity-90">
            <rect x="20" y="10" width="10" height="40" rx="2" fill="#f87171" transform="rotate(-15 25 50)" />
            <rect x="45" y="15" width="10" height="40" rx="2" fill="#60a5fa" transform="rotate(-30 50 55)" />
            <rect x="70" y="25" width="10" height="40" rx="2" fill="#4ade80" transform="rotate(-50 75 65)" />
            <path d="M 110 50 L 160 50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-muted-foreground" />
            <text x="135" y="40" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">CHAIN REACTION</text>
        </svg>
    </div>
);

const MapAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <rect x="10" y="10" width="180" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
            <path d="M 30 30 L 70 30 L 70 50 L 120 50" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
            <circle cx="120" cy="50" r="4" fill="#be185d" />
            <rect x="140" y="20" width="40" height="40" rx="2" fill="#fbcfe8" opacity="0.5" />
            <text x="160" y="45" textAnchor="middle" fontSize="8" fill="#be185d">CONTROL</text>
        </svg>
    </div>
);

const GyroAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" transform="rotate(45 50 50)" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#a855f7" strokeWidth="3" />
            <circle cx="50" cy="50" r="5" fill="#a855f7" />
        </svg>
    </div>
);

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    const { title, content, analogy, application } = exercise.theory;

    const renderAnalogyVisual = () => {
        if (title.includes("Reflex")) return <DominoAnalogy />;
        if (title.includes("Homunculus")) return <MapAnalogy />;
        if (title.includes("Cerebellum")) return <GyroAnalogy />;
        return null;
    };

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-orange-500" />
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
                        
                        {renderAnalogyVisual()}

                        
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

// --- Visual Components ---

const ReflexArcVisual: React.FC<{ activePath: string[], status: string }> = ({ activePath, status }) => (
    <div className="relative h-64 bg-slate-50 dark:bg-slate-900 rounded-xl border flex items-center justify-center p-4 w-full max-w-2xl mx-auto">
        {/* Visual Representation of Reflex Arc */}
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full border-2 transition-all duration-300 ${activePath.includes('receptor') ? 'bg-red-500 border-red-600 text-white scale-110' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Hand</div>
            <div className={`h-2 w-12 transition-colors duration-300 ${activePath.includes('sensory') ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${activePath.includes('spine') ? 'bg-purple-500 border-purple-600 text-white scale-110' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Spine</div>
            <div className={`h-2 w-12 transition-colors duration-300 ${activePath.includes('motor') ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            <div className={`p-4 rounded-full border-2 transition-all duration-300 ${activePath.includes('muscle') ? 'bg-orange-500 border-orange-600 text-white animate-bounce' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Muscle</div>
        </div>
        <div className="absolute top-4 font-mono text-sm font-bold text-muted-foreground">{status}</div>
    </div>
);

const HomunculusVisual: React.FC = () => {
    const [highlight, setHighlight] = useState('');
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto items-center">
            <div className="relative h-64 bg-pink-100 dark:bg-pink-900/20 rounded-full border-4 border-pink-300 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Brain Map Slices */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-pink-300/50 hover:bg-pink-400/50 cursor-pointer transition-colors" onMouseEnter={() => setHighlight('Trunk')} onMouseLeave={() => setHighlight('')} />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-pink-400/30 hover:bg-pink-500/50 cursor-pointer transition-colors" onMouseEnter={() => setHighlight('Hand')} onMouseLeave={() => setHighlight('')} />
                <div className="absolute top-0 left-0 w-1/4 h-full bg-pink-200/30 hover:bg-pink-300/50 cursor-pointer transition-colors" onMouseEnter={() => setHighlight('Face')} onMouseLeave={() => setHighlight('')} />
                <span className="pointer-events-none font-bold text-pink-800 dark:text-pink-200 text-lg">Motor Cortex</span>
            </div>
            <div className="flex flex-col items-center justify-center border rounded-xl p-8 bg-card shadow-sm h-64">
                <span className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-bold">Active Body Part</span>
                <div className="text-3xl font-bold mb-4">{highlight || "Hover Cortex"}</div>
                <div className={`transition-all duration-300 text-6xl ${highlight ? 'scale-110' : 'scale-100 opacity-50'}`}>
                    {highlight === 'Hand' ? '👋' : highlight === 'Face' ? '🙂' : highlight === 'Trunk' ? '👕' : '...'}
                </div>
            </div>
        </div>
    );
};

const CerebellumVisual: React.FC<{ balance: number }> = ({ balance }) => (
    <div className="h-64 bg-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden w-full max-w-2xl mx-auto border border-slate-700 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
        <div 
            className={`w-64 h-4 rounded-full transition-transform duration-500 ease-out shadow-[0_0_20px_rgba(255,255,255,0.5)] ${Math.abs(balance - 50) < 5 ? 'bg-green-400' : 'bg-red-400'}`} 
            style={{ transform: `rotate(${(balance - 50)}deg)` }}
        ></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white/10 dashed-line"></div>
        <div className={`absolute top-8 font-mono text-xl font-bold tracking-widest ${Math.abs(balance - 50) < 5 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs(balance - 50) < 5 ? "BALANCED" : "UNBALANCED"}
        </div>
    </div>
);

// --- Interaction Components ---

const ReflexArcInteraction: React.FC<{ 
    exercise: Exercise; 
    triggerReflex: () => void; 
    isAnimating: boolean;
    onAnswered: (c: boolean) => void;
}> = ({ exercise, triggerReflex, isAnimating, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct! Speed is key.");
        else toast.error("Incorrect. Reflexes are local.");
        onAnswered(correct);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex justify-center">
                <button 
                    onClick={triggerReflex} 
                    disabled={isAnimating}
                    className="px-8 py-4 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnimating ? "Reflex Active..." : "Touch Hot Stove"}
                </button>
            </div>

            <div className="space-y-4 animate-fade-in">
                <p className="font-semibold text-lg">{exercise.question}</p>
                <div className="grid gap-3">
                    {exercise.options?.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => !showResult && setSelectedOption(opt)}
                            disabled={showResult}
                            className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                                selectedOption === opt 
                                    ? 'bg-orange-100 border-orange-500 text-orange-900 dark:bg-orange-900/30 dark:text-orange-100' 
                                    : 'hover:bg-muted'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {!showResult && (
                    <button 
                        onClick={handleCheck}
                        disabled={!selectedOption}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                )}
                {showResult && (
                    <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {isCorrect ? "Correct! Reflexes bypass the brain for speed." : "Not quite. Reflexes are local spinal loops."}
                    </div>
                )}
            </div>
        </div>
    );
};

const HomunculusInteraction: React.FC<{ 
    exercise: Exercise; 
    onAnswered: (c: boolean) => void;
}> = ({ exercise, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct!");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="space-y-4 animate-fade-in">
                <p className="font-semibold text-lg">{exercise.question}</p>
                <div className="grid gap-3">
                    {exercise.options?.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => !showResult && setSelectedOption(opt)}
                            disabled={showResult}
                            className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                                selectedOption === opt 
                                    ? 'bg-pink-100 border-pink-500 text-pink-900 dark:bg-pink-900/30 dark:text-pink-100' 
                                    : 'hover:bg-muted'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {!showResult && (
                    <button 
                        onClick={handleCheck}
                        disabled={!selectedOption}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                )}
                {showResult && (
                    <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {isCorrect ? "Correct! Fine motor skills require more cortical area." : "Incorrect. Think about dexterity requirements."}
                    </div>
                )}
            </div>
        </div>
    );
};

const CerebellumInteraction: React.FC<{ 
    exercise: Exercise; 
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    onAnswered: (c: boolean) => void;
}> = ({ exercise, setBalance, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct!");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setBalance(prev => Math.max(0, prev - 15))} className="px-6 py-3 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-colors">Tilt Left (Error)</button>
                <button onClick={() => setBalance(50)} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg transition-all transform hover:scale-105">Cerebellum Correct</button>
                <button onClick={() => setBalance(prev => Math.min(100, prev + 15))} className="px-6 py-3 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-colors">Tilt Right (Error)</button>
            </div>

            <div className="space-y-4 animate-fade-in">
                <p className="font-semibold text-lg">{exercise.question}</p>
                <div className="grid gap-3">
                    {exercise.options?.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => !showResult && setSelectedOption(opt)}
                            disabled={showResult}
                            className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                                selectedOption === opt 
                                    ? 'bg-purple-100 border-purple-500 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100' 
                                    : 'hover:bg-muted'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {!showResult && (
                    <button 
                        onClick={handleCheck}
                        disabled={!selectedOption}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                )}
                {showResult && (
                    <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {isCorrect ? "Correct! The cerebellum compares intent with actual movement." : "Incorrect. It's about error correction."}
                    </div>
                )}
            </div>
        </div>
    );
};

export const MotorSystems: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
    // State for Reflex Arc
    const [activePath, setActivePath] = useState<string[]>([]);
    const [status, setStatus] = useState('Waiting for stimulus...');
    const [isAnimating, setIsAnimating] = useState(false);

    // State for Cerebellum
    const [balance, setBalance] = useState(50);

    useEffect(() => {
        // Reset states on step change
        setActivePath([]);
        setStatus('Waiting for stimulus...');
        setIsAnimating(false);
        setBalance(50);
    }, [step]);

    if (!currentExercise) return null;

    const triggerReflex = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setStatus('Heat Detected!');
        setActivePath(['receptor']);
        setTimeout(() => setActivePath(['receptor', 'sensory']), 500);
        setTimeout(() => setActivePath(['receptor', 'sensory', 'spine']), 1000);
        setTimeout(() => setActivePath(['receptor', 'sensory', 'spine', 'motor']), 1500);
        setTimeout(() => {
            setActivePath(['receptor', 'sensory', 'spine', 'motor', 'muscle']);
            setStatus('Muscle Contracted!');
            toast.success("Reflex Loop Complete");
            setIsAnimating(false);
        }, 2000);
    };

    let VisualContent;
    let InteractionContent;

    if (currentExercise.componentId === 'reflex_arc_sim') {
        VisualContent = <ReflexArcVisual activePath={activePath} status={status} />;
        InteractionContent = <ReflexArcInteraction exercise={currentExercise} triggerReflex={triggerReflex} isAnimating={isAnimating} onAnswered={() => {}} />;
    } else if (currentExercise.componentId === 'homunculus_explore') {
        VisualContent = <HomunculusVisual />;
        InteractionContent = <HomunculusInteraction exercise={currentExercise} onAnswered={() => {}} />;
    } else {
        VisualContent = <CerebellumVisual balance={balance} />;
        InteractionContent = <CerebellumInteraction exercise={currentExercise} setBalance={setBalance} onAnswered={() => {}} />;
    }

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default MotorSystems;
