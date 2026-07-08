# Hematology Visuals: Design & Composition Cheatsheet

This document outlines the design principles, visual compositions, and color theory used to create the interactive Hematology visuals in MedLabs (specifically within `BloodSmearLab.tsx`).

## Core Design Principles

The hematology visuals are built on four foundational principles:

1. **Microscopic Realism vs. Conceptual Analogy:** The module uses a dual-visual approach. The primary visual simulates a 1000x oil immersion microscope field with dynamically generated SVG cells. The secondary theory pane uses highly stylized, relatable analogies (e.g., traffic jams, factory floors) to explain the *pathophysiology* behind the smear.
2. **Dynamic SVG Generation:** The main blood smear is not a static image. It uses React `useMemo` to mathematically generate and position dozens of individual cells (RBCs, WBCs, Platelets) based on the specific disease pattern, creating a unique but clinically accurate field every time.
3. **Shape as Diagnostic Criteria:** In hematology, morphology is everything. The SVGs use precise geometric manipulations (e.g., `polygon` for crenated cells, quadratic bezier curves (`Q`) for sickle cells, and layered circles for target cells) to accurately reflect cellular abnormalities.
4. **Contextual Theming:** Visuals automatically adapt to dark and light modes using Tailwind CSS, ensuring readability while maintaining the classic "Wright-Giemsa stain" color palette.

---

## Visual Compositions & Analogies (The Infographics)

The system dynamically renders different infographic compositions in the theory pane based on the disease pattern.

### 1. Normal Blood (The "Well-Planned City")
* **Analogy:** A city with orderly traffic.
* **Composition:** A road with moving traffic. Red circles represent commuters (RBCs), purple squares/circles represent police (WBCs), and small blue dots represent utility workers (Platelets).
* **Motion:** Continuous left-to-right sliding (`animate-slide-ltr`) to represent healthy, unobstructed blood flow.

### 2. Microcytic Anemia (The "Budget Cuts")
* **Analogy:** Budget Cuts / Empty Shells.
* **Composition:** A normal, well-filled red cell transitions (`→`) into a smaller, pale cell with a large empty white center.
* **Meaning:** Represents the lack of hemoglobin (central pallor) due to iron deficiency.

### 3. Sickle Cell Anemia (The "Traffic Jam")
* **Analogy:** Jackknifed Truck.
* **Composition:** A grey tunnel where a rigid, angled red block (the sickle cell) is stuck, causing normal round red cells to pile up behind it.
* **Meaning:** Illustrates vaso-occlusion and how the rigid sickle shape causes microvascular blockages.

### 4. Target Cells (The "Baggy Suit")
* **Analogy:** A suit that is too large for the body.
* **Composition:** A normal cell is compared to a cell with excess membrane (a large dashed outer circle) collapsing around a small central drop of hemoglobin.
* **Meaning:** Explains the pathophysiology of target cells (codocytes) seen in liver disease or thalassemia.

### 5. Schistocytes / MAHA (The "Razor Wire")
* **Analogy:** Slicing through razor wire.
* **Composition:** Angled grey lines represent a mesh of fibrin strands. A red cell slides into the mesh and is visually sliced into fragments (triangles/helmets).
* **Meaning:** Demonstrates Microangiopathic Hemolytic Anemia (MAHA) where RBCs are mechanically destroyed.

### 6. Left Shift / Infection (The "Emergency Draft")
* **Analogy:** Sending untrained cadets to the front lines.
* **Composition:** A mature "Vet" (segmented neutrophil) stands next to younger "Cadets" (band cells, marked with yellow stripes).
* **Meaning:** Explains why immature white blood cells are released from the bone marrow during severe infections.

### 7. Megaloblastic Anemia (The "Bureaucratic Delay")
* **Analogy:** Waiting for paperwork.
* **Composition:** A massive purple nucleus divided into 6 distinct lobes.
* **Meaning:** Explains hypersegmented neutrophils; the cell keeps growing but cannot divide because DNA synthesis is delayed (B12/Folate deficiency).

### 8. Acute Myeloid Leukemia - AML (The "Defective Product")
* **Analogy:** Factory Stamp of Defect.
* **Composition:** A large, pale blast cell containing a distinct, bright red, needle-like structure.
* **Meaning:** Represents an Auer Rod, the pathognomonic finding for myeloid lineage blasts.

### 9. Chronic Lymphocytic Leukemia - CLL (The "Fragile Elders")
* **Analogy:** Fragile cells bursting under pressure.
* **Composition:** A normal lymphocyte is compared to a blurred, smeared purple mass.
* **Meaning:** Explains "Smudge Cells"—leukemic lymphocytes that are so fragile they burst during the physical smearing of the glass slide.

### 10. Platelet Clumping (The "Group Huddle")
* **Analogy:** Miscounted crowds.
* **Composition:** A tight cluster of platelets inside a bounding box with a "Count: 1" tag, compared to properly separated platelets.
* **Meaning:** Explains pseudothrombocytopenia, where the automated machine miscounts a clump of platelets as a single large cell.

---

## The Main Smear Visual (1000x Oil Immersion)

The primary interactive element is the simulated microscope field. It uses specific SVG constructions for different cell types:

* **Normal RBC:** A red circle with a smaller, semi-transparent white circle in the center to represent central pallor.
* **Sickle Cell:** A curved path using SVG Quadratic Bezier curves (`Q`) to create the crescent/sickle shape.
* **Target Cell:** Three concentric circles (Red outer, White middle, Red inner bullseye).
* **Schistocyte:** A sharp, triangular path (`L` and `Z` commands) to look like a fractured helmet.
* **Crenated Cell (Artifact):** A dynamically generated 10-point polygon to create a spiky, burr-like edge.
* **Neutrophil:** A large pale purple circle containing 3-5 dark purple connected circles (lobes).
* **Band Cell:** A dark purple `U`-shaped thick stroke.
* **Lymphocyte:** A large dark blue circle (nucleus) taking up almost the entire pale blue cell.
* **Blast Cell:** A massive cell with a large nucleus and lighter purple "holes" representing nucleoli.

## Color Theory & Context

Colors in the hematology module mimic the classic **Wright-Giemsa stain** used in real laboratories:

* **Red/Pink (`#ef4444`, `red-300`, `red-400`):** Erythrocytes (RBCs). The intensity of the red dictates the hemoglobin concentration (e.g., pale pink for microcytic anemia).
* **Dark Purple (`#581c87`, `#4c1d95`):** Chromatin/Nuclei of White Blood Cells.
* **Pale Purple/Lilac (`purple-100`, `purple-200`):** Cytoplasm of Neutrophils and Blasts.
* **Dark Blue (`#1e40af`):** Nuclei of Lymphocytes.
* **Pale Blue (`blue-100`):** Cytoplasm of Lymphocytes.
* **Violet/Blue (`violet-400`):** Platelets (Thrombocytes).
* **Bright Red (`#ef4444` line):** Auer rods in AML.

## UI Integration

The infographics are wrapped in context-specific colored containers to subtly reinforce the disease category:
* **Red/Pink Backgrounds:** RBC disorders (Anemia, Sickle Cell, Schistocytes).
* **Purple/Indigo Backgrounds:** WBC disorders (Leukemia, CLL, Hypersegmentation).
* **Blue/Teal Backgrounds:** Structural/Membrane issues (Target cells) or Infections.
* **Yellow Backgrounds:** Bone marrow failure (Aplastic anemia).
