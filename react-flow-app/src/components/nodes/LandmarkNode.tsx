import { memo, useState, useCallback, useRef } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import { EDIT_MODE } from "../../config";
import {
  loadPersistedPositions,
  savePersistedPositions,
} from "../../utils/persistence";
import "./LandmarkNode.css";

export interface LandmarkNodeData {
  [key: string]: unknown;
  image?: string; // Optional - for PNG landmarks
  svgType?: "water" | "landmass"; // For inline SVG landmarks
  label: string;
  scale?: number; // Persisted scale factor
}

export type LandmarkNode = Node<LandmarkNodeData, "landmark">;

/**
 * Landmark node displaying a large decorative image or inline SVG.
 * Pure decoration - no click/hover interaction.
 * Shows subtle outline, label, and resize handle in edit mode.
 */
function LandmarkNode({ id, data }: NodeProps<LandmarkNode>) {
  const [scale, setScale] = useState(data.scale ?? 1);
  const scaleRef = useRef(scale); // Track current scale for event handlers
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startScale = useRef(1);

  // Keep scaleRef in sync
  scaleRef.current = scale;

  // River color - matches RiverEdge.tsx
  const RIVER_COLOR = "#93c5fd";

  // Render inline SVG for geographic features
  const renderContent = () => {
    if (data.svgType === "water") {
      // Smooth organic water shapes matching river color
      const waterVariant = id.includes("water-2") ? 2 : 1;

      // Each water body has a distinct shape
      const waterConfigs: Record<
        number,
        { path: string; viewBox: string; width: number; height: number }
      > = {
        // Water 1 - wide round lake with gentle bays
        1: {
          path: `M50,200
                 Q30,120 100,80 Q180,50 280,60 Q380,70 440,120
                 Q500,180 480,260 Q450,340 360,370
                 Q260,400 160,380 Q80,350 40,280
                 Q20,240 50,200 Z`,
          viewBox: "0 0 520 420",
          width: 520,
          height: 420,
        },
        // Water 2 - long winding river/fjord shape
        2: {
          path: `M30,120
                 Q60,80 120,90 Q180,70 240,100 Q300,80 360,110
                 Q420,90 480,130 Q540,170 520,220
                 Q500,270 440,260 Q380,290 320,270
                 Q260,300 200,280 Q140,310 80,280
                 Q20,250 30,180 Q20,150 30,120 Z`,
          viewBox: "0 0 560 340",
          width: 560,
          height: 340,
        },
      };

      const config = waterConfigs[waterVariant];

      return (
        <svg
          width={config.width}
          height={config.height}
          className="landmark-node__svg"
          viewBox={config.viewBox}
        >
          <defs>
            <filter id={`blur-${id}`}>
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <path
            d={config.path}
            fill={RIVER_COLOR}
            opacity="0.5"
            filter={`url(#blur-${id})`}
          />
        </svg>
      );
    }
    if (data.svgType === "landmass") {
      // Three very different angular landmass shapes
      const landmassVariant = id.includes("landmass-2")
        ? 2
        : id.includes("landmass-3")
          ? 3
          : 1;

      // Each landmass has a distinctly different silhouette
      const landmassConfigs: Record<
        number,
        { path: string; viewBox: string; width: number; height: number }
      > = {
        // Landmass 1 - tall narrow vertical shape like a peninsula
        1: {
          path: `M80,30 L140,10 L200,50 L180,120 L220,180 L200,260
                 L240,320 L200,400 L140,450 L80,420 L40,350 L60,280
                 L20,200 L50,120 L30,60 Z`,
          viewBox: "0 0 260 470",
          width: 260,
          height: 470,
        },
        // Landmass 2 - wide flat horizontal shape like an island chain
        2: {
          path: `M20,100 L80,60 L160,80 L240,40 L340,70 L420,30 L500,60
                 L560,100 L540,160 L480,140 L400,180 L320,150 L240,190
                 L160,160 L80,200 L20,160 Z`,
          viewBox: "0 0 580 220",
          width: 580,
          height: 220,
        },
        // Landmass 3 - complex irregular shape with deep inlets
        3: {
          path: `M60,160 L100,60 L180,100 L220,40 L300,80 L280,160
                 L360,140 L420,60 L480,120 L460,200 L500,280 L440,320
                 L480,380 L400,420 L320,380 L260,420 L180,380 L120,420
                 L60,360 L100,280 L40,220 Z`,
          viewBox: "0 0 520 440",
          width: 520,
          height: 440,
        },
      };

      const config = landmassConfigs[landmassVariant];

      return (
        <svg
          width={config.width}
          height={config.height}
          className="landmark-node__svg"
          viewBox={config.viewBox}
        >
          <path d={config.path} fill="rgba(139, 90, 43, 0.12)" />
        </svg>
      );
    }
    // Default: render image
    if (data.image) {
      return (
        <img
          src={data.image}
          alt={data.label}
          className="landmark-node__image"
          draggable={false}
        />
      );
    }
    return null;
  };

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing.current = true;
      startX.current = e.clientX;
      startScale.current = scaleRef.current;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return;
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        const deltaX = moveEvent.clientX - startX.current;
        // Scale sensitivity: 100px drag = 0.5 scale change
        const newScale = Math.max(0.2, startScale.current + deltaX / 200);
        setScale(newScale);
        scaleRef.current = newScale;
      };

      const handleMouseUp = () => {
        if (isResizing.current) {
          isResizing.current = false;
          // Persist scale to localStorage using ref for current value
          const existingPositions = loadPersistedPositions() || {};
          const existingNodeData = existingPositions[id] || { x: 0, y: 0 };
          savePersistedPositions({
            ...existingPositions,
            [id]: { ...existingNodeData, scale: scaleRef.current },
          });
        }
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [id],
  );

  return (
    <div
      className={`landmark-node ${EDIT_MODE ? "landmark-node--edit" : ""}`}
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      {renderContent()}
      {EDIT_MODE && (
        <>
          <div className="landmark-node__label">{data.label}</div>
          {/* nodrag nopan classes prevent React Flow from intercepting drag events */}
          <div
            className="landmark-node__resize-handle nodrag nopan"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </div>
  );
}

export default memo(LandmarkNode);
