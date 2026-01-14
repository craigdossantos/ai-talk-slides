import { useState } from "react";
import { TRACK_COLORS, type Section } from "../../types/presentation";
import "./SectionNavigator.css";

interface SectionNavigatorProps {
  sections: Section[];
  currentSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
}

/**
 * Left-side panel showing all sections for quick navigation.
 * Collapsed by default, can be expanded with toggle button.
 */
function SectionNavigator({
  sections,
  currentSectionId,
  onSectionClick,
}: SectionNavigatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`section-navigator ${isExpanded ? "section-navigator--expanded" : "section-navigator--collapsed"}`}
    >
      <button
        className="section-navigator__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Collapse sections" : "Expand sections"}
        aria-expanded={isExpanded}
      >
        <span className="section-navigator__toggle-icon">
          {isExpanded ? "‹" : "☰"}
        </span>
        {!isExpanded && (
          <span className="section-navigator__toggle-label">Sections</span>
        )}
      </button>

      {isExpanded && (
        <>
          <div className="section-navigator__header">
            <span className="section-navigator__title">Sections</span>
          </div>
          <nav className="section-navigator__list">
            {sections.map((section, index) => {
              const isActive = section.id === currentSectionId;
              const trackColor = TRACK_COLORS[section.track];

              return (
                <button
                  key={section.id}
                  className={`section-navigator__item ${isActive ? "section-navigator__item--active" : ""}`}
                  style={
                    {
                      "--track-color": trackColor,
                    } as React.CSSProperties
                  }
                  onClick={() => onSectionClick(section.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="section-navigator__number">{index + 1}</span>
                  <span className="section-navigator__section-title">
                    {section.title}
                  </span>
                  <span
                    className="section-navigator__track-indicator"
                    style={{ backgroundColor: trackColor }}
                  />
                </button>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}

export default SectionNavigator;
