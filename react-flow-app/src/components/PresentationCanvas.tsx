import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  useReactFlow,
  applyNodeChanges,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  type NodeChange,
  type Edge,
  type Connection,
} from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import ResourceNode from "./nodes/ResourceNode";
import PaperBackgroundNode from "./nodes/PaperBackgroundNode";
import SectionNavigator from "./panels/SectionNavigator";
import NavigationControls from "./panels/NavigationControls";
import EditorPanel from "./panels/EditorPanel";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useEdgeEdits, clearEdgeEdits } from "../hooks/useEdgeEdits";
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

// Padding around content for paper background (doubled for larger paper)
const PAPER_PADDING = 400;
// Extra paper size multiplier (2x as tall and wide)
const PAPER_SIZE_MULTIPLIER = 2;

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

    // Calculate base paper dimensions with padding
    const baseWidth = maxX - minX + PAPER_PADDING * 2;
    const baseHeight = maxY - minY + PAPER_PADDING * 2;

    // Apply multiplier for larger paper (2x as tall and wide)
    const paperWidth = baseWidth * PAPER_SIZE_MULTIPLIER;
    const paperHeight = baseHeight * PAPER_SIZE_MULTIPLIER;

    // Center the paper around content
    const extraWidth = (paperWidth - baseWidth) / 2;
    const extraHeight = (paperHeight - baseHeight) / 2;

    // Create paper background node with padding
    const paperNode: PresentationNode = {
      id: "paper-background",
      type: "paperBackground",
      position: {
        x: minX - PAPER_PADDING - extraWidth,
        y: minY - PAPER_PADDING - extraHeight,
      },
      data: {
        width: paperWidth,
        height: paperHeight,
      },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    // Paper goes first (rendered behind everything)
    return [paperNode, ...nodesWithPersistedPositions];
  });

  // Use edge edits hook for tracking added/deleted edges
  const { edgeEdits, addEdge, deleteEdge } = useEdgeEdits();

  // Generate edges and apply persisted edits (added edges, filtered deleted edges)
  const [edges, setEdges] = useState<Edge[]>(() => {
    const generatedEdges = generateEdges(sections, slides, resources);

    // Filter out deleted edges
    const filteredEdges = generatedEdges.filter(
      (edge) => !edgeEdits.deletedEdgeIds.includes(edge.id),
    );

    // Convert stored edges to full Edge objects and append added edges
    const addedEdges: Edge[] = edgeEdits.addedEdges.map((storedEdge) => ({
      id: storedEdge.id,
      source: storedEdge.source,
      target: storedEdge.target,
      sourceHandle: storedEdge.sourceHandle,
      targetHandle: storedEdge.targetHandle,
      // Style custom edges with indigo color
      style: { strokeWidth: 2, stroke: "#6366f1" },
    }));

    return [...filteredEdges, ...addedEdges];
  });

  // State for editor panel (separate from currentSlideId used for navigation)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  // Reset layout to default positions and edges
  const resetLayout = useCallback(() => {
    // Clear persisted positions from localStorage
    clearPersistedPositions();

    // Clear edge edits from localStorage
    clearEdgeEdits();

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

    // Calculate base paper dimensions with padding
    const baseWidth = maxX - minX + PAPER_PADDING * 2;
    const baseHeight = maxY - minY + PAPER_PADDING * 2;

    // Apply multiplier for larger paper (2x as tall and wide)
    const paperWidth = baseWidth * PAPER_SIZE_MULTIPLIER;
    const paperHeight = baseHeight * PAPER_SIZE_MULTIPLIER;

    // Center the paper around content
    const extraWidth = (paperWidth - baseWidth) / 2;
    const extraHeight = (paperHeight - baseHeight) / 2;

    // Create paper background node
    const paperNode: PresentationNode = {
      id: "paper-background",
      type: "paperBackground",
      position: {
        x: minX - PAPER_PADDING - extraWidth,
        y: minY - PAPER_PADDING - extraHeight,
      },
      data: {
        width: paperWidth,
        height: paperHeight,
      },
      zIndex: -100,
      selectable: false,
      draggable: false,
    };

    // Update nodes with default positions
    setNodes([paperNode, ...contentNodes]);

    // Regenerate edges from scratch (no edits applied)
    const freshEdges = generateEdges(sections, slides, resources);
    setEdges(freshEdges);
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
          // Refocus on current slide after resize (slide takes 2/3 of window)
          fitView({
            nodes: [{ id: `slide-${currentSlideId}` }],
            duration: 300,
            padding: 0.15,
            maxZoom: 2.5,
          });
        } else if (isOverviewMode) {
          // Keep overview mode - fit all nodes (can zoom out to see entire paper)
          fitView({
            duration: 300,
            padding: 0.05,
            minZoom: 0.02,
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

  // Build ordered slides list for navigation (same logic as useKeyboardNavigation)
  const orderedSlides = useMemo(() => {
    const slidesBySection = new Map<string, typeof slides>();
    for (const slide of slides) {
      const sectionSlides = slidesBySection.get(slide.sectionId) || [];
      sectionSlides.push(slide);
      slidesBySection.set(slide.sectionId, sectionSlides);
    }
    return sections.flatMap((section) => slidesBySection.get(section.id) || []);
  }, []);

  // Mark current slide as active and add navigation props
  const nodesWithActiveState = useMemo(() => {
    const prevActiveSlideId = prevActiveSlideIdRef.current;

    return nodes.map((node) => {
      if (node.type === "slide") {
        const slideId = node.id.replace("slide-", "");
        const wasActive = slideId === prevActiveSlideId;
        const isActive = slideId === currentSlideId;

        // Find slide's position in orderedSlides for prev/next calculation
        const slideIndex = orderedSlides.findIndex((s) => s.id === slideId);
        const hasPrev = slideIndex > 0;
        const hasNext = slideIndex < orderedSlides.length - 1;

        // Create navigation callbacks
        const onNavigatePrev = hasPrev
          ? () => navigateToSlide(orderedSlides[slideIndex - 1].id)
          : undefined;
        const onNavigateNext = hasNext
          ? () => navigateToSlide(orderedSlides[slideIndex + 1].id)
          : undefined;

        // Only create a new object if the isActive state changed for this node
        if (wasActive !== isActive) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive,
              hasPrev,
              hasNext,
              onNavigatePrev,
              onNavigateNext,
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
              hasPrev,
              hasNext,
              onNavigatePrev,
              onNavigateNext,
            },
          };
        }
        // Still need to update navigation props even if active state unchanged
        return {
          ...node,
          data: {
            ...node.data,
            hasPrev,
            hasNext,
            onNavigatePrev,
            onNavigateNext,
          },
        };
      }
      return node;
    }) as PresentationNode[];
  }, [nodes, currentSlideId, orderedSlides, navigateToSlide]);

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

  // Close editor panel handler
  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  // Handle double-click on node to open editor panel for slide nodes
  const handleNodeDoubleClick = useCallback<NodeMouseHandler>((_, node) => {
    // Only open editor for slide nodes
    if (node.type === "slide") {
      // Extract slide ID from node ID (format: "slide-{id}")
      const slideId = node.id.replace("slide-", "");
      setSelectedSlideId(slideId);
      setIsEditorOpen(true);
    }
  }, []);

  // Handle edge creation when user drags between handles
  const handleConnect = useCallback(
    (connection: Connection) => {
      // Validate connection has required fields
      if (!connection.source || !connection.target) {
        return;
      }

      // Generate unique edge ID with timestamp
      const edgeId = `edge-custom-${Date.now()}`;

      // Create the new edge with indigo styling
      const newEdge: Edge = {
        id: edgeId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        style: { strokeWidth: 2, stroke: "#6366f1" },
      };

      // Add edge to edges state
      setEdges((eds) => [...eds, newEdge]);

      // Persist the edge using the hook
      addEdge(newEdge);
    },
    [addEdge],
  );

  // Handle edge click - Shift+click to delete edge
  const handleEdgeClick = useCallback<EdgeMouseHandler>(
    (event, edge) => {
      // Only delete if Shift key is held
      if (event.shiftKey) {
        // Remove edge from state
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));

        // Persist the deletion using the hook
        deleteEdge(edge.id);
      }
    },
    [deleteEdge],
  );

  // Compute slideData for EditorPanel from selectedSlideId
  const editorSlideData = useMemo(() => {
    if (!selectedSlideId) return null;
    const slide = slides.find((s) => s.id === selectedSlideId);
    if (!slide) return null;
    const section = sections.find((s) => s.id === slide.sectionId);
    if (!section) return null;
    return { slide, section };
  }, [selectedSlideId]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodesWithActiveState}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodesChange={onNodesChange}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        nodesDraggable={true}
        minZoom={0.02}
        maxZoom={3}
        fitView
        fitViewOptions={{
          nodes: [{ id: `slide-${slides[0].id}` }],
          padding: 0.15,
          maxZoom: 2.5,
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
        isEditMode={false}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onToggleOverview={toggleOverview}
        onReset={resetLayout}
        onExportPositions={() => {}}
      />
      <EditorPanel
        slideId={selectedSlideId}
        slideData={editorSlideData}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
      />
    </div>
  );
}

export default PresentationCanvas;
