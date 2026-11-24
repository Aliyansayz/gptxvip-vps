import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  PenSquare,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Toaster } from 'sonner';
import type { BlogArticleDto } from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';
import { Navbar } from '../rootHomePage/Navbar';
import { Footer } from '../rootHomePage/Footer';
import { BlogArticleReader } from './BlogArticleReader';
import './medium-article.css';

function readSlugFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'blog') return null;
  if (!segments[1]) return null;
  try {
    return decodeURIComponent(segments[1]);
  } catch {
    return segments[1];
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const BlogApp: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(() =>
    readSlugFromPath(window.location.pathname)
  );
  const [articles, setArticles] = useState<BlogArticleDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);

  const [activeArticle, setActiveArticle] = useState<BlogArticleDto | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticleDto[]>([]);
  const [loadingArticle, setLoadingArticle] = useState<boolean>(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const syncFromUrl = () => {
      setActiveSlug(readSlugFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    cmsApiClient
      .getAuthMe()
      .then((res) => setIsAdmin(Boolean(res.authenticated && res.user?.role === 'admin')))
      .catch(() => setIsAdmin(false));
  }, []);

  const loadList = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await cmsApiClient.listPublicArticles();
      setArticles(data.articles);
      setCategories(data.categories);
    } catch (err) {
      setListError(
        err instanceof Error
          ? err.message
          : 'Could not load articles from the database.'
      );
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (!activeSlug) {
      setActiveArticle(null);
      setRelatedArticles([]);
      setArticleError(null);
      document.title = 'Blog — GPTX.VIP';
      return;
    }

    let cancelled = false;
    setLoadingArticle(true);
    setArticleError(null);

    cmsApiClient
      .getPublicArticle(activeSlug)
      .then((res) => {
        if (cancelled) return;
        setActiveArticle(res.article);
        setRelatedArticles(res.related);
      })
      .catch((err) => {
        if (cancelled) return;
        setActiveArticle(null);
        setArticleError(
          err instanceof Error ? err.message : 'Article not found.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingArticle(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  const navigateSlug = (slug: string | null) => {
    const nextPath = slug ? `/blog/${encodeURIComponent(slug)}` : '/blog';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((item) => {
      if (
        selectedCategory !== 'all' &&
        item.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedTag &&
        !item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      ) {
        return false;
      }
      if (!q) return true;
      return [item.title, item.subtitle, item.excerpt, item.category, item.authorName, ...item.tags]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [articles, searchQuery, selectedCategory, selectedTag]);

  const featuredArticle = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'all' || selectedTag) return null;
    return filteredArticles.find((a) => a.featured) || filteredArticles[0] || null;
  }, [filteredArticles, searchQuery, selectedCategory, selectedTag]);

  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  return (
    <div className="premium-surface flex min-h-screen flex-col bg-paper text-ink selection:bg-accent-200 selection:text-ink">
      <Toaster position="top-center" />
      <Navbar
        variant="glass"
        onNavigateBlogs={() => navigateSlug(null)}
        onBookDemo={() => window.location.assign('/contact')}
      />

      <main className="flex-1">
        {activeSlug ? (
          loadingArticle ? (
            <div className="mx-auto max-w-[740px] px-5 py-20 sm:px-8 space-y-6 animate-pulse">
              <div className="h-6 w-32 rounded-full bg-slate-200" />
              <div className="h-12 w-5/6 rounded-xl bg-slate-200" />
              <div className="h-6 w-2/3 rounded-lg bg-slate-200" />
              <div className="h-72 w-full rounded-2xl bg-slate-200" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-11/12 rounded bg-slate-200" />
                <div className="h-4 w-4/5 rounded bg-slate-200" />
              </div>
            </div>
          ) : articleError || !activeArticle ? (
            <div className="mx-auto max-w-xl px-5 py-24 text-center space-y-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-600">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-slate-950">
                Article unavailable
              </h1>
              <p className="text-sm text-slate-600">
                {articleError || 'This article may have been unpublished or moved.'}
              </p>
              <button
                type="button"
                onClick={() => navigateSlug(null)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white hover:bg-[#343edb] transition-colors cursor-pointer"
              >
                Back to all articles
              </button>
            </div>
          ) : (
            <BlogArticleReader
              article={activeArticle}
              related={relatedArticles}
              onBack={() => navigateSlug(null)}
              onSelectSlug={(slug) => navigateSlug(slug)}
              onSelectTag={(tag) => {
                setSelectedTag(tag);
                navigateSlug(null);
              }}
            />
          )
        ) : (
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            {/* Publication Hero */}
            <header className="flex flex-col gap-6 border-b border-ink/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-[#d8ff38] ring-1 ring-ink/20" />
                  GPTX.VIP Publication
                </div>
                <h1 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.03em] text-slate-950">
                  Engineering notes, AI systems &amp; field essays.
                </h1>
                <p className="text-base leading-relaxed text-slate-600 max-w-[60ch]">
                  Long-form technical writing, architecture playbooks, and product insights — authored directly in our studio and served from the edge.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    aria-label="Search blog articles"
                    className="min-h-[44px] w-full rounded-full border border-ink/12 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#343edb] focus:outline-none"
                  />
                </div>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#343edb]"
                  >
                    <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Write Article</span>
                  </a>
                )}
              </div>
            </header>

            {/* Category & Tag Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-ink text-white'
                    : 'border border-ink/10 bg-white text-slate-700 hover:border-ink/25'
                }`}
              >
                All ({articles.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-ink text-white'
                      : 'border border-ink/10 bg-white text-slate-700 hover:border-ink/25'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag('')}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#e5e9ff] px-3 py-1.5 text-xs font-bold text-[#1e28a1] cursor-pointer"
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  <span>#{selectedTag}</span>
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Content Area */}
            {loadingList ? (
              <div className="mt-10 grid gap-6 md:grid-cols-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-ink/10 bg-white p-6 space-y-4">
                    <div className="h-40 rounded-xl bg-slate-200" />
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="h-6 w-5/6 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : listError ? (
              <div className="mt-12 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
                <p className="font-semibold">Unable to load blog articles right now.</p>
                <p className="mt-1 text-xs opacity-80">{listError}</p>
                <button
                  type="button"
                  onClick={() => void loadList()}
                  className="mt-4 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="mt-14 rounded-3xl border border-ink/10 bg-white px-6 py-16 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5e9ff] text-[#343edb]">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-950">
                  {articles.length === 0
                    ? 'No articles published yet'
                    : 'No matching articles'}
                </h2>
                <p className="mx-auto max-w-md text-sm text-slate-600">
                  {articles.length === 0
                    ? 'Publish your first story from the Admin Studio and it will appear live here immediately.'
                    : 'Try clearing your search or category filter.'}
                </p>
                {articles.length === 0 && (
                  <a
                    href="/admin"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#d8ff38] px-5 py-2.5 text-xs font-bold text-[#101014] hover:bg-[#c6f028] transition-colors"
                  >
                    <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open Admin Studio</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-10 space-y-12">
                {/* Featured Story */}
                {featuredArticle && (
                  <article
                    onClick={() => navigateSlug(featuredArticle.slug)}
                    className="group grid cursor-pointer overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-xs transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-12"
                  >
                    <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#d8ff38] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#101014]">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Featured
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#343edb]">
                            {featuredArticle.category}
                          </span>
                        </div>

                        <h2 className="font-serif text-2xl font-bold leading-tight text-slate-950 transition-colors group-hover:text-[#343edb] sm:text-4xl">
                          {featuredArticle.title}
                        </h2>

                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                          {featuredArticle.subtitle || featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/8 pt-5">
                        <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums">
                          <span className="font-semibold text-slate-800">
                            {featuredArticle.authorName}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {featuredArticle.readingTimeMinutes} min read
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-[#343edb]">
                          Read essay
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    </div>

                    <div className="min-h-[220px] bg-slate-100 lg:col-span-5">
                      {featuredArticle.coverImageUrl ? (
                        <img
                          src={featuredArticle.coverImageUrl}
                          alt={featuredArticle.coverImageAlt || featuredArticle.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full min-h-[260px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#12130f] via-[#1c2038] to-[#343edb] p-8 text-center text-white">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8ff38]">
                            {featuredArticle.category}
                          </span>
                          <p className="mt-3 font-serif text-xl font-bold leading-snug">
                            {featuredArticle.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                )}

                {/* Article Grid */}
                {gridArticles.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gridArticles.map((post) => (
                      <article
                        key={post.id}
                        onClick={() => navigateSlug(post.slug)}
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xs transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {post.coverImageUrl && (
                          <div className="h-48 w-full overflow-hidden bg-slate-100">
                            <img
                              src={post.coverImageUrl}
                              alt={post.coverImageAlt || post.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#343edb]">
                            <span>{post.category}</span>
                            <span className="font-mono font-medium text-slate-400 tabular-nums">
                              {post.readingTimeMinutes} min
                            </span>
                          </div>

                          <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-slate-950 transition-colors group-hover:text-[#343edb]">
                            {post.title}
                          </h3>

                          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {post.subtitle || post.excerpt}
                          </p>

                          {post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto flex items-center justify-between border-t border-ink/8 pt-4 mt-5 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                              {post.authorName}
                            </span>
                            <span className="tabular-nums">
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer
        accent="warm"
        onNavigateBlogs={() => navigateSlug(null)}
      />
    </div>
  );
};

export default BlogApp;
