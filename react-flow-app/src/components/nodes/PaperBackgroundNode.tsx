import type { NodeProps } from "@xyflow/react";
import "./PaperBackgroundNode.css";

interface PaperBackgroundData {
  width: number;
  height: number;
}

function PaperBackgroundNode({ data }: NodeProps) {
  const { width, height } = data as unknown as PaperBackgroundData;

  return (
    <div
      className="paper-background-node"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default PaperBackgroundNode;
