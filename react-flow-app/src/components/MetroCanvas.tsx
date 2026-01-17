import { useState, useMemo, useCallback, useRef } from "react";
import {
  ReactFlow,
  useReactFlow,
  useOnViewportChange,
  applyNodeChanges,
  type NodeMouseHandler,
  type NodeChange,
  type Edge,
  type Node,
} from "@xyflow/react";
import MetroStopNode from "./nodes/MetroStopNode";
import MetroBackgroundNode from "./nodes/MetroBackgroundNode";
import ResourceIconNode from "./nodes/ResourceIconNode";
import SlideNode from "./nodes/SlideNode";
import MetroLineLabelNode from "./nodes/MetroLineLabelNode";
import NavigationControls from "./panels/NavigationControls";
import MetroLegend from "./panels/MetroLegend";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateMetroLayout } from "../utils/generateMetroLayout";
import {
  clearPersistedPositions,
  loadPersistedPositions,
  savePersistedPositions,
} from "../utils/persistence";
import { sections, slides, resources } from "../data/slides";
import type { PresentationNode } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  metroStop: MetroStopNode,
  metroBackground: MetroBackgroundNode,
  resourceIcon: ResourceIconNode,
  slide: SlideNode,
  metroLineLabel: MetroLineLabelNode,
};

function MetroCanvas() {
  const { fitView, getViewport } = useReactFlow();

  // Ref to track when we're programmatically navigating (prevents infinite loop)
  const isNavigatingRef = useRef(false);

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
    setActiveSlide,
  } = useKeyboardNavigation({ sections, slides });

  // Find closest metro stop to viewport center
  const findClosestSlide = useCallback(() => {
    const viewport = getViewport();
    const centerX =
      -viewport.x / viewport.zoom + window.innerWidth / 2 / viewport.zoom;
    const centerY =
      -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom;

    let closest: string | null = null;
    let minDist = Infinity;

    for (const node of nodes) {
      if (node.type === "metroStop") {
        const dx = node.position.x - centerX;
        const dy = node.position.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closest = node.id.replace("metro-", "");
        }
      }
    }
    return closest;
  }, [nodes, getViewport]);

  // Auto-update active slide based on viewport center (state only, no fitView)
  useOnViewportChange({
    onEnd: useCallback(() => {
      // Skip if we initiated the viewport change (prevents infinite loop)
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
      }
      // Only update active slide state - do NOT trigger fitView
      // This allows free manual zoom/pan without auto-centering
      const closest = findClosestSlide();
      if (closest && closest !== currentSlideId) {
        setActiveSlide(closest);
      }
    }, [findClosestSlide, currentSlideId, setActiveSlide]),
  });

  // Handle node click - zoom to stop and navigate
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "metroStop") {
        // Extract slide id and navigate
        const slideId = node.id.replace("metro-", "");
        // Set navigating ref to prevent viewport change handler from firing
        isNavigatingRef.current = true;
        // navigateToSlide already calls fitView internally
        navigateToSlide(slideId);
      }
    },
    [navigateToSlide],
  );

  // Handle node changes (dragging)
  const onNodesChange = useCallback(
    (changes: NodeChange<PresentationNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [],
  );

  // Clear selection after drag and persist label positions
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node, _nodes: Node[]) => {
      // Persist position for label nodes
      if (node.type === "metroLineLabel") {
        const existingPositions = loadPersistedPositions() || {};
        savePersistedPositions({
          ...existingPositions,
          [node.id]: { x: node.position.x, y: node.position.y },
        });
      }

      // Deselect all nodes after drag completes to ensure independent movement
      setNodes((nds) =>
        nds.map((n) => (n.selected ? { ...n, selected: false } : n)),
      );
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

  // Update active state and navigation props on nodes
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "metroStop") {
        // metro-slide-01 -> slide-01, currentSlideId is "slide-01"
        const slideId = node.id.replace("metro-", "");
        const isActive = slideId === currentSlideId;
        const slideIndex = slides.findIndex((s) => s.id === slideId);

        return {
          ...node,
          data: {
            ...node.data,
            isActive,
            // Navigation callbacks for full slide view
            onPrevious:
              slideIndex > 0
                ? () => navigateToSlide(slides[slideIndex - 1].id)
                : undefined,
            onNext:
              slideIndex < slides.length - 1
                ? () => navigateToSlide(slides[slideIndex + 1].id)
                : undefined,
            hasPrevious: slideIndex > 0,
            hasNext: slideIndex < slides.length - 1,
          },
        };
      }
      return node;
    });
  }, [nodes, currentSlideId, navigateToSlide]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
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
      <MetroLegend />
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
