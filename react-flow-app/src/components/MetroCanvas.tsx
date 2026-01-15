import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  useReactFlow,
  applyNodeChanges,
  type NodeMouseHandler,
  type NodeChange,
  type Edge,
} from "@xyflow/react";
import MetroStopNode from "./nodes/MetroStopNode";
import MetroBackgroundNode from "./nodes/MetroBackgroundNode";
import ResourceIconNode from "./nodes/ResourceIconNode";
import SlideNode from "./nodes/SlideNode";
import NavigationControls from "./panels/NavigationControls";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateMetroLayout } from "../utils/generateMetroLayout";
import { clearPersistedPositions } from "../utils/persistence";
import { sections, slides, resources } from "../data/slides";
import type { PresentationNode } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  metroStop: MetroStopNode,
  metroBackground: MetroBackgroundNode,
  resourceIcon: ResourceIconNode,
  slide: SlideNode,
};

function MetroCanvas() {
  const { fitView } = useReactFlow();

  // Generate metro layout
  const { nodes: metroNodes, edges: metroEdges } = useMemo(
    () => generateMetroLayout(sections, slides, resources),
    [],
  );

  // State for nodes and edges
  const [nodes, setNodes] = useState<PresentationNode[]>(() => {
    // Calculate bounds for background
    let maxX = 0;
    let maxY = 0;
    for (const node of metroNodes) {
      maxX = Math.max(maxX, node.position.x + 200);
      maxY = Math.max(maxY, node.position.y + 200);
    }

    const backgroundNode: PresentationNode = {
      id: "metro-background",
      type: "metroBackground",
      position: { x: -100, y: -100 },
      data: { width: maxX + 200, height: maxY + 200 },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    return [backgroundNode, ...metroNodes];
  });

  const [edges] = useState<Edge[]>(metroEdges);

  // Keyboard navigation
  const {
    currentSlideId,
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    navigateToSlide,
    goToNextSlide,
    goToPreviousSlide,
    toggleOverview,
  } = useKeyboardNavigation({ sections, slides });

  // Handle node click - zoom to stop
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "metroStop") {
        // Extract slide id from metro node id (metro-slide-01 -> slide-01)
        const slideId = node.id.replace("metro-", "");
        navigateToSlide(slideId);

        // Zoom to the clicked stop
        fitView({
          nodes: [{ id: node.id }],
          duration: 500,
          padding: 0.5,
          maxZoom: 2,
        });
      }
    },
    [fitView, navigateToSlide],
  );

  // Handle node changes (dragging)
  const onNodesChange = useCallback(
    (changes: NodeChange<PresentationNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [],
  );

  // Reset to overview
  const handleToggleOverview = useCallback(() => {
    toggleOverview();
    if (!isOverviewMode) {
      fitView({
        duration: 500,
        padding: 0.1,
        maxZoom: 1,
      });
    }
  }, [fitView, toggleOverview, isOverviewMode]);

  // Update active state on nodes
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "metroStop") {
        // metro-slide-01 -> slide-01, currentSlideId is "slide-01"
        const slideId = node.id.replace("metro-", "");
        const isActive = slideId === currentSlideId;
        return {
          ...node,
          data: { ...node.data, isActive },
        };
      }
      return node;
    });
  }, [nodes, currentSlideId]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        nodesDraggable={true}
        minZoom={0.1}
        maxZoom={3}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
        proOptions={{ hideAttribution: true }}
      />
      <NavigationControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        isOverviewMode={isOverviewMode}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onToggleOverview={handleToggleOverview}
        onReset={() => {
          clearPersistedPositions();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default MetroCanvas;
