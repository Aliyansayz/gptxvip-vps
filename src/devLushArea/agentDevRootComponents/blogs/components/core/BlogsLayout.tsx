import React from 'react';

export const BlogsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
            {children}
        </div>
    );
};
