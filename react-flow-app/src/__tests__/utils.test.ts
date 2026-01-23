import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateNodes, getNodeCenter } from "../utils/generateNodes";
import { generateEdges } from "../utils/generateEdges";
import {
  loadPersistedPositions,
  savePersistedPositions,
  clearPersistedPositions,
} from "../utils/persistence";
import type { Section, SlideContent, Resource } from "../types/presentation";
import { NODE_DIMENSIONS } from "../types/presentation";

// Test data factories
const createSection = (overrides: Partial<Section> = {}): Section => ({
  id: "section-1",
  title: "Test Section",
  track: "general",
  ...overrides,
});

const createSlide = (overrides: Partial<SlideContent> = {}): SlideContent => ({
  id: "slide-1",
  sectionId: "section-1",
  type: "content",
  title: "Test Slide",
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

// ============================================================================
// US-007 - generateNodes() Tests
// ============================================================================
describe("US-007 - generateNodes()", () => {
  describe("basic functionality", () => {
    it("returns an array of React Flow Node objects", () => {
      const sections = [createSection()];
      const slides = [createSlide()];
      const resources: Resource[] = [];

      const nodes = generateNodes(sections, slides, resources);

      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
      // Each node should have required React Flow properties
      nodes.forEach((node) => {
        expect(node).toHaveProperty("id");
        expect(node).toHaveProperty("type");
        expect(node).toHaveProperty("position");
        expect(node).toHaveProperty("data");
        expect(node.position).toHaveProperty("x");
        expect(node.position).toHaveProperty("y");
      });
    });

    it("returns empty array when given empty inputs", () => {
      const nodes = generateNodes([], [], []);
      expect(nodes).toEqual([]);
    });
  });

  describe("section header positioning", () => {
    const SECTION_HORIZONTAL_SPACING = 800;
    const SECTION_START_X = 100;
    const SECTION_START_Y = 100;

    it("positions section headers with 800px horizontal spacing", () => {
      const sections = [
        createSection({ id: "section-1" }),
        createSection({ id: "section-2" }),
        createSection({ id: "section-3" }),
      ];
      const slides: SlideContent[] = [];
      const resources: Resource[] = [];

      const nodes = generateNodes(sections, slides, resources);
      const sectionNodes = nodes.filter((n) => n.type === "sectionHeader");

      expect(sectionNodes).toHaveLength(3);
      expect(sectionNodes[0].position.x).toBe(SECTION_START_X);
      expect(sectionNodes[1].position.x).toBe(
        SECTION_START_X + SECTION_HORIZONTAL_SPACING,
      );
      expect(sectionNodes[2].position.x).toBe(
        SECTION_START_X + 2 * SECTION_HORIZONTAL_SPACING,
      );
    });

    it("positions all section headers at the same Y coordinate", () => {
      const sections = [
        createSection({ id: "section-1" }),
        createSection({ id: "section-2" }),
      ];

      const nodes = generateNodes(sections, [], []);
      const sectionNodes = nodes.filter((n) => n.type === "sectionHeader");

      sectionNodes.forEach((node) => {
        expect(node.position.y).toBe(SECTION_START_Y);
      });
    });
  });

  describe("slide positioning", () => {
    const SLIDE_VERTICAL_SPACING = 450;
    const SECTION_START_Y = 100;
    const SLIDE_OFFSET_Y = 180;

    it("positions slides vertically with 450px spacing", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1" }),
        createSlide({ id: "slide-2", sectionId: "section-1" }),
        createSlide({ id: "slide-3", sectionId: "section-1" }),
      ];

      const nodes = generateNodes(sections, slides, []);
      const slideNodes = nodes.filter((n) => n.type === "slide");

      expect(slideNodes).toHaveLength(3);

      const baseY = SECTION_START_Y + SLIDE_OFFSET_Y;
      expect(slideNodes[0].position.y).toBe(baseY);
      expect(slideNodes[1].position.y).toBe(baseY + SLIDE_VERTICAL_SPACING);
      expect(slideNodes[2].position.y).toBe(baseY + 2 * SLIDE_VERTICAL_SPACING);
    });

    it("positions slides at the same X as their parent section", () => {
      const SECTION_START_X = 100;
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1" }),
        createSlide({ id: "slide-2", sectionId: "section-1" }),
      ];

      const nodes = generateNodes(sections, slides, []);
      const sectionNode = nodes.find((n) => n.type === "sectionHeader");
      const slideNodes = nodes.filter((n) => n.type === "slide");

      slideNodes.forEach((slideNode) => {
        expect(slideNode.position.x).toBe(sectionNode!.position.x);
      });
    });
  });

  describe("resource node positioning", () => {
    const RESOURCE_OFFSET = 160;
    const SLIDE_WIDTH = 520;

    it("positions resource nodes 160px offset from parent slide (plus slide width)", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [createSlide({ id: "slide-1", sectionId: "section-1" })];
      const resources = [
        createResource({ id: "resource-1", slideId: "slide-1" }),
      ];

      const nodes = generateNodes(sections, slides, resources);
      const slideNode = nodes.find((n) => n.id === "slide-slide-1");
      const resourceNode = nodes.find((n) => n.id === "resource-resource-1");

      expect(resourceNode).toBeDefined();
      expect(resourceNode!.position.x).toBe(
        slideNode!.position.x + SLIDE_WIDTH + RESOURCE_OFFSET,
      );
    });

    it("stacks multiple resources vertically", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [createSlide({ id: "slide-1", sectionId: "section-1" })];
      const resources = [
        createResource({ id: "resource-1", slideId: "slide-1" }),
        createResource({ id: "resource-2", slideId: "slide-1" }),
      ];

      const nodes = generateNodes(sections, slides, resources);
      const resourceNodes = nodes.filter((n) => n.type === "resource");

      expect(resourceNodes).toHaveLength(2);
      expect(resourceNodes[1].position.y).toBe(
        resourceNodes[0].position.y + 100,
      );
    });
  });

  // US-049 - LevelNode feature was intentionally removed (see commit 1e4bb76)
  // "Removed numbered level nodes (0-8 badges)"
  describe.skip("US-049 - LevelNode creation (feature removed)", () => {
    it("creates LevelNode for slides with level property", () => {
      const sections = [createSection({ id: "section-1", track: "technical" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1", level: 3 }),
      ];

      const nodes = generateNodes(sections, slides, []);
      const levelNode = nodes.find((n) => n.type === "level");

      expect(levelNode).toBeDefined();
      expect(levelNode!.id).toBe("level-slide-1");
      expect(levelNode!.data.level).toBe(3);
      expect(levelNode!.data.slideId).toBe("slide-1");
      expect(levelNode!.data.track).toBe("technical");
    });

    it("does not create LevelNode for slides without level property", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({
          id: "slide-1",
          sectionId: "section-1",
          level: undefined,
        }),
      ];

      const nodes = generateNodes(sections, slides, []);
      const levelNodes = nodes.filter((n) => n.type === "level");

      expect(levelNodes).toHaveLength(0);
    });

    it("positions level nodes 450px right and 20px above slide", () => {
      const LEVEL_NODE_X_OFFSET = 450;
      const LEVEL_NODE_Y_OFFSET = -20;

      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1", level: 5 }),
      ];

      const nodes = generateNodes(sections, slides, []);
      const slideNode = nodes.find((n) => n.id === "slide-slide-1");
      const levelNode = nodes.find((n) => n.type === "level");

      expect(levelNode).toBeDefined();
      expect(levelNode!.position.x).toBe(
        slideNode!.position.x + LEVEL_NODE_X_OFFSET,
      );
      expect(levelNode!.position.y).toBe(
        slideNode!.position.y + LEVEL_NODE_Y_OFFSET,
      );
    });
  });

  describe("getNodeCenter helper", () => {
    it("calculates center position correctly for slide nodes", () => {
      const sections = [createSection()];
      const slides = [createSlide()];
      const nodes = generateNodes(sections, slides, []);
      const slideNode = nodes.find((n) => n.type === "slide");

      const center = getNodeCenter(slideNode!, NODE_DIMENSIONS);

      expect(center.x).toBe(
        slideNode!.position.x + NODE_DIMENSIONS.slide.width / 2,
      );
      expect(center.y).toBe(
        slideNode!.position.y + NODE_DIMENSIONS.slide.height / 2,
      );
    });
  });
});

// ============================================================================
// US-008 - generateEdges() Tests
// ============================================================================
describe("US-008 - generateEdges()", () => {
  describe("basic functionality", () => {
    it("returns an array of React Flow Edge objects", () => {
      const sections = [createSection()];
      const slides = [createSlide()];
      const resources: Resource[] = [];

      const edges = generateEdges(sections, slides, resources);

      expect(Array.isArray(edges)).toBe(true);
      edges.forEach((edge) => {
        expect(edge).toHaveProperty("id");
        expect(edge).toHaveProperty("source");
        expect(edge).toHaveProperty("target");
      });
    });

    it("returns empty array when given empty inputs", () => {
      const edges = generateEdges([], [], []);
      expect(edges).toEqual([]);
    });
  });

  describe("section-to-section edges", () => {
    it("uses indigo color #4f46e5 for section-to-section edges", () => {
      const sections = [
        createSection({ id: "section-1" }),
        createSection({ id: "section-2" }),
      ];

      const edges = generateEdges(sections, [], []);
      const sectionEdge = edges.find((e) =>
        e.id.includes("edge-section-section-1-to-section-2"),
      );

      expect(sectionEdge).toBeDefined();
      expect(sectionEdge!.style?.stroke).toBe("#4f46e5");
    });

    it("creates edges between consecutive sections", () => {
      const sections = [
        createSection({ id: "section-1" }),
        createSection({ id: "section-2" }),
        createSection({ id: "section-3" }),
      ];

      const edges = generateEdges(sections, [], []);
      const sectionEdges = edges.filter((e) =>
        e.id.startsWith("edge-section-section"),
      );

      expect(sectionEdges).toHaveLength(2);
    });
  });

  describe("slide-to-slide edges", () => {
    it("uses gray/slate color for slide-to-slide edges", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1" }),
        createSlide({ id: "slide-2", sectionId: "section-1" }),
      ];

      const edges = generateEdges(sections, slides, []);
      const slideEdge = edges.find((e) =>
        e.id.includes("edge-slide-slide-1-to-slide-2"),
      );

      expect(slideEdge).toBeDefined();
      // Slate-800 color
      expect(slideEdge!.style?.stroke).toBe("#1e293b");
    });

    it("connects section header to first slide", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [createSlide({ id: "slide-1", sectionId: "section-1" })];

      const edges = generateEdges(sections, slides, []);
      const sectionToSlideEdge = edges.find(
        (e) => e.source === "section-section-1" && e.target === "slide-slide-1",
      );

      expect(sectionToSlideEdge).toBeDefined();
    });

    it("connects consecutive slides within a section", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1" }),
        createSlide({ id: "slide-2", sectionId: "section-1" }),
        createSlide({ id: "slide-3", sectionId: "section-1" }),
      ];

      const edges = generateEdges(sections, slides, []);

      const edge1to2 = edges.find(
        (e) => e.source === "slide-slide-1" && e.target === "slide-slide-2",
      );
      const edge2to3 = edges.find(
        (e) => e.source === "slide-slide-2" && e.target === "slide-slide-3",
      );

      expect(edge1to2).toBeDefined();
      expect(edge2to3).toBeDefined();
    });
  });

  describe("slide-to-resource edges", () => {
    it("uses dashed stroke for slide-to-resource edges", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [createSlide({ id: "slide-1", sectionId: "section-1" })];
      const resources = [
        createResource({ id: "resource-1", slideId: "slide-1" }),
      ];

      const edges = generateEdges(sections, slides, resources);
      const resourceEdge = edges.find((e) =>
        e.id.includes("resource-resource-1"),
      );

      expect(resourceEdge).toBeDefined();
      expect(resourceEdge!.style?.strokeDasharray).toBe("6,4");
    });

    it("connects slide to its resources", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [createSlide({ id: "slide-1", sectionId: "section-1" })];
      const resources = [
        createResource({ id: "resource-1", slideId: "slide-1" }),
        createResource({ id: "resource-2", slideId: "slide-1" }),
      ];

      const edges = generateEdges(sections, slides, resources);
      const resourceEdges = edges.filter((e) => e.id.includes("resource"));

      expect(resourceEdges).toHaveLength(2);
      resourceEdges.forEach((edge) => {
        expect(edge.source).toBe("slide-slide-1");
      });
    });
  });

  // US-050 - LevelNode edges feature was intentionally removed (see commit 1e4bb76)
  // "Removed numbered level nodes (0-8 badges)"
  describe.skip("US-050 - slide-to-level edges (feature removed)", () => {
    it("uses 1.5px dashed gray stroke for slide-to-level edges", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1", level: 3 }),
      ];

      const edges = generateEdges(sections, slides, []);
      const levelEdge = edges.find((e) => e.id.includes("to-level"));

      expect(levelEdge).toBeDefined();
      expect(levelEdge!.style?.strokeWidth).toBe(1.5);
      expect(levelEdge!.style?.strokeDasharray).toBe("5,5");
      expect(levelEdge!.style?.stroke).toBe("#9ca3af"); // gray-400
    });

    it("creates level edges only for slides with level property", () => {
      const sections = [createSection({ id: "section-1" })];
      const slides = [
        createSlide({ id: "slide-1", sectionId: "section-1", level: 3 }),
        createSlide({ id: "slide-2", sectionId: "section-1" }), // no level
      ];

      const edges = generateEdges(sections, slides, []);
      const levelEdges = edges.filter((e) => e.id.includes("to-level"));

      expect(levelEdges).toHaveLength(1);
      expect(levelEdges[0].source).toBe("slide-slide-1");
      expect(levelEdges[0].target).toBe("level-slide-1");
    });
  });
});

// ============================================================================
// US-038 - Persistence utility Tests
// ============================================================================
describe("US-038 - Persistence utility", () => {
  const STORAGE_KEY = "presentation-node-positions";

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("loadPersistedPositions()", () => {
    it("returns positions when valid data exists", () => {
      const positions = {
        "node-1": { x: 100, y: 200 },
        "node-2": { x: 300, y: 400 },
      };
      const data = {
        version: 1,
        timestamp: Date.now(),
        positions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      const result = loadPersistedPositions();

      expect(result).toEqual(positions);
    });

    it("returns null when no data exists", () => {
      const result = loadPersistedPositions();
      expect(result).toBeNull();
    });

    it("returns null when data is invalid (missing positions)", () => {
      const data = { version: 1, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      const result = loadPersistedPositions();

      expect(result).toBeNull();
    });

    it("handles JSON parse errors gracefully and returns null", () => {
      localStorage.setItem(STORAGE_KEY, "invalid json {{{");

      // Mock console.warn to verify error handling
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = loadPersistedPositions();

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe("savePersistedPositions()", () => {
    it("saves positions with version and timestamp", () => {
      const positions = {
        "node-1": { x: 100, y: 200 },
      };
      const beforeSave = Date.now();

      savePersistedPositions(positions);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.version).toBe(1);
      expect(stored.timestamp).toBeGreaterThanOrEqual(beforeSave);
      expect(stored.positions).toEqual(positions);
    });

    it("overwrites previous data on save", () => {
      const positions1 = { "node-1": { x: 100, y: 200 } };
      const positions2 = { "node-2": { x: 300, y: 400 } };

      savePersistedPositions(positions1);
      savePersistedPositions(positions2);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.positions).toEqual(positions2);
      expect(stored.positions["node-1"]).toBeUndefined();
    });
  });

  describe("clearPersistedPositions()", () => {
    it("clears localStorage data", () => {
      const positions = { "node-1": { x: 100, y: 200 } };
      savePersistedPositions(positions);

      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearPersistedPositions();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("handles clearing when no data exists without error", () => {
      expect(() => clearPersistedPositions()).not.toThrow();
    });
  });

  describe("storage key", () => {
    it("uses key 'presentation-node-positions'", () => {
      const positions = { "node-1": { x: 100, y: 200 } };

      savePersistedPositions(positions);

      expect(
        localStorage.getItem("presentation-node-positions"),
      ).not.toBeNull();
      expect(localStorage.getItem("other-key")).toBeNull();
    });
  });
});
