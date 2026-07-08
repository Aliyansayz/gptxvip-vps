import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { ShieldCheck, TrendingUp, Users, Copy, MousePointerClick, AlertTriangle } from 'lucide-react';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import { ToxicologyAnalogyVisual, ToxicologyPrimaryVisual } from './ToxicologyVisuals';
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

    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <div
                className="cursor-pointer w-full flex justify-between items-center text-lg font-bold text-card-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <BookOpenText className="w-5 h-5 text-blue-500" />
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
                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <div className="mt-2">
                                    <ToxicologyAnalogyVisual title={title} analogy={analogy} />
                                </div>
                            </div>
                        )}
                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-blue-500" /> Application
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

const ToxicologyEHRPanel: React.FC<{ exercise: any }> = ({ exercise }) => {
    const getStatusColor = (param: any) => {
        if (param.category === 'low') return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
        if (param.category === 'high') return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
        if (param.category === 'abnormal') return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
    };

    const getStatusIcon = (param: any) => {
        if (param.category === 'low') return '↓';
        if (param.category === 'high') return '↑';
        if (param.category === 'abnormal') return '⚠';
        return '✓';
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <div className="bg-slate-50 dark:bg-blue-950/50 rounded-xl p-4 border border-slate-200 dark:border-blue-900 h-full overflow-y-auto custom-scrollbar">
                <div className="text-sm font-bold mb-4 text-slate-800 dark:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Patient Vitals & Presentation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exercise.results?.map((param: any, idx: number) => (
                        <div 
                            key={idx}
                            className={`p-4 rounded-lg border flex flex-col justify-between ${getStatusColor(param)}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm uppercase tracking-wide opacity-80">{param.name}</span>
                                <span className="font-bold text-lg flex items-center gap-1">
                                    {param.value} <span className="text-sm font-normal opacity-70">{param.unit}</span> {getStatusIcon(param)}
                                </span>
                            </div>
                            <div className="text-xs opacity-70 border-t border-current/20 pt-2 mt-1">
                                Reference: {param.normal}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ToxicologyInteraction: React.FC<{
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

export const ToxicologyLab: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
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
        const correct = option === currentExercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Correct Observation!");
        else toast.error("Incorrect.");
    };

    if (!currentExercise) return null;

    const InteractionContent = (
        <ToxicologyInteraction 
            exercise={currentExercise} 
            selectedAnswer={selectedAnswer} 
            isCorrect={isCorrect} 
            showResult={showResult} 
            handleSelectAnswer={handleSelectAnswer} 
        />
    );

    const VisualContent = currentExercise.type === 'analysis' ? (
        <ToxicologyEHRPanel exercise={currentExercise} />
    ) : (
        <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-100 dark:bg-blue-950/20 rounded-xl border border-slate-200 dark:border-blue-900 shadow-inner p-4">
            <ToxicologyPrimaryVisual exercise={currentExercise} />
        </div>
    );

    return (
        <MedLabLayout
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

export default ToxicologyLab;
