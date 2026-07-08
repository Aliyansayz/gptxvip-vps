import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { Sun, Leaf, Rabbit, Bird, Skull } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';
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
  settings?: LabSettings;
}

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
                    <BookOpenText className="w-5 h-5 text-teal-500" />
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

                        {analogy && (
                            <TheoryVisual 
                                analogyName={analogy} 
                                keywords={[title, content]} 
                            />
                        )}
                        
                        {visual && (
                            <div className="my-6">
                                {visual}
                            </div>
                        )}

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

export const EnergyPyramidVisual = () => (
    <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900">
        <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest text-center mb-4">The 10% Rule</h4>
        <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-8 bg-red-400/80 rounded-t-lg flex items-center justify-center text-[8px] text-white font-bold relative group">
                0.1%
                <div className="absolute left-full ml-2 text-red-500 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Tertiary Consumers</div>
            </div>
            <div className="w-24 h-8 bg-orange-400/80 flex items-center justify-center text-[8px] text-white font-bold relative group">
                1%
                <div className="absolute left-full ml-2 text-orange-500 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Secondary Consumers</div>
            </div>
            <div className="w-32 h-8 bg-yellow-400/80 flex items-center justify-center text-[8px] text-white font-bold relative group">
                10%
                <div className="absolute left-full ml-2 text-yellow-600 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Primary Consumers</div>
            </div>
            <div className="w-40 h-8 bg-green-500/80 rounded-b-lg flex items-center justify-center text-[8px] text-white font-bold relative group">
                100% Energy
                <div className="absolute left-full ml-2 text-green-600 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Producers</div>
            </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-[9px] text-muted-foreground">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span>Energy Source: Sun</span>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">90% of energy is lost as heat at each step.</p>
    </div>
);

const FoodChainVisual: React.FC<{
    slots: (string | null)[];
    organisms: any[];
    handleDrop: (organismId: string | null, index: number) => void;
}> = ({ slots, organisms, handleDrop }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            {slots.map((slot, index) => (
                <div key={index} className="flex items-center">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center bg-card hover:bg-muted/50 transition-colors relative">
                        {slot ? (
                            <>
                                {(() => {
                                    const org = organisms.find(o => o.id === slot);
                                    if (!org) return null;
                                    const Icon = org.icon;
                                    return (
                                        <>
                                            <Icon className={`w-8 h-8 ${org.color} mb-1`} />
                                            <span className="text-xs font-bold">{org.name}</span>
                                            <button 
                                                onClick={() => handleDrop(null, index)}
                                                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm"
                                            >
                                                ×
                                            </button>
                                        </>
                                    );
                                })()}
                            </>
                        ) : (
                            <span className="text-xs text-muted-foreground font-medium">Level {index + 1}</span>
                        )}
                    </div>
                    {index < slots.length - 1 && <div className="text-muted-foreground mx-2">➡️</div>}
                </div>
            ))}
        </div>
    );
};

const FoodChainInteraction: React.FC<{
    exercise: Exercise;
    organisms: any[];
    slots: (string | null)[];
    handleDrop: (organismId: string, index: number) => void;
    checkChain: () => void;
    feedback: { correct: boolean; text: string } | null;
}> = ({ exercise, organisms, slots, handleDrop, checkChain, feedback }) => {
    return (
        <div className="space-y-6 w-full">
            <div className="bg-muted/30 p-4 rounded-xl border">
                <h4 className="text-sm font-semibold mb-3 text-center">Available Organisms</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    {organisms.map((org) => (
                        <button
                            key={org.id}
                            onClick={() => {
                                const firstEmpty = slots.findIndex(s => s === null);
                                if (firstEmpty !== -1) handleDrop(org.id, firstEmpty);
                            }}
                            disabled={slots.includes(org.id)}
                            className="flex flex-col items-center p-3 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <org.icon className={`w-6 h-6 ${org.color} mb-1`} />
                            <span className="text-xs font-medium">{org.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <p className="font-semibold text-lg mb-4">{exercise.question}</p>
                <button 
                    onClick={checkChain} 
                    className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    Check Food Chain
                </button>
                {feedback && (
                    <div className={`mt-4 p-4 rounded-lg border-l-4 text-sm ${feedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                        {feedback.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export const EnergyFlow: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
    const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);

    // Reset state on exercise change
    useEffect(() => {
        setSlots([null, null, null, null]);
        setFeedback(null);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const organisms = [
        { id: 'grass', name: 'Grass', icon: Leaf, color: 'text-green-500', type: 'producer' },
        { id: 'grasshopper', name: 'Grasshopper', icon: Rabbit, color: 'text-yellow-500', type: 'primary' }, // Using Rabbit as generic herbivore icon
        { id: 'frog', name: 'Frog', icon: Rabbit, color: 'text-orange-500', type: 'secondary' },
        { id: 'snake', name: 'Snake', icon: Skull, color: 'text-red-500', type: 'tertiary' },
        { id: 'hawk', name: 'Hawk', icon: Bird, color: 'text-red-700', type: 'quaternary' },
    ];

    const correctOrder = ['grass', 'grasshopper', 'frog', 'snake'];

    const handleDrop = (organismId: string | null, index: number) => {
        const newSlots = [...slots];
        newSlots[index] = organismId;
        setSlots(newSlots);
        setFeedback(null);
    };

    const checkChain = () => {
        const currentChain = slots.filter(s => s !== null);
        if (currentChain.length !== 4) {
            toast.error("Please fill all slots in the food chain.");
            return;
        }

        const isCorrect = currentChain.every((id, index) => id === correctOrder[index]);

        if (isCorrect) {
            toast.success("Correct Food Chain!");
            setFeedback({ correct: true, text: "Energy flows correctly from producer to apex predator." });
        } else {
            toast.error("Incorrect order.");
            setFeedback({ correct: false, text: "Remember: Producers -> Primary -> Secondary -> Tertiary." });
        }
    };

    const VisualContent = (
        <FoodChainVisual 
            slots={slots} 
            organisms={organisms} 
            handleDrop={handleDrop} 
        />
    );

    const InteractionContent = (
        <FoodChainInteraction 
            exercise={currentExercise}
            organisms={organisms}
            slots={slots}
            handleDrop={handleDrop}
            checkChain={checkChain}
            feedback={feedback}
        />
    );

    return (
        <BioLabLayout
            title={currentExercise.title}
            prompt={currentExercise.prompt}
            visualContent={VisualContent}
            interactionContent={InteractionContent}
            theoryContent={<TheoryPane exercise={currentExercise} visual={<EnergyPyramidVisual />} />}
            infoVisible={infoVisible}
            infoPlacement={infoPlacement}
            settings={settings}
        />
    );
};

export default EnergyFlow;
