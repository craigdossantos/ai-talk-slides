# PRD: React Flow Presentation Migration

## Introduction

Migrate the "Leveling Up Using AI" reveal.js presentation (15 slides) to an interactive React Flow-based experience. This enables:

- **Visual exploration** - See neighboring slides and connections, zoom out to view the entire presentation map
- **Resource link nodes** - Small auxiliary nodes with URLs to external articles, docs, tools, and GitHub repos
- **Fresh design** - New "Slate Canvas" aesthetic optimized for flowchart navigation

The React Flow app will **completely replace** the existing reveal.js presentation (no backward compatibility required).

## Goals

- Convert all 15 slides from reveal.js to React Flow nodes
- Implement visible graph structure with clustered tree layout (horizontal sections, vertical slides)
- Add keyboard navigation matching reveal.js muscle memory (arrows, PageUp/Down, Escape, number keys)
- Support 5 resource node types: article, tool, video, docs, github
- Apply "Slate Canvas" color scheme with track-colored accents (emerald for non-tech, blue for tech)
- Provide minimap and section navigator for orientation
- Ensure smooth fitView transitions between slides

## User Stories

### US-001: Initialize Vite + React + TypeScript project

**Description:** As a developer, I need a properly configured React project so I can build the presentation app.

**Acceptance Criteria:**

- [ ] Create `react-flow-app/` directory with Vite + React + TypeScript template
- [ ] Configure `vite.config.ts` with appropriate settings
- [ ] Add base CSS reset and font imports (Space Grotesk, Inter, JetBrains Mono)
- [ ] `npm run dev` starts dev server successfully
- [ ] Typecheck passes

### US-002: Install and configure @xyflow/react

**Description:** As a developer, I need React Flow installed and configured so I can render nodes and edges.

**Acceptance Criteria:**

- [ ] Install `@xyflow/react` package
- [ ] Install `react-remark` for markdown rendering in slides
- [ ] Create basic `App.tsx` with `ReactFlowProvider` wrapper
- [ ] Render empty React Flow canvas with dark background
- [ ] Typecheck passes
- [ ] Verify in browser: empty dark canvas displays

### US-003: Create TypeScript type definitions

**Description:** As a developer, I need type definitions for presentation data so the codebase is type-safe.

**Acceptance Criteria:**

- [ ] Create `src/types/presentation.ts` with:
  - `Section` type (id, title, track: 'technical' | 'non-technical' | 'general')
  - `SlideContent` type (id, sectionId, type: 'title' | 'section-header' | 'content' | 'quote', title, subtitle?, bullets?, quote?)
  - `Resource` type (id, slideId, type: 'article' | 'tool' | 'video' | 'docs' | 'github', title, url)
  - Node data interfaces for SlideNode, SectionHeaderNode, ResourceNode
- [ ] Typecheck passes

### US-004: Build SlideNode component

**Description:** As a user, I want to see slide content rendered in nodes so I can read the presentation.

**Acceptance Criteria:**

- [ ] Create `src/components/nodes/SlideNode.tsx`
- [ ] Render title with proper typography (Space Grotesk)
- [ ] Render subtitle if present (Playfair Display italic)
- [ ] Render bullet point preview (max 3 items)
- [ ] Apply track-colored left border (emerald for non-tech, blue for tech)
- [ ] Node dimensions: 280x180px
- [ ] Handle `title`, `section-header`, `content`, `quote` variants
- [ ] Typecheck passes
- [ ] Verify in browser: sample SlideNode renders with correct styling

### US-005: Build SectionHeaderNode component

**Description:** As a user, I want section headers to be visually distinct so I can orient myself in the presentation.

**Acceptance Criteria:**

- [ ] Create `src/components/nodes/SectionHeaderNode.tsx`
- [ ] Larger dimensions: 320x120px
- [ ] Display section title prominently
- [ ] Apply track-specific gradient background
- [ ] Typecheck passes
- [ ] Verify in browser: sample SectionHeaderNode renders distinctly

### US-006: Build ResourceNode component

**Description:** As a user, I want to see resource links attached to slides so I can access related content.

**Acceptance Criteria:**

- [ ] Create `src/components/nodes/ResourceNode.tsx`
- [ ] Smaller dimensions: 140x80px
- [ ] Dashed border styling to distinguish from main slides
- [ ] Display icon based on resource type (article, tool, video, docs, github)
- [ ] Display truncated resource title
- [ ] Click opens URL in new browser tab
- [ ] Typecheck passes
- [ ] Verify in browser: ResourceNode click opens external link

### US-007: Implement generateNodes() with clustered positioning

**Description:** As a developer, I need automatic node positioning so slides are arranged in a readable layout.

**Acceptance Criteria:**

- [ ] Create `src/utils/generateNodes.ts`
- [ ] Position section headers horizontally with 600px spacing
- [ ] Position slides vertically within sections with 220px spacing
- [ ] Position resource nodes 160px offset from parent slide
- [ ] Return array of React Flow `Node` objects with correct positions
- [ ] Typecheck passes

### US-008: Implement generateEdges() with styled connections

**Description:** As a developer, I need edges connecting nodes so users can see the presentation flow.

**Acceptance Criteria:**

- [ ] Create `src/utils/generateEdges.ts`
- [ ] Section-to-section edges: 3px animated stroke, indigo color
- [ ] Slide-to-slide edges: 1.5px solid stroke, gray color
- [ ] Slide-to-resource edges: 1px dashed stroke, muted color
- [ ] Return array of React Flow `Edge` objects
- [ ] Typecheck passes

### US-009: Add useKeyboardNavigation hook

**Description:** As a user, I want to navigate with keyboard so I can present without using the mouse.

**Acceptance Criteria:**

- [ ] Create `src/hooks/useKeyboardNavigation.ts`
- [ ] Arrow keys move to adjacent slides
- [ ] PageUp/PageDown jump to previous/next section
- [ ] Number keys 1-9 jump to numbered section
- [ ] Hook integrates with React Flow's `fitView` for smooth transitions
- [ ] Typecheck passes
- [ ] Verify in browser: arrow keys navigate between slides

### US-010: Implement fitView transitions and overview mode

**Description:** As a user, I want smooth zoom transitions and an overview mode so I can see the full presentation map.

**Acceptance Criteria:**

- [ ] Escape key toggles overview mode (zoom to fit all nodes)
- [ ] `0` key fits current slide to view
- [ ] Smooth animation on all fitView calls (500ms duration)
- [ ] Click on slide in overview mode focuses that slide
- [ ] Typecheck passes
- [ ] Verify in browser: Escape zooms out to show all, click on node focuses it

### US-011: Add minimap panel

**Description:** As a user, I want a minimap so I can see my position in the overall presentation.

**Acceptance Criteria:**

- [ ] Add React Flow `MiniMap` component
- [ ] Position in bottom-right corner
- [ ] Color nodes by track (emerald for non-tech, blue for tech, gray for general)
- [ ] Current viewport highlighted
- [ ] Typecheck passes
- [ ] Verify in browser: minimap shows current position

### US-012: Add section navigator panel

**Description:** As a user, I want a section navigator so I can quickly jump to any section.

**Acceptance Criteria:**

- [ ] Create `src/components/panels/SectionNavigator.tsx`
- [ ] Display list of all sections
- [ ] Highlight current section
- [ ] Click on section jumps to that section header
- [ ] Position on left side of screen
- [ ] Typecheck passes
- [ ] Verify in browser: clicking section in navigator jumps to it

### US-013: Migrate slide content from index.html

**Description:** As a developer, I need all 15 slides extracted into the data structure so the presentation is complete.

**Acceptance Criteria:**

- [ ] Create `src/data/slides.ts`
- [ ] Extract all 15 slides from `index.html` into typed data structure
- [ ] Preserve section groupings and order
- [ ] Include slide titles, subtitles, and bullet points
- [ ] All slides render correctly in React Flow
- [ ] Typecheck passes
- [ ] Verify in browser: all 15 slides visible and readable

### US-014: Add resource link nodes to key slides

**Description:** As a user, I want resource links on relevant slides so I can explore related content.

**Acceptance Criteria:**

- [ ] Add at least 5 resource nodes across the presentation
- [ ] Each resource has appropriate type (article/tool/video/docs/github)
- [ ] Resources positioned correctly relative to parent slides
- [ ] All resource links open correctly in new tabs
- [ ] Typecheck passes
- [ ] Verify in browser: resource nodes visible and clickable

### US-015: Polish animations and responsive behavior

**Description:** As a user, I want smooth animations and responsive layout so the presentation feels professional.

**Acceptance Criteria:**

- [ ] Add CSS transitions for node hover states
- [ ] Smooth edge animations on navigation
- [ ] Handle window resize gracefully
- [ ] Test at common viewport sizes (1920x1080, 1366x768, 1280x720)
- [ ] No visual glitches during navigation
- [ ] Typecheck passes
- [ ] Verify in browser: resize window, confirm no layout issues

## Functional Requirements

- **FR-1:** The app must render all 15 slides as interactive React Flow nodes
- **FR-2:** Nodes must be positioned in a clustered tree layout (horizontal sections, vertical slides)
- **FR-3:** Arrow keys must navigate between adjacent slides with smooth transitions
- **FR-4:** PageUp/PageDown must jump to previous/next section
- **FR-5:** Number keys 1-9 must jump to the corresponding section
- **FR-6:** Escape must toggle between focused view and full-map overview
- **FR-7:** Resource nodes must open their URL in a new browser tab when clicked
- **FR-8:** The minimap must show current viewport position and be clickable for navigation
- **FR-9:** The section navigator must list all sections and highlight the current one
- **FR-10:** Edges must visually connect related nodes with appropriate styling

## Non-Goals

- No PDF export functionality
- No speaker notes view
- No presenter mode with timer
- No automatic slide advancement
- No audio/video embedding within slides (resource links only)
- No mobile touch gestures beyond basic panning
- No offline mode or service worker
- No analytics or tracking

## Design Considerations

### Color Scheme: "Slate Canvas"

```css
--canvas-base: #0f172a; /* Deep slate background */
--canvas-elevated: #1e293b; /* Node backgrounds */
--text-primary: #f1f5f9; /* Headings */
--text-secondary: #cbd5e1; /* Body text */
--accent-primary: #6366f1; /* Indigo - navigation elements */
--accent-technical: #3b82f6; /* Blue - tech track */
--accent-nontechnical: #10b981; /* Emerald - non-tech track */
--accent-highlight: #f59e0b; /* Amber - emphasis */
```

### Typography

- **Display/Headings:** Space Grotesk (600 weight)
- **Body text:** Inter (400 weight)
- **Code snippets:** JetBrains Mono (400 weight)
- **Quotes/Subtitles:** Playfair Display (italic)

### Node Dimensions

| Element        | Dimensions | Spacing                           |
| -------------- | ---------- | --------------------------------- |
| Section Header | 320x120px  | 600px horizontal between sections |
| Main Slide     | 280x180px  | 220px vertical between slides     |
| Resource Node  | 140x80px   | 160px offset from parent slide    |

### Edge Styling

| Relationship      | Style                       |
| ----------------- | --------------------------- |
| Section → Section | 3px animated stroke, indigo |
| Slide → Slide     | 1.5px solid stroke, gray    |
| Slide → Resource  | 1px dashed stroke, muted    |

## Technical Considerations

### Dependencies

- **@xyflow/react** - Core flowchart library
- **react-remark** - Markdown rendering for slide content
- **vite** - Build tool and dev server

### Project Structure

```
react-flow-app/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── nodes/
│   │   │   ├── SlideNode.tsx
│   │   │   ├── SectionHeaderNode.tsx
│   │   │   └── ResourceNode.tsx
│   │   ├── panels/
│   │   │   ├── SectionNavigator.tsx
│   │   │   └── SlideCounter.tsx
│   │   └── PresentationFlow.tsx
│   ├── hooks/
│   │   ├── useKeyboardNavigation.ts
│   │   └── usePresentationState.ts
│   ├── types/
│   │   └── presentation.ts
│   ├── utils/
│   │   ├── generateNodes.ts
│   │   └── generateEdges.ts
│   ├── data/
│   │   └── slides.ts
│   └── styles/
│       └── flow.css
├── package.json
└── vite.config.ts
```

### Integration Points

- Source content extracted from existing `index.html`
- No backend required - static React app
- Can be deployed to any static hosting (Vercel, Netlify, GitHub Pages)

## Success Metrics

- All 15 slides successfully migrated and readable
- Keyboard navigation works for all documented keys
- Full presentation walkthrough possible without mouse
- Resource links all functional (open in new tabs)
- No TypeScript errors
- Loads and responds within 2 seconds on standard hardware
- Works in Chrome, Firefox, Safari (latest versions)

## Open Questions

- Should the original reveal.js file be deleted after migration is verified?
- What specific resources should be linked? (Need content URLs)
- Should section numbers be displayed on section header nodes?
- Should there be a "start presentation" landing view before the flow?
