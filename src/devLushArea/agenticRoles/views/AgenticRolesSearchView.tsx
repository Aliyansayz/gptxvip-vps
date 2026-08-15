import React, { useState, useMemo } from 'react';
import {
  AgenticRoleDefinition,
  AgenticRoleChapter,
  Difficulty,
  RoleDomain
} from '../agenticRoleTypes';
import DifficultyBadge from './components/DifficultyBadge';
import {
  Search,
  X,
  ArrowRight,
  Layers,
  Clock,
  Sparkles,
  Star,
  Filter,
  Check
} from 'lucide-react';
import { getRoleTheme } from '../agenticThemeHelpers';
import { useFavorites } from '../../agentDevRootComponents/FavoritesContext';
import { toast } from 'sonner';

interface SearchResultItem {
  role: AgenticRoleDefinition;
  chapter: AgenticRoleChapter;
  matchedField: 'title' | 'concept' | 'tag' | 'domain' | 'description';
  matchedValue: string;
}

interface AgenticRolesSearchViewProps {
  roles: AgenticRoleDefinition[];
  onSelectChapter: (roleId: string, chapter: AgenticRoleChapter) => void;
  onClose: () => void;
}

export const AgenticRolesSearchView: React.FC<AgenticRolesSearchViewProps> = ({
  roles,
  onSelectChapter,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<RoleDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  let favoritesCtx: ReturnType<typeof useFavorites> | null = null;
  try {
    favoritesCtx = useFavorites();
  } catch (e) {
    // Context fallback
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    for (const role of roles) {
      if (selectedDomain !== 'all' && role.roleDomain !== selectedDomain) {
        continue;
      }

      for (const chapter of role.chapters) {
        if (selectedDifficulty !== 'all' && chapter.difficulty !== selectedDifficulty) {
          continue;
        }

        if (!q) {
          // If no query string, return all filtered by domain/difficulty
          items.push({
            role,
            chapter,
            matchedField: 'domain',
            matchedValue: role.title
          });
          continue;
        }

        if (chapter.day_title.toLowerCase().includes(q) || chapter.chapter_title.toLowerCase().includes(q)) {
          items.push({
            role,
            chapter,
            matchedField: 'title',
            matchedValue: chapter.day_title
          });
        } else if (chapter.critical_concepts?.some((c) => (c.concept || '').toLowerCase().includes(q))) {
          const match = chapter.critical_concepts.find((c) => (c.concept || '').toLowerCase().includes(q));
          items.push({
            role,
            chapter,
            matchedField: 'concept',
            matchedValue: match?.concept || ''
          });
        } else if (chapter.theory_content?.content?.toLowerCase().includes(q)) {
          items.push({
            role,
            chapter,
            matchedField: 'description',
            matchedValue: 'Found in theoretical framework'
          });
        } else if (role.title.toLowerCase().includes(q)) {
          items.push({
            role,
            chapter,
            matchedField: 'domain',
            matchedValue: role.title
          });
        }
      }
    }

    return items;
  }, [roles, query, selectedDomain, selectedDifficulty]);

  const toggleFavorite = (e: React.MouseEvent, chapter: AgenticRoleChapter, roleId: string) => {
    e.stopPropagation();
    if (!favoritesCtx) return;

    const isFav = favoritesCtx.favorites.some((f) => f.id === chapter.labComponentId);
    if (isFav) {
      favoritesCtx.removeFavorite(chapter.labComponentId);
    } else {
      favoritesCtx.addFavorite({
        id: chapter.labComponentId,
        type: 'devlush_lab',
        title: `${chapter.day_title} (${chapter.course})`,
        courseId: roleId
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Search Input Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 30 activities, algorithms, theories, concepts..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Multi-Dimensional Filter Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 space-y-2 text-xs font-mono">
          {/* Domain Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-slate-500 text-[11px] mr-1">Role:</span>
            {[
              { id: 'all', label: 'All Roles' },
              { id: 'seo', label: 'SEO' },
              { id: 'accountant', label: 'Accounting' },
              { id: 'commerce', label: 'Commerce' },
              { id: 'recommendation', label: 'Recommender' },
              { id: 'preprocessing', label: 'Preprocessing' },
              { id: 'visualization', label: 'Visualization' }
            ].map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDomain === domain.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {domain.label}
              </button>
            ))}
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px] mr-1">Difficulty:</span>
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer text-[11px] ${
                    selectedDifficulty === diff
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <span className="text-slate-400 text-[11px]">
              {results.length} {results.length === 1 ? 'activity' : 'activities'} found
            </span>
          </div>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {results.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-white font-bold">No matching activities found</p>
              <p>Try broadening your search query or clearing the domain filters.</p>
            </div>
          ) : (
            results.map((res, idx) => {
              const theme = getRoleTheme(res.role.roleDomain);
              const isFav = favoritesCtx?.favorites.some((f) => f.id === res.chapter.labComponentId) || false;

              return (
                <div
                  key={idx}
                  onClick={() => onSelectChapter(res.role.id, res.chapter)}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          backgroundColor: `rgba(${theme.spotlightRgb}, 0.15)`,
                          color: theme.accentHex
                        }}
                      >
                        {res.role.title} • DAY 0{res.chapter.day}
                      </span>
                      <DifficultyBadge difficulty={res.chapter.difficulty} size="sm" />
                      <span className="text-[10px] text-slate-500 font-mono">
                        {res.chapter.estimatedMinutes || 25}m
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {res.chapter.day_title}
                    </div>

                    {res.matchedField === 'concept' && (
                      <div className="text-xs text-slate-400">
                        Matched Capability: <span className="text-blue-300 font-mono font-semibold">{res.matchedValue}</span>
                      </div>
                    )}

                    {/* Concept tags */}
                    {res.chapter.critical_concepts && res.chapter.critical_concepts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {res.chapter.critical_concepts.slice(0, 3).map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono"
                          >
                            {c.concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Favorite Star Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, res.chapter, res.role.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AgenticRolesSearchView;
