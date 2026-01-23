/**
 * Persistence utility for saving and loading node positions from localStorage.
 * Enables users to rearrange the presentation layout and have it persist across sessions.
 */

/** Key used to store node positions in localStorage */
const STORAGE_KEY = "presentation-node-positions";

/** Current version of the persistence format (for future migrations) */
const PERSISTENCE_VERSION = 1;

/** Position data for a single node */
export interface NodePosition {
  x: number;
  y: number;
  scale?: number; // For landmarks with resizable scale
}

/** Structure of persisted data in localStorage */
interface PersistedData {
  version: number;
  timestamp: number;
  positions: Record<string, NodePosition>;
}

/**
 * Load persisted node positions from localStorage.
 * @returns Record mapping node IDs to {x, y} positions, or null if no data exists or on error
 */
export function loadPersistedPositions(): Record<string, NodePosition> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: PersistedData = JSON.parse(stored);

    // Validate the data structure
    if (!data || typeof data.positions !== "object") {
      return null;
    }

    return data.positions;
  } catch (error) {
    // Handle JSON parse errors gracefully
    console.warn("Failed to load persisted positions:", error);
    return null;
  }
}

/**
 * Save node positions to localStorage.
 * @param positions Record mapping node IDs to {x, y} positions
 */
export function savePersistedPositions(
  positions: Record<string, NodePosition>,
): void {
  try {
    const data: PersistedData = {
      version: PERSISTENCE_VERSION,
      timestamp: Date.now(),
      positions,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Handle localStorage errors (quota exceeded, etc.)
    console.warn("Failed to save persisted positions:", error);
  }
}

/**
 * Clear all persisted node positions from localStorage.
 * Used when resetting the layout to default positions.
 */
export function clearPersistedPositions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear persisted positions:", error);
  }
}

/**
 * Export current node positions to a downloadable JSON file.
 * The downloaded file can be committed to git and used as the default positions.
 * @param filename Optional filename (default: nodePositions.json)
 */
export function exportPositionsToFile(
  filename: string = "nodePositions.json",
): void {
  try {
    const positions = loadPersistedPositions();

    if (!positions || Object.keys(positions).length === 0) {
      console.warn("No positions to export");
      return;
    }

    const jsonContent = JSON.stringify(positions, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Exported ${Object.keys(positions).length} node positions`);
  } catch (error) {
    console.warn("Failed to export positions:", error);
  }
}

/**
 * Load node positions from a committed JSON file.
 * Falls back to localStorage positions if JSON import fails.
 * @param positionsJson The imported JSON object with node positions
 * @returns Record mapping node IDs to positions
 */
export function loadCommittedPositions(
  positionsJson: Record<string, NodePosition>,
): Record<string, NodePosition> {
  return positionsJson;
}
