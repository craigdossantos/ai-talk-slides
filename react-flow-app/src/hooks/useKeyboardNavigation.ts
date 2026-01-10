import { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import type {
  Section,
  SlideContent,
  PresentationNode,
} from "../types/presentation";

interface UseKeyboardNavigationOptions {
  sections: Section[];
  slides: SlideContent[];
  nodes: PresentationNode[];
  fitViewDuration?: number;
}

interface UseKeyboardNavigationReturn {
  currentSlideId: string | null;
  currentSectionId: string | null;
  isOverviewMode: boolean;
  navigateToSlide: (slideId: string) => void;
  navigateToSection: (sectionId: string) => void;
  toggleOverview: () => void;
  fitCurrentSlide: () => void;
}

/**
 * Custom hook for keyboard navigation in the presentation.
 *
 * Arrow keys (up/down/left/right) - Move to adjacent slides
 * PageUp/PageDown - Jump to previous/next section
 * Number keys 1-9 - Jump to numbered section
 * Escape - Toggle overview mode (fit all nodes)
 * 0 - Fit current slide to view
 */
export function useKeyboardNavigation({
  sections,
  slides,
  nodes,
  fitViewDuration = 500,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const { fitView } = useReactFlow();

  // Track current slide and section
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(
    slides.length > 0 ? slides[0].id : null,
  );

  // Track overview mode state
  const [isOverviewMode, setIsOverviewMode] = useState(false);

  // Derive current section from current slide
  const currentSectionId =
    slides.find((s) => s.id === currentSlideId)?.sectionId ?? null;

  // Group slides by section for navigation
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Navigate to a specific slide
  const navigateToSlide = useCallback(
    (slideId: string) => {
      setCurrentSlideId(slideId);
      setIsOverviewMode(false);
      fitView({
        nodes: [{ id: `slide-${slideId}` }],
        duration: fitViewDuration,
        padding: 0.3,
        maxZoom: 1.5,
      });
    },
    [fitView, fitViewDuration],
  );

  // Navigate to a specific section (focuses on section header)
  const navigateToSection = useCallback(
    (sectionId: string) => {
      // Get first slide of section to set as current
      const sectionSlides = slidesBySection.get(sectionId);
      if (sectionSlides && sectionSlides.length > 0) {
        setCurrentSlideId(sectionSlides[0].id);
      }

      setIsOverviewMode(false);
      fitView({
        nodes: [{ id: `section-${sectionId}` }],
        duration: fitViewDuration,
        padding: 0.3,
        maxZoom: 1.5,
      });
    },
    [fitView, fitViewDuration, slidesBySection],
  );

  // Toggle overview mode (fit all nodes into view)
  const toggleOverview = useCallback(() => {
    const newOverviewMode = !isOverviewMode;
    setIsOverviewMode(newOverviewMode);

    if (newOverviewMode) {
      // Zoom out to show all nodes - don't specify nodes to fit ALL
      fitView({
        duration: fitViewDuration,
        padding: 0.05,
        minZoom: 0.1,
        maxZoom: 1,
      });
    } else {
      // Zoom back to current slide
      if (currentSlideId) {
        fitView({
          nodes: [{ id: `slide-${currentSlideId}` }],
          duration: fitViewDuration,
          padding: 0.3,
          maxZoom: 1.5,
        });
      }
    }
  }, [fitView, fitViewDuration, currentSlideId, isOverviewMode]);

  // Fit current slide to view (zoom back to focused view)
  const fitCurrentSlide = useCallback(() => {
    if (currentSlideId) {
      setIsOverviewMode(false);
      fitView({
        nodes: [{ id: `slide-${currentSlideId}` }],
        duration: fitViewDuration,
        padding: 0.3,
        maxZoom: 1.5,
      });
    }
  }, [fitView, fitViewDuration, currentSlideId]);

  // Get all slides in presentation order (flattened by section)
  const orderedSlides = sections.flatMap(
    (section) => slidesBySection.get(section.id) || [],
  );

  // Find adjacent slides
  const findAdjacentSlide = useCallback(
    (direction: "up" | "down" | "left" | "right"): string | null => {
      if (!currentSlideId) return null;

      const currentIndex = orderedSlides.findIndex(
        (s) => s.id === currentSlideId,
      );
      if (currentIndex === -1) return null;

      const currentSlide = orderedSlides[currentIndex];
      const currentSectionIndex = sections.findIndex(
        (s) => s.id === currentSlide.sectionId,
      );
      const currentSectionSlides =
        slidesBySection.get(currentSlide.sectionId) || [];
      const slideIndexInSection = currentSectionSlides.findIndex(
        (s) => s.id === currentSlideId,
      );

      switch (direction) {
        case "up":
          // Move to previous slide in current section
          if (slideIndexInSection > 0) {
            return currentSectionSlides[slideIndexInSection - 1].id;
          }
          return null;

        case "down":
          // Move to next slide in current section
          if (slideIndexInSection < currentSectionSlides.length - 1) {
            return currentSectionSlides[slideIndexInSection + 1].id;
          }
          return null;

        case "left":
          // Move to previous section (first slide)
          if (currentSectionIndex > 0) {
            const prevSection = sections[currentSectionIndex - 1];
            const prevSectionSlides = slidesBySection.get(prevSection.id) || [];
            return prevSectionSlides[0]?.id ?? null;
          }
          return null;

        case "right":
          // Move to next section (first slide)
          if (currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1];
            const nextSectionSlides = slidesBySection.get(nextSection.id) || [];
            return nextSectionSlides[0]?.id ?? null;
          }
          return null;

        default:
          return null;
      }
    },
    [currentSlideId, orderedSlides, sections, slidesBySection],
  );

  // Find section by number (1-indexed)
  const findSectionByNumber = useCallback(
    (num: number): string | null => {
      if (num < 1 || num > sections.length) return null;
      return sections[num - 1].id;
    },
    [sections],
  );

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle if modifier keys are pressed (except for special cases)
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // Don't handle if focus is on an input element
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowUp": {
          const targetSlide = findAdjacentSlide("up");
          if (targetSlide) {
            event.preventDefault();
            navigateToSlide(targetSlide);
          }
          break;
        }

        case "ArrowDown": {
          const targetSlide = findAdjacentSlide("down");
          if (targetSlide) {
            event.preventDefault();
            navigateToSlide(targetSlide);
          }
          break;
        }

        case "ArrowLeft": {
          const targetSlide = findAdjacentSlide("left");
          if (targetSlide) {
            event.preventDefault();
            navigateToSlide(targetSlide);
          }
          break;
        }

        case "ArrowRight": {
          const targetSlide = findAdjacentSlide("right");
          if (targetSlide) {
            event.preventDefault();
            navigateToSlide(targetSlide);
          }
          break;
        }

        case "PageUp": {
          // Jump to previous section
          event.preventDefault();
          const currentSectionIndex = sections.findIndex(
            (s) => s.id === currentSectionId,
          );
          if (currentSectionIndex > 0) {
            navigateToSection(sections[currentSectionIndex - 1].id);
          }
          break;
        }

        case "PageDown": {
          // Jump to next section
          event.preventDefault();
          const currentSectionIndex = sections.findIndex(
            (s) => s.id === currentSectionId,
          );
          if (currentSectionIndex < sections.length - 1) {
            navigateToSection(sections[currentSectionIndex + 1].id);
          }
          break;
        }

        // Number keys 1-9 jump to sections
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          const sectionNum = parseInt(event.key, 10);
          const targetSection = findSectionByNumber(sectionNum);
          if (targetSection) {
            event.preventDefault();
            navigateToSection(targetSection);
          }
          break;
        }

        case "Escape": {
          // Toggle overview mode
          event.preventDefault();
          toggleOverview();
          break;
        }

        case "0": {
          // Fit current slide to view
          event.preventDefault();
          fitCurrentSlide();
          break;
        }
      }
    },
    [
      findAdjacentSlide,
      findSectionByNumber,
      navigateToSlide,
      navigateToSection,
      toggleOverview,
      fitCurrentSlide,
      currentSectionId,
      sections,
    ],
  );

  // Attach keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    currentSlideId,
    currentSectionId,
    isOverviewMode,
    navigateToSlide,
    navigateToSection,
    toggleOverview,
    fitCurrentSlide,
  };
}
