import { memo } from "react";
import "./NavigationControls.css";

interface NavigationControlsProps {
  currentSlideIndex: number;
  totalSlides: number;
  isOverviewMode: boolean;
  isEditMode: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleOverview: () => void;
  onReset: () => void;
  onExportPositions: () => void;
}

/**
 * Bottom navigation controls for the presentation.
 * Shows Previous/Next buttons, progress indicator, and overview toggle.
 */
function NavigationControls({
  currentSlideIndex,
  totalSlides,
  isOverviewMode,
  isEditMode,
  onPrevious,
  onNext,
  onToggleOverview,
  onReset,
  onExportPositions,
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

      <button
        className="navigation-controls__button navigation-controls__button--reset"
        onClick={onReset}
        aria-label="Reset layout to default positions"
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
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      <button
        className="navigation-controls__button navigation-controls__button--resources"
        onClick={() => window.open("/resources", "_blank")}
        aria-label="Open resources page"
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span className="navigation-controls__label">Resources</span>
      </button>

      {isEditMode && (
        <button
          className="navigation-controls__button navigation-controls__button--export"
          onClick={onExportPositions}
          aria-label="Export node positions to JSON file"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="navigation-controls__label">Export</span>
        </button>
      )}

      <span className="navigation-controls__help">
        {isEditMode
          ? "Edit mode: Drag to reposition • Export to save positions"
          : "Drag handles to connect • Shift+click edge to delete"}
      </span>
    </div>
  );
}

export default memo(NavigationControls);
