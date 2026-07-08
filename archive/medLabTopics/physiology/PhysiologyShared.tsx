import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { PhysiologyAnalogyVisual } from './PhysiologyVisuals';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

export const TheoryPane: React.FC<{ theory?: any }> = ({ theory }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!theory) return null;

    const { title, content, analogy, application } = theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-cyan-500" />
                    {title}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={theory} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <div className="mt-2">
                                    <PhysiologyAnalogyVisual title={title} analogy={analogy} />
                                </div>
                            </div>
                        )}
                        {application && (
                            <div className="bg-cyan-50 dark:bg-cyan-900/10 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-cyan-500" /> Application
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

export const PhysiologyInteraction: React.FC<{
    exercise: Exercise;
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => {
    return (
        <div className="space-y-6 w-full">
            <div className="animate-fade-in space-y-4">
                <p className="font-semibold text-lg">{exercise.question}</p>
                <div className="grid gap-2">
                    {exercise.options?.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => handleSelectAnswer(opt)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                                selectedAnswer === opt 
                                ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300' : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300')
                                : 'bg-card hover:bg-muted'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {showResult && isCorrect && (
                    <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 flex items-start gap-3 animate-fade-in">
                        <TrendingUp className="w-6 h-6 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Correct!</p>
                            <p className="text-sm">{exercise.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const usePhysiologyInteraction = (currentExercise: Exercise) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [currentExercise]);

    const handleSelectAnswer = (option: string) => {
        if (showResult) return;
        setSelectedAnswer(option);
        
        // Check if correct answer is index or string
        let correct = false;
        if (typeof currentExercise.correctAnswer === 'number') {
            correct = currentExercise.options?.[currentExercise.correctAnswer] === option;
        } else {
            correct = option === currentExercise.answer;
        }

        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Correct Observation!");
        else toast.error("Incorrect.");
    };

    return { selectedAnswer, showResult, isCorrect, handleSelectAnswer };
};
