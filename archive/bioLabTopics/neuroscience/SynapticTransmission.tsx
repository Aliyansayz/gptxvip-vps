
import React, { useState, useEffect, useRef } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Activity, Zap, Network, Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

// --- Visual Components ---

const MessageAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <rect x="20" y="20" width="40" height="40" rx="4" fill="#fbbf24" />
            <rect x="140" y="20" width="40" height="40" rx="4" fill="#60a5fa" />
            <path d="M 60 40 L 140 40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-muted-foreground" />
            <rect x="90" y="30" width="20" height="20" rx="2" fill="#f87171" className="animate-pulse" />
            <text x="100" y="65" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">MESSAGE PASSING</text>
        </svg>
    </div>
);

const VotingAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <circle cx="100" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
            <path d="M 40 40 L 70 40" stroke="#22c55e" strokeWidth="4" />
            <path d="M 160 40 L 130 40" stroke="#ef4444" strokeWidth="4" />
            <text x="55" y="30" textAnchor="middle" fontSize="12" fill="#22c55e" fontWeight="bold">YES</text>
            <text x="145" y="30" textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">NO</text>
            <text x="100" y="80" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">DECISION MAKING</text>
        </svg>
    </div>
);

// Theory Pane Component (Standard)
const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    const { title, content, analogy, application } = exercise.theory;

    const renderAnalogyVisual = () => {
        if (title.includes("Synapse")) return <MessageAnalogy />;
        if (title.includes("Summation")) return <VotingAnalogy />;
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
                    <BookOpenText className="w-5 h-5 text-purple-500" />
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

// --- Synapse Simulator ---
const SynapseSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [step, setStep] = useState(0); // 0: Idle, 1: AP Arrives, 2: Ca Influx, 3: Fusion, 4: Binding
    const [calcium, setCalcium] = useState(false);
    const [neurotransmitter, setNeurotransmitter] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const activate = () => {
        if (step > 0) return;
        setStep(1);
        setTimeout(() => { setStep(2); setCalcium(true); }, 800);
        setTimeout(() => { setStep(3); }, 1600);
        setTimeout(() => { setStep(4); setNeurotransmitter(true); }, 2400);
        setTimeout(() => { setStep(0); setCalcium(false); setNeurotransmitter(false); }, 4000);
    };

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct!");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            <p className="text-muted-foreground">{exercise.prompt}</p>
            
            <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col items-center justify-center">
                {/* Presynaptic Terminal */}
                <div className={`absolute top-0 w-32 h-32 bg-yellow-500/20 rounded-b-full border-b-4 border-yellow-500 transition-all ${step===1 ? 'shadow-[0_0_30px_rgba(234,179,8,0.5)]' : ''}`}>
                    {/* Vesicles */}
                    <div className={`absolute left-8 top-10 w-6 h-6 bg-yellow-400 rounded-full transition-all duration-1000 ${step >= 3 ? 'translate-y-16 opacity-0' : ''}`} />
                    <div className={`absolute right-8 top-10 w-6 h-6 bg-yellow-400 rounded-full transition-all duration-1000 delay-100 ${step >= 3 ? 'translate-y-16 opacity-0' : ''}`} />
                </div>

                {/* Calcium Channels */}
                <div className={`absolute top-20 left-4 w-4 h-8 bg-blue-500 rounded ${step===2 ? 'animate-pulse bg-blue-400' : ''}`} />
                <div className={`absolute top-20 right-4 w-4 h-8 bg-blue-500 rounded ${step===2 ? 'animate-pulse bg-blue-400' : ''}`} />
                
                {/* Calcium Ions */}
                {calcium && (
                    <>
                        <div className="absolute top-24 left-2 w-2 h-2 bg-blue-300 rounded-full animate-ping" />
                        <div className="absolute top-24 right-2 w-2 h-2 bg-blue-300 rounded-full animate-ping delay-75" />
                    </>
                )}

                {/* Synaptic Cleft Particles */}
                {neurotransmitter && (
                    <div className="absolute top-36 flex gap-4 animate-fade-in-down">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                )}

                {/* Postsynaptic Receptor */}
                <div className="absolute bottom-0 w-40 h-16 bg-purple-900/50 rounded-t-xl border-t-4 border-purple-500 flex justify-center items-start gap-4 pt-1">
                    <div className={`w-8 h-4 border-2 border-purple-400 rounded-b ${step===4 ? 'bg-red-500/50' : 'bg-transparent'}`} />
                    <div className={`w-8 h-4 border-2 border-purple-400 rounded-b ${step===4 ? 'bg-red-500/50' : 'bg-transparent'}`} />
                </div>
            </div>

            <div className="flex justify-center">
                <button onClick={activate} disabled={step > 0} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-bold disabled:opacity-50">
                    {step === 0 ? "Stimulate Axon" : "Signal Transmitting..."}
                </button>
            </div>

            <div className="grid gap-2">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedAnswer(opt)} 
                        disabled={showResult} 
                        className={`p-3 text-left border rounded hover:bg-muted ${
                            selectedAnswer === opt 
                                ? 'bg-purple-100 border-purple-500 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100' 
                                : ''
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedAnswer}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct!" : "Incorrect."}
                </div>
            )}
        </div>
    );
};

// --- Summation Simulator ---
const SummationSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [potential, setPotential] = useState(-70);
    const [history, setHistory] = useState<number[]>(new Array(50).fill(-70));
    const [fired, setFired] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPotential(prev => {
                const decay = (prev - -70) * 0.1; // Decay back to resting
                return prev - decay; 
            });
            setHistory(prev => [...prev.slice(1), potential]);
        }, 50);
        return () => clearInterval(interval);
    }, [potential]);

    const stimulate = () => {
        if (fired) return;
        setPotential(prev => {
            const next = prev + 15;
            if (next >= -55) {
                setFired(true);
                // Spike visual handled in history loop or manually here if needed for effect
                setTimeout(() => setFired(false), 500); // Refractory
                return 30; // Spike
            }
            return next;
        });
    };

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct!");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            
            <div className="relative h-48 bg-black rounded-lg border border-slate-700 overflow-hidden flex items-end">
                {/* Graph Trace */}
                <div className="absolute inset-0 flex items-end">
                    {history.map((val, i) => (
                        <div key={i} className="flex-1 bg-green-500" style={{ height: `${(val + 90) * 1.5}px` }} /> // Map -70 to 30px, -55 to ~50px
                    ))}
                </div>
                {/* Threshold Line */}
                <div className="absolute w-full h-[1px] bg-red-500 border-t border-dashed opacity-50" style={{ bottom: `${(-55 + 90) * 1.5}px` }} />
                <span className="absolute right-2 text-red-500 text-xs font-mono" style={{ bottom: `${(-55 + 90) * 1.5 + 5}px` }}>Threshold (-55mV)</span>
                
                {fired && <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />}
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={stimulate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg shadow active:scale-95 transition-transform">
                    Fire Input! (Click Rapidly)
                </button>
            </div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedAnswer(opt)} 
                        disabled={showResult} 
                        className={`p-3 text-left border rounded hover:bg-muted ${
                            selectedAnswer === opt 
                                ? 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100' 
                                : ''
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedAnswer}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct!" : "Incorrect."}
                </div>
            )}
        </div>
    );
};

export const SynapticTransmission: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const renderContent = () => {
        if (currentExercise.componentId === 'synapse_step_sim') return <SynapseSim exercise={currentExercise} onAnswered={() => {}} />;
        return <SummationSim exercise={currentExercise} onAnswered={() => {}} />;
    };

    return (
        <>
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">{renderContent()}</div>
                    <aside className="lg:col-span-1 sticky top-24 h-fit"><TheoryPane exercise={currentExercise} /></aside>
                </div>
            ) : (
                <div className="flex flex-col gap-6">{renderContent()}{infoVisible && <TheoryPane exercise={currentExercise} />}</div>
            )}
        </>
    );
};
