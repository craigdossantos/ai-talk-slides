import { useEffect } from "react";
import { sections, slides, resources } from "../../data/slides";
import { METRO_LINE_COLORS } from "../../types/presentation";
import SlideEntry from "../resources/SlideEntry";
import "../../styles/resources.css";

function ResourcesPage() {
  // Scroll to hash target after React renders the DOM
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  // Group slides by section
  const slidesBySection = sections.map((section) => ({
    section,
    slides: slides.filter((slide) => slide.sectionId === section.id),
    color:
      METRO_LINE_COLORS[section.id as keyof typeof METRO_LINE_COLORS] ||
      "#6b7280",
  }));

  return (
    <div className="resources-page">
      <header className="resources-header">
        <h1>Leveling Up with AI - Resources</h1>
        <p>
          All slides organized by learning track with talking points and
          resources
        </p>
      </header>

      <main className="resources-content">
        {slidesBySection.map(({ section, slides: sectionSlides, color }) => (
          <section key={section.id} className="metro-line-section">
            <h2
              className="metro-line-header"
              style={{ borderLeftColor: color }}
            >
              <span
                className="metro-line-indicator"
                style={{ backgroundColor: color }}
              />
              {section.title}
            </h2>

            <div className="slides-list">
              {sectionSlides.map((slide) => {
                const slideResources = resources.filter(
                  (r) => r.slideId === slide.id,
                );
                return (
                  <SlideEntry
                    key={slide.id}
                    slide={slide}
                    resources={slideResources}
                    lineColor={color}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default ResourcesPage;
