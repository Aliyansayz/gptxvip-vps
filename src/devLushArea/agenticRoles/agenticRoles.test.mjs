import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { industryRoleChapters } from './data/industryRoleChapters.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(HERE, 'data');

// Only modules whose imports are all type-only survive Node's type stripping
// without a bundler, so the role definitions are read from source rather than
// imported. Everything asserted below is a hand-maintained literal somewhere,
// and this is the check that keeps those literals agreeing with each other.

const read = (relative) => readFileSync(path.join(HERE, relative), 'utf8');

const registrySource = read('agenticRolesRegistry.ts');
const definitionsSource = read(path.join('data', 'index.ts'));
const themeSource = read('agenticThemeHelpers.ts');
const iconsSource = read(path.join('views', 'components', 'roleIcons.ts'));

/** Quoted keys of the exported registry object. */
const registryIds = new Set(
  [...registrySource.matchAll(/^\s*'([a-z0-9-]+-[a-z0-9-]+)':\s*\w+Activity,/gm)].map((match) => match[match.length - 1]),
);

/** Role ids declared in the definitions array. */
const declaredRoles = [...definitionsSource.matchAll(/\bid:\s*'([a-z0-9-]+)',\s*title:/g)].map((match) => match[1]);
const declaredDomains = [...definitionsSource.matchAll(/roleDomain:\s*'([a-z0-9]+)'/g)].map((match) => match[1]);

/** Chapter ids from the JSON role datasets, which node can read natively. */
const jsonChapterIds = readdirSync(DATA_DIR)
  .filter((name) => name.startsWith('agentic') || name.includes('Analytic') || name.startsWith('data') || name.startsWith('seo'))
  .filter((name) => name.endsWith('.json'))
  .flatMap((name) => JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8')).map((chapter) => chapter.labComponentId));

const caseChapterIds = Object.values(industryRoleChapters).flat().map((chapter) => chapter.labComponentId);
const allChapterIds = [...jsonChapterIds, ...caseChapterIds];

test('the role definitions cover every chapter source', () => {
  // One definition per data source group; guards against a dataset that was
  // added to the raw array but never given a role of its own.
  const domains = new Set(declaredDomains);
  for (const domain of Object.keys(industryRoleChapters)) {
    assert.ok(domains.has(domain), `${domain} has chapters but no role definition`);
  }
  assert.ok(declaredRoles.length >= 11, `expected 11+ roles, found ${declaredRoles.length}`);
  assert.equal(new Set(declaredRoles).size, declaredRoles.length, 'role ids must be unique');
});

test('every chapter id is unique', () => {
  const seen = new Set();
  const duplicates = allChapterIds.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
  assert.deepEqual(duplicates, [], `duplicate labComponentId: ${duplicates.join(', ')}`);
});

/**
 * Chapters that render through `FallbackRoleActivity` instead of a bespoke lab.
 *
 * These are pre-existing debt, not an oversight in the current work: the four
 * `industryRoleChapters` verticals (mobility, retail, procurement, contracts)
 * and days 6-7 of the six original roles ship case-shaped labs rather than
 * bespoke components. They are listed so the count can only fall — adding a
 * new chapter without a component fails the test, and giving one of these a
 * component means deleting its line here.
 */
const LEGACY_FALLBACK_CHAPTERS = new Set([
  'seo-day6-local-search-demand-and-branch-coverage',
  'seo-day7-search-revenue-attribution-and-content-refresh',
  'accountant-day6-invoice-po-and-goods-receipt-reconciliation',
  'accountant-day7-cash-collection-and-receivables-risk',
  'commerce-day6-sku-store-replenishment-and-safety-stock',
  'commerce-day7-merchandising-with-margin-and-return-signals',
  'recommendation-day6-retention-aware-saas-feature-recommendations',
  'recommendation-day7-marketplace-availability-and-substitution',
  'preprocessing-day6-mobility-weather-and-event-join-integrity',
  'preprocessing-day7-invoice-extraction-quality-gates',
  'visualization-day6-zone-demand-and-driver-supply-map',
  'visualization-day7-evidence-linked-executive-insight-cards',
  'mobility-day1-trip-feed-validation-and-zone-coverage',
  'mobility-day2-weather-and-event-demand-enrichment',
  'mobility-day3-zone-hour-demand-forecasting',
  'mobility-day4-shortage-anomaly-investigation',
  'mobility-day5-fleet-positioning-recommendation',
  'retail-day1-sku-store-demand-baseline',
  'retail-day2-promotion-and-weather-uplift',
  'retail-day3-lead-time-and-safety-stock',
  'retail-day4-depot-transfer-versus-purchase',
  'retail-day5-replenishment-exception-review',
  'procurement-day1-rfq-and-quotation-normalization',
  'procurement-day2-total-supplier-cost-and-reliability',
  'procurement-day3-po-invoice-receipt-three-way-match',
  'procurement-day4-price-drift-and-supplier-exceptions',
  'procurement-day5-inventory-aware-purchase-decision',
  'contracts-day1-clause-extraction-with-source-evidence',
  'contracts-day2-renewal-and-termination-deadlines',
  'contracts-day3-sla-evidence-and-breach-review',
  'contracts-day4-payment-and-insurance-obligations',
  'contracts-day5-obligation-change-control',
]);

test('new chapters ship a dedicated interactive activity', () => {
  assert.ok(allChapterIds.length > 0, 'chapters are discovered');
  // Anything not on the legacy list must be registered, so a newly added
  // chapter cannot quietly ship on the fallback.
  const unregistered = allChapterIds.filter((id) => !registryIds.has(id) && !LEGACY_FALLBACK_CHAPTERS.has(id));
  assert.deepEqual(
    unregistered,
    [],
    `chapters that would fall back to FallbackRoleActivity:\n  ${unregistered.join('\n  ')}`,
  );
});

test('the legacy fallback list only shrinks and never names a real chapter', () => {
  const known = new Set(allChapterIds);
  const stale = [...LEGACY_FALLBACK_CHAPTERS].filter((id) => !known.has(id));
  assert.deepEqual(stale, [], `legacy entries for chapters that no longer exist:\n  ${stale.join('\n  ')}`);

  const resolved = [...LEGACY_FALLBACK_CHAPTERS].filter((id) => registryIds.has(id));
  assert.deepEqual(
    resolved,
    [],
    `chapters now have a component, so remove them from LEGACY_FALLBACK_CHAPTERS:\n  ${resolved.join('\n  ')}`,
  );
});

test('the registry has no entries for chapters that do not exist', () => {
  const known = new Set(allChapterIds);
  const orphans = [...registryIds].filter((id) => !known.has(id));
  assert.deepEqual(orphans, [], `registry entries with no chapter:\n  ${orphans.join('\n  ')}`);
});

test('every role has a theme entry and resolves its own domain', () => {
  // The definition array's `roleDomain:` values cover both role definitions and
  // the per-chapter domain, so dedupe before checking the theme table.
  for (const domain of new Set(declaredDomains)) {
    assert.ok(
      new RegExp(`\\n\\s{2}${domain}:\\s*\\{`).test(themeSource) || new RegExp(`\\b${domain}:\\s*\\{`).test(themeSource),
      `${domain} has no theme entry`,
    );
    assert.ok(
      new RegExp(`normalized === '${domain}'|normalized\\.includes\\('${domain}'\\)`).test(themeSource),
      `${domain} has no getRoleTheme branch, so it resolves to the default theme`,
    );
  }
});

test('every role has an icon that resolves to a real glyph', () => {
  const iconNames = [...definitionsSource.matchAll(/iconName:\s*'([A-Za-z0-9]+)'/g)].map((match) => match[1]);
  assert.ok(iconNames.length > 0, 'roles declare iconName');
  // Match `Name,` (shorthand) or `Name: Other` (aliased entry).
  const mapBody = iconsSource.slice(iconsSource.indexOf('agenticRoleIconMap'));
  for (const iconName of iconNames) {
    assert.ok(
      new RegExp(`\\n\\s+${iconName}\\s*[,:]`).test(mapBody),
      `${iconName} is missing from agenticRoleIconMap`,
    );
  }
});

test('every chapter declares the fields the runner and read mode read', () => {
  const problems = [];
  for (const group of Object.values(industryRoleChapters)) {
    for (const chapter of group) {
      if (!chapter.chapter_title) problems.push(`${chapter.labComponentId}: missing chapter_title`);
      if (!chapter.theory_content?.content) problems.push(`${chapter.labComponentId}: missing theory content`);
      if (!chapter.critical_concepts?.length) problems.push(`${chapter.labComponentId}: missing key concepts`);
      if (!chapter.interactive_questions?.length) problems.push(`${chapter.labComponentId}: no exercises`);
      for (const exercise of chapter.interactive_questions ?? []) {
        if (exercise.correctAnswerIndex === undefined) problems.push(`${exercise.id}: no correctAnswerIndex`);
        else if (exercise.options[exercise.correctAnswerIndex] !== exercise.answer) {
          problems.push(`${exercise.id}: answer text does not match correctAnswerIndex`);
        }
        if (exercise.options.length !== 4) problems.push(`${exercise.id}: expected 4 options`);
        if (!exercise.explanation) problems.push(`${exercise.id}: no explanation`);
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('case learning flows cover every registered chapter', () => {
  const flowsSource = read(path.join('data', 'caseLearningFlows.ts'));
  const missing = [...registryIds].filter((id) => !flowsSource.includes(`'${id}'`));
  assert.deepEqual(missing, [], `chapters with no reading flow:\n  ${missing.join('\n  ')}`);
});
