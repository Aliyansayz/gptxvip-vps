import React, { useState, useEffect, useRef } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { ShieldCheck, TrendingUp, Users, Copy, MousePointerClick } from 'lucide-react';
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
                    <BookOpenText className="w-5 h-5 text-blue-500" />
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
                                    <ShieldCheck className="w-3 h-3 text-blue-500" /> Application
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

const ImmuneGraphVisual: React.FC<{
    dataPoints: {x: number, y: number}[];
}> = ({ dataPoints }) => {
    // Convert points to SVG path
    const getPath = () => {
        if (dataPoints.length < 2) return "";
        // Map x from [minX, maxX] to [0, 400]
        // Map y from [0, 100] to [200, 0]
        const minX = dataPoints[0].x;
        const maxX = dataPoints[dataPoints.length - 1].x;
        const rangeX = maxX - minX || 1;

        return dataPoints.map((p, i) => {
            const sx = ((p.x - minX) / rangeX) * 400;
            const sy = 200 - (p.y * 2); // Scale y to fit height 200
            return `${i===0 ? 'M' : 'L'} ${sx} ${sy}`;
        }).join(" ");
    };

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                
                {/* Graph Line */}
                <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d={getPath()} fill="none" stroke="#60a5fa" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    <path d={`${getPath()} L 400 200 L 0 200 Z`} fill="url(#gradient)" opacity="0.3" />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Labels */}
                <div className="absolute top-2 right-2 text-xs font-mono text-blue-400">Antibody Titer (IgG)</div>
                <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-500">Time (Days)</div>
            </div>
        </div>
    );
};

const ImmuneGraphInteraction: React.FC<{
    exercise: Exercise;
    exposureCount: number;
    injectAntigen: () => void;
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, exposureCount, injectAntigen, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => {
    return (
        <div className="space-y-6 w-full">
            <div className="flex justify-center gap-4">
                <button 
                    onClick={injectAntigen}
                    disabled={exposureCount >= 2}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    {exposureCount === 0 ? "Inject Antigen (1st)" : exposureCount === 1 ? "Inject Antigen (2nd)" : "Experiment Complete"}
                </button>
            </div>

            {exposureCount < 2 ? (
                <p className="text-muted-foreground text-center italic">Complete the experiment to unlock the question.</p>
            ) : (
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

                    {showResult && isCorrect && (
                        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 flex items-start gap-3 animate-fade-in">
                            <TrendingUp className="w-6 h-6 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Memory Cells at Work!</p>
                                <p className="text-sm">{exercise.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ClonalSelectionVisual: React.FC<{
    stage: 'selection' | 'proliferation';
    handleCellClick: (id: string) => void;
    correctCellId: string;
}> = ({ stage, handleCellClick, correctCellId }) => {
    const renderCell = (id: string, type: 'square' | 'triangle' | 'circle', x: number, y: number, isClone: boolean = false) => {
        const color = id === correctCellId ? 'fill-purple-500 stroke-purple-700' : 'fill-blue-400 stroke-blue-600';
        return (
            <g 
                key={id} 
                transform={`translate(${x}, ${y})`} 
                onClick={() => !isClone && handleCellClick(id)} 
                className={isClone ? '' : 'cursor-pointer hover:opacity-80 transition-opacity'}
            >
                <circle cx="0" cy="0" r="20" className={color} strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">B</text>
                
                {/* Receptors */}
                {[0, 90, 180, 270].map(angle => (
                    <g key={angle} transform={`rotate(${angle}) translate(0, -20)`}>
                        <line x1="0" y1="0" x2="0" y2="-8" stroke="currentColor" strokeWidth="2" className={id === correctCellId ? 'text-purple-700' : 'text-blue-600'} />
                        {type === 'triangle' && <path d="M -5 -8 L 5 -8 L 0 -15 Z" fill="none" stroke="currentColor" strokeWidth="2" className={id === correctCellId ? 'text-purple-700' : 'text-blue-600'} />}
                        {type === 'square' && <rect x="-4" y="-12" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" className={id === correctCellId ? 'text-purple-700' : 'text-blue-600'} />}
                        {type === 'circle' && <circle cx="0" cy="-12" r="4" fill="none" stroke="currentColor" strokeWidth="2" className={id === correctCellId ? 'text-purple-700' : 'text-blue-600'} />}
                    </g>
                ))}
            </g>
        );
    };

    return (
        <div className="relative h-64 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center w-full max-w-2xl mx-auto">
            
            {/* Floating Pathogen */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-green-500 mb-1"></div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Pathogen</span>
                </div>
            </div>

            {stage === 'selection' && (
                <svg className="w-full h-full" viewBox="-150 -50 300 100">
                    {renderCell('b1', 'square', -100, 0)}
                    {renderCell('b2', 'triangle', 0, 0)}
                    {renderCell('b3', 'circle', 100, 0)}
                </svg>
            )}

            {stage === 'proliferation' && (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Clones Animation */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="-150 -100 300 200">
                        <g className="animate-ping opacity-20">
                            {renderCell('clone-ghost', 'triangle', 0, 0, true)}
                        </g>
                        <g className="animate-fade-in-down">
                            {renderCell('clone-1', 'triangle', -80, 0, true)}
                            {renderCell('clone-2', 'triangle', 0, 0, true)}
                            {renderCell('clone-3', 'triangle', 80, 0, true)}
                        </g>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <Copy className="w-12 h-12 text-purple-500 opacity-20 animate-pulse" />
                    </div>
                </div>
            )}

            {stage === 'selection' && (
                <div className="absolute bottom-4 flex items-center gap-2 text-sm text-muted-foreground bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full border shadow-sm">
                    <MousePointerClick className="w-4 h-4" /> Click the matching B-Cell
                </div>
            )}
        </div>
    );
};

const ClonalSelectionInteraction: React.FC<{
    exercise: Exercise;
    stage: 'selection' | 'proliferation';
    selectedAnswer: string | null;
    isCorrect: boolean;
    showResult: boolean;
    handleSelectAnswer: (option: string) => void;
}> = ({ exercise, stage, selectedAnswer, isCorrect, showResult, handleSelectAnswer }) => {
    if (stage !== 'proliferation') return <p className="text-muted-foreground text-center italic">Select the correct B-Cell to proceed.</p>;

    return (
        <div className="animate-fade-in space-y-4 w-full">
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

            {showResult && isCorrect && (
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 flex items-start gap-3 animate-fade-in">
                    <Users className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Clonal Expansion Successful!</p>
                        <p className="text-sm">{exercise.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClonalExpansionTheoryVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Clonal Expansion</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold">B</div>
            <div className="text-xl">→</div>
            <div className="grid grid-cols-2 gap-1 scale-75">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white text-[8px] font-bold">B</div>
                ))}
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">One "correct" cell creates an army of identical clones.</p>
    </div>
);

const MemoryTiterTheoryVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Titer Comparison</h4>
        <div className="relative h-20 w-full flex items-end justify-around gap-2 px-4">
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 bg-blue-400 rounded-t-sm" style={{ height: '30%' }}></div>
                <span className="text-[8px] text-muted-foreground">1st</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-8 bg-blue-600 rounded-t-sm animate-pulse" style={{ height: '90%' }}></div>
                <span className="text-[8px] font-bold text-blue-600">2nd</span>
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Second exposure peak is exponentially higher.</p>
    </div>
);

export const ImmunologyMemory: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement, settings }) => {
    const currentExercise = exercises[step];
    
    // State for Immune Graph
    const [dataPoints, setDataPoints] = useState<{x: number, y: number}[]>([{x:0, y:5}]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [exposureCount, setExposureCount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const animationRef = useRef<number | undefined>(undefined);

    // State for Clonal Selection
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [stage, setStage] = useState<'selection' | 'proliferation'>('selection');
    const [clonalSelectedAnswer, setClonalSelectedAnswer] = useState<string | null>(null);
    const [clonalShowResult, setClonalShowResult] = useState(false);
    const [clonalIsCorrect, setClonalIsCorrect] = useState(false);

    useEffect(() => {
        // Reset state on exercise change
        setDataPoints([{x:0, y:5}]);
        setCurrentTime(0);
        setIsAnimating(false);
        setExposureCount(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);

        setSelectedCell(null);
        setStage('selection');
        setClonalSelectedAnswer(null);
        setClonalShowResult(false);
        setClonalIsCorrect(false);
    }, [currentExercise]);

    // Animation Logic for Immune Graph
    const updateGraph = () => {
        setCurrentTime(t => t + 1);
        setDataPoints(prev => {
            const last = prev[prev.length - 1];
            let targetY = 5; // Baseline

            // Logic for Primary Response (Exposure 1)
            if (exposureCount === 1) {
                const timeSinceExposure = currentTime - 20; // Assuming exposure at t=20
                if (timeSinceExposure > 0 && timeSinceExposure < 40) {
                    // Slow rise to moderate peak
                    targetY = 5 + 30 * Math.sin((timeSinceExposure / 40) * Math.PI); 
                }
            } 
            // Logic for Secondary Response (Exposure 2)
            else if (exposureCount === 2) {
                const timeSinceExposure = currentTime - 80; // Exposure at t=80
                if (timeSinceExposure > 0 && timeSinceExposure < 40) {
                    // Fast rise to high peak
                    targetY = 5 + 85 * Math.sin((timeSinceExposure / 40) * Math.PI); 
                }
            }

            // Smooth interpolation
            const newY = last.y + (targetY - last.y) * 0.1;
            
            // Keep mostly within bounds but allow scrolling
            const newPoints = [...prev, { x: currentTime, y: newY }];
            if (newPoints.length > 200) newPoints.shift(); // Keep window size
            return newPoints;
        });

        animationRef.current = requestAnimationFrame(updateGraph);
    };

    useEffect(() => {
        if (isAnimating) {
            animationRef.current = requestAnimationFrame(updateGraph);
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isAnimating, exposureCount, currentTime]);

    const injectAntigen = () => {
        if (!isAnimating) setIsAnimating(true);
        
        if (exposureCount === 0) {
            setCurrentTime(20); // Reset visual clock for demo
            setExposureCount(1);
            toast.info("First Injection: Primary Response Initiated");
        } else if (exposureCount === 1) {
            setCurrentTime(80); // Jump forward
            setExposureCount(2);
            toast.success("Booster Shot: Secondary Response Initiated!");
        }
    };

    const handleSelectAnswer = (option: string) => {
        if (showResult) return;
        setSelectedAnswer(option);
        const correct = option === currentExercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if(correct) toast.success("Correct Observation!");
        else toast.error("Incorrect.");
    };

    // Logic for Clonal Selection
    const correctCellId = 'b2'; // The one with triangle receptors

    const handleCellClick = (id: string) => {
        if (stage !== 'selection') return;
        
        if (id === correctCellId) {
            setSelectedCell(id);
            setStage('proliferation');
            toast.success("Match Found! Clonal Expansion initiating...");
        } else {
            toast.error("Receptor mismatch. This B cell ignores the pathogen.");
        }
    };

    const handleClonalSelectAnswer = (option: string) => {
        if (clonalShowResult) return;
        setClonalSelectedAnswer(option);
        const correct = option === currentExercise.answer;
        setClonalIsCorrect(correct);
        setClonalShowResult(true);
        if(correct) toast.success("Correct!");
        else toast.error("Incorrect.");
    };

    if (!currentExercise) return null;

    const theoryVisual = currentExercise.componentId === 'clonal_selection_sim' ? <ClonalExpansionTheoryVisual /> : <MemoryTiterTheoryVisual />;

    let VisualContent;
    let InteractionContent;

    if (currentExercise.componentId === 'clonal_selection_sim') {
        VisualContent = (
            <ClonalSelectionVisual 
                stage={stage} 
                handleCellClick={handleCellClick} 
                correctCellId={correctCellId} 
            />
        );
        InteractionContent = (
            <ClonalSelectionInteraction 
                exercise={currentExercise} 
                stage={stage} 
                selectedAnswer={clonalSelectedAnswer} 
                isCorrect={clonalIsCorrect} 
                showResult={clonalShowResult} 
                handleSelectAnswer={handleClonalSelectAnswer} 
            />
        );
    } else {
        VisualContent = (
            <ImmuneGraphVisual 
                dataPoints={dataPoints} 
            />
        );
        InteractionContent = (
            <ImmuneGraphInteraction 
                exercise={currentExercise} 
                exposureCount={exposureCount} 
                injectAntigen={injectAntigen}
                selectedAnswer={selectedAnswer} 
                isCorrect={isCorrect} 
                showResult={showResult} 
                handleSelectAnswer={handleSelectAnswer} 
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

export default ImmunologyMemory;
