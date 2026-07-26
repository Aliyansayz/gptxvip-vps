import React from 'react';
import { BlogPost } from '../../types/types';

interface BlogCardProps {
    blog: BlogPost;
    onSelect: (id: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelect }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
                <span className="text-xs font-bold tracking-wider text-primary uppercase">{blog.category}</span>
                <h3 className="text-xl font-heading tracking-wider text-slate-900 mt-2">{blog.title}</h3>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">{blog.summary}</p>
                <button 
                    onClick={() => onSelect(blog.id)}
                    className="mt-6 text-sm font-semibold text-primary hover:underline flex items-center gap-2"
                >
                    Read Post <span>&rarr;</span>
                </button>
            </div>
        </div>
    );
};
