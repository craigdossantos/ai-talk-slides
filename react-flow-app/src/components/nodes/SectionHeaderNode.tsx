import { Handle, Position } from "@xyflow/react";
import type { SectionHeaderNodeProps } from "../../types/presentation";
import { NODE_DIMENSIONS, TRACK_COLORS } from "../../types/presentation";
import "./SectionHeaderNode.css";

function SectionHeaderNode({ data }: SectionHeaderNodeProps) {
  const { section, isActive } = data;
  const trackColor = TRACK_COLORS[section.track];
  const { width, height } = NODE_DIMENSIONS.sectionHeader;

  return (
    <div
      className={`section-header-node section-header-node--${section.track} ${isActive ? "section-header-node--active" : ""}`}
      style={
        {
          width: `${width}px`,
          height: `${height}px`,
          "--track-color": trackColor,
        } as React.CSSProperties
      }
    >
      <Handle
        type="target"
        position={Position.Left}
        className="section-header-node__handle"
      />
      <div className="section-header-node__content">
        <h2 className="section-header-node__title">{section.title}</h2>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="section-header-node__handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="section-header-node__handle"
      />
    </div>
  );
}

export default SectionHeaderNode;
