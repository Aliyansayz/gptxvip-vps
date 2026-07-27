import React, { Suspense, useMemo } from 'react';
import { BlogBlock, TextSegment } from '../../types/types';
import { TermTooltip, GlossaryTable, ContextPanel, AlertBlock } from './BlogInteractiveElements';
import { CodeSnippet, Blockquote, Accordion, ImageCarousel, VideoPlayer, HighlightBox, ConclusionCard, StatGrid, TLDRBanner } from './PremiumBlocks';
import { slugify } from '../../utils';

interface BlogRendererProps {
    blogId: string;
    blocks: BlogBlock[];
}

// Dynamic Component Loader for Visual Elements
const DynamicVisualElement: React.FC<{ blogId: string; name: string; prompt: string }> = ({ blogId, name, prompt }) => {
    // We use a useMemo to only create the lazy component once per name/blogId
    const Component = useMemo(() => {
        return React.lazy(() => import(`../visuals/${blogId}/${name}.tsx`).catch(() => {
            return { default: () => <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">Failed to load visual element: {name}</div> };
        }));
    }, [blogId, name]);

    return (
        <div className="my-10">
            <Suspense fallback={<div className="h-48 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl animate-pulse text-slate-400">Loading visual {name}...</div>}>
                <Component prompt={prompt} />
            </Suspense>
        </div>
    );
};

export const BlogRenderer: React.FC<BlogRendererProps> = ({ blogId, blocks }) => {
    const renderTextSegments = (elements: TextSegment[]) => {
        return elements.map((seg, idx) => {
            if (seg.style === 'bold') {
                return <strong key={idx}>{seg.text}</strong>;
            }
            if (seg.style === 'italic') {
                return <em key={idx}>{seg.text}</em>;
            }
            if (seg?.style?.startsWith('domain_') || seg?.style === 'citation') {
                return <TermTooltip key={idx} segment={seg} />;
            }
            return <span key={idx}>{seg.text}</span>;
        });
    };

    return (
        <section className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-wide text-slate-800 dark:text-slate-200 prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100">
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'main_heading':
                        return <h1 key={idx} id={slugify(block.text)} className="text-3xl md:text-4xl font-heading tracking-wide text-slate-900 dark:text-slate-100 mt-4 mb-6 scroll-mt-24">{block.text}</h1>;
                    case 'heading':
                        return (
                            <div key={idx} id={slugify(block.text)} className="mt-12 mb-6 scroll-mt-24 pt-6 border-t border-slate-800/60">
                                {(block.chapterNumber || block.badge) && (
                                    <div className="flex items-center gap-2 mb-2">
                                        {block.chapterNumber && (
                                            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                                                SECTION {block.chapterNumber}
                                            </span>
                                        )}
                                        {block.badge && (
                                            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                                                {block.badge}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 m-0 tracking-tight">
                                    {block.text}
                                </h2>
                                {block.subtitle && (
                                    <p className="text-sm md:text-base text-slate-400 mt-2 leading-relaxed m-0 font-normal">
                                        {block.subtitle}
                                    </p>
                                )}
                            </div>
                        );
                    case 'sub_heading':
                        return (
                            <div key={idx} id={slugify(block.text)} className="mt-8 mb-3 scroll-mt-24">
                                <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200 m-0 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                                    {block.text}
                                </h3>
                                {block.subtitle && (
                                    <p className="text-xs md:text-sm text-slate-400 mt-1 m-0 font-normal">
                                        {block.subtitle}
                                    </p>
                                )}
                            </div>
                        );
                    case 'paragraph':
                        return <p key={idx} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{renderTextSegments(block.elements)}</p>;
                    case 'tldr_banner':
                        return <TLDRBanner key={idx} block={block} />;
                    case 'highlight_box':
                        return <HighlightBox key={idx} block={block} />;
                    case 'stat_grid':
                        return <StatGrid key={idx} block={block} />;
                    case 'conclusion':
                        return <ConclusionCard key={idx} block={block} />;
                    case 'list':
                        return (
                            <ul key={idx} className="list-disc pl-6 mb-6 space-y-2">
                                {block.items.map((item, i) => (
                                    <li key={i}>{typeof item === 'string' ? item : renderTextSegments(item)}</li>
                                ))}
                            </ul>
                        );
                    case 'glossary':
                        return <GlossaryTable key={idx} terms={block.terms} />;
                    case 'callout':
                        return (
                            <ContextPanel key={idx} variant={block.variant}>
                                {block.elements ? renderTextSegments(block.elements) : block.text}
                            </ContextPanel>
                        );
                    case 'alert':
                        return (
                            <AlertBlock key={idx} variant={block.variant}>
                                {block.elements ? renderTextSegments(block.elements) : block.text}
                            </AlertBlock>
                        );
                    case 'code_snippet':
                        return <CodeSnippet key={idx} block={block} />;
                    case 'blockquote':
                    case 'pull_quote':
                        return <Blockquote key={idx} block={block} />;
                    case 'accordion':
                        return <Accordion key={idx} block={block} />;
                    case 'image_carousel':
                        return <ImageCarousel key={idx} block={block} />;
                    case 'video':
                        return <VideoPlayer key={idx} block={block} />;
                    case 'visual_element':
                    case 'svg':
                    case 'chart':
                    case 'diagram':
                        return <DynamicVisualElement key={idx} blogId={blogId} name={block.name} prompt={(block as any).prompt || ''} />;
                    default:
                        console.warn(`Unknown block type encountered: ${(block as any).type}`);
                        return null;
                }
            })}
        </section>
    );
};
