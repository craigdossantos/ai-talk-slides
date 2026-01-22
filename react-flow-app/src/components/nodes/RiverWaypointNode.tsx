import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { EDIT_MODE } from "../../config";
import "./RiverWaypointNode.css";

export interface RiverWaypointNodeData {
  [key: string]: unknown;
  waypointIndex: number;
}

export type RiverWaypointNode = Node<RiverWaypointNodeData, "riverWaypoint">;

/**
 * River waypoint node - invisible control point for shaping the river path.
 * Invisible in presentation mode, shows subtle dot in edit mode.
 * Draggable only when EDIT_MODE = true.
 */
function RiverWaypointNode({ data }: NodeProps<RiverWaypointNode>) {
  return (
    <div
      className={`river-waypoint-node ${EDIT_MODE ? "river-waypoint-node--edit" : ""}`}
    >
      {EDIT_MODE && (
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
