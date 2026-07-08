import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon, HeartIcon } from '../../icons';
import { Stethoscope, Activity, AlertTriangle, Timer, ArrowRight } from 'lucide-react';
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
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                                </h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                                <CardiologyAnalogyVisual title={title} analogy={analogy} />
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

interface SubComponentProps {
    exercise: Exercise;
    onAnswered: (c: boolean) => void;
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

// --- Visual 1: Plaque Rupture ---
const PlaqueRuptureSim: React.FC<SubComponentProps> = ({ exercise, onAnswered, infoVisible, infoPlacement, settings }) => {
    const [stage, setStage] = useState(0); // 0: Stable, 1: Rupture, 2: Clot
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    const rupture = () => {
        if(stage === 0) setStage(1);
        setTimeout(() => setStage(2), 1500);
    };

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Mechanism Identified"); else toast.error("Incorrect");
    };

    const VisualContent = (
        <div 
            className="relative h-48 bg-pink-50 dark:bg-pink-900/20 rounded-xl overflow-hidden flex items-center border border-pink-200 cursor-pointer w-full"
            onClick={rupture}
        >
            <div className="absolute top-2 left-4 px-2 py-1 bg-white/80 dark:bg-black/50 rounded text-xs font-bold text-red-600">
                {stage === 0 ? "Click to Stress Artery" : stage === 1 ? "RUPTURE!" : "OCCLUSION"}
            </div>

            {/* Artery Walls */}
            <div className="absolute top-0 w-full h-4 bg-red-800 z-20"></div>
            <div className="absolute bottom-0 w-full h-4 bg-red-800 z-20"></div>

            {/* Blood Flow */}
            <div className="absolute inset-0 flex items-center gap-8 opacity-50">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className={`w-3 h-3 bg-red-500 rounded-full ${stage === 2 ? 'animate-none' : 'animate-slide-ltr'}`} style={{animationDuration: '2s'}}></div>
                ))}
            </div>

            {/* Plaque */}
            <div className="absolute bottom-4 left-1/3 w-32 h-20 bg-yellow-200 rounded-t-full border-t-4 border-white z-10 overflow-hidden">
                <div className="w-full h-full bg-yellow-400 opacity-50 blur-sm"></div>
                {/* Rupture crack */}
                <div className={`absolute top-0 left-1/2 w-1 h-10 bg-red-600 -translate-x-1/2 transition-all duration-300 ${stage > 0 ? 'scale-y-100' : 'scale-y-0'}`}></div>
            </div>

            {/* Thrombus */}
            <div className={`absolute bottom-16 left-1/3 w-32 h-24 bg-red-900/90 rounded-full blur-sm z-10 transition-all duration-1000 ${stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
        </div>
    );

    const InteractionContent = (
        <div className="grid gap-2 w-full">
            <p className="font-semibold">{exercise.question}</p>
            {exercise.options?.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} 
                    className={`p-3 text-left border rounded hover:bg-muted ${selectedAnswer === opt ? (opt === exercise.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}>
                    {opt}
                </button>
            ))}
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

// --- Visual 2: ECG Locator ---
const StemiLocator: React.FC<SubComponentProps> = ({ exercise, onAnswered, infoVisible, infoPlacement, settings }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Simple representation of ECG leads
    const leads = [
        { name: 'I', wall: 'Lateral', status: 'normal' }, { name: 'aVR', wall: 'None', status: 'normal' }, { name: 'V1', wall: 'Septal', status: 'normal' }, { name: 'V4', wall: 'Anterior', status: 'normal' },
        { name: 'II', wall: 'Inferior', status: 'elevated' }, { name: 'aVL', wall: 'Lateral', status: 'normal' }, { name: 'V2', wall: 'Septal', status: 'normal' }, { name: 'V5', wall: 'Lateral', status: 'normal' },
        { name: 'III', wall: 'Inferior', status: 'elevated' }, { name: 'aVF', wall: 'Inferior', status: 'elevated' }, { name: 'V3', wall: 'Anterior', status: 'normal' }, { name: 'V6', wall: 'Lateral', status: 'normal' },
    ];

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Localization"); else toast.error("Incorrect");
    };

    const VisualContent = (
        <div className="grid grid-cols-4 gap-2 bg-slate-900 p-4 rounded-xl w-full">
            {leads.map(lead => (
                <div key={lead.name} className={`h-16 border border-slate-700 rounded flex flex-col items-center justify-center relative ${lead.status === 'elevated' ? 'bg-red-900/30 border-red-500' : ''}`}>
                    <span className="absolute top-1 left-2 text-[10px] text-slate-400">{lead.name}</span>
                    {/* ECG Drawing */}
                    <svg viewBox="0 0 50 30" className="w-full h-full">
                        {lead.status === 'normal' 
                            ? <path d="M0 15 L 10 15 L 12 10 L 14 25 L 16 15 L 25 15 L 30 10 L 35 15 L 50 15" fill="none" stroke="#34d399" strokeWidth="1" />
                            : <path d="M0 15 L 10 15 L 12 10 L 14 25 L 16 5 L 25 5 L 30 10 L 35 15 L 50 15" fill="none" stroke="#ef4444" strokeWidth="2" />
                        }
                    </svg>
                    {lead.status === 'elevated' && <span className="absolute bottom-1 right-1 text-[8px] text-red-400 font-bold">STE</span>}
                </div>
            ))}
        </div>
    );

    const InteractionContent = (
        <div className="grid gap-2 w-full">
            <p className="font-semibold">{exercise.question}</p>
            {exercise.options?.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} 
                    className={`p-3 text-left border rounded hover:bg-muted ${selectedAnswer === opt ? (opt === exercise.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}>
                    {opt}
                </button>
            ))}
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

// --- Visual 3: Treatment Drag Drop ---
const TreatmentDrag: React.FC<SubComponentProps> = ({ exercise, onAnswered, infoVisible, infoPlacement, settings }) => {
    // Simplified for this context: Click to activate
    const [treatments, setTreatments] = useState({ aspirin: false, oxygen: false, nitroglycerin: false, cath: false });
    const [completed, setCompleted] = useState(false);

    const toggle = (t: keyof typeof treatments) => {
        if(completed) return;
        setTreatments(prev => {
            const next = { ...prev, [t]: !prev[t] };
            if (next.aspirin && next.nitroglycerin && next.cath) {
                setCompleted(true);
                onAnswered(true);
                toast.success("Protocol Complete: Reperfusion Started!");
            }
            return next;
        });
    };

    const VisualContent = (
        <div className="w-full">
             {completed ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <p className="font-bold">Correct!</p>
                    <p className="text-sm">Aspirin prevents clot growth. Nitrates reduce pain/preload. Cath Lab opens the artery. Oxygen is secondary.</p>
                </div>
            ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                    <p className="font-bold">Select Treatments</p>
                    <p className="text-sm">Choose the correct interventions for acute MI.</p>
                </div>
            )}
        </div>
    );

    const InteractionContent = (
        <div className="grid grid-cols-2 gap-4 w-full">
            <button onClick={() => toggle('aspirin')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${treatments.aspirin ? 'bg-green-100 border-green-500' : 'hover:bg-muted'}`}>
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-xs">ASA</div>
                <span>Aspirin</span>
            </button>
            <button onClick={() => toggle('nitroglycerin')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${treatments.nitroglycerin ? 'bg-green-100 border-green-500' : 'hover:bg-muted'}`}>
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-xs">NTG</div>
                <span>Nitrates</span>
            </button>
            <button onClick={() => toggle('oxygen')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${treatments.oxygen ? 'bg-blue-100 border-blue-500' : 'hover:bg-muted'}`}>
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-xs">O2</div>
                <span>Oxygen (if sat &lt;90)</span>
            </button>
            <button onClick={() => toggle('cath')} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${treatments.cath ? 'bg-red-100 border-red-500 animate-pulse' : 'hover:bg-muted'}`}>
                <Activity className="w-6 h-6" />
                <span>Cath Lab (PCI)</span>
            </button>
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

export const MyocardialInfarction: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    let Content = null;
    if (currentExercise.componentId === 'mi_plaque_rupture_sim') Content = PlaqueRuptureSim;
    else if (currentExercise.componentId === 'mi_stemi_locator') Content = StemiLocator;
    else Content = TreatmentDrag;

    return (
        <Content 
            exercise={currentExercise} 
            onAnswered={() => {}} 
            infoVisible={infoVisible} 
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};
