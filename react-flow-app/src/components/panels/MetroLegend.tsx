import { memo } from "react";
import { METRO_LINE_COLORS } from "../../types/presentation";
import "./MetroLegend.css";

const LINE_LABELS: Record<string, string> = {
  understanding: "AI Mental Models",
  mapping: "Mapping the Journey",
  "levels-nontech": "Non-Technical Track",
  hypophobia: "AI Hypophobia",
  "levels-tech": "Technical Track",
  projects: "Projects",
};

// Sections to exclude from legend (single stops, not real lines)
const EXCLUDED_FROM_LEGEND = new Set(["closing"]);

// Station feature icons and their meanings
const STATION_FEATURES = [
  { icon: "P", label: "Prompt Library Available" },
  { icon: "D", label: "Detailed Documentation" },
  { icon: "L", label: "Live Sandbox/Demo" },
];

function MetroLegend() {
  return (
    <div className="metro-legend">
      <h3 className="metro-legend__title">Lines</h3>
      <div className="metro-legend__items">
        {Object.entries(METRO_LINE_COLORS)
          .filter(([key]) => !EXCLUDED_FROM_LEGEND.has(key))
          .map(([key, color]) => (
            <div key={key} className="metro-legend__item">
              <div
                className="metro-legend__line"
                style={{ backgroundColor: color }}
              />
              <span className="metro-legend__label">{LINE_LABELS[key]}</span>
            </div>
          ))}
      </div>

      <h3 className="metro-legend__title metro-legend__title--features">
        Station Features
      </h3>
      <div className="metro-legend__features">
        {STATION_FEATURES.map(({ icon, label }) => (
          <div key={icon} className="metro-legend__feature">
            <span className="metro-legend__feature-icon">[{icon}]</span>
            <span className="metro-legend__feature-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetroLegend);
