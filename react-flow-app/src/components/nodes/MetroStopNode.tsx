import { memo, useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { MetroStopNodeProps } from "../../types/presentation";
import "./MetroStopNode.css";

// Zoom level thresholds
const ZOOM_TOOLTIP = 1.5; // Below this: tooltip on hover
const ZOOM_FULL = 2.5; // Above this: full slide content

function MetroStopNode({ data }: MetroStopNodeProps) {
  const {
    slide,
    lineColor,
    isActive,
    isJunction,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
  } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { getViewport } = useReactFlow();

  // Track zoom level changes
  useEffect(() => {
    const checkZoom = () => setZoom(getViewport().zoom);
    checkZoom(); // Initial check
    const interval = setInterval(checkZoom, 100);
    return () => clearInterval(interval);
  }, [getViewport]);

  const hasBullets = slide.bullets && slide.bullets.length > 0;
  const hasContent = hasBullets || slide.backgroundImage;

  // Three zoom levels - full slide only shows for active node
  const showTooltip = zoom < ZOOM_TOOLTIP && isHovered && hasContent;
  const isFullZoom = zoom >= ZOOM_FULL;
  const showFullSlide = isFullZoom && isActive; // Only active node shows full content
  const showInlineImage =
    slide.backgroundImage &&
    ((zoom >= ZOOM_TOOLTIP && zoom < ZOOM_FULL) || (isFullZoom && !isActive)); // Non-active nodes show inline at full zoom

  return (
    <div
      className={`metro-stop ${isActive ? "metro-stop--active" : ""}`}
      style={{ color: lineColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />

      {/* Full slide content - shown at highest zoom */}
      {showFullSlide && (
        <div className="metro-stop__full-slide">
          {slide.backgroundImage && (
            <img src={slide.backgroundImage} alt={slide.title} />
          )}
          <div className="metro-stop__full-content">
            <h3>{slide.title}</h3>
            {slide.subtitle && (
              <p className="metro-stop__full-subtitle">{slide.subtitle}</p>
            )}
            {hasBullets && (
              <ul>
                {slide.bullets!.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
          {(onPrevious || onNext) && (
            <div className="metro-stop__nav">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious?.();
                }}
                disabled={!hasPrevious}
              >
                ← Prev
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                disabled={!hasNext}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline image - shown at medium zoom */}
      {showInlineImage && (
        <div className="metro-stop__inline-image">
          <img src={slide.backgroundImage} alt={slide.title} />
          <div className="metro-stop__inline-title">{slide.title}</div>
        </div>
      )}

      <div
        className={`metro-stop__circle ${isJunction ? "metro-stop__circle--junction" : ""}`}
      />

      <div className="metro-stop__label">{slide.title}</div>

      {/* Tooltip - shown when zoomed out and hovering */}
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
