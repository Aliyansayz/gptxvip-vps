
import React, { useState } from 'react';
import { Exercise } from '../../../types';
import { toast } from 'sonner';
import { BookOpenText, ChevronDownIcon } from '../../icons';
import { Activity } from 'lucide-react';
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

export const Enzymology: React.FC<ChapterProps> = ({ step, exercises, infoVisible, infoPlacement }) => {
    const [dropped, setDropped] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const exercise = exercises[step];

    const items = [
        { id: 'ALT', label: 'ALT', target: 'liver' },
        { id: 'CK-MB', label: 'CK-MB', target: 'heart' },
        { id: 'Amylase', label: 'Amylase', target: 'pancreas' }
    ];

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('id', id);
    };

    const handleDrop = (e: React.DragEvent, target: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        setDropped(prev => ({ ...prev, [id]: target }));
    };

    const check = () => {
        const correct = items.every(i => dropped[i.id] === i.target);
        setShowResult(true);
        if (correct) toast.success("All enzymes correctly matched!");
        else toast.error("Some matches are incorrect.");
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-card p-6 rounded-lg border shadow-sm space-y-6">
                <h3 className="font-heading text-3xl">{exercise.title}</h3>
                <p className="text-muted-foreground">{exercise.prompt}</p>

                <div className="flex justify-center gap-4 mb-4">
                    {items.map(item => (
                        !dropped[item.id] && (
                            <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item.id)} 
                                className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold rounded-lg cursor-grab active:cursor-grabbing border border-emerald-300 shadow-sm">
                                {item.label}
                            </div>
                        )
                    ))}
                </div>

                <div className="relative h-96 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4">
                    {/* Simplified Body Map */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center border border-red-300"
                         onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'heart')}>
                        <div className="text-center">
                            <Activity className="w-8 h-8 mx-auto text-red-500 mb-1" />
                            <span className="text-xs font-bold text-red-500 uppercase">Heart</span>
                            <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                                {Object.entries(dropped).filter(([_, t]) => t === 'heart').map(([id]) => (
                                    <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-red-200">{id}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-40 right-10 w-40 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center border border-orange-300"
                         onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'liver')}>
                        <div className="text-center">
                            <span className="text-xs font-bold text-orange-600 uppercase">Liver</span>
                            <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                                {Object.entries(dropped).filter(([_, t]) => t === 'liver').map(([id]) => (
                                    <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-orange-200">{id}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-52 left-10 w-32 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center border border-yellow-300"
                         onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'pancreas')}>
                        <div className="text-center">
                            <span className="text-xs font-bold text-yellow-600 uppercase">Pancreas</span>
                            <div className="mt-2 min-h-[30px] flex flex-wrap gap-1 justify-center">
                                {Object.entries(dropped).filter(([_, t]) => t === 'pancreas').map(([id]) => (
                                    <span key={id} className="text-xs bg-white dark:bg-black px-1 rounded border border-yellow-200">{id}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {!showResult && <button onClick={check} className="w-full py-2 bg-emerald-600 text-white rounded font-bold">Verify Placement</button>}
                
                {showResult && (
                    <div className="p-4 rounded border bg-muted/50">
                        <p>{exercise.explanation}</p>
                    </div>
                )}
            </div>
            {infoVisible && (infoPlacement === 'side' ? <aside className="w-full lg:w-1/3"><TheoryPane exercise={exercise} /></aside> : <div className="w-full"><TheoryPane exercise={exercise} /></div>)}
        </div>
    );
};
