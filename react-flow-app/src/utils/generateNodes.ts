import type {
  Section,
  SlideContent,
  Resource,
  SlideNode,
  SectionHeaderNode,
  ResourceNode,
  PresentationNode,
  NODE_DIMENSIONS,
} from "../types/presentation";

// Layout constants
const SECTION_HORIZONTAL_SPACING = 600;
const SLIDE_VERTICAL_SPACING = 220;
const RESOURCE_OFFSET = 160;

// Starting positions
const SECTION_START_X = 100;
const SECTION_START_Y = 100;
const SLIDE_OFFSET_Y = 180; // Offset from section header to first slide

/**
 * Generates React Flow nodes with clustered positioning for sections, slides, and resources.
 *
 * Layout:
 * - Section headers are positioned horizontally with 600px spacing
 * - Slides are positioned vertically within their section with 220px spacing
 * - Resource nodes are positioned 160px to the right of their parent slide
 */
export function generateNodes(
  sections: Section[],
  slides: SlideContent[],
  resources: Resource[],
): PresentationNode[] {
  const nodes: PresentationNode[] = [];

  // Group slides by section
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Group resources by slide
  const resourcesBySlide = new Map<string, Resource[]>();
  for (const resource of resources) {
    const slideResources = resourcesBySlide.get(resource.slideId) || [];
    slideResources.push(resource);
    resourcesBySlide.set(resource.slideId, slideResources);
  }

  // Track slide positions for resource placement
  const slidePositions = new Map<string, { x: number; y: number }>();

  // Generate section header nodes and their slides
  sections.forEach((section, sectionIndex) => {
    const sectionX =
      SECTION_START_X + sectionIndex * SECTION_HORIZONTAL_SPACING;
    const sectionY = SECTION_START_Y;

    // Add section header node
    const sectionNode: SectionHeaderNode = {
      id: `section-${section.id}`,
      type: "sectionHeader",
      position: { x: sectionX, y: sectionY },
      data: {
        section,
        isActive: false,
      },
    };
    nodes.push(sectionNode);

    // Get slides for this section
    const sectionSlides = slidesBySection.get(section.id) || [];

    // Generate slide nodes positioned vertically below section header
    sectionSlides.forEach((slide, slideIndex) => {
      const slideX = sectionX;
      const slideY =
        sectionY + SLIDE_OFFSET_Y + slideIndex * SLIDE_VERTICAL_SPACING;

      // Store slide position for resource placement
      slidePositions.set(slide.id, { x: slideX, y: slideY });

      const slideNode: SlideNode = {
        id: `slide-${slide.id}`,
        type: "slide",
        position: { x: slideX, y: slideY },
        data: {
          slide,
          section,
          isActive: false,
        },
      };
      nodes.push(slideNode);
    });
  });

  // Generate resource nodes positioned to the right of their parent slides
  for (const resource of resources) {
    const parentPosition = slidePositions.get(resource.slideId);
    if (!parentPosition) continue;

    // Get all resources for this slide to calculate vertical stacking
    const slideResources = resourcesBySlide.get(resource.slideId) || [];
    const resourceIndex = slideResources.indexOf(resource);

    const resourceX = parentPosition.x + 280 + RESOURCE_OFFSET; // 280 is slide width
    const resourceY = parentPosition.y + resourceIndex * 100; // Stack resources vertically

    const resourceNode: ResourceNode = {
      id: `resource-${resource.id}`,
      type: "resource",
      position: { x: resourceX, y: resourceY },
      data: {
        resource,
        isActive: false,
      },
    };
    nodes.push(resourceNode);
  }

  return nodes;
}

/**
 * Helper function to get the center position of a node for fitView calculations
 */
export function getNodeCenter(
  node: PresentationNode,
  dimensions: typeof NODE_DIMENSIONS,
): { x: number; y: number } {
  const nodeType = node.type as keyof typeof dimensions;
  const { width, height } = dimensions[nodeType];
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}
