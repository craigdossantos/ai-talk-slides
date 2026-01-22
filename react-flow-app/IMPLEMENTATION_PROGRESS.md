# Metro Map Features Implementation Progress

## Status: Phase 3 In Progress

---

## COMPLETED

### Phase 1: Inline Line Labels ✅

- Created `src/components/edges/MetroLineEdge.tsx` - custom edge with inline label
- Created `src/components/edges/MetroLineEdge.css` - styling for inline labels
- Updated `src/utils/generateMetroLayout.ts` - uses `metroLine` edge type for first edge of each section
- Updated `src/components/MetroCanvas.tsx` - registered `metroLine` edge type
- Removed old `MetroLineLabelNode.tsx` and `MetroLineLabelNode.css`
- Removed `MetroLineLabelNode` from types in `presentation.ts`

### Phase 2: Parallel Junction Lines ✅

- Added `JunctionHandle` interface to `src/types/presentation.ts`
- Added `junctionHandles` to `MetroStopNodeData`
- Updated `src/components/nodes/MetroStopNode.tsx` - renders both default handles AND junction-specific offset handles
- Updated `src/components/nodes/MetroStopNode.css` - taller junction circles (56px)
- Updated `src/utils/generateMetroLayout.ts`:
  - Added `JUNCTION_LINE_SPACING = 12`
  - Created junction handles for mapping, CLI, and closing junctions
  - Updated inter-section edges to use specific handle IDs (e.g., `right-0`, `left-1`)

### Phase 3: Subnodes (Partially Complete)

- Added `SubnodeContent` interface to `presentation.ts`
- Added `SubnodeNodeData` interface and `SubnodeNode` type
- Updated `PresentationNode` union to include `SubnodeNode`
- Created `src/components/nodes/SubnodeNode.tsx` - small clickable nodes with zoom-based visibility
- Created `src/components/nodes/SubnodeNode.css`
- Created `src/components/edges/ArcEdge.tsx` - curved edges from subnodes to parent
- Created `src/components/edges/ArcEdge.css`
- Added sample subnodes to `slide-03` in `src/data/slides.ts`
- Updated `generateMetroLayout.ts`:
  - Added `generateSubnodePositions()` function for arc positioning
  - Added subnode node and arc edge generation in main loop

---

## REMAINING TASKS

### Phase 3: Subnodes (To Complete)

1. **Update `src/components/MetroCanvas.tsx`**:
   - Import `SubnodeNode` from `./nodes/SubnodeNode`
   - Import `ArcEdge` from `./edges/ArcEdge`
   - Add to `nodeTypes`: `subnode: SubnodeNode`
   - Add to `edgeTypes`: `arcEdge: ArcEdge`
   - Update `nodesWithActiveState` to set `isExpanded: true` for subnodes when parent is active
   - Update edges state to set `isExpanded: true` on arc edges when parent is active

### Verification

1. Run `npm run build` to ensure no TypeScript errors
2. Run `npm run dev` to visually verify:
   - Line labels appear on metro bars (Phase 1)
   - Junction lines are parallel, not overlapping (Phase 2)
   - Subnodes appear when zoomed into slide-03 (Phase 3)
3. Run `npm run test` for any existing tests

---

## Key Files Modified

```
src/components/
├── edges/
│   ├── MetroLineEdge.tsx    # NEW - inline labels on edges
│   ├── MetroLineEdge.css    # NEW
│   ├── ArcEdge.tsx          # NEW - curved edges to subnodes
│   └── ArcEdge.css          # NEW
├── nodes/
│   ├── MetroStopNode.tsx    # MODIFIED - junction handles
│   ├── MetroStopNode.css    # MODIFIED - taller junctions
│   ├── SubnodeNode.tsx      # NEW - expandable child nodes
│   └── SubnodeNode.css      # NEW
│   └── MetroLineLabelNode.* # DELETED
└── MetroCanvas.tsx          # MODIFIED - needs subnode registration

src/types/
└── presentation.ts          # MODIFIED - added JunctionHandle, SubnodeContent, SubnodeNodeData

src/utils/
└── generateMetroLayout.ts   # MODIFIED - junction handles, subnode generation

src/data/
└── slides.ts                # MODIFIED - added subnodes to slide-03
```

---

## Code to Add to MetroCanvas.tsx

```tsx
// Add imports at top:
import SubnodeNode from "./nodes/SubnodeNode";
import ArcEdge from "./edges/ArcEdge";

// Update nodeTypes:
const nodeTypes = {
  metroStop: MetroStopNode,
  metroBackground: MetroBackgroundNode,
  resourceIcon: ResourceIconNode,
  slide: SlideNode,
  subnode: SubnodeNode, // ADD THIS
};

// Update edgeTypes:
const edgeTypes = {
  metroLine: MetroLineEdge,
  arcEdge: ArcEdge, // ADD THIS
};

// In nodesWithActiveState useMemo, add handling for subnode nodes:
// When a metro stop is active, its associated subnodes should have isExpanded: true
// Also update arc edges to have isExpanded: true
```
