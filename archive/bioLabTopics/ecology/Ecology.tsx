import React, { useState, useEffect, useRef } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, TreeDeciduous, Rabbit, Bird, LightbulbIcon } from '../../icons';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
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

export const EcosystemBalanceVisual: React.FC<{
    exercise: Exercise;
    producers: number;
    herbivores: number;
    carnivores: number;
    generations: number;
    ecosystemStable: boolean;
    pyramidOrder: string[];
}> = ({ exercise, producers, herbivores, carnivores, generations, ecosystemStable, pyramidOrder }) => {
    if (exercise.type === 'simulation') {
        return (
            <div className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-200">
                        <TreeDeciduous className="w-8 h-8 mx-auto text-green-500 mb-2" />
                        <p className="text-sm font-bold text-green-900 dark:text-green-200">Producers</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 my-2">{Math.round(producers)}</p>
                    </div>
                    <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-200">
                        <Rabbit className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Herbivores</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 my-2">{Math.round(herbivores)}</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-200">
                        <Bird className="w-8 h-8 mx-auto text-red-500 mb-2" />
                        <p className="text-sm font-bold text-red-900 dark:text-red-200">Carnivores</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 my-2">{Math.round(carnivores)}</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className={`inline-block text-sm px-4 py-1.5 rounded-full font-semibold ${!ecosystemStable ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}>
                        Generation: {generations}/10 {!ecosystemStable && '- COLLAPSED!'}
                    </div>
                </div>
            </div>
        );
    }

    if (exercise.type === 'pyramid') {
        return (
            <div className="flex flex-col-reverse items-center gap-2 min-h-[200px] justify-end p-4 bg-muted/30 rounded-xl border border-dashed w-full">
                {pyramidOrder.length === 0 && (<div className="text-muted-foreground text-sm my-auto">Click items below to build the pyramid</div>)}
                {pyramidOrder.map((item, i) => (
                    <div key={item} className="px-4 py-2 bg-gradient-genetics-accent text-white rounded-lg font-medium shadow-sm text-sm" style={{ width: `${80 - i * 15}%`, textAlign: 'center' }}>
                        {item}
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

const EcosystemInteraction: React.FC<{
    exercise: Exercise;
    producers: number;
    setProducers: (val: number) => void;
    herbivores: number;
    setHerbivores: (val: number) => void;
    carnivores: number;
    setCarnivores: (val: number) => void;
    generations: number;
    ecosystemStable: boolean;
    isSimulating: boolean;
    setIsSimulating: (val: boolean) => void;
    resetSimulation: () => void;
    checkSimulationResult: () => void;
    pyramidOrder: string[];
    setPyramidOrder: (val: string[]) => void;
    addToPyramid: (item: string) => void;
    checkPyramid: () => void;
    feedback: { correct: boolean, text: string } | null;
    setFeedback: (val: { correct: boolean, text: string } | null) => void;
}> = ({ 
    exercise, producers, setProducers, herbivores, setHerbivores, carnivores, setCarnivores, 
    generations, ecosystemStable, isSimulating, setIsSimulating, resetSimulation, checkSimulationResult,
    pyramidOrder, setPyramidOrder, addToPyramid, checkPyramid, feedback, setFeedback
}) => {
    if (exercise.type === 'simulation') {
        return (
            <div className="space-y-6 w-full">
                {!isSimulating && generations === 0 && (
                    <div className="bg-muted/50 p-6 rounded-xl border">
                        <h4 className="text-sm font-semibold mb-4 text-center text-muted-foreground">Adjust Initial Populations</h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-medium text-green-700 dark:text-green-300">Producers</label>
                                    <span className="text-xs font-mono bg-card px-2 py-0.5 rounded border">{Math.round(producers)}</span>
                                </div>
                                <input type="range" min="0" max="200" value={producers} onChange={(e) => setProducers(Number(e.target.value))} className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-medium text-amber-700 dark:text-amber-300">Herbivores</label>
                                    <span className="text-xs font-mono bg-card px-2 py-0.5 rounded border">{Math.round(herbivores)}</span>
                                </div>
                                <input type="range" min="0" max="150" value={herbivores} onChange={(e) => setHerbivores(Number(e.target.value))} className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-medium text-red-700 dark:text-red-300">Carnivores</label>
                                    <span className="text-xs font-mono bg-card px-2 py-0.5 rounded border">{Math.round(carnivores)}</span>
                                </div>
                                <input type="range" min="0" max="100" value={carnivores} onChange={(e) => setCarnivores(Number(e.target.value))} className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-3">
                    {generations > 0 && !isSimulating && <button onClick={resetSimulation} className="flex-1 py-3 text-sm border rounded-lg hover:bg-muted">Reset</button>}
                    {generations < 10 && ecosystemStable && <button onClick={() => setIsSimulating(true)} className="flex-1 bg-gradient-genetics-accent text-primary-foreground font-bold shadow-lg py-3 text-sm rounded-lg">{generations === 0 ? 'Start Simulation' : 'Continue'}</button>}
                </div>
                <div className={`mt-6`}>
                    <p className="font-semibold text-lg mb-4">{exercise.question}</p>
                    <button onClick={checkSimulationResult} disabled={generations < 10} className="w-full px-4 py-3 bg-gradient-genetics-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50">Check Stability</button>
                    {feedback && (<div className={`mt-6 p-4 rounded-lg border-l-4 text-sm ${feedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>{feedback.text}</div>)}
                </div>
            </div>
        );
    }

    if (exercise.type === 'pyramid') {
        return (
            <div className="space-y-6 w-full">
                <div className="grid grid-cols-2 gap-2">
                    {(exercise as any).items?.filter((item: string) => !pyramidOrder.includes(item)).map((item: string) => (
                        <button key={item} onClick={() => addToPyramid(item)} className="py-3 border rounded-lg hover:bg-muted text-sm">
                            {item}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button onClick={() => {setPyramidOrder([]); setFeedback(null);}} className="flex-1 border rounded-lg py-2 text-sm">Reset</button>
                </div>
                <div className={`mt-6`}>
                    <p className="font-semibold text-lg mb-4">{exercise.question}</p>
                    <button onClick={checkPyramid} disabled={pyramidOrder.length < 4} className="w-full px-4 py-3 bg-gradient-genetics-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50">Check Pyramid</button>
                    {feedback && (<div className={`mt-6 p-4 rounded-lg border-l-4 text-sm ${feedback.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>{feedback.text}</div>)}
                </div>
            </div>
        );
    }

    return null;
};

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

export const Ecology: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, setStep, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
    const [producers, setProducers] = useState(50);
    const [herbivores, setHerbivores] = useState(30);
    const [carnivores, setCarnivores] = useState(10);
    const [isSimulating, setIsSimulating] = useState(false);
    const [generations, setGenerations] = useState(0);
    const [ecosystemStable, setEcosystemStable] = useState(true);
    const [pyramidOrder, setPyramidOrder] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{correct: boolean, text: string}|null>(null);

    const intervalRef = useRef<number|null>(null);

    // Reset state on exercise change
    useEffect(() => {
        setProducers(50);
        setHerbivores(30);
        setCarnivores(10);
        setGenerations(0);
        setEcosystemStable(true);
        setIsSimulating(false);
        setPyramidOrder([]);
        setFeedback(null);
    }, [currentExercise]);

    useEffect(() => {
        if (isSimulating && generations < 10 && ecosystemStable) {
            intervalRef.current = window.setTimeout(() => {
                const newProducers = producers * (1.1 - herbivores * 0.005);
                const newHerbivores = herbivores * (1 + producers * 0.002 - carnivores * 0.02 - 0.05);
                const newCarnivores = carnivores * (1 + herbivores * 0.005 - 0.1);

                const clampedProducers = Math.max(0, Math.min(200, newProducers));
                const clampedHerbivores = Math.max(0, Math.min(150, newHerbivores));
                const clampedCarnivores = Math.max(0, Math.min(100, newCarnivores));

                setProducers(Math.round(clampedProducers));
                setHerbivores(Math.round(clampedHerbivores));
                setCarnivores(Math.round(clampedCarnivores));
                setGenerations(prev => prev + 1);

                if (clampedProducers < 10 || clampedHerbivores < 5 || clampedCarnivores < 2) {
                    setEcosystemStable(false);
                    setIsSimulating(false);
                    toast.error("Ecosystem collapsed!");
                }
            }, 500);
            return () => { if(intervalRef.current) clearTimeout(intervalRef.current) };
        } else if (generations >= 10 && isSimulating) {
            setIsSimulating(false);
            toast.success("Ecosystem is stable for 10 generations!");
        }
    }, [isSimulating, generations, producers, herbivores, carnivores, ecosystemStable]);

    if (!currentExercise) return null;

    const checkSimulationResult = () => {
        const correct = generations >= 10 && ecosystemStable;
        if (correct) {
            toast.success("Correct!");
            setFeedback({ correct: true, text: currentExercise.explanation || "Well done!" });
        } else {
            toast.error("This ecosystem was not stable.");
            setFeedback({ correct: false, text: "The populations did not remain stable for 10 generations. Try adjusting the initial numbers." });
        }
    };
    
    const checkPyramid = () => {
        const correct = JSON.stringify(pyramidOrder) === JSON.stringify((currentExercise as any).correctOrder);
        if (correct) {
            toast.success("Correct!");
            setFeedback({ correct: true, text: currentExercise.explanation || "That's the correct order!" });
        } else {
            toast.error("Incorrect order.");
            setFeedback({ correct: false, text: "The pyramid should be built from the largest population group at the bottom to the smallest at the top." });
        }
    };

    const addToPyramid = (item: string) => {
        if (!pyramidOrder.includes(item)) {
            setPyramidOrder([...pyramidOrder, item]);
        }
    };
    
    const resetSimulation = () => {
        setProducers(50);
        setHerbivores(30);
        setCarnivores(10);
        setGenerations(0);
        setEcosystemStable(true);
        setIsSimulating(false);
        setFeedback(null);
    };

    const VisualContent = (
        <EcosystemBalanceVisual 
            exercise={currentExercise}
            producers={producers}
            herbivores={herbivores}
            carnivores={carnivores}
            generations={generations}
            ecosystemStable={ecosystemStable}
            pyramidOrder={pyramidOrder}
        />
    );

    const InteractionContent = (
        <EcosystemInteraction 
            exercise={currentExercise}
            producers={producers}
            setProducers={setProducers}
            herbivores={herbivores}
            setHerbivores={setHerbivores}
            carnivores={carnivores}
            setCarnivores={setCarnivores}
            generations={generations}
            ecosystemStable={ecosystemStable}
            isSimulating={isSimulating}
            setIsSimulating={setIsSimulating}
            resetSimulation={resetSimulation}
            checkSimulationResult={checkSimulationResult}
            pyramidOrder={pyramidOrder}
            setPyramidOrder={setPyramidOrder}
            addToPyramid={addToPyramid}
            checkPyramid={checkPyramid}
            feedback={feedback}
            setFeedback={setFeedback}
        />
    );

    return (
        <BioLabLayout
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

export default Ecology;
