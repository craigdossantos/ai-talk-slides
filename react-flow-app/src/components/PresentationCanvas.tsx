import { useMemo, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import ResourceNode from "./nodes/ResourceNode";
import SectionNavigator from "./panels/SectionNavigator";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateNodes } from "../utils/generateNodes";
import { generateEdges } from "../utils/generateEdges";
import { sections, slides, resources } from "../data/slides";
import type { PresentationNode } from "../types/presentation";
import { TRACK_COLORS } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
  sectionHeader: SectionHeaderNode,
  resource: ResourceNode,
};

function PresentationCanvas() {
  const { fitView } = useReactFlow();

  // Generate nodes and edges from data
  const nodes = useMemo(() => generateNodes(sections, slides, resources), []);

  const edges = useMemo(() => generateEdges(sections, slides, resources), []);

  // Initialize keyboard navigation
  const {
    currentSlideId,
    currentSectionId,
    isOverviewMode,
    navigateToSlide,
    navigateToSection,
  } = useKeyboardNavigation({
    sections,
    slides,
  });

  // Handle window resize gracefully - refocus current slide after resize
  useEffect(() => {
    let resizeTimeout: number;

    const handleResize = () => {
      // Debounce resize events to avoid excessive fitView calls
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (currentSlideId && !isOverviewMode) {
          // Refocus on current slide after resize
          fitView({
            nodes: [{ id: `slide-${currentSlideId}` }],
            duration: 300,
            padding: 0.3,
            maxZoom: 1.5,
          });
        } else if (isOverviewMode) {
          // Keep overview mode - fit all nodes
          fitView({
            duration: 300,
            padding: 0.05,
            minZoom: 0.1,
            maxZoom: 1,
          });
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [fitView, currentSlideId, isOverviewMode]);

  // Handle node click - navigate to clicked slide or section
  // In overview mode, clicking any node focuses it
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "slide") {
        // Extract slide ID from node ID (format: "slide-{id}")
        const slideId = node.id.replace("slide-", "");
        navigateToSlide(slideId);
      } else if (node.type === "sectionHeader") {
        // Extract section ID from node ID (format: "section-{id}")
        const sectionId = node.id.replace("section-", "");
        navigateToSection(sectionId);
      }
    },
    [navigateToSlide, navigateToSection],
  );

  // Track previous active slide to only update changed nodes
  const prevActiveSlideIdRef = useRef<string | null>(null);

  // Mark current slide as active - only create new objects when isActive actually changes
  const nodesWithActiveState = useMemo(() => {
    const prevActiveSlideId = prevActiveSlideIdRef.current;

    return nodes.map((node) => {
      if (node.type === "slide") {
        const slideId = node.id.replace("slide-", "");
        const wasActive = slideId === prevActiveSlideId;
        const isActive = slideId === currentSlideId;

        // Only create a new object if the isActive state changed for this node
        if (wasActive !== isActive) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive,
            },
          };
        }
        // Return node as-is if isActive state didn't change
        // But we still need to set isActive on initial render
        if (node.data.isActive !== isActive) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive,
            },
          };
        }
      }
      return node;
    }) as PresentationNode[];
  }, [nodes, currentSlideId]);

  // Update ref after render
  useEffect(() => {
    prevActiveSlideIdRef.current = currentSlideId;
  }, [currentSlideId]);

  // Memoized MiniMap nodeColor callback
  const getNodeColor = useCallback(
    (node: { type?: string; data: Record<string, unknown> }) => {
      // Get track color based on node type and data
      if (node.type === "sectionHeader") {
        const data = node.data as {
          section: { track: keyof typeof TRACK_COLORS };
        };
        return TRACK_COLORS[data.section.track];
      }
      if (node.type === "slide") {
        const data = node.data as {
          section: { track: keyof typeof TRACK_COLORS };
        };
        return TRACK_COLORS[data.section.track];
      }
      // Resource nodes get a muted gray color
      return "#94a3b8";
    },
    [],
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{
          nodes: [{ id: `slide-${slides[0].id}` }],
          padding: 0.3,
          maxZoom: 1.5,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(0, 0, 0, 0.08)"
        />
        <MiniMap
          nodeColor={getNodeColor}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
          maskColor="rgba(248, 250, 252, 0.7)"
          position="bottom-right"
        />
      </ReactFlow>
      <SectionNavigator
        sections={sections}
        currentSectionId={currentSectionId}
        onSectionClick={navigateToSection}
      />
    </div>
  );
}

export default PresentationCanvas;
