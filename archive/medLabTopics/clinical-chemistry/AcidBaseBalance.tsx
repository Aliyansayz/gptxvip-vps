
import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, WindIcon, DropletsIcon } from '../../icons';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
}

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
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
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
                                <h4 className="font-bold text-foreground text-sm mb-1">Real Life Analogy</h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1">Clinical Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const BalanceScale: React.FC<{ ph: number }> = ({ ph }) => {
    // 7.4 is balanced (0 deg). 7.0 is tilted left (-15deg). 7.8 is tilted right (15deg).
    // range: 6.8 to 8.0?
    // Let's map 6.8 -> -20deg, 8.0 -> +20deg
    
    const angle = Math.max(-25, Math.min(25, (ph - 7.4) * 50)); 
    const isAcidic = ph < 7.35;
    const isAlkalotic = ph > 7.45;

    return (
        <div className="relative h-48 w-full flex items-center justify-center overflow-hidden">
            {/* Base/Fulcrum */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-slate-400 rounded-t-lg z-10"></div>
            
            {/* Seesaw Plank */}
            <div 
                className="absolute bottom-16 left-1/2 w-64 h-2 bg-slate-600 rounded origin-center transition-transform duration-700 ease-out"
                style={{ transform: `translate(-50%, 0) rotate(${angle}deg)` }}
            >
                {/* Left Side (Acid/CO2) */}
                <div className="absolute -left-4 -top-12 flex flex-col items-center animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="bg-blue-500 text-white p-2 rounded-lg shadow-md border-2 border-blue-600">
                        <div className="flex items-center gap-1">
                            <WindIcon className="w-4 h-4"/>
                            <span className="text-xs font-bold">CO₂ (Acid)</span>
                        </div>
                    </div>
                    {/* Visual Weight */}
                    <div className="w-16 h-4 bg-blue-300/50 rounded-b mt-1"></div>
                </div>

                {/* Right Side (Base/HCO3) */}
                <div className="absolute -right-4 -top-12 flex flex-col items-center animate-bounce" style={{animationDuration: '3.5s'}}>
                    <div className="bg-green-500 text-white p-2 rounded-lg shadow-md border-2 border-green-600">
                        <div className="flex items-center gap-1">
                            <DropletsIcon className="w-4 h-4"/>
                            <span className="text-xs font-bold">HCO₃⁻ (Base)</span>
                        </div>
                    </div>
                    {/* Visual Weight */}
                    <div className="w-16 h-4 bg-green-300/50 rounded-b mt-1"></div>
                </div>
            </div>

            {/* pH Meter Display (Center Overlay) */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl border-2 shadow-lg z-20 font-mono font-bold text-xl transition-colors ${isAcidic ? 'bg-red-50 border-red-500 text-red-600' : isAlkalotic ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-green-50 border-green-500 text-green-600'}`}>
                pH {ph}
            </div>
        </div>
    );
}

export const AcidBaseBalance: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const exercise = exercises[step];

    const phValue = 7.25; // extracted from content for visualization purposes

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Diagnosis Confirmed"); else toast.error("Incorrect Diagnosis");
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-card p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-heading text-3xl">{exercise.title}</h3>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border shadow-inner">
                    <BalanceScale ph={phValue} />
                    <div className="flex justify-between text-xs text-muted-foreground px-8">
                        <span>Respiratory (Lungs)</span>
                        <span>Metabolic (Kidneys)</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">pH</div>
                        <div className="text-3xl font-mono font-bold">{phValue}</div>
                        <div className="text-xs bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full mt-2 inline-block">ACIDIC</div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">pCO₂</div>
                        <div className="text-3xl font-mono font-bold">60</div>
                        <div className="text-xs text-muted-foreground">mmHg</div>
                        <div className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full mt-2 inline-block">HIGH (Acid)</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">HCO₃⁻</div>
                        <div className="text-3xl font-mono font-bold">26</div>
                        <div className="text-xs text-muted-foreground">mEq/L</div>
                        <div className="text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full mt-2 inline-block">NORMAL</div>
                    </div>
                </div>

                <div className="grid gap-3">
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
                </div>
                {showResult && (
                    <div className={`p-4 rounded border ${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                        <p className="font-bold mb-1">{isCorrect ? 'Correct Diagnosis' : 'Incorrect'}</p>
                        <p className="text-sm">{exercise.explanation}</p>
                    </div>
                )}
            </div>
            {infoVisible && (infoPlacement === 'side' ? <aside className="w-full lg:w-1/3"><TheoryPane exercise={exercise} /></aside> : <div className="w-full"><TheoryPane exercise={exercise} /></div>)}
        </div>
    );
};
