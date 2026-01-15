# Metro Map Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the current card-based presentation canvas into a metro/transit map interface where slides appear as station stops on colored lines, with hover tooltips and click-to-zoom navigation.

**Architecture:** Replace the current SlideNode cards with small MetroStop circles connected by thick colored metro lines. The existing React Flow infrastructure handles zoom/pan. Stops show title labels; hovering reveals bullet points in a tooltip. Clicking a stop zooms to the existing slide card. Data continues to flow from slides.ts/talk-outline.md.

**Tech Stack:** React, TypeScript, React Flow (@xyflow/react), CSS

**Reference:** `UI-plans/metro-network-realistic.jpg` - use this as the visual target

---

## Task 1: Create MetroStop Node Component

**Files:**

- Create: `react-flow-app/src/components/nodes/MetroStopNode.tsx`
- Create: `react-flow-app/src/components/nodes/MetroStopNode.css`
- Modify: `react-flow-app/src/types/presentation.ts`

**Step 1: Add MetroStop types to presentation.ts**

Add after line 83 (after LevelNodeData):

```typescript
export interface MetroStopNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  lineColor: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export type MetroStopNode = Node<MetroStopNodeData, "metroStop">;
```

Update the PresentationNode union type (around line 96) to include MetroStopNode:

```typescript
export type PresentationNode =
  | SlideNode
  | SectionHeaderNode
  | ResourceNode
  | PaperBackgroundNode
  | LevelNode
  | MetroStopNode;
```

Add MetroStopNodeProps after line 106:

```typescript
export type MetroStopNodeProps = NodeProps<MetroStopNode>;
```

**Step 2: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors (types added successfully)

**Step 3: Create MetroStopNode.css**

```css
.metro-stop {
  position: relative;
  cursor: pointer;
}

.metro-stop__circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 3px solid currentColor;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.metro-stop:hover .metro-stop__circle {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
}

.metro-stop--active .metro-stop__circle {
  transform: scale(1.4);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}

.metro-stop__label {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metro-stop__tooltip {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(55, 65, 81, 0.95);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 200px;
  max-width: 280px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  z-index: 1000;
  pointer-events: none;
}

.metro-stop:hover .metro-stop__tooltip {
  opacity: 1;
  visibility: visible;
}

.metro-stop__tooltip-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.metro-stop__tooltip-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.metro-stop__tooltip-bullets li {
  padding-left: 12px;
  position: relative;
  margin-bottom: 4px;
}

.metro-stop__tooltip-bullets li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.6);
}

.metro-stop__tooltip-resources {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.metro-stop__tooltip-resources-title {
  font-weight: 600;
  margin-bottom: 4px;
}

/* Handle positioning */
.metro-stop .react-flow__handle {
  opacity: 0;
  width: 10px;
  height: 10px;
}
```

**Step 4: Create MetroStopNode.tsx**

```tsx
import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { MetroStopNodeProps } from "../../types/presentation";
import "./MetroStopNode.css";

function MetroStopNode({ data }: MetroStopNodeProps) {
  const { slide, lineColor, isActive } = data;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`metro-stop ${isActive ? "metro-stop--active" : ""}`}
      style={{ color: lineColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />

      <div className="metro-stop__circle" />

      <div className="metro-stop__label">{slide.title}</div>

      {isHovered && slide.bullets && slide.bullets.length > 0 && (
        <div className="metro-stop__tooltip">
          <h4 className="metro-stop__tooltip-title">{slide.title}</h4>
          <ul className="metro-stop__tooltip-bullets">
            {slide.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}

      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}

export default memo(MetroStopNode);
```

**Step 5: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.tsx react-flow-app/src/components/nodes/MetroStopNode.css react-flow-app/src/types/presentation.ts
git commit -m "feat: add MetroStopNode component for metro map redesign"
```

---

## Task 2: Define Metro Line Colors and Layout Constants

**Files:**

- Modify: `react-flow-app/src/types/presentation.ts`

**Step 1: Add metro line color constants**

Add after TRACK_COLORS (around line 124):

```typescript
// Metro line colors matching the reference design
export const METRO_LINE_COLORS = {
  intro: "#dc2626", // red - The Widening Gulf (Introduction)
  understanding: "#eab308", // yellow - Understanding AI
  mapping: "#22c55e", // green - Mapping the Journey
  "levels-nontech": "#3b82f6", // blue - Non-Technical Track
  "levels-tech": "#f97316", // orange - Technical Track
  closing: "#a855f7", // purple - Closing
} as const;

// Metro layout constants
export const METRO_LAYOUT = {
  stopSpacing: 160, // horizontal spacing between stops
  lineThickness: 8, // thickness of metro lines
  verticalOffset: 200, // vertical spacing between parallel lines
} as const;
```

**Step 2: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add react-flow-app/src/types/presentation.ts
git commit -m "feat: add metro line colors and layout constants"
```

---

## Task 3: Create Metro Line Generation Utility

**Files:**

- Create: `react-flow-app/src/utils/generateMetroLayout.ts`

**Step 1: Create the metro layout generator**

```typescript
import type { Edge } from "@xyflow/react";
import type {
  Section,
  SlideContent,
  MetroStopNode,
} from "../types/presentation";
import { METRO_LINE_COLORS, METRO_LAYOUT } from "../types/presentation";

interface MetroLayoutResult {
  nodes: MetroStopNode[];
  edges: Edge[];
}

/**
 * Generates metro stop nodes and connecting edges from slides data.
 * Layout follows the reference design with horizontal lines and 45/90 degree angles.
 */
export function generateMetroLayout(
  sections: Section[],
  slides: SlideContent[],
): MetroLayoutResult {
  const nodes: MetroStopNode[] = [];
  const edges: Edge[] = [];

  // Group slides by section
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Track positions for layout
  let currentX = 100;
  let currentY = 300;

  // Layout each section as a metro line segment
  for (const section of sections) {
    const sectionSlides = slidesBySection.get(section.id) || [];
    const lineColor =
      METRO_LINE_COLORS[section.id as keyof typeof METRO_LINE_COLORS] ||
      "#6b7280";

    // Determine Y position based on track type
    if (section.id === "levels-nontech") {
      currentY = 200; // Blue line higher
    } else if (section.id === "levels-tech") {
      currentY = 400; // Orange line lower
    }

    let prevNodeId: string | null = null;

    for (let i = 0; i < sectionSlides.length; i++) {
      const slide = sectionSlides[i];
      const nodeId = `metro-${slide.id}`;

      // Create metro stop node
      const node: MetroStopNode = {
        id: nodeId,
        type: "metroStop",
        position: { x: currentX, y: currentY },
        data: {
          slide,
          section,
          lineColor,
          isActive: false,
        },
      };
      nodes.push(node);

      // Create edge to previous node in same section
      if (prevNodeId) {
        edges.push({
          id: `edge-${prevNodeId}-${nodeId}`,
          source: prevNodeId,
          target: nodeId,
          sourceHandle: "right",
          targetHandle: "left",
          type: "smoothstep",
          style: {
            stroke: lineColor,
            strokeWidth: METRO_LAYOUT.lineThickness,
            strokeLinecap: "round",
          },
        });
      }

      prevNodeId = nodeId;
      currentX += METRO_LAYOUT.stopSpacing;
    }

    // Add spacing between sections
    currentX += METRO_LAYOUT.stopSpacing / 2;
  }

  return { nodes, edges };
}

/**
 * Gets the line color for a given section ID
 */
export function getLineColor(sectionId: string): string {
  return (
    METRO_LINE_COLORS[sectionId as keyof typeof METRO_LINE_COLORS] || "#6b7280"
  );
}
```

**Step 2: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add react-flow-app/src/utils/generateMetroLayout.ts
git commit -m "feat: add metro layout generation utility"
```

---

## Task 4: Create Metro Background Component

**Files:**

- Create: `react-flow-app/src/components/nodes/MetroBackgroundNode.tsx`
- Create: `react-flow-app/src/components/nodes/MetroBackgroundNode.css`
- Modify: `react-flow-app/src/types/presentation.ts`

**Step 1: Add MetroBackground types to presentation.ts**

Add after MetroStopNode types:

```typescript
export interface MetroBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

export type MetroBackgroundNode = Node<
  MetroBackgroundNodeData,
  "metroBackground"
>;
```

Update PresentationNode union to include MetroBackgroundNode.

**Step 2: Create MetroBackgroundNode.css**

```css
.metro-background {
  background-color: #f5f5f0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  border-radius: 8px;
}
```

**Step 3: Create MetroBackgroundNode.tsx**

```tsx
import { memo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import "./MetroBackgroundNode.css";

interface MetroBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

type MetroBackgroundNodeType = Node<MetroBackgroundNodeData, "metroBackground">;

function MetroBackgroundNode({ data }: NodeProps<MetroBackgroundNodeType>) {
  const { width, height } = data;

  return (
    <div
      className="metro-background"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default memo(MetroBackgroundNode);
```

**Step 4: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroBackgroundNode.tsx react-flow-app/src/components/nodes/MetroBackgroundNode.css react-flow-app/src/types/presentation.ts
git commit -m "feat: add metro background node with grid pattern"
```

---

## Task 5: Create MetroCanvas Component

**Files:**

- Create: `react-flow-app/src/components/MetroCanvas.tsx`

**Step 1: Create MetroCanvas.tsx**

This is the main canvas component that replaces PresentationCanvas for metro view:

```tsx
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  useReactFlow,
  applyNodeChanges,
  type NodeMouseHandler,
  type NodeChange,
  type Edge,
} from "@xyflow/react";
import MetroStopNode from "./nodes/MetroStopNode";
import MetroBackgroundNode from "./nodes/MetroBackgroundNode";
import SlideNode from "./nodes/SlideNode";
import NavigationControls from "./panels/NavigationControls";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateMetroLayout } from "../utils/generateMetroLayout";
import {
  loadPersistedPositions,
  savePersistedPositions,
  clearPersistedPositions,
} from "../utils/persistence";
import { sections, slides } from "../data/slides";
import type { PresentationNode } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  metroStop: MetroStopNode,
  metroBackground: MetroBackgroundNode,
  slide: SlideNode,
};

function MetroCanvas() {
  const { fitView } = useReactFlow();
  const [viewMode, setViewMode] = useState<"metro" | "slide">("metro");
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);

  // Generate metro layout
  const { nodes: metroNodes, edges: metroEdges } = useMemo(
    () => generateMetroLayout(sections, slides),
    [],
  );

  // State for nodes and edges
  const [nodes, setNodes] = useState<PresentationNode[]>(() => {
    // Calculate bounds for background
    let maxX = 0;
    let maxY = 0;
    for (const node of metroNodes) {
      maxX = Math.max(maxX, node.position.x + 200);
      maxY = Math.max(maxY, node.position.y + 200);
    }

    const backgroundNode: PresentationNode = {
      id: "metro-background",
      type: "metroBackground",
      position: { x: -100, y: -100 },
      data: { width: maxX + 200, height: maxY + 200 },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    return [backgroundNode, ...metroNodes];
  });

  const [edges, setEdges] = useState<Edge[]>(metroEdges);

  // Keyboard navigation
  const {
    currentSlideId,
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    navigateToSlide,
    goToNextSlide,
    goToPreviousSlide,
    toggleOverview,
  } = useKeyboardNavigation({ sections, slides });

  // Handle node click - zoom to slide
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "metroStop") {
        const slideId = node.id.replace("metro-slide-", "slide-");
        setActiveSlideId(slideId);
        navigateToSlide(slideId.replace("slide-", ""));

        // Zoom to the clicked stop
        fitView({
          nodes: [{ id: node.id }],
          duration: 500,
          padding: 0.5,
          maxZoom: 2,
        });
      }
    },
    [fitView, navigateToSlide],
  );

  // Handle node changes (dragging)
  const onNodesChange = useCallback(
    (changes: NodeChange<PresentationNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [],
  );

  // Reset to overview
  const handleToggleOverview = useCallback(() => {
    toggleOverview();
    if (!isOverviewMode) {
      fitView({
        duration: 500,
        padding: 0.1,
        maxZoom: 1,
      });
    }
  }, [fitView, toggleOverview, isOverviewMode]);

  // Update active state on nodes
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "metroStop") {
        const slideId = node.id.replace("metro-", "");
        const isActive = slideId === `slide-${currentSlideId}`;
        return {
          ...node,
          data: { ...node.data, isActive },
        };
      }
      return node;
    });
  }, [nodes, currentSlideId]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        nodesDraggable={true}
        minZoom={0.1}
        maxZoom={3}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
        proOptions={{ hideAttribution: true }}
      />
      <NavigationControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        isOverviewMode={isOverviewMode}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onToggleOverview={handleToggleOverview}
        onReset={() => {
          clearPersistedPositions();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default MetroCanvas;
```

**Step 2: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add react-flow-app/src/components/MetroCanvas.tsx
git commit -m "feat: add MetroCanvas component as main metro map view"
```

---

## Task 6: Add Resources to Tooltip

**Files:**

- Modify: `react-flow-app/src/components/nodes/MetroStopNode.tsx`
- Modify: `react-flow-app/src/types/presentation.ts`
- Modify: `react-flow-app/src/utils/generateMetroLayout.ts`

**Step 1: Update MetroStopNodeData to include resources**

In presentation.ts, update MetroStopNodeData:

```typescript
export interface MetroStopNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  lineColor: string;
  resources?: Resource[]; // Add this line
  isActive?: boolean;
  isHovered?: boolean;
}
```

**Step 2: Update generateMetroLayout to include resources**

Add resources parameter and pass to nodes:

```typescript
export function generateMetroLayout(
  sections: Section[],
  slides: SlideContent[],
  resources: Resource[]  // Add parameter
): MetroLayoutResult {
  // ... existing code ...

  // Inside the loop where nodes are created:
  const slideResources = resources.filter((r) => r.slideId === slide.id);

  const node: MetroStopNode = {
    // ... existing properties ...
    data: {
      slide,
      section,
      lineColor,
      resources: slideResources,  // Add this
      isActive: false,
    },
  };
```

**Step 3: Update MetroStopNode to show resources in tooltip**

```tsx
// In MetroStopNode.tsx, update the tooltip section:
{
  isHovered && (
    <div className="metro-stop__tooltip">
      <h4 className="metro-stop__tooltip-title">{slide.title}</h4>
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="metro-stop__tooltip-bullets">
          {slide.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}
      {data.resources && data.resources.length > 0 && (
        <div className="metro-stop__tooltip-resources">
          <div className="metro-stop__tooltip-resources-title">Resources:</div>
          {data.resources.map((resource) => (
            <div key={resource.id}>{resource.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 4: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add react-flow-app/src/components/nodes/MetroStopNode.tsx react-flow-app/src/types/presentation.ts react-flow-app/src/utils/generateMetroLayout.ts
git commit -m "feat: add resources to metro stop tooltips"
```

---

## Task 7: Add Featured Resource Icons

**Files:**

- Modify: `react-flow-app/src/types/presentation.ts`
- Create: `react-flow-app/src/components/nodes/ResourceIconNode.tsx`
- Create: `react-flow-app/src/components/nodes/ResourceIconNode.css`
- Modify: `react-flow-app/src/utils/generateMetroLayout.ts`

**Step 1: Add featured flag to Resource type**

In presentation.ts, update Resource interface:

```typescript
export interface Resource {
  id: string;
  slideId: string;
  type: ResourceType;
  title: string;
  url: string;
  image?: string;
  featured?: boolean; // Add this line
}
```

**Step 2: Create ResourceIconNode.css**

```css
.resource-icon {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.resource-icon:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.resource-icon__image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.resource-icon__fallback {
  font-size: 12px;
  color: #6b7280;
}
```

**Step 3: Create ResourceIconNode.tsx**

```tsx
import { memo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { Resource } from "../../types/presentation";
import "./ResourceIconNode.css";

interface ResourceIconNodeData {
  [key: string]: unknown;
  resource: Resource;
}

type ResourceIconNodeType = Node<ResourceIconNodeData, "resourceIcon">;

function ResourceIconNode({ data }: NodeProps<ResourceIconNodeType>) {
  const { resource } = data;

  const handleClick = () => {
    window.open(resource.url, "_blank");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tool":
        return "🔧";
      case "docs":
        return "📄";
      case "video":
        return "🎬";
      case "github":
        return "💻";
      default:
        return "🔗";
    }
  };

  return (
    <div className="resource-icon" onClick={handleClick} title={resource.title}>
      {resource.image ? (
        <img
          src={resource.image}
          alt={resource.title}
          className="resource-icon__image"
        />
      ) : (
        <span className="resource-icon__fallback">
          {getTypeIcon(resource.type)}
        </span>
      )}
    </div>
  );
}

export default memo(ResourceIconNode);
```

**Step 4: Update generateMetroLayout to add featured resource icons**

Add logic to create ResourceIconNode for featured resources, positioned branching off their parent stop.

**Step 5: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add react-flow-app/src/components/nodes/ResourceIconNode.tsx react-flow-app/src/components/nodes/ResourceIconNode.css react-flow-app/src/types/presentation.ts react-flow-app/src/utils/generateMetroLayout.ts
git commit -m "feat: add featured resource icons branching from metro stops"
```

---

## Task 8: Integrate MetroCanvas into App

**Files:**

- Modify: `react-flow-app/src/App.tsx`

**Step 1: Replace PresentationCanvas with MetroCanvas**

```tsx
import { ReactFlowProvider } from "@xyflow/react";
import MetroCanvas from "./components/MetroCanvas";
import "@xyflow/react/dist/style.css";
import "./index.css";
import "./App.css";

function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <MetroCanvas />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
```

**Step 2: Update App.css for metro background**

Replace the `.react-flow__pane` styles:

```css
.react-flow__pane {
  background-color: #f5f5f0;
}
```

**Step 3: Run the dev server and verify**

Run: `cd react-flow-app && npm run dev`
Expected: Metro map displays with stops on colored lines

**Step 4: Commit**

```bash
git add react-flow-app/src/App.tsx react-flow-app/src/App.css
git commit -m "feat: integrate MetroCanvas as main app view"
```

---

## Task 9: Add Click-to-Zoom Slide View

**Files:**

- Modify: `react-flow-app/src/components/MetroCanvas.tsx`

**Step 1: Add slide zoom functionality**

Update MetroCanvas to zoom to a full slide card view when a stop is clicked:

```tsx
// Add state for tracking zoomed slide
const [zoomedSlideId, setZoomedSlideId] = useState<string | null>(null);

// Update handleNodeClick to zoom to slide card
const handleNodeClick = useCallback<NodeMouseHandler>(
  (_, node) => {
    if (node.type === "metroStop") {
      const slideId = node.id.replace("metro-", "");
      setZoomedSlideId(slideId);

      // Find the slide node position (if we have slide nodes)
      // Or create a temporary slide node at the metro stop position
      fitView({
        nodes: [{ id: node.id }],
        duration: 500,
        padding: 0.2,
        maxZoom: 2.5,
      });
    }
  },
  [fitView],
);
```

**Step 2: Run TypeScript check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 3: Test the interaction**

Run: `cd react-flow-app && npm run dev`
Expected: Clicking a stop zooms in smoothly

**Step 4: Commit**

```bash
git add react-flow-app/src/components/MetroCanvas.tsx
git commit -m "feat: add click-to-zoom interaction for metro stops"
```

---

## Task 10: Add Metro Legend

**Files:**

- Create: `react-flow-app/src/components/panels/MetroLegend.tsx`
- Create: `react-flow-app/src/components/panels/MetroLegend.css`
- Modify: `react-flow-app/src/components/MetroCanvas.tsx`

**Step 1: Create MetroLegend.css**

```css
.metro-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
  z-index: 100;
}

.metro-legend__title {
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 12px 0;
  color: #1f2937;
}

.metro-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.metro-legend__color {
  width: 24px;
  height: 6px;
  border-radius: 3px;
}

.metro-legend__label {
  color: #4b5563;
}
```

**Step 2: Create MetroLegend.tsx**

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
      <h3 className="metro-legend__title">Lines</h3>
      {Object.entries(METRO_LINE_COLORS).map(([key, color]) => (
        <div key={key} className="metro-legend__item">
          <div
            className="metro-legend__color"
            style={{ backgroundColor: color }}
          />
          <span className="metro-legend__label">{LINE_LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}

export default memo(MetroLegend);
```

**Step 3: Add MetroLegend to MetroCanvas**

Import and render MetroLegend in the return statement.

**Step 4: Run and verify**

Run: `cd react-flow-app && npm run dev`
Expected: Legend appears in bottom-left corner

**Step 5: Commit**

```bash
git add react-flow-app/src/components/panels/MetroLegend.tsx react-flow-app/src/components/panels/MetroLegend.css react-flow-app/src/components/MetroCanvas.tsx
git commit -m "feat: add metro legend panel showing line colors"
```

---

## Task 11: Refine Layout to Match Reference

**Files:**

- Modify: `react-flow-app/src/utils/generateMetroLayout.ts`

**Step 1: Update layout algorithm to match reference design**

The reference shows:

- Red line (intro) curves down from top-left
- Yellow line (understanding) connects to it
- Green line (mapping) branches down
- Blue line (non-technical) runs horizontally
- Orange line (technical) runs parallel below blue
- Purple line (closing) curves to the right

Update `generateMetroLayout.ts` with specific coordinates matching this topology:

```typescript
// Define fixed positions for key junction points
const JUNCTION_POINTS = {
  introStart: { x: 100, y: 100 },
  understandingJoin: { x: 300, y: 200 },
  mappingBranch: { x: 400, y: 300 },
  nonTechStart: { x: 500, y: 250 },
  techStart: { x: 500, y: 400 },
  closingJoin: { x: 1400, y: 325 },
};
```

Implement the detailed layout logic to position each stop according to the reference.

**Step 2: Run and verify**

Run: `cd react-flow-app && npm run dev`
Expected: Layout resembles the reference image

**Step 3: Commit**

```bash
git add react-flow-app/src/utils/generateMetroLayout.ts
git commit -m "feat: refine metro layout to match reference design"
```

---

## Task 12: Add Smooth Metro Line Edges

**Files:**

- Modify: `react-flow-app/src/App.css`

**Step 1: Update edge styles for metro appearance**

```css
/* Metro line edge styles */
.react-flow__edge-path {
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Thicker lines for metro look */
.react-flow__edge.metro-line .react-flow__edge-path {
  stroke-width: 8px;
}

/* Hover effect */
.react-flow__edge:hover .react-flow__edge-path {
  stroke-width: 10px;
  filter: brightness(1.1);
}
```

**Step 2: Run and verify**

Run: `cd react-flow-app && npm run dev`
Expected: Lines are thick and smooth

**Step 3: Commit**

```bash
git add react-flow-app/src/App.css
git commit -m "style: add metro line edge styling"
```

---

## Task 13: Final Integration and Testing

**Files:**

- Various

**Step 1: Run full type check**

Run: `cd react-flow-app && npx tsc --noEmit`
Expected: No errors

**Step 2: Run linter**

Run: `cd react-flow-app && npm run lint`
Expected: No errors (or only minor warnings)

**Step 3: Run existing tests**

Run: `cd react-flow-app && npm test`
Expected: Tests pass (may need updates for new components)

**Step 4: Manual testing checklist**

- [ ] Metro map displays on load
- [ ] All stops show correct titles
- [ ] Hovering shows tooltip with bullets
- [ ] Clicking stop zooms to it
- [ ] Prev/Next navigation works
- [ ] Overview toggle works
- [ ] Stops are draggable
- [ ] Legend displays correctly
- [ ] Resources show in tooltips

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete metro map redesign implementation"
```

---

## Summary

This plan transforms the presentation app from a card-based layout to a metro map interface:

1. **MetroStopNode** - Small circles with labels and hover tooltips
2. **Metro lines** - Thick colored edges connecting stops by section
3. **Click-to-zoom** - Clicking a stop zooms in for detail
4. **Resources** - Featured resources show as icons; all resources in tooltips
5. **Legend** - Shows line colors and their meanings
6. **Navigation** - Prev/next and overview toggle preserved

The data model (slides.ts, talk-outline.md) remains unchanged. Edits happen via chat commands modifying the markdown, and the app regenerates the metro layout from data.
