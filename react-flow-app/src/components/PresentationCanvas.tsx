import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import ResourceNode from "./nodes/ResourceNode";
import type {
  SlideNode as SlideNodeType,
  SectionHeaderNode as SectionHeaderNodeType,
  ResourceNode as ResourceNodeType,
} from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
  sectionHeader: SectionHeaderNode,
  resource: ResourceNode,
};

// Sample data for testing node components
const sampleSlideNodes: SlideNodeType[] = [
  {
    id: "slide-1",
    type: "slide",
    position: { x: 400, y: 0 },
    data: {
      slide: {
        id: "slide-1",
        sectionId: "section-1",
        type: "title",
        title: "Using AI as a Native Skill",
        subtitle: "A practical map for learning, working, and building with AI",
      },
      section: {
        id: "section-1",
        title: "Introduction",
        track: "general",
      },
      isActive: true,
    },
  },
  {
    id: "slide-2",
    type: "slide",
    position: { x: 400, y: 220 },
    data: {
      slide: {
        id: "slide-2",
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
      section: {
        id: "section-1",
        title: "Introduction",
        track: "non-technical",
      },
      isActive: false,
    },
  },
  {
    id: "slide-3",
    type: "slide",
    position: { x: 1000, y: 220 },
    data: {
      slide: {
        id: "slide-3",
        sectionId: "section-2",
        type: "content",
        title: "Level 3: Code Generation",
        level: 3,
        bullets: [
          "Generate boilerplate code",
          "Explain existing code",
          "Debug with AI assistance",
        ],
      },
      section: {
        id: "section-2",
        title: "Technical Track",
        track: "technical",
      },
      isActive: false,
    },
  },
];

// Sample section header nodes for testing
const sampleSectionHeaderNodes: SectionHeaderNodeType[] = [
  {
    id: "section-header-1",
    type: "sectionHeader",
    position: { x: 0, y: 80 },
    data: {
      section: {
        id: "section-1",
        title: "Introduction",
        track: "general",
      },
      isActive: false,
    },
  },
  {
    id: "section-header-2",
    type: "sectionHeader",
    position: { x: 0, y: 280 },
    data: {
      section: {
        id: "section-2",
        title: "Non-Technical Track",
        track: "non-technical",
      },
      isActive: true,
    },
  },
  {
    id: "section-header-3",
    type: "sectionHeader",
    position: { x: 0, y: 480 },
    data: {
      section: {
        id: "section-3",
        title: "Technical Track",
        track: "technical",
      },
      isActive: false,
    },
  },
];

// Sample resource nodes for testing
const sampleResourceNodes: ResourceNodeType[] = [
  {
    id: "resource-1",
    type: "resource",
    position: { x: 720, y: 10 },
    data: {
      resource: {
        id: "resource-1",
        slideId: "slide-1",
        type: "article",
        title: "AI Native Skills Guide",
        url: "https://example.com/ai-guide",
      },
      isActive: false,
    },
  },
  {
    id: "resource-2",
    type: "resource",
    position: { x: 720, y: 230 },
    data: {
      resource: {
        id: "resource-2",
        slideId: "slide-2",
        type: "tool",
        title: "Claude AI Assistant",
        url: "https://claude.ai",
      },
      isActive: false,
    },
  },
  {
    id: "resource-3",
    type: "resource",
    position: { x: 1320, y: 230 },
    data: {
      resource: {
        id: "resource-3",
        slideId: "slide-3",
        type: "github",
        title: "Code Generation Examples",
        url: "https://github.com/example/code-gen",
      },
      isActive: true,
    },
  },
  {
    id: "resource-4",
    type: "resource",
    position: { x: 720, y: 330 },
    data: {
      resource: {
        id: "resource-4",
        slideId: "slide-2",
        type: "video",
        title: "Mental Models Tutorial",
        url: "https://youtube.com/watch?v=example",
      },
      isActive: false,
    },
  },
  {
    id: "resource-5",
    type: "resource",
    position: { x: 1320, y: 330 },
    data: {
      resource: {
        id: "resource-5",
        slideId: "slide-3",
        type: "docs",
        title: "API Documentation",
        url: "https://docs.example.com/api",
      },
      isActive: false,
    },
  },
];

// Combine all sample nodes
const sampleNodes = [
  ...sampleSlideNodes,
  ...sampleSectionHeaderNodes,
  ...sampleResourceNodes,
];

function PresentationCanvas() {
  return (
    <ReactFlow
      nodes={sampleNodes}
      edges={[]}
      nodeTypes={nodeTypes}
      fitView
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
