import { useCallback, useEffect, useState } from "react";
import type { Edge } from "@xyflow/react";

/**
 * Stored edge that was created by the user.
 * Uses a minimal structure that can be converted to a full Edge object.
 */
export interface StoredEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

/**
 * Edge edits tracking added and deleted edges.
 */
export interface EdgeEdits {
  addedEdges: StoredEdge[];
  deletedEdgeIds: string[];
}

/** localStorage key for edge edits */
const STORAGE_KEY = "presentation-edge-edits";

/** Current version of the edge edits format (for future migrations) */
const EDGE_EDITS_VERSION = 1;

/** Structure of persisted edge edits in localStorage */
interface PersistedEdgeEdits {
  version: number;
  timestamp: number;
  data: EdgeEdits;
}

/**
 * Default empty edge edits object.
 */
function getDefaultEdgeEdits(): EdgeEdits {
  return {
    addedEdges: [],
    deletedEdgeIds: [],
  };
}

/**
 * Load edge edits from localStorage.
 * @returns EdgeEdits object or null if not found/error
 */
function loadEdgeEdits(): EdgeEdits | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: PersistedEdgeEdits = JSON.parse(stored);

    // Validate the data structure
    if (!data || typeof data.data !== "object") {
      return null;
    }

    // Validate arrays exist
    if (
      !Array.isArray(data.data.addedEdges) ||
      !Array.isArray(data.data.deletedEdgeIds)
    ) {
      return null;
    }

    return data.data;
  } catch (error) {
    console.warn("Failed to load edge edits:", error);
    return null;
  }
}

/**
 * Save edge edits to localStorage.
 * @param edits The edge edits to save
 */
function persistEdgeEdits(edits: EdgeEdits): void {
  try {
    const data: PersistedEdgeEdits = {
      version: EDGE_EDITS_VERSION,
      timestamp: Date.now(),
      data: edits,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save edge edits:", error);
  }
}

/**
 * Clear all edge edits from localStorage.
 */
export function clearEdgeEdits(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear edge edits:", error);
  }
}

interface UseEdgeEditsReturn {
  edgeEdits: EdgeEdits;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
}

/**
 * Custom hook for managing edge edits (additions and deletions).
 * Persists edge edits to localStorage with key 'presentation-edge-edits'.
 *
 * @returns Object containing edge edits data and addEdge/deleteEdge functions
 */
export function useEdgeEdits(): UseEdgeEditsReturn {
  const [edgeEdits, setEdgeEdits] = useState<EdgeEdits>(() => {
    const loaded = loadEdgeEdits();
    return loaded ?? getDefaultEdgeEdits();
  });

  // Persist edge edits whenever they change
  useEffect(() => {
    persistEdgeEdits(edgeEdits);
  }, [edgeEdits]);

  // Add a new edge
  const addEdge = useCallback((edge: Edge) => {
    const storedEdge: StoredEdge = {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    };

    setEdgeEdits((prev) => ({
      ...prev,
      addedEdges: [...prev.addedEdges, storedEdge],
      // If this edge was previously deleted, remove it from deletedEdgeIds
      deletedEdgeIds: prev.deletedEdgeIds.filter((id) => id !== edge.id),
    }));
  }, []);

  // Delete an edge by ID
  const deleteEdge = useCallback((edgeId: string) => {
    setEdgeEdits((prev) => {
      // Check if this was a user-added edge
      const wasUserAdded = prev.addedEdges.some((e) => e.id === edgeId);

      if (wasUserAdded) {
        // Remove from addedEdges, don't add to deletedEdgeIds
        return {
          ...prev,
          addedEdges: prev.addedEdges.filter((e) => e.id !== edgeId),
        };
      } else {
        // Add to deletedEdgeIds (it was a generated edge)
        return {
          ...prev,
          deletedEdgeIds: [...prev.deletedEdgeIds, edgeId],
        };
      }
    });
  }, []);

  return {
    edgeEdits,
    addEdge,
    deleteEdge,
  };
}
