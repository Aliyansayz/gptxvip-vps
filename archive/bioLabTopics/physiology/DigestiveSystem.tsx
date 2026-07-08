
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
                <span className="flex items-center gap-2"><BookOpenText className="w-5 h-5 text-green-500" />{title}</span>
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

const EnzymeSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [env, setEnv] = useState('neutral');
    
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className={`h-48 rounded-xl border flex flex-col items-center justify-center transition-colors duration-500 ${env === 'acid' ? 'bg-red-100 border-red-300' : env === 'base' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100'}`}>
                <div className="text-4xl animate-bounce">
                    {env === 'acid' ? '⚡️ Active Pepsin' : '💤 Inactive'}
                </div>
                <div className="mt-4 font-mono">Current pH: {env === 'acid' ? '2.0' : env === 'base' ? '8.0' : '7.0'}</div>
            </div>
            
            <div className="flex gap-4">
                <button onClick={() => setEnv('acid')} className="flex-1 py-2 bg-red-500 text-white rounded">Stomach (Acid)</button>
                <button onClick={() => setEnv('base')} className="flex-1 py-2 bg-blue-500 text-white rounded">Intestine (Base)</button>
            </div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! Pepsin loves acid.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
};

const VilliSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    const [zoom, setZoom] = useState(1);
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            
            <div className="h-48 overflow-hidden bg-pink-50 rounded-xl border border-pink-200 relative">
                {/* Simulated folding visualization */}
                <div className="absolute inset-0 flex items-end justify-center transition-transform duration-1000" style={{ transform: `scale(${zoom})`, transformOrigin: 'bottom' }}>
                    <div className="flex gap-1">
                        {Array.from({length: 20}).map((_, i) => (
                            <div key={i} className="w-4 h-32 bg-pink-400 rounded-t-full"></div>
                        ))}
                    </div>
                </div>
            </div>
            
            <input type="range" min="1" max="5" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">Zoom Level: {zoom}x</div>

            <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! Surface area is key.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
};

const PeristalsisSim: React.FC<{ exercise: Exercise; onAnswered: (c: boolean) => void }> = ({ exercise, onAnswered }) => {
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="font-heading text-2xl">{exercise.title}</h3>
            <div className="h-32 bg-orange-100 rounded-xl flex items-center p-4 relative overflow-hidden">
                <div className="w-full h-16 bg-orange-200 rounded-full absolute"></div>
                <div className="w-8 h-8 bg-brown-600 rounded-full absolute animate-slide-ltr bg-amber-800"></div> 
            </div>
             <div className="grid gap-2 mt-4">
                <p className="font-semibold">{exercise.question}</p>
                {exercise.options?.map(opt => (
                    <button key={opt} onClick={() => {
                        const correct = opt === exercise.answer;
                        if(correct) toast.success("Correct! The wave pushes it.");
                        else toast.error("Incorrect.");
                        onAnswered(correct);
                    }} className="p-3 border rounded text-left hover:bg-muted">{opt}</button>
                ))}
            </div>
        </div>
    );
}


export const EnzymeLockVisual = () => (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900">
        <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-widest text-center mb-4">Specific Tools</h4>
        <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-12 border-2 border-green-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-b-2 border-r-2 border-green-500"></div>
            </div>
            <div className="text-lg">+</div>
            <div className="w-6 h-6 bg-green-600 rotate-45"></div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic">Enzymes work like keys, only fitting specific substrates.</p>
    </div>
);

export const DigestiveSystem: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const currentExercise = exercises[step];
    if (!currentExercise) return null;

    const theoryVisual = currentExercise.componentId === "enzyme_ph_lab" ? <EnzymeLockVisual /> : null;

    let Content = null;
    if (currentExercise.componentId === 'enzyme_ph_lab') Content = EnzymeSim;
    else if (currentExercise.componentId === 'villi_expansion') Content = VilliSim;
    else Content = PeristalsisSim;

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
