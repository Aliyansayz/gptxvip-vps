import type { AgenticRoleChapter, AgenticRoleConcept } from '../../../devLushArea/agenticRoles/agenticRoleTypes';

export type CardTitles = string[] | { card_a?: string; card_b?: string; card_c?: string };

export interface TheoryContent {
  title: string;
  content: string;
  practical_takeaway?: string;
  analogy?: string;
  industry_case_study?: string;
  card_a?: string;
  card_b?: string;
  card_c?: string;
  card_titles?: CardTitles;
  highlight?: string[];
}

export interface TheoryCard {
  key: 'card_a' | 'card_b' | 'card_c';
  heading: string;
  text: string;
}

export interface HighlightSegment {
  text: string;
  highlightIndex: number | null;
}

export interface ArticleIntro {
  title: string;
  content: string;
  highlight?: string[];
}

export interface ArticleCallout {
  type: 'analogy' | 'takeaway' | 'caseStudy';
  label: string;
  content: string;
}

export interface ArticleSection {
  number: number;
  concept: string;
  definition?: string;
  elaboration?: string;
  industryApplication?: string;
}

export interface ArticleBlocks {
  intro: ArticleIntro;
  callouts: ArticleCallout[];
  cards: TheoryCard[];
  sections: ArticleSection[];
}

/** Resolve card_a, card_b, card_c and card_titles into an ordered list of up to 3 text cards. */
export function extractTheoryCards(theory?: TheoryContent | null): TheoryCard[] {
  if (!theory) return [];
  const titles = theory.card_titles;
  const getTitle = (index: number, key: 'card_a' | 'card_b' | 'card_c', fallback: string): string => {
    if (Array.isArray(titles)) return titles[index]?.trim() || fallback;
    if (titles && typeof titles === 'object') return titles[key]?.trim() || fallback;
    return fallback;
  };

  const entries: Array<{ key: 'card_a' | 'card_b' | 'card_c'; text?: string; fallback: string; index: number }> = [
    { key: 'card_a', text: theory.card_a, fallback: '1. Core Principle', index: 0 },
    { key: 'card_b', text: theory.card_b, fallback: '2. Operational Guardrail', index: 1 },
    { key: 'card_c', text: theory.card_c, fallback: '3. Business Outcome', index: 2 },
  ];

  return entries
    .filter((entry) => Boolean(entry.text?.trim()))
    .map((entry) => ({
      key: entry.key,
      heading: getTitle(entry.index, entry.key, entry.fallback),
      text: entry.text!.trim(),
    }));
}

/**
 * Split body text into plain and highlighted segments (longest phrase match first, case-insensitive).
 * Sequential highlight indices start at `startIndex` and return the next index for multi-paragraph continuity.
 */
export function splitHighlightSegments(
  text: string,
  highlights?: string[],
  startIndex = 0,
): { segments: HighlightSegment[]; nextIndex: number } {
  const cleaned = (highlights || []).map((item) => item.trim()).filter(Boolean);
  if (!text || cleaned.length === 0) {
    return { segments: text ? [{ text, highlightIndex: null }] : [], nextIndex: startIndex };
  }

  const escaped = [...new Set(cleaned)]
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  let nextIndex = startIndex;

  for (const match of text.matchAll(pattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), highlightIndex: null });
    }
    segments.push({ text: match[0], highlightIndex: nextIndex });
    nextIndex += 1;
    cursor = matchIndex + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlightIndex: null });
  }

  return { segments, nextIndex };
}

/** Strict sequential check: term `i` cannot begin highlighting until term `i - 1` reaches 100%. */
export function verifyPreviousIndexCompleted(
  currentIndex: number,
  currentRatio: number,
  totalTerms: number,
): boolean {
  if (currentIndex === 0) return true;
  if (totalTerms <= 0) return false;
  const step = 1 / totalTerms;
  return currentRatio >= currentIndex * step;
}

/**
 * Pure adapter: transforms AgenticRoleChapter into article-ready blocks.
 * Zero side effects, fully unit-testable.
 */
export function chapterToArticleBlocks(chapter: AgenticRoleChapter): ArticleBlocks {
  const theory: TheoryContent = (chapter.theory_content as TheoryContent) || ({} as TheoryContent);

  const intro: ArticleIntro = {
    title: theory.title || chapter.chapter_title,
    content: theory.content || '',
    highlight: theory.highlight,
  };

  const callouts: ArticleCallout[] = [];
  if (theory.analogy) {
    callouts.push({ type: 'analogy', label: 'Mental model', content: theory.analogy });
  }
  if (theory.practical_takeaway) {
    callouts.push({ type: 'takeaway', label: 'Practical takeaway', content: theory.practical_takeaway });
  }
  if (theory.industry_case_study) {
    callouts.push({ type: 'caseStudy', label: 'In the field', content: theory.industry_case_study });
  }

  const cards = extractTheoryCards(theory);

  const sections: ArticleSection[] = chapter.critical_concepts.map((concept: AgenticRoleConcept, index: number) => ({
    number: index + 1,
    concept: concept.concept,
    definition: concept.definition,
    elaboration: concept.elaboration,
    industryApplication: concept.industry_application,
  }));

  return { intro, callouts, cards, sections };
}

/**
 * Validates that a chapter produces usable article content.
 * Returns true if both intro and at least one section exist.
 */
export function hasArticleContent(chapter: AgenticRoleChapter): boolean {
  const blocks = chapterToArticleBlocks(chapter);
  return Boolean(blocks.intro.content?.trim() || blocks.intro.title?.trim()) && blocks.sections.length > 0;
}