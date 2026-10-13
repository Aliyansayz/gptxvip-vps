import React from 'react';
import { editorialTheme } from '../utils/styles';

interface EditorialFigureProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  caption?: string;
  accentColor1?: string;
  accentColor2?: string;
  isDark?: boolean;
}

export const EditorialFigure: React.FC<EditorialFigureProps> = ({
  title,
  subtitle,
  children,
  caption,
  accentColor1 = '#10b981',
  accentColor2 = '#f59e0b',
  isDark = false,
}) => {
  const colors = isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;

  const figureStyle: React.CSSProperties = {
    margin: '3rem 0',
  };

  const figureBoxStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.figureBg,
    color: colors.figureText,
    borderRadius: '0.25rem',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${isDark ? '#1f2937' : '#1f2937'}`,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const gridOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.08,
    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.mono,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: accentColor2,
    marginBottom: '0.75rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    backgroundColor: `${accentColor2}15`,
    border: `1px solid ${accentColor2}50`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.serif,
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const dividerStyle: React.CSSProperties = {
    width: '5rem',
    height: '2px',
    background: `linear-gradient(to right, ${accentColor1}, ${accentColor2})`,
    margin: '1rem 0',
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.75rem',
    lineHeight: 1.6,
    color: `${colors.figureText}CC`,
    maxWidth: '32rem',
  };

  const captionStyle: React.CSSProperties = {
    fontFamily: editorialTheme.fonts.sans,
    fontSize: '0.6875rem',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: '1rem',
    fontStyle: 'italic',
  };

  return (
    <figure style={figureStyle}>
      <div style={figureBoxStyle}>
        <div style={gridOverlayStyle} aria-hidden="true" />
        <div style={contentStyle}>
          <div style={labelStyle}>{title}</div>
          <div style={titleStyle}>
            {subtitle && (
              <>
                <span style={{ color: accentColor1 }}>{subtitle.split('↔')[0] || subtitle}</span>
                <span style={{ color: accentColor2, fontFamily: editorialTheme.fonts.sans, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>↔</span>
                <span style={{ color: accentColor2 }}>{subtitle.split('↔')[1] || ''}</span>
              </>
            )}
          </div>
          {subtitle && !subtitle.includes('↔') && (
            <div style={titleStyle}>
              <span style={{ color: accentColor1 }}>{subtitle}</span>
            </div>
          )}
          <div style={dividerStyle} />
          <p style={subtitleStyle}>{children}</p>
        </div>
      </div>
      {caption && <figcaption style={captionStyle}>{caption}</figcaption>}
    </figure>
  );
};