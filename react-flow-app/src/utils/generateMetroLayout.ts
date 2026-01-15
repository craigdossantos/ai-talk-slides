import type { Edge } from "@xyflow/react";
import type {
  Section,
  SlideContent,
  MetroStopNode,
  Resource,
} from "../types/presentation";
import { METRO_LINE_COLORS, METRO_LAYOUT } from "../types/presentation";

interface MetroLayoutResult {
  nodes: MetroStopNode[];
  edges: Edge[];
}

/**
 * Generates metro stop nodes and connecting edges from slides data.
 * Layout follows the reference design with horizontal lines and 45/90 degree angles.
 */
export function generateMetroLayout(
  sections: Section[],
  slides: SlideContent[],
  resources: Resource[] = [],
): MetroLayoutResult {
  const nodes: MetroStopNode[] = [];
  const edges: Edge[] = [];

  // Group slides by section
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Track positions for layout
  let currentX = 100;
  let currentY = 300;

  // Layout each section as a metro line segment
  for (const section of sections) {
    const sectionSlides = slidesBySection.get(section.id) || [];
    const lineColor =
      METRO_LINE_COLORS[section.id as keyof typeof METRO_LINE_COLORS] ||
      "#6b7280";

    // Determine Y position based on track type
    if (section.id === "levels-nontech") {
      currentY = 200; // Blue line higher
    } else if (section.id === "levels-tech") {
      currentY = 400; // Orange line lower
    }

    let prevNodeId: string | null = null;

    for (let i = 0; i < sectionSlides.length; i++) {
      const slide = sectionSlides[i];
      const nodeId = `metro-${slide.id}`;

      // Get resources for this slide
      const slideResources = resources.filter((r) => r.slideId === slide.id);

      // Create metro stop node
      const node: MetroStopNode = {
        id: nodeId,
        type: "metroStop",
        position: { x: currentX, y: currentY },
        data: {
          slide,
          section,
          lineColor,
          resources: slideResources,
          isActive: false,
        },
      };
      nodes.push(node);

      // Create edge to previous node in same section
      if (prevNodeId) {
        edges.push({
          id: `edge-${prevNodeId}-${nodeId}`,
          source: prevNodeId,
          target: nodeId,
          sourceHandle: "right",
          targetHandle: "left",
          type: "smoothstep",
          style: {
            stroke: lineColor,
            strokeWidth: METRO_LAYOUT.lineThickness,
            strokeLinecap: "round",
          },
        });
      }

      prevNodeId = nodeId;
      currentX += METRO_LAYOUT.stopSpacing;
    }

    // Add spacing between sections
    currentX += METRO_LAYOUT.stopSpacing / 2;
  }

  return { nodes, edges };
}

/**
 * Gets the line color for a given section ID
 */
export function getLineColor(sectionId: string): string {
  return (
    METRO_LINE_COLORS[sectionId as keyof typeof METRO_LINE_COLORS] || "#6b7280"
  );
}
