import { memo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import "./MetroBackgroundNode.css";

interface MetroBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

type MetroBackgroundNodeType = Node<MetroBackgroundNodeData, "metroBackground">;

function MetroBackgroundNode({ data }: NodeProps<MetroBackgroundNodeType>) {
  const { width, height } = data;

  return (
    <div
      className="metro-background"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default memo(MetroBackgroundNode);
