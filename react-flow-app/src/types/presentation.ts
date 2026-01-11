import type { Node, NodeProps } from "@xyflow/react";

// Track types for the two parallel tracks in the presentation
export type Track = "non-technical" | "technical" | "general";

// Section represents a major grouping of slides
export interface Section {
  id: string;
  title: string;
  track: Track;
}

// Slide content types
export type SlideType = "title" | "section-header" | "content" | "quote";

// Main slide content structure
export interface SlideContent {
  id: string;
  sectionId: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  bullets?: string[];
  quote?: string;
  level?: number; // For level-based slides (0-8)
  backgroundImage?: string; // Path to background image
}

// Resource types for linked resources
export type ResourceType = "article" | "tool" | "video" | "docs" | "github";

// Resource linked to a slide
export interface Resource {
  id: string;
  slideId: string;
  type: ResourceType;
  title: string;
  url: string;
}

// Node data interfaces for React Flow nodes

export interface SlideNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  isActive?: boolean;
}

export interface SectionHeaderNodeData {
  [key: string]: unknown;
  section: Section;
  isActive?: boolean;
}

export interface ResourceNodeData {
  [key: string]: unknown;
  resource: Resource;
  isActive?: boolean;
}

// React Flow node types with their data
export type SlideNode = Node<SlideNodeData, "slide">;
export type SectionHeaderNode = Node<SectionHeaderNodeData, "sectionHeader">;
export type ResourceNode = Node<ResourceNodeData, "resource">;

// Union type for all presentation nodes
export type PresentationNode = SlideNode | SectionHeaderNode | ResourceNode;

// Node props types for custom node components
export type SlideNodeProps = NodeProps<SlideNode>;
export type SectionHeaderNodeProps = NodeProps<SectionHeaderNode>;
export type ResourceNodeProps = NodeProps<ResourceNode>;

// Constants for node dimensions
// Slide dimensions optimized for 1376x768 images (16:9 aspect ratio)
// Image area: 520px wide × 290px tall (maintains aspect ratio)
// Content area: ~130px for title and bullets
export const NODE_DIMENSIONS = {
  slide: { width: 520, height: 420 },
  sectionHeader: { width: 400, height: 140 },
  resource: { width: 160, height: 90 },
} as const;

// Track colors for styling
export const TRACK_COLORS = {
  "non-technical": "#10b981", // emerald
  technical: "#3b82f6", // blue
  general: "#6b7280", // gray
} as const;
