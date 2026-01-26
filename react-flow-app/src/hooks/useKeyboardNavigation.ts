import { useCallback, useEffect, useState, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import type { Section, SlideContent } from "../types/presentation";
import { buildNavigationGraph } from "../utils/navigationGraph";

// Constants for slide card positioning (must match MetroStopNode.css)
const CARD_OFFSET_ABOVE_NODE = 50; // bottom: 50px in CSS
// Use max possible card height for positioning to ensure all cards fit
// Image (250px) + title/subtitle (60px) + bullets (up to 200px) + nav (60px) + padding (30px)
const MAX_CARD_HEIGHT = 600;

interface UseKeyboardNavigationOptions {
  sections: Section[];
  slides: SlideContent[];
  fitViewDuration?: number;
}

interface UseKeyboardNavigationReturn {
  currentSlideId: string | null;
  currentSectionId: string | null;
  currentSlideIndex: number;
  totalSlides: number;
  isOverviewMode: boolean;
  navigateToSlide: (slideId: string) => void;
  navigateToSection: (sectionId: string) => void;
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
  toggleOverview: () => void;
  fitCurrentSlide: () => void;
  setActiveSlide: (slideId: string) => void;
  exitOverviewMode: () => void;
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
  fitViewDuration = 500,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const { fitView, setViewport, getNode } = useReactFlow();

  // Track current slide and section
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(
    slides.length > 0 ? slides[0].id : null,
  );

  // Track overview mode state - start in overview mode by default
  const [isOverviewMode, setIsOverviewMode] = useState(true);

  // Derive current section from current slide
  const currentSectionId =
    slides.find((s) => s.id === currentSlideId)?.sectionId ?? null;

  // Group slides by section for navigation (memoized to avoid stale closures)
  const slidesBySection = useMemo(() => {
    const map = new Map<string, SlideContent[]>();
    for (const slide of slides) {
      const sectionSlides = map.get(slide.sectionId) || [];
      sectionSlides.push(slide);
      map.set(slide.sectionId, sectionSlides);
    }
    return map;
  }, [slides]);

  // Build navigation graph for track-aware navigation
  // This follows the metro map track connections rather than flat array index
  const navigationGraph = useMemo(
    () => buildNavigationGraph(sections, slides),
    [sections, slides],
  );

  // Set active slide state only (no fitView) - for viewport change detection
  const setActiveSlide = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
  }, []);

  // Exit overview mode without triggering fitView - for custom viewport handling
  const exitOverviewMode = useCallback(() => {
    setIsOverviewMode(false);
  }, []);

  // Helper: center viewport on a slide's card
  // Positions the card with 20px top margin and node visible above nav bar
  const centerOnSlideCard = useCallback(
    (slideId: string) => {
      const node = getNode(`metro-${slideId}`);
      if (!node) {
        // Fallback to fitView if node not found
        fitView({
          nodes: [{ id: `metro-${slideId}` }],
          duration: fitViewDuration,
          padding: 0.15,
          maxZoom: 2.5,
        });
        return;
      }

      const windowHeight =
        typeof window !== "undefined" ? window.innerHeight : 800;
      const windowWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;

      // We want:
      // - Card top at 20px from window top
      // - Node visible above the bottom nav bar (at least 120px from bottom)
      const topMargin = 20;
      const bottomMargin = 120; // Space for node + nav bar

      // Available height for the card + node area
      const availableHeight = windowHeight - topMargin - bottomMargin;

      // Total vertical span in flow coords: from card top to node
      // Card top = node.y - CARD_OFFSET_ABOVE_NODE - cardHeight
      // Span = cardHeight + CARD_OFFSET_ABOVE_NODE
      const totalSpan = MAX_CARD_HEIGHT + CARD_OFFSET_ABOVE_NODE;

      // Calculate zoom so this span fits in available height
      const zoom = availableHeight / totalSpan;

      // Card top in flow coordinates
      const cardTopY =
        node.position.y - CARD_OFFSET_ABOVE_NODE - MAX_CARD_HEIGHT;

      // Position viewport so card top is at topMargin (20px)
      // screenY = flowY * zoom + viewportY
      // topMargin = cardTopY * zoom + viewportY
      // viewportY = topMargin - cardTopY * zoom
      const viewportX = -node.position.x * zoom + windowWidth / 2;
      const viewportY = topMargin - cardTopY * zoom;

      setViewport(
        { x: viewportX, y: viewportY, zoom },
        { duration: fitViewDuration },
      );
    },
    [fitView, fitViewDuration, getNode, setViewport],
  );

  // Navigate to a specific slide with viewport centered on slide card (not node)
  const navigateToSlide = useCallback(
    (slideId: string) => {
      setCurrentSlideId(slideId);
      setIsOverviewMode(false);
      centerOnSlideCard(slideId);
    },
    [centerOnSlideCard],
  );

  // Navigate to a specific section (focuses on first slide of section)
  const navigateToSection = useCallback(
    (sectionId: string) => {
      const sectionSlides = slidesBySection.get(sectionId);
      if (sectionSlides && sectionSlides.length > 0) {
        const firstSlideId = sectionSlides[0].id;
        setCurrentSlideId(firstSlideId);
        setIsOverviewMode(false);
        centerOnSlideCard(firstSlideId);
      }
    },
    [slidesBySection, centerOnSlideCard],
  );

  // Toggle overview mode (fit all nodes into view)
  const toggleOverview = useCallback(() => {
    const newOverviewMode = !isOverviewMode;
    setIsOverviewMode(newOverviewMode);

    if (newOverviewMode) {
      // Zoom out to show all nodes including large paper
      fitView({
        duration: fitViewDuration,
        padding: 0.05,
        minZoom: 0.02,
        maxZoom: 1,
      });
    } else {
      // Zoom back to current slide, centered on card
      if (currentSlideId) {
        centerOnSlideCard(currentSlideId);
      }
    }
  }, [
    fitView,
    fitViewDuration,
    currentSlideId,
    isOverviewMode,
    centerOnSlideCard,
  ]);

  // Fit current slide to view, centered on card
  const fitCurrentSlide = useCallback(() => {
    if (currentSlideId) {
      setIsOverviewMode(false);
      centerOnSlideCard(currentSlideId);
    }
  }, [currentSlideId, centerOnSlideCard]);

  // Get all slides in presentation order (flattened by section)
  const orderedSlides = sections.flatMap(
    (section) => slidesBySection.get(section.id) || [],
  );

  // Calculate current slide index (0-indexed) and total slides
  const currentSlideIndex = currentSlideId
    ? orderedSlides.findIndex((s) => s.id === currentSlideId)
    : -1;
  const totalSlides = orderedSlides.length;

  // Navigate to next slide using track-aware navigation graph
  // This follows the metro map track connections rather than flat array index
  const goToNextSlide = useCallback(() => {
    if (!currentSlideId) return;
    const navLinks = navigationGraph.get(currentSlideId);
    if (navLinks?.next) {
      navigateToSlide(navLinks.next);
    }
  }, [currentSlideId, navigationGraph, navigateToSlide]);

  // Navigate to previous slide using track-aware navigation graph
  // This follows the metro map track connections rather than flat array index
  const goToPreviousSlide = useCallback(() => {
    if (!currentSlideId) return;
    const navLinks = navigationGraph.get(currentSlideId);
    if (navLinks?.previous) {
      navigateToSlide(navLinks.previous);
    }
  }, [currentSlideId, navigationGraph, navigateToSlide]);

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
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    navigateToSlide,
    navigateToSection,
    goToNextSlide,
    goToPreviousSlide,
    toggleOverview,
    fitCurrentSlide,
    setActiveSlide,
    exitOverviewMode,
  };
}
