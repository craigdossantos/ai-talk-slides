import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavigationControls from "../../components/panels/NavigationControls";
import SectionNavigator from "../../components/panels/SectionNavigator";
import EditorPanel from "../../components/panels/EditorPanel";
import type { Section, SlideContent } from "../../types/presentation";

// =============================================================================
// US-026-027: NavigationControls Component Tests
// =============================================================================
describe("NavigationControls", () => {
  const defaultProps = {
    currentSlideIndex: 2,
    totalSlides: 10,
    isOverviewMode: false,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onToggleOverview: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("US-026: Previous/Next buttons and progress indicator", () => {
    it("renders Previous and Next buttons", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /previous slide/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /next slide/i }),
      ).toBeInTheDocument();
    });

    it("displays Previous label text", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(screen.getByText("Previous")).toBeInTheDocument();
    });

    it("displays Next label text", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("displays progress indicator in 'X / Y' format", () => {
      render(<NavigationControls {...defaultProps} />);

      // currentSlideIndex is 2, so display should be 3 (1-indexed)
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("/")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("calls onPrevious when Previous button is clicked", () => {
      render(<NavigationControls {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /previous slide/i }));

      expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
    });

    it("calls onNext when Next button is clicked", () => {
      render(<NavigationControls {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /next slide/i }));

      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("US-027: Buttons disabled at first/last slide", () => {
    it("disables Previous button at first slide (index 0)", () => {
      render(<NavigationControls {...defaultProps} currentSlideIndex={0} />);

      const previousButton = screen.getByRole("button", {
        name: /previous slide/i,
      });
      expect(previousButton).toBeDisabled();
    });

    it("enables Next button at first slide", () => {
      render(<NavigationControls {...defaultProps} currentSlideIndex={0} />);

      const nextButton = screen.getByRole("button", { name: /next slide/i });
      expect(nextButton).not.toBeDisabled();
    });

    it("disables Next button at last slide", () => {
      render(<NavigationControls {...defaultProps} currentSlideIndex={9} />);

      const nextButton = screen.getByRole("button", { name: /next slide/i });
      expect(nextButton).toBeDisabled();
    });

    it("enables Previous button at last slide", () => {
      render(<NavigationControls {...defaultProps} currentSlideIndex={9} />);

      const previousButton = screen.getByRole("button", {
        name: /previous slide/i,
      });
      expect(previousButton).not.toBeDisabled();
    });

    it("enables both buttons in the middle of slides", () => {
      render(<NavigationControls {...defaultProps} currentSlideIndex={5} />);

      expect(
        screen.getByRole("button", { name: /previous slide/i }),
      ).not.toBeDisabled();
      expect(
        screen.getByRole("button", { name: /next slide/i }),
      ).not.toBeDisabled();
    });
  });

  describe("Overview toggle button", () => {
    it("renders overview toggle button", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /enter overview mode/i }),
      ).toBeInTheDocument();
    });

    it("calls onToggleOverview when overview button is clicked", () => {
      render(<NavigationControls {...defaultProps} />);

      fireEvent.click(
        screen.getByRole("button", { name: /enter overview mode/i }),
      );

      expect(defaultProps.onToggleOverview).toHaveBeenCalledTimes(1);
    });

    it("shows exit label when in overview mode", () => {
      render(<NavigationControls {...defaultProps} isOverviewMode={true} />);

      expect(
        screen.getByRole("button", { name: /exit overview mode/i }),
      ).toBeInTheDocument();
    });

    it("has aria-pressed set correctly based on overview mode", () => {
      const { rerender } = render(
        <NavigationControls {...defaultProps} isOverviewMode={false} />,
      );

      expect(
        screen.getByRole("button", { name: /enter overview mode/i }),
      ).toHaveAttribute("aria-pressed", "false");

      rerender(<NavigationControls {...defaultProps} isOverviewMode={true} />);

      expect(
        screen.getByRole("button", { name: /exit overview mode/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("US-041: Reset Layout button", () => {
    it("renders Reset Layout button", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /reset layout/i }),
      ).toBeInTheDocument();
    });

    it("calls onReset when Reset Layout button is clicked", () => {
      render(<NavigationControls {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /reset layout/i }));

      expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("US-064: Help tooltip for edge editing", () => {
    it("renders help text for edge editing", () => {
      render(<NavigationControls {...defaultProps} />);

      expect(screen.getByText(/drag handles to connect/i)).toBeInTheDocument();
      expect(
        screen.getByText(/shift\+click edge to delete/i),
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// US-012: SectionNavigator Component Tests
// =============================================================================
describe("SectionNavigator", () => {
  const mockSections: Section[] = [
    { id: "section-1", title: "Introduction", track: "general" },
    { id: "section-2", title: "Non-Technical Track", track: "non-technical" },
    { id: "section-3", title: "Technical Track", track: "technical" },
    { id: "section-4", title: "Conclusion", track: "general" },
  ];

  const defaultProps = {
    sections: mockSections,
    currentSectionId: "section-2",
    onSectionClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to expand the collapsed navigator
  const expandNavigator = () => {
    const toggleButton = screen.getByRole("button", {
      name: /expand sections/i,
    });
    fireEvent.click(toggleButton);
  };

  describe("Collapsed/Expanded state", () => {
    it("starts collapsed by default", () => {
      render(<SectionNavigator {...defaultProps} />);

      // Should show expand button when collapsed
      expect(
        screen.getByRole("button", { name: /expand sections/i }),
      ).toBeInTheDocument();
      // Section items should NOT be visible
      expect(screen.queryByText("Introduction")).not.toBeInTheDocument();
    });

    it("expands when toggle button is clicked", () => {
      render(<SectionNavigator {...defaultProps} />);

      expandNavigator();

      // Section items should now be visible
      expect(screen.getByText("Introduction")).toBeInTheDocument();
      // Should show collapse button when expanded
      expect(
        screen.getByRole("button", { name: /collapse sections/i }),
      ).toBeInTheDocument();
    });
  });

  describe("US-012: Section list display", () => {
    it("displays list of all sections when expanded", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      expect(screen.getByText("Introduction")).toBeInTheDocument();
      expect(screen.getByText("Non-Technical Track")).toBeInTheDocument();
      expect(screen.getByText("Technical Track")).toBeInTheDocument();
      expect(screen.getByText("Conclusion")).toBeInTheDocument();
    });

    it("displays section numbers when expanded", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("renders sections header", () => {
      render(<SectionNavigator {...defaultProps} />);

      // "Sections" label is visible even when collapsed (in toggle button)
      expect(screen.getByText("Sections")).toBeInTheDocument();
    });
  });

  describe("Current section highlighting", () => {
    it("highlights current section with aria-current when expanded", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      const currentSectionButton = screen.getByRole("button", {
        name: /2.*non-technical track/i,
      });
      expect(currentSectionButton).toHaveAttribute("aria-current", "true");
    });

    it("does not have aria-current on non-active sections when expanded", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      const introButton = screen.getByRole("button", {
        name: /1.*introduction/i,
      });
      expect(introButton).not.toHaveAttribute("aria-current");
    });

    it("applies active class to current section when expanded", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      const currentSectionButton = screen.getByRole("button", {
        name: /2.*non-technical track/i,
      });
      expect(currentSectionButton).toHaveClass(
        "section-navigator__item--active",
      );
    });
  });

  describe("Section click callback", () => {
    it("calls onSectionClick with section id when section is clicked", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      const introButton = screen.getByRole("button", {
        name: /1.*introduction/i,
      });
      fireEvent.click(introButton);

      expect(defaultProps.onSectionClick).toHaveBeenCalledWith("section-1");
    });

    it("calls onSectionClick for each section when clicked", () => {
      render(<SectionNavigator {...defaultProps} />);
      expandNavigator();

      // Click on section 3 (Technical Track)
      const techButton = screen.getByRole("button", {
        name: /3.*technical track/i,
      });
      fireEvent.click(techButton);

      expect(defaultProps.onSectionClick).toHaveBeenCalledWith("section-3");
    });
  });

  describe("Empty sections handling", () => {
    it("renders without crashing with empty sections array", () => {
      render(
        <SectionNavigator
          sections={[]}
          currentSectionId={null}
          onSectionClick={vi.fn()}
        />,
      );

      // Should still show the toggle button with "Sections" label
      expect(screen.getByText("Sections")).toBeInTheDocument();
    });
  });
});

// =============================================================================
// US-054-057: EditorPanel Component Tests
// =============================================================================
describe("EditorPanel", () => {
  const mockSection: Section = {
    id: "section-1",
    title: "Test Section",
    track: "general",
  };

  const mockSlide: SlideContent = {
    id: "slide-1",
    sectionId: "section-1",
    type: "content",
    title: "Test Slide Title",
    bullets: ["Bullet 1", "Bullet 2"],
  };

  const defaultProps = {
    slideId: "slide-1",
    slideData: { slide: mockSlide, section: mockSection },
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("US-054: Panel visibility", () => {
    it("returns null when isOpen is false", () => {
      const { container } = render(
        <EditorPanel {...defaultProps} isOpen={false} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("returns null when slideId is null", () => {
      const { container } = render(
        <EditorPanel {...defaultProps} slideId={null} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("returns null when slideData is null", () => {
      const { container } = render(
        <EditorPanel {...defaultProps} slideData={null} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("renders panel when isOpen is true and has valid data", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Test Slide Title" }),
      ).toBeInTheDocument();
    });
  });

  describe("US-055: Panel header with title and close button", () => {
    it("renders panel container with header", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Test Slide Title" }),
      ).toBeInTheDocument();
    });

    it("displays slide title in header", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(screen.getByText("Test Slide Title")).toBeInTheDocument();
    });

    it("renders close button", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /close editor panel/i }),
      ).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      render(<EditorPanel {...defaultProps} />);

      fireEvent.click(
        screen.getByRole("button", { name: /close editor panel/i }),
      );

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("US-056: Notes textarea", () => {
    it("renders textarea for notes", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByRole("textbox", { name: /notes/i }),
      ).toBeInTheDocument();
    });

    it("textarea has placeholder text", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByPlaceholderText(/add notes for this slide/i),
      ).toBeInTheDocument();
    });

    it("renders notes label", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(screen.getByText(/notes \(markdown\)/i)).toBeInTheDocument();
    });
  });

  describe("US-057: Resource URL list and management", () => {
    it("renders Custom Resources section", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(screen.getByText("Custom Resources")).toBeInTheDocument();
    });

    it("renders Add Resource button", () => {
      render(<EditorPanel {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /add resource/i }),
      ).toBeInTheDocument();
    });

    it("shows add resource form when Add Resource button is clicked", () => {
      render(<EditorPanel {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /add resource/i }));

      expect(screen.getByPlaceholderText("Resource title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("https://...")).toBeInTheDocument();
    });

    it("shows Cancel and Add buttons in form", () => {
      render(<EditorPanel {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /add resource/i }));

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    it("hides form when Cancel is clicked", () => {
      render(<EditorPanel {...defaultProps} />);

      // Open form
      fireEvent.click(screen.getByRole("button", { name: /add resource/i }));
      expect(screen.getByPlaceholderText("Resource title")).toBeInTheDocument();

      // Cancel form
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(
        screen.queryByPlaceholderText("Resource title"),
      ).not.toBeInTheDocument();
    });

    it("Add button is disabled when form fields are empty", () => {
      render(<EditorPanel {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /add resource/i }));

      const addButton = screen.getByRole("button", { name: "Add" });
      expect(addButton).toBeDisabled();
    });

    it("Add button is enabled when both fields have values", () => {
      render(<EditorPanel {...defaultProps} />);

      fireEvent.click(screen.getByRole("button", { name: /add resource/i }));

      fireEvent.change(screen.getByPlaceholderText("Resource title"), {
        target: { value: "Test Resource" },
      });
      fireEvent.change(screen.getByPlaceholderText("https://..."), {
        target: { value: "https://example.com" },
      });

      const addButton = screen.getByRole("button", { name: "Add" });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("Resource deletion", () => {
    it("renders delete button for each resource when resources exist", async () => {
      // Pre-populate localStorage with resources for this slide
      const notesData = {
        version: 1,
        timestamp: Date.now(),
        data: {
          notes: "",
          customResources: [
            { title: "Resource 1", url: "https://example1.com" },
            { title: "Resource 2", url: "https://example2.com" },
          ],
        },
      };
      localStorage.setItem(
        "presentation-slide-notes-slide-1",
        JSON.stringify(notesData),
      );

      render(<EditorPanel {...defaultProps} />);

      // Wait for resources to load and check for delete buttons
      const deleteButtons = screen.getAllByRole("button", {
        name: /delete resource/i,
      });
      expect(deleteButtons).toHaveLength(2);
    });

    it("displays resource titles in the list", async () => {
      const notesData = {
        version: 1,
        timestamp: Date.now(),
        data: {
          notes: "Some notes",
          customResources: [
            { title: "My Resource", url: "https://example.com" },
          ],
        },
      };
      localStorage.setItem(
        "presentation-slide-notes-slide-1",
        JSON.stringify(notesData),
      );

      render(<EditorPanel {...defaultProps} />);

      expect(screen.getByText("My Resource")).toBeInTheDocument();
    });

    it("displays resource URLs in the list", async () => {
      const notesData = {
        version: 1,
        timestamp: Date.now(),
        data: {
          notes: "",
          customResources: [
            { title: "Resource", url: "https://specific-url.com" },
          ],
        },
      };
      localStorage.setItem(
        "presentation-slide-notes-slide-1",
        JSON.stringify(notesData),
      );

      render(<EditorPanel {...defaultProps} />);

      expect(screen.getByText("https://specific-url.com")).toBeInTheDocument();
    });
  });

  describe("Panel structure", () => {
    it("has editor-panel class on container", () => {
      const { container } = render(<EditorPanel {...defaultProps} />);

      expect(container.querySelector(".editor-panel")).toBeInTheDocument();
    });

    it("has header section", () => {
      const { container } = render(<EditorPanel {...defaultProps} />);

      expect(
        container.querySelector(".editor-panel__header"),
      ).toBeInTheDocument();
    });

    it("has content section", () => {
      const { container } = render(<EditorPanel {...defaultProps} />);

      expect(
        container.querySelector(".editor-panel__content"),
      ).toBeInTheDocument();
    });
  });
});
