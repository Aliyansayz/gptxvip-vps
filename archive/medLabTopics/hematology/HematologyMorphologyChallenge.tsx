import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BloodCell, renderCell, HematologyInfographic } from './HematologyVisuals';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import { TheoryPane } from './HematologyLabBase';
import { CheckCircle, XCircle } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

export const HematologyMorphologyChallenge: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const exercise = exercises[step];
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
        if(correct) toast.success("Correct selection!"); else toast.error("Incorrect selection.");
    };

    if (!exercise) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 bg-card rounded-2xl shadow-xl flex items-center justify-center border-red-500 border-2">
                <p className="text-xl text-red-500 font-bold">Error: Morphology Challenge Data ({step}) is missing or malformed.</p>
            </div>
        );
    }

    // We can assume exercise.visualOptions is provided in the json, but we'll map them to small SVG representations 
    // depending on the strings returned
    const renderOptionVisual = (optionName: string) => {
        let cell: BloodCell = { id: '1', type: 'rbc', x: 50, y: 50, size: 30 };
        switch (optionName) {
            case 'Normal RBC':
                cell = { id: '1', type: 'rbc', x: 50, y: 50, size: 25 };
                break;
            case 'Sickle Cell':
                cell = { id: '1', type: 'rbc-sickle', x: 50, y: 50, size: 35 };
                break;
            case 'Target Cell':
                cell = { id: '1', type: 'rbc-target', x: 50, y: 50, size: 30 };
                break;
            case 'Schistocyte':
                cell = { id: '1', type: 'rbc-schistocyte', x: 50, y: 50, size: 20 };
                break;
            case 'Blast Cell':
                cell = { id: '1', type: 'wbc-blast', x: 50, y: 50, size: 40 };
                break;
            case 'Hypersegmented Neutrophil':
                cell = { id: '1', type: 'wbc-hyperseg', x: 50, y: 50, size: 35 };
                break;
            default:
                cell = { id: '1', type: 'rbc', x: 50, y: 50, size: 30 };
        }

        return (
            <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-2 drop-shadow-md">
                {renderCell(cell)}
            </svg>
        );
    };

    const VisualContent = (
        <div className="w-full space-y-4">
           {/* If there is a prompt or contextual image needed, we put it here, 
               otherwise the visual challenge itself focuses on the interactive buttons below */}
           <div className="text-center p-6 bg-muted/30 rounded-xl border border-dashed border-border mb-4">
              <p className="text-muted-foreground italic text-lg">Examine the graphical options below and select the correct visual element corresponding to the requested pathology.</p>
           </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold">{exercise.question}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`w-full flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${
                            selectedAnswer === option
                                ? (showResult 
                                    ? (isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500')
                                    : 'bg-rose-500/10 border-rose-500 shadow-md')
                                : 'bg-card border-border hover:border-primary/50'
                        } ${showResult && option === exercise.answer ? 'border-green-500 bg-green-500/10' : ''} ${showResult ? 'cursor-not-allowed opacity-90' : ''}`}
                    >
                        {renderOptionVisual(option)}
                        <span className="font-medium text-sm mt-2 block">{option}</span>
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
                            {isCorrect ? 'Excellent Observation!' : 'Not quite right'}
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
            theoryContent={<TheoryPane exercise={exercise} visual={<HematologyInfographic pattern={exercise.pattern || 'normal'} />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
