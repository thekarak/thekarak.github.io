# UI Audit: Retroactive 6-Pillar Review & Simplification Blueprint

**Subject:** Sourasis Karak — Personal Technical Portfolio  
**Audit Scope:** Masthead, 3D Canvas, Project Cards, System Schematics, Toolkit, Contact  
**Overall Score:** **19.5 / 24** (Strong foundation with high editorial taste, ready for structural simplification)

---

## 1. 6-Pillar Visual Audit

| Pillar | Score | Verdict | Key Finding |
| :--- | :---: | :--- | :--- |
| **1. Copywriting** | **3.5 / 4** | Strong | Intellectual, precise editorial voice. Minor clutter from philosophical sub-captions. |
| **2. Visuals & Assets** | **3.0 / 4** | Good | 3D canvas is impressive; SVG project diagrams add noise and feel repetitive. |
| **3. Color & Depth** | **3.5 / 4** | Strong | Great warm paper / charcoal feel. Dark mode olive tint can be elevated to pure obsidian. |
| **4. Typography** | **3.0 / 4** | Fragmented | 18+ disparate font sizes across CSS. Needs a consolidated 5-step typographic scale. |
| **5. Layout & Spatial Hierarchy** | **3.0 / 4** | Over-divided | Excessive dividing lines and nested card boxes create visual friction. |
| **6. Motion & Interaction** | **3.5 / 4** | High | Fluid 3D canvas, radial spotlight, keyboard shortcuts. BioAgent flow can be streamlined. |

---

## 2. Detailed Findings by Pillar

### Pillar 1: Copywriting (3.5/4)
* **What Works**:
  * The masthead thesis *“Intelligence, with intention”* and the core question *“Can we trust what they tell us?”* establish clear positioning as a research-minded ML engineer.
  * Project summaries are honest and evidence-backed (e.g. noting that WineLens uses a test split rather than claiming generalized SOTA).
* **Friction Points**:
  * The aside quote (`↳ A different angle. A better question.`) and schematic text (`MEASURE → MODEL → INSPECT`, `ANSWER → CLAIM → EVIDENCE`) repeat the same philosophical message multiple times.
  * **Recommendation**: Let the work demonstrate intentionality. Cut redundant aphorisms.

### Pillar 2: Visuals & Asset Design (3.0/4)
* **What Works**:
  * The upgraded 3D sphere with constellation nodes, coordinate readout, and orbital satellite trail looks like a real observatory instrument.
* **Friction Points**:
  * **Diagram Overload**: Five project cards include arbitrary SVG line graphs and box diagrams (`.project-study`). They do not represent real data and occupy 280px of horizontal space on desktop, compressing the actual project descriptions.
  * **Thumbnail Portrait**: The portrait avatar (43×48px) is squished into the `.identity` badge, looking like a passport photo cropped into a corner.
  * **Recommendation**: Eliminate the faux-diagram SVG noise. Transform BioAgent-ST’s vertical tower into an ultra-clean horizontal interactive pipeline. Give the avatar a dedicated, confident placement or make the 3D canvas the hero visual anchor.

### Pillar 3: Color & Depth (3.5/4)
* **What Works**:
  * Warm paper light theme (`#f8f7f4`) feels like a physical scientific journal.
  * Emerald beacon dot (`#10b981`) brings deployed projects to life.
* **Friction Points**:
  * Dark mode currently has a slight olive/army tone (`#181a18` background, `#222520` surface, `#343b2e` lines). Shifting to a deeper charcoal/obsidian palette (`#0b0c0e` / `#131518`) will create true contrast and make the 3D constellation nodes glow crisply.

### Pillar 4: Typography (3.0/4)
* **What Works**:
  * Pairing `Libre Caslon Display` (editorial warmth), `DM Sans` (clean readability), and `IBM Plex Mono` (scientific rigor).
* **Friction Points**:
  * Font sizes are fragmented across 18+ different values in `styles.css` (from 5px to 100px).
  * **Recommendation**: Standardize on a strict 5-step scale:
    * `Display`: 64px–80px
    * `Headline`: 28px–34px
    * `Lead`: 16px–18px
    * `Body`: 14px / 1.7
    * `Meta/Code`: 11px–12px monospace

### Pillar 5: Layout & Spatial Hierarchy (3.0/4)
* **What Works**:
  * Sticky frosted header and reading progress bar provide subtle utility without distracting.
* **Friction Points**:
  * **Line-itis (Border Fatigue)**: Almost every element is boxed:
    * `border-block` on `.about-grid`
    * `border-block` on `.profile-col`
    * `border-bottom` on `.filters`
    * Double offset border on `.system-figure::after`
    * Borders around all 4 system steps
    * Borders on all 6 projects
    * Borders on notes, toolkit, and contact
  * **Recommendation**: Replace border boxes with natural whitespace and delicate surface tonality (`var(--surface)`). Clean layouts don't need borders between every sentence.

### Pillar 6: Motion & Interactions (3.5/4)
* **What Works**:
  * Zero-dependency canvas physics with inertial damping and `ResizeObserver`.
  * Keyboard navigation (<kbd>T</kbd> for theme, arrow keys for architecture steps).
  * Hover spotlight following cursor coordinates.

---

## 3. The "Simpler yet Unique" Transformation Plan

### Proposed Actionable Enhancements:
1. **Ditch the Faux Diagrams**: Remove the 5 repetitive SVG line-art diagrams from WineLens, TruthScope, TokenLab, VARUNA, and RoastMeBuddy. Give the project descriptions room to breathe in a sleek, full-width or elegant 2-column editorial card.
2. **Horizontal Pipeline for BioAgent-ST**: Replace the bulky 4-button vertical tower with a sleek horizontal pipeline stepper (`[01 Plan] ── [02 Execute] ── [03 Verify ✦] ── [04 Record]`). This saves 150px of vertical height and feels like modern engineering tooling (Linear/Vercel style).
3. **Decouple the 3D Sphere**: Remove the box lines around the 3D canvas so the rotating sphere floats freely in the masthead as a pure, ethereal scientific visual.
4. **Remove 70% of Hairline Borders**: Let typography, margin, and soft card fills do the work. The site will immediately feel lighter, more premium, and less like a spreadsheet.
