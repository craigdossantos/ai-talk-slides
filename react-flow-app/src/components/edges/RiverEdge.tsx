import { memo, useId } from "react";
import { getBezierPath, type EdgeProps, type Edge } from "@xyflow/react";
import "./RiverEdge.css";

export interface RiverEdgeData {
  [key: string]: unknown;
  label?: string;
  strokeWidth?: number;
}

export type RiverEdge = Edge<RiverEdgeData, "riverEdge">;

// River color - muted blue, distinct from metro blue
const RIVER_COLOR = "#93c5fd";

/**
 * River edge - smooth bezier curve representing a river.
 * Features:
 * - Muted blue color
 * - Variable stroke width (thinner at ends, thicker in middle via CSS)
 * - Optional curved text label following the path
 * - Z-index below metro lines
 */
function RiverEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<RiverEdge>) {
  const pathId = useId();

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const strokeWidth = data?.strokeWidth ?? 150;
  const label = data?.label;

  return (
    <g className="river-edge">
      {/* Main river path - base layer with transparency */}
      <path
        id={`${pathId}-base`}
        d={edgePath}
        className="river-edge__path river-edge__path--base"
        style={{
          stroke: RIVER_COLOR,
          strokeWidth: strokeWidth,
          strokeOpacity: 0.3,
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />

      {/* River path - highlight layer */}
      <path
        id={`${pathId}-highlight`}
        d={edgePath}
        className="river-edge__path river-edge__path--highlight"
        style={{
          stroke: RIVER_COLOR,
          strokeWidth: strokeWidth * 0.5,
          strokeOpacity: 0.5,
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />

      {/* River path for text to follow */}
      {label && (
        <>
          {/* SVG filter for text outline/glow effect */}
          <defs>
            <filter
              id={`${id}-text-outline`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feMorphology
                in="SourceAlpha"
                result="dilated"
                operator="dilate"
                radius="2"
              />
              <feFlood floodColor="white" floodOpacity="0.8" result="flood" />
              <feComposite
                in="flood"
                in2="dilated"
                operator="in"
                result="outline"
              />
              <feMerge>
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            id={`${id}-text-path`}
            d={edgePath}
            style={{
              fill: "none",
              stroke: "none",
            }}
          />
          <text
            className="river-edge__label"
            filter={`url(#${id}-text-outline)`}
          >
            <textPath
              href={`#${id}-text-path`}
              startOffset="50%"
              textAnchor="middle"
            >
              {label}
            </textPath>
          </text>
        </>
      )}
    </g>
  );
}

export default memo(RiverEdge);
