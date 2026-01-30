import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import "./RiverWaypointNode.css";

export interface RiverWaypointNodeData {
  [key: string]: unknown;
  waypointIndex: number;
  isEditMode?: boolean; // Runtime edit mode from parent
}

export type RiverWaypointNode = Node<RiverWaypointNodeData, "riverWaypoint">;

/**
 * River waypoint node - invisible control point for shaping the river path.
 * Invisible in presentation mode, shows subtle dot in edit mode.
 * Draggable only when data.isEditMode = true.
 */
function RiverWaypointNode({ data }: NodeProps<RiverWaypointNode>) {
  return (
    <div
      className={`river-waypoint-node ${data.isEditMode ? "river-waypoint-node--edit" : ""}`}
    >
      {data.isEditMode && (
        <>
          <div className="river-waypoint-node__dot" />
          <div className="river-waypoint-node__label">{data.waypointIndex}</div>
        </>
      )}
      {/* Handles for connecting river edges */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="river-waypoint-node__handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="river-waypoint-node__handle"
      />
    </div>
  );
}

export default memo(RiverWaypointNode);
