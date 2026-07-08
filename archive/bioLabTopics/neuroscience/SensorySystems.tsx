
import React, { useState, useEffect, useRef } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

// --- Visual Components ---

const FilterAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <rect x="20" y="20" width="40" height="40" rx="4" fill="currentColor" className="text-muted/30" />
            <rect x="80" y="20" width="40" height="40" rx="4" fill="currentColor" className="text-muted/30" />
            <rect x="140" y="20" width="40" height="40" rx="4" fill="currentColor" className="text-muted/30" />
            
            <circle cx="40" cy="40" r="10" fill="#fef08a" opacity="0.5" />
            <circle cx="100" cy="40" r="15" fill="#facc15" />
            <circle cx="160" cy="40" r="5" fill="#ca8a04" />
            
            <text x="100" y="75" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">CONTRAST FILTER</text>
        </svg>
    </div>
);

// Theory Pane (Standard)
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
                        
                        <FilterAnalogy />

                        
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

const ReceptiveFieldSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [lightPos, setLightPos] = useState({ x: 150, y: 150 });
    const [firingRate, setFiringRate] = useState(10); // Baseline
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setLightPos({ x, y });

        // Calculate distance from center (150, 150)
        const dx = x - 150;
        const dy = y - 150;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // Center (On) is radius 0-40. Surround (Off) is 40-100.
        if (dist < 40) {
            setFiringRate(80); // High firing
        } else if (dist < 100) {
            setFiringRate(2); // Inhibition
        } else {
            setFiringRate(10); // Baseline
        }
    };

    const handleCheck = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct Analysis!");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            
            <div className="flex gap-4">
                {/* Retina View */}
                <div className="relative w-[300px] h-[300px] bg-black rounded-full overflow-hidden cursor-none border-4 border-slate-700 mx-auto" onMouseMove={handleMouseMove}>
                    <svg ref={svgRef} width="300" height="300" className="absolute top-0 left-0">
                        {/* Surround Area (Inhibitory) */}
                        <circle cx="150" cy="150" r="100" fill="#334155" opacity="0.3" stroke="#94a3b8" strokeDasharray="4 2" />
                        <text x="150" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">OFF Surround</text>
                        
                        {/* Center Area (Excitatory) */}
                        <circle cx="150" cy="150" r="40" fill="#fbbf24" opacity="0.3" stroke="#f59e0b" />
                        <text x="150" y="155" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">ON Center</text>

                        {/* Flashlight Cursor */}
                        <circle cx={lightPos.x} cy={lightPos.y} r="15" fill="white" style={{filter: 'blur(5px)'}} />
                    </svg>
                </div>

                {/* Firing Rate Graph */}
                <div className="flex-1 bg-slate-900 rounded-lg p-4 border border-slate-800 flex flex-col justify-end relative h-[300px]">
                    <span className="absolute top-2 left-2 text-xs text-green-500 font-mono">NEURON OUTPUT</span>
                    <div className="w-full bg-green-900/30 rounded flex items-end h-full overflow-hidden relative">
                        {/* Audio visualizer style bars */}
                        <div className="w-full flex items-end gap-1">
                            {Array.from({length: 20}).map((_, i) => (
                                <div key={i} className="flex-1 bg-green-500 transition-all duration-75" 
                                     style={{ 
                                         height: `${Math.random() * firingRate + 5}%`,
                                         opacity: i/20 
                                     }} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-2 text-center text-green-400 font-mono text-xl">{firingRate > 50 ? 'HIGH' : firingRate < 5 ? 'INHIBITED' : 'BASELINE'}</div>
                </div>
            </div>

            <div className="grid gap-2">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedAnswer(opt)} 
                        disabled={showResult} 
                        className={`p-3 text-left border rounded hover:bg-muted ${
                            selectedAnswer === opt 
                                ? 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100' 
                                : ''
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedAnswer}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct Analysis!" : "Incorrect."}
                </div>
            )}
        </div>
    );
};

export const SensorySystems: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const ExerciseContent = <ReceptiveFieldSim exercise={currentExercise} onAnswered={() => {}} />;

    return (
        <>
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">{ExerciseContent}</div>
                    <aside className="lg:col-span-1 sticky top-24 h-fit"><TheoryPane exercise={currentExercise} /></aside>
                </div>
            ) : (
                <div className="flex flex-col gap-6">{ExerciseContent}{infoVisible && <TheoryPane exercise={currentExercise} />}</div>
            )}
        </>
    );
};
