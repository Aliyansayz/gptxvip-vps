import type { CSSProperties } from "react";

const palette = {
  neutral: {
    "100": "#F4F6F8",
    "200": "#DCE1E8",
    "300": "#B8C0CD",
    "400": "#8E99A9",
    "500": "#657183",
    "600": "#465263",
    "700": "#303B4A",
    "800": "#202A38",
    "900": "#111A27",
  },
  blue: {
    "100": "#E8F2FF",
    "200": "#BEDBFF",
    "300": "#8BC0FF",
    "400": "#5BA4FF",
    "500": "#368BFA",
    "600": "#2474E8",
    "700": "#1E5EC0",
    "800": "#1D4A94",
    "900": "#1B396D",
  },
} as const;

export const tokens = {
  color: {
    canvas: "#0B111C",
    onPrimary: "#FFFFFF",
    onDanger: "#0B111C",
    surface: palette.neutral["900"],
    raised: palette.neutral["800"],
    text: palette.neutral["100"],
    secondary: palette.neutral["300"],
    muted: palette.neutral["400"],
    border: palette.neutral["700"],
    borderStrong: palette.neutral["600"],
    primary: palette.blue["700"],
    hover: palette.blue["800"],
    pressed: palette.blue["900"],
    focus: palette.blue["300"],
    success: "#4DD6A3",
    warning: "#F4BA60",
    error: "#F17D89",
    info: palette.blue["400"],
  },
  palette,
  spacing: [4, 8, 12, 16, 24, 32, 48, 64],
  radius: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    FULL: 999,
  },
  elevation: {
    base: "none",
    panel: "0 5px 12px #0006",
    overlay: "0 10px 18px #000b",
  },
  typography: [
    {
      name: "display",
      fontSize: 40,
      lineHeight: 48,
      fontWeight: 600,
      sample: "Build with clarity.",
    },
    {
      name: "h2",
      fontSize: 30,
      lineHeight: 38,
      fontWeight: 600,
      sample: "Automation at scale",
    },
    {
      name: "h3",
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 600,
      sample: "A connected workspace",
    },
    {
      name: "h4",
      fontSize: 18,
      lineHeight: 26,
      fontWeight: 600,
      sample: "Workflow settings",
    },
    {
      name: "body-lg",
      fontSize: 16,
      lineHeight: 26,
      fontWeight: 400,
      sample: "Make every process visible and reliable.",
    },
    {
      name: "body",
      fontSize: 14,
      lineHeight: 22,
      fontWeight: 400,
      sample: "A clear system makes complex work feel simple.",
    },
    {
      name: "label",
      fontSize: 12,
      lineHeight: 18,
      fontWeight: 600,
      sample: "ACTIVE WORKFLOWS",
    },
    {
      name: "caption",
      fontSize: 11,
      lineHeight: 16,
      fontWeight: 400,
      sample: "Updated 2 minutes ago",
    },
  ],
} as const;

export const tokenStyles = Object.fromEntries([
  ...Object.entries(tokens.color).map(([key, value]) => [`--ds-${key}`, value]),
  ...Object.entries(tokens.radius).map(([key, value]) => [
    `--ds-radius-${key.toLowerCase()}`,
    `${value}px`,
  ]),
  ...Object.entries(tokens.elevation).map(([key, value]) => [
    `--ds-elevation-${key}`,
    value,
  ]),
  ...tokens.spacing.map((value) => [`--ds-space-${value}`, `${value}px`]),
]) as CSSProperties;
export const tokenJSON = JSON.stringify(tokens, null, 2);
export function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) =>
    [0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
      const v = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
      return (
        sum + weight * (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      );
    }, 0);
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
