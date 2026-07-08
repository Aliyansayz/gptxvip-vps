
import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon } from '../../icons';
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

export const ClinicalBasics: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
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

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-card p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-heading text-3xl">{exercise.title}</h3>
                <p className="text-muted-foreground">{exercise.prompt}</p>

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

                <div className="grid gap-3">
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
                </div>
                {showResult && (
                    <div className={`p-4 rounded border ${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                        {isCorrect ? 'Correct! Linear relationship.' : 'Incorrect.'}
                    </div>
                )}
            </div>
            {infoVisible && (infoPlacement === 'side' ? <aside className="w-full lg:w-1/3"><TheoryPane exercise={exercise} /></aside> : <div className="w-full"><TheoryPane exercise={exercise} /></div>)}
        </div>
    );
};
