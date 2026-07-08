
import React, { useState, useEffect, useMemo } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Microscope, AlertTriangle, Stethoscope } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
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
}

type CellType = 'normal' | 'inflamed' | 'necrotic' | 'cancerous';
interface Cell { id: string; type: CellType; x: number; y: number; size: number; }

function generateTissueSample(): Cell[] {
    const cells: Cell[] = [];
    const types: CellType[] = ['normal', 'normal', 'normal', 'normal', 'normal', 'inflamed', 'necrotic', 'cancerous'];
    for (let i = 0; i < 24; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        cells.push({
            id: `cell-${i}`, type,
            x: (i % 6) * 50 + 25 + (Math.random() * 10 - 5),
            y: Math.floor(i / 6) * 50 + 25 + (Math.random() * 10 - 5),
            size: type === 'cancerous' ? 22 : type === 'inflamed' ? 20 : type === 'necrotic' ? 14 : 16
        });
    }
    return cells;
}

const getCellColor = (cell: Cell, isSelected: boolean, showResult: boolean) => {
    const baseColors = {
        normal: 'fill-pink-200 stroke-pink-400',
        inflamed: 'fill-red-400 stroke-red-600',
        necrotic: 'fill-gray-400 stroke-gray-600',
        cancerous: 'fill-purple-500 stroke-purple-700'
    };
    if (showResult) {
        const isAbnormal = ['inflamed', 'necrotic', 'cancerous'].includes(cell.type);
        if (isAbnormal) return 'fill-red-500 stroke-red-700';
        return baseColors.normal;
    }
    if (isSelected) return 'fill-yellow-400 stroke-yellow-600';
    return baseColors[cell.type];
};

const PathologyExerciseUI: React.FC<{ exercise: Exercise & { correctTypes?: CellType[] }, onAnswered: (correct: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedCells, setSelectedCells] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const tissueSample = useMemo(() => generateTissueSample(), []);

    useEffect(() => {
        setShowResult(false);
        setIsCorrect(false);
        setSelectedCells([]);
        setSelectedAnswer(null);
    }, [exercise]);

    const handleCellClick = (cellId: string) => {
        if (showResult) return;
        setSelectedCells(prev => prev.includes(cellId) ? prev.filter(id => id !== cellId) : [...prev, cellId]);
    };

    const checkIdentification = () => {
        const abnormalCellIds = tissueSample.filter(c => exercise.correctTypes?.includes(c.type)).map(c => c.id);
        const allCorrect = abnormalCellIds.every(id => selectedCells.includes(id));
        const noFalsePositives = selectedCells.every(id => abnormalCellIds.includes(id));
        const correct = allCorrect && noFalsePositives && selectedCells.length === abnormalCellIds.length;
        
        setIsCorrect(correct);
        setShowResult(true);
        onAnswered(correct);
        toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
    };

    const handleSelectAnswer = (answer: string) => {
        if (showResult) return;
        const correct = answer === exercise.answer;
        setSelectedAnswer(answer);
        setIsCorrect(correct);
        setShowResult(true);
        onAnswered(correct);
        toast[correct ? 'success' : 'error'](correct ? 'Correct!' : 'Not quite right');
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl tracking-wide text-center mb-4">{exercise.title}</h3>
            <p className="text-lg font-medium mt-2 text-center">{exercise.prompt}</p>

            {exercise.type === 'identify' && (
                <div className="space-y-4">
                    <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-muted-foreground"><Microscope className="w-3 h-3" /><span>400x Magnification</span></div>
                        <svg viewBox="0 0 300 200" className="w-full h-64">
                            <defs><radialGradient id="tissueGradient"><stop offset="0%" stopColor="#fce7f3" /><stop offset="100%" stopColor="#f5d0fe" /></radialGradient></defs>
                            <rect x="0" y="0" width="300" height="200" fill="url(#tissueGradient)" rx="8" />
                            {tissueSample.map((cell) => {
                                const isSelected = selectedCells.includes(cell.id);
                                return (
                                <g key={cell.id} onClick={() => handleCellClick(cell.id)} className="cursor-pointer">
                                    <ellipse cx={cell.x} cy={cell.y} rx={cell.size} ry={cell.size * 0.8} className={`${getCellColor(cell, isSelected, showResult)} transition-all duration-200 hover:opacity-80`} strokeWidth="2" />
                                    <circle cx={cell.x} cy={cell.y} r={cell.type === 'cancerous' ? 8 : cell.type === 'inflamed' ? 6 : 4} className={cell.type === 'cancerous' ? 'fill-purple-900' : cell.type === 'necrotic' ? 'fill-gray-700' : 'fill-pink-600'} />
                                    {isSelected && !showResult && <circle cx={cell.x} cy={cell.y} r={cell.size + 4} fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4 2" />}
                                </g>
                                );
                            })}
                        </svg>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Selected: {selectedCells.length} cells</span>
                        {!showResult && <button onClick={checkIdentification} disabled={selectedCells.length === 0} className="px-4 py-2 bg-gradient-bio-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"><AlertTriangle className="w-4 h-4 mr-2" />Identify Abnormalities</button>}
                    </div>
                </div>
            )}
            
            {exercise.type === 'select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercise.options?.map((option) => (
                    <button key={option} onClick={() => handleSelectAnswer(option)} disabled={showResult}
                        className={`h-auto py-4 text-left justify-start p-4 rounded-lg border transition-all ${selectedAnswer === option ? (isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground') : 'bg-card hover:bg-muted'}`}>
                        {option}
                    </button>
                    ))}
                </div>
            )}

            {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />}
                        <div>
                            <p className="font-medium">{isCorrect ? 'Correct!' : 'Not quite right'}</p>
                            <p className="text-sm text-muted-foreground mt-1">{exercise.explanation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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

export const Pathology: React.FC<ChapterProps> = ({ labData, step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];

    if (!currentExercise) return null;

    const ExerciseContent = (
        <PathologyExerciseUI
            exercise={currentExercise}
            onAnswered={(correct) => {
                // The runner will handle step progression via user action or buttons
            }}
        />
    );

    return (
        <>
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">{ExerciseContent}</div>
                    <aside className="lg:col-span-1 sticky top-24 h-fit">
                        <TheoryPane exercise={currentExercise} />
                    </aside>
                </div>
            ) : (
                <div className="space-y-6">
                    {ExerciseContent}
                    {infoVisible && infoPlacement === 'bottom' && <TheoryPane exercise={currentExercise} />}
                </div>
            )}
        </>
    );
};
