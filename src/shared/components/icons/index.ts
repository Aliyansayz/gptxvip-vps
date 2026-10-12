/**
 * Root icon components.
 *
 * `ColorfulIcon` renders the purchased colorful PNG packs; `LucideIconSlot` is
 * the drop-in wrapper for cases where a monochrome stroke glyph is still the
 * right choice (icons below ~20px, or anything that must recolour on hover).
 *
 * See docs/COLORFUL_ICON_MIGRATION_PLAN.md.
 */
export { ColorfulIcon, resolveIcon } from './ColorfulIcon';
export type { ColorfulIconProps } from './ColorfulIcon';

export {
  ICON_REGISTRY,
  FALLBACK_ICON,
} from './manifest';
export type { IconKey, IconPack } from './manifest';
