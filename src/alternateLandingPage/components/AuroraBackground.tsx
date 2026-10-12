import {
  AuroraBackground as SharedAuroraBackground,
  type AuroraTheme,
} from "../../shared/components/atmosphere/AuroraBackground";

interface AuroraBackgroundProps {
  theme?: AuroraTheme;
}

/**
 * Basalt is a dark surface, so this root mounts the shared atmosphere in its
 * `dark` theme. Kept as a thin wrapper so `landing.css` stays the single owner
 * of the page shell and the atmosphere keeps one implementation across roots.
 */
export function AuroraBackground({ theme = 'dark' }: AuroraBackgroundProps) {
  return <SharedAuroraBackground theme={theme} showGrain />;
}

export default AuroraBackground;