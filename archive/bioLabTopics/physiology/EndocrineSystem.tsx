
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

const TheoryPane: React.FC<{ exercise: Exercise; visual?: React.ReactNode }> = ({ exercise, visual }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (!exercise?.theory) return null;
    
    const { title, content, analogy, application } = exercise.theory;

    return (
        <div className="p-4 bg-card rounded-lg border h-full space-y-4 flex flex-col">
            <button className="w-full flex justify-between text-lg font-bold text-card-foreground" onClick={() => setIsOpen(!isOpen)}>
                <span className="flex items-center gap-2"><BookOpenText className="w-5 h-5 text-purple-500" />{title}</span>
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

const ThyroidSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [t4, setT4] = useState(50);
    const tsh = Math.max(0, 100 - t4); // Inverse relationship

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className="flex items-center justify-around h-48 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                <div className="text-center">
                    <div className="h-32 w-16 bg-gray-200 rounded-t-lg relative flex items-end">
                        <div className="w-full bg-blue-500 rounded-t-lg transition-all duration-300" style={{ height: `${tsh}%` }}></div>
                    </div>
                    <div className="font-bold mt-2">TSH (Stimulator)</div>
                </div>
                
                <div className="text-center">
                    <div className="h-32 w-16 bg-gray-200 rounded-t-lg relative flex items-end">
                        <div className="w-full bg-purple-500 rounded-t-lg transition-all duration-300" style={{ height: `${t4}%` }}></div>
                    </div>
                    <div className="font-bold mt-2">T4 (Product)</div>
                </div>
            </div>
            
            <input type="range" value={t4} onChange={(e) => setT4(Number(e.target.value))} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">Adjust T4 Level</div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! Negative feedback loop.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
};

const ReceptorSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            <div className="p-8 bg-muted rounded-xl flex justify-center items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">Hormone</div>
               <div className="text-2xl">→</div>
               <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold relative">
                   Cell
                   <div className="absolute -left-2 w-4 h-8 bg-green-500 rounded-r-lg"></div>
               </div>
            </div>
             <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! Specificity.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
};

const StressSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [stress, setStress] = useState(false);
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className={`p-8 rounded-xl border transition-colors duration-500 ${stress ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500'}`}>
                <div className="text-center text-4xl mb-4">{stress ? '🦁 DANGER!' : '😌 Relaxed'}</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>Heart Rate: {stress ? '⬆️ 120 bpm' : '⬇️ 60 bpm'}</div>
                    <div>Digestion: {stress ? '🚫 Paused' : '✅ Active'}</div>
                </div>
            </div>
            
            <button onClick={() => setStress(!stress)} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold">Toggle Stress</button>

             <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! Rest and digest is off.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
}


export const NegativeFeedbackVisual = () => (
    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Thermostat Logic</h4>
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-red-500 text-white text-[8px] rounded">HOT</div>
                <div className="w-10 h-1 bg-slate-300 relative">
                    <div className="absolute right-0 w-2 h-3 bg-slate-600 -top-1"></div>
                </div>
                <div className="text-xs">→</div>
                <div className="px-2 py-1 bg-blue-500 text-white text-[8px] rounded">AC ON</div>
            </div>
            <div className="text-[10px] text-purple-500 font-bold">Self-Correcting</div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">When the level gets too high, the system turns itself off.</p>
    </div>
);

export const EndocrineSystem: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const theoryVisual = currentExercise.componentId === "thyroid_feedback" ? <NegativeFeedbackVisual /> : null;

    let Content = null;
    if (currentExercise.componentId === 'thyroid_feedback') Content = ThyroidSim;
    else if (currentExercise.componentId === 'receptor_cascade') Content = ReceptorSim;
    else Content = StressSim;

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
