import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BlogPost } from '../../types/types';
import { BlogRenderer } from '../blocks/BlogRenderer';
import { CitationFooter } from '../blocks/BlogInteractiveElements';
import { TableOfContents } from '../blocks/TableOfContents';
import { BlogHero } from '../blocks/BlogHero';
import { BlogCard } from './BlogCard';
import { ArrowLeft, Sparkles, ChevronUp, Grid, BookOpen } from 'lucide-react';

interface BlogArticleProps {
    blog: BlogPost;
    allBlogs?: BlogPost[];
    onSelectBlog?: (id: string) => void;
    onBack: () => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ blog, allBlogs = [], onSelectBlog, onBack }) => {
    const articleRef = useRef<HTMLElement>(null);
    const [readingProgress, setReadingProgress] = useState(0);
    // Curate other related blogs (prefer same category, max 3)
    const relatedBlogs = useMemo(() => {
        if (!allBlogs || allBlogs.length === 0) return [];
        const candidates = allBlogs.filter(b => b.id !== blog.id);
        const sameCategory = candidates.filter(b => b.category === blog.category);
        const differentCategory = candidates.filter(b => b.category !== blog.category);
        
        return [...sameCategory, ...differentCategory].slice(0, 3);
    }, [allBlogs, blog]);

    useEffect(() => {
        const article = articleRef.current;
        if (!article) return;
        const candidate = article.closest<HTMLElement>('[data-blog-scroll]');
        const scroller = candidate && candidate.scrollHeight > candidate.clientHeight + 1 ? candidate : window;
        const update = () => {
            const rect = article.getBoundingClientRect();
            const top = scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
            const height = scroller === window ? window.innerHeight : (scroller as HTMLElement).clientHeight;
            const fraction = (top - rect.top) / Math.max(rect.height - height, 1);
            setReadingProgress(Math.max(0, Math.min(100, Math.round(fraction * 100))));
        };
        update();
        scroller.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            scroller.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [blog.id]);

    const handleSelectRelated = (id: string) => {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        if (onSelectBlog) {
            onSelectBlog(id);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-12">
            <div role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readingProgress} className="sticky top-0 z-20 -mx-4 mb-6 h-1 bg-slate-200 dark:bg-slate-800 sm:-mx-6"><div className="h-full bg-indigo-600 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${readingProgress}%` }} /></div>
            <button 
                type="button"
                onClick={onBack}
                className="mb-8 min-h-11 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </button>

            {blog.seo && blog.seo.schemaMarkup && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: blog.seo.schemaMarkup }} />
            )}
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                {/* Main Content Column */}
                <article ref={articleRef} className="min-w-0 w-full max-w-[46rem] flex-1">
                    <BlogHero blog={blog} />

                    <details className="lg:hidden mb-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">On this page</summary>
                        <div className="px-2 pb-3"><TableOfContents blocks={blog.body} /></div>
                    </details>
                    
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
                <section className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Recommended Reads
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Explore More Engineering Deep Dives
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onBack}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-600 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
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
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Published in <strong>devLush Engineering Hub</strong></span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        type="button"
                        onClick={onBack}
                        className="hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> All Posts
                    </button>
                    <button 
                        type="button"
                        onClick={scrollToTop}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white flex items-center gap-1 transition-all"
                    >
                        Top <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
