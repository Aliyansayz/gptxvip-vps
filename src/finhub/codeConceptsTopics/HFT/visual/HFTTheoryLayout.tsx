import React from 'react';
import { BookOpen, Link, List } from 'lucide-react';

interface HFTTheoryLayoutProps {
    exercise: any;
    children?: React.ReactNode;
}

export const HFTTheoryLayout: React.FC<HFTTheoryLayoutProps> = ({ exercise, children }) => {
    const theory = exercise.theory;

    if (!theory) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 w-full">
            <div className="flex-1 space-y-6">
                {children}
            </div>
            
            <div className="w-full xl:w-[320px] shrink-0 space-y-6">
                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl" />
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        {theory.title}
                    </h4>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                        {theory.summary}
                    </p>
                    
                    {theory.bullets && theory.bullets.length > 0 && (
                        <div className="space-y-2 mb-4">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                <List className="w-3.5 h-3.5" /> Key Steps
                            </h5>
                            <ul className="space-y-1.5">
                                {theory.bullets.map((bullet: string, i: number) => (
                                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {theory.physics_link && (
                        <div className="mt-4 pt-4 border-t border-indigo-200/50 dark:border-indigo-800/50">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-2">
                                <Link className="w-3.5 h-3.5" /> Physics Connection
                            </h5>
                            <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
                                {theory.physics_link}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
