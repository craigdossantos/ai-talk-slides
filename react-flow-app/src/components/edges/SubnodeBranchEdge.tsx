import {
  type EdgeProps,
  type Edge,
  useStore,
  getSmoothStepPath,
} from "@xyflow/react";
import "./SubnodeBranchEdge.css";

// Zoom threshold for showing branch edges (same as ArcEdge)
const ZOOM_THRESHOLD = 0.5;

// Selector for zoom from React Flow store
const zoomSelector = (state: { transform: [number, number, number] }) =>
  state.transform[2];

export interface SubnodeBranchEdgeData {
  [key: string]: unknown;
  lineColor?: string;
  isExpanded?: boolean;
  parentSlideId?: string; // The slide ID this branch belongs to (e.g., "slide-03")
}

export type SubnodeBranchEdge = Edge<SubnodeBranchEdgeData, "subnodeBranch">;

function SubnodeBranchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps<SubnodeBranchEdge>) {
  const zoom = useStore(zoomSelector);
  const lineColor = data?.lineColor || (style?.stroke as string) || "#6b7280";
  const isExpanded = data?.isExpanded ?? false;

  // Only show when expanded and zoomed in
  const isVisible = isExpanded && zoom >= ZOOM_THRESHOLD;
  const opacity = isVisible ? Math.min(1, (zoom - ZOOM_THRESHOLD) / 0.2) : 0;

  // Use getSmoothStepPath for metro-style corners
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8, // Small radius for metro-style corners
  });

  return (
    <path
      id={id}
      d={edgePath}
      className="subnode-branch-edge"
      style={{
        stroke: lineColor,
        strokeWidth: 4,
        strokeDasharray: "8 4",
        fill: "none",
        opacity,
        transition: "opacity 0.3s ease",
        ...style,
      }}
    />
  );
}

export default SubnodeBranchEdge;
