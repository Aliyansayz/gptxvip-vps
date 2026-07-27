import React, { useState, useMemo } from 'react';
import { BlogPost } from '../../types/types';
import { BlogCard } from './BlogCard';
import { Search, X, Sparkles, Layers, ArrowLeft, Filter, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogListProps {
    blogs: BlogPost[];
    onSelectBlog: (id: string) => void;
    onBackToWorkspace: () => void;
}

export const BlogList: React.FC<BlogListProps> = ({ blogs, onSelectBlog, onBackToWorkspace }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

    const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
    const remainingBlogs = filteredBlogs.slice(1);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 md:px-10">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-12 border-b border-slate-800/80 pb-6">
                <button 
                    onClick={onBackToWorkspace}
                    className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>{blogs.length} Deep Dives Available</span>
                </div>
            </div>

            {/* Hero Header */}
            <header className="text-center mb-14 relative">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>devLush Technical Journal</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight"
                >
                    Autonomous Intelligence & <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Systems Architecture
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
                >
                    Production-grade agent architectures, security red-teaming, infinite memory patterns, and algorithmic deep dives.
                </motion.p>

                {/* Search & Filter Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 max-w-2xl mx-auto space-y-6"
                >
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics, agents, security, algorithms..."
                            className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500/60 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none shadow-xl transition-all duration-300"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                    selectedCategory === cat.name
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {cat.name}
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                    selectedCategory === cat.name ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* Content Results Stats */}
            <div className="flex items-center justify-between mb-8 text-xs font-semibold text-slate-400 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Showing {filteredBlogs.length} of {blogs.length} Publications</span>
                </div>
                {(searchQuery || selectedCategory !== 'All') && (
                    <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        Clear Filters <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Articles List / Grid */}
            {filteredBlogs.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 my-8">
                    <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-200 mb-2">No Matching Deep Dives Found</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                        We couldn't find any articles matching "{searchQuery}". Try searching for another topic or resetting your category filters.
                    </p>
                    <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div>
                    {/* Featured Article Card (if no search filter is narrowing down to 1 result) */}
                    {featuredBlog && selectedCategory === 'All' && !searchQuery && (
                        <BlogCard blog={featuredBlog} onSelect={onSelectBlog} featured={true} />
                    )}

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(selectedCategory === 'All' && !searchQuery ? remainingBlogs : filteredBlogs).map(blog => (
                            <BlogCard key={blog.id} blog={blog} onSelect={onSelectBlog} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

