import React from 'react';
import { BlogPost } from '../../types/types';
import { BlogRenderer } from '../blocks/BlogRenderer';
import { CitationFooter } from '../blocks/BlogInteractiveElements';
import { TableOfContents } from '../blocks/TableOfContents';
import { BlogHero } from '../blocks/BlogHero';

interface BlogArticleProps {
    blog: BlogPost;
    onBack: () => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ blog, onBack }) => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <button 
                onClick={onBack}
                className="mb-8 text-sm font-semibold text-primary hover:underline flex items-center gap-2"
            >
                &larr; Back to Blogs
            </button>
            
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
        </div>
    );
};
