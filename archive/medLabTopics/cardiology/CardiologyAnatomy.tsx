
import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Activity, CheckCircle, XCircle, Stethoscope, ChevronUp, ChevronDown } from 'lucide-react';
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

const AnatomyExercise: React.FC<{ 
    exercise: Exercise, 
    settings?: LabSettings,
    infoVisible: boolean,
    infoPlacement: 'side' | 'bottom'
}> = ({ exercise, settings, infoVisible, infoPlacement }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setSelected(null);
        setIsChecked(false);
    }, [exercise]);

    const handleClick = (part: string) => {
        if (isChecked) return;
        setSelected(part);
    };

    const handleCheck = () => {
        if (!selected) return;
        const correct = selected === exercise.answer;
        setIsChecked(true);
        if(correct) toast.success("Correct Structure!");
        else toast.error("Incorrect Structure.");
    };

    const VisualContent = (
        <div className="relative h-80 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner w-full">
            <svg viewBox="0 0 200 200" className="h-full w-auto animate-pulse" style={{animationDuration: '1.2s'}}>
                {/* Simplified Heart with Conduction System */}
                <path d="M60 50 Q 30 30, 20 80 Q 10 150, 100 190 Q 190 150, 180 80 Q 170 30, 140 50 Q 100 80, 60 50" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                
                {/* SA Node */}
                <g onClick={() => handleClick("SA Node")} className={`cursor-pointer transition-opacity ${selected === 'SA Node' ? 'opacity-100' : 'hover:opacity-80 opacity-90'}`}>
                    <circle cx="50" cy="60" r="8" fill={selected === 'SA Node' ? '#3b82f6' : 'transparent'} stroke={selected === 'SA Node' ? 'white' : 'none'} strokeWidth="1" />
                    <circle cx="50" cy="60" r="6" fill="#fbbf24" className="animate-ping" style={{animationDuration: '1.2s'}} />
                    <circle cx="50" cy="60" r="4" fill="#f59e0b" />
                    <text x="30" y="55" fill="white" fontSize="8" fontWeight="bold">SA Node</text>
                </g>

                {/* AV Node */}
                <g onClick={() => handleClick("AV Node")} className={`cursor-pointer transition-opacity ${selected === 'AV Node' ? 'opacity-100' : 'hover:opacity-80 opacity-90'}`}>
                    <circle cx="90" cy="90" r="7" fill={selected === 'AV Node' ? '#3b82f6' : 'transparent'} stroke={selected === 'AV Node' ? 'white' : 'none'} strokeWidth="1" />
                    <circle cx="90" cy="90" r="5" fill="#f59e0b" />
                    <text x="100" y="90" fill="white" fontSize="8" fontWeight="bold">AV Node</text>
                </g>

                {/* Pathways - Bundle of His approximation */}
                <g onClick={() => handleClick("Bundle of His")} className={`cursor-pointer transition-opacity ${selected === 'Bundle of His' ? 'opacity-100' : 'hover:opacity-80 opacity-90'}`}>
                        <path d="M50 60 Q 70 70, 90 90" stroke="#fbbf24" strokeDasharray="3 2" strokeWidth="1.5" fill="none" className="animate-dash" />
                        <path d="M90 90 L 95 110 L 80 140" stroke={selected === 'Bundle of His' ? '#3b82f6' : '#fbbf24'} strokeWidth={selected === 'Bundle of His' ? 3 : 2} fill="none" />
                        <path d="M95 110 L 110 140" stroke={selected === 'Bundle of His' ? '#3b82f6' : '#fbbf24'} strokeWidth={selected === 'Bundle of His' ? 3 : 2} fill="none" />
                </g>
                
                {/* Purkinje */}
                <g onClick={() => handleClick("Purkinje Fibers")} className={`cursor-pointer transition-opacity ${selected === 'Purkinje Fibers' ? 'opacity-100' : 'hover:opacity-80 opacity-90'}`}>
                    <path d="M80 140 Q 60 160, 40 120" stroke={selected === 'Purkinje Fibers' ? '#3b82f6' : '#fbbf24'} strokeWidth={selected === 'Purkinje Fibers' ? 2 : 1} fill="none" />
                    <path d="M110 140 Q 130 160, 160 120" stroke={selected === 'Purkinje Fibers' ? '#3b82f6' : '#fbbf24'} strokeWidth={selected === 'Purkinje Fibers' ? 2 : 1} fill="none" />
                    <text x="100" y="170" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Purkinje Fibers</text>
                </g>
            </svg>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-slate-400">
                <Activity className="w-4 h-4" />
                <span>Rate: 60 BPM</span>
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {exercise.options?.map(opt => (
                    <button 
                        key={opt}
                        onClick={() => handleClick(opt)}
                        disabled={isChecked}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${selected === opt ? 'bg-red-500 text-white border-red-600' : 'bg-card hover:bg-muted'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={handleCheck} 
                    disabled={!selected || isChecked}
                    className="px-8 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            </div>

            {isChecked && (
                <div className={`p-4 rounded-lg border ${selected === exercise.answer ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold">
                        {selected === exercise.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                        {selected === exercise.answer ? 'Correct!' : 'Incorrect'}
                    </div>
                    <p className="text-sm">{exercise.explanation}</p>
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
            theoryContent={<TheoryPane exercise={exercise} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export const CardiologyAnatomy: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    return (
        <AnatomyExercise 
            exercise={currentExercise} 
            settings={settings}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
        />
    );
};
