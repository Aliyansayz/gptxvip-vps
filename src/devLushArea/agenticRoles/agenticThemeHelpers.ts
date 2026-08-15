import { Difficulty, NormalizedDifficulty, CareerLevel, RoleDomain } from './agenticRoleTypes';

export interface RoleThemeTokens {
  domain: RoleDomain;
  title: string;
  text: string;
  textMuted: string;
  bg: string;
  hoverBg: string;
  bgSoft: string;
  bgSoftGlow: string;
  border: string;
  borderSoft: string;
  hoverBorder: string;
  shadow: string;
  shadowMd: string;
  spotlightRgb: string;
  accentHex: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  groupHoverText: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const roleThemes: Record<RoleDomain, RoleThemeTokens> = {
  seo: {
    domain: 'seo',
    title: 'SEO Agentic Analyst',
    text: 'text-emerald-500 dark:text-emerald-400',
    textMuted: 'text-emerald-600/80 dark:text-emerald-300/80',
    bg: 'bg-emerald-600 hover:bg-emerald-500',
    hoverBg: 'hover:bg-emerald-500',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-950/30',
    bgSoftGlow: 'bg-emerald-500/10',
    border: 'border-emerald-500',
    borderSoft: 'border-emerald-200 dark:border-emerald-800/40',
    hoverBorder: 'hover:border-emerald-500/60',
    shadow: 'shadow-emerald-500/10',
    shadowMd: 'shadow-emerald-500/20',
    spotlightRgb: '16, 185, 129', // emerald-500
    accentHex: '#10B981',
    gradientFrom: 'from-emerald-500',
    gradientVia: 'via-teal-500',
    gradientTo: 'to-cyan-500',
    groupHoverText: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400',
    ring: 'focus:ring-emerald-500/50',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
  },
  accountant: {
    domain: 'accountant',
    title: 'Agentic Accountant',
    text: 'text-amber-500 dark:text-amber-400',
    textMuted: 'text-amber-600/80 dark:text-amber-300/80',
    bg: 'bg-amber-600 hover:bg-amber-500',
    hoverBg: 'hover:bg-amber-500',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/30',
    bgSoftGlow: 'bg-amber-500/10',
    border: 'border-amber-500',
    borderSoft: 'border-amber-200 dark:border-amber-800/40',
    hoverBorder: 'hover:border-amber-500/60',
    shadow: 'shadow-amber-500/10',
    shadowMd: 'shadow-amber-500/20',
    spotlightRgb: '245, 158, 11', // amber-500
    accentHex: '#F59E0B',
    gradientFrom: 'from-amber-500',
    gradientVia: 'via-orange-500',
    gradientTo: 'to-yellow-500',
    groupHoverText: 'group-hover:text-amber-500 dark:group-hover:text-amber-400',
    ring: 'focus:ring-amber-500/50',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/30',
  },
  commerce: {
    domain: 'commerce',
    title: 'Agentic Commerce Analyst',
    text: 'text-rose-500 dark:text-rose-400',
    textMuted: 'text-rose-600/80 dark:text-rose-300/80',
    bg: 'bg-rose-600 hover:bg-rose-500',
    hoverBg: 'hover:bg-rose-500',
    bgSoft: 'bg-rose-50 dark:bg-rose-950/30',
    bgSoftGlow: 'bg-rose-500/10',
    border: 'border-rose-500',
    borderSoft: 'border-rose-200 dark:border-rose-800/40',
    hoverBorder: 'hover:border-rose-500/60',
    shadow: 'shadow-rose-500/10',
    shadowMd: 'shadow-rose-500/20',
    spotlightRgb: '244, 63, 94', // rose-500
    accentHex: '#F43F5E',
    gradientFrom: 'from-rose-500',
    gradientVia: 'via-pink-500',
    gradientTo: 'to-fuchsia-500',
    groupHoverText: 'group-hover:text-rose-500 dark:group-hover:text-rose-400',
    ring: 'focus:ring-rose-500/50',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/30',
  },
  recommendation: {
    domain: 'recommendation',
    title: 'Agentic Recommendation System Analyst',
    text: 'text-indigo-500 dark:text-indigo-400',
    textMuted: 'text-indigo-600/80 dark:text-indigo-300/80',
    bg: 'bg-indigo-600 hover:bg-indigo-500',
    hoverBg: 'hover:bg-indigo-500',
    bgSoft: 'bg-indigo-50 dark:bg-indigo-950/30',
    bgSoftGlow: 'bg-indigo-500/10',
    border: 'border-indigo-500',
    borderSoft: 'border-indigo-200 dark:border-indigo-800/40',
    hoverBorder: 'hover:border-indigo-500/60',
    shadow: 'shadow-indigo-500/10',
    shadowMd: 'shadow-indigo-500/20',
    spotlightRgb: '99, 102, 241', // indigo-500
    accentHex: '#6366F1',
    gradientFrom: 'from-indigo-500',
    gradientVia: 'via-purple-500',
    gradientTo: 'to-violet-500',
    groupHoverText: 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400',
    ring: 'focus:ring-indigo-500/50',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    badgeBorder: 'border-indigo-500/30',
  },
  preprocessing: {
    domain: 'preprocessing',
    title: 'Data Preprocessing Agentic Specialist',
    text: 'text-cyan-500 dark:text-cyan-400',
    textMuted: 'text-cyan-600/80 dark:text-cyan-300/80',
    bg: 'bg-cyan-600 hover:bg-cyan-500',
    hoverBg: 'hover:bg-cyan-500',
    bgSoft: 'bg-cyan-50 dark:bg-cyan-950/30',
    bgSoftGlow: 'bg-cyan-500/10',
    border: 'border-cyan-500',
    borderSoft: 'border-cyan-200 dark:border-cyan-800/40',
    hoverBorder: 'hover:border-cyan-500/60',
    shadow: 'shadow-cyan-500/10',
    shadowMd: 'shadow-cyan-500/20',
    spotlightRgb: '6, 182, 212', // cyan-500
    accentHex: '#06B6D4',
    gradientFrom: 'from-cyan-500',
    gradientVia: 'via-blue-500',
    gradientTo: 'to-teal-500',
    groupHoverText: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-400',
    ring: 'focus:ring-cyan-500/50',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
  },
  visualization: {
    domain: 'visualization',
    title: 'Data Visualization Agentic Specialist',
    text: 'text-purple-500 dark:text-purple-400',
    textMuted: 'text-purple-600/80 dark:text-purple-300/80',
    bg: 'bg-purple-600 hover:bg-purple-500',
    hoverBg: 'hover:bg-purple-500',
    bgSoft: 'bg-purple-50 dark:bg-purple-950/30',
    bgSoftGlow: 'bg-purple-500/10',
    border: 'border-purple-500',
    borderSoft: 'border-purple-200 dark:border-purple-800/40',
    hoverBorder: 'hover:border-purple-500/60',
    shadow: 'shadow-purple-500/10',
    shadowMd: 'shadow-purple-500/20',
    spotlightRgb: '168, 85, 247', // purple-500
    accentHex: '#A855F7',
    gradientFrom: 'from-purple-500',
    gradientVia: 'via-fuchsia-500',
    gradientTo: 'to-pink-500',
    groupHoverText: 'group-hover:text-purple-500 dark:group-hover:text-purple-400',
    ring: 'focus:ring-purple-500/50',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
    badgeBorder: 'border-purple-500/30',
  },
};

/**
 * Resolve Role Theme Tokens from a domain key or course name
 */
export function getRoleTheme(domainOrName: string): RoleThemeTokens {
  const normalized = domainOrName.toLowerCase();
  
  if (normalized.includes('seo') || normalized === 'seo') {
    return roleThemes.seo;
  }
  if (normalized.includes('accountant') || normalized.includes('accounting') || normalized === 'accountant') {
    return roleThemes.accountant;
  }
  if (normalized.includes('commerce') || normalized === 'commerce') {
    return roleThemes.commerce;
  }
  if (normalized.includes('recommendation') || normalized.includes('recommender') || normalized === 'recommendation') {
    return roleThemes.recommendation;
  }
  if (normalized.includes('preprocess') || normalized === 'preprocessing') {
    return roleThemes.preprocessing;
  }
  if (normalized.includes('visual') || normalized === 'visualization') {
    return roleThemes.visualization;
  }
  
  // Default fallback to Indigo (recommendation)
  return roleThemes.recommendation;
}

/**
 * Difficulty Badge Styling Configuration
 */
export interface DifficultyBadgeInfo {
  label: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
}

export function getDifficultyBadge(difficulty: Difficulty | NormalizedDifficulty | string): DifficultyBadgeInfo {
  const norm = (difficulty || 'easy').toLowerCase();
  
  if (norm === 'hard') {
    return {
      label: 'Hard',
      badgeClass: 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30',
      dotClass: 'bg-rose-500',
      borderClass: 'border-rose-500/30',
      textClass: 'text-rose-500 dark:text-rose-400',
      glowClass: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    };
  }
  
  if (norm === 'medium') {
    return {
      label: 'Medium',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      dotClass: 'bg-amber-500',
      borderClass: 'border-amber-500/30',
      textClass: 'text-amber-600 dark:text-amber-400',
      glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    };
  }
  
  // Default: Easy
  return {
    label: 'Easy',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    dotClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  };
}

/**
 * Career Level Badge Styling
 */
export function getCareerLevelBadge(level: CareerLevel | string): {
  label: string;
  badgeClass: string;
} {
  const lvl = level as CareerLevel;
  
  switch (lvl) {
    case 'Senior Agentic Architect':
      return {
        label: 'Senior Architect',
        badgeClass: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30',
      };
    case 'Mid AI Engineer':
      return {
        label: 'Mid AI Engineer',
        badgeClass: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      };
    case 'Junior AI Analyst':
    default:
      return {
        label: 'Junior Analyst',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      };
  }
}
