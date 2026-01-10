import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import SectionHeaderNode from "./nodes/SectionHeaderNode";
import type {
  SlideNode as SlideNodeType,
  SectionHeaderNode as SectionHeaderNodeType,
} from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
  sectionHeader: SectionHeaderNode,
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

// Combine all sample nodes
const sampleNodes = [...sampleSlideNodes, ...sampleSectionHeaderNodes];

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
