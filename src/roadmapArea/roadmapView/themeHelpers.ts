export const getThemeColorClass = (courseName: string) => {
  return {
    text: "text-green-400 dark:text-green-400",
    bg: "bg-black hover:bg-slate-900",
    hoverBg: "hover:bg-slate-900",
    shadow: "shadow-green-500/10",
    border: "border-blue-900",
    borderSoft: "border-blue-900/50 dark:border-blue-900/50",
    gradientFrom: "from-black dark:from-black",
    gradientVia: "via-blue-950 dark:via-blue-950",
    gradientTo: "to-green-900",
    bgSoft: "bg-black/40 dark:bg-black/40",
    bgSoftGlow: "bg-green-500/10",
    shadowMd: "shadow-green-500/20",
    hoverShadow: "hover:shadow-green-500/10",
    groupHoverGradientFrom: "group-hover:from-black dark:group-hover:from-black",
    groupHoverGradientVia: "group-hover:via-blue-900 dark:group-hover:via-blue-900",
    groupHoverGradientTo: "group-hover:to-green-900",
    hoverBorder: "hover:border-green-500/50",
    hoverShadowMd: "hover:shadow-green-500/20",
    groupHoverText: "group-hover:text-green-400 dark:group-hover:text-green-400",
  };
};
