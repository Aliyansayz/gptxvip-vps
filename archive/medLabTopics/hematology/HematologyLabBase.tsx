import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { CheckCircle, XCircle, Circle, Stethoscope } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { BloodCell, renderCell, HematologyInfographic } from './HematologyVisuals';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

export const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
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
                    <BookOpenText className="w-5 h-5 text-rose-500" />
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
                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}
                        
                        <div dangerouslySetInnerHTML={{ __html: content }} />

                        {(analogy || application) && <hr className="border-border opacity-50" />}

                        {analogy && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-4 h-4 text-yellow-500" />
                                    Real Life Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-blue-500" />
                                    Clinical Application
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

interface HematologyLabBaseProps {
    exercise: Exercise;
    cells: BloodCell[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

export const HematologyLabBase: React.FC<HematologyLabBaseProps> = ({ exercise, cells, infoVisible, infoPlacement, settings }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    React.useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [exercise]);

    const handleSelectAnswer = (answer: string) => {
        if (showResult) return;
        const correct = answer === exercise.answer;
        setSelectedAnswer(answer);
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Correct Diagnosis"); else toast.error("Incorrect Diagnosis");
    };

    if (!exercise) return null;

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-full p-1 border-8 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden w-full max-w-md mx-auto aspect-square">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-full h-[1px] bg-slate-500"></div>
                    <div className="h-full w-[1px] bg-slate-500 absolute"></div>
                </div>
                
                <svg viewBox="0 0 300 300" className="w-full h-full">
                    {cells.map((cell) => (
                        <g key={cell.id}>
                            {renderCell(cell)}
                        </g>
                    ))}
                </svg>
                <div className="absolute bottom-4 right-6 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">1000x Oil</div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-muted-foreground"><Circle className="w-2 h-2 fill-red-300 stroke-red-500" /> RBC</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-muted-foreground"><Circle className="w-2 h-2 fill-purple-300 stroke-purple-600" /> Neutrophil</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-muted-foreground"><Circle className="w-2 h-2 fill-blue-300 stroke-blue-600" /> Lymphocyte</span>
                {exercise.pattern === 'leukemia' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-muted-foreground"><Circle className="w-2 h-2 fill-purple-400 stroke-purple-800" /> Blast</span>}
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === option
                                ? (showResult 
                                    ? (isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600')
                                    : 'bg-rose-500 text-white border-rose-600 shadow-md')
                                : 'bg-card hover:bg-muted'
                        } ${showResult ? 'opacity-90 cursor-not-allowed' : ''}`}
                    >
                        <span className="font-medium">{option}</span>
                    </button>
                ))}
            </div>
            
            {showResult && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <div>
                        <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Correct Diagnosis!' : 'Not quite right'}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
                    </div>
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
            theoryContent={<TheoryPane exercise={exercise} visual={<HematologyInfographic pattern={exercise.pattern} />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
