import {
  getSmoothStepPath,
  EdgeLabelRenderer,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";
import "./MetroLineEdge.css";

export interface MetroLineEdgeData {
  [key: string]: unknown;
  lineLabel?: string;
  lineSubtitle?: string;
  lineColor?: string;
}

export type MetroLineEdge = Edge<MetroLineEdgeData, "metroLine">;

function MetroLineEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps<MetroLineEdge>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 20,
  });

  const lineColor = data?.lineColor || (style?.stroke as string) || "#6b7280";
  const hasLabel = data?.lineLabel;

  return (
    <>
      {/* Main metro line path */}
      <path
        id={id}
        d={edgePath}
        style={{
          ...style,
          fill: "none",
        }}
      />

      {/* Inline label on the edge */}
      {hasLabel && (
        <EdgeLabelRenderer>
          <div
            className="metro-line-edge-label"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <div
              className="metro-line-edge-label__bar"
              style={{ backgroundColor: lineColor }}
            >
              <span className="metro-line-edge-label__name">
                {data.lineLabel}
              </span>
            </div>
            {data.lineSubtitle && (
              <div className="metro-line-edge-label__subtitle">
                {data.lineSubtitle}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default MetroLineEdge;
