import type { BuiltInEdge } from "@xyflow/react";
import type {
  Section,
  SlideContent,
  MetroStopNode,
  MetroStopNodeData,
  ResourceIconNode,
  Resource,
  JunctionHandle,
  SubnodeNode,
  SubnodeContent,
} from "../types/presentation";
import { METRO_LINE_COLORS, METRO_LAYOUT } from "../types/presentation";
import { loadPersistedPositions } from "./persistence";
import type { MetroLineEdge } from "../components/edges/MetroLineEdge";
import type { ArcEdge } from "../components/edges/ArcEdge";

// Spacing between parallel lines at junctions (in pixels)
const JUNCTION_LINE_SPACING = 12;

// Subnode arc configuration
const SUBNODE_ARC_RADIUS = 120; // Distance from parent node center
const SUBNODE_ARC_START_ANGLE = -150; // Start angle in degrees (upper left)
const SUBNODE_ARC_END_ANGLE = -30; // End angle in degrees (upper right)

interface MetroLayoutResult {
  nodes: (MetroStopNode | ResourceIconNode | SubnodeNode)[];
  edges: (BuiltInEdge | MetroLineEdge | ArcEdge)[];
}

/**
 * Generates subnode positions in an arc above the parent metro stop
 */
function generateSubnodePositions(
  parentX: number,
  parentY: number,
  subnodes: SubnodeContent[],
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const count = subnodes.length;

  if (count === 0) return positions;

  // Single subnode goes directly above
  if (count === 1) {
    positions.push({
      x: parentX,
      y: parentY - SUBNODE_ARC_RADIUS,
    });
    return positions;
  }

  // Multiple subnodes spread in an arc
  const angleRange = SUBNODE_ARC_END_ANGLE - SUBNODE_ARC_START_ANGLE;
  const angleStep = angleRange / (count - 1);

  for (let i = 0; i < count; i++) {
    const angleDeg = SUBNODE_ARC_START_ANGLE + i * angleStep;
    const angleRad = (angleDeg * Math.PI) / 180;

    positions.push({
      x: parentX + SUBNODE_ARC_RADIUS * Math.cos(angleRad),
      y: parentY + SUBNODE_ARC_RADIUS * Math.sin(angleRad),
    });
  }

  return positions;
}

// Section-specific Y positions - expanded for slide images above stops
const SECTION_Y_POSITIONS: Record<string, number> = {
  intro: 150, // Top-left start (increased for image space)
  understanding: 350, // Curves down (was 180)
  mapping: 600, // Center junction area (was 320)
  "levels-nontech": 500, // Upper parallel track (was 260)
  "levels-tech": 850, // Lower parallel track (was 440)
  projects: 1150, // Below tech track - projects showcase line
  closing: 700, // Right side convergence (was 350)
};

// Section-specific starting X positions - staggered for diagonal flow
const SECTION_X_STARTS: Record<string, number> = {
  intro: 100,
  understanding: 250, // Staggered to create diagonal
  mapping: 400,
  "levels-nontech": 700,
  "levels-tech": 700,
  projects: 700, // Starts at same X as CLI
  closing: 3200, // Adjusted for wider spacing to accommodate projects
};

// Smooth curve radius for metro line bends
const EDGE_BORDER_RADIUS = 20;

// Metro line label definitions matching the reference design
const METRO_LINE_LABELS: Record<
  string,
  { lineName: string; subtitle: string; offsetX: number; offsetY: number }
> = {
  intro: {
    lineName: "RED LINE",
    subtitle: "The Widening Gulf (Introduction)",
    offsetX: -50,
    offsetY: -80,
  },
  understanding: {
    lineName: "YELLOW LINE",
    subtitle: "Understanding AI",
    offsetX: -50,
    offsetY: -80,
  },
  mapping: {
    lineName: "GREEN LINE",
    subtitle: "Mapping the Journey",
    offsetX: -50,
    offsetY: -80,
  },
  "levels-nontech": {
    lineName: "BLUE LINE",
    subtitle: "Non-Technical Track (Levels 0-8)",
    offsetX: -50,
    offsetY: -80,
  },
  "levels-tech": {
    lineName: "ORANGE LINE",
    subtitle: "Technical Track (Levels 1-9)",
    offsetX: -50,
    offsetY: -80,
  },
  projects: {
    lineName: "MAGENTA LINE",
    subtitle: "Projects",
    offsetX: -50,
    offsetY: -80,
  },
  closing: {
    lineName: "PURPLE LINE",
    subtitle: "Closing",
    offsetX: -50,
    offsetY: -80,
  },
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
  const nodes: (MetroStopNode | ResourceIconNode | SubnodeNode)[] = [];
  const edges: (BuiltInEdge | MetroLineEdge | ArcEdge)[] = [];

  // Load any persisted label positions
  const persistedPositions = loadPersistedPositions();

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

      // Create metro stop node - use persisted position if available
      const persistedNodePos = persistedPositions?.[nodeId];
      const node: MetroStopNode = {
        id: nodeId,
        type: "metroStop",
        position: persistedNodePos || { x: currentX, y: currentY },
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

      // Create subnode nodes and arc edges if slide has subnodes
      if (slide.subnodes && slide.subnodes.length > 0) {
        const nodePosition = persistedNodePos || { x: currentX, y: currentY };
        const subnodePositions = generateSubnodePositions(
          nodePosition.x,
          nodePosition.y,
          slide.subnodes,
        );

        slide.subnodes.forEach((subnode, subnodeIndex) => {
          const subnodeNodeId = `subnode-${subnode.id}`;
          const subnodePosition = subnodePositions[subnodeIndex];

          // Create subnode node
          const subnodeNode: SubnodeNode = {
            id: subnodeNodeId,
            type: "subnode",
            position: subnodePosition,
            data: {
              subnode,
              parentNodeId: nodeId,
              lineColor,
              arcIndex: subnodeIndex,
              totalSubnodes: slide.subnodes!.length,
              isExpanded: false, // Will be updated by MetroCanvas based on active state
            },
          };
          nodes.push(subnodeNode);

          // Create arc edge from subnode to metro stop
          const arcEdge: ArcEdge = {
            id: `arc-${nodeId}-${subnodeNodeId}`,
            source: subnodeNodeId,
            target: nodeId,
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "arcEdge",
            data: {
              lineColor,
              isExpanded: false, // Will be updated by MetroCanvas
            },
          };
          edges.push(arcEdge);
        });
      }

      // Create edge to previous node in same section
      if (prevNodeId) {
        const labelConfig = METRO_LINE_LABELS[section.id];
        const isFirstEdge = i === 1; // First edge in section (connects 1st and 2nd nodes)

        if (isFirstEdge && labelConfig) {
          // Use metroLine edge type with inline label
          const labeledEdge: MetroLineEdge = {
            id: `edge-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            sourceHandle: "right",
            targetHandle: "left",
            type: "metroLine",
            data: {
              lineLabel: labelConfig.lineName,
              lineSubtitle: labelConfig.subtitle,
              lineColor,
            },
            style: {
              stroke: lineColor,
              strokeWidth: METRO_LAYOUT.lineThickness,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
          };
          edges.push(labeledEdge);
        } else {
          // Regular smoothstep edge
          edges.push({
            id: `edge-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            sourceHandle: "right",
            targetHandle: "left",
            type: "smoothstep",
            pathOptions: {
              borderRadius: EDGE_BORDER_RADIUS,
            },
            style: {
              stroke: lineColor,
              strokeWidth: METRO_LAYOUT.lineThickness,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
          });
        }
      }

      prevNodeId = nodeId;
      currentX += METRO_LAYOUT.stopSpacing;
    }
  }

  // Create inter-section connections with offset to route around labels
  // Intro -> Understanding (diagonal connection)
  if (lastNodeBySection["intro"] && firstNodeBySection["understanding"]) {
    edges.push({
      id: "edge-intro-to-understanding",
      source: lastNodeBySection["intro"],
      target: firstNodeBySection["understanding"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["understanding"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
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
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["mapping"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Mapping -> Non-Tech Track (branch up) - uses right-0 handle (upper offset)
  if (lastNodeBySection["mapping"] && firstNodeBySection["levels-nontech"]) {
    edges.push({
      id: "edge-mapping-to-nontech",
      source: lastNodeBySection["mapping"],
      target: firstNodeBySection["levels-nontech"],
      sourceHandle: "right-0", // Upper right handle on mapping junction
      targetHandle: "left",
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-nontech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Mapping -> Tech Track (branch down) - uses right-1 handle (lower offset)
  if (lastNodeBySection["mapping"] && firstNodeBySection["levels-tech"]) {
    edges.push({
      id: "edge-mapping-to-tech",
      source: lastNodeBySection["mapping"],
      target: firstNodeBySection["levels-tech"],
      sourceHandle: "right-1", // Lower right handle on mapping junction
      targetHandle: "left-0", // Left handle on CLI junction
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-tech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Non-Tech -> Tech Track (bridge from Natural Language Software to CLI)
  if (
    lastNodeBySection["levels-nontech"] &&
    firstNodeBySection["levels-tech"]
  ) {
    edges.push({
      id: "edge-nontech-to-tech",
      source: lastNodeBySection["levels-nontech"],
      target: firstNodeBySection["levels-tech"],
      sourceHandle: "bottom",
      targetHandle: "top-0", // Top handle on CLI junction
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 40,
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-tech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Non-Tech -> Closing - uses left-0 handle (upper offset)
  if (lastNodeBySection["levels-nontech"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-nontech-to-closing",
      source: lastNodeBySection["levels-nontech"],
      target: firstNodeBySection["closing"],
      sourceHandle: "right",
      targetHandle: "left-0", // Upper left handle on closing junction
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-nontech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Tech -> Closing - uses left-1 handle (center offset)
  if (lastNodeBySection["levels-tech"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-tech-to-closing",
      source: lastNodeBySection["levels-tech"],
      target: firstNodeBySection["closing"],
      sourceHandle: "right-0", // Right handle on CLI (last tech node uses default)
      targetHandle: "left-1", // Center left handle on closing junction
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80, // Route around labels
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-tech"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // CLI (first tech node) -> Projects (branch down to projects line)
  if (firstNodeBySection["levels-tech"] && firstNodeBySection["projects"]) {
    edges.push({
      id: "edge-cli-to-projects",
      source: firstNodeBySection["levels-tech"],
      target: firstNodeBySection["projects"],
      sourceHandle: "bottom-0", // Bottom handle on CLI junction
      targetHandle: "top",
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 40,
      },
      style: {
        stroke: METRO_LINE_COLORS["projects"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Projects -> Closing - uses left-2 handle (lower offset)
  if (lastNodeBySection["projects"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-projects-to-closing",
      source: lastNodeBySection["projects"],
      target: firstNodeBySection["closing"],
      sourceHandle: "right",
      targetHandle: "left-2", // Lower left handle on closing junction
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80,
      },
      style: {
        stroke: METRO_LINE_COLORS["projects"],
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    });
  }

  // Mark junction nodes (where multiple lines converge) and create junction handles
  const junctionNodeIds = new Set<string>();
  const junctionColors = new Map<string, string[]>();
  const junctionHandlesMap = new Map<string, JunctionHandle[]>();

  // Last node of mapping is a junction (branches to both tracks)
  // Receives mapping line from left, sends to nontech (up-right) and tech (down-right)
  if (lastNodeBySection["mapping"]) {
    const nodeId = lastNodeBySection["mapping"];
    junctionNodeIds.add(nodeId);
    junctionColors.set(nodeId, [
      METRO_LINE_COLORS["mapping"],
      METRO_LINE_COLORS["levels-nontech"],
      METRO_LINE_COLORS["levels-tech"],
    ]);
    junctionHandlesMap.set(nodeId, [
      {
        handleId: "left-0",
        position: "left",
        offset: 0,
        lineColor: METRO_LINE_COLORS["mapping"],
      },
      {
        handleId: "right-0",
        position: "right",
        offset: -JUNCTION_LINE_SPACING,
        lineColor: METRO_LINE_COLORS["levels-nontech"],
      },
      {
        handleId: "right-1",
        position: "right",
        offset: JUNCTION_LINE_SPACING,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
    ]);
  }

  // First node of tech track (CLI) is a junction (receives from mapping + nontech bridge, sends to tech + projects)
  if (firstNodeBySection["levels-tech"]) {
    const nodeId = firstNodeBySection["levels-tech"];
    junctionNodeIds.add(nodeId);
    junctionColors.set(nodeId, [
      METRO_LINE_COLORS["levels-tech"],
      METRO_LINE_COLORS["projects"],
    ]);
    junctionHandlesMap.set(nodeId, [
      {
        handleId: "left-0",
        position: "left",
        offset: 0,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
      {
        handleId: "top-0",
        position: "top",
        offset: 0,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
      {
        handleId: "right-0",
        position: "right",
        offset: 0,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
      {
        handleId: "bottom-0",
        position: "bottom",
        offset: 0,
        lineColor: METRO_LINE_COLORS["projects"],
      },
    ]);
  }

  // First node of closing is a junction (receives from nontech, tech, and projects)
  if (firstNodeBySection["closing"]) {
    const nodeId = firstNodeBySection["closing"];
    junctionNodeIds.add(nodeId);
    junctionColors.set(nodeId, [
      METRO_LINE_COLORS["levels-nontech"],
      METRO_LINE_COLORS["levels-tech"],
      METRO_LINE_COLORS["projects"],
      METRO_LINE_COLORS["closing"],
    ]);
    junctionHandlesMap.set(nodeId, [
      {
        handleId: "left-0",
        position: "left",
        offset: -JUNCTION_LINE_SPACING,
        lineColor: METRO_LINE_COLORS["levels-nontech"],
      },
      {
        handleId: "left-1",
        position: "left",
        offset: 0,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
      {
        handleId: "left-2",
        position: "left",
        offset: JUNCTION_LINE_SPACING,
        lineColor: METRO_LINE_COLORS["projects"],
      },
      {
        handleId: "right-0",
        position: "right",
        offset: 0,
        lineColor: METRO_LINE_COLORS["closing"],
      },
    ]);
  }

  // Update nodes with junction info
  for (const node of nodes) {
    if (node.type === "metroStop" && junctionNodeIds.has(node.id)) {
      (node.data as MetroStopNodeData).isJunction = true;
      (node.data as MetroStopNodeData).junctionColors = junctionColors.get(
        node.id,
      );
      (node.data as MetroStopNodeData).junctionHandles = junctionHandlesMap.get(
        node.id,
      );
    }
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
