export type TextStyle = 'normal' | 'bold' | 'italic' | 'domain_legal' | 'domain_technical' | 'domain_financial' | 'citation';

export interface SEO {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    schemaMarkup?: string;
}

export interface TextSegment {
    text: string;
    style: TextStyle;
    definition?: string; // Used for tooltips on domain terms
    link?: string; // Used for citations or external links
}

export interface GlossaryTerm {
    term: string;
    definition: string;
}

export interface BaseBlock {
    type: string;
}

export interface HeadingBlock extends BaseBlock {
    type: 'main_heading' | 'heading' | 'sub_heading';
    text: string;
    subtitle?: string;
    chapterNumber?: string;
    badge?: string;
    accentColor?: string;
}

export interface ParagraphBlock extends BaseBlock {
    type: 'paragraph';
    elements: TextSegment[];
}

export interface ListBlock extends BaseBlock {
    type: 'list';
    items: (string | TextSegment[])[];
}

export interface GlossaryBlock extends BaseBlock {
    type: 'glossary';
    terms: GlossaryTerm[];
}

export interface CalloutBlock extends BaseBlock {
    type: 'callout';
    variant: 'history' | 'news';
    text?: string;
    elements?: TextSegment[];
}

export interface AlertBlock extends BaseBlock {
    type: 'alert';
    variant: 'precautionary' | 'extreme';
    text?: string;
    elements?: TextSegment[];
}

// --- NEW PREMIUM BLOCKS ---

export interface HighlightBoxBlock extends BaseBlock {
    type: 'highlight_box';
    title: string;
    badge?: string;
    variant?: 'indigo' | 'rose' | 'emerald' | 'amber';
    points: (string | TextSegment[])[];
}

export interface ConclusionBlock extends BaseBlock {
    type: 'conclusion';
    title: string;
    summary: string;
    keyTakeaways?: string[];
    cta?: { text: string; link: string };
}

export interface StatItem {
    value: string;
    label: string;
    change?: string;
}

export interface StatGridBlock extends BaseBlock {
    type: 'stat_grid';
    stats: StatItem[];
}

export interface TLDRBannerBlock extends BaseBlock {
    type: 'tldr_banner';
    title?: string;
    text: string;
    highlights?: string[];
}

export interface ImageCarouselBlock extends BaseBlock {
    type: 'image_carousel';
    images: { url: string; alt?: string; caption?: string }[];
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    videoUrl: string;
    posterUrl?: string;
    caption?: string;
}

export interface CodeSnippetBlock extends BaseBlock {
    type: 'code_snippet';
    code: string;
    language: string;
    filename?: string;
}

export interface BlockquoteBlock extends BaseBlock {
    type: 'blockquote' | 'pull_quote';
    text?: string;
    elements?: TextSegment[];
    cite?: string;
}

export interface AccordionItem {
    title: string;
    content: TextSegment[] | string;
}

export interface AccordionBlock extends BaseBlock {
    type: 'accordion';
    items: AccordionItem[];
}

export interface VisualElementBlock extends BaseBlock {
    type: 'visual_element';
    name: string;
    prompt: string;
}

export interface SVGBlock extends BaseBlock {
    type: 'svg';
    name: string;
    content?: string;
}

export interface ChartBlock extends BaseBlock {
    type: 'chart';
    name: string;
    data?: any;
}

export interface DiagramBlock extends BaseBlock {
    type: 'diagram';
    name: string;
    code?: string;
}

// Discriminated union for all possible blocks
export type BlogBlock =
    | HeadingBlock
    | ParagraphBlock
    | ListBlock
    | GlossaryBlock
    | CalloutBlock
    | AlertBlock
    | HighlightBoxBlock
    | ConclusionBlock
    | StatGridBlock
    | TLDRBannerBlock
    | ImageCarouselBlock
    | VideoBlock
    | CodeSnippetBlock
    | BlockquoteBlock
    | AccordionBlock
    | VisualElementBlock
    | SVGBlock
    | ChartBlock
    | DiagramBlock;

export interface Citation {
    id: string;
    text: string;
    link?: string;
}

export interface Author {
    name: string;
    avatar?: string;
    role?: string;
    bio?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
    estimated_read_time?: string;
    author?: Author;
    body: BlogBlock[];
    citations?: Citation[];
    seo?: SEO;
}
