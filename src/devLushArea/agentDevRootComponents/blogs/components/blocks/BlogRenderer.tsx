import React from 'react';
import { BlogBlock, TextSegment } from '../../types/types';

interface BlogRendererProps {
    blocks: BlogBlock[];
}

export const BlogRenderer: React.FC<BlogRendererProps> = ({ blocks }) => {
    const renderTextSegments = (elements: TextSegment[]) => {
        return elements.map((seg, idx) => {
            if (seg.style === 'bold') {
                return <strong key={idx}>{seg.text}</strong>;
            }
            if (seg.style === 'italic') {
                return <em key={idx}>{seg.text}</em>;
            }
            return <span key={idx}>{seg.text}</span>;
        });
    };

    return (
        <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-wide text-slate-800">
            {blocks.map((block, idx) => {
                if (block.type === 'main_heading') {
                    return <h1 key={idx} className="text-4xl font-heading tracking-wide text-slate-900 mt-2 mb-6">{block.text}</h1>;
                }
                if (block.type === 'heading') {
                    return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{block.text}</h2>;
                }
                if (block.type === 'paragraph' && block.elements) {
                    return <p key={idx} className="mb-4 leading-relaxed">{renderTextSegments(block.elements)}</p>;
                }
                if (block.type === 'list' && block.items) {
                    return (
                        <ul key={idx} className="list-disc pl-6 mb-6 space-y-2">
                            {block.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    );
                }
                return null;
            })}
        </div>
    );
};
