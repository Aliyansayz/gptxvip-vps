# Cell Formation & Lineage Differentiation: Simulation & Prompt Reference

This design reference outlines the interactive architecture, vector logic, mathematical frameworks, and generative prompts used to build high-fidelity interactive visualizations for **Cellular Biogenesis** (how a cell is assembled de novo) and **Cell Fate Differentiation** (how distinct functional cells emerge from stem progenitors).

Each section links fundamental molecular biology models found in *Cellular Biology*, *Developmental Biology*, *Genetics*, *Proteomics*, and *Genetic Engineering* to build interactive, production-ready SVG interfaces.

---

## 1. Visual Architecture & Design Token Matrix

To render complex cellular simulations clearly within dark-mode and light-mode dashboards, developers and visual generators must adhere to a standardized palette. This prevents visual clutter while representing overlapping cellular infrastructure.

### A. Subcellular Asset Palette
| Subcellular Structure | Color Token (Tailwind & Hex) | Visual Shape / Geometry | Role in Biogenesis |
| :--- | :--- | :--- | :--- |
| **Cell Membrane** | `slate-400` / `#94a3b8` | Thick lipid-double boundary (`stroke-offset`) | Chassis boundary, semi-permeable envelope |
| **Ribosome Set** | `orange-500` / `#f97316` | Dense dotted arrays (diameters `1.5px` to `3px`) | Active translation factories, codon reading |
| **Endoplasmic Reticulum** | `indigo-500` / `#6366f1` | Concentric winding spline paths (`d="M ... C ..."`) | Folding conduits, ribosomal docking rails |
| **Golgi Apparatus** | `emerald-500` / `#10b981` | Curved, stacked ellipses (`rx/ry` stacks) | Dynamic tagger, vesicle transport sorting |
| **Mitochondria** | `amber-500` / `#f59e0b` | Pill shape with internal zig-zag fold path | Metabolic engine, ATP energetic catalyst |
| **Nucleus + Chromatin** | `purple-500` / `#a855f7` | Semi-transparent nested circle array | Transcriptional control center & code template |

### B. Aesthetic Coordinates & Scaling
- **ViewBox Standards:** Use a normalized coordinate space (`viewBox="0 0 200 150"` or `0 0 100 100`) to guarantee responsiveness across devices.
- **Micro-Detail Rule:** Maintain an clear visual hierarchy. Smaller structures (e.g., ribosomes, peptide strands) should utilize high-opacity neon strokes to prevent them from dissolving into background membranes.

---

## 2. Phase 1: How a Cell Is Made (Ultrastructural Biogenesis)

Biogenesis simulations model the physical assembly of a cell from transcription in the nucleus to folding and vesicle sorting in the Golgi.

```
       [ 1. TRANSCRIPTION ]          [ 2. TRANSLATION ]           [ 3. PACKAGING ]
   +---------------------------+    +------------------+    +-----------------------+
   | Nucleus                   |    | Ribosome / ER    |    | Golgi / Exosome       |
   | - DNA strand splits       | -> | - Read mRNA      | -> | - Tagged lipid vesicle|
   | - RNA Poly builds mRNA    |    | - Fold amino ac. |    | - Membrane merge      |
   +---------------------------+    +------------------+    +-----------------------+
```

### Ideal Prime Examples in the Curriculum
1. **Cellular Biology (`CellOrganelles.tsx` & `CellularRespiration.tsx`):**
   * *Concept:* Membrane potential across mitochondrial cristae generating energy.
   * *Visual:* Concentric wavy paths storing electrostatic values to power the ribosomal assembly engine.
2. **Proteomics (`ProteomicsLab.tsx`):**
   * *Concept:* Ribosome translation mechanics. The large and small ribosomal subunits docking onto mRNA, pulling tRNA complexes, and linking peptide bonds.
   * *Visual:* Active sequence matching where amino acids emerge like color-coded beaded strings, changing shape as molecular chaperones induce folding.
3. **Genetics (`DNAReplication.tsx` & `DnaToProtein.tsx`):**
   * *Concept:* Double helix unwinding.
   * *Visual:* Direct structural mapping from nucleobase pairs (`A-T`, `C-G`) inside the chromosomal core transforming to linear single-stranded messenger RNA (mRNA).

---

### Phase 1 Prompts: Generative AI Visual Coding Directives

#### Prompt 1: The Molecular Translation & Structural Assembly Stage
Use this prompt with code-generation models to build the interactive structural biogenesis module:

```text
Develop a React functional component using Tailwind CSS and inline SVGs simulating "How a Cell and its Proteins are Made". 
The interface must feature a dual-pane layout:
1. Left Pane (Interactive Assembly Stage):
   - A highly detailed interactive SVG viewport (viewBox="0 0 200 150").
   - A central nucleus (semi-transparent purple) containing an unwinding DNA strand (smooth overlapping sine-waves).
   - An active RNA Polymerase bubble rendering dynamic transcription: clicking "Transcribe" generates an animated, bright-orange mRNA single-strand moving outward.
   - When mRNA reaches the rough ER (drawn as sweeping blue Bezier tracks studded with orange dots), clicking "Translate" triggers a 3D-feeling ribsome subunit clamp that moves along the mRNA strand.
   - A peptide channel must sprout a continuous dotted train of primary proteins that fold into complex helixes (using looping Bezier paths) as they are packaged into glowing vesicles sliding toward a Golgi apparatus (emerald green stacks).
2. Right Pane (Dynamic Info Card):
   - Highlighting active state: Transcription, Translocation, Translation, or Golgi Packaging.
   - List associated biochemical formulas, the thermodynamic expense (ATP count), blockades (e.g., how antibiotics halt ribosomal subunits), and custom metaphors (e.g., "Monomer Assembly Line").
Implement robust states using hooks: `hoveredOrganelle`, `activeAssemblyState` ('idle', 'transcribing', 'translating', 'folded', 'secreted'), and dynamic progress indicators. Keep code compact, fully type-safe, and self-contained.
```

---

## 3. Phase 2: How Different Cells Are Made (Fate Commitment & Morphogenesis)

Differentiation simulations show how one stem cell changes into completely different body cells by selectively turning genes on or off.

```
                         [ Pluripotent Stem Cell ]
                                     |
                +--------------------+--------------------+
                | (Morphogen A High)                      | (Morphogen B High)
                v                                         v
       [ Neuronal Lineage ]                      [ Myocyte Lineage ]
   * Axon expansion (Bezier path)            * Striated muscle fibers
   * Synaptic vesicular terminals            * Multi-nucleate dense elongation
```

### Ideal Prime Examples in the Curriculum
1. **Developmental Biology (`WaddingtonsLandscapeActivity.tsx`, `MorphogenGradientActivity.tsx`, & `HoxGeneBuilderActivity.tsx`):**
   * *Concept:* Positional signaling gradients and physical epigenetic ball rolling.
   * *Visual:* A 3D-visualized topological surface where cells (marbles) roll down developmental valleys guided by localized ligand densities, locking cellular identity.
2. **Genetic Engineering (`GeneticEngineering.tsx` & `PCRWalkthroughActivity.tsx`):**
   * *Concept:* Artificial lineage induction.
   * *Visual:* Visualizing how inserting transcription factor plasmids (e.g., Oct4, Sox2, Klf4) reprogram somatic cells back to pluripotent states, changing physical geometries.

---

### Phase 2 Prompts: Generative AI Visual Coding Directives

#### Prompt 2: Stem Cell Lineage Differentiation Simulator
Use this prompt to generate the morphogenesis and lineage commitment interface:

```text
Build a highly interactive React component representing a "Stem Cell Lineage Differentiation Simulator" utilizing Tailwind CSS and animated SVG visuals.
The layout must support:
1. Interactivity Grid:
   - A responsive canvas where a central, circular, glowing "Human Pluripotent Stem Cell (hPSC)" is shown.
   - A "Differentiation Factor Slider" adjusting the chemical signals (Erythropoietin vs. Neurotrophin vs. Myogenin).
   - As the slider values shift, show real-time visual Morphogen Gradients (semi-transparent radial color halos spreading across the background in crimson, azure, and gold).
2. Dynamic Morphological Metamorphosis:
   - When the user selects a pathway, the stem cell's SVG geometry transforms via smooth CSS transitions or path modifications:
     - PATHWAY A (Erythroid): Shrinks, loses nucleus, hollows in center to form a biconcave Red Blood Cell (RBC).
     - PATHWAY B (Neuron): Extends stellar dendritic branches and a long axon path sprouting synaptic bulbs.
     - PATHWAY C (Skeletal Myocyte): Elongates into a dense, thick, multinucleated fibrous band with distinct horizontal striations (drawn with recurring crisp horizontal paths).
3. Gene-Expression Matrix (Simulating Genetics Core):
   - Detail which genes are locked by DNA methylation (red locks) and which are open (green active icons) during the transitions.
Use React State to track the current stage of differentiation, and display real-time clinical notes explaining diseases caused by erratic lineage pathing (such as myelodysplasia or de-differentiation in cancers). Ensure all SVG dimensions are fluid and interactive.
```

---

## 4. Reusable SVG Simulation Components

This section provides a clean blueprint for key visualization templates that can be copied directly or used as structural formats inside the bio-labs.

### Template A: DNA Transcribing To Protein Chain
This component renders an interactive molecular ribbon displaying codons matching their target amino acids.

```tsx
import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

interface CodonMap {
  codon: string;
  aminoAcid: string;
  color: string;
}

const CODON_DATA: CodonMap[] = [
  { codon: 'AUG', aminoAcid: 'Methionine (Start)', color: '#3b82f6' },
  { codon: 'UUU', aminoAcid: 'Phenylalanine', color: '#10b981' },
  { codon: 'GGA', aminoAcid: 'Glycine', color: '#f59e0b' },
  { codon: 'CAG', aminoAcid: 'Glutamine', color: '#ec4899' },
  { codon: 'UAA', aminoAcid: 'Ochre (Stop)', color: '#ef4444' }
];

export const DnaTranslationPreview: React.FC = () => {
  const [activeCodonIdx, setActiveCodonIdx] = useState<number>(-1);
  const [peptideChain, setPeptideChain] = useState<string[]>([]);

  const handleNextStep = () => {
    if (activeCodonIdx < CODON_DATA.length - 1) {
      const nextIdx = activeCodonIdx + 1;
      setActiveCodonIdx(nextIdx);
      setPeptideChain(prev => [...prev, CODON_DATA[nextIdx].aminoAcid]);
    }
  };

  const handleReset = () => {
    setActiveCodonIdx(-1);
    setPeptideChain([]);
  };

  return (
    <div className="p-5 bg-card/60 backdrop-blur rounded-xl border border-border space-y-6 max-w-xl mx-auto shadow-lg">
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <h3 className="font-bold text-md text-foreground">Molecular Ribosome Simulator</h3>
          <p className="text-xs text-muted-foreground font-mono">Module: Genetics & Proteomics Cross-system Visual</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleNextStep} 
            disabled={activeCodonIdx === CODON_DATA.length - 1}
            className="p-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Translation Stage */}
      <div className="relative w-full aspect-[16/6] bg-background/55 border rounded-lg overflow-hidden flex flex-col justify-center items-center">
        <svg viewBox="0 0 200 80" className="w-full h-full p-2">
          {/* Ribosome Subunit Background */}
          {activeCodonIdx >= 0 && (
            <g opacity="0.15" className="transition-all duration-500">
              {/* Large ribosomal subunit (60S) */}
              <path d={`M ${15 + activeCodonIdx * 35} 10 C ${35 + activeCodonIdx * 35} 10, ${50 + activeCodonIdx * 35} 25, ${50 + activeCodonIdx * 35} 45 L ${5 + activeCodonIdx * 35} 45 Z`} fill="#f97316" />
              {/* Small ribosomal subunit (40S) */}
              <ellipse cx={27 + activeCodonIdx * 35} cy={55} rx="22" ry="7" fill="#ea580c" />
            </g>
          )}

          {/* mRNA template line */}
          <line x1="10" y1="50" x2="190" y2="50" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
          
          {/* Codon Anchors */}
          {CODON_DATA.map((item, idx) => {
            const isActive = idx === activeCodonIdx;
            const isProcessed = idx < activeCodonIdx;
            return (
              <g key={item.codon} transform={`translate(${15 + idx * 35}, 46)`}>
                {/* Nucleotide markers */}
                <rect x="0" y="0" width="24" height="8" rx="2" fill={isActive ? item.color : isProcessed ? "#1e293b" : "#475569"} className="transition-all" />
                <text x="12" y="6" textAnchor="middle" fill="#ffffff" className="font-mono text-[5px] select-none font-bold">{item.codon}</text>
                
                {/* Emerging Protein Node from translating ribosome */}
                {(isActive || isProcessed) && (
                  <circle cx="12" cy="-20" r="4.5" fill={item.color} className="animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }} />
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute top-2 right-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" title="Ribosome scans left to right translating codons into amino acid chains" />
        </div>
      </div>

      {/* Transcriptional Log */}
      <div className="p-3 bg-card rounded-md border text-xs space-y-2">
        <h4 className="font-semibold flex items-center justify-between">
          <span>Synthesized Peptide Chain:</span>
          <span className="font-mono text-[10px] text-muted-foreground">Length: {peptideChain.length} aa</span>
        </h4>
        <div className="flex flex-wrap gap-1.5 h-8 items-center bg-background/40 p-1.5 rounded border border-dashed">
          {peptideChain.length > 0 ? peptideChain.map((aa, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono leading-none">
              {aa}
            </span>
          )) : (
            <span className="text-muted-foreground italic text-[11px]">Click dynamic Play to start transcription and translation cascades...</span>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 5. Architectural Alignment Reference (Links with Bio-Lab Suite)

When writing prompts or assembling code for standard simulation cells, align with these functional patterns present in the `componentRegistry`:

*   **Stem-to-Tissue Gradients:** Draw positional matrices in background polygons. Lineage markers (`OCT4`, `NANOG`) must decrease exponentially when Differentiation Slider goes up, visualizable using standard D3 interpolation or CSS path easing inside `WaddingtonsLandscapeActivity.tsx`.
*   **Vector Performance:** For real-time updates (e.g. 50 ribosomes translating mRNA strands concurrently), avoid Canvas redrawing that could cause memory leaks. Use lightweight React-managed `<path>` segments parameterized dynamically to ensure responsive rendering at 60 FPS.
