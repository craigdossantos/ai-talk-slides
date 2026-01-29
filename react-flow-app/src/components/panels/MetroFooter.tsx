import { memo } from "react";
import "./MetroFooter.css";

/**
 * Metro-style footer with accessibility info (left) and disclaimer (right).
 * Positioned above the NavigationControls at the bottom of the canvas.
 */
function MetroFooter() {
  return (
    <div className="metro-footer">
      <div className="metro-footer__accessibility">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="metro-footer__icon"
        >
          {/* Accessibility-style icon: person in office chair at computer (mirrored V4) */}
          {/* Head */}
          <circle cx="7" cy="5" r="2" fill="currentColor" />
          {/* Body leaning forward toward screen */}
          <path d="M9 8 L6 9 L7 12 L12 14 L13 11 Z" fill="currentColor" />
          {/* Legs - bent at knee, feet toward monitor */}
          <line
            x1="11"
            y1="14"
            x2="13"
            y2="17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="13"
            y1="17"
            x2="15"
            y2="15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Arm reaching toward screen */}
          <line
            x1="12"
            y1="11"
            x2="15"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Gaming/office chair back */}
          <rect x="3" y="7" width="2.5" height="8" rx="1" fill="currentColor" />
          {/* Chair base with star pattern */}
          <line
            x1="7"
            y1="15"
            x2="7"
            y2="17.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="4"
            y1="19"
            x2="10"
            y2="19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="7"
            y1="17.5"
            x2="10"
            y2="19"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="7"
            y1="17.5"
            x2="4"
            y2="19"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Computer monitor on right */}
          <rect
            x="16"
            y="6"
            width="6"
            height="4.5"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
          <line
            x1="19"
            y1="10.5"
            x2="19"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <line
            x1="17"
            y1="12"
            x2="21"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="metro-footer__text">
          This transit map is accessible to everyone
        </span>
      </div>
      <div className="metro-footer__disclaimer">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="metro-footer__icon metro-footer__icon--small"
        >
          {/* Compass icon */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <polygon points="12,2 14,10 12,12 10,10" fill="currentColor" />
          <polygon
            points="12,22 10,14 12,12 14,14"
            fill="currentColor"
            opacity="0.4"
          />
          <polygon
            points="2,12 10,10 12,12 10,14"
            fill="currentColor"
            opacity="0.4"
          />
          <polygon
            points="22,12 14,14 12,12 14,10"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
        <span className="metro-footer__text">
          Map is not to time-scale. Some stops take longer than others.
        </span>
      </div>
    </div>
  );
}

export default memo(MetroFooter);
