import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { LevelNodeData } from "../../types/presentation";
import { TRACK_COLORS } from "../../types/presentation";
import "./LevelNode.css";

type LevelNodeType = Node<LevelNodeData, "level">;

function LevelNode({ data }: NodeProps<LevelNodeType>) {
  const { level, track } = data;
  const trackColor = TRACK_COLORS[track];

  // Create gradient from track color to a lighter version
  const gradientStyle = {
    background: `linear-gradient(135deg, ${trackColor} 0%, ${trackColor}dd 100%)`,
  };

  return (
    <div className="level-node" style={gradientStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="level-node__handle"
      />

      <span className="level-node__number">{level}</span>
    </div>
  );
}

export default memo(LevelNode);
