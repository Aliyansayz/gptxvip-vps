import React, { useState } from 'react';
import { CodeSnippetBlock, BlockquoteBlock, AccordionBlock, ImageCarouselBlock, VideoBlock, TextSegment } from '../../types/types';
import { ChevronDown, ChevronRight, Quote, Terminal, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Note: If you want syntax highlighting, consider importing react-syntax-highlighter here.

// Helper to render basic text segments if needed inside premium blocks
const renderTextSegments = (elements?: TextSegment[] | string) => {
    if (!elements) return null;
    if (typeof elements === 'string') return elements;
    return elements.map((seg, idx) => {
        if (seg.style === 'bold') return <strong key={idx}>{seg.text}</strong>;
        if (seg.style === 'italic') return <em key={idx}>{seg.text}</em>;
        return <span key={idx}>{seg.text}</span>;
    });
};

export const CodeSnippet: React.FC<{ block: CodeSnippetBlock }> = ({ block }) => {
    return (
        <div className="my-8 rounded-xl overflow-hidden bg-slate-900 shadow-xl border border-slate-700">
            {block.filename && (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700 text-slate-300 text-sm font-mono">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    {block.filename}
                </div>
            )}
            <div className="p-4 overflow-x-auto text-sm text-slate-50 font-mono leading-relaxed">
                <pre><code>{block.code}</code></pre>
            </div>
        </div>
    );
};

export const Blockquote: React.FC<{ block: BlockquoteBlock }> = ({ block }) => {
    return (
        <blockquote className="my-10 relative">
            <Quote className="w-16 h-16 text-indigo-100 absolute -top-4 -left-6 -z-10" />
            <div className="pl-6 border-l-4 border-indigo-500 py-2">
                <p className="text-xl md:text-2xl font-serif italic text-slate-700 leading-relaxed mb-4">
                    {renderTextSegments(block.elements || block.text)}
                </p>
                {block.cite && (
                    <footer className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        &mdash; {block.cite}
                    </footer>
                )}
            </div>
        </blockquote>
    );
};

export const Accordion: React.FC<{ block: AccordionBlock }> = ({ block }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="my-8 space-y-3">
            {block.items.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <button 
                        className="w-full flex items-center justify-between p-5 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {openIndex === idx && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 text-slate-600 leading-relaxed border-t border-slate-100">
                                    {renderTextSegments(item.content)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export const ImageCarousel: React.FC<{ block: ImageCarouselBlock }> = ({ block }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!block.images || block.images.length === 0) return null;

    return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 relative group">
            <div className="relative aspect-video">
                <img 
                    src={block.images[currentIndex].url} 
                    alt={block.images[currentIndex].alt || 'Carousel image'} 
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
            </div>
            {block.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {block.images.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all ${currentIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            )}
            {block.images[currentIndex].caption && (
                <div className="p-4 bg-white border-t border-slate-100 text-sm text-slate-500 text-center italic">
                    {block.images[currentIndex].caption}
                </div>
            )}
        </div>
    );
};

export const VideoPlayer: React.FC<{ block: VideoBlock }> = ({ block }) => {
    return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group relative aspect-video flex items-center justify-center">
            {/* If it's a direct mp4, use <video>. If it's youtube, you'd use an iframe. Assuming standard video for now */}
            <video 
                src={block.videoUrl}
                poster={block.posterUrl}
                controls
                className="w-full h-full object-cover"
            />
            {block.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-sm text-white/90 text-center pb-8 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                    {block.caption}
                </div>
            )}
        </div>
    );
};

// 1. Highlight Box Callout Component
export const HighlightBox: React.FC<{ block: any }> = ({ block }) => {
    const variant = block.variant || 'indigo';
    const colorMap = {
        indigo: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200 shadow-indigo-500/10',
        rose: 'border-rose-500/40 bg-rose-950/30 text-rose-200 shadow-rose-500/10',
        emerald: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200 shadow-emerald-500/10',
        amber: 'border-amber-500/40 bg-amber-950/30 text-amber-200 shadow-amber-500/10',
    };
    const badgeColorMap = {
        indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    };

    return (
        <div className={`my-8 p-6 md:p-8 rounded-2xl border backdrop-blur-xl shadow-xl ${colorMap[variant as keyof typeof colorMap] || colorMap.indigo} relative overflow-hidden`}>
            <div className="flex items-center justify-between gap-4 mb-4">
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2 m-0">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {block.title}
                </h4>
                {block.badge && (
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${badgeColorMap[variant as keyof typeof badgeColorMap] || badgeColorMap.indigo}`}>
                        {block.badge}
                    </span>
                )}
            </div>

            <ul className="space-y-3 m-0 p-0 list-none">
                {block.points.map((pt: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <span className="text-indigo-400 font-bold mt-0.5">✦</span>
                        <span>{typeof pt === 'string' ? pt : renderTextSegments(pt)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// 2. Conclusion & Summary Card Component
export const ConclusionCard: React.FC<{ block: any }> = ({ block }) => {
    return (
        <div className="my-12 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/50 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                    Executive Summary & Takeaways
                </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-4 leading-tight">
                {block.title}
            </h3>

            <p className="text-slate-300 text-base leading-relaxed mb-6">
                {block.summary}
            </p>

            {block.keyTakeaways && block.keyTakeaways.length > 0 && (
                <div className="space-y-3 mb-8 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Takeaways</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {block.keyTakeaways.map((takeaway: string, idx: number) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-200">
                                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                <span>{takeaway}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {block.cta && (
                <div className="pt-2">
                    <a
                        href={block.cta.link}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                        {block.cta.text} &rarr;
                    </a>
                </div>
            )}
        </div>
    );
};

// 3. Stat Grid Component
export const StatGrid: React.FC<{ block: any }> = ({ block }) => {
    return (
        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {block.stats.map((stat: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                    <div className="text-3xl md:text-4xl font-extrabold text-slate-100 group-hover:text-indigo-300 transition-colors tracking-tight">
                        {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                        {stat.label}
                    </div>
                    {stat.change && (
                        <div className="text-xs font-bold text-emerald-400 mt-3 flex items-center gap-1">
                            <span>▲</span> {stat.change}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// 4. TL;DR Banner Component
export const TLDRBanner: React.FC<{ block: any }> = ({ block }) => {
    return (
        <div className="my-8 p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
            <div className="pl-4">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                    {block.title || 'TL;DR Executive Summary'}
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium m-0">
                    {block.text}
                </p>
                {block.highlights && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {block.highlights.map((hl: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                                #{hl}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

