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
  LandmarkNode,
  RiverWaypointNode,
} from "../types/presentation";
import { METRO_LINE_COLORS, METRO_LAYOUT } from "../types/presentation";
import { loadPersistedPositions } from "./persistence";
import type { MetroLineEdge } from "../components/edges/MetroLineEdge";
import type { ArcEdge } from "../components/edges/ArcEdge";
import type { RiverEdge } from "../components/edges/RiverEdge";
import type { SubnodeBranchEdge } from "../components/edges/SubnodeBranchEdge";
import { LANDMARKS, LANDMARK_INITIAL_POSITIONS } from "../data/landmarks";
import committedPositions from "../data/nodePositions.json";

// Spacing between parallel lines at junctions (in pixels)
const JUNCTION_LINE_SPACING = 12;

// Subnode arc configuration - positioned below the parent node
const SUBNODE_ARC_RADIUS = 180; // Distance from parent node center
const SUBNODE_ARC_START_ANGLE = 30; // Start angle in degrees (lower right)
const SUBNODE_ARC_END_ANGLE = 150; // End angle in degrees (lower left)

// River waypoint initial positions - flows from lake (top-left) to ocean (bottom-right)
// Coordinates adjusted to connect to water bodies on expanded canvas
const RIVER_WAYPOINT_POSITIONS: { x: number; y: number }[] = [
  { x: 150, y: 150 }, // Start at lake center
  { x: 400, y: 200 },
  { x: 900, y: 350 },
  { x: 1500, y: 500 },
  { x: 2200, y: 700 },
  { x: 2900, y: 900 },
  { x: 3600, y: 1100 }, // End near ocean area
];

// River configuration
const RIVER_LABEL = "The River of AI Disillusionment";

interface MetroLayoutResult {
  nodes: (
    | MetroStopNode
    | ResourceIconNode
    | SubnodeNode
    | LandmarkNode
    | RiverWaypointNode
  )[];
  edges: (
    | BuiltInEdge
    | MetroLineEdge
    | ArcEdge
    | RiverEdge
    | SubnodeBranchEdge
  )[];
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

  // Single subnode goes directly below (90 degrees)
  if (count === 1) {
    positions.push({
      x: parentX,
      y: parentY + SUBNODE_ARC_RADIUS,
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
  understanding: 150, // Top-left start - AI Mental Models (merged intro)
  mapping: 600, // Center junction area
  "levels-nontech": 500, // Upper parallel track
  hypophobia: 650, // Bridge between non-tech and tech (grey line)
  "levels-tech": 850, // Lower parallel track
  closing: 700, // Right side convergence
  projects: 1400, // Below all other tracks - purple line
};

// Section-specific starting X positions - staggered for diagonal flow
const SECTION_X_STARTS: Record<string, number> = {
  understanding: 100, // Start position - AI Mental Models (merged intro)
  mapping: 400,
  "levels-nontech": 700,
  hypophobia: 2900, // Continues from end of non-tech track
  "levels-tech": 700,
  closing: 3200,
  projects: 700, // Start aligned with CLI (levels-tech) for connection
};

// Smooth curve radius for metro line bends
const EDGE_BORDER_RADIUS = 20;

// Metro line label definitions matching the reference design
const METRO_LINE_LABELS: Record<
  string,
  { lineName: string; subtitle: string; offsetX: number; offsetY: number }
> = {
  understanding: {
    lineName: "YELLOW LINE",
    subtitle: "AI Mental Models",
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
    subtitle: "Non-Technical Track",
    offsetX: -50,
    offsetY: -80,
  },
  "levels-tech": {
    lineName: "RED LINE",
    subtitle: "Technical Track",
    offsetX: -50,
    offsetY: -80,
  },
  hypophobia: {
    lineName: "GREY LINE",
    subtitle: "AI Hypophobia",
    offsetX: -50,
    offsetY: -80,
  },
  projects: {
    lineName: "PURPLE LINE",
    subtitle: "Projects",
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
  const nodes: (
    | MetroStopNode
    | ResourceIconNode
    | SubnodeNode
    | LandmarkNode
    | RiverWaypointNode
  )[] = [];
  const edges: (
    | BuiltInEdge
    | MetroLineEdge
    | ArcEdge
    | RiverEdge
    | SubnodeBranchEdge
  )[] = [];

  // Load positions: committed JSON as base, localStorage overrides
  const localStoragePositions = loadPersistedPositions();
  const persistedPositions = {
    ...committedPositions,
    ...localStoragePositions,
  } as Record<string, { x: number; y: number; scale?: number }>;

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

      // Create subnode nodes and branch loop edges if slide has subnodes
      if (slide.subnodes && slide.subnodes.length > 0) {
        const nodePosition = persistedNodePos || { x: currentX, y: currentY };
        const subnodePositions = generateSubnodePositions(
          nodePosition.x,
          nodePosition.y,
          slide.subnodes,
        );

        const subnodeNodeIds: string[] = [];

        slide.subnodes.forEach((subnode, subnodeIndex) => {
          const subnodeNodeId = `subnode-${subnode.id}`;
          subnodeNodeIds.push(subnodeNodeId);
          const defaultPosition = subnodePositions[subnodeIndex];
          // Use persisted position if available, otherwise use calculated arc position
          const persistedSubnodePos = persistedPositions?.[subnodeNodeId];

          // Create subnode node
          const subnodeNode: SubnodeNode = {
            id: subnodeNodeId,
            type: "subnode",
            position: persistedSubnodePos || defaultPosition,
            data: {
              subnode,
              parentNodeId: nodeId,
              lineColor,
              arcIndex: subnodeIndex,
              totalSubnodes: slide.subnodes!.length,
              isExpanded: false, // Will be updated by MetroCanvas based on active state
            },
            draggable: true, // Enable dragging to reposition subnodes
          };
          nodes.push(subnodeNode);
        });

        // Create branch loop edges:
        // 1. Metro stop (branch-out) → first subnode (left)
        const branchOutEdge: SubnodeBranchEdge = {
          id: `branch-out-${nodeId}-${subnodeNodeIds[0]}`,
          source: nodeId,
          target: subnodeNodeIds[0],
          sourceHandle: "branch-out",
          targetHandle: "left",
          type: "subnodeBranch",
          data: {
            lineColor,
            isExpanded: false,
            parentSlideId: slide.id,
          },
        };
        edges.push(branchOutEdge);

        // 2. Chain subnodes left-to-right: subnode[i] (right) → subnode[i+1] (left)
        for (let j = 0; j < subnodeNodeIds.length - 1; j++) {
          const chainEdge: SubnodeBranchEdge = {
            id: `branch-chain-${subnodeNodeIds[j]}-${subnodeNodeIds[j + 1]}`,
            source: subnodeNodeIds[j],
            target: subnodeNodeIds[j + 1],
            sourceHandle: "right",
            targetHandle: "left",
            type: "subnodeBranch",
            data: {
              lineColor,
              isExpanded: false,
              parentSlideId: slide.id,
            },
          };
          edges.push(chainEdge);
        }

        // 3. Last subnode (right) → metro stop (branch-in)
        const branchInEdge: SubnodeBranchEdge = {
          id: `branch-in-${subnodeNodeIds[subnodeNodeIds.length - 1]}-${nodeId}`,
          source: subnodeNodeIds[subnodeNodeIds.length - 1],
          target: nodeId,
          sourceHandle: "right",
          targetHandle: "branch-in",
          type: "subnodeBranch",
          data: {
            lineColor,
            isExpanded: false,
            parentSlideId: slide.id,
          },
        };
        edges.push(branchInEdge);
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

  // Grey Line: Natural Language Software (slide-15) -> Claude Co-work (slide-15b) -> CLI (slide-16)
  // "AI Hypophobia" - the grey line representing the bridge from non-tech to tech
  const greyLineColor = METRO_LINE_COLORS["hypophobia"];

  // Edge 1: Natural Language Software (last non-tech) -> Claude Co-work (first hypophobia)
  if (lastNodeBySection["levels-nontech"] && firstNodeBySection["hypophobia"]) {
    const greyLineEdge1: MetroLineEdge = {
      id: "edge-nontech-to-hypophobia",
      source: lastNodeBySection["levels-nontech"],
      target: firstNodeBySection["hypophobia"],
      sourceHandle: "right",
      targetHandle: "left",
      type: "metroLine",
      data: {
        lineLabel: "GREY LINE",
        lineSubtitle: "AI Hypophobia",
        lineColor: greyLineColor,
      },
      style: {
        stroke: greyLineColor,
        strokeWidth: METRO_LAYOUT.lineThickness,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    };
    edges.push(greyLineEdge1);
  }

  // Edge 2: Claude Co-work (last hypophobia) -> CLI (first tech)
  if (lastNodeBySection["hypophobia"] && firstNodeBySection["levels-tech"]) {
    edges.push({
      id: "edge-hypophobia-to-tech",
      source: lastNodeBySection["hypophobia"],
      target: firstNodeBySection["levels-tech"],
      sourceHandle: "right",
      targetHandle: "left-0",
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 40,
      },
      style: {
        stroke: greyLineColor,
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

  // Project Path connections (magenta line - standalone with specific connections)
  // CLI (levels-tech first node) -> CraigDosSantos.com (first project)
  // Note: Edge direction swapped so handle types match (bottom=source, top=target)
  if (firstNodeBySection["projects"] && firstNodeBySection["levels-tech"]) {
    edges.push({
      id: "edge-cli-to-projects",
      source: firstNodeBySection["levels-tech"],
      target: firstNodeBySection["projects"],
      sourceHandle: "bottom",
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

  // The Only Way Forward (closing) -> Level Up with AI Prez (last project)
  // Note: Edge direction swapped so handle types match (bottom=source, top=target)
  if (lastNodeBySection["projects"] && firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-closing-to-levelupai",
      source: firstNodeBySection["closing"],
      target: lastNodeBySection["projects"],
      sourceHandle: "bottom",
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

  // Swarms and Infrastructure (slide-25) -> The Only Way Forward (closing)
  // Find the swarms node specifically
  const swarmsNodeId = "metro-slide-25";
  if (firstNodeBySection["closing"]) {
    edges.push({
      id: "edge-swarms-to-closing",
      source: swarmsNodeId,
      target: firstNodeBySection["closing"],
      sourceHandle: "right",
      targetHandle: "left-2", // Additional left handle for swarms connection
      type: "smoothstep",
      pathOptions: {
        borderRadius: EDGE_BORDER_RADIUS,
        offset: 80,
      },
      style: {
        stroke: METRO_LINE_COLORS["levels-tech"],
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

  // First node of tech track (CLI) is a junction (receives from mapping + nontech bridge + projects, sends to tech)
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
        handleId: "bottom",
        position: "bottom",
        offset: 0,
        lineColor: METRO_LINE_COLORS["projects"],
      },
      {
        handleId: "right-0",
        position: "right",
        offset: 0,
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
    ]);
  }

  // First node of closing is a junction (receives from nontech, tech, swarms, and projects)
  if (firstNodeBySection["closing"]) {
    const nodeId = firstNodeBySection["closing"];
    junctionNodeIds.add(nodeId);
    junctionColors.set(nodeId, [
      METRO_LINE_COLORS["levels-nontech"],
      METRO_LINE_COLORS["levels-tech"],
      METRO_LINE_COLORS["closing"],
      METRO_LINE_COLORS["projects"],
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
        lineColor: METRO_LINE_COLORS["levels-tech"],
      },
      {
        handleId: "bottom",
        position: "bottom",
        offset: 0,
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

  // Generate river waypoint nodes
  const riverWaypointNodes: RiverWaypointNode[] = [];
  for (let i = 0; i < RIVER_WAYPOINT_POSITIONS.length; i++) {
    const waypointId = `river-waypoint-${i}`;
    const persistedPos = persistedPositions?.[waypointId];
    const defaultPos = RIVER_WAYPOINT_POSITIONS[i];

    const waypointNode: RiverWaypointNode = {
      id: waypointId,
      type: "riverWaypoint",
      position: persistedPos || defaultPos,
      data: {
        waypointIndex: i,
      },
      zIndex: -50, // Below metro lines but above background
      draggable: true,
    };
    riverWaypointNodes.push(waypointNode);
  }
  nodes.push(...riverWaypointNodes);

  // Generate river edges connecting waypoints
  for (let i = 0; i < riverWaypointNodes.length - 1; i++) {
    const sourceNode = riverWaypointNodes[i];
    const targetNode = riverWaypointNodes[i + 1];

    // Add label to the middle edge
    const isMiddleEdge = i === Math.floor(riverWaypointNodes.length / 2) - 1;

    const riverEdge: RiverEdge = {
      id: `river-edge-${i}-${i + 1}`,
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle: "right",
      targetHandle: "left",
      type: "riverEdge",
      zIndex: -50,
      data: {
        label: isMiddleEdge ? RIVER_LABEL : undefined,
        // strokeWidth uses default from RiverEdge.tsx (120)
      },
    };
    edges.push(riverEdge);
  }

  // Generate landmark nodes
  for (const landmark of LANDMARKS) {
    const persistedPos = persistedPositions?.[landmark.id];
    const defaultPos = LANDMARK_INITIAL_POSITIONS[landmark.id] || {
      x: 0,
      y: 0,
    };

    // Geographic landmarks (water, landmass) render below river
    const isGeographic =
      landmark.id.includes("water") || landmark.id.includes("landmass");
    const zIndex = isGeographic ? -60 : -40; // Geographic below river (-50), others above

    // Get persisted scale or use default
    const scale = persistedPos?.scale ?? landmark.defaultScale ?? 1;

    const landmarkNode: LandmarkNode = {
      id: landmark.id,
      type: "landmark",
      position: {
        x: persistedPos?.x ?? defaultPos.x,
        y: persistedPos?.y ?? defaultPos.y,
      },
      data: {
        image: landmark.image,
        svgType: landmark.svgType,
        label: landmark.label,
        scale,
      },
      zIndex,
      draggable: true,
    };
    nodes.push(landmarkNode);
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
