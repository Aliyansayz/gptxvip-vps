
import React, { useState, useEffect, useRef } from 'react';
import { LabData, Exercise } from '../../../types';
import { toast } from 'sonner';
import { ActivityIcon, BookOpenText, ChevronDownIcon, HeartIcon, CheckCircleIcon, XCircleIcon, LightbulbIcon } from '../../icons';
import { Stethoscope, ChevronUp, ChevronDown } from 'lucide-react';
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

// ECG waveform patterns
const ecgPatterns = {
    normal: (x: number) => {
        const cycle = x % 100;
        if (cycle < 10) return 50;
        if (cycle < 15) return 50 + Math.sin((cycle - 10) * 0.6) * 5; // P wave
        if (cycle < 20) return 50;
        if (cycle < 22) return 50 - (cycle - 20) * 5; // Q wave
        if (cycle < 25) return 40 + (cycle - 22) * 20; // R wave
        if (cycle < 28) return 100 - (cycle - 25) * 25; // S wave
        if (cycle < 40) return 25 + (cycle - 28) * 2; // returning to baseline
        if (cycle < 55) return 50 + Math.sin((cycle - 40) * 0.2) * 8; // T wave
        return 50;
    },
    afib: (x: number) => {
        const cycle = x % 80;
        const irregularity = Math.sin(x * 0.7) * 3 + Math.sin(x * 1.3) * 2;
        if (cycle < 3) return 50 + irregularity;
        if (cycle < 5) return 45 + irregularity;
        if (cycle < 8) return 45 + (cycle - 5) * 25;
        if (cycle < 11) return 120 - (cycle - 8) * 30;
        if (cycle < 25) return 30 + (cycle - 11) * 1.4 + irregularity;
        return 50 + irregularity * 1.5;
    },
    vtach: (x: number) => {
        const cycle = x % 40;
        return 50 + Math.sin(cycle * 0.3) * 40;
    },
};

const HeartConductionVisual: React.FC<{ rate: number, patternName: string }> = ({ rate, patternName }) => {
    // Determine animation duration based on rate (roughly)
    // 60bpm = 1s, 120bpm = 0.5s
    const duration = 60 / rate; 
    
    // Pattern specific visual adjustments
    const isAfib = patternName === 'afib';
    const isVtach = patternName === 'vtach';

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[160px]">
            <span className="absolute top-2 left-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Conduction System</span>
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {/* Heart Outline */}
                <path d="M50 85 C 20 70, 10 40, 30 25 C 40 18, 50 30, 50 30 C 50 30, 60 18, 70 25 C 90 40, 80 70, 50 85" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeOpacity="0.5" />
                
                {/* Chambers fill for contraction effect */}
                <path d="M30 25 C 40 18, 50 30, 50 30 C 50 30, 60 18, 70 25" fill={isAfib ? '#fbbf24' : '#f472b6'} fillOpacity="0.2" className={isAfib ? 'animate-pulse' : ''} style={{animationDuration: isAfib ? '0.1s' : `${duration}s`}} />
                <path d="M20 40 C 20 60, 50 85, 50 85 C 50 85, 80 60, 80 40" fill={isVtach ? '#ef4444' : '#f472b6'} fillOpacity="0.2" className={isVtach ? 'animate-pulse' : ''} style={{animationDuration: isVtach ? '0.3s' : `${duration}s`}} />

                {/* SA Node */}
                <circle cx="35" cy="30" r="3" fill="#fbbf24" className={isAfib ? 'animate-ping' : ''} style={{animationDuration: isAfib ? '0.2s' : `${duration}s`}} />
                <text x="25" y="25" fontSize="6" fill="#fbbf24" fontWeight="bold">SA</text>

                {/* AV Node */}
                <circle cx="50" cy="45" r="2.5" fill="#fbbf24" />
                <text x="55" y="45" fontSize="6" fill="#fbbf24" fontWeight="bold">AV</text>

                {/* Wiring */}
                {!isVtach && (
                    <>
                        {/* Internodal pathways */}
                        <path d="M35 30 Q 40 35, 50 45" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 1" className={isAfib ? '' : 'animate-dash'} style={{animationDuration: `${duration}s`}} />
                        {/* Bundle of His & Purkinje */}
                        <path d="M50 45 L 50 55 L 35 70 M 50 55 L 65 70" stroke="#fbbf24" strokeWidth="1" className={isAfib ? '' : 'animate-dash'} style={{animationDuration: `${duration}s`, animationDelay: `${duration*0.2}s`}} />
                    </>
                )}
                
                {isVtach && (
                    <circle cx="45" cy="65" r="4" fill="#ef4444" className="animate-ping" style={{animationDuration: '0.3s'}} />
                )}
            </svg>
            <div className="flex gap-2 text-[10px] text-muted-foreground mt-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Electrical</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-400/50"></div> Mechanical</div>
            </div>
        </div>
    );
};

const ECGMonitor: React.FC<{ patternName: string; rate: number }> = ({ patternName, rate }) => {
    const [animationProgress, setAnimationProgress] = useState(0);
    const patternFn = ecgPatterns[patternName as keyof typeof ecgPatterns] || ecgPatterns.normal;

    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            setAnimationProgress(prev => (prev + 2) % 400);
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const generateECGPath = () => {
        const points: string[] = [];
        for (let i = 0; i < 400; i++) {
            const x = i;
            const rawY = patternFn(i + animationProgress);
            const y = 120 - rawY; 
            points.push(`${x},${y}`);
        }
        return `M ${points.join(' L ')}`;
    };

    return (
        <div className="bg-black rounded-xl p-4 overflow-hidden border-4 border-slate-800 shadow-2xl relative flex-1 min-h-[200px]">
            {/* Monitor Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="text-green-500 font-mono text-xs uppercase tracking-widest animate-pulse">Live Feed</span>
                    <span className="text-green-400 text-xs font-mono">Lead II</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                    <HeartIcon className="w-3 h-3 text-red-500 animate-pulse" />
                    <span className="text-green-400 font-mono text-sm font-bold">{rate} <span className="text-xs font-normal opacity-70">BPM</span></span>
                </div>
            </div>

            {/* ECG Grid & Waveform */}
            <div className="relative h-32 w-full bg-[linear-gradient(to_right,#1a3a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a3a1a_1px,transparent_1px)] bg-[size:20px_20px]">
                <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                    <path
                        d={generateECGPath()}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }}
                    />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
            </div>
            
            <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono">
                <span>25mm/s</span>
                <span>10mm/mV</span>
                <span>Filter: ON</span>
            </div>
        </div>
    );
};

import { CardiologyAnalogyVisual } from './CardiologyVisuals';

const TheoryPane: React.FC<{ exercise: Exercise & { theory?: { title: string; content: string } } }> = ({ exercise }) => {
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
                    <BookOpenText className="w-5 h-5 text-cyan-500" />
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

import { MedLabLayout } from '../../medLabTopicsView/MedLabLayout';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

// ... (previous imports)

export const ECGSimulator: React.FC<ChapterProps> = ({ labData, onComplete, onBack, step, exercises, infoVisible, infoPlacement, settings }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const currentExercise = exercises[step];

    useEffect(() => {
        setSelectedAnswer(null);
        setIsCorrect(false);
        setShowResult(false);
    }, [step]);

    if (!currentExercise) return null;

    const exerciseData = currentExercise as any;
    const pattern = exerciseData.pattern || 'normal';
    const rate = exerciseData.rate || 72;

    const handleSelectAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        
        const correct = selectedAnswer === currentExercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        
        if (correct) {
            toast.success("Correct Diagnosis!");
        } else {
            toast.error("Incorrect Diagnosis");
        }
    };

    const VisualContent = (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <ECGMonitor patternName={pattern} rate={rate} />
            <div className="w-full md:w-48 flex-shrink-0">
                <HeartConductionVisual rate={rate} patternName={pattern} />
            </div>
        </div>
    );

    const InteractionContent = (
        <div className="space-y-4">
            <p className="font-semibold text-lg mb-4">{currentExercise.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExercise.options?.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            selectedAnswer === option
                                ? 'bg-cyan-600 text-white border-cyan-700 shadow-md scale-[1.02]' 
                                : 'bg-card hover:bg-muted hover:border-cyan-500/50'
                        } ${showResult ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <span className="text-base font-medium">{option}</span>
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheckAnswer} 
                    disabled={!selectedAnswer} 
                    className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    Check Diagnosis
                </button>
            )}
            
            {showResult && (
                <div className={`mt-6 p-6 rounded-xl border flex items-start gap-4 animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                    <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isCorrect ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
                    </div>
                    <div>
                        <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Correct Diagnosis!' : 'Incorrect'}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">{currentExercise.explanation}</p>
                        
                        {isCorrect && step === exercises.length - 1 && (
                                <button 
                                onClick={onComplete}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                Complete Module
                            </button>
                        )}
                    </div>
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
