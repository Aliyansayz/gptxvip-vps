
import React, { useState } from 'react';
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

const PathAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 200 80" className="w-48 h-20 opacity-90">
            <path d="M 20 40 Q 100 10 180 40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-muted-foreground" />
            <path d="M 20 50 Q 100 20 180 50" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <text x="100" y="75" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">TRAFFIC FLOW</text>
        </svg>
    </div>
);

const AmplifierAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 120 100" className="w-32 h-24 opacity-90">
            <polygon points="30,80 90,80 60,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <line x1="45" y1="80" x2="45" y2="60" stroke="#3b82f6" strokeWidth="2" />
            <line x1="60" y1="80" x2="60" y2="50" stroke="#3b82f6" strokeWidth="2" />
            <line x1="75" y1="80" x2="75" y2="60" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="90" cy="20" r="12" fill="#3b82f6" />
            <text x="90" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">+</text>
            <text x="60" y="95" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">SIGNAL BOOST</text>
        </svg>
    </div>
);

const GardenerAnalogy = () => (
    <div className="w-full flex justify-center py-4">
        <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-90">
            <path d="M 50 90 L 50 50" stroke="#22c55e" strokeWidth="4" />
            <path d="M 50 50 L 20 20" stroke="#22c55e" strokeWidth="3" />
            <path d="M 50 50 L 80 20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="text-muted-foreground" />
            <line x1="75" y1="25" x2="85" y2="15" stroke="#ef4444" strokeWidth="2" />
            <line x1="85" y1="25" x2="75" y2="15" stroke="#ef4444" strokeWidth="2" />
            <text x="50" y="98" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground font-mono">PRUNING</text>
        </svg>
    </div>
);

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    const { title, content, analogy, application } = exercise.theory;

    const renderAnalogyVisual = () => {
        if (title.includes("Hebbian")) return <PathAnalogy />;
        if (title.includes("LTP")) return <AmplifierAnalogy />;
        if (title.includes("Pruning")) return <GardenerAnalogy />;
        return null;
    };

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
                        
                        {renderAnalogyVisual()}

                        
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

const HebbianSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [connection, setConnection] = useState(0); // 0-100
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    const fireTogether = () => {
        setConnection(prev => Math.min(100, prev + 20));
        if (connection > 80) toast.success("Strong Connection Formed!");
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct! Wiring together.");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold ${connection > 0 ? 'bg-yellow-100 border-yellow-500 animate-pulse' : 'bg-gray-100 border-gray-300'}`}>A</div>
                
                <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${connection}%` }} />
                </div>
                
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold ${connection > 0 ? 'bg-yellow-100 border-yellow-500 animate-pulse' : 'bg-gray-100 border-gray-300'}`}>B</div>
            </div>
            
            <button onClick={fireTogether} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow">Fire Together</button>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedOption(opt)}
                        disabled={showResult}
                        className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                            selectedOption === opt 
                                ? 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-100' 
                                : 'hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedOption}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct! Neurons that fire together, wire together." : "Incorrect. Remember Hebb's rule."}
                </div>
            )}
        </div>
    );
};

const LTPSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [receptors, setReceptors] = useState(3);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    const stimulate = () => {
        setReceptors(prev => Math.min(10, prev + 1));
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct! More receptors = Stronger signal.");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className="h-48 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 relative flex items-end justify-center pb-4 gap-2">
                {Array.from({length: receptors}).map((_, i) => (
                    <div key={i} className="w-4 h-8 bg-green-500 rounded-t-full border border-green-700 animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>
                ))}
                <span className="absolute top-4 left-4 text-xs font-bold text-blue-800 dark:text-blue-300">Post-Synaptic Density</span>
            </div>
            
            <button onClick={stimulate} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow">High Frequency Stimulation</button>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedOption(opt)}
                        disabled={showResult}
                        className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                            selectedOption === opt 
                                ? 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100' 
                                : 'hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedOption}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct! Increased receptor density strengthens the synapse." : "Incorrect. Think about sensitivity."}
                </div>
            )}
        </div>
    );
};

const PruningSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === exercise.answer;
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) toast.success("Correct! Efficiency is key.");
        else toast.error("Incorrect.");
        onAnswered(correct);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            <div className="p-8 text-center bg-muted rounded-xl">
                <p className="italic text-muted-foreground">Interactive Pruning visualization placeholder. Imagine connections fading.</p>
            </div>
             <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button 
                        key={opt} 
                        onClick={() => !showResult && setSelectedOption(opt)}
                        disabled={showResult}
                        className={`p-4 border rounded-xl text-left transition-colors font-medium ${
                            selectedOption === opt 
                                ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-100' 
                                : 'hover:bg-muted'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {!showResult && (
                <button 
                    onClick={handleCheck}
                    disabled={!selectedOption}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            )}
            {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isCorrect ? "Correct! Pruning removes weak connections for efficiency." : "Incorrect. It's about optimization."}
                </div>
            )}
        </div>
    );
}

export const Neuroplasticity: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    let Content = null;
    if (currentExercise.componentId === 'hebbian_wire') Content = HebbianSim;
    else if (currentExercise.componentId === 'ltp_sim') Content = LTPSim;
    else Content = PruningSim;

    return (
        <>
            {infoVisible && infoPlacement === 'side' ? (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><Content exercise={currentExercise} onAnswered={() => {}} /></div>
                    <aside className="lg:col-span-1 sticky top-24 h-fit"><TheoryPane exercise={currentExercise} /></aside>
                </div>
            ) : (
                <div className="flex flex-col gap-6"><Content exercise={currentExercise} onAnswered={() => {}} />{infoVisible && <TheoryPane exercise={currentExercise} />}</div>
            )}
        </>
    );
};
