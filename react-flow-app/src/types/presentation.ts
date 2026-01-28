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

// Subnode content for expandable child nodes
export interface SubnodeContent {
  id: string;
  parentSlideId: string;
  type: "resource" | "slide" | "note";
  title: string;
  url?: string; // For resource type
  content?: string; // For note type
  image?: string; // Optional thumbnail image
}

// Main slide content structure
export interface SlideContent {
  id: string;
  sectionId: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  bullets?: string[];
  quote?: string;
  backgroundImage?: string; // Path to background image
  subnodes?: SubnodeContent[]; // Expandable child nodes
}

// Resource types for linked resources
export type ResourceType =
  | "article"
  | "tool"
  | "video"
  | "docs"
  | "github"
  | "prompt";

// Resource linked to a slide
export interface Resource {
  id: string;
  slideId: string;
  type: ResourceType;
  title: string;
  url: string;
  image?: string; // Custom image URL or path for thumbnail display
  featured?: boolean; // Show as icon branching from metro stop
  prompt?: string; // For prompt type resources - the actual prompt text
  description?: string; // Why this resource is interesting/useful
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

export interface LevelNodeData {
  [key: string]: unknown;
  level: number;
  track: Track;
}

export interface PaperBackgroundNodeData {
  [key: string]: unknown;
  width: number;
  height: number;
}

// Handle configuration for junction nodes with parallel lines
export interface JunctionHandle {
  handleId: string; // e.g., "right-0", "right-1"
  position: "left" | "right" | "top" | "bottom";
  offset: number; // Y-offset in pixels from center (negative = up, positive = down)
  lineColor: string;
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
  junctionHandles?: JunctionHandle[]; // Handles for parallel lines at junctions
  // Navigation callbacks for full slide view
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  // Click-to-expand full slide view
  isFullSlideOpen?: boolean;
  onCloseFullSlide?: () => void;
  // True when any slide has full view open (for constraining other thumbnails)
  isAnySlideOpen?: boolean;
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

export interface SubnodeNodeData {
  [key: string]: unknown;
  subnode: SubnodeContent;
  parentNodeId: string;
  lineColor: string;
  arcIndex: number; // Position in arc (0, 1, 2...) for positioning
  totalSubnodes: number; // Total subnodes for this parent
  isExpanded: boolean; // Whether parent is expanded
}

export interface LandmarkNodeData {
  [key: string]: unknown;
  image?: string; // Optional - for PNG landmarks
  svgType?: "water" | "landmass"; // For inline SVG landmarks
  label: string;
  scale?: number; // Persisted scale factor
}

export interface RiverWaypointNodeData {
  [key: string]: unknown;
  waypointIndex: number;
}

// React Flow node types with their data
export type SlideNode = Node<SlideNodeData, "slide">;
export type SectionHeaderNode = Node<SectionHeaderNodeData, "sectionHeader">;
export type ResourceNode = Node<ResourceNodeData, "resource">;
export type PaperBackgroundNode = Node<
  PaperBackgroundNodeData,
  "paperBackground"
>;
export type MetroStopNode = Node<MetroStopNodeData, "metroStop">;
export type MetroBackgroundNode = Node<
  MetroBackgroundNodeData,
  "metroBackground"
>;
export type ResourceIconNode = Node<ResourceIconNodeData, "resourceIcon">;
export type SubnodeNode = Node<SubnodeNodeData, "subnode">;
export type LandmarkNode = Node<LandmarkNodeData, "landmark">;
export type RiverWaypointNode = Node<RiverWaypointNodeData, "riverWaypoint">;

// Union type for all presentation nodes
export type PresentationNode =
  | SlideNode
  | SectionHeaderNode
  | ResourceNode
  | PaperBackgroundNode
  | MetroStopNode
  | MetroBackgroundNode
  | ResourceIconNode
  | SubnodeNode
  | LandmarkNode
  | RiverWaypointNode;

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
  closing: "#a855f7", // purple - Closing
  projects: "#ec4899", // magenta - The Project Path
} as const;

// Metro layout constants
export const METRO_LAYOUT = {
  stopSpacing: 280, // expanded to fit slide images above stops
  lineThickness: 16, // thicker metro lines like reference
  verticalOffset: 350, // expanded for slide images + vertical spacing
} as const;
