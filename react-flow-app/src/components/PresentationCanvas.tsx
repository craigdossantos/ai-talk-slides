import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  useReactFlow,
  applyNodeChanges,
  type NodeMouseHandler,
  type NodeChange,
} from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import ResourceNode from "./nodes/ResourceNode";
import PaperBackgroundNode from "./nodes/PaperBackgroundNode";
import SectionNavigator from "./panels/SectionNavigator";
import NavigationControls from "./panels/NavigationControls";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateNodes } from "../utils/generateNodes";
import { generateEdges } from "../utils/generateEdges";
import {
  loadPersistedPositions,
  savePersistedPositions,
  clearPersistedPositions,
} from "../utils/persistence";
import { sections, slides, resources } from "../data/slides";
import type { PresentationNode } from "../types/presentation";
import { TRACK_COLORS } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
  sectionHeader: SectionHeaderNode,
  resource: ResourceNode,
  paperBackground: PaperBackgroundNode,
};

// Padding around content for paper background
const PAPER_PADDING = 200;

// Debounce delay for saving node positions (ms)
const SAVE_DEBOUNCE_MS = 500;

function PresentationCanvas() {
  const { fitView } = useReactFlow();

  // Generate nodes from data - use useState to allow dragging to update positions
  const [nodes, setNodes] = useState<PresentationNode[]>(() => {
    const contentNodes = generateNodes(sections, slides, resources);

    // Load any persisted positions from localStorage
    const persistedPositions = loadPersistedPositions();

    // Merge persisted positions with generated nodes
    const nodesWithPersistedPositions = persistedPositions
      ? contentNodes.map((node) => {
          const persistedPos = persistedPositions[node.id];
          if (persistedPos) {
            return {
              ...node,
              position: persistedPos,
            };
          }
          return node;
        })
      : contentNodes;

    // Calculate bounds of all content nodes
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const node of nodesWithPersistedPositions) {
      // Estimate node dimensions based on type
      const width =
        node.type === "slide" ? 520 : node.type === "resource" ? 280 : 600;
      const height =
        node.type === "slide" ? 400 : node.type === "resource" ? 80 : 120;

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + width);
      maxY = Math.max(maxY, node.position.y + height);
    }

    // Create paper background node with padding
    const paperNode: PresentationNode = {
      id: "paper-background",
      type: "paperBackground",
      position: {
        x: minX - PAPER_PADDING,
        y: minY - PAPER_PADDING,
      },
      data: {
        width: maxX - minX + PAPER_PADDING * 2,
        height: maxY - minY + PAPER_PADDING * 2,
      },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    // Paper goes first (rendered behind everything)
    return [paperNode, ...nodesWithPersistedPositions];
  });

  const edges = useMemo(() => generateEdges(sections, slides, resources), []);

  // Ref for debounced save timeout
  const saveTimeoutRef = useRef<number | null>(null);

  // Debounced save function for node positions
  const debouncedSavePositions = useCallback(
    (nodesToSave: PresentationNode[]) => {
      // Clear any existing timeout
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = window.setTimeout(() => {
        // Extract only position data, exclude non-draggable nodes like paper background
        const positions: Record<string, { x: number; y: number }> = {};
        for (const node of nodesToSave) {
          // Skip paper background and other non-draggable nodes
          if (node.draggable === false) continue;
          positions[node.id] = {
            x: node.position.x,
            y: node.position.y,
          };
        }
        savePersistedPositions(positions);
        saveTimeoutRef.current = null;
      }, SAVE_DEBOUNCE_MS);
    },
    [],
  );

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Reset layout to default positions
  const resetLayout = useCallback(() => {
    // Clear persisted positions from localStorage
    clearPersistedPositions();

    // Regenerate nodes with default positions
    const contentNodes = generateNodes(sections, slides, resources);

    // Calculate bounds for paper background
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const node of contentNodes) {
      const width =
        node.type === "slide" ? 520 : node.type === "resource" ? 280 : 600;
      const height =
        node.type === "slide" ? 400 : node.type === "resource" ? 80 : 120;

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + width);
      maxY = Math.max(maxY, node.position.y + height);
    }

    // Create paper background node
    const paperNode: PresentationNode = {
      id: "paper-background",
      type: "paperBackground",
      position: {
        x: minX - PAPER_PADDING,
        y: minY - PAPER_PADDING,
      },
      data: {
        width: maxX - minX + PAPER_PADDING * 2,
        height: maxY - minY + PAPER_PADDING * 2,
      },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    // Update nodes with default positions
    setNodes([paperNode, ...contentNodes]);
  }, []);

  // Handle node changes (dragging, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange<PresentationNode>[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

        // Check if any changes are position changes (from dragging)
        // We save on any position change - the debounce handles rapid updates during drag
        const hasPositionChange = changes.some(
          (change) => change.type === "position",
        );

        // Trigger debounced save when positions change
        if (hasPositionChange) {
          debouncedSavePositions(updatedNodes as PresentationNode[]);
        }

        return updatedNodes;
      });
    },
    [debouncedSavePositions],
  );

  // Initialize keyboard navigation
  const {
    currentSlideId,
    currentSectionId,
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    navigateToSlide,
    navigateToSection,
    goToNextSlide,
    goToPreviousSlide,
    toggleOverview,
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
        onNodesChange={onNodesChange}
        nodesDraggable={true}
        fitView
        fitViewOptions={{
          nodes: [{ id: `slide-${slides[0].id}` }],
          padding: 0.3,
          maxZoom: 1.5,
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Notepad paper background is rendered via CSS on .react-flow__pane (see App.css) */}
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
      <NavigationControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
        isOverviewMode={isOverviewMode}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onToggleOverview={toggleOverview}
        onReset={resetLayout}
      />
    </div>
  );
}

export default PresentationCanvas;
