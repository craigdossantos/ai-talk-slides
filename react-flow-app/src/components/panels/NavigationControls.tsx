import { memo } from "react";
import "./NavigationControls.css";

interface NavigationControlsProps {
  currentSlideIndex: number;
  totalSlides: number;
  isOverviewMode: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleOverview: () => void;
}

/**
 * Bottom navigation controls for the presentation.
 * Shows Previous/Next buttons, progress indicator, and overview toggle.
 */
function NavigationControls({
  currentSlideIndex,
  totalSlides,
  isOverviewMode,
  onPrevious,
  onNext,
  onToggleOverview,
}: NavigationControlsProps) {
  const isFirstSlide = currentSlideIndex <= 0;
  const isLastSlide = currentSlideIndex >= totalSlides - 1;
  const displayIndex = currentSlideIndex >= 0 ? currentSlideIndex + 1 : 0;

  return (
    <div className="navigation-controls">
      <button
        className="navigation-controls__button navigation-controls__button--previous"
        onClick={onPrevious}
        disabled={isFirstSlide}
        aria-label="Previous slide"
      >
        <svg
          className="navigation-controls__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="navigation-controls__label">Previous</span>
      </button>

      <div className="navigation-controls__progress">
        <span className="navigation-controls__current">{displayIndex}</span>
        <span className="navigation-controls__separator">/</span>
        <span className="navigation-controls__total">{totalSlides}</span>
      </div>

      <button
        className="navigation-controls__button navigation-controls__button--next"
        onClick={onNext}
        disabled={isLastSlide}
        aria-label="Next slide"
      >
        <span className="navigation-controls__label">Next</span>
        <svg
          className="navigation-controls__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        className={`navigation-controls__button navigation-controls__button--overview ${isOverviewMode ? "navigation-controls__button--active" : ""}`}
        onClick={onToggleOverview}
        aria-label={
          isOverviewMode ? "Exit overview mode" : "Enter overview mode"
        }
        aria-pressed={isOverviewMode}
      >
        <svg
          className="navigation-controls__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
    </div>
  );
}

export default memo(NavigationControls);
