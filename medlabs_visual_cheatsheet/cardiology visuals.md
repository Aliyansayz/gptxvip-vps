Add topic Theory where it's missing alongside theory pane visuals where 
it's missing and maximal the Developmental Biology theory pane from visual element perspective. 
Check visuals cheatsheets or locate within app code for ideal visual references 
to prepare for before executing.



# Cardiology Visuals: Design & Composition Cheatsheet

This document outlines the design principles, visual compositions, and color theory used to create the interactive Cardiology visuals in MedLabs (specifically within `CardiologyVisuals.tsx`).

## Core Design Principles

The cardiology visuals are built on four foundational principles:

1. **Analogy-First Design:** Complex medical concepts (hemodynamics, electrophysiology, pharmacology) are mapped to relatable, everyday mechanical systems (plumbing, house wiring, engines).
2. **SVG-Native Rendering:** All visuals are built using pure inline SVGs. This ensures they are lightweight, infinitely scalable, and easily manipulatable via CSS and React state.
3. **Motion as Information:** Animations are not just decorative; they convey physiological processes (e.g., flow rate, electrical impulses, mechanical pumping).
4. **Contextual Theming:** Visuals automatically adapt to dark and light modes using Tailwind CSS (`dark:bg-slate-900`, `text-slate-500`), ensuring readability across all environments.

---

## Visual Compositions & Analogies

The system dynamically renders different SVG compositions based on the context of the lesson (detected via keywords).

### 1. Hemodynamics & Flow (The "Pipes" Visual)
* **Analogy:** Garden Hose System
* **Keywords:** `pressure`, `resistance`, `flow`, `hemodynamic`
* **Composition:** 
  * A thick blue line represents the blood vessel (hose).
  * A mechanical restriction (grey rectangle) represents vascular resistance.
  * A pressure gauge with a red needle sits above the flow.
* **Motion:** White circular particles use `animate-ping` with staggered delays (`0.2s`, `0.4s`, etc.) to simulate continuous fluid dynamics.

### 2. Electrophysiology (The "Wiring" Visual)
* **Analogy:** House Wiring / Circuit Board
* **Keywords:** `electrical`, `conduction`, `arrhythmia`, `ecg`, `node`
* **Composition:** 
  * Amber/yellow lines (`#f59e0b`) represent the conduction pathways.
  * The SA Node is depicted as a battery/power source; the AV Node as a relay switch.
  * A lightbulb represents the final muscle contraction (myocardium).
* **Motion:** Red sparks (`animate-pulse`) travel along the wires to simulate action potentials.

### 3. Cardiac Output & Failure (The "Pump" Visual)
* **Analogy:** Mechanical Water Pump
* **Keywords:** `pump`, `failure`, `output`, `contract`
* **Composition:** 
  * A central red circular chamber represents the ventricle.
  * Grey structural pipes act as the vena cava and aorta.
  * Black structural lines act as one-way valves.
* **Motion:** A central pink piston uses a custom-scaled `animate-pulse` to simulate the rhythmic systolic/diastolic pumping action.

### 4. Valvular Disease (The "Door" Visual)
* **Analogy:** One-Way Swinging Doors
* **Keywords:** `valve`, `stenosis`, `regurgitation`
* **Composition:** 
  * A grey corridor represents the heart chamber/vessel transition.
  * Two angled lines represent the valve leaflets.
  * Red circles represent individual red blood cells waiting to pass.
* **Motion:** The door flaps use `animate-bounce` with specific transform origins (`origin-top-left`, `origin-bottom-left`) to simulate the opening and closing of heart valves.

### 5. Ischemia & Infarction (The "Blockage" Visual)
* **Analogy:** Clogged Pipe
* **Keywords:** `clot`, `infarction`, `blockage`, `plaque`
* **Composition:** 
  * A red vessel is narrowed by yellow, organic-looking curves representing atherosclerotic plaque.
  * Solid red lines represent healthy blood flow before the blockage.
* **Motion/Styling:** Post-blockage flow is represented by a thin, dashed line (`strokeDasharray="2 2"`) to visually communicate restricted perfusion (ischemia).

### 6. Pharmacology (The "Receptor" Visual)
* **Analogy:** Lock and Key
* **Keywords:** `drug`, `blocker`, `receptor`, `medication`
* **Composition:** 
  * A grey cellular membrane houses a specific geometric "lock" (the receptor).
  * A green "key" represents an agonist drug.
  * A red "blocker" represents an antagonist drug (e.g., Beta-blocker).
* **Motion:** The green agonist uses `animate-bounce` to show active binding, while the red antagonist uses `animate-pulse` to show it occupying and blocking the receptor space.

### 7. Diagnostics & Labs (The "Check Engine" Visual)
* **Analogy:** Car Dashboard / Check Engine Light
* **Keywords:** `enzyme`, `marker`, `troponin`, `lab`, `blood test`
* **Composition:** 
  * A dark slate dashboard houses a classic "Check Engine" icon.
  * A dipstick on the right represents blood serum levels.
* **Motion:** The amber engine outline pulses rapidly to indicate an acute systemic alert (e.g., elevated Troponin during an MI).

---

## Specific SVG Constructions

The interactive elements across the different analogies use specific SVG constructions to represent physiological and mechanical components:

* **Blood Vessel (Hose):** A thick blue `path` with `strokeLinecap="round"` to represent the main conduit.
* **Water Flow Particles:** White `circle` elements using `animate-ping` with staggered animation delays to simulate continuous fluid dynamics.
* **Pressure Gauge:** A combination of a white `circle` with a grey stroke, a red `line` for the needle, and a small grey `circle` for the center pin.
* **Electrical Conduction Pathways:** Amber/yellow `path` elements with sharp angles (`H` and `V` commands) to resemble circuit board wiring.
* **SA/AV Nodes (Battery/Relay):** Amber `rect` elements with rounded corners (`rx="4"`) and bold text labels.
* **Muscle Contraction (Light Bulb):** A pale yellow `circle` with a glowing stroke and a small internal `path` representing the filament.
* **Action Potentials (Sparks):** Red `circle` elements using `animate-pulse` traveling along the conduction pathways.
* **Ventricle (Pump Body):** A central red `circle` with a thick, darker red stroke.
* **Piston (Impeller):** A pink `rect` using a custom-scaled `animate-pulse` to simulate rhythmic systolic/diastolic pumping action.
* **One-Way Valves (Door Flaps):** Angled `path` lines using `animate-bounce` with specific transform origins (`origin-top-left`, `origin-bottom-left`) to simulate opening and closing.
* **Atherosclerotic Plaque (Clog):** Yellow, organic-looking curved `path` elements using SVG Quadratic Bezier curves (`Q`) narrowing the vessel.
* **Ischemic Flow:** A thin red `path` with a dashed stroke (`strokeDasharray="2 2"`) to visually communicate restricted perfusion.
* **Receptor (Lock):** A geometric cutout made of a grey `path` and a white `path` to create a specific binding site on the cell membrane.
* **Agonist Drug (Key):** A green `path` using `animate-bounce` to show active binding.
* **Antagonist Drug (Blocker):** A red `path` using `animate-pulse` to show it occupying and blocking the receptor space.
* **Check Engine Light:** A dark slate `rect` dashboard housing an amber `path` outline of an engine that pulses rapidly.
* **Biomarker Dipstick:** A grey `rect` with a smaller red `rect` inside to represent blood serum levels.

---

## Color Theory & Context

Colors in the cardiology module are strictly semantic, meaning they carry specific physiological or structural meanings:

* **Red (`#ef4444`, `#e11d48`):** Oxygenated blood, active pumping myocardium, acute danger (infarction), or antagonist blockers.
* **Blue (`#3b82f6`, `#60a5fa`):** Fluid dynamics, general hemodynamics, and volume.
* **Amber/Yellow (`#f59e0b`, `#fbbf24`):** Electrical conduction (nerves/nodes), warning lights (diagnostics), and lipid/cholesterol plaques.
* **Green (`#22c55e`):** Agonist medications, positive therapeutic effects, successful binding.
* **Slate/Grey (`#94a3b8`, `#cbd5e1`):** Structural anatomy (vessel walls, cell membranes, valve hinges).

## UI Integration

All visuals are wrapped in a consistent container to ensure they feel native to the app:
```tsx
<div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
    <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">
        Analogy: [Name]
    </h5>
    {/* SVG Content */}
</div>
```
This ensures that regardless of the complexity of the SVG, the visual always sits neatly within the MedLabs theory panes and respects the user's light/dark mode preferences.
