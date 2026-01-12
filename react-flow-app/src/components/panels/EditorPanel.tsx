import { memo } from "react";
import type { SlideContent, Section } from "../../types/presentation";
import "./EditorPanel.css";

interface EditorPanelProps {
  slideId: string | null;
  slideData: { slide: SlideContent; section: Section } | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Left-side editor panel for adding notes and custom resources to slides.
 * Opens when a slide is double-clicked.
 */
function EditorPanel({
  slideId,
  slideData,
  isOpen,
  onClose,
}: EditorPanelProps) {
  // Return null if panel is closed or no slide is selected
  if (!isOpen || !slideId || !slideData) {
    return null;
  }

  const { slide } = slideData;

  return (
    <div className="editor-panel">
      <div className="editor-panel__header">
        <h2 className="editor-panel__title">{slide.title}</h2>
        <button
          className="editor-panel__close-button"
          onClick={onClose}
          aria-label="Close editor panel"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="editor-panel__content">
        {/* Content placeholder - will be implemented in US-055 and US-056 */}
        <p className="editor-panel__placeholder">
          Notes and resources editor coming soon...
        </p>
      </div>
    </div>
  );
}

export default memo(EditorPanel);
