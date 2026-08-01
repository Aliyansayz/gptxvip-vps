import React from 'react';
import { BlogPost } from '../../types/types';
import { motion } from 'motion/react';
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
            bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
            icon: Shield
        };
    }
    if (cat.includes('legal') || cat.includes('compliance') || cat.includes('tax')) {
        return {
            bg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
            icon: Scale
        };
    }
    if (cat.includes('architect') || cat.includes('infrastructure') || cat.includes('database')) {
        return {
            bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
            icon: Cpu
        };
    }
    if (cat.includes('pricing') || cat.includes('finance') || cat.includes('upsell') || cat.includes('e-commerce')) {
        return {
            bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
            icon: cat.includes('upsell') ? ShoppingBag : Coins
        };
    }
    return {
        bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        icon: Sparkles
    };
};

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelect, featured = false }) => {
    const badgeStyle = getCategoryBadgeStyle(blog.category);
    const CategoryIcon = badgeStyle.icon;

    if (featured) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelect(blog.id)}
                className="group cursor-pointer relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-500 shadow-2xl shadow-indigo-950/50 mb-12 overflow-hidden"
            >
                <div className="bg-white/90 backdrop-blur-xl rounded-[23px] p-8 md:p-10 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start justify-between">
                    {/* Glow Accents */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />

                    <div className="flex-1 space-y-4 z-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-500 text-white rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-500/30">
                                <Sparkles className="w-3.5 h-3.5" /> Featured Article
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${badgeStyle.bg}`}>
                                <CategoryIcon className="w-3.5 h-3.5" />
                                {blog.category}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 group-hover:text-indigo-300 transition-colors leading-tight">
                            {blog.title}
                        </h2>

                        <p className="text-slate-600 text-base leading-relaxed max-w-3xl line-clamp-3">
                            {blog.summary}
                        </p>

                        <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600">
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
                        <div className="px-6 py-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white font-semibold text-sm flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
                            Read Deep Dive
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            onClick={() => onSelect(blog.id)}
            className="group cursor-pointer bg-white/60 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
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
                        <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {blog.estimated_read_time}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-300 transition-colors leading-snug">
                    {blog.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {blog.summary}
                </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{blog.date}</span>
                </div>

                <div className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

