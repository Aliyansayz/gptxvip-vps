import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { CheckCircle, XCircle, Stethoscope } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';
import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

import { CardiologyAnalogyVisual } from './CardiologyVisuals';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

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
                    <BookOpenText className="w-5 h-5 text-red-500" />
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
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-4 h-4 text-yellow-500" />
                                    Real Life Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <CardiologyAnalogyVisual title={title} analogy={analogy} />
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-emerald-500" />
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

export const CardiologyLabs: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setSelectedOption(null);
        setIsChecked(false);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === currentExercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Analysis"); else toast.error("Incorrect");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="h-72 bg-card border rounded-xl p-6 relative flex flex-col">
                <div className="flex-1 relative border-l border-b border-muted-foreground/30">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none">
                        {[...Array(24)].map((_, i) => <div key={i} className="border-r border-t border-muted-foreground/10"></div>)}
                    </div>

                    {/* Chart Bars/Lines */}
                    <div className="absolute inset-0 flex items-end px-2 pb-0 gap-4">
                        {/* Time Axis Markers implicitly spaced */}
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-blue-400/50 h-[10%] rounded-t transition-all hover:bg-blue-400"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Myoglobin (1hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-green-500/50 h-[40%] rounded-t transition-all hover:bg-green-500"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">CK-MB (12hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600 h-[90%] rounded-t shadow-lg hover:brightness-110 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (24hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600/60 h-[60%] rounded-t hover:bg-red-600/80 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (48hr)</span>
                        </div>
                        <div className="flex-1 h-full flex items-end justify-center group relative">
                            <div className="w-full max-w-[40px] bg-red-600/30 h-[30%] rounded-t hover:bg-red-600/50 transition-all"></div>
                            <span className="absolute -top-8 bg-popover text-popover-foreground text-xs p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Troponin (5 days)</span>
                        </div>
                    </div>
                </div>
                
                {/* X Axis Label */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                    <span>Onset</span>
                    <span>1 Day</span>
                    <span>5 Days</span>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 space-y-2 bg-background/80 p-3 rounded-lg border shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm"></div> <span className="text-xs font-bold">Troponin</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> <span className="text-xs">CK-MB</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> <span className="text-xs">Myoglobin</span></div>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid gap-2">
                <p className="font-semibold">{currentExercise.question}</p>
                {currentExercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => { if(!isChecked) setSelectedOption(opt) }} 
                        className={`p-4 border rounded-lg text-left transition-colors ${
                            selectedOption === opt 
                                ? 'bg-primary/20 border-primary text-primary font-medium' 
                                : 'bg-card hover:bg-muted'
                        } ${isChecked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {!isChecked && (
                <button 
                    onClick={handleCheck} 
                    disabled={!selectedOption} 
                    className="w-full py-3 mt-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    Check Analysis
                </button>
            )}

            {isChecked && (
                <div className={`p-4 rounded-lg border ${selectedOption === currentExercise.answer ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold">
                        {selectedOption === currentExercise.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                        {selectedOption === currentExercise.answer ? 'Correct!' : 'Incorrect'}
                    </div>
                    <p className="text-sm">{currentExercise.explanation}</p>
                </div>
            )}
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
