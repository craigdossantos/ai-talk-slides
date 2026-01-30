import { memo, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Handle, Position, useStore } from "@xyflow/react";
import type { MetroStopNodeProps } from "../../types/presentation";
import "./MetroStopNode.css";

// Zoom level thresholds
const ZOOM_MIN = 0.3; // Below this: thumbnails hidden
const ZOOM_FULL = 0.9; // Above this: full slide content (active only)

// Selector for zoom from React Flow store - this is the most reliable way to get zoom
const zoomSelector = (state: { transform: [number, number, number] }) =>
  state.transform[2];

function MetroStopNode({ data }: MetroStopNodeProps) {
  const {
    slide,
    lineColor,
    isActive,
    isJunction,
    junctionHandles,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
    isFullSlideOpen,
    onCloseFullSlide,
    isAnySlideOpen,
    resources,
  } = data;
  const [isHovered, setIsHovered] = useState(false);

  const linkResources = useMemo(
    () => (resources ?? []).filter((r) => r.type !== "prompt"),
    [resources],
  );

  // Get zoom directly from React Flow's internal store - always in sync
  const zoom = useStore(zoomSelector);

  const hasBullets = slide.bullets && slide.bullets.length > 0;
  const hasContent = hasBullets || slide.backgroundImage;

  // Thumbnail sizing constants (base width is 200px in CSS)
  const THUMBNAIL_MAX_SCALE = 1.5; // 200px * 1.5 = 300px max
  const THUMBNAIL_CONSTRAINED_SCALE = 1.25; // 200px * 1.25 = 250px when constrained

  // Calculate continuous scale factor for thumbnails
  // Scales from 0 at ZOOM_MIN, capped at max width
  const thumbnailScale = useMemo(() => {
    if (zoom < ZOOM_MIN) return 0; // Hidden below minimum zoom

    // Linear scale based on zoom
    const rawScale = (zoom - ZOOM_MIN) / (ZOOM_FULL - ZOOM_MIN);

    // Determine max scale: constrain to 250px if another slide is open or zoomed in
    const isZoomedIn = zoom >= ZOOM_FULL;
    const shouldConstrain = !isFullSlideOpen && (isAnySlideOpen || isZoomedIn);
    const maxScale = shouldConstrain
      ? THUMBNAIL_CONSTRAINED_SCALE
      : THUMBNAIL_MAX_SCALE;

    return Math.min(rawScale, maxScale);
  }, [zoom, isFullSlideOpen, isAnySlideOpen]);

  // Display logic - full slide is now click-triggered, not zoom-triggered
  const showFullSlide = isFullSlideOpen ?? false;
  const showThumbnail =
    slide.backgroundImage && thumbnailScale > 0 && !showFullSlide;
  const showTooltip = zoom < ZOOM_MIN && isHovered && hasContent;

  return (
    <div
      className={`metro-stop ${isActive ? "metro-stop--active" : ""}`}
      style={{ color: lineColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default handles - always rendered for intra-section edges */}
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />

      {/* Branch handles for subnode loop connections */}
      <Handle type="source" position={Position.Top} id="branch-out" />
      <Handle type="target" position={Position.Top} id="branch-in" />

      {/* Additional junction handles with offsets for parallel inter-section lines */}
      {junctionHandles &&
        junctionHandles
          .filter((h) => h.position === "left" || h.position === "top")
          .map((handle) => (
            <Handle
              key={handle.handleId}
              type="target"
              position={
                handle.position === "left" ? Position.Left : Position.Top
              }
              id={handle.handleId}
              style={{
                top:
                  handle.position === "left"
                    ? `calc(50% + ${handle.offset}px)`
                    : undefined,
                left:
                  handle.position === "top"
                    ? `calc(50% + ${handle.offset}px)`
                    : undefined,
              }}
            />
          ))}

      {/* Full slide content - rendered via portal to escape React Flow transforms */}
      {showFullSlide &&
        createPortal(
          <div className="metro-stop__full-slide">
            <button
              className="metro-stop__close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCloseFullSlide?.();
              }}
              aria-label="Close slide"
            >
              ×
            </button>
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
            {linkResources.length > 0 && (
              <div className="metro-stop__resources">
                <a
                  href={`/resources#${slide.id}`}
                  className="metro-stop__resources-heading"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resources
                </a>
                <ul>
                  {linkResources.slice(0, 4).map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.title}
                      </a>
                      <span className="metro-stop__resource-type">
                        {r.type}
                      </span>
                    </li>
                  ))}
                </ul>
                {linkResources.length > 4 && (
                  <a
                    href={`/resources#${slide.id}`}
                    className="metro-stop__resources-more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See all {linkResources.length} resources →
                  </a>
                )}
              </div>
            )}
          </div>,
          document.body,
        )}

      {/* Inline image - scales continuously with zoom */}
      {showThumbnail && (
        <div
          className="metro-stop__inline-image"
          style={{
            transform: `translateX(-50%) scale(${thumbnailScale})`,
            opacity: thumbnailScale,
          }}
        >
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

      {/* Default handles - always rendered for intra-section edges */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />

      {/* Additional junction handles with offsets for parallel inter-section lines */}
      {junctionHandles &&
        junctionHandles
          .filter((h) => h.position === "right" || h.position === "bottom")
          .map((handle) => (
            <Handle
              key={handle.handleId}
              type="source"
              position={
                handle.position === "right" ? Position.Right : Position.Bottom
              }
              id={handle.handleId}
              style={{
                top:
                  handle.position === "right"
                    ? `calc(50% + ${handle.offset}px)`
                    : undefined,
                left:
                  handle.position === "bottom"
                    ? `calc(50% + ${handle.offset}px)`
                    : undefined,
              }}
            />
          ))}
    </div>
  );
}

export default memo(MetroStopNode);
