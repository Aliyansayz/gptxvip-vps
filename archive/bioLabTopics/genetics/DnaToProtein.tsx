import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
    labData: LabData;
    onComplete: () => void;
    onBack: () => void;
    step: number;
    setStep: (updater: number | ((s: number) => number)) => void;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

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

                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
                        )}

                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}
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
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1">Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DnaReplicationVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="space-y-4 w-full">
        <div className="w-full max-w-sm mx-auto aspect-video bg-background rounded-lg border p-4 flex items-center justify-center">
            <svg viewBox="0 0 150 80" className="w-full h-auto">
                <path d="M10 30 H 140" stroke="#a855f7" strokeWidth="2" />
                <path d="M10 50 H 140" stroke="#ec4899" strokeWidth="2" />
                <line x1="20" y1="30" x2="20" y2="50" stroke="hsl(var(--muted-foreground))" />
                <line x1="40" y1="30" x2="40" y2="50" stroke="hsl(var(--muted-foreground))" />
                <line x1="60" y1="30" x2="60" y2="50" stroke="hsl(var(--muted-foreground))" />
                <path d="M70 30 H 140" stroke="#a855f7" strokeDasharray="4 4" className="animate-pulse" />
                <path d="M70 50 H 140" stroke="#ec4899" strokeDasharray="4 4" className="animate-pulse" />
                <text x="105" y="25" fontSize="6" className="fill-primary">New Strand</text>
                <text x="105" y="60" fontSize="6" className="fill-primary">New Strand</text>
            </svg>
        </div>
    </div>
);

export const TranscriptionVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="space-y-4 w-full">
        <div className="w-full max-w-sm mx-auto aspect-video bg-background rounded-lg border p-4 flex items-center justify-center">
            <svg viewBox="0 0 150 80" className="w-full h-auto">
                <path d="M10 30 H 140" stroke="#a855f7" strokeWidth="2" />
                <path d="M10 50 H 140" stroke="#ec4899" strokeWidth="2" />
                <ellipse cx="75" cy="40" rx="20" ry="15" fill="#6B3F69" />
                <path d="M95 40 H 140" stroke="#34d399" strokeWidth="2" />
                <text x="110" y="35" fontSize="6" className="fill-green-500">mRNA</text>
            </svg>
        </div>
    </div>
);

export const TranslationVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="space-y-4 w-full">
        <div className="w-full max-w-sm mx-auto aspect-video bg-background rounded-lg border p-4 flex items-center justify-center">
            <svg viewBox="0 0 150 80" className="w-full h-auto">
                <line x1="10" y1="40" x2="140" y2="40" stroke="#34d399" strokeWidth="2" />
                <ellipse cx="75" cy="40" rx="30" ry="20" fill="#6B3F69" />
                <circle cx="75" cy="15" r="5" fill="#f59e0b" />
                <circle cx="85" cy="18" r="5" fill="#f97316" />
                <circle cx="90" cy="25" r="5" fill="#22c55e" />
                <text x="90" y="10" fontSize="6" className="fill-primary">Protein</text>
            </svg>
        </div>
    </div>
);

const DnaToProteinVisual: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const exerciseComponentMap: Record<string, React.FC<any>> = {
        'dna_replication_exercise': DnaReplicationVisual,
        'transcription_exercise': TranscriptionVisual,
        'translation_exercise': TranslationVisual,
    };

    const ActiveExerciseUI = exerciseComponentMap[exercise.componentId];

    return (
        <div className="w-full flex justify-center">
            {ActiveExerciseUI ? <ActiveExerciseUI exercise={exercise} /> : <p>Exercise visual not found.</p>}
        </div>
    );
};

const DnaToProteinInteraction: React.FC<{
    exercise: Exercise;
    answers: Record<string, string | null>;
    feedback: Record<string, { correct: boolean; text: string; } | null>;
    handleSelectOption: (option: string) => void;
    checkAnswer: () => void;
}> = ({ exercise, answers, feedback, handleSelectOption, checkAnswer }) => {
    const currentFeedback = feedback[exercise.componentId];
    const currentAnswer = answers[exercise.componentId];

    return (
        <div className="space-y-4 w-full">
            <p className="font-semibold text-lg">{exercise.question}</p>
            <div className="grid gap-2">
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => handleSelectOption(opt)} 
                        disabled={!!currentFeedback} 
                        className={`w-full text-left p-4 rounded-lg border font-mono text-sm transition-all ${
                            currentAnswer === opt 
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' 
                                : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!currentFeedback && (
                <button 
                    onClick={checkAnswer} 
                    disabled={!currentAnswer} 
                    className="mt-4 w-full px-4 py-3 bg-gradient-genetics-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                >
                    Check Answer
                </button>
            )}
            {currentFeedback && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 text-sm animate-fade-in ${currentFeedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    {currentFeedback.text}
                </div>
            )}
        </div>
    );
};

export const DnaToProtein: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [feedback, setFeedback] = useState<Record<string, { correct: boolean; text: string; } | null>>({});
    const currentExercise = exercises[step];

    if (!currentExercise) return null;

    const handleSelectOption = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentExercise.componentId]: option }));
        setFeedback(prev => ({ ...prev, [currentExercise.componentId]: null }));
    };

    const checkAnswer = () => {
        const selectedAnswer = answers[currentExercise.componentId];
        if (!selectedAnswer) return;
        const isCorrect = selectedAnswer === currentExercise.answer;
        if (isCorrect) {
            toast.success("Correct!");
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: true, text: currentExercise.explanation || "Correct!" } }));
        } else {
            toast.error("Not quite right.");
            const wrongFeedback = currentExercise.wrong_answer_feedback?.find((f: any) => f.option === selectedAnswer);
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: false, text: wrongFeedback?.feedback || "Incorrect. Please try again." } }));
        }
    };

    const VisualContent = <DnaToProteinVisual exercise={currentExercise} />;

    const InteractionContent = (
        <DnaToProteinInteraction 
            exercise={currentExercise}
            answers={answers}
            feedback={feedback}
            handleSelectOption={handleSelectOption}
            checkAnswer={checkAnswer}
        />
    );

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

export default DnaToProtein;
