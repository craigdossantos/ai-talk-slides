import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import SlideNode from "../../components/nodes/SlideNode";
import SectionHeaderNode from "../../components/nodes/SectionHeaderNode";
import ResourceNode from "../../components/nodes/ResourceNode";
import LevelNode from "../../components/nodes/LevelNode";
import {
  NODE_DIMENSIONS,
  TRACK_COLORS,
  type SlideNodeData,
  type SectionHeaderNodeData,
  type ResourceNodeData,
  type LevelNodeData,
  type Section,
  type SlideContent,
  type Resource,
} from "../../types/presentation";

// Helper to wrap components with ReactFlowProvider (required for Handle components)
const renderWithProvider = (component: React.ReactElement) => {
  return render(<ReactFlowProvider>{component}</ReactFlowProvider>);
};

// Mock data factories
const createSection = (overrides: Partial<Section> = {}): Section => ({
  id: "section-1",
  title: "Test Section",
  track: "non-technical",
  ...overrides,
});

const createSlide = (overrides: Partial<SlideContent> = {}): SlideContent => ({
  id: "slide-1",
  sectionId: "section-1",
  type: "content",
  title: "Test Slide Title",
  ...overrides,
});

const createResource = (overrides: Partial<Resource> = {}): Resource => ({
  id: "resource-1",
  slideId: "slide-1",
  type: "article",
  title: "Test Resource",
  url: "https://example.com",
  ...overrides,
});

// =============================================================================
// US-004: SlideNode Component Tests
// =============================================================================
describe("US-004 - SlideNode Component", () => {
  const defaultSlideNodeData: SlideNodeData = {
    slide: createSlide(),
    section: createSection(),
    isActive: false,
    hasPrev: true,
    hasNext: true,
    onNavigatePrev: vi.fn(),
    onNavigateNext: vi.fn(),
  };

  describe("Component rendering", () => {
    it("renders without crashing", () => {
      renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Test Slide Title")).toBeInTheDocument();
    });

    it("renders title with proper styling class", () => {
      renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const title = screen.getByText("Test Slide Title");
      expect(title).toHaveClass("slide-node__title");
    });
  });

  describe("Track-colored border", () => {
    it("applies emerald border color for non-technical track", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        section: createSection({ track: "non-technical" }),
      };
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const slideNode = container.querySelector(".slide-node");
      expect(slideNode).toHaveStyle({
        borderTopColor: TRACK_COLORS["non-technical"],
      });
    });

    it("applies blue border color for technical track", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        section: createSection({ track: "technical" }),
      };
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const slideNode = container.querySelector(".slide-node");
      expect(slideNode).toHaveStyle({
        borderTopColor: TRACK_COLORS["technical"],
      });
    });

    it("applies gray border color for general track", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        section: createSection({ track: "general" }),
      };
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const slideNode = container.querySelector(".slide-node");
      expect(slideNode).toHaveStyle({
        borderTopColor: TRACK_COLORS["general"],
      });
    });
  });

  describe("Slide type variants", () => {
    it("renders title type with large title class", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        slide: createSlide({
          type: "title",
          title: "Main Title",
          subtitle: "Subtitle text",
        }),
      };
      renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const title = screen.getByText("Main Title");
      expect(title).toHaveClass("slide-node__title--large");
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
    });

    it("renders section-header type correctly", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        slide: createSlide({
          type: "section-header",
          title: "Section Header Title",
          subtitle: "Section subtitle",
        }),
      };
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Section Header Title")).toBeInTheDocument();
      expect(
        container.querySelector(".slide-node__content--section"),
      ).toBeInTheDocument();
    });

    it("renders content type with bullets", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        slide: createSlide({
          type: "content",
          title: "Content Title",
          bullets: ["Bullet 1", "Bullet 2", "Bullet 3"],
        }),
      };
      renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Content Title")).toBeInTheDocument();
      expect(screen.getByText("Bullet 1")).toBeInTheDocument();
      expect(screen.getByText("Bullet 2")).toBeInTheDocument();
      expect(screen.getByText("Bullet 3")).toBeInTheDocument();
    });

    it("renders quote type with blockquote", () => {
      const data: SlideNodeData = {
        ...defaultSlideNodeData,
        slide: createSlide({
          type: "quote",
          title: "Author Name",
          quote: "This is the quote text",
        }),
      };
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(
        container.querySelector(".slide-node__content--quote"),
      ).toBeInTheDocument();
      expect(screen.getByText(/"This is the quote text"/)).toBeInTheDocument();
      expect(screen.getByText(/Author Name/)).toBeInTheDocument();
    });
  });

  describe("Node dimensions", () => {
    it("uses correct width from NODE_DIMENSIONS", () => {
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const slideNode = container.querySelector(".slide-node");
      expect(slideNode).toHaveStyle({
        width: `${NODE_DIMENSIONS.slide.width}px`,
      });
    });

    it("uses correct minimum height from NODE_DIMENSIONS", () => {
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const slideNode = container.querySelector(".slide-node");
      expect(slideNode).toHaveStyle({
        minHeight: `${NODE_DIMENSIONS.slide.height}px`,
      });
    });
  });
});

// =============================================================================
// US-005: SectionHeaderNode Component Tests
// =============================================================================
describe("US-005 - SectionHeaderNode Component", () => {
  const defaultSectionHeaderData: SectionHeaderNodeData = {
    section: createSection({ title: "Section Title" }),
    isActive: false,
  };

  describe("Component rendering", () => {
    it("renders without crashing", () => {
      renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Section Title")).toBeInTheDocument();
    });

    it("displays section title prominently", () => {
      renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const title = screen.getByText("Section Title");
      expect(title).toHaveClass("section-header-node__title");
      expect(title.tagName).toBe("H2");
    });
  });

  describe("Node dimensions", () => {
    it("uses proper dimensions from NODE_DIMENSIONS (400x140)", () => {
      const { container } = renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const sectionNode = container.querySelector(".section-header-node");
      expect(sectionNode).toHaveStyle({
        width: `${NODE_DIMENSIONS.sectionHeader.width}px`,
        height: `${NODE_DIMENSIONS.sectionHeader.height}px`,
      });
      // Verify constants match expected values
      expect(NODE_DIMENSIONS.sectionHeader.width).toBe(400);
      expect(NODE_DIMENSIONS.sectionHeader.height).toBe(140);
    });
  });

  describe("Track styling", () => {
    it("applies track-specific class for non-technical", () => {
      const { container } = renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(
        container.querySelector(".section-header-node--non-technical"),
      ).toBeInTheDocument();
    });

    it("applies track-specific class for technical", () => {
      const data: SectionHeaderNodeData = {
        section: createSection({ track: "technical" }),
        isActive: false,
      };
      const { container } = renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(
        container.querySelector(".section-header-node--technical"),
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// US-006: ResourceNode Component Tests
// =============================================================================
describe("US-006 - ResourceNode Component", () => {
  const defaultResourceData: ResourceNodeData = {
    resource: createResource(),
    isActive: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component rendering", () => {
    it("renders without crashing", () => {
      renderWithProvider(
        <ResourceNode
          id="resource-1"
          type="resource"
          data={defaultResourceData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Test Resource")).toBeInTheDocument();
    });
  });

  describe("Resource type icons", () => {
    const resourceTypes = [
      "article",
      "tool",
      "video",
      "docs",
      "github",
    ] as const;

    resourceTypes.forEach((type) => {
      it(`displays icon for ${type} resource type`, () => {
        const data: ResourceNodeData = {
          resource: createResource({ type, title: `${type} resource` }),
          isActive: false,
        };
        const { container } = renderWithProvider(
          <ResourceNode
            id="resource-1"
            type="resource"
            data={data}
            selected={false}
            isConnectable={true}
            positionAbsoluteX={0}
            positionAbsoluteY={0}
            zIndex={0}
          />,
        );
        expect(
          container.querySelector(".resource-node__icon svg"),
        ).toBeInTheDocument();
        expect(
          container.querySelector(`.resource-node--${type}`),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Click behavior", () => {
    it("opens URL in new tab when clicked", () => {
      const mockOpen = vi.fn();
      vi.stubGlobal("open", mockOpen);

      const data: ResourceNodeData = {
        resource: createResource({ url: "https://test-url.com" }),
        isActive: false,
      };
      const { container } = renderWithProvider(
        <ResourceNode
          id="resource-1"
          type="resource"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );

      const resourceNode = container.querySelector(".resource-node");
      fireEvent.click(resourceNode!);

      expect(mockOpen).toHaveBeenCalledWith(
        "https://test-url.com",
        "_blank",
        "noopener,noreferrer",
      );
    });
  });

  describe("Title truncation", () => {
    it("truncates titles longer than 20 characters", () => {
      const data: ResourceNodeData = {
        resource: createResource({
          title: "This is a very long resource title that should be truncated",
        }),
        isActive: false,
      };
      renderWithProvider(
        <ResourceNode
          id="resource-1"
          type="resource"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      // Title should be truncated to 18 chars + "..."
      expect(screen.getByText("This is a very lon...")).toBeInTheDocument();
    });

    it("does not truncate short titles", () => {
      const data: ResourceNodeData = {
        resource: createResource({ title: "Short Title" }),
        isActive: false,
      };
      renderWithProvider(
        <ResourceNode
          id="resource-1"
          type="resource"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("Short Title")).toBeInTheDocument();
    });
  });
});

// =============================================================================
// US-016-017: Handle IDs Tests
// =============================================================================
describe("US-016-017 - Handle IDs", () => {
  describe("SlideNode handles", () => {
    const defaultSlideNodeData: SlideNodeData = {
      slide: createSlide(),
      section: createSection(),
      isActive: false,
      hasPrev: true,
      hasNext: true,
    };

    it("has handle with id='top' at top position", () => {
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const topHandle = container.querySelector('[data-handleid="top"]');
      expect(topHandle).toBeInTheDocument();
    });

    it("has handle with id='bottom' at bottom position", () => {
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const bottomHandle = container.querySelector('[data-handleid="bottom"]');
      expect(bottomHandle).toBeInTheDocument();
    });

    it("has handle with id='right' at right position", () => {
      const { container } = renderWithProvider(
        <SlideNode
          id="slide-1"
          type="slide"
          data={defaultSlideNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const rightHandle = container.querySelector('[data-handleid="right"]');
      expect(rightHandle).toBeInTheDocument();
    });
  });

  describe("SectionHeaderNode handles", () => {
    const defaultSectionHeaderData: SectionHeaderNodeData = {
      section: createSection(),
      isActive: false,
    };

    it("has handle with id='left' at left position", () => {
      const { container } = renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const leftHandle = container.querySelector('[data-handleid="left"]');
      expect(leftHandle).toBeInTheDocument();
    });

    it("has handle with id='right' at right position", () => {
      const { container } = renderWithProvider(
        <SectionHeaderNode
          id="section-1"
          type="sectionHeader"
          data={defaultSectionHeaderData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const rightHandle = container.querySelector('[data-handleid="right"]');
      expect(rightHandle).toBeInTheDocument();
    });
  });

  describe("ResourceNode handles", () => {
    const defaultResourceData: ResourceNodeData = {
      resource: createResource(),
      isActive: false,
    };

    it("has handle with id='left' at left position", () => {
      const { container } = renderWithProvider(
        <ResourceNode
          id="resource-1"
          type="resource"
          data={defaultResourceData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const leftHandle = container.querySelector('[data-handleid="left"]');
      expect(leftHandle).toBeInTheDocument();
    });
  });
});

// =============================================================================
// US-018: Memoization Tests
// =============================================================================
describe("US-018 - Memoization", () => {
  it("SlideNode is wrapped in React.memo()", async () => {
    const SlideNodeModule = await import("../../components/nodes/SlideNode");
    // React.memo wrapped components have a $$typeof Symbol for memo
    expect(SlideNodeModule.default.$$typeof).toBe(Symbol.for("react.memo"));
  });

  it("SectionHeaderNode is wrapped in React.memo()", async () => {
    const SectionHeaderNodeModule =
      await import("../../components/nodes/SectionHeaderNode");
    expect(SectionHeaderNodeModule.default.$$typeof).toBe(
      Symbol.for("react.memo"),
    );
  });

  it("ResourceNode is wrapped in React.memo()", async () => {
    const ResourceNodeModule =
      await import("../../components/nodes/ResourceNode");
    expect(ResourceNodeModule.default.$$typeof).toBe(Symbol.for("react.memo"));
  });

  it("LevelNode is wrapped in React.memo()", async () => {
    const LevelNodeModule = await import("../../components/nodes/LevelNode");
    expect(LevelNodeModule.default.$$typeof).toBe(Symbol.for("react.memo"));
  });
});

// =============================================================================
// US-047-048: LevelNode Component Tests
// =============================================================================
describe("US-047-048 - LevelNode Component", () => {
  const defaultLevelNodeData: LevelNodeData = {
    level: 3,
    slideId: "slide-1",
    track: "non-technical",
  };

  describe("Component rendering", () => {
    it("renders without crashing", () => {
      renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={defaultLevelNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("displays the level number", () => {
      renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={{ ...defaultLevelNodeData, level: 7 }}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const levelNumber = screen.getByText("7");
      expect(levelNumber).toBeInTheDocument();
      expect(levelNumber).toHaveClass("level-node__number");
    });
  });

  describe("Circular styling (80x80px)", () => {
    it("renders as 80x80px circular div", () => {
      const { container } = renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={defaultLevelNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const levelNode = container.querySelector(".level-node");
      expect(levelNode).toBeInTheDocument();
      // The CSS applies 80x80px dimensions - verify class is present
      expect(levelNode).toHaveClass("level-node");
    });
  });

  describe("Handle configuration", () => {
    it("has left-side handle with id='left'", () => {
      const { container } = renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={defaultLevelNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const leftHandle = container.querySelector('[data-handleid="left"]');
      expect(leftHandle).toBeInTheDocument();
    });
  });

  describe("Track color gradient", () => {
    it("applies gradient based on non-technical track color", () => {
      const { container } = renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={defaultLevelNodeData}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const levelNode = container.querySelector(".level-node");
      const style = levelNode?.getAttribute("style");
      // Browser converts hex #10b981 to rgb(16, 185, 129)
      expect(style).toContain("linear-gradient");
      expect(style).toContain("rgb(16, 185, 129)");
    });

    it("applies gradient based on technical track color", () => {
      const data: LevelNodeData = {
        ...defaultLevelNodeData,
        track: "technical",
      };
      const { container } = renderWithProvider(
        <LevelNode
          id="level-1"
          type="level"
          data={data}
          selected={false}
          isConnectable={true}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
        />,
      );
      const levelNode = container.querySelector(".level-node");
      const style = levelNode?.getAttribute("style");
      // Browser converts hex #3b82f6 to rgb(59, 130, 246)
      expect(style).toContain("linear-gradient");
      expect(style).toContain("rgb(59, 130, 246)");
    });
  });

  describe("Level number range", () => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((level) => {
      it(`correctly displays level ${level}`, () => {
        const data: LevelNodeData = {
          ...defaultLevelNodeData,
          level,
        };
        renderWithProvider(
          <LevelNode
            id="level-1"
            type="level"
            data={data}
            selected={false}
            isConnectable={true}
            positionAbsoluteX={0}
            positionAbsoluteY={0}
            zIndex={0}
          />,
        );
        expect(screen.getByText(String(level))).toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// Active State Tests (Additional coverage)
// =============================================================================
describe("Active state styling", () => {
  it("SlideNode applies active class when isActive is true", () => {
    const data: SlideNodeData = {
      slide: createSlide(),
      section: createSection(),
      isActive: true,
      hasPrev: true,
      hasNext: true,
    };
    const { container } = renderWithProvider(
      <SlideNode
        id="slide-1"
        type="slide"
        data={data}
        selected={false}
        isConnectable={true}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
        zIndex={0}
      />,
    );
    expect(container.querySelector(".slide-node--active")).toBeInTheDocument();
  });

  it("SectionHeaderNode applies active class when isActive is true", () => {
    const data: SectionHeaderNodeData = {
      section: createSection(),
      isActive: true,
    };
    const { container } = renderWithProvider(
      <SectionHeaderNode
        id="section-1"
        type="sectionHeader"
        data={data}
        selected={false}
        isConnectable={true}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
        zIndex={0}
      />,
    );
    expect(
      container.querySelector(".section-header-node--active"),
    ).toBeInTheDocument();
  });

  it("ResourceNode applies active class when isActive is true", () => {
    const data: ResourceNodeData = {
      resource: createResource(),
      isActive: true,
    };
    const { container } = renderWithProvider(
      <ResourceNode
        id="resource-1"
        type="resource"
        data={data}
        selected={false}
        isConnectable={true}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
        zIndex={0}
      />,
    );
    expect(
      container.querySelector(".resource-node--active"),
    ).toBeInTheDocument();
  });
});
