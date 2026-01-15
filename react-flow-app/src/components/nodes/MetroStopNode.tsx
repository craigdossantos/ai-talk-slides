import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { MetroStopNodeProps } from "../../types/presentation";
import "./MetroStopNode.css";

function MetroStopNode({ data }: MetroStopNodeProps) {
  const { slide, lineColor, isActive } = data;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`metro-stop ${isActive ? "metro-stop--active" : ""}`}
      style={{ color: lineColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />

      <div className="metro-stop__circle" />

      <div className="metro-stop__label">{slide.title}</div>

      {isHovered && slide.bullets && slide.bullets.length > 0 && (
        <div className="metro-stop__tooltip">
          <h4 className="metro-stop__tooltip-title">{slide.title}</h4>
          <ul className="metro-stop__tooltip-bullets">
            {slide.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}

      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}

export default memo(MetroStopNode);
