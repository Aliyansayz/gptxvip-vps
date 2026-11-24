import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Link2,
  Sparkles,
  Tag,
} from 'lucide-react';
import type { BlogArticleDto } from '../shared/cmsContracts';
import './medium-article.css';

interface BlogArticleReaderProps {
  article: BlogArticleDto;
  related: BlogArticleDto[];
  onBack: () => void;
  onSelectSlug: (slug: string) => void;
  onSelectTag?: (tag: string) => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Draft';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const BlogArticleReader: React.FC<BlogArticleReaderProps> = ({
  article,
  related,
  onBack,
  onSelectSlug,
  onSelectTag,
}) => {
  const articleRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${article.seoTitle || article.title} — GPTX.VIP Blog`;
    return () => {
      document.title = prevTitle;
    };
  }, [article.seoTitle, article.title]);

  useEffect(() => {
    const updateProgress = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);
      const passed = Math.max(0, -rect.top);
      setProgress(Math.min(100, Math.round((passed / total) * 100)));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [article.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure in restricted contexts
    }
  };

  return (
    <div className="relative">
      {/* Top reading progress bar */}
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-[#343edb] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <article
        ref={articleRef}
        className="mx-auto max-w-[740px] px-5 pt-10 pb-20 sm:px-8 sm:pt-14"
      >
        {/* Top breadcrumb & share */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-ink/25 hover:text-ink active:scale-[0.96] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>All articles</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#e5e9ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1e28a1]">
              {article.category}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-ink/25 hover:text-ink active:scale-[0.96] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Medium-style Headline + Subtitle */}
        <header className="space-y-5">
          <h1 className="font-serif text-[clamp(2.1rem,4.8vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-slate-950">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-sans text-lg leading-relaxed text-slate-600 sm:text-xl">
              {article.subtitle}
            </p>
          )}

          {/* Author & Metadata strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4">
            <div className="flex items-center gap-3">
              {article.authorAvatarUrl ? (
                <img
                  src={article.authorAvatarUrl}
                  alt={article.authorName}
                  className="h-10 w-10 rounded-full object-cover outline outline-1 outline-black/10"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-[#d8ff38]">
                  {article.authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-950">
                  {article.authorName}
                </div>
                {article.authorBio && (
                  <div className="text-xs text-slate-500">{article.authorBio}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readingTimeMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImageUrl && (
          <figure className="my-9">
            <img
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              className="w-full max-h-[460px] rounded-2xl object-cover outline outline-1 outline-black/10"
            />
            {article.coverImageAlt && (
              <figcaption className="mt-2.5 text-center text-xs text-slate-500">
                {article.coverImageAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Rich HTML Body */}
        <div
          className="medium-prose mt-8"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Tags Footer */}
        {article.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
            <Tag className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {article.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag?.(tag)}
                className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-[#343edb]/40 hover:text-[#343edb] cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-white/70 py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#343edb]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Keep Reading</span>
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">
                  More from GPTX.VIP
                </h2>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-bold text-[#343edb] hover:underline cursor-pointer"
              >
                View all articles →
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectSlug(item.slug);
                  }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white text-left shadow-xs transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  {item.coverImageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.coverImageUrl}
                        alt={item.coverImageAlt || item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#343edb]">
                      {item.category}
                    </span>
                    <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-slate-950 group-hover:text-[#343edb]">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {item.subtitle || item.excerpt}
                    </p>
                    <div className="mt-auto pt-4 text-[11px] font-medium text-slate-400 tabular-nums">
                      {formatDate(item.publishedAt || item.createdAt)} · {item.readingTimeMinutes} min read
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
