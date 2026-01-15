import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { MetroStopNodeProps } from "../../types/presentation";
import "./MetroStopNode.css";

function MetroStopNode({ data }: MetroStopNodeProps) {
  const { slide, lineColor, isActive, isJunction } = data;
  const [isHovered, setIsHovered] = useState(false);

  const hasBullets = slide.bullets && slide.bullets.length > 0;
  const showTooltip = isHovered && (hasBullets || slide.backgroundImage);

  return (
    <div
      className={`metro-stop ${isActive ? "metro-stop--active" : ""}`}
      style={{ color: lineColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />

      <div
        className={`metro-stop__circle ${isJunction ? "metro-stop__circle--junction" : ""}`}
      />

      <div className="metro-stop__label">{slide.title}</div>

      {showTooltip && (
        <div className="metro-stop__tooltip">
          {slide.backgroundImage && (
            <div className="metro-stop__tooltip-image">
              <img src={slide.backgroundImage} alt={slide.title} />
            </div>
          )}
          <h4 className="metro-stop__tooltip-title">{slide.title}</h4>
          {hasBullets && (
            <ul className="metro-stop__tooltip-bullets">
              {slide.bullets!.slice(0, 3).map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
              {slide.bullets!.length > 3 && (
                <li className="metro-stop__tooltip-more">
                  +{slide.bullets!.length - 3} more...
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}

export default memo(MetroStopNode);
