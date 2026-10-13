import React from 'react';
import { editorialTheme } from '../utils/styles';

interface ArticleBodyProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({
  children,
  isDark = false,
  className = '',
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const proseStyle: React.CSSProperties = {
    maxWidth: editorialTheme.spacing.articleMaxWidth,
    margin: '0 auto',
    padding: '0 1.5rem 4rem',
    fontFamily: editorialTheme.fonts.body,
    fontSize: '1rem',
    lineHeight: 1.8,
    color: colors.text,
    letterSpacing: '-0.005em',
  };

  return (
    <article
      id="article-body"
      className={`editorial-prose ${className}`}
      style={proseStyle}
    >
      {children}
    </article>
  );
};

// Helper components for common editorial elements
export const DropCap: React.FC<{ children: React.ReactNode; isDark?: boolean }> = ({
  children,
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  return (
    <p className="drop-cap" style={{ color: colors.text }}>
      {children}
    </p>
  );
};

export const PullQuote: React.FC<{
  children: React.ReactNode;
  citation?: string;
  isDark?: boolean;
}> = ({ children, citation, isDark = false }) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const quoteStyle: React.CSSProperties = {
    margin: '3rem 0',
    padding: '2rem 2.5rem',
    borderTop: `2px solid ${colors.text}`,
    borderBottom: `2px solid ${colors.text}`,
    backgroundColor: colors.quoteBg,
    textAlign: 'center',
  };

  const textStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
    fontWeight: 700,
    fontStyle: 'italic',
    lineHeight: 1.3,
    color: colors.text,
    margin: 0,
  };

  const citationStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: colors.textSecondary,
    marginTop: '1.25rem',
  };

  return (
    <blockquote style={quoteStyle}>
      <p style={textStyle}>{children}</p>
      {citation && <footer style={citationStyle}>{citation}</footer>}
    </blockquote>
  );
};

export const SectionHeading: React.FC<{
  children: React.ReactNode;
  level?: 2 | 3;
  isDark?: boolean;
}> = ({ children, level = 2, isDark = false }) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const style: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: level === 2 ? 'clamp(1.5rem, 3vw, 2.25rem)' : 'clamp(1.25rem, 2vw, 1.5rem)',
    fontWeight: 700,
    color: colors.text,
    marginTop: level === 2 ? '3rem' : '2.5rem',
    marginBottom: level === 2 ? '1rem' : '0.75rem',
    paddingBottom: level === 2 ? '0.5rem' : 0,
    borderBottom: level === 2 ? `1px solid ${colors.border}` : 'none',
    lineHeight: 1.2,
  };

  return <h2 style={style}>{children}</h2>;
};

export const MathDisplay: React.FC<{
  children: React.ReactNode;
  isDark?: boolean;
}> = ({ children, isDark = false }) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const style: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.mono,
    fontSize: '0.75rem',
    backgroundColor: colors.bgSecondary,
    borderLeft: `4px solid ${colors.text}`,
    padding: '1.5rem 2rem',
    margin: '2rem 0',
    overflowX: 'auto',
    borderRadius: '0 0.5rem 0.5rem 0',
    lineHeight: 1.7,
  };

  return <div className="math-display" style={style}>{children}</div>;
};

export const Footnote: React.FC<{
  id: string;
  children: React.ReactNode;
  isDark?: boolean;
}> = ({ id, children, isDark = false }) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  return (
    <a
      href={`#fn-${id}`}
      className="footnote-ref"
      id={`fnref-${id}`}
      style={{ color: colors.accent }}
    >
      [{id}]
    </a>
  );
};

export const FootnotesSection: React.FC<{
  items: Array<{ id: string; content: React.ReactNode }>;
  isDark?: boolean;
}> = ({ items, isDark = false }) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const sectionStyle: React.CSSProperties = {
    marginTop: '4rem',
    paddingTop: '2rem',
    borderTop: `1px solid ${colors.border}`,
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    color: colors.textSecondary,
    lineHeight: 1.7,
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 700,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '0.625rem',
    marginBottom: '1rem',
  };

  const itemStyle: React.CSSProperties = {
    marginBottom: '0.75rem',
    paddingLeft: '1.5rem',
    textIndent: '-1.5rem',
  };

  return (
    <section style={sectionStyle}>
      <h4 style={titleStyle}>Notes & References</h4>
      {items.map((item) => (
        <div key={item.id} id={`fn-${item.id}`} style={itemStyle}>
          <span style={{ fontWeight: 700, color: colors.text }}>
            [{item.id}]
          </span>{' '}
          {item.content}
        </div>
      ))}
    </section>
  );
};