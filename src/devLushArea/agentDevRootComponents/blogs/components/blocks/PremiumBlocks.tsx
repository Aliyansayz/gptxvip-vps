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
