import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'icon-only' | 'wordmark';
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-12 w-auto',
};

const iconSizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  variant = 'default',
}) => {
  if (variant === 'icon-only') {
    return (
      <svg
        className={`${iconSizeClasses[size]} ${className}`}
        viewBox="0 0 140 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#06B6D4" />
            <stop offset="50%" stop-color="#0891B2" />
            <stop offset="100%" stop-color="#10B981" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="140" height="34" rx="17" fill="url(#logoGradient)" />
        <text x="70" y="22" text-anchor="middle" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5px">
          GPTX.VIP
        </text>
      </svg>
    );
  }

  if (variant === 'wordmark') {
    return (
      <svg
        className={`${sizeClasses[size]} ${className}`}
        viewBox="0 0 140 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="wordmarkGradient" x1="0" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#06B6D4" />
            <stop offset="50%" stop-color="#0891B2" />
            <stop offset="100%" stop-color="#10B981" />
          </linearGradient>
        </defs>
        <text x="70" y="26" text-anchor="middle" fill="url(#wordmarkGradient)" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="800" letterSpacing="0.5px">
          GPTX.VIP
        </text>
      </svg>
    );
  }

  // Default: icon + wordmark
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 200 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#06B6D4" />
          <stop offset="50%" stop-color="#0891B2" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
        <linearGradient id="wordmarkGradient" x1="150" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#06B6D4" />
          <stop offset="50%" stop-color="#0891B2" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
      </defs>
      {/* Icon */}
      <rect x="0" y="0" width="34" height="34" rx="17" fill="url(#logoGradient)" />
      <text x="17" y="22" text-anchor="middle" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontSize="16" fontWeight="700">
        G
      </text>
      {/* Wordmark */}
      <text x="150" y="26" text-anchor="middle" fill="url(#wordmarkGradient)" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="800" letterSpacing="0.5px">
        GPTX.VIP
      </text>
    </svg>
  );
};

export default Logo;