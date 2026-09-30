import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Search, Star, X } from 'lucide-react';
import {
  AgenticRoleDefinition,
  AgenticRoleChapter,
  Difficulty,
  RoleDomain,
} from '../agenticRoleTypes';
import DifficultyBadge from './components/DifficultyBadge';
import { getRoleTheme } from '../agenticThemeHelpers';
import { useFavorites } from '../../agentDevRootComponents/FavoritesContext';
import { StatePanel } from '../../../shared/components/StatePanel';

interface SearchResultItem {
  role: AgenticRoleDefinition;
  chapter: AgenticRoleChapter;
  matchedField: 'title' | 'concept' | 'scenario' | 'role';
  matchedValue: string;
}

interface AgenticRolesSearchViewProps {
  roles: AgenticRoleDefinition[];
  onSelectChapter: (roleId: string, chapter: AgenticRoleChapter) => void;
  onClose: () => void;
}

const difficultyOptions: Array<Difficulty | 'all'> = ['all', 'easy', 'medium', 'hard'];

export const AgenticRolesSearchView: React.FC<AgenticRolesSearchViewProps> = ({
  roles,
  onSelectChapter,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<RoleDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  let favoritesCtx: ReturnType<typeof useFavorites> | null = null;
  try {
    favoritesCtx = useFavorites();
  } catch {
    // Search remains available if embedded outside the saved-items provider.
  }

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    for (const role of roles) {
      if (selectedDomain !== 'all' && role.roleDomain !== selectedDomain) continue;

      for (const chapter of role.chapters) {
        if (selectedDifficulty !== 'all' && chapter.difficulty !== selectedDifficulty) continue;

        if (!normalizedQuery) {
          items.push({ role, chapter, matchedField: 'role', matchedValue: role.title });
          continue;
        }

        const titleMatch = `${chapter.day_title} ${chapter.chapter_title}`.toLowerCase().includes(normalizedQuery);
        const conceptMatch = chapter.critical_concepts.find((concept) =>
          concept.concept.toLowerCase().includes(normalizedQuery),
        );
        const scenarioMatch = chapter.interactive_questions.find((exercise) =>
          `${exercise.prompt} ${exercise.question} ${exercise.title}`.toLowerCase().includes(normalizedQuery),
        );
        const theoryMatch = chapter.theory_content.content.toLowerCase().includes(normalizedQuery);
        const tagMatch = chapter.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

        if (titleMatch) {
          items.push({ role, chapter, matchedField: 'title', matchedValue: chapter.chapter_title });
        } else if (conceptMatch) {
          items.push({ role, chapter, matchedField: 'concept', matchedValue: conceptMatch.concept });
        } else if (scenarioMatch || theoryMatch || tagMatch) {
          items.push({
            role,
            chapter,
            matchedField: 'scenario',
            matchedValue: scenarioMatch ? 'Case scenario' : theoryMatch ? 'Role theory' : 'Case capability',
          });
        } else if (role.title.toLowerCase().includes(normalizedQuery)) {
          items.push({ role, chapter, matchedField: 'role', matchedValue: role.title });
        }
      }
    }

    return items;
  }, [roles, query, selectedDomain, selectedDifficulty]);

  const toggleFavorite = (chapter: AgenticRoleChapter, roleId: string) => {
    if (!favoritesCtx) return;
    const isFavorite = favoritesCtx.favorites.some((favorite) => favorite.id === chapter.labComponentId);
    if (isFavorite) {
      favoritesCtx.removeFavorite(chapter.labComponentId);
    } else {
      favoritesCtx.addFavorite({
        id: chapter.labComponentId,
        type: 'agentic_role_lab',
        title: `${chapter.day_title} (${chapter.course})`,
        courseId: roleId,
      });
    }
  };

  return (
    <div role="search" aria-label="Explore Agentic Role cases" className="min-h-full w-full bg-slate-50 dark:bg-black">
      <div className="p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> Roles
              </button>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Agentic Roles · Explore</p>
              <h1 className="mt-1 font-heading text-2xl font-bold tracking-wide text-slate-900 dark:text-white sm:text-4xl">Find a case to work through</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Search role stories, decisions, tools, and concepts across every case file.
              </p>
            </div>
            <p aria-live="polite" className="shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {results.length} {results.length === 1 ? 'case' : 'cases'}
            </p>
          </header>

          <section aria-label="Search and filter cases" className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-7 sm:p-4">
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-950">
              <Search className="h-4 w-4 shrink-0 text-indigo-500" />
              <input
                autoFocus
                aria-label="Search role cases, scenarios, and concepts"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search scenarios, case titles, tools, concepts..."
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Role</span>
                {[
                  { id: 'all', label: 'All roles' },
                  ...roles.map((role) => ({ id: role.roleDomain, label: role.shortTitle })),
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selectedDomain === option.id}
                    onClick={() => setSelectedDomain(option.id as RoleDomain | 'all')}
                    className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${selectedDomain === option.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Difficulty</span>
                {difficultyOptions.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    aria-pressed={selectedDifficulty === difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`min-h-9 rounded-full border px-3 text-xs font-bold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${selectedDifficulty === difficulty ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500'}`}
                  >
                    {difficulty === 'all' ? 'Any level' : difficulty}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {!query && <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Suggested role filters"><span className="mr-1 text-xs font-semibold text-slate-500">Try a role:</span>{roles.slice(0, 4).map(role => <button key={role.id} type="button" onClick={() => { setSelectedDomain(role.roleDomain); setQuery(''); }} className="min-h-9 rounded-full border border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{role.shortTitle}</button>)}</div>}

          {results.length === 0 ? (
            <StatePanel title="No cases match those filters" description="Try a broader search or clear the filters to see all available role scenarios." actionLabel="Clear filters" onAction={() => { setQuery(''); setSelectedDomain('all'); setSelectedDifficulty('all'); }} />
          ) : (
            <div className="grid min-w-0 max-w-4xl grid-cols-1 gap-3 sm:gap-4" aria-label="Role case results">
              {results.map(({ role, chapter, matchedField, matchedValue }) => {
                const theme = getRoleTheme(role.roleDomain);
                const isFavorite = favoritesCtx?.favorites.some((favorite) => favorite.id === chapter.labComponentId) || false;
                const storyBrief = chapter.interactive_questions[0]?.prompt || chapter.theory_content.practical_takeaway || chapter.chapter_title;

                return (
                  <article key={`${role.id}-${chapter.labComponentId}`} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}>
                        {role.shortTitle} · Case {String(chapter.day).padStart(2, '0')}
                      </span>
                      <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
                    </div>
                    <h2 className="mt-3 font-heading text-lg font-bold leading-6 text-slate-900 dark:text-white">{chapter.chapter_title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600 dark:text-slate-300">{storyBrief}</p>
                    {matchedField !== 'role' && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Match: <span className="font-semibold text-slate-700 dark:text-slate-200">{matchedValue}</span></p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {chapter.critical_concepts.slice(0, 3).map((concept) => (
                        <span key={concept.concept} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{concept.concept}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:mt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> {chapter.estimatedMinutes || 25} min
                      </span>
                      <div className="flex items-center gap-2">
                        {favoritesCtx && (
                          <button
                            type="button"
                            onClick={() => toggleFavorite(chapter, role.id)}
                            aria-label={isFavorite ? `Remove ${chapter.chapter_title} from saved cases` : `Save ${chapter.chapter_title}`}
                            aria-pressed={isFavorite}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isFavorite ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                          >
                            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectChapter(role.id, chapter)}
                          aria-label={`Open ${role.title}: ${chapter.chapter_title}`}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r px-3 text-xs font-bold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${theme.gradientFrom} ${theme.gradientTo}`}
                        >
                          Open case <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgenticRolesSearchView;
