import type { Edge } from "@xyflow/react";
import type { Section, SlideContent, Resource } from "../types/presentation";

// Edge style constants
const EDGE_STYLES = {
  // Section-to-section: prominent, animated connection showing major flow
  sectionToSection: {
    stroke: "#6366f1", // indigo
    strokeWidth: 3,
    animated: false,
  },
  // Slide-to-slide: solid connection within a section
  slideToSlide: {
    stroke: "#4b5563", // gray-600
    strokeWidth: 1.5,
    animated: false,
  },
  // Slide-to-resource: subtle dashed connection
  slideToResource: {
    stroke: "#6b7280", // gray-500
    strokeWidth: 1,
    animated: false,
    strokeDasharray: "5,5",
  },
} as const;

/**
 * Generates React Flow edges connecting sections, slides, and resources.
 *
 * Edge types:
 * - Section-to-section: 3px indigo animated edges connecting section headers
 * - Slide-to-slide: 1.5px solid gray edges connecting slides within a section
 * - Slide-to-resource: 1px dashed muted edges connecting slides to their resources
 */
export function generateEdges(
  sections: Section[],
  slides: SlideContent[],
  resources: Resource[],
): Edge[] {
  const edges: Edge[] = [];

  // Group slides by section for internal connections
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // 1. Generate section-to-section edges (horizontal flow)
  for (let i = 0; i < sections.length - 1; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];

    const edge: Edge = {
      id: `edge-section-${currentSection.id}-to-${nextSection.id}`,
      source: `section-${currentSection.id}`,
      target: `section-${nextSection.id}`,
      sourceHandle: "right",
      targetHandle: "left",
      type: "default",
      animated: EDGE_STYLES.sectionToSection.animated,
      style: {
        stroke: EDGE_STYLES.sectionToSection.stroke,
        strokeWidth: EDGE_STYLES.sectionToSection.strokeWidth,
      },
    };
    edges.push(edge);
  }

  // 2. Generate section-to-first-slide edges and slide-to-slide edges
  for (const section of sections) {
    const sectionSlides = slidesBySection.get(section.id) || [];
    if (sectionSlides.length === 0) continue;

    // Connect section header to first slide
    const firstSlide = sectionSlides[0];
    const sectionToFirstSlideEdge: Edge = {
      id: `edge-section-${section.id}-to-slide-${firstSlide.id}`,
      source: `section-${section.id}`,
      target: `slide-${firstSlide.id}`,
      sourceHandle: "bottom",
      targetHandle: "top",
      type: "default",
      style: {
        stroke: EDGE_STYLES.slideToSlide.stroke,
        strokeWidth: EDGE_STYLES.slideToSlide.strokeWidth,
      },
    };
    edges.push(sectionToFirstSlideEdge);

    // Connect consecutive slides within the section
    for (let i = 0; i < sectionSlides.length - 1; i++) {
      const currentSlide = sectionSlides[i];
      const nextSlide = sectionSlides[i + 1];

      const slideEdge: Edge = {
        id: `edge-slide-${currentSlide.id}-to-${nextSlide.id}`,
        source: `slide-${currentSlide.id}`,
        target: `slide-${nextSlide.id}`,
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "default",
        style: {
          stroke: EDGE_STYLES.slideToSlide.stroke,
          strokeWidth: EDGE_STYLES.slideToSlide.strokeWidth,
        },
      };
      edges.push(slideEdge);
    }
  }

  // 3. Generate slide-to-resource edges
  for (const resource of resources) {
    const resourceEdge: Edge = {
      id: `edge-slide-${resource.slideId}-to-resource-${resource.id}`,
      source: `slide-${resource.slideId}`,
      target: `resource-${resource.id}`,
      sourceHandle: "right",
      targetHandle: "left",
      type: "default",
      style: {
        stroke: EDGE_STYLES.slideToResource.stroke,
        strokeWidth: EDGE_STYLES.slideToResource.strokeWidth,
        strokeDasharray: EDGE_STYLES.slideToResource.strokeDasharray,
      },
    };
    edges.push(resourceEdge);
  }

  return edges;
}
