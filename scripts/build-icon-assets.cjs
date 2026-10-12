#!/usr/bin/env node
// Build pipeline for the colorful PNG icon migration.
//
// Reads the source icon packs, resamples each referenced icon to the two
// variants the <ColorfulIcon> component requests (64 / 256), and writes them to
// public/icons/<pack>/<key>-<size>.png.
//
// Why the icons are raster PNGs and not SVG: the source packs ship colour that
// is intrinsic to the artwork (multicolour gradients per glyph), so there is
// nothing for `currentColor` to theme. See docs/COLORFUL_ICON_MIGRATION_PLAN.md.
//
// sharp is a hard requirement here — a build-time-only devDependency that never
// enters the client bundle. Palette quantisation is applied because measurement
// showed it is byte-identical to 256-colour for these assets while cutting
// output ~43%, and it removes per-channel rounding that makes downscaled
// gradient art look banded.
//
// Usage:
//   npm run icons:build              build (idempotent; clears output first)
//   npm run icons:build -- --verify  re-verify existing output only

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = 'C:\\Users\\Aliyan\\Pictures\\icons';
const DEST = path.join(ROOT, 'public', 'icons');

// Emitted variants. 64 is the 1x fallback in srcset, 256 covers 2x/3x DPR for
// every size we actually render (16 -> 48px).
const VARIANTS = [64, 256];

const PACKS = {
  accounting: path.join(SRC, '50-Accounting-Finance-Filled-33340025', '227 - Accounting & Finance - 13.Linear Multicolor (A1 B99)', 'PNG', '1024 x 1024'),
  delivery: path.join(SRC, '50-Delivery-and-Logistics-Line-33340299', '230 - Delivery and Logistics - 13.Linear Multicolor (A1 B99)', 'PNG', '1024 x 1024'),
  cyber: path.join(SRC, 'Cyber-Security-Icon-Pack-37303033', 'Filled Color', 'PNG'),
  it: path.join(SRC, '45-Information-Technology-Flat-Icons-83944049', '196.S2 - Information Technology - 10.Flat Multicolor (A4 B99)', 'PNG'),
};

// [pack, source filename stem, destination key]
const MAP = [
  // §3.1 software manual
  ['accounting', '10836 - Financial Statistics', 'financial-statistics'],
  ['accounting', '10834 - Financial Graph Growth', 'financial-graph-growth'],
  ['accounting', '10835 - Financial Report', 'financial-report'],
  ['accounting', '10826 - Contract', 'contract'],
  ['delivery', '10972 - Container', 'container'],
  ['delivery', '11004 - Support', 'support'],
  ['cyber', 'shield', 'shield'],
  ['it', '9298.S2---Telescope', 'telescope'],
  // §3.2 agents
  ['it', '9292.S2---Search-from-Code', 'search-from-code'],
  ['accounting', '10861 - Tax Calculator', 'tax-calculator'],
  ['it', '9329.S2---Add-to-Basket', 'add-to-basket'],
  ['delivery', '10987 - Gps', 'gps'],
  ['cyber', 'server', 'server'],
  ['accounting', '10832 - Financial Analytics', 'financial-analytics'],
  ['delivery', '10964 - Air Transport', 'air-transport'],
  ['delivery', '10994 - Package For Delivery', 'package-for-delivery'],
  ['delivery', '10979 - Delivery List', 'delivery-list'],
  ['delivery', '10978 - Delivery File', 'delivery-file'],
  ['delivery', '10993 - Open Box', 'open-box'],
  // §3.3 pillars
  ['it', '9293.S2---Robot', 'robot'],
  ['it', '9320.S2---Articles', 'articles'],
  // §3.4 verticals
  ['it', '9305.S2---Laptop-Settings', 'laptop-settings'],
  ['delivery', '10969 - Cargo Boat', 'cargo-boat'],
  ['cyber', 'alert', 'alert'],
];

function requireSharp() {
  try {
    return require('sharp');
  } catch (err) {
    console.error('sharp is required to build icon assets.');
    console.error('It is a devDependency — run: npm install');
    console.error(`underlying error: ${err.message}`);
    process.exit(1);
  }
}

// Fail fast on typos, duplicates and missing sources rather than emitting a
// half-populated public/icons that only breaks at runtime in the browser.
function validate() {
  const problems = [];
  const seen = new Map();

  if (!fs.existsSync(SRC)) {
    problems.push(`source pack root not found: ${SRC}`);
  }

  for (const [pack, srcName, key] of MAP) {
    if (!PACKS[pack]) {
      problems.push(`${key}: unknown pack "${pack}"`);
      continue;
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) {
      problems.push(`${key}: key is not kebab-case`);
    }
    if (seen.has(key)) {
      problems.push(`${key}: duplicate key (also ${seen.get(key)})`);
    } else {
      seen.set(key, `${pack}/${srcName}`);
    }
    if (!fs.existsSync(path.join(PACKS[pack], `${srcName}.png`))) {
      problems.push(`${key}: missing source ${pack}/${srcName}.png`);
    }
  }

  return problems;
}

// Resample one icon to every variant. `fit: inside` + `withoutEnlargement`
// keeps square sources square and never upscales the 512px cyber pack.
async function buildIcon(sharp, srcFile, outDir, key) {
  const meta = await sharp(srcFile).metadata();
  if (meta.width !== meta.height) {
    throw new Error(`source is ${meta.width}x${meta.height}, expected square`);
  }
  if (!meta.hasAlpha) {
    throw new Error(`source has no alpha channel`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const size of VARIANTS) {
    const buffer = await sharp(srcFile)
      .resize(size, size, { fit: `inside`, withoutEnlargement: true })
      .png({ palette: true, compressionLevel: 9, effort: 10 })
      .toBuffer();
    fs.writeFileSync(path.join(outDir, `${key}-${size}.png`), buffer);
  }
}

// Re-open every emitted file and assert the contract the component relies on.
async function verifyOutput(sharp) {
  const problems = [];
  let files = 0;
  let bytes = 0;

  for (const [pack, , key] of MAP) {
    for (const size of VARIANTS) {
      const file = path.join(DEST, pack, `${key}-${size}.png`);
      if (!fs.existsSync(file)) {
        problems.push(`${pack}/${key}-${size}.png: not found`);
        continue;
      }
      const meta = await sharp(file).metadata();
      const stat = fs.statSync(file);
      files++;
      bytes += stat.size;

      if (meta.format !== `png`) problems.push(`${pack}/${key}-${size}.png: not a PNG`);
      if (!meta.hasAlpha) problems.push(`${pack}/${key}-${size}.png: alpha channel lost`);
      if (meta.width !== size || meta.height !== size) {
        problems.push(`${pack}/${key}-${size}.png: is ${meta.width}x${meta.height}, expected ${size}x${size}`);
      }
      if (stat.size === 0) problems.push(`${pack}/${key}-${size}.png: empty file`);
    }
  }

  return { problems, files, bytes };
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
async function main() {
  const sharp = requireSharp();
  const verifyOnly = process.argv.includes(`--verify`);

  const problems = validate();
  if (problems.length) {
    console.error(`Validation failed:`);
    problems.forEach((p) => console.error(`  ` + p));
    process.exit(1);
  }

  if (verifyOnly) {
    const r = await verifyOutput(sharp);
    if (r.problems.length) {
      console.error(`icons:verify FAILED (${r.problems.length} problem(s))`);
      r.problems.slice(0, 20).forEach((p) => console.error(`  ` + p));
      process.exit(1);
    }
    console.log(`icons:verify OK - ${r.files} files, ${(r.bytes / 1024).toFixed(0)} KB, all square/PNG/alpha intact`);
    return;
  }

  // Idempotent: clear previous output so stale icons cannot linger.
  for (const f of walk(DEST)) {
    if (f.endsWith(`.png`)) fs.rmSync(f);
  }

  const registry = {};
  let before = 0;
  let after = 0;

  for (const [pack, srcName, key] of MAP) {
    const srcFile = path.join(PACKS[pack], `${srcName}.png`);
    before += fs.statSync(srcFile).size;

    try {
      await buildIcon(sharp, srcFile, path.join(DEST, pack), key);
      registry[key] = pack;
    } catch (err) {
      console.error(`  FAILED ${pack}/${key}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  const r = await verifyOutput(sharp);
  if (r.problems.length) {
    console.error(`Output verification failed:`);
    r.problems.forEach((p) => console.error(`  ` + p));
    process.exit(1);
  }
  after = r.bytes;

  fs.writeFileSync(path.join(DEST, `_registry.json`), `${JSON.stringify(registry, null, 2)}
`);

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`icons:built ${Object.keys(registry).length} icons -> ${path.relative(ROOT, DEST)}`);
  console.log(`variants: ${VARIANTS.map((v) => `${v}px`).join(` + `)}`);
  console.log(`source: ${kb(before)}  output: ${kb(after)}  (${r.files} files, ${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});