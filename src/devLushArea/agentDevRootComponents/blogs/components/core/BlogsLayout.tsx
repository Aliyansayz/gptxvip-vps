import React from 'react';

export const BlogsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-y-auto custom-scrollbar relative selection:bg-indigo-500 selection:text-white">
            {/* Ambient Background Blur Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-[35rem] h-[35rem] bg-fuchsia-600/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e150_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e150_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

