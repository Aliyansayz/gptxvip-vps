import React, { useState, useEffect } from 'react';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ArticleHeader } from './ArticleHeader';
import { EditorialFigure } from './EditorialFigure';
import { ArticleBody, PullQuote, SectionHeading, MathDisplay, FootnotesSection } from './ArticleBody';
import { InteractiveSimulator } from './InteractiveSimulator';
import { DeltaCalculator } from './DeltaCalculator';
import { AuthorBio, RelatedArticles } from './AuthorBio';
import { Toast } from './Toast';
import { Share2, Link2 } from 'lucide-react';
import { editorialTheme, globalStyles } from '../utils/styles';

export interface ArticleData {
  category: string;
  subCategory: string;
  headline: string;
  subHeadline: string;
  author: {
    name: string;
    initials: string;
    bio: string;
    location?: string;
  };
  publishedDate: string;
  readTime: string;
  figure: {
    title: string;
    subtitle?: string;
    description: string;
    caption?: string;
    accentColor1?: string;
    accentColor2?: string;
  };
  body: React.ReactNode;
  footnotes: Array<{ id: string; content: React.ReactNode }>;
  relatedArticles: Array<{
    category: string;
    headline: string;
    author: string;
    readTime: string;
    href: string;
  }>;
}

interface ArticlePageProps {
  article: ArticleData;
  isDark?: boolean;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ article, isDark = false }) => {
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'error' | 'info' }>({
    message: '',
    visible: false,
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, visible: true, type });
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'link') => {
    const url = window.location.href;
    const title = article.headline;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'link':
        navigator.clipboard.writeText(url);
        break;
    }
    showToast(`Shared to ${platform === 'link' ? 'clipboard' : platform}`);
  };

  const handlePrint = () => {
    window.print();
    showToast('Print dialog opened');
  };

  // Inject global styles on mount
  useEffect(() => {
    const styleId = 'agent-area-editorial-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
    
    // Set dark mode class on html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    color: colors.text,
    fontFamily: editorialTheme.fonts.body,
  };

  return (
    <div style={pageStyle}>
      {/* Global Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* Reading Progress Bar */}
      <ReadingProgressBar isDark={isDark} />

      {/* Article Header */}
      <ArticleHeader
        category={article.category}
        subCategory={article.subCategory}
        headline={article.headline}
        subHeadline={article.subHeadline}
        author={article.author}
        publishedDate={article.publishedDate}
        readTime={article.readTime}
        isDark={isDark}
        onShare={handleShare}
        onPrint={handlePrint}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Editorial Figure */}
        <EditorialFigure
          title={article.figure.title}
          subtitle={article.figure.subtitle}
          caption={article.figure.caption}
          accentColor1={article.figure.accentColor1}
          accentColor2={article.figure.accentColor2}
          isDark={isDark}
        >
          {article.figure.description}
        </EditorialFigure>

        {/* Article Body */}
        <ArticleBody isDark={isDark}>
          {article.body}
        </ArticleBody>

        {/* Footnotes */}
        {article.footnotes.length > 0 && (
          <FootnotesSection items={article.footnotes} isDark={isDark} />
        )}

        {/* Author Bio */}
        <AuthorBio
          name={article.author.name}
          initials={article.author.initials}
          bio={article.author.bio}
          location={article.author.location}
          isDark={isDark}
        />

        {/* Related Articles */}
        <RelatedArticles
          articles={article.relatedArticles}
          isDark={isDark}
        />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.footerBg,
        color: colors.footerText,
        padding: '3rem 1.5rem',
        marginTop: '4rem',
        borderTop: `1px solid ${colors.border}`,
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              fontFamily: editorialTheme.fonts.serif,
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: colors.footerText,
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            TABLET
          </a>
          <p style={{
            fontFamily: editorialTheme.fonts.sans,
            fontSize: '0.625rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: colors.footerMuted,
            marginBottom: '2rem',
          }}>
            A Magazine of AI Research, Systems & Culture
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontFamily: editorialTheme.fonts.sans,
            fontSize: '0.625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.footerMuted,
            marginBottom: '2rem',
            padding: '1rem 0',
            borderTop: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`,
            maxWidth: '32rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <a href="#" style={{ color: colors.footerMuted, transition: 'color 0.15s' }} onMouseOver={(e)=>e.currentTarget.style.color=colors.footerText} onMouseOut={(e)=>e.currentTarget.style.color=colors.footerMuted}>About</a>
            <a href="#" style={{ color: colors.footerMuted, transition: 'color 0.15s' }} onMouseOver={(e)=>e.currentTarget.style.color=colors.footerText} onMouseOut={(e)=>e.currentTarget.style.color=colors.footerMuted}>Masthead</a>
            <a href="#" style={{ color: colors.footerMuted, transition: 'color 0.15s' }} onMouseOver={(e)=>e.currentTarget.style.color=colors.footerText} onMouseOut={(e)=>e.currentTarget.style.color=colors.footerMuted}>Contact</a>
            <a href="#" style={{ color: colors.footerMuted, transition: 'color 0.15s' }} onMouseOver={(e)=>e.currentTarget.style.color=colors.footerText} onMouseOut={(e)=>e.currentTarget.style.color=colors.footerMuted}>Subscriptions</a>
            <a href="#" style={{ color: colors.footerMuted, transition: 'color 0.15s' }} onMouseOver={(e)=>e.currentTarget.style.color=colors.footerText} onMouseOut={(e)=>e.currentTarget.style.color=colors.footerMuted}>Privacy</a>
          </div>

          <p style={{
            fontFamily: editorialTheme.fonts.sans,
            fontSize: '0.625rem',
            color: colors.footerMuted,
          }}>
            © {new Date().getFullYear()} Tablet Magazine. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Toast */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
        type={toast.type}
        isDark={isDark}
      />
    </div>
  );
};