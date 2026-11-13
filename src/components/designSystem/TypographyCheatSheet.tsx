import React, { useState } from 'react';
import {
  Type,
  Sliders,
  Ruler,
  Layers,
  Square,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  X,
  Keyboard,
  Table,
  Lightbulb,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Sparkles,
  BookOpen,
  Cpu,
  Feather,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

type PresetKey = 'saas' | 'editorial' | 'tech' | 'longform' | 'bad';

interface Preset {
  name: string;
  label: string;
  heading: string;
  body: string;
  mono: string;
  measure: number;
  lh: number;
  size: number;
  tracking: number;
}

const PRESETS: Record<PresetKey, Preset> = {
  saas: {
    name: 'Modern SaaS (Inter)',
    label: 'ACTIVE STACK: INTER (HEADINGS) + INTER (BODY)',
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    measure: 62,
    lh: 1.6,
    size: 16,
    tracking: -0.025,
  },
  editorial: {
    name: 'Editorial (Playfair + Sans)',
    label: 'ACTIVE STACK: PLAYFAIR DISPLAY (SERIF) + PLUS JAKARTA SANS (BODY)',
    heading: "'Playfair Display', Georgia, serif",
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    measure: 60,
    lh: 1.65,
    size: 17,
    tracking: -0.015,
  },
  tech: {
    name: 'Fintech (Space Grotesk + Jakarta)',
    label: 'ACTIVE STACK: SPACE GROTESK (DISPLAY) + PLUS JAKARTA SANS (BODY)',
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    measure: 64,
    lh: 1.6,
    size: 16,
    tracking: -0.03,
  },
  longform: {
    name: 'Long-Form (Merriweather Serif)',
    label: 'ACTIVE STACK: PLUS JAKARTA SANS (HEADING) + MERRIWEATHER (SERIF BODY)',
    heading: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Merriweather', Georgia, serif",
    mono: "'JetBrains Mono', monospace",
    measure: 58,
    lh: 1.75,
    size: 17,
    tracking: -0.02,
  },
  bad: {
    name: 'Cramped 115ch (Bad UX)',
    label: '⚠️ BAD UX: 115ch MEASURE + 1.15 LINE-HEIGHT + LOOSE TRACKING',
    heading: "'Courier New', monospace",
    body: "'Inter', sans-serif",
    mono: "'Courier New', monospace",
    measure: 115,
    lh: 1.15,
    size: 13,
    tracking: 0.08,
  },
};

export const TypographyCheatSheet: React.FC = () => {
  // --- 1. Type Lab State ---
  const [activePreset, setActivePreset] = useState<PresetKey>('saas');
  const [measure, setMeasure] = useState<number>(62);
  const [lineHeight, setLineHeight] = useState<number>(1.6);
  const [baseSize, setBaseSize] = useState<number>(16);
  const [tracking, setTracking] = useState<number>(-0.025);
  const [headingFont, setHeadingFont] = useState<string>(PRESETS.saas.heading);
  const [bodyFont, setBodyFont] = useState<string>(PRESETS.saas.body);

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = PRESETS[key];
    setMeasure(p.measure);
    setLineHeight(p.lh);
    setBaseSize(p.size);
    setTracking(p.tracking);
    setHeadingFont(p.heading);
    setBodyFont(p.body);
    toast.success(`Applied ${p.name} preset!`);
  };

  const isErgonomic = measure >= 45 && measure <= 75 && lineHeight >= 1.45 && lineHeight <= 1.8 && baseSize >= 15;

  // --- 2. Interactive Bad/Good Demos ---
  const [demoModes, setDemoModes] = useState<Record<string, 'bad' | 'good'>>({
    ff: 'good',
    para: 'good',
    scale: 'good',
    cont: 'good',
    tbox: 'good',
  });

  const toggleDemo = (section: string, mode: 'bad' | 'good') => {
    setDemoModes((prev) => ({ ...prev, [section]: mode }));
  };

  // --- 3. Concentric Radius Demo ---
  const [containerPad, setContainerPad] = useState<number>(20);
  const innerRadius = 12;
  const outerRadius = innerRadius + Math.round(containerPad * 0.6);

  // --- 4. Interactive Textarea Character Count ---
  const [bioText, setBioText] = useState(
    'Designing accessible typography, clean containers, and ergonomic text boxes.'
  );

  // --- 5. Tabular Numerals Toggle ---
  const [isTabular, setIsTabular] = useState<boolean>(true);

  // --- 6. 15-Point Audit Checklist ---
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChecks = 15;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const scorePercent = Math.round((checkedCount / totalChecks) * 100);

  const resetChecklist = () => {
    setCheckedItems({});
    toast.info('Typography Audit Checklist reset.');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="w-full space-y-16 text-slate-900 dark:text-slate-100 font-sans antialiased text-left">
      {/* 5 Golden Rules Summary Cards Strip */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>90% of Web Design Is Typography &amp; Containers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight text-balance">
          Typography, Paragraphs, Containers &amp; Text Boxes{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
            Design Engineering System
          </span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-[68ch] leading-relaxed text-pretty">
          Users do not just visit interfaces—they <strong>read</strong> and <strong>type</strong> inside them. Pairing resilient <code>font-family</code> stacks and <code>65ch</code> paragraphs with well-padded layout containers and ergonomic <code>16px</code> input boxes creates effortless comprehension.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">01 / FONT FAMILY</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Max 2–3 Font Families</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">1 Display Heading + 1 tall-x-height Body + 1 Monospace for metrics.</p>
            </div>
            <code className="mt-3 text-[11px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-1 rounded block truncate">
              font-family: 'Inter', system-ui;
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider">02 / MEASURE</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">45ch to 75ch Line Width</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">65 characters sweet spot prevents return-sweep reading fatigue.</p>
            </div>
            <code className="mt-3 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-1 rounded block truncate">
              p &#123; max-width: 65ch; &#125;
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400 mb-1 uppercase tracking-wider">03 / LINE HEIGHT</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">1.5–1.65 Body / 1.15 H1</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unitless values allow proportional child element scaling.</p>
            </div>
            <code className="mt-3 text-[11px] font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2 py-1 rounded block truncate">
              line-height: 1.6; /* unitless */
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">04 / FLUID SCALE</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Use rem &amp; clamp()</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Never hardcode small px; respect user browser accessibility zoom.</p>
            </div>
            <code className="mt-3 text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-2 py-1 rounded block truncate">
              font-size: clamp(1.8rem, 3vw, 3rem);
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wider">05 / INPUTS &amp; BOXES</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Concentric &amp; 16px Inputs</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Concentric padding, 16px inputs prevent iOS auto-zoom, resize-y.</p>
            </div>
            <code className="mt-3 text-[11px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-1 rounded block truncate">
              R_out = R_in + padding;
            </code>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE TYPE LAB & PAIRING SIMULATOR
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-sky-50/40 to-transparent dark:from-indigo-950/30 dark:via-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold uppercase">
                Interactive Type Lab
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-slate-900 dark:text-white text-balance">
                Live Font Pairing &amp; Paragraph Ergonomics Simulator
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl text-pretty">
                Test curated industry font pairings or drag the sliders to observe how <strong>Measure (`ch`)</strong>, <strong>Line-Height</strong>, and <strong>Tracking (`em`)</strong> govern readability in real time.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('saas')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activePreset === 'saas' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Modern SaaS (Inter)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('editorial')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activePreset === 'editorial' ? 'bg-slate-800 text-amber-300 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Editorial (Playfair + Sans)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tech')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activePreset === 'tech' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Fintech (Space Grotesk)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('longform')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activePreset === 'longform' ? 'bg-sky-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Long-Form (Merriweather)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bad')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activePreset === 'bad' ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 hover:bg-rose-200'}`}
              >
                Cramped 115ch (Bad UX)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Controls + Live Specimen (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Paragraph Measure (<code>max-width</code>)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{measure}ch {measure >= 45 && measure <= 75 ? '(Optimal)' : measure < 45 ? '(Narrow)' : '(Too Wide)'}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="115"
                  value={measure}
                  onChange={(e) => setMeasure(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>30ch</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">45–75ch Sweet Spot</span>
                  <span>115ch</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Body Line-Height (Leading)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{lineHeight.toFixed(2)} {lineHeight >= 1.5 && lineHeight <= 1.75 ? '(Optimal)' : lineHeight < 1.5 ? '(Tight)' : '(Loose)'}</span>
                </div>
                <input
                  type="range"
                  min="1.05"
                  max="2.10"
                  step="0.05"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1.05 (Cramped)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1.50–1.65 Ideal</span>
                  <span>2.10</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Base Body Size (<code>font-size</code>)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{baseSize}px ({(baseSize / 16).toFixed(2)}rem)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  value={baseSize}
                  onChange={(e) => setBaseSize(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>12px</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">16px Standard</span>
                  <span>22px</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Heading Tracking (<code>letter-spacing</code>)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{tracking}em</span>
                </div>
                <input
                  type="range"
                  min="-0.06"
                  max="0.10"
                  step="0.005"
                  value={tracking}
                  onChange={(e) => setTracking(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>-0.06em</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">-0.03em to -0.01em</span>
                  <span>+0.10em</span>
                </div>
              </div>
            </div>

            {/* Live Specimen Preview */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">
                  {PRESETS[activePreset].label}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isErgonomic
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {isErgonomic ? '✓ Ergonomic Reading Zone' : '⚠️ Outside Optimal Readability Zone'}
                </span>
              </div>

              <article style={{ maxWidth: `${measure}ch` }}>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-indigo-600 dark:text-indigo-400 mb-2">
                  Cognitive Ergonomics &bull; 4 Min Read
                </div>
                <h4
                  style={{
                    fontFamily: headingFont,
                    letterSpacing: `${tracking}em`,
                    lineHeight: 1.15,
                  }}
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white wrap-balance"
                >
                  Why Paragraph Measure and Line-Height Dictate User Retention
                </h4>
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: `${baseSize}px`,
                    lineHeight: lineHeight,
                  }}
                  className="mt-4 text-slate-600 dark:text-slate-300 wrap-pretty"
                >
                  When a paragraph stretches across an entire 1440px monitor, the human eye struggles to track from the end of one line back to the beginning of the next—a phenomenon known as <strong>return-sweep error</strong>. Constraining paragraphs to <code>60ch–70ch</code> honors <strong>Miller's Law</strong> and lets readers scan effortlessly.
                </p>
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: `${baseSize}px`,
                    lineHeight: lineHeight,
                  }}
                  className="mt-4 text-slate-600 dark:text-slate-300 wrap-pretty"
                >
                  Notice how spacing between paragraphs (<code>margin-bottom: 1.25em</code>) creates distinct visual chunks without requiring indentation, while tabular monospace numerals like{' '}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                    $48,290.00
                  </code>{' '}
                  keep financial metrics aligned.
                </p>
              </article>
            </div>
          </div>

          {/* Generated Code (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-900 text-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                  Live Generated CSS Type Tokens
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `:root {\n  --font-heading: ${headingFont};\n  --font-body: ${bodyFont};\n  --body-size: ${(baseSize / 16).toFixed(3)}rem;\n  --body-line-height: ${lineHeight.toFixed(2)};\n  --body-measure: ${measure}ch;\n  --heading-tracking: ${tracking}em;\n}\n\nh1, h2, h3 {\n  font-family: var(--font-heading);\n  letter-spacing: var(--heading-tracking);\n  line-height: 1.15;\n  text-wrap: balance;\n}\n\np {\n  font-family: var(--font-body);\n  font-size: var(--body-size);\n  line-height: var(--body-line-height);\n  max-width: var(--body-measure);\n  margin-bottom: 1.25em;\n  text-wrap: pretty;\n}`,
                      'CSS Type Tokens'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy CSS
                </button>
              </div>

              <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed text-slate-300">
                <code>{`:root {
  /* 1. Font Family Tokens */
  --font-heading: ${headingFont};
  --font-body:    ${bodyFont};
  --font-mono:    'JetBrains Mono', monospace;

  /* 2. Paragraph & Scale Tokens */
  --body-size:        ${(baseSize / 16).toFixed(3)}rem; /* ${baseSize}px */
  --body-line-height: ${lineHeight.toFixed(2)};
  --body-measure:     ${measure}ch;
  --heading-tracking: ${tracking}em;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  letter-spacing: var(--heading-tracking);
  line-height: 1.15;
  text-wrap: balance;
}

p {
  font-family: var(--font-body);
  font-size: var(--body-size);
  line-height: var(--body-line-height);
  max-width: var(--body-measure);
  margin-bottom: 1.25em;
  text-wrap: pretty;
}`}</code>
              </pre>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                Why Unitless `line-height` Matters
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-pretty">
                Always declare <code className="text-emerald-300">line-height: 1.6</code> as a <strong>unitless number</strong> rather than <code className="text-rose-300">24px</code> or <code className="text-rose-300">160%</code>. Unitless values let child elements compute their own line-height relative to their own font-size instead of inheriting a fixed pixel height.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04A: CONTAINERS & CONCENTRIC BORDER RADIUS
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-transparent dark:from-amber-950/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold">
                04A / CONTAINERS
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Wrappers, Cards &amp; Concentric Radius
              </span>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium">
              Formula: <code>R_outer = R_inner + padding</code>
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 text-slate-900 dark:text-white text-balance">
            Text Containers &amp; Callout Boxes — Framing Content Without Clutter
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl text-sm leading-relaxed text-pretty">
            Text never floats in a vacuum—it lives inside <strong>page containers</strong>, <strong>cards</strong>, and <strong>callout boxes</strong>. A well-designed container gives typography breathing room via internal padding (<code>1.25rem–2rem</code>), prevents edge collisions with <code>padding-inline</code>, and preserves concentric curvature.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Square className="w-4 h-4 text-amber-500" />
              Interactive Demo: Cramped Container vs. Concentric Padded Box
            </h4>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleDemo('cont', 'bad')}
                className={`px-3 py-1.5 rounded-lg transition ${demoModes.cont === 'bad' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Cramped &amp; Mismatched (Bad)
              </button>
              <button
                type="button"
                onClick={() => toggleDemo('cont', 'good')}
                className={`px-3 py-1.5 rounded-lg transition ${demoModes.cont === 'good' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Padded &amp; Concentric (Good)
              </button>
            </div>
          </div>

          {demoModes.cont === 'bad' ? (
            <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                ⚠️ Text touches container borders (4px padding), heavy black border, and inner box has a larger radius than outer card:
              </div>
              <div className="p-1 rounded-md border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900">
                <h5 className="font-bold text-sm">API Rate Limit Warning</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  When text sits only 4px away from a container border, the border visually crowds letters, creating visual claustrophobia.
                </p>
                <div className="mt-1 p-1 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs border border-amber-500">
                  <strong>Note:</strong> Inner radius (24px) is larger than outer card radius (6px), creating pinched, awkward corners!
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <span>✓ Generous padding, subtle 1px border, semantic callout box, and concentric corner math:</span>
                <span className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                  R_outer({outerRadius}px) = R_inner({innerRadius}px) + Pad({containerPad}px)
                </span>
              </div>

              {/* Slider for Container Padding */}
              <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <span className="font-bold whitespace-nowrap">Try Container Padding:</span>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={containerPad}
                  onChange={(e) => setContainerPad(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{containerPad}px</span>
              </div>

              {/* Concentric Outer Card */}
              <div
                style={{ padding: `${containerPad}px`, borderRadius: `${outerRadius}px` }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Documentation Container
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">max-width: 65ch</span>
                </div>
                <h5 className="font-bold text-base text-slate-900 dark:text-white">API Rate Limit Guidelines</h5>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-[62ch]">
                  Generous internal padding gives the eye a clean whitespace buffer so container borders never interfere with letter recognition.
                </p>
                <aside
                  style={{ borderRadius: `${innerRadius}px` }}
                  className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Concentric Border Radius</strong>
                    <span>When nesting a callout inside a padded card, set <code>inner-radius = outer-radius - padding</code> so both curves share the same center point.</span>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04B: INTERACTIVE TEXT BOXES (<input> & <textarea>)
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-transparent dark:from-sky-950/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-sky-600 text-white font-mono text-xs font-bold">
                04B / INPUT TEXT BOXES
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                &lt;input&gt;, &lt;textarea&gt;, Labels &amp; Focus Rings
              </span>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium">
              16px iOS Zoom Rule &bull; 44px Touch Target
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 text-slate-900 dark:text-white text-balance">
            Interactive Text Boxes — Form Inputs, Textareas &amp; Helper Anatomy
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl text-sm leading-relaxed text-pretty">
            Interactive text boxes combine <strong>Fitts's Law</strong> (44px+ touch height), <strong>Jakob's Law</strong> (persistent visible labels &amp; clear borders), and <strong>Tesler's Law</strong> (<code>16px</code> font size on mobile inputs to eliminate jarring iOS Safari auto-zoom).
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-sky-500" />
              Interactive Demo: Placeholder-Only Trap vs. Accessible Text Box
            </h4>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleDemo('tbox', 'bad')}
                className={`px-3 py-1.5 rounded-lg transition ${demoModes.tbox === 'bad' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                12px No-Label Box (Bad)
              </button>
              <button
                type="button"
                onClick={() => toggleDemo('tbox', 'good')}
                className={`px-3 py-1.5 rounded-lg transition ${demoModes.tbox === 'good' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Ergonomic 16px Text Box (Good)
              </button>
            </div>
          </div>

          {demoModes.tbox === 'bad' ? (
            <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                ⚠️ Disappearing placeholder (no label), 12px font triggers iOS zoom, <code>resize: both</code> breaks horizontal layout:
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <input
                  type="text"
                  defaultValue="Acme Corp API Key"
                  placeholder="Enter Organization Name (Format: A-Z only)"
                  style={{ fontSize: '12px', outline: 'none' }}
                  className="w-full py-1 px-1 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                />
                <p className="text-[11px] text-rose-600 dark:text-rose-400">
                  ↑ Once the user starts typing, the placeholder instructions vanish! Worse, <code>outline: none</code> destroys keyboard focus navigation.
                </p>
                <textarea
                  rows={2}
                  defaultValue="Write bio..."
                  style={{ fontSize: '12px', resize: 'both', outline: 'none' }}
                  className="w-full p-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                ✓ Persistent label, 16px (<code>1rem</code>) text, 44px min-height, focus ring, and live character counter:
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="max-w-md">
                  <label htmlFor="good-org-demo" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="good-org-demo"
                    type="text"
                    defaultValue="Acme Cloud Analytics"
                    placeholder="e.g., Acme Corporation"
                    className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Shown on invoices and team invitations (letters, spaces, and hyphens allowed).
                  </p>
                </div>

                <div className="max-w-lg">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="good-bio-demo" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Project Summary (<code>&lt;textarea&gt;</code>)
                    </label>
                    <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {bioText.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    id="good-bio-demo"
                    rows={3}
                    maxLength={160}
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm leading-relaxed rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-y transition"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Uses <code>resize: vertical</code> so users can expand height without overflowing cards horizontally.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: MICRO-TYPOGRAPHY & TABULAR NUMERALS
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Section 05 / Micro-Typography &amp; Modern CSS
          </span>
          <h3 className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
            Tabular Numerals, Headline Balancing &amp; Truncation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 text-pretty">
            Small CSS typography properties that separate amateur interfaces from production-grade design systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base flex items-center gap-2">
                <Table className="w-4 h-4 text-sky-500" />
                Live Toggle: <code>tabular-nums</code> in Financial Tables
              </h4>
              <button
                type="button"
                onClick={() => setIsTabular(!isTabular)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  isTabular
                    ? 'bg-sky-600 text-white hover:bg-sky-500'
                    : 'bg-rose-600 text-white hover:bg-rose-500'
                }`}
              >
                {isTabular ? 'Switch to Proportional (See Jitter)' : 'Restore Tabular Nums (Fix Alignment)'}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
              In proportional fonts, the digit <code>1</code> is narrower than <code>8</code>, causing decimal points in tables and live timers to zig-zag horizontally. Adding <code>font-variant-numeric: tabular-nums</code> forces every digit into an equal-width box without changing the font family!
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Asset / Transaction</span>
                <span className={`font-mono ${isTabular ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {isTabular ? 'font-variant-numeric: tabular-nums ✓' : 'proportional-nums (Misaligned 1s vs 8s ⚠️)'}
                </span>
              </div>
              <div className={`divide-y divide-slate-200/60 dark:divide-slate-800/60 text-sm ${isTabular ? 'tabular-nums' : 'nums-proportional'}`}>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">01. Enterprise License</span>
                  <span className="font-semibold font-mono">$11,111.11</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">02. Cloud Compute Usage</span>
                  <span className="font-semibold font-mono">$88,888.88</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">03. Support Retainer</span>
                  <span className="font-semibold font-mono">$40,921.50</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 bg-slate-900 text-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
                  Modern CSS Typography Utilities
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `.price, .timer, td.numeric {\n  font-variant-numeric: tabular-nums;\n}\n\nh1, h2, .hero-headline, blockquote {\n  text-wrap: balance;\n}\n\np, .card-excerpt {\n  text-wrap: pretty;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}`,
                      'Typography Utilities'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
              <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed text-slate-300">
                <code>{`/* 1. Align numbers vertically in tables, prices & timers */
.price, .timer, td.numeric {
  font-variant-numeric: tabular-nums;
}

/* 2. Equalize line lengths in multi-line headings (max 6 lines) */
h1, h2, .hero-headline, blockquote {
  text-wrap: balance;
}

/* 3. Prevent single-word orphans on paragraph endings */
p, .card-description {
  text-wrap: pretty;
}

/* 4. Clamp long card descriptions cleanly to 3 lines */
.card-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: SPECIFICATION MATRIX TABLE
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Section 06 / Master Cheat Sheet Matrix
          </span>
          <h3 className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
            HTML &amp; CSS Typography, Container &amp; Text Box Specification Matrix
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Production-ready values for every semantic HTML text element, container wrapper, and input box.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3.5 px-4 font-bold">Element / Role</th>
                <th className="py-3.5 px-4 font-bold">Font Size / Padding</th>
                <th className="py-3.5 px-4 font-bold">Line-Height / Radius</th>
                <th className="py-3.5 px-4 font-bold">Tracking / Border</th>
                <th className="py-3.5 px-4 font-bold">Width / Measure</th>
                <th className="py-3.5 px-4 font-bold">UX Law Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  <code>&lt;h1&gt;</code> Hero Display
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">2.25rem–3.5rem (36–56px)</td>
                <td className="py-3.5 px-4 font-mono text-xs">1.10 – 1.18</td>
                <td className="py-3.5 px-4 font-mono text-xs">-0.03em to -0.02em</td>
                <td className="py-3.5 px-4 font-mono text-xs">20ch – 30ch (<code>balance</code>)</td>
                <td className="py-3.5 px-4"><strong>Hick's Law</strong> (Instant page purpose)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  <code>&lt;h2&gt;</code> Section Header
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">1.5rem–2.25rem (24–36px)</td>
                <td className="py-3.5 px-4 font-mono text-xs">1.20 – 1.25</td>
                <td className="py-3.5 px-4 font-mono text-xs">-0.02em to -0.015em</td>
                <td className="py-3.5 px-4 font-mono text-xs">35ch – 45ch</td>
                <td className="py-3.5 px-4"><strong>Miller's Law</strong> (Section chunking)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  <code>&lt;p&gt;</code> Body Copy
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">1.0rem–1.125rem (16–18px)</td>
                <td className="py-3.5 px-4 font-mono text-xs">1.55 – 1.65</td>
                <td className="py-3.5 px-4 font-mono text-xs">0em (normal)</td>
                <td className="py-3.5 px-4 font-mono text-xs">60ch – 70ch (<code>pretty</code>)</td>
                <td className="py-3.5 px-4"><strong>Miller's Law</strong> (Zero return-sweep error)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  <code>.eyebrow</code> All-Caps
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">0.75rem (12px)</td>
                <td className="py-3.5 px-4 font-mono text-xs">1.35 – 1.45</td>
                <td className="py-3.5 px-4 font-mono text-xs">+0.06em to +0.10em</td>
                <td className="py-3.5 px-4 font-mono text-xs">40ch</td>
                <td className="py-3.5 px-4"><strong>Jakob's Law</strong> (Category context)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                  <code>.card / .callout</code> Box
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">pad: 1.25rem – 2.0rem</td>
                <td className="py-3.5 px-4 font-mono text-xs">R_out = R_in + pad</td>
                <td className="py-3.5 px-4 font-mono text-xs">1px solid / 4px left bar</td>
                <td className="py-3.5 px-4 font-mono text-xs">min(100% - 2rem, 65ch)</td>
                <td className="py-3.5 px-4"><strong>Miller's Law</strong> (Visual containment)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                  <code>input / textarea</code> Box
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">&ge; 1.0rem (16px) | pad: 10px 14px</td>
                <td className="py-3.5 px-4 font-mono text-xs">lh: 1.5 | min-h: 44px</td>
                <td className="py-3.5 px-4 font-mono text-xs">1px border + 3px focus ring</td>
                <td className="py-3.5 px-4 font-mono text-xs">10ch (ZIP) to 45ch (Text)</td>
                <td className="py-3.5 px-4"><strong>Fitts's &amp; Tesler's Law</strong> (No iOS zoom)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07: INTERACTIVE 15-POINT AUDIT CHECKLIST
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Section 07 / Pre-Launch Verification
            </span>
            <h3 className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
              Interactive Typography, Container &amp; Text Box Audit Checklist
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Verify your stylesheets and UI components against these 15 essential usability checks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Typography Score</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {checkedCount} / {totalChecks} ({scorePercent}%)
              </div>
            </div>
            <button
              type="button"
              onClick={resetChecklist}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-6">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${scorePercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Column 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">1. Font Family Stack</div>
            {[
              { id: 1, text: 'Uses at most 2–3 font families (Heading, Body, Mono).' },
              { id: 2, text: 'Includes system fallback fonts & generic family keyword.' },
              { id: 3, text: 'Passes the Il10O character disambiguation test.' },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-indigo-600 cursor-pointer"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>

          {/* Column 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">2. Paragraph Ergonomics</div>
            {[
              { id: 4, text: 'Body paragraphs are constrained to 45ch–75ch (65ch ideal).' },
              { id: 5, text: 'Body copy uses unitless line-height between 1.5 and 1.65.' },
              { id: 6, text: 'Long copy is left-aligned (never justified or centered).' },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-emerald-600 cursor-pointer"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>

          {/* Column 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">3. Scale &amp; Tracking</div>
            {[
              { id: 7, text: 'Font sizes use relative rem or fluid clamp() units.' },
              { id: 8, text: 'Large display headings tighten tracking (-0.02em to -0.03em).' },
              { id: 9, text: 'All-caps labels add positive letter-spacing (+0.06em+).' },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-purple-600 cursor-pointer"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>

          {/* Column 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">4. Containers &amp; Boxes</div>
            {[
              { id: 10, text: 'Cards use ≥16px–24px padding and concentric corner radii.' },
              { id: 11, text: 'Every text box has a persistent visible <label> (not placeholder-only).' },
              { id: 12, text: '<textarea> boxes use resize: vertical so layout never breaks.' },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-amber-600 cursor-pointer"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>

          {/* Column 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">5. Polish &amp; Mobile UX</div>
            {[
              { id: 13, text: 'Form inputs use font-size: 16px+ to eliminate iOS auto-zoom.' },
              { id: 14, text: 'Data tables, stats & prices apply tabular-nums.' },
              { id: 15, text: 'Headlines use text-wrap: balance and paragraphs use pretty.' },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 rounded text-sky-600 cursor-pointer"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypographyCheatSheet;
