import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import SlideNode from "./nodes/SlideNode";
import type { SlideNode as SlideNodeType } from "../types/presentation";

// Register custom node types
const nodeTypes = {
  slide: SlideNode,
};

// Sample data for testing the SlideNode component
const sampleNodes: SlideNodeType[] = [
  {
    id: "slide-1",
    type: "slide",
    position: { x: 0, y: 0 },
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
    position: { x: 320, y: 0 },
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
    position: { x: 640, y: 0 },
    data: {
      slide: {
        id: "slide-3",
        sectionId: "section-2",
        type: "quote",
        title: "Someone Famous",
        quote: "The best way to predict the future is to invent it.",
      },
      section: {
        id: "section-2",
        title: "Quotes",
        track: "technical",
      },
      isActive: false,
    },
  },
  {
    id: "slide-4",
    type: "slide",
    position: { x: 0, y: 220 },
    data: {
      slide: {
        id: "slide-4",
        sectionId: "section-2",
        type: "section-header",
        title: "The Technical Track",
        subtitle: "From chatting to building",
      },
      section: {
        id: "section-2",
        title: "Technical",
        track: "technical",
      },
      isActive: false,
    },
  },
  {
    id: "slide-5",
    type: "slide",
    position: { x: 320, y: 220 },
    data: {
      slide: {
        id: "slide-5",
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
        title: "Technical",
        track: "technical",
      },
      isActive: false,
    },
  },
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
