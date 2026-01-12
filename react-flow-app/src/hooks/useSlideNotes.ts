import { useCallback, useEffect, useState } from "react";

/**
 * Custom resource attached to a slide by the user.
 */
export interface CustomResource {
  title: string;
  url: string;
}

/**
 * Notes and resources for a single slide.
 */
export interface SlideNotes {
  notes: string;
  customResources: CustomResource[];
}

/** Current version of the notes format (for future migrations) */
const NOTES_VERSION = 1;

/** Structure of persisted notes data in localStorage */
interface PersistedNotes {
  version: number;
  timestamp: number;
  data: SlideNotes;
}

/**
 * Get the localStorage key for a specific slide's notes.
 */
function getStorageKey(slideId: string): string {
  return `presentation-slide-notes-${slideId}`;
}

/**
 * Load notes from localStorage for a specific slide.
 * @param slideId The slide ID to load notes for
 * @returns SlideNotes object or null if not found/error
 */
function loadNotes(slideId: string): SlideNotes | null {
  try {
    const stored = localStorage.getItem(getStorageKey(slideId));
    if (!stored) {
      return null;
    }

    const data: PersistedNotes = JSON.parse(stored);

    // Validate the data structure
    if (!data || typeof data.data !== "object") {
      return null;
    }

    return data.data;
  } catch (error) {
    console.warn(`Failed to load notes for slide ${slideId}:`, error);
    return null;
  }
}

/**
 * Save notes to localStorage for a specific slide.
 * @param slideId The slide ID to save notes for
 * @param notes The notes data to save
 */
function persistNotes(slideId: string, notes: SlideNotes): void {
  try {
    const data: PersistedNotes = {
      version: NOTES_VERSION,
      timestamp: Date.now(),
      data: notes,
    };

    localStorage.setItem(getStorageKey(slideId), JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save notes for slide ${slideId}:`, error);
  }
}

/**
 * Default empty notes object.
 */
function getDefaultNotes(): SlideNotes {
  return {
    notes: "",
    customResources: [],
  };
}

interface UseSlideNotesReturn {
  notes: SlideNotes;
  saveNotes: (notes: SlideNotes) => void;
}

/**
 * Custom hook for managing slide notes and custom resources.
 * Persists notes to localStorage with key format 'presentation-slide-notes-{slideId}'.
 *
 * @param slideId The slide ID to manage notes for
 * @returns Object containing notes data and saveNotes function
 */
export function useSlideNotes(slideId: string | null): UseSlideNotesReturn {
  const [notes, setNotes] = useState<SlideNotes>(getDefaultNotes);

  // Load notes when slideId changes
  useEffect(() => {
    if (!slideId) {
      setNotes(getDefaultNotes());
      return;
    }

    const loadedNotes = loadNotes(slideId);
    setNotes(loadedNotes ?? getDefaultNotes());
  }, [slideId]);

  // Save notes to localStorage and update state
  const saveNotes = useCallback(
    (newNotes: SlideNotes) => {
      setNotes(newNotes);
      if (slideId) {
        persistNotes(slideId, newNotes);
      }
    },
    [slideId],
  );

  return {
    notes,
    saveNotes,
  };
}
