import React, { useState, useMemo } from 'react';
import { BlogPost } from '../../types/types';
import { BlogCard } from './BlogCard';
import { Search, X, Sparkles, Layers, ArrowLeft, BookOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { StatePanel } from '../../../../../shared/components/StatePanel';

interface BlogListProps {
    blogs: BlogPost[];
    onSelectBlog: (id: string) => void;
    onBackToWorkspace: () => void;
    backToWorkspaceLabel?: string;
}

export const BlogList: React.FC<BlogListProps> = ({ blogs, onSelectBlog, onBackToWorkspace, backToWorkspaceLabel = 'Back to workspace' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const reducedMotion = useReducedMotion();

    // Extract unique categories
    const categories = useMemo(() => {
        const catMap: Record<string, number> = {};
        blogs.forEach(blog => {
            const cat = blog.category;
            catMap[cat] = (catMap[cat] || 0) + 1;
        });
        return [
            { name: 'All', count: blogs.length },
            ...Object.entries(catMap).map(([name, count]) => ({ name, count }))
        ];
    }, [blogs]);

    // Filtered blogs based on search query and category
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch = 
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.category.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [blogs, searchQuery, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-10 md:py-12">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
                <button 
                    type="button"
                    onClick={onBackToWorkspace}
                    className="min-h-11 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> {backToWorkspaceLabel}
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>{blogs.length} Deep Dives Available</span>
                </div>
            </div>

            {/* Hero Header */}
            <header className="text-center mb-14 relative">
                <motion.div 
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>devLush Technical Journal</span>
                </motion.div>

                <motion.h1 
                    initial={reducedMotion ? false : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight"
                >
                    Autonomous Intelligence & <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Systems Architecture
                    </span>
                </motion.h1>

                <motion.p 
                    initial={reducedMotion ? false : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 dark:text-slate-400 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
                >
                    Production-grade agent architectures, security red-teaming, infinite memory patterns, and algorithmic deep dives.
                </motion.p>

                {/* Search & Filter Section */}
                <motion.div 
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 max-w-2xl mx-auto space-y-6"
                >
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="text"
                            aria-label="Search articles"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics, agents, security, algorithms..."
                            className="w-full min-h-11 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/60 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors duration-200"
                        />
                        {searchQuery && (
                            <button 
                                type="button"
                                aria-label="Clear article search"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                        {categories.map((cat) => (
                            <button
                                type="button"
                                aria-pressed={selectedCategory === cat.name}
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`min-h-10 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                    selectedCategory === cat.name
                                        ? 'bg-indigo-600 text-white border border-indigo-700'
                                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                                }`}
                            >
                                {cat.name}
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                    selectedCategory === cat.name ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* Content Results Stats */}
            <div className="flex items-center justify-between mb-8 text-xs font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span aria-live="polite">Showing {filteredBlogs.length} of {blogs.length} articles</span>
                </div>
                {(searchQuery || selectedCategory !== 'All') && (
                    <button 
                        type="button"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        Clear Filters <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Articles List / Grid */}
            {filteredBlogs.length === 0 ? (
                <StatePanel title="No articles match these filters" description={`No article matches ${searchQuery ? `“${searchQuery}” and ` : ''}the selected topic. Try another search or clear the filters.`} actionLabel="Clear filters" onAction={() => { setSearchQuery(''); setSelectedCategory('All'); }} />
            ) : (
                <div>
                    <div className="mb-10">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">Featured article</p>
                        <BlogCard blog={filteredBlogs[0]} onSelect={onSelectBlog} featured />
                    </div>
                    {filteredBlogs.length > 1 && <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">More articles</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.slice(1).map(blog => (
                            <BlogCard key={blog.id} blog={blog} onSelect={onSelectBlog} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
