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
export type SlideType =
  | "title"
  | "section-header"
  | "content"
  | "quote"
  | "image";

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
  image?: string; // Custom image URL or path for thumbnail display
  featured?: boolean; // Show as icon branching from metro stop
}

// Node data interfaces for React Flow nodes

export interface SlideNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  isActive?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
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

export interface PaperBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

export interface LevelNodeData {
  [key: string]: unknown;
  level: number;
  slideId: string;
  track: Track;
}

export interface MetroStopNodeData {
  [key: string]: unknown;
  slide: SlideContent;
  section: Section;
  lineColor: string;
  resources?: Resource[];
  isActive?: boolean;
  isHovered?: boolean;
  isJunction?: boolean; // Node where multiple lines converge
  junctionColors?: string[]; // Colors of converging lines
  // Navigation callbacks for full slide view
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export interface MetroBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

export interface ResourceIconNodeData {
  [key: string]: unknown;
  resource: Resource;
}

// React Flow node types with their data
export type SlideNode = Node<SlideNodeData, "slide">;
export type SectionHeaderNode = Node<SectionHeaderNodeData, "sectionHeader">;
export type ResourceNode = Node<ResourceNodeData, "resource">;
export type PaperBackgroundNode = Node<
  PaperBackgroundNodeData,
  "paperBackground"
>;
export type LevelNode = Node<LevelNodeData, "level">;
export type MetroStopNode = Node<MetroStopNodeData, "metroStop">;
export type MetroBackgroundNode = Node<
  MetroBackgroundNodeData,
  "metroBackground"
>;
export type ResourceIconNode = Node<ResourceIconNodeData, "resourceIcon">;

// Union type for all presentation nodes
export type PresentationNode =
  | SlideNode
  | SectionHeaderNode
  | ResourceNode
  | PaperBackgroundNode
  | LevelNode
  | MetroStopNode
  | MetroBackgroundNode
  | ResourceIconNode;

// Node props types for custom node components
export type SlideNodeProps = NodeProps<SlideNode>;
export type SectionHeaderNodeProps = NodeProps<SectionHeaderNode>;
export type ResourceNodeProps = NodeProps<ResourceNode>;
export type MetroStopNodeProps = NodeProps<MetroStopNode>;

// Constants for node dimensions
// Slide dimensions optimized for 1376x768 images (16:9 aspect ratio)
// Image area: 520px wide × 290px tall (maintains aspect ratio)
// Content area: ~130px for title and bullets
export const NODE_DIMENSIONS = {
  slide: { width: 520, height: 420 },
  sectionHeader: { width: 400, height: 140 },
  resource: { width: 180, height: 120 }, // Increased for thumbnail images
  paperBackground: { width: 0, height: 0 }, // Dynamic sizing
} as const;

// Track colors for styling
export const TRACK_COLORS = {
  "non-technical": "#10b981", // emerald
  technical: "#3b82f6", // blue
  general: "#6b7280", // gray
} as const;

// Metro line colors matching the reference design
export const METRO_LINE_COLORS = {
  intro: "#dc2626", // red - The Widening Gulf (Introduction)
  understanding: "#eab308", // yellow - Understanding AI
  mapping: "#22c55e", // green - Mapping the Journey
  "levels-nontech": "#3b82f6", // blue - Non-Technical Track
  "levels-tech": "#f97316", // orange - Technical Track
  projects: "#d946ef", // magenta/fuchsia - Projects showcase
  closing: "#a855f7", // purple - Closing
} as const;

// Metro layout constants
export const METRO_LAYOUT = {
  stopSpacing: 280, // expanded to fit slide images above stops
  lineThickness: 16, // thicker metro lines like reference
  verticalOffset: 350, // expanded for slide images + vertical spacing
} as const;
