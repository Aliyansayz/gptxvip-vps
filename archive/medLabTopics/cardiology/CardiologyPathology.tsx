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

export const CardiologyPathology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [ruptured, setRuptured] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setRuptured(false);
        setSelectedOption(null);
        setIsChecked(false);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === currentExercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Mechanism"); else toast.error("Incorrect");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div 
                className="h-48 bg-pink-50 dark:bg-pink-950/20 rounded-xl relative overflow-hidden flex items-center border border-pink-200 cursor-pointer group" 
                onClick={() => setRuptured(true)}
            >
                <div className="absolute top-2 left-4 text-xs font-bold text-red-800 uppercase z-20 group-hover:scale-105 transition-transform">Click to Simulate Rupture</div>
                
                {/* Artery Walls */}
                <div className="absolute top-0 w-full h-6 bg-red-800 shadow-sm z-10"></div>
                <div className="absolute bottom-0 w-full h-6 bg-red-800 shadow-sm z-10"></div>
                
                {/* Plaque */}
                <div className={`absolute bottom-6 left-1/3 w-40 h-20 bg-yellow-200 rounded-t-full border-t-4 border-yellow-400 transition-all duration-300 origin-bottom ${ruptured ? 'scale-y-75 border-red-600 border-dashed' : ''}`}>
                    {/* Lipid Core */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-yellow-400 rounded-t-full opacity-50 blur-sm"></div>
                </div>
                
                {/* Thrombus visual on rupture */}
                {ruptured && (
                    <div className="absolute left-1/3 bottom-12 w-40 h-24 bg-red-900/90 rounded-full blur-md animate-pulse z-10"></div>
                )}
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
                                ? 'bg-red-500 text-white border-red-600 shadow-md' 
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
                    Check Answer
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
