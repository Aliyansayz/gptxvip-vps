import React from 'react';

export const BlogsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div data-blog-scroll className="min-h-screen w-full bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50 overflow-y-auto custom-scrollbar relative selection:bg-indigo-500 selection:text-white">

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
