import { memo } from "react";
import { METRO_LINE_COLORS } from "../../types/presentation";
import "./MetroLegend.css";

const LINE_LABELS: Record<string, string> = {
  intro: "Introduction",
  understanding: "Understanding AI",
  mapping: "Mapping the Journey",
  "levels-nontech": "Non-Technical Track",
  "levels-tech": "Technical Track",
  closing: "Closing",
};

function MetroLegend() {
  return (
    <div className="metro-legend">
      <h3 className="metro-legend__title">Lines</h3>
      {Object.entries(METRO_LINE_COLORS).map(([key, color]) => (
        <div key={key} className="metro-legend__item">
          <div
            className="metro-legend__color"
            style={{ backgroundColor: color }}
          />
          <span className="metro-legend__label">{LINE_LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}

export default memo(MetroLegend);
