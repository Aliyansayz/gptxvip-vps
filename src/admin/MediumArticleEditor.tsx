import React, { useEffect, useRef, useState } from 'react';
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import UnderlineExtension from '@tiptap/extension-underline';
import HighlightExtension from '@tiptap/extension-highlight';
import TextAlignExtension from '@tiptap/extension-text-align';
import CharacterCountExtension from '@tiptap/extension-character-count';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Check,
  Code,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Quote,
  Redo2,
  Save,
  Send,
  Settings2,
  Sparkles,
  Strikethrough,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  computeContentMetrics,
  slugifyTitle,
  type BlogArticleDto,
  type BlogArticleInput,
  type BlogPostStatus,
} from '../shared/cmsContracts';
import { cmsApiClient } from '../services/cmsApiClient';
import '../blog/medium-article.css';

interface MediumArticleEditorProps {
  initialArticle: BlogArticleDto | null;
  defaultAuthorName: string;
  onBack: () => void;
  onSaved: (article: BlogArticleDto) => void;
}

const DEFAULT_CATEGORIES = [
  'Engineering',
  'AI Agents',
  'Architecture',
  'Quantitative Systems',
  'Product & Design',
  'Case Study',
];

export const MediumArticleEditor: React.FC<MediumArticleEditorProps> = ({
  initialArticle,
  defaultAuthorName,
  onBack,
  onSaved,
}) => {
  const [articleId, setArticleId] = useState<string | null>(initialArticle?.id ?? null);
  const [title, setTitle] = useState(initialArticle?.title ?? '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle ?? '');
  const [slug, setSlug] = useState(initialArticle?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialArticle?.slug));
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? '');
  const [category, setCategory] = useState(initialArticle?.category ?? 'Engineering');
  const [tags, setTags] = useState<string[]>(initialArticle?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(initialArticle?.coverImageUrl ?? '');
  const [coverImageAlt, setCoverImageAlt] = useState(initialArticle?.coverImageAlt ?? '');
  const [authorName, setAuthorName] = useState(
    initialArticle?.authorName ?? defaultAuthorName
  );
  const [authorBio, setAuthorBio] = useState(initialArticle?.authorBio ?? '');
  const [status, setStatus] = useState<BlogPostStatus>(initialArticle?.status ?? 'draft');
  const [featured, setFeatured] = useState(initialArticle?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initialArticle?.seoDescription ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialArticle?.canonicalUrl ?? '');

  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrlDraft, setLinkUrlDraft] = useState('');
  const [imagePromptOpen, setImagePromptOpen] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    initialArticle?.updatedAt ?? null
  );

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…';
          return 'Tell your story… Highlight text to format, or click + on a new line to insert blocks.';
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
      }),
      UnderlineExtension,
      HighlightExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCountExtension,
    ],
    content: initialArticle?.contentHtml || '',
    editorProps: {
      attributes: {
        class: 'medium-prose min-h-[420px] focus:outline-none',
      },
    },
  });

  // Auto-generate slug from title for brand-new drafts until user customizes it
  useEffect(() => {
    if (!slugManuallyEdited && title.trim()) {
      setSlug(slugifyTitle(title));
    }
  }, [title, slugManuallyEdited]);

  const currentHtml = editor?.getHTML() ?? '';
  const liveMetrics = computeContentMetrics(currentHtml);
  const wordCount = editor?.storage.characterCount?.words() ?? liveMetrics.wordCount;
  const charCount = editor?.storage.characterCount?.characters() ?? 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  const addTag = (raw: string) => {
    const cleaned = raw.trim().replace(/^#/, '');
    if (!cleaned || tags.length >= 12) return;
    if (!tags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput('');
  };

  const handleUploadImageFile = async (
    file: File,
    target: 'cover' | 'inline'
  ) => {
    if (target === 'cover') setUploadingCover(true);
    else setUploadingInline(true);
    try {
      const uploaded = await cmsApiClient.uploadImage(file);
      if (target === 'cover') {
        setCoverImageUrl(uploaded.url);
        toast.success('Cover image uploaded to Cloudflare R2');
      } else if (editor) {
        editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run();
        setPlusMenuOpen(false);
        toast.success('Image inserted from Cloudflare R2');
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Upload failed. You can still paste an external image URL.'
      );
    } finally {
      if (target === 'cover') setUploadingCover(false);
      else setUploadingInline(false);
    }
  };

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrlDraft.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const normalized = /^https?:\/\/|^\//i.test(url) ? url : `https://${url}`;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: normalized })
        .run();
    }
    setLinkPromptOpen(false);
    setLinkUrlDraft('');
  };

  const insertImageByUrl = () => {
    if (!editor) return;
    const url = imageUrlDraft.trim();
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
    setImagePromptOpen(false);
    setImageUrlDraft('');
    setPlusMenuOpen(false);
  };

  const handleSave = async (overrideStatus?: BlogPostStatus) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      toast.error('Please enter an article title first.');
      return;
    }

    const nextStatus = overrideStatus ?? status;
    const html = editor?.getHTML() ?? '';
    const jsonStr = editor ? JSON.stringify(editor.getJSON()) : null;

    const payload: BlogArticleInput = {
      title: cleanTitle,
      subtitle: subtitle.trim(),
      slug: slug.trim() || slugifyTitle(cleanTitle),
      excerpt: excerpt.trim() || undefined,
      contentHtml: html,
      contentJson: jsonStr,
      coverImageUrl: coverImageUrl.trim() || null,
      coverImageAlt: coverImageAlt.trim() || null,
      category: category.trim() || 'Engineering',
      tags,
      authorName: authorName.trim() || defaultAuthorName,
      authorBio: authorBio.trim() || null,
      status: nextStatus,
      featured,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      canonicalUrl: canonicalUrl.trim() || null,
    };

    setSaving(true);
    try {
      const saved = articleId
        ? await cmsApiClient.updateArticle(articleId, payload)
        : await cmsApiClient.createArticle(payload);

      setArticleId(saved.id);
      setSlug(saved.slug);
      setStatus(saved.status);
      setLastSavedAt(saved.updatedAt);
      onSaved(saved);

      toast.success(
        nextStatus === 'published'
          ? `Published live at /blog/${saved.slug}`
          : 'Draft saved to Cloudflare D1'
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not save article.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`${
        zenMode
          ? 'fixed inset-0 z-50 overflow-y-auto bg-[#fcfbf9] text-[#12130f]'
          : 'rounded-3xl border border-zinc-800 bg-[#fcfbf9] text-[#12130f] shadow-xl overflow-hidden'
      }`}
    >
      {/* Hidden file inputs for R2 uploads */}
      <input
        ref={coverFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadImageFile(f, 'cover');
          e.target.value = '';
        }}
      />
      <input
        ref={inlineFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadImageFile(f, 'inline');
          e.target.value = '';
        }}
      />

      {/* Top Sticky Studio Toolbar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-[#fcfbf9]/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-black/12 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:border-black/25 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Articles</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                status === 'published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : status === 'archived'
                    ? 'bg-zinc-200 text-zinc-700'
                    : 'bg-amber-100 text-amber-900'
              }`}
            >
              {status}
            </span>
            {lastSavedAt && (
              <span className="tabular-nums">
                Saved {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* Quick Formatting Controls (center) */}
        {editor && !previewMode && (
          <div className="hidden xl:flex items-center gap-0.5 rounded-full border border-black/10 bg-white px-2 py-1 shadow-2xs">
            <ToolbarBtn
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <span className="mx-1 h-4 w-px bg-black/10" />
            <ToolbarBtn
              title="Heading 2"
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Heading 3"
              active={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Bold"
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Italic"
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Underline"
              active={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Highlight"
              active={editor.isActive('highlight')}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <Highlighter className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <span className="mx-1 h-4 w-px bg-black/10" />
            <ToolbarBtn
              title="Pull Quote"
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Bullet List"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Numbered List"
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Code Block"
              active={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Section Divider (•••)"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <span className="mx-1 h-4 w-px bg-black/10" />
            <ToolbarBtn
              title="Align Left"
              active={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Align Center"
              active={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Align Right"
              active={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn
              title="Insert Image"
              onClick={() => setImagePromptOpen((v) => !v)}
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode((v) => !v)}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              previewMode
                ? 'border-[#343edb] bg-[#e5e9ff] text-[#1e28a1]'
                : 'border-black/12 bg-white text-zinc-700 hover:border-black/25'
            }`}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{previewMode ? 'Edit' : 'Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              showSettings
                ? 'border-black bg-black text-white'
                : 'border-black/12 bg-white text-zinc-700 hover:border-black/25'
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Story Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setZenMode((v) => !v)}
            title={zenMode ? 'Exit Distraction-Free Mode' : 'Distraction-Free Zen Mode'}
            className="hidden sm:inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-black/12 bg-white text-zinc-700 hover:border-black/25 cursor-pointer"
          >
            {zenMode ? (
              <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('draft')}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-black/15 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave('published')}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-[0.96] disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{status === 'published' ? 'Update Live' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Inline Image Insert Drawer */}
      {imagePromptOpen && !previewMode && (
        <div className="border-b border-black/10 bg-white px-5 py-3">
          <div className="mx-auto flex max-w-[740px] flex-wrap items-center gap-2">
            <input
              type="url"
              value={imageUrlDraft}
              onChange={(e) => setImageUrlDraft(e.target.value)}
              placeholder="Paste image URL (https://...) or upload directly to R2"
              className="min-h-[38px] flex-1 rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
            />
            <button
              type="button"
              onClick={insertImageByUrl}
              className="min-h-[38px] rounded-xl bg-black px-3.5 text-xs font-bold text-white hover:bg-[#343edb] cursor-pointer"
            >
              Insert URL
            </button>
            <button
              type="button"
              disabled={uploadingInline}
              onClick={() => inlineFileInputRef.current?.click()}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
            >
              {uploadingInline ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>Upload to R2</span>
            </button>
            <button
              type="button"
              onClick={() => setImagePromptOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-800 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Split: Medium Writing Canvas + Optional Settings Drawer */}
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 px-5 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-[740px]">
            {previewMode ? (
              /* Live Medium Reader Preview */
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#343edb]">
                  <span>{category}</span>
                  <span>·</span>
                  <span className="text-zinc-500">{readingMinutes} min read</span>
                </div>
                <h1 className="font-serif text-[clamp(2.1rem,4.5vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.025em] text-zinc-950">
                  {title || 'Untitled Story'}
                </h1>
                {subtitle && (
                  <p className="text-lg leading-relaxed text-zinc-600">{subtitle}</p>
                )}
                {coverImageUrl && (
                  <img
                    src={coverImageUrl}
                    alt={coverImageAlt || title}
                    className="w-full max-h-[420px] rounded-2xl object-cover outline outline-1 outline-black/10"
                  />
                )}
                <div
                  className="medium-prose pt-2"
                  dangerouslySetInnerHTML={{ __html: currentHtml }}
                />
              </div>
            ) : (
              /* Medium Distraction-Free Authoring Canvas */
              <div className="space-y-6">
                {/* Cover Image Control */}
                {coverImageUrl ? (
                  <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-zinc-100">
                    <img
                      src={coverImageUrl}
                      alt={coverImageAlt || 'Article cover'}
                      className="max-h-[380px] w-full object-cover"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl('')}
                        className="rounded-full bg-rose-600/90 p-1.5 text-white hover:bg-rose-700 cursor-pointer"
                        aria-label="Remove cover image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingCover}
                      onClick={() => coverFileInputRef.current?.click()}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-dashed border-black/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:border-black/40 hover:text-black cursor-pointer"
                    >
                      {uploadingCover ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                      )}
                      <span>Add Cover Image</span>
                    </button>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="…or paste cover image URL"
                      className="min-h-[36px] flex-1 min-w-[200px] rounded-full border border-transparent bg-transparent px-3 text-xs text-zinc-600 placeholder:text-zinc-400 focus:border-black/15 focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                {/* Medium Big Serif Title */}
                <textarea
                  rows={1}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Title"
                  className="w-full resize-none overflow-hidden bg-transparent font-serif text-[clamp(2rem,4.4vw,3rem)] font-bold leading-[1.14] tracking-[-0.025em] text-zinc-950 placeholder:text-zinc-300 focus:outline-none"
                />

                {/* Medium Subtitle */}
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Add a compelling subtitle…"
                  className="w-full bg-transparent font-sans text-lg leading-relaxed text-zinc-600 placeholder:text-zinc-300 focus:outline-none sm:text-xl"
                />

                {/* Compact Story Meta Ribbon */}
                <div className="flex flex-wrap items-center gap-2 border-y border-black/8 py-2.5 text-xs text-zinc-500">
                  <span className="font-mono text-[11px] text-zinc-400">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="article-slug"
                    className="min-w-[160px] flex-1 bg-transparent font-mono text-xs text-zinc-700 focus:outline-none"
                  />
                  <span className="tabular-nums text-[11px] text-zinc-400">
                    {wordCount} words · {charCount} chars · {readingMinutes} min read
                  </span>
                </div>

                {/* Medium Bubble Menu (Floating Selection Toolbar) */}
                {editor && (
                  <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 120, placement: 'top' }}
                    className="flex items-center gap-0.5 rounded-xl border border-zinc-800 bg-[#12130f] p-1 text-white shadow-xl"
                  >
                    {linkPromptOpen ? (
                      <div className="flex items-center gap-1 px-1">
                        <input
                          type="url"
                          autoFocus
                          value={linkUrlDraft}
                          onChange={(e) => setLinkUrlDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              applyLink();
                            } else if (e.key === 'Escape') {
                              setLinkPromptOpen(false);
                            }
                          }}
                          placeholder="https://..."
                          className="w-48 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={applyLink}
                          className="rounded-lg bg-[#d8ff38] p-1.5 text-black cursor-pointer"
                          title="Apply link"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLinkPromptOpen(false)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <BubbleBtn
                          active={editor.isActive('bold')}
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          title="Bold"
                        >
                          <Bold className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('italic')}
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          title="Italic"
                        >
                          <Italic className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('underline')}
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          title="Underline"
                        >
                          <UnderlineIcon className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('strike')}
                          onClick={() => editor.chain().focus().toggleStrike().run()}
                          title="Strikethrough"
                        >
                          <Strikethrough className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('highlight')}
                          onClick={() => editor.chain().focus().toggleHighlight().run()}
                          title="Highlight"
                        >
                          <Highlighter className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('code')}
                          onClick={() => editor.chain().focus().toggleCode().run()}
                          title="Inline Code"
                        >
                          <Code className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <span className="mx-0.5 h-4 w-px bg-zinc-700" />
                        <BubbleBtn
                          active={editor.isActive('heading', { level: 2 })}
                          onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                          }
                          title="Large Heading"
                        >
                          <Heading2 className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('heading', { level: 3 })}
                          onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                          }
                          title="Subheading"
                        >
                          <Heading3 className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('blockquote')}
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          title="Pull Quote"
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </BubbleBtn>
                        <BubbleBtn
                          active={editor.isActive('link')}
                          onClick={() => {
                            const prev = editor.getAttributes('link').href || '';
                            setLinkUrlDraft(prev);
                            setLinkPromptOpen(true);
                          }}
                          title="Add / Edit Link"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                        </BubbleBtn>
                      </>
                    )}
                  </BubbleMenu>
                )}

                {/* Medium Floating '+' Block Inserter on Empty Lines */}
                {editor && (
                  <FloatingMenu
                    editor={editor}
                    tippyOptions={{ duration: 120, placement: 'left' }}
                    className="flex items-center gap-1"
                  >
                    <button
                      type="button"
                      onClick={() => setPlusMenuOpen((v) => !v)}
                      title="Insert block"
                      className={`flex h-8 w-8 items-center justify-center rounded-full border border-black/20 bg-white text-zinc-700 shadow-xs transition-transform cursor-pointer ${
                        plusMenuOpen ? 'rotate-45 border-black text-black' : 'hover:border-black'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {plusMenuOpen && (
                      <div className="flex items-center gap-1 rounded-full border border-black/15 bg-white px-2 py-1 shadow-lg">
                        <ToolbarBtn
                          title="Heading 2"
                          onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <Heading2 className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Heading 3"
                          onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <Heading3 className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Pull Quote"
                          onClick={() => {
                            editor.chain().focus().toggleBlockquote().run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Code Block"
                          onClick={() => {
                            editor.chain().focus().toggleCodeBlock().run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <Code2 className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Bullet List"
                          onClick={() => {
                            editor.chain().focus().toggleBulletList().run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <List className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Insert Image (R2 or URL)"
                          onClick={() => {
                            setImagePromptOpen(true);
                            setPlusMenuOpen(false);
                          }}
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                        <ToolbarBtn
                          title="Section Break (•••)"
                          onClick={() => {
                            editor.chain().focus().setHorizontalRule().run();
                            setPlusMenuOpen(false);
                          }}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </ToolbarBtn>
                      </div>
                    )}
                  </FloatingMenu>
                )}

                {/* Tiptap Content Canvas */}
                <EditorContent editor={editor} />
              </div>
            )}
          </div>
        </div>

        {/* Story Settings Drawer (SEO, Tags, Category, Author, Status) */}
        {showSettings && (
          <aside className="w-full shrink-0 border-t border-black/10 bg-white p-6 lg:w-88 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
                Story Settings
              </h2>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-wider text-zinc-500">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
                  className="min-h-[40px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs font-semibold text-zinc-900 focus:border-[#343edb] focus:outline-none"
                >
                  <option value="draft">Draft (Hidden from /blog)</option>
                  <option value="published">Published (Live on /blog)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-black/10 bg-[#fcfbf9] px-3.5 py-2.5 cursor-pointer">
                <span className="flex items-center gap-2 font-semibold text-zinc-800">
                  <Sparkles className="h-3.5 w-3.5 text-[#343edb]" />
                  <span>Feature on /blog hero</span>
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#343edb]"
                />
              </label>

              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-wider text-zinc-500">
                  Category
                </label>
                <input
                  list="blog-category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="min-h-[40px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
                <datalist id="blog-category-suggestions">
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-wider text-zinc-500">
                  Topics / Tags ({tags.length}/12)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    placeholder="Add tag & press Enter"
                    className="min-h-[38px] flex-1 rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="rounded-xl bg-black px-3 text-xs font-bold text-white cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-[#e5e9ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#1e28a1]"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-wider text-zinc-500">
                  Excerpt / Card Summary
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Auto-generated from opening paragraph if left blank"
                  className="w-full rounded-xl border border-black/15 bg-[#fcfbf9] p-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-wider text-zinc-500">
                  Cover Image Alt Caption
                </label>
                <input
                  type="text"
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  placeholder="Descriptive caption for accessibility & SEO"
                  className="min-h-[38px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
              </div>

              <div className="border-t border-black/10 pt-4 space-y-3">
                <div className="font-bold uppercase tracking-wider text-zinc-500">
                  Author Attribution
                </div>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                  className="min-h-[38px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
                <input
                  type="text"
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Short author role / bio"
                  className="min-h-[38px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
              </div>

              <div className="border-t border-black/10 pt-4 space-y-3">
                <div className="font-bold uppercase tracking-wider text-zinc-500">
                  SEO Overrides
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom SEO title (optional)"
                  className="min-h-[38px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Custom meta description (optional)"
                  className="w-full rounded-xl border border-black/15 bg-[#fcfbf9] p-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="Canonical URL (if cross-posted from Medium)"
                  className="min-h-[38px] w-full rounded-xl border border-black/15 bg-[#fcfbf9] px-3 text-xs text-zinc-900 focus:border-[#343edb] focus:outline-none"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

const ToolbarBtn: React.FC<{
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, active, disabled, onClick, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer disabled:opacity-35 ${
      active
        ? 'bg-[#12130f] text-[#d8ff38]'
        : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
    }`}
  >
    {children}
  </button>
);

const BubbleBtn: React.FC<{
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, active, onClick, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
      active
        ? 'bg-[#d8ff38] text-[#101014]'
        : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
    }`}
  >
    {children}
  </button>
);
