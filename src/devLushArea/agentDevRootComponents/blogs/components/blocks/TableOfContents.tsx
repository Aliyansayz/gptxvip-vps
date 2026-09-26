import React, { useEffect, useMemo, useState } from 'react';
import { BlogBlock } from '../../types/types';
import { slugify } from '../../utils';
import { motion } from 'motion/react';

interface TableOfContentsProps {
    blocks: BlogBlock[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ blocks }) => {
    const [activeId, setActiveId] = useState<string>('');

    // Extract headings from blocks
    const headings = useMemo(
        () => blocks
            .filter((block): block is Extract<BlogBlock, { type: 'heading' | 'main_heading' | 'sub_heading' }> =>
                block.type === 'heading' || block.type === 'main_heading' || block.type === 'sub_heading'
            )
            .map(block => ({
                id: slugify(block.text),
                text: block.text,
                level: block.type === 'sub_heading' ? 3 : 2
            })),
        [blocks]
    );

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;

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
        <nav aria-label="Article contents" className="sticky top-24 p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                On this page
            </h4>
            <ul className="space-y-3 relative border-l border-slate-200 dark:border-slate-800">
                {headings.map((heading) => (
                    <li key={heading.id} className="relative">
                        <a
                            href={`#${heading.id}`}
                            className={`block pl-4 text-xs transition-colors duration-200 ${
                                activeId === heading.id
                                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            } ${heading.level === 2 ? 'ml-2' : heading.level === 3 ? 'ml-4 text-[11px]' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
                            }}
                        >
                            {heading.text}
                        </a>
                        {activeId === heading.id && (
                            <motion.div
                                layoutId="activeToC"
                                className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-indigo-500 rounded-full"
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
