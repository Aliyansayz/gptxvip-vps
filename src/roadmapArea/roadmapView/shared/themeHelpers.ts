export const getThemeColorClass = (courseName: string) => {
  return {
    text: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-600 dark:bg-teal-600",
    hoverBg: "hover:bg-teal-700 dark:hover:bg-teal-500",
    shadow: "shadow-teal-500/10",
    border: "border-teal-200 dark:border-teal-800",
    borderSoft: "border-teal-200/50 dark:border-teal-800/50",
    gradientFrom: "from-teal-400 dark:from-teal-400",
    gradientVia: "via-cyan-500 dark:via-cyan-500",
    gradientTo: "to-blue-500",
    bgSoft: "bg-slate-100/40 dark:bg-slate-900/40",
    bgSoftGlow: "bg-teal-500/10",
    shadowMd: "shadow-teal-500/20",
    hoverShadow: "hover:shadow-teal-500/10",
    groupHoverGradientFrom: "group-hover:from-teal-400 dark:group-hover:from-teal-400",
    groupHoverGradientVia: "group-hover:via-cyan-500 dark:group-hover:via-cyan-500",
    groupHoverGradientTo: "group-hover:to-blue-500",
    hoverBorder: "hover:border-teal-500/50",
    hoverShadowMd: "hover:shadow-teal-500/20",
    groupHoverText: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
  };
};
