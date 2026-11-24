import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  PenSquare,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { BlogArticleDto } from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';
import { MediumArticleEditor } from './MediumArticleEditor';

interface AdminBlogPanelProps {
  defaultAuthorName: string;
  startCreating?: boolean;
  onCreatedHandled?: () => void;
  onArticlesChanged?: () => void;
}

export const AdminBlogPanel: React.FC<AdminBlogPanelProps> = ({
  defaultAuthorName,
  startCreating = false,
  onCreatedHandled,
  onArticlesChanged,
}) => {
  const [articles, setArticles] = useState<BlogArticleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<BlogArticleDto | 'new' | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const list = await cmsApiClient.listAdminArticles({
        status: statusFilter,
        search: searchQuery.trim() || undefined,
      });
      setArticles(list);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    if (startCreating) {
      setEditingArticle('new');
      onCreatedHandled?.();
    }
  }, [startCreating, onCreatedHandled]);

  const handleTogglePublish = async (article: BlogArticleDto) => {
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await cmsApiClient.updateArticle(article.id, { status: nextStatus });
      toast.success(
        nextStatus === 'published'
          ? `Published "${article.title}"`
          : `Moved "${article.title}" to drafts`
      );
      await loadArticles();
      onArticlesChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async (article: BlogArticleDto) => {
    if (!window.confirm(`Delete "${article.title}" permanently from Cloudflare D1?`)) {
      return;
    }
    setDeletingId(article.id);
    try {
      await cmsApiClient.deleteArticle(article.id);
      toast.success('Article deleted');
      await loadArticles();
      onArticlesChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (editingArticle !== null) {
    return (
      <MediumArticleEditor
        initialArticle={editingArticle === 'new' ? null : editingArticle}
        defaultAuthorName={defaultAuthorName}
        onBack={() => {
          setEditingArticle(null);
          void loadArticles();
          onArticlesChanged?.();
        }}
        onSaved={(saved) => {
          setEditingArticle(saved);
          onArticlesChanged?.();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#d8ff38]">
            /blog Publication · Cloudflare D1
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-white">
            Articles &amp; Editorial Studio
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white"
          >
            <span>View /blog</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setEditingArticle('new')}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#d8ff38] px-4 py-2 text-xs font-bold text-[#101014] hover:bg-[#c6f028] active:scale-[0.96] cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[36px] rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, slugs, tags…"
            className="min-h-[40px] w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-[#d8ff38] focus:outline-none"
          />
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400 gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading articles from D1…</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 px-6 py-16 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-[#d8ff38]">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            No articles found
          </h3>
          <p className="mx-auto max-w-md text-xs text-zinc-400">
            Launch the Medium-style WYSIWYG editor to compose rich essays with floating formatting, cover images, code blocks, and instant publishing to{' '}
            <code className="text-zinc-200">/blog</code>.
          </p>
          <button
            type="button"
            onClick={() => setEditingArticle('new')}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#d8ff38] px-4 py-2 text-xs font-bold text-[#101014] hover:bg-[#c6f028] cursor-pointer"
          >
            <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Create your first article</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-colors hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4 min-w-0">
                {article.coverImageUrl && (
                  <img
                    src={article.coverImageUrl}
                    alt={article.coverImageAlt || article.title}
                    className="hidden h-16 w-24 shrink-0 rounded-xl object-cover outline outline-1 outline-white/10 sm:block"
                  />
                )}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        article.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : article.status === 'archived'
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {article.status}
                    </span>
                    {article.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#d8ff38]/15 px-2 py-0.5 text-[10px] font-bold text-[#d8ff38]">
                        <Sparkles className="h-2.5 w-2.5" />
                        Featured
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-zinc-400">
                      {article.category}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                      {article.wordCount} words · {article.readingTimeMinutes} min
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingArticle(article)}
                    className="block text-left font-serif text-lg font-bold text-white hover:text-[#d8ff38] transition-colors truncate max-w-full cursor-pointer"
                  >
                    {article.title}
                  </button>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono text-[11px]">/blog/{article.slug}</span>
                    <span>·</span>
                    <span className="tabular-nums">
                      Updated {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingArticle(article)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 cursor-pointer"
                >
                  <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleTogglePublish(article)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white cursor-pointer"
                >
                  {article.status === 'published' ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Publish</span>
                    </>
                  )}
                </button>

                {article.status === 'published' && (
                  <a
                    href={`/blog/${encodeURIComponent(article.slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Open live article"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}

                <button
                  type="button"
                  disabled={deletingId === article.id}
                  onClick={() => void handleDelete(article)}
                  title="Delete article"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-rose-500/40 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
