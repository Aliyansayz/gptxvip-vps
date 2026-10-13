import React, { useState, useEffect } from 'react';
import { editorialTheme } from '../utils/styles';

interface AuthorBioProps {
  name: string;
  initials: string;
  bio: string;
  location?: string;
  isDark?: boolean;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({
  name,
  initials,
  bio,
  location,
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const containerStyle: React.CSSProperties = {
    marginTop: '4rem',
    padding: '2rem',
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.25rem',
    display: 'flex',
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: isDesktop ? 'flex-start' : 'center',
    textAlign: isDesktop ? 'left' : 'center',
    gap: '1rem',
  };

  const avatarStyle: React.CSSProperties = {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '50%',
    backgroundColor: colors.text,
    color: colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: editorialTheme.fonts.serif,
    fontSize: '1.5rem',
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: '1rem',
    fontWeight: 700,
    color: colors.text,
    marginBottom: '0.5rem',
  };

  const bioStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.body,
    fontSize: '0.875rem',
    lineHeight: 1.7,
    color: colors.textSecondary,
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle}>{initials}</div>
      <div style={contentStyle}>
        <h3 style={nameStyle}>About {name}</h3>
        <p style={bioStyle}>
          {bio}
          {location && <><br /><br /><em>Based in {location}.</em></>}
        </p>
      </div>
    </div>
  );
};

interface RelatedArticle {
  category: string;
  headline: string;
  author: string;
  readTime: string;
  href: string;
}

interface RelatedArticlesProps {
  title?: string;
  articles: RelatedArticle[];
  isDark?: boolean;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  title = 'Related Readings',
  articles,
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const containerStyle: React.CSSProperties = {
    marginTop: '4rem',
    paddingTop: '2rem',
    borderTop: `2px solid ${colors.text}`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
    fontWeight: 700,
    color: colors.text,
    marginBottom: '1.5rem',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
    gap: '1.5rem',
  };

  const cardStyle: React.CSSProperties = {
    border: `1px solid ${colors.border}`,
    padding: '1.5rem',
    backgroundColor: colors.bg,
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s',
    cursor: 'pointer',
  };

  const categoryStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: colors.accent,
    marginBottom: '0.5rem',
  };

  const headlineStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: '1rem',
    fontWeight: 700,
    color: colors.text,
    marginBottom: '0.5rem',
    lineHeight: 1.3,
    transition: 'color 0.15s',
  };

  const metaStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    color: colors.textSecondary,
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={gridStyle}>
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.href}
            style={{ textDecoration: 'none', display: 'block' }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = colors.text;
              const headline = e.currentTarget.querySelector('[data-headline]') as HTMLElement | null;
              if (headline) headline.style.color = colors.accent;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              const headline = e.currentTarget.querySelector('[data-headline]') as HTMLElement | null;
              if (headline) headline.style.color = colors.text;
            }}
          >
            <div style={cardStyle}>
              <span style={categoryStyle}>{article.category}</span>
              <h4 style={{ ...headlineStyle }} data-headline="true">
                {article.headline}
              </h4>
              <p style={metaStyle}>
                By {article.author} • {article.readTime}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};