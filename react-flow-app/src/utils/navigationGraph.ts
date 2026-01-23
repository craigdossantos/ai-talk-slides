/**
 * Navigation graph utilities for track-aware Prev/Next navigation on the metro map.
 *
 * The metro map has branches (non-tech track, tech track, projects track) that
 * converge at the closing section. Navigation should follow the connected edges
 * rather than using a flat array index.
 *
 * Graph structure:
 * - intro -> understanding -> mapping (linear)
 * - mapping branches to: levels-nontech, levels-tech
 * - levels-tech branches to: projects
 * - levels-nontech -> closing
 * - levels-tech -> closing
 * - projects -> closing
 */

import type { Section, SlideContent } from "../types/presentation";

interface NavigationLinks {
  previous: string | null;
  next: string | null;
}

/**
 * Builds a navigation graph based on section connections and slide order.
 * Returns a map from slideId to its previous/next slide following the track.
 */
export function buildNavigationGraph(
  sections: Section[],
  slides: SlideContent[],
): Map<string, NavigationLinks> {
  const graph = new Map<string, NavigationLinks>();

  // Group slides by section
  const slidesBySection = new Map<string, SlideContent[]>();
  for (const slide of slides) {
    const sectionSlides = slidesBySection.get(slide.sectionId) || [];
    sectionSlides.push(slide);
    slidesBySection.set(slide.sectionId, sectionSlides);
  }

  // Helper to get first/last slide of a section
  const getFirstSlide = (sectionId: string): string | null => {
    const sectionSlides = slidesBySection.get(sectionId);
    return sectionSlides && sectionSlides.length > 0
      ? sectionSlides[0].id
      : null;
  };

  const getLastSlide = (sectionId: string): string | null => {
    const sectionSlides = slidesBySection.get(sectionId);
    return sectionSlides && sectionSlides.length > 0
      ? sectionSlides[sectionSlides.length - 1].id
      : null;
  };

  // Define section-level navigation paths (edges between sections)
  // These define which section comes after which, respecting branches
  const sectionConnections: Record<string, { prev: string[]; next: string[] }> =
    {
      intro: {
        prev: [],
        next: ["understanding"],
      },
      understanding: {
        prev: ["intro"],
        next: ["mapping"],
      },
      mapping: {
        prev: ["understanding"],
        // Junction: branches to both tracks (user chooses which track)
        // For linear navigation, we'll pick the non-tech track as primary
        next: ["levels-nontech"],
      },
      "levels-nontech": {
        prev: ["mapping"],
        next: ["closing"],
      },
      "levels-tech": {
        // Can come from mapping or from completing non-tech track
        prev: ["mapping"],
        next: ["closing"],
      },
      projects: {
        // Branches from first slide of tech track (slide-16/CLI)
        prev: ["levels-tech"],
        next: ["closing"],
      },
      closing: {
        // Receives from multiple tracks - for previous, we need to track where user came from
        // Default to tech track for now
        prev: ["levels-tech"],
        next: [],
      },
    };

  // Build navigation for each slide
  for (const section of sections) {
    const sectionSlides = slidesBySection.get(section.id) || [];

    for (let i = 0; i < sectionSlides.length; i++) {
      const slide = sectionSlides[i];
      let previous: string | null = null;
      let next: string | null = null;

      // Previous: within section, or last slide of previous section
      if (i > 0) {
        previous = sectionSlides[i - 1].id;
      } else {
        // First slide of section - link to last slide of previous section
        const prevSections = sectionConnections[section.id]?.prev || [];
        if (prevSections.length > 0) {
          // Use first previous section (primary path)
          previous = getLastSlide(prevSections[0]);
        }
      }

      // Next: within section, or first slide of next section
      if (i < sectionSlides.length - 1) {
        next = sectionSlides[i + 1].id;
      } else {
        // Last slide of section - link to first slide of next section
        const nextSections = sectionConnections[section.id]?.next || [];
        if (nextSections.length > 0) {
          // Use first next section (primary path)
          next = getFirstSlide(nextSections[0]);
        }
      }

      graph.set(slide.id, { previous, next });
    }
  }

  // Special case: slide-16 (CLI, first tech slide) needs custom handling
  // It can go to either the tech track or branch to projects
  // For now, Next goes to slide-18 (next tech slide), not projects
  // Projects are accessed by clicking directly on them

  // Special case: slide-15 (last non-tech) -> closing
  const lastNonTech = getLastSlide("levels-nontech");
  if (lastNonTech) {
    const existing = graph.get(lastNonTech);
    if (existing) {
      graph.set(lastNonTech, {
        ...existing,
        next: getFirstSlide("closing"),
      });
    }
  }

  // Special case: slide-25 (last tech) -> closing
  const lastTech = getLastSlide("levels-tech");
  if (lastTech) {
    const existing = graph.get(lastTech);
    if (existing) {
      graph.set(lastTech, {
        ...existing,
        next: getFirstSlide("closing"),
      });
    }
  }

  // Special case: last project -> closing
  const lastProject = getLastSlide("projects");
  if (lastProject) {
    const existing = graph.get(lastProject);
    if (existing) {
      graph.set(lastProject, {
        ...existing,
        next: getFirstSlide("closing"),
      });
    }
  }

  // Special case: closing slide's previous should go to last tech slide (most common path)
  const firstClosing = getFirstSlide("closing");
  if (firstClosing) {
    const existing = graph.get(firstClosing);
    if (existing) {
      graph.set(firstClosing, {
        ...existing,
        previous: getLastSlide("levels-tech"),
      });
    }
  }

  // Special case: first project's previous should go to first tech slide (CLI)
  const firstProject = getFirstSlide("projects");
  const firstTech = getFirstSlide("levels-tech");
  if (firstProject && firstTech) {
    const existing = graph.get(firstProject);
    if (existing) {
      graph.set(firstProject, {
        ...existing,
        previous: firstTech,
      });
    }
  }

  return graph;
}

/**
 * Gets the previous slide ID for a given slide, following track connections.
 */
export function getPreviousSlide(
  slideId: string,
  navigationGraph: Map<string, NavigationLinks>,
): string | null {
  return navigationGraph.get(slideId)?.previous ?? null;
}

/**
 * Gets the next slide ID for a given slide, following track connections.
 */
export function getNextSlide(
  slideId: string,
  navigationGraph: Map<string, NavigationLinks>,
): string | null {
  return navigationGraph.get(slideId)?.next ?? null;
}
