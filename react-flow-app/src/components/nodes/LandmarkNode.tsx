import { memo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import { EDIT_MODE } from "../../config";
import "./LandmarkNode.css";

export interface LandmarkNodeData {
  [key: string]: unknown;
  image: string;
  label: string;
}

export type LandmarkNode = Node<LandmarkNodeData, "landmark">;

/**
 * Landmark node displaying a large decorative image.
 * Pure decoration - no click/hover interaction.
 * Shows subtle outline and label in edit mode for positioning.
 */
function LandmarkNode({ data }: NodeProps<LandmarkNode>) {
  return (
    <div className={`landmark-node ${EDIT_MODE ? "landmark-node--edit" : ""}`}>
      <img
        src={data.image}
        alt={data.label}
        className="landmark-node__image"
        draggable={false}
      />
      {EDIT_MODE && <div className="landmark-node__label">{data.label}</div>}
    </div>
  );
}

export default memo(LandmarkNode);
