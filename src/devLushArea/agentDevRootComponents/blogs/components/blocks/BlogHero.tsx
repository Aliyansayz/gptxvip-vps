import React from 'react';
import { BlogPost } from '../../types/types';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface BlogHeroProps {
    blog: BlogPost;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ blog }) => {
    return (
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-10">
            <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 rounded-full uppercase">
                    {blog.category}
                </span>
                {blog.estimated_read_time && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {blog.estimated_read_time}
                    </span>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                {blog.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-3xl">
                {blog.summary}
            </p>

            <div className="flex items-center gap-6 flex-wrap">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-400">
                    <span className="uppercase tracking-wider">Published:</span>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        {blog.date}
                    </div>
                </div>
            </div>
        </header>
    );
};

