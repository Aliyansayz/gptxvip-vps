import React, { Suspense, useMemo } from 'react';
import { BlogBlock, TextSegment } from '../../types/types';
import { TermTooltip, GlossaryTable, ContextPanel, AlertBlock } from './BlogInteractiveElements';
import { CodeSnippet, Blockquote, Accordion, ImageCarousel, VideoPlayer } from './PremiumBlocks';
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
            if (seg.style.startsWith('domain_') || seg.style === 'citation') {
                return <TermTooltip key={idx} segment={seg} />;
            }
            return <span key={idx}>{seg.text}</span>;
        });
    };

    return (
        <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-wide text-slate-800">
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'main_heading':
                        return <h1 key={idx} id={slugify(block.text)} className="text-4xl font-heading tracking-wide text-slate-900 mt-2 mb-6 scroll-mt-24">{block.text}</h1>;
                    case 'heading':
                        return <h2 key={idx} id={slugify(block.text)} className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">{block.text}</h2>;
                    case 'paragraph':
                        return <p key={idx} className="mb-4 leading-relaxed">{renderTextSegments(block.elements)}</p>;
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
                        return <DynamicVisualElement key={idx} blogId={blogId} name={block.name} prompt={block.prompt} />;
                    default:
                        console.warn(`Unknown block type encountered: ${(block as any).type}`);
                        return null;
                }
            })}
        </div>
    );
};
