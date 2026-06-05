import React from 'react';
import { PlayCircle, Target, Lock, BookOpen, Layers, MousePointer2, ListOrdered, Code2, ScrollText, Workflow } from 'lucide-react';
import { InteractiveQuestion } from '../../../types'; // Either MCQQuestion or DragAndDropQuestion
import { FavoriteButton } from '../addtoFavorites/FavoriteButton';

interface CoreConceptCardProps {
    concept: InteractiveQuestion;
    onStart: () => void;
    isLocked?: boolean;
    courseId?: string;
}

const getTypeDetails = (type: string) => {
    switch (type) {
        case 'mcq': return { label: 'Multiple Choice', icon: <ListOrdered className="w-4 h-4 text-emerald-500" /> };
        case 'drag_and_drop': return { label: 'Drag & Drop', icon: <MousePointer2 className="w-4 h-4 text-blue-500" /> };
        case 'code_completion': return { label: 'Code Completion', icon: <Code2 className="w-4 h-4 text-purple-500" /> };
        case 'overview': return { label: 'Theory & Module Overview', icon: <BookOpen className="w-4 h-4 text-indigo-500" /> };
        case 'custom': return { label: 'Interactive Visual Lab', icon: <Layers className="w-4 h-4 text-rose-500" /> };
        case 'hft_journey_explainer': return { label: 'Journey Explainer', icon: <ScrollText className="w-4 h-4 text-emerald-500" /> };
        default: return { label: 'Interactive Activity', icon: <Workflow className="w-4 h-4 text-zinc-500" /> };
    }
};

export const CoreConceptCard: React.FC<CoreConceptCardProps> = ({ concept, onStart, isLocked, courseId }) => {
    const isOverview = concept.type === 'overview';
    const typeDetails = getTypeDetails(concept.type);

    return (
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-md transition-all duration-300 flex flex-col ${isLocked ? 'opacity-60 saturate-50' : 'hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-600'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-lg ${isOverview ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'}`}>
                        {isOverview ? <BookOpen className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </span>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{concept.title || "Interactive Challenge"}</h3>
                        {concept.difficulty && (
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                                concept.difficulty === 'basic' ? 'text-emerald-500' :
                                concept.difficulty === 'intermediate' ? 'text-blue-500' :
                                'text-orange-500'
                            }`}>
                                • {concept.difficulty}
                            </span>
                        )}
                    </div>
                </div>
                {!isOverview && (
                    <div className="pl-2">
                        <FavoriteButton concept={concept} />
                    </div>
                )}
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 mb-4 flex-grow">{concept.question}</p>

            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-lg mb-6 border border-zinc-100 dark:border-zinc-800">
                <div className="mb-3">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Concept Tested:</p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{concept.concept_tested || "General knowledge"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Activity Type:</p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        {typeDetails.icon}
                        {typeDetails.label}
                    </p>
                </div>
            </div>

            {isLocked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed mt-auto border border-zinc-200 dark:border-zinc-700">
                    <Lock className="w-5 h-5" />
                    Locked
                </button>
            ) : (
                <div className="flex gap-2 mt-auto">
                    <button 
                        onClick={onStart} 
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all ${isOverview ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        <PlayCircle className="w-5 h-5" />
                        {isOverview ? 'Review Theory' : 'Launch Activity'}
                    </button>
                </div>
            )}
        </div>
    );
};
