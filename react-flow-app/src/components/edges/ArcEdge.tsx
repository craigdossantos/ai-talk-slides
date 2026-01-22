import { type EdgeProps, type Edge, useStore } from "@xyflow/react";
import "./ArcEdge.css";

// Zoom threshold for showing arc edges
const ZOOM_THRESHOLD = 0.5;

// Selector for zoom from React Flow store
const zoomSelector = (state: { transform: [number, number, number] }) =>
  state.transform[2];

export interface ArcEdgeData {
  [key: string]: unknown;
  lineColor?: string;
  isExpanded?: boolean;
}

export type ArcEdge = Edge<ArcEdgeData, "arcEdge">;

function ArcEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
}: EdgeProps<ArcEdge>) {
  const zoom = useStore(zoomSelector);
  const lineColor = data?.lineColor || (style?.stroke as string) || "#6b7280";
  const isExpanded = data?.isExpanded ?? false;

  // Only show when expanded and zoomed in
  const isVisible = isExpanded && zoom >= ZOOM_THRESHOLD;
  const opacity = isVisible ? Math.min(1, (zoom - ZOOM_THRESHOLD) / 0.2) : 0;

  // Create a curved path from source to target
  // Source is at bottom of subnode, target is at top of metro stop
  // We create an upward curve that arcs nicely

  // Calculate control points for a smooth bezier curve
  const midX = (sourceX + targetX) / 2;
  const deltaY = Math.abs(targetY - sourceY);

  // Control points create a smooth arc
  // The curve goes from source (subnode bottom) down to target (metro stop top)
  const controlY1 = sourceY + deltaY * 0.3;
  const controlY2 = targetY - deltaY * 0.3;

  const path = `M ${sourceX},${sourceY} C ${midX},${controlY1} ${midX},${controlY2} ${targetX},${targetY}`;

  return (
    <path
      id={id}
      d={path}
      className="arc-edge"
      style={{
        stroke: lineColor,
        strokeWidth: 2,
        fill: "none",
        opacity,
        transition: "opacity 0.3s ease",
        ...style,
      }}
    />
  );
}

export default ArcEdge;
