import { useMemo, useCallback, useEffect } from "react";
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
    nodes,
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

  // Mark current slide as active
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "slide") {
        const slideId = node.id.replace("slide-", "");
        return {
          ...node,
          data: {
            ...node.data,
            isActive: slideId === currentSlideId,
          },
        };
      }
      return node;
    }) as PresentationNode[];
  }, [nodes, currentSlideId]);

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
          color="rgba(255, 255, 255, 0.1)"
        />
        <MiniMap
          nodeColor={(node) => {
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
            return "#4b5563";
          }}
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
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
