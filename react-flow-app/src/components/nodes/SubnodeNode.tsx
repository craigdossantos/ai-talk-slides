import { memo } from "react";
import {
  Handle,
  Position,
  useStore,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import type { SubnodeNodeData } from "../../types/presentation";
import "./SubnodeNode.css";

// Zoom threshold for showing subnodes
const ZOOM_THRESHOLD = 0.5;

// Selector for zoom from React Flow store
const zoomSelector = (state: { transform: [number, number, number] }) =>
  state.transform[2];

export type SubnodeNodeType = Node<SubnodeNodeData, "subnode">;
type SubnodeNodeProps = NodeProps<SubnodeNodeType>;

function SubnodeNode({ data }: SubnodeNodeProps) {
  const { subnode, lineColor, isExpanded } = data;
  const zoom = useStore(zoomSelector);

  // Only show when expanded and zoomed in enough
  const isVisible = isExpanded && zoom >= ZOOM_THRESHOLD;

  // Calculate opacity based on zoom level (fade in between 0.5 and 0.7)
  const opacity = isVisible ? Math.min(1, (zoom - ZOOM_THRESHOLD) / 0.2) : 0;

  // Get icon based on subnode type
  const getTypeIcon = () => {
    switch (subnode.type) {
      case "resource":
        return "🔗";
      case "slide":
        return "📄";
      case "note":
        return "📝";
      default:
        return "•";
    }
  };

  const handleClick = () => {
    if (subnode.url) {
      window.open(subnode.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`subnode ${isVisible ? "subnode--visible" : ""}`}
      style={{
        opacity,
        transform: `scale(${isVisible ? 1 : 0.8})`,
        borderColor: lineColor,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Bottom} id="bottom" />

      <div className="subnode__icon" style={{ color: lineColor }}>
        {getTypeIcon()}
      </div>

      <div className="subnode__content">
        <div className="subnode__title">{subnode.title}</div>
        {subnode.content && (
          <div className="subnode__description">{subnode.content}</div>
        )}
      </div>

      {subnode.image && (
        <div className="subnode__image">
          <img src={subnode.image} alt={subnode.title} />
        </div>
      )}
    </div>
  );
}

export default memo(SubnodeNode);
