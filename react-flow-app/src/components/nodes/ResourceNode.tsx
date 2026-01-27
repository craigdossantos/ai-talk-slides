import { memo, useState } from "react";
import type { ReactElement } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ResourceNodeProps, ResourceType } from "../../types/presentation";
import { NODE_DIMENSIONS } from "../../types/presentation";
import "./ResourceNode.css";

// Icon components for each resource type
const ResourceIcons: Record<ResourceType, ReactElement> = {
  article: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  prompt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
};

function ResourceNode({ data }: ResourceNodeProps) {
  const { resource, isActive } = data;
  const { width, height } = NODE_DIMENSIONS.resource;
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  // Truncate title if too long
  const truncatedTitle =
    resource.title.length > 20
      ? resource.title.slice(0, 18) + "..."
      : resource.title;

  const hasImage = resource.image && !imageError;

  return (
    <div
      className={`resource-node resource-node--${resource.type} ${isActive ? "resource-node--active" : ""} ${hasImage ? "resource-node--has-image" : ""}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="resource-node__handle"
      />
      {hasImage ? (
        <div className="resource-node__thumbnail">
          <img
            src={resource.image}
            alt={resource.title}
            className="resource-node__thumbnail-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="resource-node__icon">
          {ResourceIcons[resource.type]}
        </div>
      )}
      <div className="resource-node__content">
        <span className="resource-node__title" title={resource.title}>
          {truncatedTitle}
        </span>
        <span className="resource-node__type">{resource.type}</span>
      </div>
    </div>
  );
}

export default memo(ResourceNode);
