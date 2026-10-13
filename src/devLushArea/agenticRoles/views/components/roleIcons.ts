import type { ComponentType } from 'react';
import {
  BarChart3,
  CarTaxiFront,
  Calculator,
  ClipboardList,
  Compass,
  Database,
  FileText,
  Layers,
  PackageSearch,
  Search,
  ShoppingBag,
} from 'lucide-react';

export const agenticRoleIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Search,
  Calculator,
  ShoppingBag,
  Compass,
  Database,
  BarChart2: BarChart3,
  BarChart3,
  CarTaxiFront,
  PackageSearch,
  ClipboardList,
  FileText,
};

export const getAgenticRoleIcon = (iconName: string) => agenticRoleIconMap[iconName] || Layers;

/**
 * Colorful-PNG icon per role domain.
 *
 * Keys are `RoleDomain` values, so a new domain must be added here deliberately
 * rather than silently falling back. Chosen from the packs that were extracted
 * into `public/icons/` — see docs/COLORFUL_ICON_MIGRATION_PLAN.md.
 *
 * Where a domain has no natural subject in the packs, the closest tool-shaped
 * glyph is used (`contract` for contracts, `financial-analytics` for
 * visualisation) rather than a generic one, so adjacent roles never render the
 * same illustration.
 */
const DOMAIN_ICONS: Record<string, string> = {
  seo: 'search-from-code',
  accountant: 'tax-calculator',
  commerce: 'add-to-basket',
  recommendation: 'robot',
  preprocessing: 'laptop-settings',
  visualization: 'financial-analytics',
  mobility: 'gps',
  retail: 'open-box',
  procurement: 'delivery-list',
  contracts: 'contract',
};

/**
 * Resolves the colorful icon for a role domain.
 *
 * Returns the manifest fallback rather than throwing on an unknown domain:
 * `ColorfulIcon` already resolves unknown names to `FALLBACK_ICON`, so a domain
 * added to `RoleDomain` without a mapping here degrades to a valid image instead
 * of a broken `<img>` that shows the browser's torn-page glyph.
 */
export const getAgenticRoleColorfulIcon = (roleDomain: string): string =>
  DOMAIN_ICONS[roleDomain] ?? 'open-box';

