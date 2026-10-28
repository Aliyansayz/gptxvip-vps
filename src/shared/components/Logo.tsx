import React from 'react';

/**
 * The GPTX.VIP brand mark.
 *
 * `public/images/logo.png` is generated from the single source artwork
 * (`public/images/favicon.png`, also served as the site favicon) by
 * `npm run brand:build`. Everything that renders the brand mark goes through
 * this component so the artwork can never drift from the favicon again.
 */
const MARK_SRC = '/images/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'icon-only' | 'wordmark';
  /** Wordmark ink. Defaults to the brand gradient; pass a plain color to flatten. */
  wordmarkClassName?: string;
}

const MARK_SIZE_CLASSES = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

const WORDMARK_SIZE_CLASSES = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-[1.75rem]',
  xl: 'text-3xl',
};

const GRADIENT_INK: React.CSSProperties = {
  backgroundImage: 'linear-gradient(90deg, #06B6D4 0%, #0891B2 50%, #10B981 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  variant = 'default',
  wordmarkClassName = '',
}) => {
  const pixelSize = size === 'sm' ? 24 : size === 'lg' ? 40 : size === 'xl' ? 48 : 32;
  const mark = (
    <img
      src={MARK_SRC}
      alt="GPTX.VIP"
      width={pixelSize}
      height={pixelSize}
      decoding="async"
      draggable={false}
      className={`${MARK_SIZE_CLASSES[size]} w-auto shrink-0 object-contain select-none`}
    />
  );

  const wordmark = (
    <span
      className={`font-display font-black uppercase leading-none tracking-[0.02em] ${WORDMARK_SIZE_CLASSES[size]} ${wordmarkClassName}`}
      style={wordmarkClassName ? undefined : GRADIENT_INK}
    >
      GPTX.VIP
    </span>
  );

  if (variant === 'icon-only') return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
  if (variant === 'wordmark') return <span className={`inline-flex items-center ${className}`}>{wordmark}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {wordmark}
    </span>
  );
};

export default Logo;
