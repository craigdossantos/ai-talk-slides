import { describe, it, expect } from "vitest";
import { sections, slides, resources } from "../data/slides";
import {
  NODE_DIMENSIONS,
  TRACK_COLORS,
  type LevelNodeData,
  type ResourceType,
  type Track,
} from "../types/presentation";

/**
 * US-013 - Slide content migration
 * Tests that verify the core data structures for sections, slides, and resources
 */
describe("US-013 - Slide content migration", () => {
  describe("sections array", () => {
    it("should exist and have multiple sections", () => {
      expect(sections).toBeDefined();
      expect(Array.isArray(sections)).toBe(true);
      expect(sections.length).toBeGreaterThan(1);
    });

    it("should have sections with required fields", () => {
      sections.forEach((section) => {
        expect(section.id).toBeDefined();
        expect(typeof section.id).toBe("string");
        expect(section.title).toBeDefined();
        expect(typeof section.title).toBe("string");
        expect(section.track).toBeDefined();
      });
    });
  });

  describe("slides array", () => {
    it("should exist and have multiple slides", () => {
      expect(slides).toBeDefined();
      expect(Array.isArray(slides)).toBe(true);
      expect(slides.length).toBeGreaterThan(1);
    });

    it("should have all required fields on each slide (id, sectionId, type, title)", () => {
      slides.forEach((slide) => {
        expect(slide.id).toBeDefined();
        expect(typeof slide.id).toBe("string");
        expect(slide.id.length).toBeGreaterThan(0);

        expect(slide.sectionId).toBeDefined();
        expect(typeof slide.sectionId).toBe("string");
        expect(slide.sectionId.length).toBeGreaterThan(0);

        expect(slide.type).toBeDefined();
        expect(typeof slide.type).toBe("string");

        expect(slide.title).toBeDefined();
        expect(typeof slide.title).toBe("string");
      });
    });

    it("should have valid slide types", () => {
      const validTypes = [
        "title",
        "section-header",
        "content",
        "quote",
        "image",
      ];
      slides.forEach((slide) => {
        expect(validTypes).toContain(slide.type);
      });
    });

    it("should have each slide reference a valid section", () => {
      const sectionIds = sections.map((s) => s.id);
      slides.forEach((slide) => {
        expect(sectionIds).toContain(slide.sectionId);
      });
    });
  });

  describe("resources array", () => {
    it("should exist", () => {
      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
    });
  });
});

/**
 * US-014 - Resource link nodes
 * Tests that verify resource data structure and validity
 */
describe("US-014 - Resource link nodes", () => {
  it("should have at least 5 resources", () => {
    expect(resources.length).toBeGreaterThanOrEqual(5);
  });

  it("should have each resource with required fields (id, slideId, type, title, url)", () => {
    resources.forEach((resource) => {
      expect(resource.id).toBeDefined();
      expect(typeof resource.id).toBe("string");
      expect(resource.id.length).toBeGreaterThan(0);

      expect(resource.slideId).toBeDefined();
      expect(typeof resource.slideId).toBe("string");
      expect(resource.slideId.length).toBeGreaterThan(0);

      expect(resource.type).toBeDefined();
      expect(typeof resource.type).toBe("string");

      expect(resource.title).toBeDefined();
      expect(typeof resource.title).toBe("string");
      expect(resource.title.length).toBeGreaterThan(0);

      expect(resource.url).toBeDefined();
      expect(typeof resource.url).toBe("string");
      expect(resource.url.length).toBeGreaterThan(0);
    });
  });

  it("should have valid resource types (article, tool, video, docs, github)", () => {
    const validTypes: ResourceType[] = [
      "article",
      "tool",
      "video",
      "docs",
      "github",
    ];
    resources.forEach((resource) => {
      expect(validTypes).toContain(resource.type);
    });
  });

  it("should have resources that reference existing slides", () => {
    const slideIds = slides.map((s) => s.id);
    resources.forEach((resource) => {
      expect(slideIds).toContain(resource.slideId);
    });
  });

  it("should have valid URLs", () => {
    resources.forEach((resource) => {
      expect(() => new URL(resource.url)).not.toThrow();
    });
  });
});

/**
 * US-021 - NODE_DIMENSIONS
 * Tests that verify the node dimension constants
 */
describe("US-021 - NODE_DIMENSIONS", () => {
  it("should have slide dimensions defined", () => {
    expect(NODE_DIMENSIONS.slide).toBeDefined();
    expect(NODE_DIMENSIONS.slide.width).toBe(520);
    expect(NODE_DIMENSIONS.slide.height).toBe(420);
  });

  it("should have sectionHeader dimensions defined", () => {
    expect(NODE_DIMENSIONS.sectionHeader).toBeDefined();
    expect(NODE_DIMENSIONS.sectionHeader.width).toBe(400);
    expect(NODE_DIMENSIONS.sectionHeader.height).toBe(140);
  });

  it("should have resource dimensions defined", () => {
    expect(NODE_DIMENSIONS.resource).toBeDefined();
    expect(NODE_DIMENSIONS.resource.width).toBe(180);
    expect(NODE_DIMENSIONS.resource.height).toBe(120);
  });

  it("should have paperBackground dimensions defined", () => {
    expect(NODE_DIMENSIONS.paperBackground).toBeDefined();
    expect(NODE_DIMENSIONS.paperBackground.width).toBe(0);
    expect(NODE_DIMENSIONS.paperBackground.height).toBe(0);
  });

  it("should have all dimensions as positive numbers or zero", () => {
    Object.values(NODE_DIMENSIONS).forEach((dims) => {
      expect(dims.width).toBeGreaterThanOrEqual(0);
      expect(dims.height).toBeGreaterThanOrEqual(0);
    });
  });
});

/**
 * US-029 - Color variables
 * Tests that verify track color constants
 */
describe("US-029 - Color variables", () => {
  it("should have TRACK_COLORS.non-technical defined (emerald)", () => {
    expect(TRACK_COLORS["non-technical"]).toBeDefined();
    expect(TRACK_COLORS["non-technical"]).toBe("#10b981");
  });

  it("should have TRACK_COLORS.technical defined (blue)", () => {
    expect(TRACK_COLORS.technical).toBeDefined();
    expect(TRACK_COLORS.technical).toBe("#3b82f6");
  });

  it("should have TRACK_COLORS.general defined", () => {
    expect(TRACK_COLORS.general).toBeDefined();
    expect(TRACK_COLORS.general).toBe("#6b7280");
  });

  it("should have valid hex color format for all tracks", () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    Object.values(TRACK_COLORS).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  it("should have colors for all track types", () => {
    const trackTypes: Track[] = ["non-technical", "technical", "general"];
    trackTypes.forEach((track) => {
      expect(TRACK_COLORS[track]).toBeDefined();
    });
  });
});

/**
 * US-046 - LevelNodeData type
 * Tests that verify the LevelNodeData interface structure
 */
describe("US-046 - LevelNodeData type", () => {
  it("should allow creating a valid LevelNodeData object with required fields", () => {
    const levelNodeData: LevelNodeData = {
      level: 3,
      slideId: "slide-10",
      track: "non-technical",
    };

    expect(levelNodeData.level).toBe(3);
    expect(levelNodeData.slideId).toBe("slide-10");
    expect(levelNodeData.track).toBe("non-technical");
  });

  it("should accept all valid track types", () => {
    const tracks: Track[] = ["non-technical", "technical", "general"];

    tracks.forEach((track) => {
      const levelNodeData: LevelNodeData = {
        level: 1,
        slideId: "slide-01",
        track,
      };
      expect(levelNodeData.track).toBe(track);
    });
  });

  it("should allow additional properties via index signature", () => {
    const levelNodeData: LevelNodeData = {
      level: 5,
      slideId: "slide-12",
      track: "technical",
      customProperty: "custom value",
    };

    expect(levelNodeData.customProperty).toBe("custom value");
  });

  it("should allow numeric level values", () => {
    const levelNodeData: LevelNodeData = {
      level: 0,
      slideId: "slide-07",
      track: "non-technical",
    };

    expect(typeof levelNodeData.level).toBe("number");
    expect(levelNodeData.level).toBe(0);
  });
});

/**
 * Additional data integrity tests
 */
describe("Data integrity", () => {
  it("should have unique slide IDs", () => {
    const slideIds = slides.map((s) => s.id);
    const uniqueIds = new Set(slideIds);
    expect(uniqueIds.size).toBe(slideIds.length);
  });

  it("should have unique section IDs", () => {
    const sectionIds = sections.map((s) => s.id);
    const uniqueIds = new Set(sectionIds);
    expect(uniqueIds.size).toBe(sectionIds.length);
  });

  it("should have unique resource IDs", () => {
    const resourceIds = resources.map((r) => r.id);
    const uniqueIds = new Set(resourceIds);
    expect(uniqueIds.size).toBe(resourceIds.length);
  });

  it("should have sections with valid track types", () => {
    const validTracks: Track[] = ["non-technical", "technical", "general"];
    sections.forEach((section) => {
      expect(validTracks).toContain(section.track);
    });
  });
});
