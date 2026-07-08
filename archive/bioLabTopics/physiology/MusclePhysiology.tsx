
import React, { useState } from 'react';
import { TheoryVisual } from '../../TheoryVisual';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, ZapIcon, LightbulbIcon } from '../../icons';
import { Stethoscope, Dumbbell, Activity } from 'lucide-react';
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
                <span className="flex items-center gap-2"><BookOpenText className="w-5 h-5 text-red-500" />{title}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <SaveTheoryButton theory={exercise?.theory || exercise} />
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="flex-1 overflow-y-auto pr-2 text-muted-foreground prose prose-sm dark:prose-invert">
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

export const SlidingFilamentVisual = () => (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900">
        <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center mb-4">Sliding Mechanism</h4>
        <div className="flex flex-col items-center gap-1">
            <div className="flex gap-2 items-center">
                <div className="w-12 h-1 bg-blue-400"></div>
                <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                <div className="w-12 h-1 bg-blue-400"></div>
            </div>
            <div className="h-2 w-16 bg-red-600 rounded"></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Filaments don\'t shorten; they slide past each other.</p>
    </div>
);

export const MotorUnitVisual = () => (
    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">Team Recruitment</h4>
        <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-4 rounded border border-orange-300 ${i === 1 ? 'bg-orange-500' : 'bg-slate-200 opacity-30'}`}></div>
            ))}
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">More power requires calling more "teammates" into action.</p>
    </div>
);

const SarcomereSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [calcium, setCalcium] = useState(false);
    const [contracted, setContracted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    const toggleCalcium = () => {
        setCalcium(!calcium);
        if (calcium) setContracted(false); // Remove Ca = Relax
    };

    const toggleContraction = () => {
        if (!calcium) {
            toast.error("Calcium required to expose binding sites!");
            return;
        }
        setContracted(!contracted);
    };

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

            {/* Visual */}
            <div className="relative h-64 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8">
                {/* Z-Lines */}
                <div className={`absolute top-4 bottom-4 w-2 bg-slate-800 transition-all duration-1000 ${contracted ? 'left-[20%]' : 'left-4'}`} />
                <div className={`absolute top-4 bottom-4 w-2 bg-slate-800 transition-all duration-1000 ${contracted ? 'right-[20%]' : 'right-4'}`} />

                {/* Thin Filaments (Actin) */}
                <div className={`absolute top-[40%] h-2 bg-blue-400 rounded transition-all duration-1000 ${contracted ? 'left-[20%] w-[35%]' : 'left-4 w-[40%]'}`} />
                <div className={`absolute top-[40%] h-2 bg-blue-400 rounded transition-all duration-1000 ${contracted ? 'right-[20%] w-[35%]' : 'right-4 w-[40%]'}`} />
                
                {/* Thick Filament (Myosin) */}
                <div className="absolute top-1/2 -translate-y-1/2 h-6 w-[40%] bg-red-500 rounded flex justify-between px-2">
                    {/* Heads */}
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className={`w-2 h-4 bg-red-600 rounded-full transition-transform duration-500 ${contracted ? '-rotate-45 -translate-y-2' : '-translate-y-1'}`} />
                    ))}
                </div>

                {/* Calcium Particles */}
                {calcium && (
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({length: 20}).map((_, i) => (
                            <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" 
                                 style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: `${1+Math.random()}s` }} />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={toggleCalcium} className={`px-6 py-3 rounded-lg font-bold border transition-colors ${calcium ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'hover:bg-muted'}`}>
                    {calcium ? "Remove Calcium" : "Add Calcium"}
                </button>
                <button onClick={toggleContraction} className={`px-6 py-3 rounded-lg font-bold border transition-colors ${contracted ? 'bg-red-100 border-red-400 text-red-700' : 'hover:bg-muted'}`}>
                    {contracted ? "Relax (ATP)" : "Contract (Power Stroke)"}
                </button>
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

const MotorUnitSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [weight, setWeight] = useState(10);
    const [recruitment, setRecruitment] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Auto-recruit based on weight
    React.useEffect(() => {
        setRecruitment(Math.ceil(weight / 10));
    }, [weight]);

    const handleAnswer = (opt: string) => {
        if (showResult) return;
        setSelectedAnswer(opt);
        const correct = opt === exercise.answer;
        setShowResult(true);
        onAnswered(correct);
        if(correct) toast.success("Correct Principle!"); else toast.error("Incorrect.");
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl mb-4">{exercise.title}</h3>
            <p className="text-muted-foreground">{exercise.prompt}</p>

            <div className="flex gap-8 items-center bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border">
                <div className="w-1/3 flex flex-col items-center gap-4">
                    <Dumbbell className="w-16 h-16 text-slate-700 dark:text-slate-400" />
                    <input type="range" min="10" max="100" step="10" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
                    <span className="font-bold">{weight} kg</span>
                </div>

                <div className="w-2/3 grid grid-cols-5 gap-2">
                    {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className={`h-16 rounded border flex items-center justify-center transition-all duration-300 ${i < recruitment ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            {i < recruitment && <Activity className="w-4 h-4 text-white animate-pulse" />}
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center text-sm font-semibold text-muted-foreground">Active Motor Units: {recruitment}/10</div>

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

const LengthTensionSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [length, setLength] = useState(50); // 0-100 (short to long)
    const [force, setForce] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string|null>(null);
    const [showResult, setShowResult] = useState(false);

    // Bell curve approximation for length-tension
    React.useEffect(() => {
        // Peak at 50
        const dist = Math.abs(length - 50);
        const f = Math.max(0, 100 - (dist * 2.5));
        setForce(f);
    }, [length]);

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

            <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <div className="h-32 flex items-center justify-center relative border-b border-dashed border-slate-400">
                    {/* Visualizing Sarcomere Length */}
                    <div className="h-8 bg-blue-400 rounded-l absolute left-[10%]" style={{ width: '40%', transform: `translateX(${-length/2}px)` }}></div>
                    <div className="h-8 bg-blue-400 rounded-r absolute right-[10%]" style={{ width: '40%', transform: `translateX(${length/2}px)` }}></div>
                    <div className="h-4 bg-red-500 absolute w-1/3 rounded opacity-80 top-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Short</span>
                    <input type="range" min="0" max="100" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-1/2" />
                    <span className="text-xs font-bold uppercase text-muted-foreground">Long</span>
                </div>

                <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative">
                    <div className="h-full bg-green-500 transition-all duration-100" style={{width: `${force}%`}}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black mix-blend-overlay">FORCE OUTPUT</span>
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

export const MusclePhysiology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const theoryVisual = 
        currentExercise.componentId === 'sarcomere_sim' ? <SlidingFilamentVisual /> :
        currentExercise.componentId === 'motor_unit_sim' ? <MotorUnitVisual /> : null;

    let Content = null;
    if (currentExercise.componentId === 'sarcomere_sim') Content = SarcomereSim;
    else if (currentExercise.componentId === 'motor_unit_sim') Content = MotorUnitSim;
    else Content = LengthTensionSim;

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
