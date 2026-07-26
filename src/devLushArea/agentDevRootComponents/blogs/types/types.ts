export type TextStyle = 'normal' | 'bold' | 'italic';

export interface TextSegment {
    text: string;
    style: TextStyle;
}

export interface BlogBlock {
    type: 'main_heading' | 'heading' | 'paragraph' | 'list';
    elements?: TextSegment[]; 
    text?: string;            
    items?: string[];         
}

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
    body: BlogBlock[];
}
