import "./PresentationModeToggle.css";

interface PresentationModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
}

/**
 * Subtle toggle button to switch between edit and presentation mode.
 * Shows current mode and toggles on click.
 */
function PresentationModeToggle({
  isEditMode,
  onToggle,
}: PresentationModeToggleProps) {
  return (
    <button
      className="presentation-mode-toggle"
      onClick={onToggle}
      title={isEditMode ? "Switch to presentation mode" : "Switch to edit mode"}
    >
      {isEditMode ? "Edit" : "Present"}
    </button>
  );
}

export default PresentationModeToggle;
