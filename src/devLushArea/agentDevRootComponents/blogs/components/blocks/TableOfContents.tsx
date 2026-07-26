import React, { useEffect, useState } from 'react';
import { BlogBlock } from '../../types/types';
import { slugify } from '../../utils';
import { motion } from 'motion/react';

interface TableOfContentsProps {
    blocks: BlogBlock[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ blocks }) => {
    const [activeId, setActiveId] = useState<string>('');

    // Extract headings from blocks
    const headings = blocks.filter((block): block is Extract<BlogBlock, { type: 'heading' | 'main_heading' }> => 
        block.type === 'heading' || block.type === 'main_heading'
    ).map(block => ({
        id: slugify(block.text),
        text: block.text,
        level: block.type === 'main_heading' ? 1 : 2
    }));

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">On this page</h4>
            <ul className="space-y-3 relative border-l border-slate-200">
                {headings.map((heading) => (
                    <li key={heading.id} className="relative">
                        <a
                            href={`#${heading.id}`}
                            className={`block pl-4 text-sm transition-colors duration-200 ${
                                activeId === heading.id
                                    ? 'text-indigo-600 font-semibold'
                                    : 'text-slate-500 hover:text-slate-800'
                            } ${heading.level === 2 ? 'ml-3' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            {heading.text}
                        </a>
                        {activeId === heading.id && (
                            <motion.div
                                layoutId="activeToC"
                                className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-indigo-600 rounded-full"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
