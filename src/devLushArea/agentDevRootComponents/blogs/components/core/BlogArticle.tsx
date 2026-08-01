import React, { useMemo } from 'react';
import { BlogPost } from '../../types/types';
import { BlogRenderer } from '../blocks/BlogRenderer';
import { CitationFooter } from '../blocks/BlogInteractiveElements';
import { TableOfContents } from '../blocks/TableOfContents';
import { BlogHero } from '../blocks/BlogHero';
import { BlogCard } from './BlogCard';
import { ArrowLeft, Sparkles, ChevronUp, Grid, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogArticleProps {
    blog: BlogPost;
    allBlogs?: BlogPost[];
    onSelectBlog?: (id: string) => void;
    onBack: () => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ blog, allBlogs = [], onSelectBlog, onBack }) => {
    // Curate other related blogs (prefer same category, max 3)
    const relatedBlogs = useMemo(() => {
        if (!allBlogs || allBlogs.length === 0) return [];
        const candidates = allBlogs.filter(b => b.id !== blog.id);
        const sameCategory = candidates.filter(b => b.category === blog.category);
        const differentCategory = candidates.filter(b => b.category !== blog.category);
        
        return [...sameCategory, ...differentCategory].slice(0, 3);
    }, [allBlogs, blog]);

    const handleSelectRelated = (id: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (onSelectBlog) {
            onSelectBlog(id);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <button 
                onClick={onBack}
                className="mb-8 text-xs font-semibold text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-800 hover:border-indigo-500/40 shadow-lg"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </button>

            {blog.seo && blog.seo.schemaMarkup && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: blog.seo.schemaMarkup }} />
            )}
            
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Main Content Column */}
                <article className="flex-1 max-w-4xl">
                    <BlogHero blog={blog} />
                    
                    <BlogRenderer blogId={blog.id} blocks={blog.body} />
                    
                    {blog.citations && <CitationFooter citations={blog.citations} />}
                </article>

                {/* Sticky Sidebar */}
                <aside className="hidden lg:block w-80 shrink-0">
                    <TableOfContents blocks={blog.body} />
                </aside>
            </div>

            {/* Other Blogs Section */}
            {relatedBlogs.length > 0 && (
                <section className="mt-24 pt-16 border-t border-slate-800/80">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Recommended Reads
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Explore More Engineering Deep Dives
                            </h2>
                        </div>

                        <button
                            onClick={onBack}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                        >
                            <Grid className="w-3.5 h-3.5" /> Browse All Articles
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedBlogs.map((otherBlog) => (
                            <BlogCard 
                                key={otherBlog.id} 
                                blog={otherBlog} 
                                onSelect={handleSelectRelated} 
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Bottom Floating Navigation Bar */}
            <div className="mt-16 pt-8 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Published in <strong>devLush Engineering Hub</strong></span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> All Posts
                    </button>
                    <button 
                        onClick={scrollToTop}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-800 hover:border-indigo-500/40 text-slate-700 hover:text-white flex items-center gap-1 transition-all"
                    >
                        Top <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

