import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import LandmarkNode from "./nodes/LandmarkNode";
import RiverWaypointNode from "./nodes/RiverWaypointNode";
import MetroLineEdge from "./edges/MetroLineEdge";
import RiverEdge from "./edges/RiverEdge";
import NavigationControls from "./panels/NavigationControls";
import { EDIT_MODE } from "../config";
import MetroLegend from "./panels/MetroLegend";
import MetroTitle from "./panels/MetroTitle";
import MetroFooter from "./panels/MetroFooter";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateMetroLayout } from "../utils/generateMetroLayout";
import {
  clearPersistedPositions,
  loadPersistedPositions,
  savePersistedPositions,
  exportPositionsToFile,
} from "../utils/persistence";
import { sections, slides, resources } from "../data/slides";
import type { PresentationNode } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  metroStop: MetroStopNode,
  metroBackground: MetroBackgroundNode,
  resourceIcon: ResourceIconNode,
  slide: SlideNode,
  landmark: LandmarkNode,
  riverWaypoint: RiverWaypointNode,
};

// Register custom edge types
const edgeTypes = {
  metroLine: MetroLineEdge,
  riverEdge: RiverEdge,
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
    // Calculate bounds for background with extra padding for city border imagery
    let maxX = 0;
    let maxY = 0;
    for (const node of metroNodes) {
      maxX = Math.max(maxX, node.position.x + 200);
      maxY = Math.max(maxY, node.position.y + 200);
    }
    const bgPad = 600;

    const backgroundNode: PresentationNode = {
      id: "metro-background",
      type: "metroBackground",
      position: { x: -100 - bgPad, y: -100 - bgPad },
      data: { width: maxX + 200 + bgPad * 2, height: maxY + 200 + bgPad * 2 },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    return [backgroundNode, ...metroNodes];
  });

  const [edges] = useState<Edge[]>(metroEdges);

  // Track which node has full slide view open (null = none)
  const [fullSlideNodeId, setFullSlideNodeId] = useState<string | null>(null);

  // Close full slide view on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullSlideNodeId) {
        setFullSlideNodeId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullSlideNodeId]);

  // Keyboard navigation
  const {
    currentSlideId,
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    orderedSlides,
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

  // Threshold below which we close the full slide overlay
  const ZOOM_CLOSE_THRESHOLD = 0.5;

  // Auto-update active slide based on viewport center (state only, no fitView)
  useOnViewportChange({
    onEnd: useCallback(() => {
      // Skip if we initiated the viewport change (prevents infinite loop)
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
      }

      // Close full slide overlay when user zooms out
      const viewport = getViewport();
      if (viewport.zoom < ZOOM_CLOSE_THRESHOLD && fullSlideNodeId) {
        setFullSlideNodeId(null);
      }

      // Only update active slide state - do NOT trigger fitView
      // This allows free manual zoom/pan without auto-centering
      const closest = findClosestSlide();
      if (closest && closest !== currentSlideId) {
        setActiveSlide(closest);
      }
    }, [
      findClosestSlide,
      currentSlideId,
      setActiveSlide,
      getViewport,
      fullSlideNodeId,
    ]),
  });

  // Handle node click - navigate and open full slide view
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "metroStop") {
        const nodeId = node.id;
        const slideId = nodeId.replace("metro-", "");

        // Set navigating ref to prevent viewport change handler from firing
        isNavigatingRef.current = true;

        // If clicking already active node, toggle full slide view
        if (slideId === currentSlideId) {
          setFullSlideNodeId((prev) => (prev === nodeId ? null : nodeId));
        } else {
          navigateToSlide(slideId);
          setFullSlideNodeId(nodeId);
        }
      }
    },
    [navigateToSlide, currentSlideId],
  );

  // Handle pane click (clicking on canvas background) - close full slide
  const handlePaneClick = useCallback(() => {
    setFullSlideNodeId(null);
  }, []);

  // Handle node changes (dragging)
  const onNodesChange = useCallback(
    (changes: NodeChange<PresentationNode>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [],
  );

  // Clear selection after drag and persist node positions
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node, _nodes: Node[]) => {
      // Persist position for draggable nodes (metro stops, labels, landmarks, river waypoints)
      const persistableTypes = [
        "metroLineLabel",
        "metroStop",
        "landmark",
        "riverWaypoint",
      ];
      if (persistableTypes.includes(node.type || "")) {
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
    // Simple array-based prev/next
    const hasPrevious = currentSlideIndex > 0;
    const hasNext = currentSlideIndex < totalSlides - 1;

    return nodes.map((node) => {
      if (node.type === "metroStop") {
        // metro-slide-01 -> slide-01, currentSlideId is "slide-01"
        const slideId = node.id.replace("metro-", "");
        const isActive = slideId === currentSlideId;
        const isFullSlideOpen = fullSlideNodeId === node.id;

        return {
          ...node,
          // Set zIndex on node itself - active node gets high z-index
          zIndex: isActive ? 1000 : 1,
          data: {
            ...node.data,
            isActive,
            // Simple sequential navigation callbacks
            onPrevious: hasPrevious
              ? () => {
                  const prevSlide = orderedSlides[currentSlideIndex - 1];
                  navigateToSlide(prevSlide.id);
                  setFullSlideNodeId(`metro-${prevSlide.id}`);
                }
              : undefined,
            onNext: hasNext
              ? () => {
                  const nextSlide = orderedSlides[currentSlideIndex + 1];
                  navigateToSlide(nextSlide.id);
                  setFullSlideNodeId(`metro-${nextSlide.id}`);
                }
              : undefined,
            hasPrevious,
            hasNext,
            // Click-to-expand full slide view
            isFullSlideOpen,
            onCloseFullSlide: () => setFullSlideNodeId(null),
            // For constraining other thumbnails when any slide is open
            isAnySlideOpen: fullSlideNodeId !== null,
          },
        };
      }

      return node;
    });
  }, [
    nodes,
    currentSlideId,
    currentSlideIndex,
    totalSlides,
    orderedSlides,
    navigateToSlide,
    fullSlideNodeId,
  ]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        nodesDraggable={EDIT_MODE}
        minZoom={0.1}
        maxZoom={3}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
        proOptions={{ hideAttribution: true }}
      />
      <MetroTitle />
      <MetroLegend />
      <MetroFooter />
      <NavigationControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        isOverviewMode={isOverviewMode}
        isEditMode={EDIT_MODE}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onToggleOverview={handleToggleOverview}
        onReset={() => {
          clearPersistedPositions();
          window.location.reload();
        }}
        onExportPositions={() => exportPositionsToFile()}
      />
    </div>
  );
}

export default MetroCanvas;
