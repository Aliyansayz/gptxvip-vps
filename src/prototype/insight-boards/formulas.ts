import type { UsageRecord } from "./data";
import { allowed } from "./data";
export const scopedUsage = (
  rows: UsageRecord[],
  tenantId: string,
  role: string,
) =>
  rows.filter(
    (r) => r.tenantId === tenantId && allowed(role).includes(r.metric),
  );
export const metricTotal = (rows: UsageRecord[], metric: string) =>
  rows.filter((r) => r.metric === metric).reduce((s, r) => s + r.value, 0);
export const embedUrl = (origin: string, tenant: string, role: string) =>
  `${origin}/agents/prototypes/insight-boards?tenant=${encodeURIComponent(tenant)}&role=${encodeURIComponent(role)}&embed=1`;
/** Accent is a white-text button surface in both themes: require WCAG AA 4.5:1. */
export const validAccent = (value: string) => {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return false;
  const rgb = [1, 3, 5]
    .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  return 1.05 / (luminance + 0.05) >= 4.5;
};
