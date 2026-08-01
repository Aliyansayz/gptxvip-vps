export const getThemeColorClass = (courseName: string) => {
  return {
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-700 hover:bg-slate-600",
    hoverBg: "hover:bg-slate-600",
    shadow: "shadow-slate-500/10",
    border: "border-slate-500",
    borderSoft: "border-slate-200/50 dark:border-slate-700/50",
    gradientFrom: "from-slate-700 dark:from-slate-600",
    gradientVia: "via-slate-500 dark:via-indigo-500",
    gradientTo: "to-sky-500",
    bgSoft: "bg-slate-100 dark:bg-slate-800/40",
    bgSoftGlow: "bg-slate-500/10",
    shadowMd: "shadow-slate-500/20",
    hoverShadow: "hover:shadow-slate-500/10",
    groupHoverGradientFrom: "group-hover:from-slate-700 dark:group-hover:from-slate-600",
    groupHoverGradientVia: "group-hover:via-slate-500 dark:group-hover:via-indigo-500",
    groupHoverGradientTo: "group-hover:to-sky-500",
    hoverBorder: "hover:border-slate-500/50",
    hoverShadowMd: "hover:shadow-slate-500/20",
    groupHoverText: "group-hover:text-slate-600 dark:group-hover:text-slate-400",
  };
};
