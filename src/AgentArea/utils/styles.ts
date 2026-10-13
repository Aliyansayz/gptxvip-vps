// Tablet Magazine-inspired editorial design tokens
export const editorialTheme = {
  colors: {
    // Light mode (paper-like)
    light: {
      bg: '#fcfbf9',
      bgSecondary: '#f4f1ea',
      text: '#1a1a1a',
      textSecondary: '#66635b',
      border: '#e5e2da',
      borderSubtle: '#e5e2da66',
      accent: '#b91c1c',      // Tablet Red
      accentHover: '#991b1b',
      accentSoft: '#fef2f2',
      link: '#b91c1c',
      linkHover: '#7f1d1d',
      codeBg: '#f4f1ea',
      quoteBg: '#f4f1ea',
      figureBg: '#18181b',
      figureText: '#ffffff',
      figureAccent: '#f59e0b',  // Amber for gold
      figureAccent2: '#10b981', // Emerald for CHF
      footerBg: '#121212',
      footerText: '#ffffff',
      footerMuted: '#9ca3af',
      inputBg: '#ffffff',
      inputBorder: '#e5e2da',
      buttonPrimary: '#1a1a1a',
      buttonPrimaryHover: '#000000',
      buttonSecondary: '#ffffff',
      buttonSecondaryBorder: '#e5e2da',
      toastBg: '#18181b',
      toastBorder: '#374151',
      success: '#10b981',
      error: '#ef4444',
    },
    // Dark mode
    dark: {
      bg: '#0f0f0f',
      bgSecondary: '#1a1a1a',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      border: '#262626',
      borderSubtle: '#26262699',
      accent: '#ef4444',
      accentHover: '#f87171',
      accentSoft: '#450a0a',
      link: '#f87171',
      linkHover: '#fca5a5',
      codeBg: '#1a1a1a',
      quoteBg: '#1a1a1a',
      figureBg: '#0a0a0a',
      figureText: '#fafafa',
      figureAccent: '#fbbf24',
      figureAccent2: '#34d399',
      footerBg: '#000000',
      footerText: '#fafafa',
      footerMuted: '#737373',
      inputBg: '#1a1a1a',
      inputBorder: '#262626',
      buttonPrimary: '#fafafa',
      buttonPrimaryHover: '#ffffff',
      buttonSecondary: '#1a1a1a',
      buttonSecondaryBorder: '#262626',
      toastBg: '#1a1a1a',
      toastBorder: '#262626',
      success: '#34d399',
      error: '#f87171',
    }
  },
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    body: "'Lora', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.6875rem',    // 11px
    sm: '0.75rem',      // 12px
    base: '0.875rem',   // 14px
    lg: '1rem',         // 16px
    xl: '1.125rem',     // 18px
    '2xl': '1.5rem',    // 24px
    '3xl': '2.25rem',   // 36px
    '4xl': '3rem',      // 48px
    '5xl': '4.5rem',    // 72px
  },
  spacing: {
    articleMaxWidth: '48rem', // 768px - optimal reading width
    containerMaxWidth: '80rem', // 1280px
  },
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '400ms ease-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
} as const;

// CSS-in-JS style object for global styles
export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    background-color: ${editorialTheme.colors.light.bg};
    color: ${editorialTheme.colors.light.text};
    font-family: ${editorialTheme.fonts.body};
    line-height: 1.75;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  .dark body {
    background-color: ${editorialTheme.colors.dark.bg};
    color: ${editorialTheme.colors.dark.text};
  }
  
  /* Reading Progress Bar */
  #reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${editorialTheme.colors.light.borderSubtle};
    z-index: 100;
    pointer-events: none;
  }
  
  .dark #reading-progress-container {
    background: ${editorialTheme.colors.dark.borderSubtle};
  }
  
  #reading-progress-bar {
    height: 100%;
    width: 0%;
    background: ${editorialTheme.colors.light.accent};
    transition: width 0.1s ease-out;
  }
  
  .dark #reading-progress-bar {
    background: ${editorialTheme.colors.dark.accent};
  }
  
  /* Drop Cap Styling */
  .drop-cap::first-letter {
    font-family: ${editorialTheme.fonts.serif};
    float: left;
    font-size: 4.5rem;
    line-height: 0.78;
    padding-top: 4px;
    padding-right: 10px;
    padding-bottom: 0;
    color: ${editorialTheme.colors.light.text};
    font-weight: 900;
  }
  
  .dark .drop-cap::first-letter {
    color: ${editorialTheme.colors.dark.text};
  }
  
  @media (max-width: 640px) {
    .drop-cap::first-letter {
      font-size: 3.5rem;
      padding-right: 6px;
    }
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${editorialTheme.colors.light.bg};
  }
  .dark ::-webkit-scrollbar-track {
    background: ${editorialTheme.colors.dark.bg};
  }
  ::-webkit-scrollbar-thumb {
    background: ${editorialTheme.colors.light.border};
    border-radius: 3px;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: ${editorialTheme.colors.dark.border};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${editorialTheme.colors.light.textSecondary};
  }
  .dark ::-webkit-scrollbar-thumb:hover {
    background: ${editorialTheme.colors.dark.textSecondary};
  }
  
  /* Footnote Links */
  .footnote-ref {
    font-size: 0.7rem;
    vertical-align: super;
    color: ${editorialTheme.colors.light.accent};
    font-weight: 600;
    margin-left: 2px;
    text-decoration: none;
    transition: color ${editorialTheme.transitions.fast};
  }
  .footnote-ref:hover {
    color: ${editorialTheme.colors.light.accentHover};
    text-decoration: underline;
  }
  .dark .footnote-ref {
    color: ${editorialTheme.colors.dark.accent};
  }
  .dark .footnote-ref:hover {
    color: ${editorialTheme.colors.dark.accentHover};
  }
  
  /* Range Slider */
  input[type="range"] {
    accent-color: ${editorialTheme.colors.light.accent};
  }
  .dark input[type="range"] {
    accent-color: ${editorialTheme.colors.dark.accent};
  }
  
  /* Selection Colors */
  ::selection {
    background-color: ${editorialTheme.colors.light.accent};
    color: white;
  }
  .dark ::selection {
    background-color: ${editorialTheme.colors.dark.accent};
    color: white;
  }
  
  /* Focus Visible */
  :focus-visible {
    outline: 2px solid ${editorialTheme.colors.light.accent};
    outline-offset: 2px;
  }
  .dark :focus-visible {
    outline-color: ${editorialTheme.colors.dark.accent};
  }
  
  /* Prose Styles */
  .editorial-prose {
    max-width: none;
    font-family: ${editorialTheme.fonts.body};
    font-size: ${editorialTheme.fontSizes.lg};
    line-height: 1.8;
    color: ${editorialTheme.colors.light.text};
  }
  
  .dark .editorial-prose {
    color: ${editorialTheme.colors.dark.text};
  }
  
  .editorial-prose p {
    margin-bottom: 1.5em;
  }
  
  .editorial-prose h2 {
    font-family: ${editorialTheme.fonts.serif};
    font-size: ${editorialTheme.fontSizes['3xl']};
    font-weight: 700;
    color: ${editorialTheme.colors.light.text};
    margin-top: 2.5em;
    margin-bottom: 0.75em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid ${editorialTheme.colors.light.border};
    line-height: 1.2;
  }
  
  .dark .editorial-prose h2 {
    color: ${editorialTheme.colors.dark.text};
    border-bottom-color: ${editorialTheme.colors.dark.border};
  }
  
  .editorial-prose h3 {
    font-family: ${editorialTheme.fonts.serif};
    font-size: ${editorialTheme.fontSizes['2xl']};
    font-weight: 700;
    color: ${editorialTheme.colors.light.text};
    margin-top: 2em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }
  
  .dark .editorial-prose h3 {
    color: ${editorialTheme.colors.dark.text};
  }
  
  .editorial-prose blockquote {
    margin: 2.5em 0;
    padding: 2em 2.5em;
    border-top: 2px solid ${editorialTheme.colors.light.text};
    border-bottom: 2px solid ${editorialTheme.colors.light.text};
    background-color: ${editorialTheme.colors.light.quoteBg};
    text-align: center;
    border-radius: 0;
  }
  
  .dark .editorial-prose blockquote {
    border-color: ${editorialTheme.colors.dark.text};
    background-color: ${editorialTheme.colors.dark.quoteBg};
  }
  
  .editorial-prose blockquote p {
    font-family: ${editorialTheme.fonts.serif};
    font-size: ${editorialTheme.fontSizes['2xl']};
    font-weight: 700;
    font-style: italic;
    line-height: 1.3;
    color: ${editorialTheme.colors.light.text};
    margin: 0;
  }
  
  .dark .editorial-prose blockquote p {
    color: ${editorialTheme.colors.dark.text};
  }
  
  .editorial-prose blockquote footer {
    font-family: ${editorialTheme.fonts.sans};
    font-size: ${editorialTheme.fontSizes.xs};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: ${editorialTheme.colors.light.textSecondary};
    margin-top: 1.25em;
  }
  
  .dark .editorial-prose blockquote footer {
    color: ${editorialTheme.colors.dark.textSecondary};
  }
  
  .editorial-prose ul, .editorial-prose ol {
    margin: 1.5em 0;
    padding-left: 1.75em;
  }
  
  .editorial-prose li {
    margin-bottom: 0.75em;
    line-height: 1.7;
  }
  
  .editorial-prose li strong {
    font-weight: 700;
  }
  
  .editorial-prose strong {
    font-weight: 700;
  }
  
  .editorial-prose em {
    font-style: italic;
  }
  
  .editorial-prose code {
    font-family: ${editorialTheme.fonts.mono};
    font-size: 0.9em;
    background-color: ${editorialTheme.colors.light.codeBg};
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
  }
  
  .dark .editorial-prose code {
    background-color: ${editorialTheme.colors.dark.codeBg};
  }
  
  .editorial-prose pre {
    font-family: ${editorialTheme.fonts.mono};
    font-size: ${editorialTheme.fontSizes.sm};
    background-color: ${editorialTheme.colors.light.figureBg};
    color: ${editorialTheme.colors.light.figureText};
    padding: 1.5em;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5em 0;
    line-height: 1.6;
  }
  
  .dark .editorial-prose pre {
    background-color: ${editorialTheme.colors.dark.figureBg};
    color: ${editorialTheme.colors.dark.figureText};
  }
  
  .editorial-prose pre code {
    background: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }
  
  .editorial-prose a {
    color: ${editorialTheme.colors.light.link};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all ${editorialTheme.transitions.fast};
  }
  
  .editorial-prose a:hover {
    color: ${editorialTheme.colors.light.linkHover};
    border-bottom-color: ${editorialTheme.colors.light.linkHover};
  }
  
  .dark .editorial-prose a {
    color: ${editorialTheme.colors.dark.link};
  }
  
  .dark .editorial-prose a:hover {
    color: ${editorialTheme.colors.dark.linkHover};
    border-bottom-color: ${editorialTheme.colors.dark.linkHover};
  }
  
  .editorial-prose figure {
    margin: 3em 0;
  }
  
  .editorial-prose figcaption {
    font-family: ${editorialTheme.fonts.sans};
    font-size: ${editorialTheme.fontSizes.xs};
    color: ${editorialTheme.colors.light.textSecondary};
    text-align: center;
    margin-top: 1em;
    font-style: italic;
  }
  
  .dark .editorial-prose figcaption {
    color: ${editorialTheme.colors.dark.textSecondary};
  }
  
  /* Math formula display */
  .math-display {
    font-family: ${editorialTheme.fonts.mono};
    font-size: ${editorialTheme.fontSizes.sm};
    background-color: ${editorialTheme.colors.light.bgSecondary};
    border-left: 4px solid ${editorialTheme.colors.light.text};
    padding: 1.5em 2em;
    margin: 2em 0;
    overflow-x: auto;
    border-radius: 0 0.5rem 0.5rem 0;
  }
  
  .dark .math-display {
    background-color: ${editorialTheme.colors.dark.bgSecondary};
    border-left-color: ${editorialTheme.colors.dark.text};
  }
  
  /* Toast Notification */
  .toast-box {
    transition: all 0.3s ease-in-out;
    transform: translateY(100%);
    opacity: 0;
  }
  .toast-box.show {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Helper to get theme colors based on mode
export function getThemeColors(isDark: boolean) {
  return isDark ? editorialTheme.colors.dark : editorialTheme.colors.light;
}