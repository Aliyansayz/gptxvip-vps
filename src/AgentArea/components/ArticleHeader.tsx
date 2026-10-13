import React from 'react';
import { X, Twitter, Facebook, Link2, Printer } from 'lucide-react';
import { editorialTheme } from '../utils/styles';

interface ArticleHeaderProps {
  category: string;
  subCategory: string;
  headline: string;
  subHeadline: string;
  author: {
    name: string;
    initials: string;
    bio?: string;
  };
  publishedDate: string;
  readTime: string;
  isDark?: boolean;
  onShare?: (platform: 'twitter' | 'facebook' | 'link') => void;
  onPrint?: () => void;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  category,
  subCategory,
  headline,
  subHeadline,
  author,
  publishedDate,
  readTime,
  isDark = false,
  onShare,
  onPrint,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const headerStyle: React.CSSProperties = {
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    position: 'sticky',
    top: 0,
    zIndex: 40,
  };

  const utilityBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '2.5rem', // 40px
    minHeight: '2.5rem',
    borderBottom: `1px solid ${colors.borderSubtle}`,
    fontSize: '0.6875rem', // 11px
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: editorialTheme.fonts.sans,
    fontWeight: 500,
    color: colors.textSecondary,
  };

  const mastheadStyle: React.CSSProperties = {
    padding: '1.25rem 0', // 20px
    textAlign: 'center',
  };

  const categoryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: colors.accent,
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', // responsive
    fontWeight: 900,
    lineHeight: 1.12,
    color: colors.text,
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  };

  const subHeadlineStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    fontStyle: 'italic',
    lineHeight: 1.5,
    color: colors.textSecondary,
    marginBottom: '2rem',
    paddingLeft: '1rem',
    borderLeft: `2px solid ${colors.accent}`,
  };

  const bylineStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem 0',
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '0.75rem',
    fontFamily: editorialTheme.fonts.sans,
  };

  return (
    <header style={headerStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Utility Bar */}
        <div style={utilityBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span id="current-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="hidden md:inline border-l" style={{ borderColor: colors.border, paddingLeft: '1rem' }}>
              {new Date().toLocaleDateString('en-US', { era: 'long' })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: editorialTheme.fonts.mono, fontWeight: 700, color: colors.accent, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem' }}>
              <span style={{ fontSize: '0.625rem' }}>📖</span>
              <span id="read-pct">0%</span>
            </span>
            <button
              onClick={onPrint}
              className="hidden sm:inline hover:text-black transition-colors dark:hover:text-white"
              style={{ paddingLeft: '0.75rem', borderLeft: `1px solid ${colors.border}`, color: colors.textSecondary }}
            >
              Print
            </button>
            <button
              onClick={() => {}}
              style={{
                backgroundColor: colors.buttonPrimary,
                color: colors.buttonPrimary === '#1a1a1a' ? '#ffffff' : '#1a1a1a',
                padding: '0.25rem 0.625rem',
                fontSize: '0.625rem',
                fontWeight: 700,
                borderRadius: '0.125rem',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Masthead */}
        <div style={mastheadStyle}>
          <a
            href="/"
            style={{
              fontFamily: editorialTheme.fonts.serif,
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: colors.text,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Tablet
          </a>
          <p style={{ fontFamily: editorialTheme.fonts.sans, fontSize: '0.625rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textSecondary, marginTop: '0.25rem', fontWeight: 500 }}>
            A Magazine of AI Research, Systems & Culture
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center space-x-8 py-3 border-t" style={{ borderColor: colors.border, fontFamily: editorialTheme.fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {['Research', 'Systems', 'Agents', 'Theory', 'Archive'].map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: colors.textSecondary, transition: 'color 0.15s' }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.accent}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Article Meta - Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div style={categoryStyle}>
          <span>{category}</span>
          <span style={{ color: colors.textSecondary }}> / </span>
          <span style={{ color: colors.textSecondary }}>{subCategory}</span>
        </div>
      </div>

      {/* Article Headline & Sub-headline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ maxWidth: editorialTheme.spacing.articleMaxWidth }}>
        <h1 style={headlineStyle}>{headline}</h1>
        <p style={subHeadlineStyle}>{subHeadline}</p>
      </div>

      {/* Byline & Social Sharing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: editorialTheme.spacing.articleMaxWidth }}>
        <div style={bylineStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: colors.text,
                color: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: editorialTheme.fonts.serif,
                fontWeight: 700,
                fontSize: '0.875rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {author.initials}
            </div>
            <div>
              <span style={{ fontWeight: 700, color: colors.text, display: 'block', fontSize: '0.75rem' }}>
                By {author.name}
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '0.625rem' }}>
                Published on {publishedDate} • {readTime}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.textSecondary }}>
              SHARE:
            </span>
            <button
              onClick={() => onShare?.('twitter')}
              style={{ color: colors.textSecondary, transition: 'color 0.15s', padding: '0.25rem' }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.text}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <Twitter size={14} />
            </button>
            <button
              onClick={() => onShare?.('facebook')}
              style={{ color: colors.textSecondary, transition: 'color 0.15s', padding: '0.25rem' }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.text}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <Facebook size={14} />
            </button>
            <button
              onClick={() => onShare?.('link')}
              style={{ color: colors.textSecondary, transition: 'color 0.15s', padding: '0.25rem' }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.text}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <Link2 size={14} />
            </button>
            <button
              onClick={onPrint}
              className="hidden sm:inline"
              style={{ color: colors.textSecondary, transition: 'color 0.15s', padding: '0.25rem' }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.text}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <Printer size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};