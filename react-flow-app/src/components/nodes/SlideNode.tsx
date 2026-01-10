import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { SlideNodeProps } from "../../types/presentation";
import { NODE_DIMENSIONS, TRACK_COLORS } from "../../types/presentation";
import "./SlideNode.css";

function SlideNode({ data }: SlideNodeProps) {
  const { slide, section, isActive } = data;
  const trackColor = TRACK_COLORS[section.track];
  const { width, height } = NODE_DIMENSIONS.slide;

  // Render content based on slide type
  const renderContent = () => {
    switch (slide.type) {
      case "title":
        return (
          <div className="slide-node__content slide-node__content--title">
            <h2 className="slide-node__title slide-node__title--large">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="slide-node__subtitle">{slide.subtitle}</p>
            )}
          </div>
        );

      case "section-header":
        return (
          <div className="slide-node__content slide-node__content--section">
            <h3 className="slide-node__title">{slide.title}</h3>
            {slide.subtitle && (
              <p className="slide-node__subtitle">{slide.subtitle}</p>
            )}
          </div>
        );

      case "quote":
        return (
          <div className="slide-node__content slide-node__content--quote">
            {slide.quote && (
              <blockquote className="slide-node__quote">
                "{slide.quote}"
              </blockquote>
            )}
            {slide.title && (
              <p className="slide-node__attribution">— {slide.title}</p>
            )}
          </div>
        );

      case "content":
      default:
        return (
          <div className="slide-node__content">
            <h3 className="slide-node__title">{slide.title}</h3>
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="slide-node__bullets">
                {slide.bullets.slice(0, 3).map((bullet, index) => (
                  <li key={index} className="slide-node__bullet">
                    {bullet}
                  </li>
                ))}
                {slide.bullets.length > 3 && (
                  <li className="slide-node__bullet slide-node__bullet--more">
                    +{slide.bullets.length - 3} more
                  </li>
                )}
              </ul>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`slide-node ${isActive ? "slide-node--active" : ""}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderTopColor: trackColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="slide-node__handle"
      />

      {/* Hero image area - 60% height */}
      <div className="slide-node__hero">
        {slide.backgroundImage && (
          <img
            src={slide.backgroundImage}
            alt={slide.title}
            loading="lazy"
            className="slide-node__hero-image"
          />
        )}
        {slide.level !== undefined && (
          <span className="slide-node__level">Level {slide.level}</span>
        )}
      </div>

      {/* Content area - 40% height */}
      <div className="slide-node__content-wrapper">{renderContent()}</div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="slide-node__handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="slide-node__handle"
      />
    </div>
  );
}

export default memo(SlideNode);
