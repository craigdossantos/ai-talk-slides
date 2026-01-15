import type { Edge } from "@xyflow/react";
import type {
  Section,
  SlideContent,
  MetroStopNode,
  ResourceIconNode,
  Resource,
} from "../types/presentation";
import { METRO_LINE_COLORS, METRO_LAYOUT } from "../types/presentation";

interface MetroLayoutResult {
  nodes: (MetroStopNode | ResourceIconNode)[];
  edges: Edge[];
}

// Section-specific Y positions
const SECTION_Y_POSITIONS: Record<string, number> = {
  intro: 100,
  understanding: 200,
  mapping: 300,
  "levels-nontech": 200,
  "levels-tech": 400,
  closing: 300,
};

// Section-specific starting X positions
const SECTION_X_STARTS: Record<string, number> = {
  intro: 100,
  understanding: 100,
  mapping: 100,
  "levels-nontech": 700,
  "levels-tech": 700,
  closing: 2200,
};

/**
 * Generates metro stop nodes and connecting edges from slides data.
 * Layout follows the reference design with horizontal lines and 45/90 degree angles.
 */
export function generateMetroLayout(
  sections: Section[],
  slides: SlideContent[],
  resources: Resource[] = [],
): MetroLayoutResult {
  const nodes: (MetroStopNode | ResourceIconNode)[] = [];
  const edges: Edge[] = [];

  // Group slides by section
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Track the last node of certain sections for inter-section connections
  const lastNodeBySection: Record<string, string> = {};
  const firstNodeBySection: Record<string, string> = {};

  // Layout each section as a metro line segment
  for (const section of sections) {
    const sectionSlides = slidesBySection.get(section.id) || [];
    const lineColor =
      METRO_LINE_COLORS[section.id as keyof typeof METRO_LINE_COLORS] ||
      "#6b7280";

    // Get starting position for this section
    let currentX = SECTION_X_STARTS[section.id] || 100;
    const currentY = SECTION_Y_POSITIONS[section.id] || 300;

    let prevNodeId: string | null = null;

    for (let i = 0; i < sectionSlides.length; i++) {
      const slide = sectionSlides[i];
      const nodeId = `metro-${slide.id}`;

      // Track first and last nodes
      if (i === 0) {
        firstNodeBySection[section.id] = nodeId;
      }
      if (i === sectionSlides.length - 1) {
        lastNodeBySection[section.id] = nodeId;
      }

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

      // Create featured resource icon nodes
      const featuredResources = slideResources.filter((r) => r.featured);
      featuredResources.forEach((resource, resourceIndex) => {
        const resourceNodeId = `resource-icon-${resource.id}`;
        const resourceNode: ResourceIconNode = {
          id: resourceNodeId,
          type: "resourceIcon",
          position: {
            x: currentX + (resourceIndex - featuredResources.length / 2) * 30,
            y: currentY + 50,
          },
          data: {
            resource,
          },
        };
        nodes.push(resourceNode);

        // Create edge from metro stop to resource icon
        edges.push({
          id: `edge-${nodeId}-${resourceNodeId}`,
          source: nodeId,
          target: resourceNodeId,
          sourceHandle: "bottom",
          type: "straight",
          style: {
            stroke: "#e5e7eb",
            strokeWidth: 2,
          },
        });
      });

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
  }

  // Create inter-section connections
  // Intro -> Understanding (diagonal connection)
  if (lastNodeBySection["intro"] && firstNodeBySection["understanding"]) {
    edges.push({
      id: "edge-intro-to-understanding",
      source: lastNodeBySection["intro"],
      target: firstNodeBySection["understanding"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["understanding"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
  }

  // Understanding -> Mapping
  if (lastNodeBySection["understanding"] && firstNodeBySection["mapping"]) {
    edges.push({
      id: "edge-understanding-to-mapping",
      source: lastNodeBySection["understanding"],
      target: firstNodeBySection["mapping"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["mapping"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
  }

  // Mapping -> Non-Tech Track (branch up)
  if (lastNodeBySection["mapping"] && firstNodeBySection["levels-nontech"]) {
    edges.push({
      id: "edge-mapping-to-nontech",
      source: lastNodeBySection["mapping"],
      target: firstNodeBySection["levels-nontech"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["levels-nontech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
  }

  // Mapping -> Tech Track (branch down)
  if (lastNodeBySection["mapping"] && firstNodeBySection["levels-tech"]) {
    edges.push({
      id: "edge-mapping-to-tech",
      source: lastNodeBySection["mapping"],
      target: firstNodeBySection["levels-tech"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["levels-tech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
  }

  // Non-Tech -> Closing
  if (lastNodeBySection["levels-nontech"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-nontech-to-closing",
      source: lastNodeBySection["levels-nontech"],
      target: firstNodeBySection["closing"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["closing"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
  }

  // Tech -> Closing
  if (lastNodeBySection["levels-tech"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-tech-to-closing",
      source: lastNodeBySection["levels-tech"],
      target: firstNodeBySection["closing"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      style: {
        stroke: METRO_LINE_COLORS["closing"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
      },
    });
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
