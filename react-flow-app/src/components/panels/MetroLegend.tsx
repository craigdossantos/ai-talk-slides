import { memo } from "react";
import { METRO_LINE_COLORS } from "../../types/presentation";
import "./MetroLegend.css";

const LINE_LABELS: Record<string, string> = {
  understanding: "AI Mental Models",
  mapping: "Mapping the Journey",
  "levels-nontech": "Non-Technical Track",
  "levels-tech": "Technical Track",
  projects: "Projects",
};

function MetroLegend() {
  return (
    <div className="metro-legend">
      <h3 className="metro-legend__title">LINES</h3>
      <div className="metro-legend__items">
        {Object.entries(METRO_LINE_COLORS).map(([key, color]) => (
          <div key={key} className="metro-legend__item">
            <div
              className="metro-legend__line"
              style={{ backgroundColor: color }}
            />
            <span className="metro-legend__label">{LINE_LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetroLegend);
