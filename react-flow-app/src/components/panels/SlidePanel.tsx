import { memo, useEffect } from "react";
import type { SlideContent } from "../../types/presentation";
import "./SlidePanel.css";

interface SlidePanelProps {
  slide: SlideContent | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function SlidePanel({
  slide,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: SlidePanelProps) {
  useEffect(() => {
    if (!slide) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (hasPrevious) {
            e.preventDefault();
            onPrevious();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            e.preventDefault();
            onNext();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slide, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!slide) return null;

  return (
    <div className="slide-panel-overlay" onClick={onClose}>
      <div className="slide-panel" onClick={(e) => e.stopPropagation()}>
        <button className="slide-panel__close" onClick={onClose}>
          ×
        </button>

        {slide.backgroundImage && (
          <div className="slide-panel__image">
            <img src={slide.backgroundImage} alt={slide.title} />
          </div>
        )}

        <div className="slide-panel__content">
          <h2 className="slide-panel__title">{slide.title}</h2>
          {slide.subtitle && (
            <p className="slide-panel__subtitle">{slide.subtitle}</p>
          )}

          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="slide-panel__bullets">
              {slide.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="slide-panel__nav">
          <button
            className="slide-panel__nav-btn"
            onClick={onPrevious}
            disabled={!hasPrevious}
          >
            ← Previous
          </button>
          <button
            className="slide-panel__nav-btn"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(SlidePanel);
