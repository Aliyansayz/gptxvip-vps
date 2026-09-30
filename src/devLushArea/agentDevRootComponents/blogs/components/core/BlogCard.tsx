import React from 'react';
import { BlogPost } from '../../types/types';
import { Clock, Calendar, ArrowRight, Sparkles, Shield, Cpu, Scale, Coins, ShoppingBag } from 'lucide-react';

interface BlogCardProps {
    blog: BlogPost;
    onSelect: (id: string) => void;
    featured?: boolean;
}

const getCategoryBadgeStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('security') || cat.includes('red team') || cat.includes('pentest') || cat.includes('soc')) {
        return {
            bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
            icon: Shield
        };
    }
    if (cat.includes('legal') || cat.includes('compliance') || cat.includes('tax')) {
        return {
            bg: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
            icon: Scale
        };
    }
    if (cat.includes('architect') || cat.includes('infrastructure') || cat.includes('database')) {
        return {
            bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
            icon: Cpu
        };
    }
    if (cat.includes('pricing') || cat.includes('finance') || cat.includes('upsell') || cat.includes('e-commerce')) {
        return {
            bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
            icon: cat.includes('upsell') ? ShoppingBag : Coins
        };
    }
    return {
        bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
        icon: Sparkles
    };
};

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelect, featured = false }) => {
    const badgeStyle = getCategoryBadgeStyle(blog.category);
    const CategoryIcon = badgeStyle.icon;

    if (featured) {
        return (
            <button
                type="button"
                aria-label={`Read featured article: ${blog.title}`}
                onClick={() => onSelect(blog.id)}
                className="group mb-4 w-full cursor-pointer overflow-hidden rounded-3xl border border-indigo-200 bg-white text-left shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 motion-reduce:transform-none dark:border-indigo-800 dark:bg-slate-900"
            >
                <div className="rounded-3xl bg-gradient-to-br from-indigo-50/60 via-white to-white p-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-8 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start justify-between">

                    <div className="flex-1 space-y-4 z-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-700 text-white rounded-full flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Featured Article
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${badgeStyle.bg}`}>
                                <CategoryIcon className="w-3.5 h-3.5" />
                                {blog.category}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                            {blog.title}
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-3xl line-clamp-3">
                            {blog.summary}
                        </p>

                        <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{blog.date}</span>
                            </div>

                            {blog.estimated_read_time && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{blog.estimated_read_time}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="z-10 shrink-0 self-end lg:self-center">
                        <div className="px-5 py-3 rounded-xl bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors duration-200 group-hover:bg-indigo-800">
                            Read Deep Dive
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-label={`Read article: ${blog.title}`}
            onClick={() => onSelect(blog.id)}
            className="group w-full cursor-pointer text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-3xl p-6 transition-[border-color,box-shadow,transform] duration-200 relative overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 motion-reduce:transform-none"
        >
            {/* Ambient Card Header Gradient Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${badgeStyle.bg}`}>
                        <CategoryIcon className="w-3 h-3" />
                        {blog.category}
                    </span>
                    {blog.estimated_read_time && (
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {blog.estimated_read_time}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {blog.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {blog.summary}
                </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{blog.date}</span>
                </div>

                <div className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </button>
    );
};
