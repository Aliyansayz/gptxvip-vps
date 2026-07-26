import React from 'react';
import { BlogPost } from '../../types/types';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogHeroProps {
    blog: BlogPost;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ blog }) => {
    return (
        <header className="mb-12 border-b border-slate-200 pb-10">
            <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full uppercase">
                    {blog.category}
                </span>
                {blog.estimated_read_time && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.estimated_read_time}
                    </span>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                {blog.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl">
                {blog.summary}
            </p>

            <div className="flex items-center gap-6">
                {/* Author Box */}
                <div className="flex items-center gap-4">
                    {blog.author?.avatar ? (
                        <img 
                            src={blog.author.avatar} 
                            alt={blog.author.name} 
                            className="w-12 h-12 rounded-full ring-2 ring-white shadow-md object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm ring-2 ring-white">
                            <User className="w-6 h-6" />
                        </div>
                    )}
                    
                    <div>
                        <div className="font-bold text-slate-900 text-sm">
                            {blog.author?.name || 'devLush System'}
                        </div>
                        {blog.author?.role && (
                            <div className="text-xs font-medium text-slate-500">
                                {blog.author.role}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200"></div>

                {/* Date */}
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Published</span>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {blog.date}
                    </div>
                </div>
            </div>
        </header>
    );
};
