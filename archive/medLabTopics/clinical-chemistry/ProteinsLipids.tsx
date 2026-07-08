
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

export const ProteinsLipids: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const [view, setView] = useState<'normal' | 'patho'>('normal');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-card p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-heading text-3xl">{exercise.title}</h3>
                
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

                <div className="grid gap-3">
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
                </div>
                
                {showResult && (
                    <div className="p-4 bg-muted/50 rounded border text-sm">
                        {exercise.explanation}
                    </div>
                )}
            </div>
            {infoVisible && (infoPlacement === 'side' ? <aside className="w-full lg:w-1/3"><TheoryPane exercise={exercise} /></aside> : <div className="w-full"><TheoryPane exercise={exercise} /></div>)}
        </div>
    );
};
