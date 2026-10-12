import { useId } from 'react';
import { FALLBACK_ICON, ICON_REGISTRY, type IconKey, type IconPack } from './manifest';

export interface ColorfulIconProps {
  /**
   * Registry key, e.g. "tax-calculator". Use `pack` only for one-off icons that
   * are not in the registry yet.
   */
  name: IconKey | string;
  /** Pack directory. Optional when `name` is a registry key. */
  pack?: IconPack;
  /** Render size in px. Drives both the box and the `srcset` request. */
  size?: number;
  className?: string;
  /**
   * Supply when the icon carries meaning on its own. Omitted, the icon is
   * decorative and hidden from assistive tech — matching how the Lucide icons
   * these replace were used.
   */
  title?: string;
}

/**
 * Source PNGs are 1024² (cyber 512²). We advertise a 64px and 256px candidate so
 * retina hero surfaces stay crisp without paying the full-size download.
 */
const VARIANTS = [64, 256] as const;

const PACK_DIR: Record<IconPack, string> = {
  accounting: 'accounting',
  delivery: 'delivery',
  cyber: 'cyber',
  it: 'it',
};

export function resolveIcon(
  name: string,
  pack?: IconPack
): { name: string; pack: IconPack } {
  const known = Object.prototype.hasOwnProperty.call(ICON_REGISTRY, name);
  if (known) return { name, pack: ICON_REGISTRY[name as IconKey] };
  if (pack) return { name, pack };
  return FALLBACK_ICON;
}

/**
 * Shared colorful-PNG icon primitive. Every colorful icon in the app renders
 * through this component so sizing, srcset, and a11y behaviour stay consistent.
 */
export function ColorfulIcon({
  name,
  pack,
  size = 24,
  className,
  title,
}: ColorfulIconProps) {
  const resolved = resolveIcon(name, pack);
  const dir = PACK_DIR[resolved.pack];
  const base = `/icons/${dir}/${resolved.name}`;
  const labelId = useId();

  return (
    <img
      src={`${base}-256.png`}
      srcSet={VARIANTS.map((v) => `${base}-${v}.png ${v}w`).join(', ')}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={title ?? ''}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? labelId : undefined}
      draggable={false}
      // object-contain: these packs pad unevenly, so cover would crop glyphs.
      className={`shrink-0 object-contain ${className ?? ''}`}
    />
  );
}

export default ColorfulIcon;
