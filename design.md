# Ruan.dev — Design & Interactive Specification

A comprehensive layout blueprint documenting the visual system, tactile animations, physical spring formulas, and interactive mechanics integrated into the **ruan.dev** monograph. 

---

## 1. Visual Identity & Aesthetics

The interface is engineered to evoke the high-fidelity material qualities, fluid physics, and structural precision found in Apple’s digital architectures (e.g., Apple Vision Pro documentation and iPhone promotional modules).

### Color & Depth Material Palette
Rather than using generic flat corporate grays or distracting multi-hue gradients, the color system mimics natural light reflection, physical glass panels, and matte product surfaces:

*   **Primary Background:** `#fafafa` (Pure Off-White) transitioning to `#ffffff` via smooth linear gradient structures, preventing visual fatigue under heavy reading.
*   **Ink/Carbon Text:** `#1d1d1f` (Apple System Carbon) for robust display typographic contrast.
*   **Slate Secondary ink:** `#6e6e73` and `#8e8e93` (Matte Silver-Gray) for metadata, labels, and secondary supporting copy.
*   **Active Laser Blue:** `#0066ff` (San Francisco Blue) as a high-contrast functional accent for active selections, progress indicators, and interactive focal points.
*   **Glass Material:** Glassmorphism behaves authoritatively. The Dynamic Island uses `#0a0a0c`/85 with a `backdrop-blur-xl` filter combined with a thin high-contrast border limit (`white/[0.08]`) to simulate physical layered sheets.

---

## 2. Typographic Scale

The typeface system relies on **Inter** (rendering natively with micro-optimized letter spacing matching San Francisco Pro) to establish visual authority with clean tracking and massive weight contrast.

### Typography Hierarchy Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: HERO DISPLAY TITLE                                            │
│ Size: 5xl to 110px | Weight: Extrabold (900)                          │
│ Tracking: tight/tighter | Leading: 1.02                                │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 2: SECTION HEADINGS                                              │
│ Size: 3xl to 7xl | Weight: Extrabold (800)                            │
│ Tracking: tighter | Leading: 1.08                                      │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 3: CARD & SUB-PANE TITLES                                        │
│ Size: lg to 2xl | Weight: Semibold (600)                               │
│ Tracking: tight | Leading: 1.12                                        │
└────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 4: SPECIFICATION DETAIL LABELS / BODY                           │
│ Size: xs to sm | Weight: Normal (400)                                  │
│ Tracking: normal | Leading: relaxed                                    │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Tight tracking (`tracking-tighter`)** on large headings collapses whitespace empty gaps, mimicking editorial print mechanics.
*   **Proportional weights** ensure that even when body text is small (`text-xs`), it maintains crisp readability without competing against bold displaying blocks.

---

## 3. The Interactive Blueprint Lab

The **Philosophy** section has been completely redesigned from corporate "SaaS feature cards" into an **Apple Engineering Lab**.

### Functional Specifications:
1.  **Modular Mechanics:** Interactive selection column (right) dynamically swaps the focal schematic diagram container (left).
2.  **State-Linked Animations:** Utilizing custom custom-eased React springs via Framer Motion, transitions animate smoothly between diagrams without jarring layout jumps.
3.  **Low-Contrast HUD Styling:** The blueprint display operates inside responsive containers using the premium `#F5F5F7` workspace surface rather than stark high-contrast dark bars, integrating seamlessly with the rest of the canvas.
4.  **Diagram Systems:**
    *   *Grid discipline:* Dynamic 12-column miniature visualizer with delayed entrance indicators.
    *   *Negative space:* Real-time distance measurement markers computing empty-space balance.
    *   *Typographical scale:* Comparative preview panel rendering visual text layouts side-by-side.
    *   *Axial alignments:* Live linear axis guideline with sliding micro-alignment indicator highlights.

---

## 4. Tactile Micro-Interactions

Micro-interactions have been refined following physical, low-latency responsiveness laws:

*   **Dynamic Island Navigation:** The floating Dynamic Island expands and contracts utilizing custom high-tension, high-damping spring friction formulas (`stiffness: 400`, `damping: 28` inside Framer Motion). It handles viewport tracking changes automatically with real-time sector labeling.
*   **Parallax Image Translation:** The portfolio horizontally slides images back-and-forth matching the viewport scroll velocity using relative transform bindings.
*   **Frictional Hover:** Interactive action buttons scale subtly on click (`active:scale-95`) and offer responsive, soft-shadow elevation changes during hover phases.
