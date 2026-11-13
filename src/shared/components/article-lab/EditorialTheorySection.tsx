import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Award, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import type { AgenticRoleChapter } from '../../../devLushArea/agenticRoles/agenticRoleTypes';
import {
  extractTheoryCards,
  splitHighlightSegments,
  verifyPreviousIndexCompleted,
  type TheoryContent,
} from './conceptText';

interface AccordionBlock {
  id: string;
  badge: string;
  shortHeading: string;
  body: React.ReactNode;
}

export interface EditorialTheorySectionProps {
  chapter: AgenticRoleChapter;
  roleShortTitle?: string;
  roleTagline?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  compact?: boolean;
  onSaveTheory?: () => void;
  isTheorySaved?: boolean;
  visualDiagramSlot?: React.ReactNode;
  footerActionSlot?: React.ReactNode;
  theme?: {
    bgSoft: string;
    borderSoft: string;
    text: string;
  };
  className?: string;
}

function splitEditorialParagraphs(content: string, highlights?: string[]): string[] {
  const trimmed = (content || '').trim();
  if (!trimmed) return [];
  const explicit = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (explicit.length > 1) return explicit;

  // Split single multi-sentence block into breathable editorial paragraphs when safe for highlight phrases.
  const sentences = trimmed.split(/(?<=\.)\s+(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= 1) return [trimmed];
  const anyPhraseCrossesBoundary = (highlights || []).some((phrase) => /\.\s+/.test(phrase));
  if (anyPhraseCrossesBoundary) return [trimmed];

  if (sentences.length <= 3) return sentences;
  const mid = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, mid).join(' '), sentences.slice(mid).join(' ')];
}

export const EditorialTheorySection: React.FC<EditorialTheorySectionProps> = ({
  chapter,
  roleShortTitle,
  roleTagline,
  scrollContainerRef,
  compact = false,
  onSaveTheory,
  isTheorySaved = false,
  visualDiagramSlot,
  footerActionSlot,
  theme,
  className = '',
}) => {
  const articleBodyRef = useRef<HTMLDivElement>(null);
  const [uncoveredIds, setUncoveredIds] = useState<Set<string>>(() => new Set());
  const manuallyToggledRef = useRef<Set<string>>(new Set());

  const theory = (chapter.theory_content || {}) as TheoryContent;
  const paragraphs = useMemo(
    () => splitEditorialParagraphs(theory.content || '', theory.highlight),
    [theory.content, theory.highlight],
  );

  // Build sequential highlighted segments across all editorial paragraphs
  const { paragraphSegments } = useMemo(() => {
    let cursor = 0;
    const mapped = paragraphs.map((paragraph) => {
      const result = splitHighlightSegments(paragraph, theory.highlight, cursor);
      cursor = result.nextIndex;
      return result.segments;
    });
    return { paragraphSegments: mapped, totalTerms: cursor };
  }, [paragraphs, theory.highlight]);

  const cards = useMemo(() => extractTheoryCards(theory), [theory]);

  const accordionBlocks = useMemo<AccordionBlock[]>(() => {
    const blocks: AccordionBlock[] = [];
    if (theory.analogy) {
      blocks.push({
        id: `${chapter.labComponentId}-analogy`,
        badge: 'ANALOGY',
        shortHeading: 'Mental Model',
        body: <p>{theory.analogy}</p>,
      });
    }
    if (theory.practical_takeaway) {
      blocks.push({
        id: `${chapter.labComponentId}-takeaway`,
        badge: 'TAKEAWAY',
        shortHeading: 'Practical Takeaway',
        body: <p>{theory.practical_takeaway}</p>,
      });
    }
    if (theory.industry_case_study) {
      blocks.push({
        id: `${chapter.labComponentId}-casestudy`,
        badge: 'CASE STUDY',
        shortHeading: 'In the Field',
        body: <p>{theory.industry_case_study}</p>,
      });
    }
    if (chapter.critical_concepts?.length > 0) {
      blocks.push({
        id: `${chapter.labComponentId}-concepts`,
        badge: 'CONCEPTS',
        shortHeading: `Key Concepts (${chapter.critical_concepts.length})`,
        body: (
          <div className="space-y-4">
            {chapter.critical_concepts.map((concept) => (
              <div
                key={concept.concept}
                className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-900/70"
              >
                <h4 className="role-editorial-serif text-lg font-bold text-stone-900 dark:text-white">
                  {concept.concept}
                </h4>
                {concept.definition && (
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300 sm:text-base">
                    {concept.definition}
                  </p>
                )}
                {concept.elaboration && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400 sm:text-base">
                    {concept.elaboration}
                  </p>
                )}
                {concept.industry_application && (
                  <p className="mt-2.5 border-l-2 border-emerald-500 pl-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                    <span className="font-semibold text-stone-900 dark:text-white">In practice: </span>
                    {concept.industry_application}
                  </p>
                )}
              </div>
            ))}
          </div>
        ),
      });
    }
    return blocks;
  }, [chapter.critical_concepts, chapter.labComponentId, theory.analogy, theory.industry_case_study, theory.practical_takeaway]);

  // Reset accordion & manual toggles when chapter changes
  useEffect(() => {
    setUncoveredIds(new Set());
    manuallyToggledRef.current = new Set();
  }, [chapter.labComponentId]);

  // Sequential scroll-driven key term highlighter + scroll-triggered accordion reveal
  useEffect(() => {
    const bodyEl = articleBodyRef.current;
    if (!bodyEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;

    const updateHighlights = () => {
      const terms = bodyEl.querySelectorAll<HTMLElement>('.scroll-key-term');
      const hiddenBlocks = bodyEl.querySelectorAll<HTMLElement>('.scroll-hidden-block');
      const container = scrollContainerRef?.current || null;
      const scrollTop = container ? container.scrollTop : window.scrollY;
      const containerRect = container ? container.getBoundingClientRect() : null;
      const vh = container ? container.clientHeight : window.innerHeight;
      const viewportTop = containerRect ? containerRect.top : 0;
      const viewportBottom = containerRect ? containerRect.bottom : window.innerHeight;

      if (prefersReducedMotion) {
        terms.forEach((termEl) => termEl.style.setProperty('--hl-progress', '100%'));
        return;
      }

      if (terms.length > 0) {
        const firstTermRect = terms[0].getBoundingClientRect();
        const lastTermRect = terms[terms.length - 1].getBoundingClientRect();

        // Keep terms unhighlighted before scrolling starts if the container is at the very top
        // and the first term is below the upper reading zone.
        const isAtVeryTop = scrollTop <= 4 && firstTermRect.top > viewportTop + vh * 0.45;
        if (isAtVeryTop) {
          terms.forEach((t) => t.style.setProperty('--hl-progress', '0%'));
        } else {
          const firstTopRelative = firstTermRect.top - viewportTop;
          const lastBottomRelative = lastTermRect.bottom - viewportTop;
          const startPos = scrollTop + firstTopRelative - vh * 0.72;
          const endPos = scrollTop + lastBottomRelative - vh * 0.42;
          const totalSpan = Math.max(100, endPos - startPos);
          const midViewport = scrollTop + vh * 0.52;
          const overallRatio = Math.max(0, Math.min(1, (midViewport - startPos) / totalSpan));

          const totalTerms = terms.length;
          const step = 1 / totalTerms;

          terms.forEach((termEl, index) => {
            const startRatio = index * step;
            const endRatio = (index + 1) * step;
            let pct = 0;

            if (verifyPreviousIndexCompleted(index, overallRatio, totalTerms)) {
              if (overallRatio >= endRatio) {
                pct = 100;
              } else if (overallRatio > startRatio) {
                pct = Math.round(((overallRatio - startRatio) / step) * 100);
              }
            }

            termEl.style.setProperty('--hl-progress', `${pct}%`);
          });
        }
      }

      // Auto-open Analogy / Takeaway / Case Study / Concepts as they enter the reading viewport
      if (scrollTop > 4) {
        const newlyOpened: string[] = [];
        hiddenBlocks.forEach((blockEl) => {
          const id = blockEl.dataset.hiddenId;
          if (!id || manuallyToggledRef.current.has(id)) return;
          const rect = blockEl.getBoundingClientRect();
          if (rect.top < viewportBottom - vh * 0.12 && rect.bottom > viewportTop) {
            newlyOpened.push(id);
          }
        });
        if (newlyOpened.length > 0) {
          setUncoveredIds((prev) => {
            let changed = false;
            const next = new Set(prev);
            for (const id of newlyOpened) {
              if (!next.has(id)) {
                next.add(id);
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        }
      }
    };

    const scheduleUpdate = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHighlights);
    };

    updateHighlights();
    const scrollTarget = scrollContainerRef?.current || window;
    scrollTarget.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      scrollTarget.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [chapter.labComponentId, scrollContainerRef, paragraphSegments.length]);

  const toggleBlock = (id: string) => {
    manuallyToggledRef.current.add(id);
    setUncoveredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deck = theory.practical_takeaway || roleTagline || chapter.day_title;

  return (
    <article
      className={`role-fade-in min-w-0 rounded-3xl border border-stone-200/90 bg-white text-stone-900 dark:border-stone-800 dark:bg-[#121212] dark:text-stone-100 ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-10 lg:p-12'
      } ${className}`}
    >
      {/* Category Kicker + Save Action */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div
          className={`flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
            theme?.text || 'text-emerald-700 dark:text-emerald-400'
          }`}
        >
          <span>{(roleShortTitle || chapter.roleDomain).toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>{chapter.estimatedMinutes || 25} MIN LESSON</span>
        </div>

        {onSaveTheory && (
          <button
            type="button"
            onClick={onSaveTheory}
            aria-pressed={isTheorySaved}
            className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              isTheorySaved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            {isTheorySaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
            {isTheorySaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      {/* Medium-Style Large Serif Headline */}
      <h2
        className={`role-editorial-serif font-bold tracking-tight text-stone-900 dark:text-white ${
          compact
            ? 'text-2xl leading-[1.18] mb-3'
            : 'text-3xl sm:text-5xl leading-[1.12] mb-5 sm:mb-6'
        }`}
      >
        {theory.title || chapter.chapter_title}
      </h2>

      {/* Editorial Subtitle / Deck */}
      {deck && (
        <p
          className={`role-editorial-sans font-normal text-stone-500 dark:text-stone-400 leading-relaxed border-b border-stone-200/80 dark:border-stone-800/80 ${
            compact ? 'text-base pb-5 mb-6' : 'text-lg sm:text-2xl pb-7 mb-8 sm:pb-9 sm:mb-10'
          }`}
        >
          {deck}
        </p>
      )}

      {/* Dynamic Lesson Body with Scroll-Driven Key Terms & Short Typo Accordions */}
      <div
        ref={articleBodyRef}
        className={`role-editorial-serif text-stone-800 dark:text-stone-200 w-full ${
          compact ? 'space-y-5' : 'space-y-7 sm:space-y-9'
        }`}
      >
        {paragraphSegments.map((segments, pIdx) => (
          <p
            key={pIdx}
            className={`role-article-paragraph ${compact ? 'role-article-paragraph--compact' : ''}`}
          >
            {segments.map((seg, sIdx) =>
              seg.highlightIndex !== null ? (
                <span
                  key={sIdx}
                  data-hl-index={seg.highlightIndex}
                  className="scroll-key-term"
                >
                  {seg.text}
                </span>
              ) : (
                <React.Fragment key={sIdx}>{seg.text}</React.Fragment>
              ),
            )}
          </p>
        ))}

        {accordionBlocks.map((block) => {
          const isOpen = uncoveredIds.has(block.id);
          return (
            <div
              key={block.id}
              data-hidden-id={block.id}
              className={`scroll-hidden-block border-l-4 pl-4 sm:pl-6 py-2 transition-colors w-full ${
                isOpen
                  ? 'border-emerald-600 dark:border-emerald-500'
                  : 'border-stone-300 dark:border-stone-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleBlock(block.id)}
                aria-expanded={isOpen}
                className="w-full text-left flex items-start sm:items-center justify-between gap-3 group py-1.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap min-w-0">
                  <span
                    className={`role-editorial-sans text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 shrink-0 ${
                      theme?.text || 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {block.badge}
                  </span>
                  <span
                    className={`role-editorial-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors underline decoration-stone-300 dark:decoration-stone-700 decoration-dotted underline-offset-4 break-words ${
                      compact ? 'text-lg' : 'text-xl sm:text-2xl'
                    }`}
                  >
                    {block.shortHeading}
                  </span>
                </div>
                <span
                  className={`text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 shrink-0 mt-1 sm:mt-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </button>
              <div className={`hidden-section-content ${isOpen ? 'open' : ''}`}>
                <div className="hidden-section-inner">
                  <div
                    className={`pt-3 pb-1 role-editorial-sans text-stone-600 dark:text-stone-400 leading-relaxed break-words ${
                      compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
                    }`}
                  >
                    {block.body}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contextual Visual Diagram Container */}
      {visualDiagramSlot && (
        <figure
          aria-label="Contextual Visual Diagram"
          className="mt-10 sm:mt-14 rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/60 overflow-hidden"
        >
          <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Contextual Visual Diagram</span>
            </span>
            <span className="role-editorial-serif text-sm sm:text-base italic text-stone-500 dark:text-stone-400">
              {chapter.chapter_title}
            </span>
          </div>
          <div className="p-3 sm:p-5">{visualDiagramSlot}</div>
        </figure>
      )}

      {/* 3 Text Cards Section (card_a, card_b, card_c, card_titles) */}
      {cards.length > 0 && (
        <section
          aria-label="Key lesson takeaways"
          className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-stone-200/80 dark:border-stone-800/80"
        >
          <div
            className={`grid w-full ${
              compact ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7'
            }`}
          >
            {cards.map((card) => (
              <div
                key={card.key}
                className="p-5 sm:p-7 rounded-3xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/90 dark:border-stone-800 flex flex-col gap-2.5"
              >
                <h3
                  className={`role-editorial-serif font-bold text-stone-900 dark:text-white leading-snug ${
                    compact ? 'text-xl' : 'text-xl sm:text-2xl'
                  }`}
                >
                  {card.heading}
                </h3>
                <p
                  className={`role-editorial-sans text-stone-600 dark:text-stone-400 leading-relaxed ${
                    compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  }`}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Classic Medium Three-Dot Editorial Divider */}
      <div
        className="py-8 sm:py-12 flex justify-center items-center gap-4 text-stone-400 dark:text-stone-600 select-none"
        aria-hidden="true"
      >
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-current" />
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-current" />
        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-current" />
      </div>

      {footerActionSlot}
    </article>
  );
};

export default EditorialTheorySection;
