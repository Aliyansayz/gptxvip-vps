
import React, { useState, useEffect } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { ZapIcon, CheckCircleIcon, XCircleIcon, BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope, ChevronUp, ChevronDown } from 'lucide-react';
import { LabSettings } from '../../LabSettingsMenu';
import { BioLabLayout } from '../../bioLabTopicsView/BioLabLayout';
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



interface ExerciseState {
    stimulus: number;
    actionPotentialTriggered: boolean;
    showResult: boolean;
    isCorrect: boolean;
    selectedAnswer: string | null;
}

const NeuronVisual: React.FC<{ 
    stimulus: number; 
    isFiring: boolean; 
    signalPosition: number; 
    threshold: number;
    setStimulus: (val: number) => void;
    handleSimulationCheck: () => void;
    showResult: boolean;
}> = ({ stimulus, isFiring, signalPosition, threshold, setStimulus, handleSimulationCheck, showResult }) => {
    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            {/* Neuron Visualization */}
            <div className="relative h-48 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden border border-border">
                {/* Cell Body (Soma) */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full border-4 border-yellow-500 flex items-center justify-center z-10 shadow-lg">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full opacity-70" />
                    <span className="absolute text-xs font-bold mt-16 text-yellow-900">Soma</span>
                </div>

                {/* Dendrites */}
                {[-40, -20, 0, 20, 40].map((angle, i) => (
                    <div
                        key={i}
                        className="absolute left-10 top-1/2 w-16 h-1.5 bg-yellow-400 origin-right rounded-full"
                        style={{ transform: `translateY(-50%) rotate(${angle + 180}deg)` }}
                    />
                ))}

                {/* Axon */}
                <div className="absolute left-32 top-1/2 -translate-y-1/2 w-[calc(100%-160px)] h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full">
                    {/* Myelin Sheaths */}
                    {[0, 25, 50, 75].map((pos) => (
                        <div
                            key={pos}
                            className="absolute top-1/2 -translate-y-1/2 w-16 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg border-2 border-blue-200 dark:border-blue-800"
                            style={{ left: `${pos}%` }}
                        />
                    ))}

                    {/* Action Potential Signal */}
                    {isFiring && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)] z-20 flex items-center justify-center transition-all duration-75"
                            style={{ left: `${signalPosition}%` }}
                        >
                            <ZapIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    )}
                </div>

                {/* Axon Terminal */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 bg-orange-400 rounded-full border-2 border-orange-500 transition-all duration-300 ${isFiring && signalPosition > 90 ? 'scale-125 bg-orange-300 shadow-lg' : ''
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                    <span className="absolute text-xs font-bold -bottom-6 left-0 w-full text-center">Terminal</span>
                </div>
            </div>

            {/* Membrane Potential Gauge */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Membrane Potential</span>
                    <span className={stimulus >= threshold ? 'text-green-500 font-bold' : 'text-muted-foreground'}>
                        {stimulus >= threshold ? 'THRESHOLD REACHED!' : `${Math.round(-70 + stimulus * 0.5)}mV`}
                    </span>
                </div>
                <div className="relative h-8 bg-muted rounded-full overflow-hidden border border-input">
                    <div
                        className={`h-full transition-all duration-200 ${stimulus >= threshold
                                ? 'bg-gradient-to-r from-green-400 to-green-600'
                                : 'bg-gradient-to-r from-blue-400 to-blue-600'
                            }`}
                        style={{ width: `${stimulus}%` }}
                    />
                    {/* Threshold Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{ left: `${threshold}%` }}
                    >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-red-500"></div>
                        <span className="absolute top-1 left-2 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                            Threshold
                        </span>
                    </div>
                </div>
            </div>

            {/* Stimulus Slider */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-xl border">
                <div className="flex justify-between text-sm">
                    <span className="font-semibold">Stimulus Strength</span>
                    <span className="font-mono">{stimulus}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={stimulus}
                    onChange={(e) => setStimulus(Number(e.target.value))}
                    disabled={showResult}
                    className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                {!showResult && (
                    <button
                        onClick={handleSimulationCheck}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors shadow-md"
                    >
                        Check Result
                    </button>
                )}
            </div>
        </div>
    );
};

const NeuronInteraction: React.FC<{
    exercise: Exercise;
    selectedAnswer: string | null;
    showResult: boolean;
    isCorrect: boolean;
    handleSelectOption: (option: string) => void;
    handleCheckAnswer: () => void;
}> = ({ exercise, selectedAnswer, showResult, isCorrect, handleSelectOption, handleCheckAnswer }) => {
    return (
        <div className="animate-fade-in space-y-4">
            <p className="font-semibold text-lg">{exercise.question}</p>
            <div className="grid gap-3">
                {exercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectOption(option)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === option
                                ? 'bg-violet-600 text-white border-violet-700'
                                : 'bg-card hover:bg-muted'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheckAnswer} 
                    disabled={!selectedAnswer}
                    className="mt-6 w-full px-4 py-3 bg-gradient-bio-accent text-primary-foreground font-semibold rounded-lg disabled:opacity-50"
                >
                    Check Answer
                </button>
            )}

            {showResult && (
                <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                    {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />}
                    <div>
                        <h4 className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Excellent!' : 'Not quite.'}
                        </h4>
                        <p className="text-sm mt-1 text-muted-foreground">{exercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Visual Components ---

const BatteryAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <rect x="50" y="20" width="100" height="40" rx="4" fill="currentColor" className="text-muted/20" stroke="currentColor" strokeWidth="2" />
            <rect x="150" y="30" width="10" height="20" fill="currentColor" className="text-muted-foreground" />
            
            <text x="70" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ef4444">-</text>
            <text x="130" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#22c55e">+</text>
            
            <text x="100" y="75" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">STORED POTENTIAL</text>
             
             {/* Lightning bolt */}
             <path d="M 95 25 L 105 25 L 100 35 L 110 35 L 100 50 L 105 40 L 95 40 Z" fill="#eab308" />
        </svg>
    </div>
);

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
                    <BookOpenText className="w-5 h-5 text-yellow-500" />
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
                        
                        <BatteryAnalogy />

                        
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

export const NeuronSignaling: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({});
    const [isFiring, setIsFiring] = useState(false);
    const [signalPosition, setSignalPosition] = useState(0);

    const currentExercise = exercises[step];
    const THRESHOLD = 55;

    useEffect(() => {
        // Reset firing state when exercise changes
        setIsFiring(false);
        setSignalPosition(0);
    }, [currentExercise]);

    if (!currentExercise) return null;

    const currentState = exerciseStates[currentExercise.componentId] || {
        stimulus: 30,
        actionPotentialTriggered: false,
        showResult: false,
        isCorrect: false,
        selectedAnswer: null
    };

    const handleUpdateState = (updates: Partial<ExerciseState>) => {
        setExerciseStates(prev => ({
            ...prev,
            [currentExercise.componentId]: {
                ...(prev[currentExercise.componentId] || {
                    stimulus: 30,
                    actionPotentialTriggered: false,
                    showResult: false,
                    isCorrect: false,
                    selectedAnswer: null
                }),
                ...updates
            }
        }));
    };

    // Simulation Effect
    useEffect(() => {
        if (currentState.stimulus >= THRESHOLD && !currentState.actionPotentialTriggered && currentExercise.type === 'simulation') {
            handleUpdateState({ actionPotentialTriggered: true });
            setIsFiring(true);
            setSignalPosition(0);

            const interval = setInterval(() => {
                setSignalPosition(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsFiring(false);
                        }, 500);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 30);

            return () => clearInterval(interval);
        }
    }, [currentState.stimulus, currentState.actionPotentialTriggered, currentExercise.type]);

    const handleSimulationCheck = () => {
        const correct = currentState.stimulus >= THRESHOLD;
        handleUpdateState({
            isCorrect: correct,
            showResult: true
        });
        if (correct) toast.success("Action Potential Triggered!");
        else toast.error("Stimulus too weak. Try increasing it.");
    };

    const handleSelectOption = (option: string) => {
        if (currentState.showResult) return;
        handleUpdateState({ selectedAnswer: option });
    };

    const handleCheckAnswer = () => {
        if (!currentState.selectedAnswer) return;
        const correct = currentState.selectedAnswer === currentExercise.answer;
        handleUpdateState({
            isCorrect: correct,
            showResult: true
        });
        if (correct) toast.success("Correct!");
        else toast.error("Incorrect");
    };

    let VisualContent;
    let InteractionContent;

    if (currentExercise.type === 'simulation') {
        VisualContent = (
            <NeuronVisual 
                stimulus={currentState.stimulus}
                isFiring={isFiring}
                signalPosition={signalPosition}
                threshold={THRESHOLD}
                setStimulus={(val) => {
                    const updates: Partial<ExerciseState> = { stimulus: val };
                    if (val < THRESHOLD) {
                        updates.actionPotentialTriggered = false;
                        setIsFiring(false);
                        setSignalPosition(0);
                    }
                    handleUpdateState(updates);
                }}
                handleSimulationCheck={handleSimulationCheck}
                showResult={currentState.showResult}
            />
        );
        InteractionContent = null;
    } else {
        VisualContent = null;
        InteractionContent = (
            <NeuronInteraction 
                exercise={currentExercise}
                selectedAnswer={currentState.selectedAnswer}
                showResult={currentState.showResult}
                isCorrect={currentState.isCorrect}
                handleSelectOption={handleSelectOption}
                handleCheckAnswer={handleCheckAnswer}
            />
        );
    }

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
