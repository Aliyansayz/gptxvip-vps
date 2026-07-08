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

export const CardiologyImaging: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [view, setView] = useState<'normal' | 'dilated'>('normal');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setView('normal');
        setSelectedOption(null);
        setIsChecked(false);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === currentExercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Interpretation!");
        else toast.error("Incorrect.");
    };

    const VisualContent = (
        <div className="w-full space-y-6">
            <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setView('normal')} className={`px-6 py-2 rounded-full font-medium transition-colors ${view === 'normal' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>Normal Heart</button>
                <button onClick={() => setView('dilated')} className={`px-6 py-2 rounded-full font-medium transition-colors ${view === 'dilated' ? 'bg-red-600 text-white shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>Dilated CM</button>
            </div>

            <div className="h-72 bg-black rounded-xl border-4 border-slate-800 relative flex items-center justify-center overflow-hidden">
                {/* Simulated Echo Cone */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_70%)] z-10 pointer-events-none"></div>
                <div className="w-full h-full border-t-[120px] border-l-[80px] border-r-[80px] border-t-slate-900/90 border-l-transparent border-r-transparent opacity-40 absolute top-0 pointer-events-none"></div>
                
                {/* Sector Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] border border-cyan-900/30 rounded-full opacity-30" style={{clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}></div>

                <svg viewBox="0 0 200 200" className="h-full w-full max-w-sm">
                    {/* Heart Walls */}
                    {view === 'normal' ? (
                        <path d="M70 60 Q 100 180, 130 60" fill="none" stroke="#e2e8f0" strokeWidth="15" className="animate-pulse origin-top" style={{animationDuration: '0.8s'}} />
                    ) : (
                        <path d="M50 60 Q 100 220, 150 60" fill="none" stroke="#e2e8f0" strokeWidth="5" className="animate-pulse origin-top" style={{animationDuration: '0.6s'}} />
                    )}
                    {/* Blood Pool (Simulated) */}
                    {view === 'normal' ? (
                         <path d="M78 60 Q 100 170, 122 60" fill="#1e293b" className="animate-pulse origin-top" style={{animationDuration: '0.8s'}}/>
                    ) : (
                         <path d="M55 60 Q 100 210, 145 60" fill="#1e293b" className="animate-pulse origin-top" style={{animationDuration: '0.6s'}}/>
                    )}
                </svg>
                
                {/* Info Overlay */}
                <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-xs bg-black/50 p-2 rounded border border-cyan-900">
                    FR: 60Hz <br/>
                    D: 16cm <br/>
                    MI: 1.2 <br/>
                    {view === 'normal' ? 'EF: 65%' : 'EF: 30%'}
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-white text-xs font-bold uppercase">Live</span>
                </div>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{currentExercise.question}</p>
                {currentExercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => { if(!isChecked) setSelectedOption(opt) }} 
                        className={`p-4 text-left border rounded-lg transition-colors ${
                            selectedOption === opt 
                                ? 'bg-cyan-600 text-white border-cyan-700 shadow-md' 
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
                    className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
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
