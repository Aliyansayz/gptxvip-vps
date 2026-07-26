import React from 'react';
import { BlogPost } from '../../types/types';
import { BlogRenderer } from '../blocks/BlogRenderer';

interface BlogArticleProps {
    blog: BlogPost;
    onBack: () => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ blog, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <button 
                onClick={onBack}
                className="mb-8 text-sm font-semibold text-primary hover:underline flex items-center gap-2"
            >
                &larr; Back to Blogs
            </button>
            <span className="text-xs font-bold tracking-wider text-primary uppercase">{blog.category}</span>
            <div className="text-sm text-slate-500 mt-4 mb-8">Published on {blog.date}</div>
            
            <BlogRenderer blocks={blog.body} />
        </div>
    );
};
