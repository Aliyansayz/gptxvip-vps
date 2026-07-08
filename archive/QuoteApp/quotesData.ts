
export type ThemeVariant = 'teal' | 'sunset' | 'midnight' | 'forest';

export interface QuoteData {
    text: string;
    author: string;
    category: string;
    theme: string; // Changed to string to match JSON import
}

import feminismQuotes from './feminismQuotes.json';

// Cast the imported JSON to the correct type to ensure theme is treated as ThemeVariant where needed
export const QUOTES: QuoteData[] = feminismQuotes as QuoteData[];
