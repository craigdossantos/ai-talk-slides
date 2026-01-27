import { useCallback, useEffect, useState, useMemo } from "react";
import type { Section, SlideContent } from "../types/presentation";

interface UseKeyboardNavigationOptions {
  sections: Section[];
  slides: SlideContent[];
}

interface UseKeyboardNavigationReturn {
  currentSlideId: string | null;
  currentSlideIndex: number;
  totalSlides: number;
  isOverviewMode: boolean;
  orderedSlides: SlideContent[];
  navigateToSlide: (slideId: string) => void;
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
  toggleOverview: () => void;
  setActiveSlide: (slideId: string) => void;
}

/**
 * Custom hook for keyboard navigation in the presentation.
 *
 * Simple sequential Prev/Next following slides array order.
 * Escape - Toggle overview mode
 */
export function useKeyboardNavigation({
  slides,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(
    slides.length > 0 ? slides[0].id : null,
  );

  // Track overview mode state - start in overview mode by default
  const [isOverviewMode, setIsOverviewMode] = useState(true);

  // Flat ordered slides array (already in order from slides.ts)
  const orderedSlides = useMemo(() => slides, [slides]);

  // Current index and total
  const currentSlideIndex = currentSlideId
    ? orderedSlides.findIndex((s) => s.id === currentSlideId)
    : -1;
  const totalSlides = orderedSlides.length;

  // Set active slide state only (no viewport changes)
  const setActiveSlide = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
  }, []);

  // Navigate to specific slide
  const navigateToSlide = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
    setIsOverviewMode(false);
  }, []);

  // Simple sequential next
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      navigateToSlide(orderedSlides[currentSlideIndex + 1].id);
    }
  }, [currentSlideIndex, totalSlides, orderedSlides, navigateToSlide]);

  // Simple sequential previous
  const goToPreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      navigateToSlide(orderedSlides[currentSlideIndex - 1].id);
    }
  }, [currentSlideIndex, orderedSlides, navigateToSlide]);

  // Toggle overview mode
  const toggleOverview = useCallback(() => {
    setIsOverviewMode((prev) => !prev);
  }, []);

  // Escape key only
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle if modifier keys are pressed
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

      if (event.key === "Escape") {
        event.preventDefault();
        toggleOverview();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOverview]);

  return {
    currentSlideId,
    currentSlideIndex,
    totalSlides,
    isOverviewMode,
    orderedSlides,
    navigateToSlide,
    goToNextSlide,
    goToPreviousSlide,
    toggleOverview,
    setActiveSlide,
  };
}
