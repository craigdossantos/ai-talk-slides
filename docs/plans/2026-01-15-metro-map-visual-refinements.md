# Metro Map Visual Refinements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine the metro map visualization to match the reference design more closely, including inverted node styling (white center, colored ring), thicker lines that pass through nodes, authentic metro typography, enhanced hover/click interactions with slide images, oval junction nodes, and a redesigned legend.

**Architecture:** Update MetroStopNode component with inverted circle styling, increase line thickness and adjust edge routing to pass through nodes. Add expanded tooltip on hover showing slide image, and full slide panel on click with keyboard navigation. Create junction detection logic for oval nodes where lines merge. Redesign MetroLegend to match reference styling.

**Tech Stack:** React, React Flow, CSS

---

## Analysis of Reference vs Current Implementation

### Reference Image Characteristics:

1. **Node Dots**: White center with colored stroke ring around the outside
2. **Lines**: Thick (~12-16px), pass fully through nodes (not stopping at node edge)
3. **Font**: Sans-serif, uppercase, bold, ~11-14px, positioned near nodes
4. **Junction Nodes**: Oval/elongated shape where multiple lines converge
5. **Tooltip**: Gray background, shows bullet points
6. **Legend**: Clean list with thick line samples matching colors

### Current Implementation Issues:

1. **Node Dots**: Colored center with white ring (inverted from reference)
2. **Lines**: 12px but stop at node edges, don't pass through
3. **Font**: System font, not uppercase, smaller than reference
4. **No Junction Detection**: All nodes are circular regardless of line convergence
5. **Tooltip**: Small, no slide image preview
6. **Legend**: Basic styling, smaller line samples

---

## Task 1: Invert Node Circle Styling (White Center, Colored Ring)

**Files:**

- Modify: `react-flow-app/src/components/nodes/MetroStopNode.css:6-16`

**Step 1: Update the metro-stop\_\_circle CSS**

Change the circle styling from colored center/white ring to white center/colored ring:

```css
.metro-stop__circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 6px solid currentColor;
  box-shadow: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
```

**Step 2: Run dev server to verify visually**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Nodes now show white centers with colored rings

**Step 3: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: invert metro stop node styling to white center with colored ring

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Update Hover and Active States for Inverted Nodes

**Files:**

- Modify: `react-flow-app/src/components/nodes/MetroStopNode.css:18-28`

**Step 1: Update hover state**

```css
.metro-stop:hover .metro-stop__circle {
  transform: scale(1.15);
  box-shadow: 0 0 0 3px currentColor;
}
```

**Step 2: Update active state**

```css
.metro-stop--active .metro-stop__circle {
  transform: scale(1.25);
  box-shadow:
    0 0 0 4px currentColor,
    0 0 16px rgba(0, 0, 0, 0.2);
}
```

**Step 3: Run dev server to verify hover/active states**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Hover shows subtle glow, active shows stronger emphasis

**Step 4: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: update hover/active states for inverted node styling

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Increase Line Thickness and Adjust Layout Constants

**Files:**

- Modify: `react-flow-app/src/types/presentation.ts:169-173`

**Step 1: Update METRO_LAYOUT constants**

```typescript
export const METRO_LAYOUT = {
  stopSpacing: 180, // increased for thicker lines
  lineThickness: 16, // thicker metro lines like reference
  verticalOffset: 200,
} as const;
```

**Step 2: Run dev server to verify thicker lines**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Lines appear thicker matching reference image

**Step 3: Commit**

```bash
git add react-flow-app/src/types/presentation.ts
git commit -m "feat: increase metro line thickness to 16px to match reference

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update Metro Stop Label Typography

**Files:**

- Modify: `react-flow-app/src/components/nodes/MetroStopNode.css:30-45`

**Step 1: Update label styling to match reference**

The reference uses uppercase, bold, sans-serif typography positioned near nodes:

```css
.metro-stop__label {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  white-space: normal;
  font-family:
    "Space Grotesk",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1a1a1a;
  text-align: center;
  max-width: 120px;
  line-height: 1.2;
  word-wrap: break-word;
}
```

**Step 2: Run dev server to verify typography**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Labels are uppercase, bold, and more readable

**Step 3: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: update metro stop label typography to uppercase bold

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Redesign Hover Tooltip with Slide Image Preview

**Files:**

- Modify: `react-flow-app/src/components/nodes/MetroStopNode.tsx:28-49`
- Modify: `react-flow-app/src/components/nodes/MetroStopNode.css:47-118`

**Step 1: Update tooltip JSX to include slide image**

```tsx
{
  showTooltip && (
    <div className="metro-stop__tooltip">
      {slide.backgroundImage && (
        <div className="metro-stop__tooltip-image">
          <img src={slide.backgroundImage} alt={slide.title} />
        </div>
      )}
      <h4 className="metro-stop__tooltip-title">{slide.title}</h4>
      {hasBullets && (
        <ul className="metro-stop__tooltip-bullets">
          {slide.bullets!.slice(0, 3).map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
          {slide.bullets!.length > 3 && (
            <li className="metro-stop__tooltip-more">
              +{slide.bullets!.length - 3} more...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
```

**Step 2: Update tooltip CSS for larger size with image**

```css
.metro-stop__tooltip {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(60, 60, 60, 0.95);
  color: #ffffff;
  border: none;
  padding: 0;
  border-radius: 8px;
  width: 280px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.metro-stop:hover .metro-stop__tooltip {
  opacity: 1;
  visibility: visible;
}

.metro-stop__tooltip-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.metro-stop__tooltip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.metro-stop__tooltip-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  padding: 12px 16px 8px;
}

.metro-stop__tooltip-bullets {
  list-style: none;
  padding: 0 16px 12px;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.metro-stop__tooltip-bullets li {
  padding-left: 16px;
  position: relative;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.9);
}

.metro-stop__tooltip-bullets li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.6);
}

.metro-stop__tooltip-more {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}
```

**Step 3: Run dev server to verify tooltip**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Hover shows larger tooltip with slide image and bullet preview

**Step 4: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.tsx react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: redesign hover tooltip with slide image preview

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Add Click Handler to Show Full Slide Panel

**Files:**

- Create: `react-flow-app/src/components/panels/SlidePanel.tsx`
- Create: `react-flow-app/src/components/panels/SlidePanel.css`
- Modify: `react-flow-app/src/components/MetroCanvas.tsx`

**Step 1: Create SlidePanel component**

```tsx
// react-flow-app/src/components/panels/SlidePanel.tsx
import { memo, useEffect } from "react";
import type { SlideContent } from "../../types/presentation";
import "./SlidePanel.css";

interface SlidePanelProps {
  slide: SlideContent | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function SlidePanel({
  slide,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: SlidePanelProps) {
  // Keyboard navigation within panel
  useEffect(() => {
    if (!slide) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (hasPrevious) {
            e.preventDefault();
            onPrevious();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            e.preventDefault();
            onNext();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slide, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!slide) return null;

  return (
    <div className="slide-panel-overlay" onClick={onClose}>
      <div className="slide-panel" onClick={(e) => e.stopPropagation()}>
        <button className="slide-panel__close" onClick={onClose}>
          ×
        </button>

        {slide.backgroundImage && (
          <div className="slide-panel__image">
            <img src={slide.backgroundImage} alt={slide.title} />
          </div>
        )}

        <div className="slide-panel__content">
          <h2 className="slide-panel__title">{slide.title}</h2>
          {slide.subtitle && (
            <p className="slide-panel__subtitle">{slide.subtitle}</p>
          )}

          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="slide-panel__bullets">
              {slide.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="slide-panel__nav">
          <button
            className="slide-panel__nav-btn"
            onClick={onPrevious}
            disabled={!hasPrevious}
          >
            ← Previous
          </button>
          <button
            className="slide-panel__nav-btn"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(SlidePanel);
```

**Step 2: Create SlidePanel CSS**

```css
/* react-flow-app/src/components/panels/SlidePanel.css */
.slide-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.slide-panel {
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.slide-panel__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.slide-panel__close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.slide-panel__image {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.slide-panel__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-panel__content {
  padding: 24px 32px;
}

.slide-panel__title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.slide-panel__subtitle {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px;
}

.slide-panel__bullets {
  list-style: none;
  padding: 0;
  margin: 0;
}

.slide-panel__bullets li {
  padding: 8px 0 8px 24px;
  position: relative;
  font-size: 15px;
  line-height: 1.5;
  color: #333;
}

.slide-panel__bullets li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #666;
  font-size: 18px;
}

.slide-panel__nav {
  display: flex;
  justify-content: space-between;
  padding: 16px 32px 24px;
  border-top: 1px solid #eee;
}

.slide-panel__nav-btn {
  background: #f5f5f5;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.slide-panel__nav-btn:hover:not(:disabled) {
  background: #e5e5e5;
}

.slide-panel__nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Step 3: Integrate SlidePanel into MetroCanvas**

Update MetroCanvas.tsx to track clicked slide and show panel:

Add imports:

```tsx
import SlidePanel from "./panels/SlidePanel";
```

Add state:

```tsx
const [selectedSlide, setSelectedSlide] = useState<SlideContent | null>(null);
```

Update handleNodeClick:

```tsx
const handleNodeClick = useCallback<NodeMouseHandler>(
  (_, node) => {
    if (node.type === "metroStop") {
      const slideId = node.id.replace("metro-", "");
      const slide = slides.find((s) => s.id === slideId);
      if (slide) {
        setSelectedSlide(slide);
        navigateToSlide(slideId);
      }
    }
  },
  [navigateToSlide, slides],
);
```

Add panel handlers:

```tsx
const handleClosePanel = useCallback(() => {
  setSelectedSlide(null);
}, []);

const handlePanelPrevious = useCallback(() => {
  if (currentSlideIndex > 0) {
    const prevSlide = slides[currentSlideIndex - 1];
    setSelectedSlide(prevSlide);
    navigateToSlide(prevSlide.id);
  }
}, [currentSlideIndex, slides, navigateToSlide]);

const handlePanelNext = useCallback(() => {
  if (currentSlideIndex < slides.length - 1) {
    const nextSlide = slides[currentSlideIndex + 1];
    setSelectedSlide(nextSlide);
    navigateToSlide(nextSlide.id);
  }
}, [currentSlideIndex, slides, navigateToSlide]);
```

Add SlidePanel to render:

```tsx
<SlidePanel
  slide={selectedSlide}
  onClose={handleClosePanel}
  onPrevious={handlePanelPrevious}
  onNext={handlePanelNext}
  hasPrevious={currentSlideIndex > 0}
  hasNext={currentSlideIndex < slides.length - 1}
/>
```

**Step 4: Run dev server to verify click behavior**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Click opens full slide panel with image and bullets, arrow keys navigate

**Step 5: Commit**

```bash
git add react-flow-app/src/components/panels/SlidePanel.tsx react-flow-app/src/components/panels/SlidePanel.css react-flow-app/src/components/MetroCanvas.tsx
git commit -m "feat: add click-to-open slide panel with keyboard navigation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Redesign Metro Legend to Match Reference

**Files:**

- Modify: `react-flow-app/src/components/panels/MetroLegend.tsx`
- Modify: `react-flow-app/src/components/panels/MetroLegend.css`

**Step 1: Update MetroLegend component**

```tsx
import { memo } from "react";
import { METRO_LINE_COLORS } from "../../types/presentation";
import "./MetroLegend.css";

const LINE_LABELS: Record<string, string> = {
  intro: "Introduction",
  understanding: "Understanding AI",
  mapping: "Mapping the Journey",
  "levels-nontech": "Non-Technical Track",
  "levels-tech": "Technical Track",
  closing: "Closing",
};

function MetroLegend() {
  return (
    <div className="metro-legend">
      <h3 className="metro-legend__title">LINES</h3>
      <div className="metro-legend__items">
        {Object.entries(METRO_LINE_COLORS).map(([key, color]) => (
          <div key={key} className="metro-legend__item">
            <div
              className="metro-legend__line"
              style={{ backgroundColor: color }}
            />
            <span className="metro-legend__label">{LINE_LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetroLegend);
```

**Step 2: Update MetroLegend CSS**

```css
.metro-legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: rgba(255, 255, 255, 0.98);
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-family: "Space Grotesk", sans-serif;
  z-index: 100;
  min-width: 200px;
}

.metro-legend__title {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0 0 16px 0;
  color: #1a1a1a;
  text-transform: uppercase;
}

.metro-legend__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metro-legend__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metro-legend__line {
  width: 32px;
  height: 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.metro-legend__label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}
```

**Step 3: Run dev server to verify legend**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Legend matches reference with thick line samples and clear typography

**Step 4: Commit**

```bash
git add react-flow-app/src/components/panels/MetroLegend.tsx react-flow-app/src/components/panels/MetroLegend.css
git commit -m "feat: redesign metro legend to match reference styling

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Junction/Interchange Node Detection

**Files:**

- Modify: `react-flow-app/src/utils/generateMetroLayout.ts`
- Modify: `react-flow-app/src/components/nodes/MetroStopNode.tsx`
- Modify: `react-flow-app/src/components/nodes/MetroStopNode.css`
- Modify: `react-flow-app/src/types/presentation.ts`

**Step 1: Add isJunction flag to MetroStopNodeData type**

In `react-flow-app/src/types/presentation.ts`, update the interface:

```typescript
export interface MetroStopNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  lineColor: string;
  resources?: Resource[];
  isActive?: boolean;
  isHovered?: boolean;
  isJunction?: boolean; // Node where multiple lines converge
  junctionColors?: string[]; // Colors of converging lines
}
```

**Step 2: Update generateMetroLayout to detect junctions**

Add junction detection after creating all nodes. A junction is where inter-section connections meet (e.g., mapping -> levels-nontech and mapping -> levels-tech).

In `react-flow-app/src/utils/generateMetroLayout.ts`, after creating inter-section edges, mark junction nodes:

```typescript
// Mark junction nodes (where multiple lines converge)
const junctionNodeIds = new Set<string>();
const junctionColors = new Map<string, string[]>();

// Last node of mapping is a junction (branches to both tracks)
if (lastNodeBySection["mapping"]) {
  junctionNodeIds.add(lastNodeBySection["mapping"]);
  junctionColors.set(lastNodeBySection["mapping"], [
    METRO_LINE_COLORS["mapping"],
    METRO_LINE_COLORS["levels-nontech"],
    METRO_LINE_COLORS["levels-tech"],
  ]);
}

// First node of closing is a junction (receives from both tracks)
if (firstNodeBySection["closing"]) {
  junctionNodeIds.add(firstNodeBySection["closing"]);
  junctionColors.set(firstNodeBySection["closing"], [
    METRO_LINE_COLORS["levels-nontech"],
    METRO_LINE_COLORS["levels-tech"],
    METRO_LINE_COLORS["closing"],
  ]);
}

// Update nodes with junction info
for (const node of nodes) {
  if (node.type === "metroStop" && junctionNodeIds.has(node.id)) {
    (node.data as MetroStopNodeData).isJunction = true;
    (node.data as MetroStopNodeData).junctionColors = junctionColors.get(
      node.id,
    );
  }
}
```

**Step 3: Update MetroStopNode to render oval for junctions**

```tsx
// In MetroStopNode.tsx
const { slide, lineColor, resources, isActive, isJunction } = data;

// In the JSX:
<div
  className={`metro-stop__circle ${isJunction ? "metro-stop__circle--junction" : ""}`}
/>;
```

**Step 4: Add junction CSS for oval shape**

```css
.metro-stop__circle--junction {
  width: 40px;
  height: 24px;
  border-radius: 12px;
}
```

**Step 5: Run dev server to verify junctions**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Junction nodes appear as ovals/elongated circles

**Step 6: Commit**

```bash
git add react-flow-app/src/types/presentation.ts react-flow-app/src/utils/generateMetroLayout.ts react-flow-app/src/components/nodes/MetroStopNode.tsx react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: add junction node detection with oval styling

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Adjust Edge Routing for Lines Through Nodes

**Files:**

- Modify: `react-flow-app/src/utils/generateMetroLayout.ts`

**Step 1: Update edge configuration**

React Flow's smoothstep edges stop at node boundaries. To make lines appear to go through nodes, we need to use custom edge styles or adjust node handle positions.

Update the edge style in generateMetroLayout.ts:

```typescript
// In the edge creation, add markerEnd and adjust style
style: {
  stroke: lineColor,
  strokeWidth: METRO_LAYOUT.lineThickness,
  strokeLinecap: "round",
  strokeLinejoin: "round",
},
```

**Step 2: Adjust handle visibility in MetroStopNode.css**

Make handles positioned at center of node for better line routing:

```css
.metro-stop .react-flow__handle {
  opacity: 0;
  width: 1px;
  height: 1px;
  min-width: 1px;
  min-height: 1px;
}

.metro-stop .react-flow__handle-left {
  left: 50%;
}

.metro-stop .react-flow__handle-right {
  right: 50%;
}

.metro-stop .react-flow__handle-top {
  top: 50%;
}

.metro-stop .react-flow__handle-bottom {
  bottom: 50%;
}
```

**Step 3: Run dev server to verify line routing**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`
Expected: Lines appear to pass through node centers

**Step 4: Commit**

```bash
git add react-flow-app/src/utils/generateMetroLayout.ts react-flow-app/src/components/nodes/MetroStopNode.css
git commit -m "feat: adjust edge routing for lines through nodes

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Final Visual Polish and Testing

**Files:**

- All modified files

**Step 1: Run full test suite**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm test`
Expected: All tests pass

**Step 2: Run build to ensure no errors**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run build`
Expected: Build completes successfully

**Step 3: Visual review in browser**

Run: `cd /Users/craigdossantos/Coding/ai-talk-slides/react-flow-app && npm run dev`

Verify:

- [ ] Nodes have white center with colored ring
- [ ] Lines are thick (~16px)
- [ ] Labels are uppercase, bold, readable
- [ ] Hover shows tooltip with image preview
- [ ] Click opens full slide panel
- [ ] Arrow keys navigate in panel
- [ ] Junction nodes are oval
- [ ] Legend matches reference styling

**Step 4: Final commit if any polish needed**

```bash
git add -A
git commit -m "chore: final visual polish for metro map

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary of Changes

| Component      | Before                     | After                          |
| -------------- | -------------------------- | ------------------------------ |
| Node circles   | Colored center, white ring | White center, colored ring     |
| Line thickness | 12px                       | 16px                           |
| Labels         | System font, mixed case    | Space Grotesk, uppercase, bold |
| Hover tooltip  | Small, text only           | Large with slide image         |
| Click behavior | Zoom to node               | Opens full slide panel         |
| Navigation     | No in-panel nav            | Arrow keys in panel            |
| Junction nodes | Circular                   | Oval/elongated                 |
| Legend         | Basic                      | Thick lines, better typography |
