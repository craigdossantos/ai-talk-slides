import { memo, useCallback, useState } from "react";
import type { SlideContent, Section } from "../../types/presentation";
import { useSlideNotes } from "../../hooks/useSlideNotes";
import type { CustomResource } from "../../hooks/useSlideNotes";
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
  const { notes, saveNotes } = useSlideNotes(slideId);

  // State for add resource form
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  // Handle notes textarea change with auto-save
  const handleNotesChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      saveNotes({
        ...notes,
        notes: event.target.value,
      });
    },
    [notes, saveNotes],
  );

  // Handle adding a new resource
  const handleAddResource = useCallback(() => {
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) {
      return;
    }

    const newResource: CustomResource = {
      title: newResourceTitle.trim(),
      url: newResourceUrl.trim(),
    };

    saveNotes({
      ...notes,
      customResources: [...notes.customResources, newResource],
    });

    // Reset form
    setNewResourceTitle("");
    setNewResourceUrl("");
    setIsAddingResource(false);
  }, [notes, saveNotes, newResourceTitle, newResourceUrl]);

  // Handle deleting a resource
  const handleDeleteResource = useCallback(
    (index: number) => {
      const updatedResources = notes.customResources.filter(
        (_, i) => i !== index,
      );
      saveNotes({
        ...notes,
        customResources: updatedResources,
      });
    },
    [notes, saveNotes],
  );

  // Handle canceling add resource form
  const handleCancelAddResource = useCallback(() => {
    setNewResourceTitle("");
    setNewResourceUrl("");
    setIsAddingResource(false);
  }, []);

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
        <div className="editor-panel__section">
          <label className="editor-panel__label" htmlFor="slide-notes">
            Notes (Markdown)
          </label>
          <textarea
            id="slide-notes"
            className="editor-panel__textarea"
            value={notes.notes}
            onChange={handleNotesChange}
            placeholder="Add notes for this slide..."
          />
        </div>
        {/* Custom resources section */}
        <div className="editor-panel__section">
          <label className="editor-panel__label">Custom Resources</label>

          {/* Resource list */}
          {notes.customResources.length > 0 && (
            <ul className="editor-panel__resource-list">
              {notes.customResources.map((resource, index) => (
                <li key={index} className="editor-panel__resource-item">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editor-panel__resource-link"
                    title={resource.url}
                  >
                    <span className="editor-panel__resource-title">
                      {resource.title}
                    </span>
                    <span className="editor-panel__resource-url">
                      {resource.url}
                    </span>
                  </a>
                  <button
                    className="editor-panel__resource-delete"
                    onClick={() => handleDeleteResource(index)}
                    aria-label={`Delete resource: ${resource.title}`}
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
                </li>
              ))}
            </ul>
          )}

          {/* Add resource form */}
          {isAddingResource ? (
            <div className="editor-panel__add-resource-form">
              <input
                type="text"
                className="editor-panel__input"
                placeholder="Resource title"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                autoFocus
              />
              <input
                type="url"
                className="editor-panel__input"
                placeholder="https://..."
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
              />
              <div className="editor-panel__form-buttons">
                <button
                  className="editor-panel__button editor-panel__button--secondary"
                  onClick={handleCancelAddResource}
                >
                  Cancel
                </button>
                <button
                  className="editor-panel__button editor-panel__button--primary"
                  onClick={handleAddResource}
                  disabled={!newResourceTitle.trim() || !newResourceUrl.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              className="editor-panel__add-resource-button"
              onClick={() => setIsAddingResource(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(EditorPanel);
