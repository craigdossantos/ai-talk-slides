import type { SlideContent, Resource } from "../../types/presentation";
import ResourceList from "./ResourceList";

interface SlideEntryProps {
  slide: SlideContent;
  resources: Resource[];
  lineColor: string;
}

function SlideEntry({ slide, resources, lineColor }: SlideEntryProps) {
  return (
    <article id={slide.id} className="slide-entry">
      <div className="slide-entry-content">
        {/* Left column: Image */}
        <div className="slide-image-container">
          {slide.backgroundImage ? (
            <img
              src={slide.backgroundImage}
              alt={slide.title}
              className="slide-image"
            />
          ) : (
            <div
              className="slide-image-placeholder"
              style={{ borderColor: lineColor }}
            >
              <span>No image</span>
            </div>
          )}
        </div>

        {/* Right column: Text content */}
        <div className="slide-text-content">
          <h3 className="slide-title">{slide.title}</h3>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="slide-bullets">
              {slide.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
          {slide.quote && (
            <blockquote className="slide-quote">{slide.quote}</blockquote>
          )}
        </div>
      </div>

      {/* Resources section below */}
      {resources.length > 0 && (
        <ResourceList resources={resources} lineColor={lineColor} />
      )}
    </article>
  );
}

export default SlideEntry;
