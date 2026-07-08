
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, DropletsIcon, LightbulbIcon } from '../../icons';
import { Stethoscope, ArrowDown, ArrowUp, Activity } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
}

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    
    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <button className="w-full flex justify-between text-lg font-bold text-card-foreground" onClick={() => setIsOpen(!isOpen)}>
                <span className="flex items-center gap-2"><BookOpenText className="w-5 h-5 text-blue-500" />{title}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="flex-1 overflow-y-auto pr-2 text-muted-foreground prose prose-sm dark:prose-invert">
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
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <LightbulbIcon className="w-3 h-3 text-yellow-500" /> Analogy
                            </h4>
                            <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                        </div>
                    )}
                    {application && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <Stethoscope className="w-3 h-3 text-blue-500" /> Application
                            </h4>
                            <p className="text-sm leading-relaxed">{application}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GFRSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [afferent, setAfferent] = useState(50); // 0-100 diameter
    const [efferent, setEfferent] = useState(50); // 0-100 diameter
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Physics logic: GFR is roughly (Afferent Pressure - Efferent Pressure)
    // Bigger afferent = more pressure in. Smaller efferent = backpressure (more filtration).
    const gfr = Math.min(100, Math.max(0, (afferent * 1.5) - (efferent * 0.5)));
    
    // Water drop speed based on GFR
    const dropSpeed = Math.max(0.2, 2 - (gfr / 50));

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Optimization!"); else toast.error("Incorrect.");
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            <p className="text-muted-foreground">{exercise.prompt}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
                {/* Visual */}
                <div className="relative h-64 w-full flex items-center justify-center">
                    {/* Afferent Arteriole (Left) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 bg-red-500 transition-all duration-300 rounded-l" 
                         style={{ width: '30%', height: `${10 + afferent * 0.4}px` }} />
                    <div className="absolute left-4 top-[30%] text-xs font-bold text-red-900">Afferent (In)</div>

                    {/* Glomerulus (Center) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-400 rounded-full opacity-80 border-4 border-red-600 shadow-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{Math.round(gfr)} <span className="text-xs">GFR</span></span>
                    </div>

                    {/* Efferent Arteriole (Right) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 transition-all duration-300 rounded-r" 
                         style={{ width: '30%', height: `${10 + efferent * 0.4}px` }} />
                    <div className="absolute right-4 top-[30%] text-xs font-bold text-red-900">Efferent (Out)</div>

                    {/* Urine Drops (Filtration) */}
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="w-12 h-16 border-x-2 border-b-2 border-yellow-400 rounded-b-lg bg-yellow-100/30 flex flex-col items-center overflow-hidden">
                            {/* Animated drops */}
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: `${dropSpeed}s` }} />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-semibold">
                            <span>Afferent Diameter</span>
                            <span>{afferent}%</span>
                        </div>
                        <input type="range" min="10" max="100" value={afferent} onChange={(e) => setAfferent(Number(e.target.value))} 
                               className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-semibold">
                            <span>Efferent Diameter</span>
                            <span>{efferent}%</span>
                        </div>
                        <input type="range" min="10" max="100" value={efferent} onChange={(e) => setEfferent(Number(e.target.value))} 
                               className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                        <span className="text-sm text-muted-foreground">Goal: Maximize GFR (&gt;80)</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} 
                        className={`p-3 text-left border rounded hover:bg-muted ${selectedAnswer === opt ? (opt === exercise.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LoopHenleSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [saltPumpLevel, setSaltPumpLevel] = useState(50);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Concentration increases as salt pump increases
    const concentration = 300 + (saltPumpLevel * 9); // Max around 1200 mOsm

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Mechanism!"); else toast.error("Incorrect.");
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            <p className="text-muted-foreground">{exercise.prompt}</p>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200">
                <div className="relative w-48 h-64 border-l-4 border-b-4 border-r-4 border-yellow-600 rounded-b-full flex justify-between p-2">
                    {/* Descending Limb */}
                    <div className="w-1/2 flex flex-col items-center gap-2">
                        <ArrowDown className="text-blue-500 animate-bounce" />
                        <span className="text-xs text-blue-600 font-bold">H₂O</span>
                    </div>
                    {/* Ascending Limb */}
                    <div className="w-1/2 flex flex-col items-center gap-2">
                        <ArrowUp className="text-red-500 animate-bounce" />
                        <span className="text-xs text-red-600 font-bold">Na+ Cl-</span>
                        {/* Salt particles */}
                        <div className="flex flex-wrap justify-center gap-1">
                            {Array.from({length: Math.floor(saltPumpLevel/20)}).map((_,i) => (
                                <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            ))}
                        </div>
                    </div>
                    {/* Medulla Background Gradient representing concentration */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-yellow-200/50 rounded-b-full" style={{opacity: saltPumpLevel/100}}></div>
                </div>

                <div className="w-full max-w-xs space-y-6">
                    <div className="text-center p-4 bg-card rounded-lg border shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase">Urine Concentration</div>
                        <div className="text-4xl font-mono font-bold text-yellow-600">{Math.round(concentration)} <span className="text-sm">mOsm</span></div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Active Transport (Salt Pumps)</label>
                        <input type="range" min="0" max="100" value={saltPumpLevel} onChange={(e) => setSaltPumpLevel(Number(e.target.value))} className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                    </div>
                </div>
            </div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} 
                        className={`p-3 text-left border rounded hover:bg-muted ${selectedAnswer === opt ? (opt === exercise.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ADHSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [adhLevel, setAdhLevel] = useState(0);
    const [urineColor, setUrineColor] = useState('#fef3c7'); // pale yellow
    const [volume, setVolume] = useState(100);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Update visuals based on ADH
    React.useEffect(() => {
        // High ADH = Low Volume, Dark Color
        const newVol = 100 - (adhLevel * 0.8);
        setVolume(newVol);
        // Interpolate color from pale yellow to dark amber
        // Light: #fef3c7, Dark: #b45309
        const opacity = 0.2 + (adhLevel / 100) * 0.8;
        setUrineColor(`rgba(217, 119, 6, ${opacity})`);
    }, [adhLevel]);

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct!"); else toast.error("Incorrect.");
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            <p className="text-muted-foreground">{exercise.prompt}</p>

            <div className="flex gap-8 justify-center items-end h-64 bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border">
                {/* Collecting Duct */}
                <div className="relative w-16 h-full border-x-4 border-slate-400 flex flex-col items-center">
                    <div className="absolute top-0 w-full h-full bg-blue-200/30 animate-pulse"></div>
                    {/* Aquaporins appearing */}
                    {Array.from({length: Math.floor(adhLevel/20)}).map((_,i) => (
                        <div key={i} className="absolute w-2 h-4 bg-blue-500 rounded-full right-[-6px]" style={{top: `${20 + i*15}%`}} title="Aquaporin"></div>
                    ))}
                    <div className="absolute bottom-2 text-xs font-bold text-slate-500">Tubule</div>
                </div>

                {/* Urine Beaker */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-32 border-2 border-slate-400 border-t-0 rounded-b-lg relative overflow-hidden bg-white">
                        <div className="absolute bottom-0 w-full transition-all duration-500" 
                             style={{ height: `${volume}%`, backgroundColor: urineColor }}></div>
                    </div>
                    <span className="text-sm font-bold mt-2">Urine Output</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">ADH Level</span>
                    <input type="range" min="0" max="100" value={adhLevel} onChange={(e) => setAdhLevel(Number(e.target.value))} className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div className="grid gap-2">
                    <p className="font-semibold">{exercise.question}</p>
                    {exercise.options?.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult} 
                            className={`p-3 text-left border rounded hover:bg-muted ${selectedAnswer === opt ? (opt === exercise.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : ''}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


export const FilterVisual = () => (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Sieve Effect</h4>
        <div className="flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-slate-300 stroke-dashed"></div>
            <div className="flex gap-4">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400"></div>
            </div>
            <div className="w-full h-1 bg-slate-300 stroke-dashed"></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Small molecules pass through; large ones are blocked.</p>
    </div>
);

export const RenalPhysiology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const theoryVisual = <FilterVisual />;

    let Content = null;
    if (currentExercise.componentId === 'gfr_slider_sim') Content = GFRSim;
    else if (currentExercise.componentId === 'loop_henle_sim') Content = LoopHenleSim;
    else Content = ADHSim;

    return (
        <>
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><Content exercise={currentExercise} onAnswered={() => {}} /></div>
                    <aside className="lg:col-span-1 sticky top-24 h-fit"><TheoryPane exercise={currentExercise} visual={theoryVisual} /></aside>
                </div>
            ) : (
                <div className="flex flex-col gap-6"><Content exercise={currentExercise} onAnswered={() => {}} />{infoVisible && <TheoryPane exercise={currentExercise} visual={theoryVisual} />}</div>
            )}
        </>
    );
};
