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
import SubnodeNode from "./nodes/SubnodeNode";
import LandmarkNode from "./nodes/LandmarkNode";
import RiverWaypointNode from "./nodes/RiverWaypointNode";
import MetroLineEdge from "./edges/MetroLineEdge";
import ArcEdge from "./edges/ArcEdge";
import RiverEdge from "./edges/RiverEdge";
import SubnodeBranchEdge from "./edges/SubnodeBranchEdge";
import NavigationControls from "./panels/NavigationControls";
import { EDIT_MODE } from "../config";
import MetroLegend from "./panels/MetroLegend";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateMetroLayout } from "../utils/generateMetroLayout";
import { buildNavigationGraph } from "../utils/navigationGraph";
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
  subnode: SubnodeNode,
  landmark: LandmarkNode,
  riverWaypoint: RiverWaypointNode,
};

// Register custom edge types
const edgeTypes = {
  metroLine: MetroLineEdge,
  arcEdge: ArcEdge,
  riverEdge: RiverEdge,
  subnodeBranch: SubnodeBranchEdge,
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
          // Navigate to new slide and open full slide view
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

  // Build navigation graph for track-aware Prev/Next navigation
  // This follows the metro map edges rather than flat array index
  const navigationGraph = useMemo(
    () => buildNavigationGraph(sections, slides),
    [],
  );

  // Update active state and navigation props on nodes
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "metroStop") {
        // metro-slide-01 -> slide-01, currentSlideId is "slide-01"
        const slideId = node.id.replace("metro-", "");
        const isActive = slideId === currentSlideId;
        const isFullSlideOpen = fullSlideNodeId === node.id;

        // Get previous/next from navigation graph (follows track connections)
        const navLinks = navigationGraph.get(slideId);
        const previousSlideId = navLinks?.previous ?? null;
        const nextSlideId = navLinks?.next ?? null;

        return {
          ...node,
          // Set zIndex on node itself - active node gets high z-index
          // This is more reliable than CSS z-index for React Flow
          zIndex: isActive ? 1000 : 1,
          data: {
            ...node.data,
            isActive,
            // Navigation callbacks for full slide view - now track-aware
            onPrevious: previousSlideId
              ? () => {
                  navigateToSlide(previousSlideId);
                  setFullSlideNodeId(`metro-${previousSlideId}`);
                }
              : undefined,
            onNext: nextSlideId
              ? () => {
                  navigateToSlide(nextSlideId);
                  setFullSlideNodeId(`metro-${nextSlideId}`);
                }
              : undefined,
            hasPrevious: previousSlideId !== null,
            hasNext: nextSlideId !== null,
            // Click-to-expand full slide view
            isFullSlideOpen,
            onCloseFullSlide: () => setFullSlideNodeId(null),
            // For constraining other thumbnails when any slide is open
            isAnySlideOpen: fullSlideNodeId !== null,
          },
        };
      }

      // Handle subnode expansion based on parent metro stop being active
      if (node.type === "subnode") {
        // parentNodeId is like "metro-slide-03", currentSlideId is like "slide-03"
        const parentSlideId = (
          node.data as { parentNodeId: string }
        ).parentNodeId.replace("metro-", "");
        const isExpanded = parentSlideId === currentSlideId;

        return {
          ...node,
          zIndex: isExpanded ? 999 : 0, // Above other nodes but below active metro stop
          data: {
            ...node.data,
            isExpanded,
          },
        };
      }

      return node;
    });
  }, [
    nodes,
    currentSlideId,
    navigateToSlide,
    navigationGraph,
    fullSlideNodeId,
  ]);

  // Update subnode edges with expansion state based on their parent metro stop being active
  const edgesWithExpansionState = useMemo(() => {
    return edges.map((edge) => {
      if (edge.type === "arcEdge") {
        // Arc edges connect from subnode (source) to metro stop (target)
        // Target is like "metro-slide-03", currentSlideId is like "slide-03"
        const targetSlideId = edge.target.replace("metro-", "");
        const isExpanded = targetSlideId === currentSlideId;

        return {
          ...edge,
          data: {
            ...edge.data,
            isExpanded,
          },
        };
      }

      if (edge.type === "subnodeBranch") {
        // Branch edges store their parent slide ID in data
        const parentSlideId = (edge.data as { parentSlideId?: string })
          ?.parentSlideId;
        const isExpanded = parentSlideId === currentSlideId;

        return {
          ...edge,
          data: {
            ...edge.data,
            isExpanded,
          },
        };
      }
      return edge;
    });
  }, [edges, currentSlideId]);

  // Check if we're in focused mode (zoomed into a slide)
  const isFocusedMode = !isOverviewMode && currentSlideId !== null;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edgesWithExpansionState}
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
        className={isFocusedMode ? "react-flow--focused" : ""}
      />
      <MetroLegend />
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
