import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type NodeMouseHandler,
} from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import ResourceNode from "./nodes/ResourceNode";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { generateNodes } from "../utils/generateNodes";
import { generateEdges } from "../utils/generateEdges";
import type {
  Section,
  SlideContent,
  Resource,
  PresentationNode,
} from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
  sectionHeader: SectionHeaderNode,
  resource: ResourceNode,
};

// Sample sections for testing
const sampleSections: Section[] = [
  {
    id: "section-1",
    title: "Introduction",
    track: "general",
  },
  {
    id: "section-2",
    title: "Non-Technical Track",
    track: "non-technical",
  },
  {
    id: "section-3",
    title: "Technical Track",
    track: "technical",
  },
];

// Sample slides for testing
const sampleSlides: SlideContent[] = [
  {
    id: "1",
    sectionId: "section-1",
    type: "title",
    title: "Using AI as a Native Skill",
    subtitle: "A practical map for learning, working, and building with AI",
  },
  {
    id: "2",
    sectionId: "section-1",
    type: "content",
    title: "Mental Models, Not Magic",
    bullets: [
      "AI is a tool, not magic",
      "Build mental models for effective use",
      "Understand the capabilities and limitations",
      "Practice deliberate skill development",
    ],
  },
  {
    id: "3",
    sectionId: "section-2",
    type: "content",
    title: "Level 0: Awareness",
    level: 0,
    bullets: [
      "Know AI exists and its basic capabilities",
      "Recognize potential use cases",
      "Understand the hype vs reality",
    ],
  },
  {
    id: "4",
    sectionId: "section-2",
    type: "content",
    title: "Level 2: Regular Usage",
    level: 2,
    bullets: [
      "Use AI for daily tasks",
      "Improve prompt quality over time",
      "Recognize patterns in AI responses",
    ],
  },
  {
    id: "5",
    sectionId: "section-3",
    type: "content",
    title: "Level 3: Code Generation",
    level: 3,
    bullets: [
      "Generate boilerplate code",
      "Explain existing code",
      "Debug with AI assistance",
    ],
  },
  {
    id: "6",
    sectionId: "section-3",
    type: "content",
    title: "Level 5: AI-Native Development",
    level: 5,
    bullets: [
      "Build with AI from the start",
      "Design systems for AI collaboration",
      "Leverage AI for architecture decisions",
    ],
  },
];

// Sample resources for testing
const sampleResources: Resource[] = [
  {
    id: "1",
    slideId: "1",
    type: "article",
    title: "AI Native Skills Guide",
    url: "https://example.com/ai-guide",
  },
  {
    id: "2",
    slideId: "2",
    type: "tool",
    title: "Claude AI Assistant",
    url: "https://claude.ai",
  },
  {
    id: "3",
    slideId: "5",
    type: "github",
    title: "Code Generation Examples",
    url: "https://github.com/example/code-gen",
  },
  {
    id: "4",
    slideId: "2",
    type: "video",
    title: "Mental Models Tutorial",
    url: "https://youtube.com/watch?v=example",
  },
  {
    id: "5",
    slideId: "5",
    type: "docs",
    title: "API Documentation",
    url: "https://docs.example.com/api",
  },
];

function PresentationCanvas() {
  // Generate nodes and edges from data
  const nodes = useMemo(
    () => generateNodes(sampleSections, sampleSlides, sampleResources),
    [],
  );

  const edges = useMemo(
    () => generateEdges(sampleSections, sampleSlides, sampleResources),
    [],
  );

  // Initialize keyboard navigation
  const { currentSlideId, navigateToSlide } = useKeyboardNavigation({
    sections: sampleSections,
    slides: sampleSlides,
    nodes,
  });

  // Handle node click - navigate to clicked slide
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      // Only navigate for slide nodes
      if (node.type === "slide") {
        // Extract slide ID from node ID (format: "slide-{id}")
        const slideId = node.id.replace("slide-", "");
        navigateToSlide(slideId);
      }
    },
    [navigateToSlide],
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
    <ReactFlow
      nodes={nodesWithActiveState}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{
        nodes: [{ id: `slide-${sampleSlides[0].id}` }],
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
    </ReactFlow>
  );
}

export default PresentationCanvas;
