
import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon, LightbulbIcon } from '../../icons';
import { Droplet, Activity, Stethoscope } from 'lucide-react';
import SaveTheoryButton from '../../TopicTheoryView/SaveTheoryButton';

interface ChapterProps {
    step: number;
    exercises: Exercise[];
    infoVisible: boolean;
    infoPlacement: 'side' | 'bottom';
}

const TheoryPane: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
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
                    <BookOpenText className="w-5 h-5 text-emerald-500" />
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
                                <h4 className="font-bold text-foreground text-sm mb-1">Real Life Analogy</h4>
                                <p className="text-sm italic leading-relaxed">"{analogy}"</p>
                            </div>
                        )}

                        {application && (
                            <div>
                                <h4 className="font-bold text-foreground text-sm mb-1">Clinical Application</h4>
                                <p className="text-sm leading-relaxed">{application}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CarbMetabolism: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const [glucoseLevel, setGlucoseLevel] = useState(150); // Starting High
    const [hormone, setHormone] = useState<'None' | 'Insulin' | 'Glucagon'>('None');
    const [isAnimating, setIsAnimating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setGlucoseLevel(prev => {
                    if (hormone === 'Insulin') return Math.max(80, prev - 2);
                    if (hormone === 'Glucagon') return Math.min(200, prev + 2);
                    return prev;
                });
            }, 50);
            
            const timeout = setTimeout(() => {
                setIsAnimating(false);
                if (hormone === 'Insulin' && glucoseLevel > 140) { // Check logic after sim
                    // Logic check done inside visual
                }
            }, 3000);
            return () => { clearInterval(interval); clearTimeout(timeout); };
        }
    }, [isAnimating, hormone]);

    const handleInject = (h: 'Insulin' | 'Glucagon') => {
        setHormone(h);
        setIsAnimating(true);
        if (h === 'Insulin') {
            setTimeout(() => { setShowResult(true); toast.success("Glucose Normalized!"); }, 3000);
        } else {
            toast.error("Glucose is rising further!");
        }
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-card p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-heading text-3xl">{exercise.title}</h3>
                
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <Droplet className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-muted-foreground uppercase">Blood Glucose</div>
                            <div className={`text-3xl font-mono font-bold ${glucoseLevel > 120 ? 'text-red-500' : 'text-green-500'}`}>
                                {Math.round(glucoseLevel)} <span className="text-sm text-muted-foreground">mg/dL</span>
                            </div>
                        </div>
                    </div>
                    {isAnimating && <Activity className="w-6 h-6 text-blue-500 animate-pulse" />}
                </div>

                <div className="relative h-64 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-xl overflow-hidden">
                    {/* Blood Vessel */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-32 bg-red-500/10 border-y border-red-300 dark:border-red-800 relative">
                            {/* Glucose Particles */}
                            {Array.from({ length: Math.floor(glucoseLevel / 10) }).map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 bg-white rounded-full shadow-sm animate-float"
                                     style={{ 
                                         left: `${Math.random() * 100}%`, 
                                         top: `${Math.random() * 100}%`,
                                         animationDuration: `${2 + Math.random()}s`
                                     }} 
                                />
                            ))}
                            {/* Hormone Particles */}
                            {isAnimating && Array.from({ length: 10 }).map((_, i) => (
                                <div key={`h-${i}`} className={`absolute w-3 h-3 ${hormone === 'Insulin' ? 'bg-blue-500' : 'bg-orange-500'} rounded-sm animate-pulse`}
                                     style={{ 
                                         left: `${Math.random() * 100}%`, 
                                         top: `${Math.random() * 100}%`,
                                         animationDuration: `${1 + Math.random()}s`
                                     }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-3">
                    <p className="font-semibold">{exercise.question}</p>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => handleInject('Insulin')} disabled={isAnimating || showResult} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex flex-col items-center">
                            <span>Insulin</span>
                            <span className="text-[10px] font-normal opacity-80">Lowers Glucose</span>
                        </button>
                        <button onClick={() => handleInject('Glucagon')} disabled={isAnimating || showResult} className="p-3 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold flex flex-col items-center">
                            <span>Glucagon</span>
                            <span className="text-[10px] font-normal opacity-80">Raises Glucose</span>
                        </button>
                        <button disabled className="p-3 bg-gray-400 text-white rounded font-bold flex flex-col items-center cursor-not-allowed">
                            <span>Cortisol</span>
                            <span className="text-[10px] font-normal opacity-80">Stress Hormone</span>
                        </button>
                    </div>
                </div>
                
                {showResult && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded border border-green-200 dark:border-green-800">
                        <p className="font-bold">Correct Action!</p>
                        <p className="text-sm">{exercise.explanation}</p>
                    </div>
                )}
            </div>
            {infoVisible && (infoPlacement === 'side' ? <aside className="w-full lg:w-1/3"><TheoryPane exercise={exercise} /></aside> : <div className="w-full"><TheoryPane exercise={exercise} /></div>)}
        </div>
    );
};
