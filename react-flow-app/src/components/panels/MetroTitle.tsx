import { memo } from "react";
import "./MetroTitle.css";

/**
 * Metro-style title branding component positioned at top-left.
 * Features a bold "M" logo and title text in DC Metro style.
 */
function MetroTitle() {
  return (
    <div className="metro-title">
      <div className="metro-title__logo">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="metro-title__logo-svg"
        >
          {/* Circle background */}
          <circle cx="24" cy="24" r="22" fill="#1a1a1a" />
          {/* Bold M letter */}
          <path
            d="M12 34V14h4l8 12 8-12h4v20h-4V20l-6 10h-4l-6-10v14h-4z"
            fill="white"
          />
        </svg>
      </div>
      <div className="metro-title__text">
        <h1 className="metro-title__heading">The AI Level-Up Transit Map</h1>
        <p className="metro-title__subheading">Leveling Up with AI</p>
      </div>
    </div>
  );
}

export default memo(MetroTitle);
