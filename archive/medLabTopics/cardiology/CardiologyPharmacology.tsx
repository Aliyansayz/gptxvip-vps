import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, HeartIcon, PillIcon, LightbulbIcon } from '../../icons';
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

export const CardiologyPharmacology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [hr, setHr] = useState(100);
    const [drugGiven, setDrugGiven] = useState<string | null>(null);
    const [trace, setTrace] = useState<number[]>(new Array(50).fill(50));
    
    // Question handling state
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setHr(100);
        setDrugGiven(null);
        setSelectedOption(null);
        setIsChecked(false);
    }, [currentExercise]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrace(prev => {
                const next = [...prev.slice(1), 50 + Math.random() * 10 - 5];
                return next;
            });

            if (drugGiven === 'Beta Blocker' && hr > 60) {
                setHr(h => Math.max(60, h - 1));
            } else if (drugGiven && drugGiven !== 'Beta Blocker') {
                setHr(100); // Reset or maintain high
            }
        }, 100);
        return () => clearInterval(interval);
    }, [drugGiven, hr]);

    if (!currentExercise) return null;

    const handleGive = (drug: string) => {
        setDrugGiven(drug);
        if (drug === 'Beta Blocker') {
            toast.success("Heart Rate Decreasing!");
        } else {
            toast.info("No significant change in HR.");
        }
        // Auto-select the drug as the answer candidate if user clicks simulation buttons
        if (!isChecked) {
            setSelectedOption(drug);
        }
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === currentExercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Choice!"); else toast.error("Incorrect.");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="bg-black text-green-500 font-mono p-6 rounded-xl border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs opacity-50 uppercase tracking-widest">HR Monitor</div>
                <div className="flex items-center justify-center gap-6 mb-4">
                    <HeartIcon className="w-12 h-12 text-red-600 animate-pulse" style={{animationDuration: `${60/hr}s`}} />
                    <div className="text-6xl font-bold tracking-tighter">{Math.round(hr)} <span className="text-xl font-normal opacity-70">BPM</span></div>
                </div>
                {/* Live Trace */}
                <div className="h-16 flex items-end gap-[2px] opacity-70">
                    {trace.map((val, i) => (
                        <div key={i} className="bg-green-500 w-1 rounded-t-sm" style={{ height: `${val}%`, opacity: i/50 }} />
                    ))}
                </div>
            </div>

            <div className="text-center font-bold text-sm uppercase text-muted-foreground">Administer Drug & Observe</div>
            
            <div className="grid grid-cols-3 gap-4">
                {currentExercise.options?.map(drug => (
                    <button 
                        key={drug} 
                        onClick={() => handleGive(drug)}
                        className={`group p-4 bg-card border rounded-xl hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center gap-3 ${selectedOption === drug ? 'border-cyan-500 ring-2 ring-cyan-500/20' : ''}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${drug === 'Beta Blocker' ? 'bg-blue-100 dark:bg-blue-900/30' : drug === 'Diuretic' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                            <PillIcon className={`w-6 h-6 ${drug === 'Beta Blocker' ? 'text-blue-600' : drug === 'Diuretic' ? 'text-yellow-600' : 'text-purple-600'}`} />
                        </div>
                        <span className="font-bold text-sm">{drug}</span>
                    </button>
                ))}
            </div>
            
            <p className="text-center text-muted-foreground text-sm bg-muted/50 p-2 rounded">Goal: Treat Tachycardia (HR &gt; 100)</p>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="border-t pt-4">
                <p className="font-semibold mb-2">{currentExercise.question}</p>
                {!isChecked && (
                    <button 
                        onClick={handleCheck} 
                        disabled={!selectedOption} 
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        Check Answer: {selectedOption || "Select a drug"}
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
