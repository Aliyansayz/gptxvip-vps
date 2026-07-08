# MedLab Lab Runner View: Layout & Structure Cheatsheet

This document outlines the key layout sizing, screen width/height, structural organization, and visual elements used in the "Lab Runner" view of MedLabs. It serves as a reference for maintaining consistency when building or modifying MedLab interactive components.

## 1. Core Layout Strategy

The Lab Runner view is designed to be highly responsive, utilizing **Tailwind CSS** with a mobile-first approach. It relies heavily on **CSS Flexbox** for vertical stacking and **CSS Grid** for side-by-side layouts on larger screens.

The primary goal is to maximize the available screen real estate for the interactive visual while keeping controls and theory content accessible.

### Key Files
*   `components/medLabTopicsView/MedLabRunner.tsx`: The outer container that orchestrates the lab, handles navigation (prev/next steps), and manages global settings (showing/hiding theory).
*   `components/medLabTopicsView/MedLabLayout.tsx`: The core structural component that defines the layout grid, handling the placement of the visual, interaction controls, and theory pane based on user preferences and screen size.

## 2. Dimensions & Sizing

The layout is designed to fill the available viewport or container height, preventing unnecessary scrolling for the main interactive elements.

*   **Height (`h-full`, `min-h-0`):** The outermost containers use `h-full` to stretch to the parent's height. Crucially, inner flex/grid children use `min-h-0` to allow them to shrink below their content's intrinsic height, enabling internal scrolling (like in the Theory Pane) rather than expanding the whole page.
*   **Visual Container:** The area dedicated to the SVG or interactive visual uses `flex-1` to take up all remaining vertical space after the title, prompt, and interaction controls are rendered. It often uses `min-h-[300px]` to ensure it doesn't collapse entirely on very short screens.
*   **Width:** The layout spans the full width (`w-full`). On larger screens (`lg:` breakpoint, typically >= 1024px), it splits into a grid.

## 3. Structural Organization (`MedLabLayout.tsx`)

The `MedLabLayout` component dynamically arranges three main pieces of content:
1.  **Content (Main Area):** Contains the Title, Prompt, Visual Content, and Interaction Content.
2.  **Theory Content:** The informational pane (often containing analogies and explanations).

### Layout Modes

The layout adapts based on the `infoPlacement` prop ('side' or 'bottom') and the `infoVisible` state.

#### A. Side-by-Side View (Desktop Default)
Triggered when `infoVisible` is true and `infoPlacement === 'side'`.

*   **Structure:** Uses CSS Grid on large screens (`lg:grid-cols-3`).
*   **Main Content:** Spans 2 out of 3 columns (`lg:col-span-2`).
*   **Theory Pane:** Spans 1 column (`lg:col-span-1`) on the right side.
*   **Mobile Behavior:** Below the `lg` breakpoint, the grid collapses, and elements stack vertically.

```tsx
// Example from MedLabLayout.tsx
<div className="grid lg:grid-cols-3 gap-4 lg:gap-6 h-full">
    <div className="lg:col-span-2 w-full min-w-0 h-full">
        {/* Main Content (Visual + Controls) */}
    </div>
    <aside className="lg:col-span-1 h-full overflow-hidden min-w-0">
        {/* Theory Pane */}
    </aside>
</div>
```

#### B. Stacked / Bottom View
Triggered when `infoPlacement === 'bottom'` OR when the screen is smaller than the `lg` breakpoint.

*   **Structure:** Uses Flexbox column (`flex flex-col`).
*   **Main Content:** Takes up available space (`flex-1`).
*   **Theory Pane:** Sits below the main content, sizing to its content (`h-fit`).

```tsx
// Example from MedLabLayout.tsx
<div className="flex flex-col gap-4 lg:gap-6 w-full h-full">
    <div className="w-full min-w-0 flex-1">
        {/* Main Content (Visual + Controls) */}
    </div>
    {infoVisible && infoPlacement === 'bottom' && (
        <div className="w-full min-w-0 h-fit">
            {/* Theory Pane */}
        </div>
    )}
</div>
```

## 4. The Main Content Area (The `Content` variable)

Inside the main area (whether it's taking up 2 columns or the full width), the structure is a vertical flex container (`flex flex-col`).

1.  **Header (`flex-shrink-0`):** Contains the `title` and a toggle button to hide/show the question prompt. It won't shrink if space is tight.
2.  **Prompt (`flex-shrink-0`):** The actual question or instruction text.
3.  **Visual Content (`flex-1 min-h-0`):** The core interactive SVG or animation. It is allowed to grow and shrink to fill the middle space.
4.  **Interaction Content (`flex-shrink-0 pt-4`):** The multiple-choice buttons, sliders, or drag-and-drop targets. Placed at the bottom of the main card.

```tsx
// Structure of the Main Content Card
<div className="bg-card p-6 rounded-lg shadow-sm border space-y-6 h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between mb-2 flex-shrink-0">...</div>
    
    {/* Prompt */}
    <p className="flex-shrink-0">...</p>
    
    {/* Visual Area */}
    <div className="flex-1 min-h-0 flex flex-col justify-center">
        {visualContent}
    </div>
    
    {/* Interaction Area */}
    <div className="flex-shrink-0 pt-4">
        {interactionContent}
    </div>
</div>
```

## 5. Visual Elements & Theming

The layout heavily utilizes Tailwind's utility classes for consistent styling and dark mode support.

*   **Containers:**
    *   Main Card: `bg-card p-6 rounded-lg shadow-sm border`. This creates a distinct, elevated surface for the lab interaction.
    *   Visual Wrapper (inside specific labs): Often uses `bg-slate-100 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner` to create a recessed "stage" for the SVG visuals.
*   **Typography:**
    *   Titles use `font-heading text-3xl tracking-wider`.
    *   Prompts use `text-muted-foreground`.
*   **Animations:**
    *   Framer Motion (`motion.div`) or Tailwind's `animate-in fade-in slide-in-from-top-2` are used for smooth transitions when toggling the visibility of the prompt or theory pane.
*   **Scrollbars:**
    *   Custom scrollbars (`custom-scrollbar` utility class) are applied to overflowing areas like the `MedLabRunner` container and the `TheoryPane` to maintain a clean aesthetic across different operating systems.

## Summary Checklist for New Labs

When creating a new MedLab component:
1.  Wrap it in `<MedLabLayout>`.
2.  Pass the `visualContent` (your SVG/interactive element). Ensure it is responsive (e.g., using `viewBox` and `w-full h-full` on the SVG).
3.  Pass the `interactionContent` (buttons, inputs).
4.  Pass the `theoryContent` (usually `<TheoryPane>`).
5.  Let `MedLabLayout` handle the responsive grid/flex switching and theory pane placement. Do not hardcode fixed pixel heights for outer containers.
