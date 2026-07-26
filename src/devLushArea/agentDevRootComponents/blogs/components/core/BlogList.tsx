import React from 'react';
import { BlogPost } from '../../types/types';
import { BlogCard } from './BlogCard';
import { BookOpenText } from '../../../icons';

interface BlogListProps {
    blogs: BlogPost[];
    onSelectBlog: (id: string) => void;
    onBackToWorkspace: () => void;
}

export const BlogList: React.FC<BlogListProps> = ({ blogs, onSelectBlog, onBackToWorkspace }) => {
    return (
        <div className="max-w-5xl mx-auto py-16 px-6">
            <button 
                onClick={onBackToWorkspace}
                className="mb-12 text-sm font-semibold text-primary hover:underline flex items-center gap-2"
            >
                &larr; Back to Workspace
            </button>
            <header className="text-center mb-16">
                <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <BookOpenText className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-5xl font-heading tracking-wide text-slate-900">devLush Blogs</h1>
                <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
                    Insights, updates, and deep dives from the devLush team.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog} onSelect={onSelectBlog} />
                ))}
            </div>
        </div>
    );
};
