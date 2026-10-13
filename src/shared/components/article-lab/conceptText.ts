import type { AgenticRoleChapter, AgenticRoleConcept } from '../../../devLushArea/agenticRoles/agenticRoleTypes';

interface TheoryContent {
  title: string;
  content: string;
  practical_takeaway?: string;
  analogy?: string;
}

export interface ArticleIntro {
  title: string;
  content: string;
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
  sections: ArticleSection[];
}

/**
 * Pure adapter: transforms AgenticRoleChapter into article-ready blocks.
 * Zero side effects, fully unit-testable.
 */
export function chapterToArticleBlocks(chapter: AgenticRoleChapter): ArticleBlocks {
  const theory: TheoryContent = chapter.theory_content as TheoryContent || {} as TheoryContent;

  const intro: ArticleIntro = {
    title: theory.title || chapter.chapter_title,
    content: theory.content || '',
  };

  const callouts: ArticleCallout[] = [];
  if (theory.analogy) {
    callouts.push({ type: 'analogy', label: 'Mental model', content: theory.analogy });
  }
  if (theory.practical_takeaway) {
    callouts.push({ type: 'takeaway', label: 'Practical takeaway', content: theory.practical_takeaway });
  }
  // industry_case_study is on AgenticRoleExercise, not on AgenticRoleChapter
  // Skip for now since it's not on the chapter type

  const sections: ArticleSection[] = chapter.critical_concepts.map((concept: AgenticRoleConcept, index: number) => ({
    number: index + 1,
    concept: concept.concept,
    definition: concept.definition,
    elaboration: concept.elaboration,
    industryApplication: concept.industry_application,
  }));

  return { intro, callouts, sections };
}

/**
 * Validates that a chapter produces usable article content.
 * Returns true if both intro and at least one section exist.
 */
export function hasArticleContent(chapter: AgenticRoleChapter): boolean {
  const blocks = chapterToArticleBlocks(chapter);
  return Boolean(blocks.intro.content?.trim() || blocks.intro.title?.trim()) && blocks.sections.length > 0;
}