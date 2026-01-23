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
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startScale = useRef(1);

  // Render inline SVG for geographic features
  const renderContent = () => {
    if (data.svgType === "water") {
      // Irregular lake blob shapes - very non-circular
      const waterVariant = id.includes("water-2") ? 2 : 1;
      return (
        <svg
          width="450"
          height="350"
          className="landmark-node__svg"
          viewBox="0 0 450 350"
        >
          <defs>
            <filter id={`blur-${id}`}>
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          {waterVariant === 2 ? (
            // Lake 2 - elongated irregular blob with inlets
            <path
              d="M30,180
                 C40,120 80,100 130,80
                 C180,60 220,90 260,70
                 C320,45 380,80 410,130
                 C430,180 420,220 390,260
                 C350,300 280,310 220,290
                 C160,270 140,300 90,280
                 C40,260 20,220 30,180 Z"
              fill="#7dd3fc"
              opacity="0.45"
              filter={`url(#blur-${id})`}
            />
          ) : (
            // Lake 1 - sprawling irregular shape with peninsula
            <path
              d="M60,200
                 C50,140 90,100 150,90
                 C190,85 210,60 270,70
                 C330,80 350,50 400,90
                 C440,130 420,180 400,220
                 C380,260 340,250 300,280
                 C250,310 200,290 160,310
                 C100,330 70,280 60,200 Z"
              fill="#93c5fd"
              opacity="0.5"
              filter={`url(#blur-${id})`}
            />
          )}
        </svg>
      );
    }
    if (data.svgType === "landmass") {
      // Three different irregular angular landmasses
      const landmassVariant = id.includes("landmass-2")
        ? 2
        : id.includes("landmass-3")
          ? 3
          : 1;

      const landmassPaths: Record<number, string> = {
        // Landmass 1 - jagged peninsula shape
        1: `M40,160 L90,60 L180,40 L240,80 L320,50 L400,90 L450,160
            L470,250 L420,320 L340,350 L260,310 L180,340 L100,300
            L50,240 Z`,
        // Landmass 2 - angular archipelago-like shape
        2: `M60,120 L130,50 L220,70 L280,30 L360,60 L420,120
            L440,200 L400,260 L320,240 L280,290 L200,270 L140,310
            L80,260 L40,180 Z`,
        // Landmass 3 - irregular fjord-like shape
        3: `M50,180 L100,80 L170,100 L230,50 L310,80 L380,40 L450,100
            L470,180 L440,260 L360,290 L280,260 L220,300 L140,280
            L80,320 L30,250 Z`,
      };

      return (
        <svg
          width="500"
          height="380"
          className="landmark-node__svg"
          viewBox="0 0 500 380"
        >
          <path
            d={landmassPaths[landmassVariant]}
            fill="rgba(139, 90, 43, 0.12)"
          />
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
      startScale.current = scale;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return;
        const deltaX = moveEvent.clientX - startX.current;
        // Scale sensitivity: 100px drag = 0.5 scale change
        const newScale = Math.max(0.2, startScale.current + deltaX / 200);
        setScale(newScale);
      };

      const handleMouseUp = () => {
        if (isResizing.current) {
          isResizing.current = false;
          // Persist scale to localStorage
          const existingPositions = loadPersistedPositions() || {};
          const existingNodeData = existingPositions[id] || { x: 0, y: 0 };
          savePersistedPositions({
            ...existingPositions,
            [id]: { ...existingNodeData, scale },
          });
        }
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [id, scale],
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
          <div
            className="landmark-node__resize-handle"
            onMouseDown={handleResizeStart}
          />
        </>
      )}
    </div>
  );
}

export default memo(LandmarkNode);
