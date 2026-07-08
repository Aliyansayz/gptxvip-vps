
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Bug, CircleDashed, ShieldAlert, Dna, Play, RotateCcw } from 'lucide-react';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
import { LabSettings } from '../../LabSettingsMenu';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
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
                    <BookOpenText className="w-5 h-5 text-green-600" />
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
                                <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <ShieldAlert className="w-3 h-3 text-blue-500" /> Application
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

const KirbyBauerVisual: React.FC<{
    disksPlaced: string[];
    showZones: boolean;
    handleDrop: (e: React.DragEvent, id: string) => void;
    handleIncubate: () => void;
    antibiotics: { id: string; color: string; label: string; zoneSize: number }[];
}> = ({ disksPlaced, showZones, handleDrop, handleIncubate, antibiotics }) => {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-2xl mx-auto">
            {/* Petri Dish */}
            <div 
                className="relative w-64 h-64 bg-[#fefce8] dark:bg-yellow-900/20 rounded-full border-8 border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex-shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    const id = e.dataTransfer.getData('text');
                    handleDrop(e, id);
                }}
            >
                {/* Bacterial Lawn */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                
                {/* Zones & Disks */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Pre-positioning logic for simplicity in this demo */}
                    {antibiotics.map((ab, idx) => {
                        // Calculate positions in a triangle
                        const angle = (idx / 3) * Math.PI * 2 - Math.PI / 2;
                        const r = 60;
                        const x = 128 + Math.cos(angle) * r;
                        const y = 128 + Math.sin(angle) * r;
                        
                        if (!disksPlaced.includes(ab.id)) return null;

                        return (
                            <div key={ab.id} className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
                                {/* Zone of Inhibition */}
                                {showZones && (
                                    <div 
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 dark:bg-black border border-white/20 transition-all duration-1000 ease-out"
                                        style={{ 
                                            width: `${ab.zoneSize}px`, 
                                            height: `${ab.zoneSize}px`, 
                                            zIndex: 0 // Behind disk
                                        }}
                                    />
                                )}
                                {/* Antibiotic Disk */}
                                <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm flex items-center justify-center text-[8px] font-bold ${ab.color}`}>
                                    {ab.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 min-w-[200px]">
                <p className="text-sm font-semibold text-center">Drag Disks to Plate:</p>
                <div className="flex flex-col gap-2">
                    {antibiotics.map(ab => (
                        <div 
                            key={ab.id} 
                            draggable 
                            onDragStart={(e) => e.dataTransfer.setData('text', ab.id)}
                            className={`p-2 rounded border bg-card cursor-grab active:cursor-grabbing flex items-center gap-2 ${disksPlaced.includes(ab.id) ? 'opacity-50 cursor-default' : ''}`}
                        >
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-bold ${ab.color}`}>{ab.label}</div>
                            <span className="text-sm">{ab.id}</span>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={handleIncubate} 
                    disabled={disksPlaced.length < 3 || showZones}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Incubate (24h)
                </button>
            </div>
        </div>
    );
};

const KirbyBauerInteraction: React.FC<{
    exercise: Exercise;
    showZones: boolean;
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, showZones, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => {
    if (!showZones) return <p className="text-muted-foreground text-center italic">Incubate the plate to see results.</p>;

    return (
        <div className="animate-fade-in space-y-4">
            <p className="font-semibold text-lg">{exercise.question}</p>
            <div className="grid gap-2">
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => handleSelectAnswer(opt)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === opt 
                            ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300' : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300')
                            : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} flex items-start gap-3 animate-fade-in`}>
                    <CircleDashed className={`w-5 h-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                        <p className="font-bold">{isCorrect ? 'Susceptibility Confirmed' : 'Incorrect Interpretation'}</p>
                        <p className="text-sm opacity-90">{exercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const NaturalSelectionVisual: React.FC<{
    generation: number;
    handleAction: () => void;
    resetSim: () => void;
}> = ({ generation, handleAction, resetSim }) => {
    const renderBacteria = () => {
        // Simple grid of dots
        const dots = [];
        const count = 10;
        
        for(let i=0; i<count; i++) {
            let color = 'bg-blue-400'; // Default Susceptible
            let isAlive = true;

            if (generation === 0) {
                // 1 mutant at index 5
                if (i === 5) color = 'bg-red-500';
            } else if (generation === 1) {
                // All blue dead, only red at index 5 alive
                if (i === 5) color = 'bg-red-500';
                else {
                    isAlive = false;
                    color = 'bg-gray-300 opacity-20'; // Dead
                }
            } else if (generation === 2) {
                // All red
                color = 'bg-red-500';
            }

            dots.push(
                <div key={i} className={`w-8 h-8 rounded-full ${color} transition-all duration-700 flex items-center justify-center shadow-sm`}>
                    {isAlive && <div className="w-2 h-2 bg-white rounded-full opacity-50" />}
                </div>
            );
        }
        return dots;
    };

    return (
        <div className="space-y-6 w-full max-w-lg mx-auto">
            {/* Simulation Area */}
            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <div className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                    Generation {generation}: {generation === 0 ? 'Mixed Population' : generation === 1 ? 'Post-Antibiotic' : 'Resistant Population'}
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 max-w-sm mb-8">
                    {renderBacteria()}
                </div>

                <div className="flex gap-4 w-full max-w-xs">
                    {generation > 0 && (
                        <button onClick={resetSim} className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors" title="Reset">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    )}
                    {generation < 2 && (
                        <button 
                            onClick={handleAction} 
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-md transition-all"
                        >
                            {generation === 0 ? 'Apply Antibiotic' : 'Time Passes (Reproduce)'} <Play className="w-4 h-4 fill-current" />
                        </button>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div> <span>Susceptible (Normal)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div> <span>Resistant (Mutant)</span>
                </div>
            </div>
        </div>
    );
};

const NaturalSelectionInteraction: React.FC<{
    exercise: Exercise;
    generation: number;
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, generation, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => {
    if (generation < 2) return <p className="text-muted-foreground text-center italic">Complete the simulation to unlock the question.</p>;

    return (
        <div className="animate-fade-in space-y-4">
            <p className="font-semibold text-lg">{exercise.question}</p>
            <div className="grid gap-2">
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => handleSelectAnswer(opt)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === opt 
                            ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300' : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300')
                            : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} flex items-start gap-3 animate-fade-in`}>
                    {isCorrect ? <ShieldAlert className="w-5 h-5" /> : <CircleDashed className="w-5 h-5" />}
                    <div>
                        <p className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                        <p className="text-sm opacity-90">{exercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const SelectionVisual = () => (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Selective Pressure</h4>
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-400 opacity-20"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-8 h-8 rounded-full bg-blue-400 opacity-20"></div>
            </div>
            <div className="text-[10px] font-bold text-red-500 uppercase">One Survives</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">The antibiotic "selects" only those with the right tools to live.</p>
    </div>
);

const TransferVisual = () => (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Gene Transfer</h4>
        <div className="flex justify-center items-center gap-6">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                <motion.div 
                    className="w-4 h-4 bg-yellow-400 rounded-sm"
                    animate={{ x: [0, 60], opacity: [1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-400"></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Bacteria can "trade" resistance blueprints like passing a manual.</p>
    </div>
);

export const AntibioticResistance: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
    const theoryVisual = 
        currentExercise.componentId === 'natural_selection_sim' ? <SelectionVisual /> :
        currentExercise.title.toLowerCase().includes('transfer') ? <TransferVisual /> : null;
    // State for Kirby Bauer
    const [disksPlaced, setDisksPlaced] = useState<string[]>([]);
    const [showZones, setShowZones] = useState(false);
    const [kbSelectedAnswer, setKbSelectedAnswer] = useState<string | null>(null);
    const [kbShowResult, setKbShowResult] = useState(false);
    const [kbIsCorrect, setKbIsCorrect] = useState(false);

    // State for Natural Selection
    const [generation, setGeneration] = useState(0);
    const [nsSelectedAnswer, setNsSelectedAnswer] = useState<string | null>(null);
    const [nsShowResult, setNsShowResult] = useState(false);
    const [nsIsCorrect, setNsIsCorrect] = useState(false);

    useEffect(() => {
        // Reset KB State
        setDisksPlaced([]);
        setShowZones(false);
        setKbSelectedAnswer(null);
        setKbShowResult(false);
        setKbIsCorrect(false);

        // Reset NS State
        setGeneration(0);
        setNsSelectedAnswer(null);
        setNsShowResult(false);
        setNsIsCorrect(false);
    }, [currentExercise]);

    // Logic for Kirby Bauer
    const antibiotics = [
        { id: 'Penicillin', color: 'bg-white text-blue-600', label: 'P', zoneSize: 0 }, // Resistant
        { id: 'Amoxicillin', color: 'bg-white text-green-600', label: 'AMX', zoneSize: 40 }, // Intermediate
        { id: 'Ciprofloxacin', color: 'bg-white text-red-600', label: 'CIP', zoneSize: 100 }, // Susceptible
    ];

    const handleDrop = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (!disksPlaced.includes(id)) {
            setDisksPlaced([...disksPlaced, id]);
            toast.success(`${id} disk placed.`);
        }
    };

    const handleIncubate = () => {
        setShowZones(true);
        toast.info("Incubating... Zones appearing.");
    };

    const handleKbSelectAnswer = (option: string) => {
        if (kbShowResult) return;
        setKbSelectedAnswer(option);
        const correct = option === currentExercise.answer;
        setKbIsCorrect(correct);
        setKbShowResult(true);
        if(correct) toast.success("Correct Analysis!");
        else toast.error("Incorrect interpretation.");
    };

    // Logic for Natural Selection
    const handleAction = () => {
        if (generation < 2) {
            setGeneration(g => g + 1);
            if (generation === 0) toast.info("Antibiotics applied. Susceptible bacteria dying...");
            if (generation === 1) toast.success("Surviving population reproducing...");
        }
    };

    const resetSim = () => setGeneration(0);

    const handleNsSelectAnswer = (option: string) => {
        if (nsShowResult) return;
        setNsSelectedAnswer(option);
        const correct = option === currentExercise.answer;
        setNsIsCorrect(correct);
        setNsShowResult(true);
        if(correct) toast.success("Correct Concept!");
        else toast.error("Incorrect.");
    };

    if (!currentExercise) return null;

    let VisualContent;
    let InteractionContent;

    if (currentExercise.componentId === 'natural_selection_sim') {
        VisualContent = (
            <NaturalSelectionVisual 
                generation={generation} 
                handleAction={handleAction} 
                resetSim={resetSim} 
            />
        );
        InteractionContent = (
            <NaturalSelectionInteraction 
                exercise={currentExercise} 
                generation={generation} 
                selectedAnswer={nsSelectedAnswer} 
                isCorrect={nsIsCorrect} 
                showResult={nsShowResult} 
                handleSelectAnswer={handleNsSelectAnswer} 
            />
        );
    } else {
        VisualContent = (
            <KirbyBauerVisual 
                disksPlaced={disksPlaced} 
                showZones={showZones} 
                handleDrop={handleDrop} 
                handleIncubate={handleIncubate} 
                antibiotics={antibiotics} 
            />
        );
        InteractionContent = (
            <KirbyBauerInteraction 
                exercise={currentExercise} 
                showZones={showZones} 
                selectedAnswer={kbSelectedAnswer} 
                isCorrect={kbIsCorrect} 
                showResult={kbShowResult} 
                handleSelectAnswer={handleKbSelectAnswer} 
            />
        );
    }

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
