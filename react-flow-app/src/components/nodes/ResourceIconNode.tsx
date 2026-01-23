import { memo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { Resource } from "../../types/presentation";
import "./ResourceIconNode.css";

interface ResourceIconNodeData {
  [key: string]: unknown;
  resource: Resource;
}

type ResourceIconNodeType = Node<ResourceIconNodeData, "resourceIcon">;

function ResourceIconNode({ data }: NodeProps<ResourceIconNodeType>) {
  const { resource } = data;

  const handleClick = () => {
    window.open(resource.url, "_blank");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tool":
        return "\u{1F527}";
      case "docs":
        return "\u{1F4C4}";
      case "video":
        return "\u{1F3AC}";
      case "github":
        return "\u{1F4BB}";
      default:
        return "\u{1F517}";
    }
  };

  return (
    <div className="resource-icon" onClick={handleClick} title={resource.title}>
      {resource.image ? (
        <img
          src={resource.image}
          alt={resource.title}
          className="resource-icon__image"
        />
      ) : (
        <span className="resource-icon__fallback">
          {getTypeIcon(resource.type)}
        </span>
      )}
    </div>
  );
}

export default memo(ResourceIconNode);
