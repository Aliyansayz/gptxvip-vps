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

export const CardiologyHemodynamics: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [afterload, setAfterload] = useState(50);
    const [bp, setBp] = useState(120);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setAfterload(50);
        setBp(120);
        setSelectedOption(null);
        setIsChecked(false);
    }, [currentExercise]);

    useEffect(() => {
        // Simple simulation logic: Higher afterload = Higher BP required to pump
        setBp(120 + (afterload - 50) * 1.5);
    }, [afterload]);

    if (!currentExercise) return null;

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === currentExercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Relationship Observed");
        else toast.error("Incorrect interpretation.");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-6 rounded-xl border border-border">
                <div className="text-center w-1/3">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-2">Afterload (Resistance)</div>
                    <input type="range" min="0" max="100" value={afterload} onChange={(e) => setAfterload(Number(e.target.value))} className="w-full mt-2 accent-red-500 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer" disabled={isChecked}/>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">→</div>
                <div className="text-center w-1/3 bg-card border rounded-lg p-4 shadow-sm">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-1">Systolic BP</div>
                    <div className="text-4xl font-mono text-red-500 font-bold">{Math.round(bp)} <span className="text-sm text-muted-foreground">mmHg</span></div>
                </div>
            </div>
            
            <div className="h-48 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-slate-700">
                {/* Visualizing vessel constriction */}
                <div className="flex items-center w-full px-12 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-xs">Heart</div>
                    <div 
                        className="h-16 bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300 rounded-r-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse" 
                        style={{ width: '40%', animationDuration: `${60000 / (60 + (afterload/2))}ms` }} // Heart beats faster with more resistance
                    />
                    {/* The Vessel */}
                    <div className="flex-1 h-20 mx-2 flex flex-col justify-center relative">
                        <div className="w-full bg-pink-300 transition-all duration-300 absolute top-0" style={{ height: `${20 + (afterload/3)}px` }} /> {/* Top Wall */}
                        <div className="w-full bg-pink-300 transition-all duration-300 absolute bottom-0" style={{ height: `${20 + (afterload/3)}px` }} /> {/* Bottom Wall */}
                        <div className="w-full h-full flex items-center justify-center">
                             {/* Arrows indicating flow */}
                             <div className="flex space-x-8 opacity-50">
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                                 <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent"></div>
                             </div>
                        </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold text-xs">Body</div>
                </div>
                <span className="absolute bottom-2 text-slate-400 text-xs font-mono">Arterial Diameter Simulation</span>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <p className="font-semibold text-center">{currentExercise.question}</p>
                <div className="grid grid-cols-2 gap-4">
                    {currentExercise.options?.map(option => (
                        <button
                            key={option}
                            onClick={() => { if(!isChecked) setSelectedOption(option) }}
                            className={`p-4 border rounded-lg font-medium transition-colors ${
                                selectedOption === option 
                                    ? 'bg-red-500 text-white border-red-600 shadow-md' 
                                    : 'bg-card hover:bg-muted'
                            } ${isChecked ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {option}
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
            </div>

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
