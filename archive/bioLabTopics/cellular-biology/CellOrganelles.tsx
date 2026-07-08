
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { Dna, Zap, Factory, Box, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { LabSettings } from '../../LabSettingsMenu';

interface ChapterProps {
    labData: LabData;
    onComplete: () => void;
    onBack: () => void;
    step: number;
    setStep: (updater: number | ((s: number) => number)) => void;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
    settings?: LabSettings;
}

// ... existing organelleData and helper components ...
const organelleData = {
    nucleus: { name: 'Nucleus', function: 'Contains the cell\'s genetic material (DNA) and controls cell activities.', icon: Dna, color: 'text-purple-500' },
    mitochondrion: { name: 'Mitochondrion', function: 'The "powerhouse" of the cell, generating ATP through cellular respiration.', icon: Zap, color: 'text-yellow-500' },
    ribosome: { name: 'Ribosome', function: 'Synthesizes proteins based on mRNA instructions.', icon: Factory, color: 'text-orange-500' },
    cytoplasm: { name: 'Cytoplasm', function: 'The jelly-like substance filling the cell, where organelles are suspended.', icon: () => <div className="w-5 h-5 rounded-full bg-blue-200" />, color: 'text-blue-300' },
    golgi: { name: 'Golgi Apparatus', function: 'Modifies, sorts, and packages proteins and lipids for secretion or delivery to other organelles.', icon: Box, color: 'text-green-500' },
    lysosome: { name: 'Lysosome', function: 'Contains digestive enzymes to break down waste materials and cellular debris.', icon: Trash2, color: 'text-red-500' },
};

export const AnimalCellExplorer: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const [hovered, setHovered] = useState<keyof typeof organelleData | null>(null);
    const ActiveOrganelleEntry = hovered ? organelleData[hovered] : null;
    const ActiveIcon = ActiveOrganelleEntry ? ActiveOrganelleEntry.icon : null;

    return (
        <div className="space-y-4 w-full">
            <div className="w-full max-w-lg mx-auto aspect-[4/3] bg-background/50 rounded-lg border p-4 flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 200 150" className="w-full h-auto">
                    <path d="M 100,5 A 95,70 0 1,0 100,145 A 95,70 0 1,0 100,5 Z" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
                    <circle cx="100" cy="75" r="25" fill="#a855f7" opacity="0.5" className="cursor-pointer hover:opacity-80" onMouseEnter={() => setHovered('nucleus')} onMouseLeave={() => setHovered(null)} />
                    <ellipse cx="50" cy="50" rx="15" ry="8" fill="#f59e0b" opacity="0.7" className="cursor-pointer hover:opacity-90" onMouseEnter={() => setHovered('mitochondrion')} onMouseLeave={() => setHovered(null)} />
                    <ellipse cx="150" cy="100" rx="15" ry="8" fill="#f59e0b" opacity="0.7" className="cursor-pointer hover:opacity-90" onMouseEnter={() => setHovered('mitochondrion')} onMouseLeave={() => setHovered(null)} />
                    <circle cx="80" cy="40" r="3" fill="#f97316" className="cursor-pointer" onMouseEnter={() => setHovered('ribosome')} onMouseLeave={() => setHovered(null)} />
                    <circle cx="120" cy="110" r="3" fill="#f97316" className="cursor-pointer" onMouseEnter={() => setHovered('ribosome')} onMouseLeave={() => setHovered(null)} />
                    <path d="M140 40 C 150 45, 155 55, 150 65 S 140 75, 130 70" fill="#22c55e" opacity="0.6" className="cursor-pointer hover:opacity-80" onMouseEnter={() => setHovered('golgi')} onMouseLeave={() => setHovered(null)} />
                    <circle cx="60" cy="100" r="8" fill="#ef4444" opacity="0.6" className="cursor-pointer hover:opacity-80" onMouseEnter={() => setHovered('lysosome')} onMouseLeave={() => setHovered(null)} />
                </svg>
                <div className="absolute bottom-4 left-4 p-3 bg-card/90 backdrop-blur rounded-lg border w-64 min-h-[6rem] flex flex-col justify-center shadow-md">
                    {ActiveOrganelleEntry && ActiveIcon ? <>
                        <h4 className="font-bold flex items-center gap-2"><ActiveIcon className={`w-5 h-5 ${ActiveOrganelleEntry.color}`} /> {ActiveOrganelleEntry.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{ActiveOrganelleEntry.function}</p>
                    </> : <p className="text-sm text-muted-foreground text-center italic">Hover over cell parts to identify them</p>}
                </div>
            </div>
        </div>
    );
};

export const PlantVsAnimalCell: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    return (
        <div className="space-y-4 w-full">
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
                <div className="bg-background/50 rounded-lg border p-4 flex flex-col items-center justify-center aspect-square md:aspect-auto">
                    <h4 className="font-bold text-center mb-2">Animal Cell</h4>
                    <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[150px]">
                        <path d="M 50,5 A 45,40 0 1,0 50,95 A 45,40 0 1,0 50,5 Z" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                        <circle cx="50" cy="50" r="15" fill="#a855f7" opacity="0.5" />
                        <ellipse cx="30" cy="35" rx="10" ry="5" fill="#f59e0b" opacity="0.7" />
                    </svg>
                </div>
                <div className="bg-background/50 rounded-lg border p-4 flex flex-col items-center justify-center aspect-square md:aspect-auto">
                    <h4 className="font-bold text-center mb-2">Plant Cell</h4>
                    <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[150px]">
                        <rect x="10" y="10" width="80" height="80" rx="5" fill="hsl(var(--card))" stroke="#166534" strokeWidth="3" />
                        <rect x="12" y="12" width="76" height="76" rx="3" fill="none" stroke="#a3e635" strokeWidth="1" />
                        <circle cx="50" cy="50" r="12" fill="#a855f7" opacity="0.5" />
                        <ellipse cx="30" cy="30" rx="8" ry="4" fill="#f59e0b" opacity="0.7" />
                        <rect x="60" y="60" width="20" height="15" rx="3" fill="#22c55e" opacity="0.8" />
                    </svg>
                </div>
            </div>
        </div>
    )
};

import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

// ... existing imports

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
                    <BookOpenText className="w-5 h-5 text-violet-500" />
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
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1">Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Visuals ---

export const CellCityVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900 w-full max-w-sm mx-auto">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Cell City Analogy</h4>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center text-xl">🏛️</div>
                <div className="text-[10px] font-bold">Nucleus</div>
                <div className="text-[8px] text-muted-foreground">City Hall</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center text-xl">⚡</div>
                <div className="text-[10px] font-bold">Mitochondria</div>
                <div className="text-[8px] text-muted-foreground">Power Plant</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center text-xl">🏭</div>
                <div className="text-[10px] font-bold">Ribosome</div>
                <div className="text-[8px] text-muted-foreground">Factory</div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center text-xl">📦</div>
                <div className="text-[10px] font-bold">Golgi</div>
                <div className="text-[8px] text-muted-foreground">Post Office</div>
            </div>
        </div>
    </div>
);

export const PlantVsAnimalVisual = () => (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900 w-full max-w-sm mx-auto">
        <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-widest text-center mb-4">Plant vs Animal Cell</h4>
        <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2 text-center w-5/12">
                <div className="w-12 h-12 rounded-full border-2 border-red-400 bg-red-100 flex items-center justify-center">🐶</div>
                <div className="text-[9px] font-bold">Animal</div>
                <ul className="text-[8px] text-muted-foreground text-center">
                    <li>No Wall</li>
                    <li>No Chloroplasts</li>
                    <li>Small Vacuoles</li>
                </ul>
            </div>
            <div className="h-16 w-px bg-border"></div>
            <div className="flex flex-col items-center gap-2 text-center w-5/12">
                <div className="w-12 h-12 rounded-none border-4 border-green-600 bg-green-100 flex items-center justify-center">🌻</div>
                <div className="text-[9px] font-bold">Plant</div>
                <ul className="text-[8px] text-muted-foreground text-center">
                    <li>Cell Wall</li>
                    <li>Chloroplasts</li>
                    <li>Large Vacuole</li>
                </ul>
            </div>
        </div>
    </div>
);

export const CellOrganelles: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const [answers, setAnswers] = useState<Record<string, string | string[] | null>>({});
    const [feedback, setFeedback] = useState<Record<string, { correct: boolean; text: string; } | null>>({});

    const currentExercise = exercises[step];

    if (!currentExercise) return null;

    const exerciseComponentMap: Record<string, React.FC<any>> = {
        'animal_cell_explorer': AnimalCellExplorer,
        'organelle_matching_game': AnimalCellExplorer,
        'plant_vs_animal_cell': PlantVsAnimalCell,
    };

    const ActiveExerciseUI = exerciseComponentMap[currentExercise.componentId];

    const handleSelectOption = (option: string) => {
        if (feedback[currentExercise.componentId]) return;
        setAnswers(prev => ({ ...prev, [currentExercise.componentId]: option }));
    };

    const checkAnswer = () => {
        const selectedAnswer = answers[currentExercise.componentId];
        if (!selectedAnswer) return;

        const isCorrect = selectedAnswer === currentExercise.answer;

        if (isCorrect) {
            toast.success("Correct!");
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: true, text: currentExercise.explanation || "Correct!" } }));
        } else {
            toast.error("Not quite right.");
            setFeedback(prev => ({ ...prev, [currentExercise.componentId]: { correct: false, text: "Incorrect. Please review the diagrams and try again." } }));
        }
    };

    const currentFeedback = feedback[currentExercise.componentId];
    const currentAnswer = answers[currentExercise.componentId];

    const VisualContent = (
        <div className="w-full flex justify-center">
             {ActiveExerciseUI ? <ActiveExerciseUI exercise={currentExercise} /> : <p>Exercise visual not found.</p>}
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4 w-full">
            <p className="font-semibold text-lg">{currentExercise.question}</p>
            <div className="grid gap-2">
                {currentExercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => handleSelectOption(opt)} 
                        disabled={!!currentFeedback} 
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            currentAnswer === opt 
                                ? 'bg-violet-600 text-white border-violet-700 shadow-md' 
                                : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!currentFeedback && (
                <button 
                    onClick={checkAnswer} 
                    disabled={!currentAnswer} 
                    className="mt-4 w-full px-4 py-3 bg-gradient-bio-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                >
                    Check Answer
                </button>
            )}
            {currentFeedback && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 text-sm animate-fade-in ${currentFeedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    <span className="font-bold">{currentFeedback.correct ? "Correct! " : "Incorrect. "}</span>
                    {currentFeedback.text}
                </div>
            )}
        </div>
    );

    const theoryVisual = (() => {
        const t = currentExercise.title.toLowerCase();
        // Only show plant vs animal comparison visual when specifically talking about both or differences
        if (t.includes('plant') && t.includes('animal') || t.includes('differences') || t.includes('vs')) {
            return <PlantVsAnimalVisual />;
        }
        return <CellCityVisual />;
    })();

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} visual={theoryVisual} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default CellOrganelles;
