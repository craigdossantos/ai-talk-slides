import { memo, useCallback, useState } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import "./MetroLineLabelNode.css";

export interface MetroLineLabelNodeData {
  [key: string]: unknown;
  lineColor: string;
  lineName: string;
  subtitle: string;
}

export type MetroLineLabelNode = Node<MetroLineLabelNodeData, "metroLineLabel">;
export type MetroLineLabelNodeProps = NodeProps<MetroLineLabelNode>;

function MetroLineLabelNode({ data }: MetroLineLabelNodeProps) {
  const { lineColor, lineName, subtitle } = data;
  const [isDragging, setIsDragging] = useState(false);

  // Save position when dragging ends
  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    // Position is saved via the global onNodesChange handler in MetroCanvas
    // We just track local state here for visual feedback
  }, []);

  return (
    <div
      className={`metro-line-label ${isDragging ? "metro-line-label--dragging" : ""}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={handleDragStop}
      onMouseLeave={handleDragStop}
    >
      <div
        className="metro-line-label__color-bar"
        style={{ backgroundColor: lineColor }}
      />
      <div className="metro-line-label__content">
        <span className="metro-line-label__name" style={{ color: lineColor }}>
          {lineName}
        </span>
        <span className="metro-line-label__subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

export default memo(MetroLineLabelNode);
