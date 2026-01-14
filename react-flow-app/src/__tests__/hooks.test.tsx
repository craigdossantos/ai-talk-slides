import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSlideNotes } from "../hooks/useSlideNotes";
import { useEdgeEdits, clearEdgeEdits } from "../hooks/useEdgeEdits";
import type { Edge } from "@xyflow/react";

// Note: useKeyboardNavigation requires ReactFlowProvider context
// We test it separately with a wrapper

// ============================================================================
// US-053 - useSlideNotes hook tests
// ============================================================================
describe("US-053 - useSlideNotes hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns notes object with notes string and customResources array", () => {
    const { result } = renderHook(() => useSlideNotes("slide-1"));

    expect(result.current.notes).toBeDefined();
    expect(typeof result.current.notes.notes).toBe("string");
    expect(Array.isArray(result.current.notes.customResources)).toBe(true);
  });

  it("returns saveNotes function", () => {
    const { result } = renderHook(() => useSlideNotes("slide-1"));

    expect(typeof result.current.saveNotes).toBe("function");
  });

  it("loads notes from localStorage on slideId change", async () => {
    // Pre-populate localStorage with notes for slide-2
    const existingNotes = {
      version: 1,
      timestamp: Date.now(),
      data: {
        notes: "Test notes for slide 2",
        customResources: [{ title: "Resource 1", url: "https://example.com" }],
      },
    };
    localStorage.setItem(
      "presentation-slide-notes-slide-2",
      JSON.stringify(existingNotes)
    );

    // Start with slide-1 (no notes)
    const { result, rerender } = renderHook(
      ({ slideId }) => useSlideNotes(slideId),
      { initialProps: { slideId: "slide-1" } }
    );

    expect(result.current.notes.notes).toBe("");

    // Change to slide-2 which has notes
    rerender({ slideId: "slide-2" });

    await waitFor(() => {
      expect(result.current.notes.notes).toBe("Test notes for slide 2");
      expect(result.current.notes.customResources).toHaveLength(1);
      expect(result.current.notes.customResources[0].title).toBe("Resource 1");
    });
  });

  it("saveNotes function persists to localStorage", async () => {
    const { result } = renderHook(() => useSlideNotes("slide-1"));

    const newNotes = {
      notes: "My new notes",
      customResources: [{ title: "New Resource", url: "https://new.com" }],
    };

    act(() => {
      result.current.saveNotes(newNotes);
    });

    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled();

    const storedData = localStorage.getItem("presentation-slide-notes-slide-1");
    expect(storedData).not.toBeNull();

    const parsed = JSON.parse(storedData!);
    expect(parsed.data.notes).toBe("My new notes");
    expect(parsed.data.customResources[0].title).toBe("New Resource");
  });

  it("uses key format 'presentation-slide-notes-{slideId}'", () => {
    const { result } = renderHook(() => useSlideNotes("my-custom-slide-id"));

    act(() => {
      result.current.saveNotes({
        notes: "Testing key format",
        customResources: [],
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "presentation-slide-notes-my-custom-slide-id",
      expect.any(String)
    );
  });

  it("handles missing data gracefully - returns default notes", () => {
    const { result } = renderHook(() => useSlideNotes("non-existent-slide"));

    expect(result.current.notes.notes).toBe("");
    expect(result.current.notes.customResources).toEqual([]);
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("presentation-slide-notes-bad-data", "not-valid-json");

    const { result } = renderHook(() => useSlideNotes("bad-data"));

    // Should return default notes instead of crashing
    expect(result.current.notes.notes).toBe("");
    expect(result.current.notes.customResources).toEqual([]);
  });

  it("handles null slideId gracefully", () => {
    const { result } = renderHook(() => useSlideNotes(null));

    expect(result.current.notes.notes).toBe("");
    expect(result.current.notes.customResources).toEqual([]);
  });

  it("does not persist when slideId is null", () => {
    const { result } = renderHook(() => useSlideNotes(null));

    act(() => {
      result.current.saveNotes({ notes: "Should not save", customResources: [] });
    });

    // setItem was called for the initial state but not for the save since slideId is null
    // Clear mocks to check that subsequent save doesn't call setItem
    vi.clearAllMocks();

    act(() => {
      result.current.saveNotes({ notes: "Again", customResources: [] });
    });

    // Should not be called when slideId is null
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});

// ============================================================================
// US-060 - useEdgeEdits hook tests
// ============================================================================
describe("US-060 - useEdgeEdits hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns edgeEdits object with addedEdges and deletedEdgeIds arrays", () => {
    const { result } = renderHook(() => useEdgeEdits());

    expect(result.current.edgeEdits).toBeDefined();
    expect(Array.isArray(result.current.edgeEdits.addedEdges)).toBe(true);
    expect(Array.isArray(result.current.edgeEdits.deletedEdgeIds)).toBe(true);
  });

  it("returns addEdge function", () => {
    const { result } = renderHook(() => useEdgeEdits());

    expect(typeof result.current.addEdge).toBe("function");
  });

  it("returns deleteEdge function", () => {
    const { result } = renderHook(() => useEdgeEdits());

    expect(typeof result.current.deleteEdge).toBe("function");
  });

  it("loads edge edits from localStorage on mount", () => {
    // Pre-populate localStorage
    const existingEdits = {
      version: 1,
      timestamp: Date.now(),
      data: {
        addedEdges: [
          { id: "edge-1", source: "node-1", target: "node-2" },
        ],
        deletedEdgeIds: ["edge-deleted-1"],
      },
    };
    localStorage.setItem("presentation-edge-edits", JSON.stringify(existingEdits));

    const { result } = renderHook(() => useEdgeEdits());

    expect(result.current.edgeEdits.addedEdges).toHaveLength(1);
    expect(result.current.edgeEdits.addedEdges[0].id).toBe("edge-1");
    expect(result.current.edgeEdits.deletedEdgeIds).toContain("edge-deleted-1");
  });

  it("addEdge function adds to addedEdges and saves", async () => {
    const { result } = renderHook(() => useEdgeEdits());

    const newEdge: Edge = {
      id: "new-edge-1",
      source: "source-node",
      target: "target-node",
      sourceHandle: "handle-1",
      targetHandle: "handle-2",
    };

    act(() => {
      result.current.addEdge(newEdge);
    });

    await waitFor(() => {
      expect(result.current.edgeEdits.addedEdges).toHaveLength(1);
      expect(result.current.edgeEdits.addedEdges[0].id).toBe("new-edge-1");
      expect(result.current.edgeEdits.addedEdges[0].source).toBe("source-node");
      expect(result.current.edgeEdits.addedEdges[0].target).toBe("target-node");
      expect(result.current.edgeEdits.addedEdges[0].sourceHandle).toBe("handle-1");
      expect(result.current.edgeEdits.addedEdges[0].targetHandle).toBe("handle-2");
    });

    // Check localStorage was updated
    const storedData = localStorage.getItem("presentation-edge-edits");
    expect(storedData).not.toBeNull();
    const parsed = JSON.parse(storedData!);
    expect(parsed.data.addedEdges[0].id).toBe("new-edge-1");
  });

  it("deleteEdge function adds to deletedEdgeIds for generated edges", async () => {
    const { result } = renderHook(() => useEdgeEdits());

    act(() => {
      result.current.deleteEdge("generated-edge-1");
    });

    await waitFor(() => {
      expect(result.current.edgeEdits.deletedEdgeIds).toContain("generated-edge-1");
    });

    // Check localStorage was updated
    const storedData = localStorage.getItem("presentation-edge-edits");
    expect(storedData).not.toBeNull();
    const parsed = JSON.parse(storedData!);
    expect(parsed.data.deletedEdgeIds).toContain("generated-edge-1");
  });

  it("deleteEdge removes user-added edge from addedEdges instead of adding to deletedEdgeIds", async () => {
    const { result } = renderHook(() => useEdgeEdits());

    // First add an edge
    const userEdge: Edge = {
      id: "user-edge-1",
      source: "node-a",
      target: "node-b",
    };

    act(() => {
      result.current.addEdge(userEdge);
    });

    await waitFor(() => {
      expect(result.current.edgeEdits.addedEdges).toHaveLength(1);
    });

    // Now delete it
    act(() => {
      result.current.deleteEdge("user-edge-1");
    });

    await waitFor(() => {
      // Should be removed from addedEdges
      expect(result.current.edgeEdits.addedEdges).toHaveLength(0);
      // Should NOT be in deletedEdgeIds (since it was user-added, not generated)
      expect(result.current.edgeEdits.deletedEdgeIds).not.toContain("user-edge-1");
    });
  });

  it("uses key 'presentation-edge-edits'", async () => {
    const { result } = renderHook(() => useEdgeEdits());

    const edge: Edge = {
      id: "test-edge",
      source: "a",
      target: "b",
    };

    act(() => {
      result.current.addEdge(edge);
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "presentation-edge-edits",
        expect.any(String)
      );
    });
  });

  it("clearEdgeEdits function clears all edits", async () => {
    // Pre-populate localStorage
    const existingEdits = {
      version: 1,
      timestamp: Date.now(),
      data: {
        addedEdges: [{ id: "edge-1", source: "a", target: "b" }],
        deletedEdgeIds: ["deleted-1"],
      },
    };
    localStorage.setItem("presentation-edge-edits", JSON.stringify(existingEdits));

    // Call clearEdgeEdits
    clearEdgeEdits();

    expect(localStorage.removeItem).toHaveBeenCalledWith("presentation-edge-edits");

    // Verify localStorage is cleared
    const storedData = localStorage.getItem("presentation-edge-edits");
    expect(storedData).toBeNull();
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("presentation-edge-edits", "invalid-json");

    const { result } = renderHook(() => useEdgeEdits());

    // Should return default empty state
    expect(result.current.edgeEdits.addedEdges).toEqual([]);
    expect(result.current.edgeEdits.deletedEdgeIds).toEqual([]);
  });

  it("handles missing arrays in localStorage data gracefully", () => {
    // Invalid structure without arrays
    const invalidData = {
      version: 1,
      timestamp: Date.now(),
      data: {
        addedEdges: "not-an-array",
        deletedEdgeIds: null,
      },
    };
    localStorage.setItem("presentation-edge-edits", JSON.stringify(invalidData));

    const { result } = renderHook(() => useEdgeEdits());

    // Should return default empty state
    expect(result.current.edgeEdits.addedEdges).toEqual([]);
    expect(result.current.edgeEdits.deletedEdgeIds).toEqual([]);
  });

  it("addEdge removes edge from deletedEdgeIds if it was previously deleted", async () => {
    // Pre-populate with a deleted edge
    const existingEdits = {
      version: 1,
      timestamp: Date.now(),
      data: {
        addedEdges: [],
        deletedEdgeIds: ["edge-to-restore"],
      },
    };
    localStorage.setItem("presentation-edge-edits", JSON.stringify(existingEdits));

    const { result } = renderHook(() => useEdgeEdits());

    expect(result.current.edgeEdits.deletedEdgeIds).toContain("edge-to-restore");

    // Now add the same edge
    const restoredEdge: Edge = {
      id: "edge-to-restore",
      source: "a",
      target: "b",
    };

    act(() => {
      result.current.addEdge(restoredEdge);
    });

    await waitFor(() => {
      // Should be in addedEdges
      expect(result.current.edgeEdits.addedEdges.some(e => e.id === "edge-to-restore")).toBe(true);
      // Should be removed from deletedEdgeIds
      expect(result.current.edgeEdits.deletedEdgeIds).not.toContain("edge-to-restore");
    });
  });
});

// ============================================================================
// US-009 - useKeyboardNavigation hook tests (requires ReactFlowProvider)
// US-010 - Overview mode tests
// US-025 - Sequential navigation tests
// ============================================================================
// Note: useKeyboardNavigation requires ReactFlowProvider context from @xyflow/react.
// Testing it requires creating a wrapper component with the provider.
// These tests verify the structure and behavior of the hook's return value.

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { Section, SlideContent } from "../types/presentation";

// Wrapper component for hooks that require ReactFlowProvider
const ReactFlowWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

// Test data
const mockSections: Section[] = [
  { id: "section-1", title: "Introduction", track: "general" },
  { id: "section-2", title: "Technical Track", track: "technical" },
  { id: "section-3", title: "Non-Technical Track", track: "non-technical" },
];

const mockSlides: SlideContent[] = [
  { id: "slide-1", sectionId: "section-1", type: "title", title: "Welcome" },
  { id: "slide-2", sectionId: "section-1", type: "content", title: "Overview" },
  { id: "slide-3", sectionId: "section-2", type: "content", title: "Tech Slide 1" },
  { id: "slide-4", sectionId: "section-2", type: "content", title: "Tech Slide 2" },
  { id: "slide-5", sectionId: "section-3", type: "content", title: "Non-Tech Slide" },
];

describe("US-009 - useKeyboardNavigation hook", () => {
  it("returns currentSlideId state", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.currentSlideId).toBeDefined();
    // Should default to first slide
    expect(result.current.currentSlideId).toBe("slide-1");
  });

  it("returns navigateToSlide function", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.navigateToSlide).toBe("function");
  });

  it("returns orderedSlides array via currentSlideIndex and totalSlides", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    // The hook exposes orderedSlides indirectly via currentSlideIndex and totalSlides
    expect(result.current.totalSlides).toBe(5); // Total number of slides
    expect(result.current.currentSlideIndex).toBe(0); // First slide
  });

  it("navigateToSlide updates currentSlideId", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    act(() => {
      result.current.navigateToSlide("slide-3");
    });

    await waitFor(() => {
      expect(result.current.currentSlideId).toBe("slide-3");
    });
  });

  it("returns currentSectionId derived from current slide", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.currentSectionId).toBe("section-1");
  });

  it("handles empty slides array", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: [],
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.currentSlideId).toBeNull();
    expect(result.current.totalSlides).toBe(0);
    expect(result.current.currentSlideIndex).toBe(-1);
  });
});

describe("US-010 - Overview mode", () => {
  it("returns isOverviewMode state", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.isOverviewMode).toBe("boolean");
    // Should default to false
    expect(result.current.isOverviewMode).toBe(false);
  });

  it("returns toggleOverview function", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.toggleOverview).toBe("function");
  });

  it("toggleOverview toggles isOverviewMode state", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.isOverviewMode).toBe(false);

    act(() => {
      result.current.toggleOverview();
    });

    await waitFor(() => {
      expect(result.current.isOverviewMode).toBe(true);
    });

    act(() => {
      result.current.toggleOverview();
    });

    await waitFor(() => {
      expect(result.current.isOverviewMode).toBe(false);
    });
  });

  it("navigateToSlide sets isOverviewMode to false", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    // First enable overview mode
    act(() => {
      result.current.toggleOverview();
    });

    await waitFor(() => {
      expect(result.current.isOverviewMode).toBe(true);
    });

    // Navigate to a slide should disable overview mode
    act(() => {
      result.current.navigateToSlide("slide-2");
    });

    await waitFor(() => {
      expect(result.current.isOverviewMode).toBe(false);
    });
  });
});

describe("US-025 - Sequential navigation", () => {
  it("returns goToNextSlide function", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.goToNextSlide).toBe("function");
  });

  it("returns goToPreviousSlide function", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.goToPreviousSlide).toBe("function");
  });

  it("returns currentSlideIndex", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.currentSlideIndex).toBe("number");
    expect(result.current.currentSlideIndex).toBe(0);
  });

  it("returns totalSlides count", () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(typeof result.current.totalSlides).toBe("number");
    expect(result.current.totalSlides).toBe(5);
  });

  it("goToNextSlide advances to next slide", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.currentSlideIndex).toBe(0);

    act(() => {
      result.current.goToNextSlide();
    });

    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(1);
      expect(result.current.currentSlideId).toBe("slide-2");
    });
  });

  it("goToPreviousSlide goes to previous slide", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    // First navigate to slide 3
    act(() => {
      result.current.navigateToSlide("slide-3");
    });

    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(2);
    });

    act(() => {
      result.current.goToPreviousSlide();
    });

    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(1);
      expect(result.current.currentSlideId).toBe("slide-2");
    });
  });

  it("goToNextSlide does nothing at last slide", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    // Navigate to last slide
    act(() => {
      result.current.navigateToSlide("slide-5");
    });

    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(4);
    });

    act(() => {
      result.current.goToNextSlide();
    });

    // Should still be at last slide
    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(4);
      expect(result.current.currentSlideId).toBe("slide-5");
    });
  });

  it("goToPreviousSlide does nothing at first slide", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    expect(result.current.currentSlideIndex).toBe(0);

    act(() => {
      result.current.goToPreviousSlide();
    });

    // Should still be at first slide
    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(0);
      expect(result.current.currentSlideId).toBe("slide-1");
    });
  });

  it("updates currentSlideIndex correctly when navigating across sections", async () => {
    const { result } = renderHook(
      () =>
        useKeyboardNavigation({
          sections: mockSections,
          slides: mockSlides,
        }),
      { wrapper: ReactFlowWrapper }
    );

    // Navigate from first slide (section-1) to third slide (section-2)
    act(() => {
      result.current.navigateToSlide("slide-3");
    });

    await waitFor(() => {
      expect(result.current.currentSlideIndex).toBe(2);
      expect(result.current.currentSectionId).toBe("section-2");
    });
  });
});
