/**
 * Landmark destination images for the metro map background.
 * These are large decorative images representing different AI futures.
 */

export interface Landmark {
  id: string;
  image: string;
  label: string;
}

export const LANDMARKS: Landmark[] = [
  {
    id: "landmark-doomtown",
    image: "/assets/images/landmarks/doomtown.png",
    label: "AI Takeover Doomtown",
  },
  {
    id: "landmark-slop-factory",
    image: "/assets/images/landmarks/slop-factory.png",
    label: "AI Slop Factory",
  },
  {
    id: "landmark-empowerment",
    image: "/assets/images/landmarks/empowerment-city.png",
    label: "City of AI Empowerment",
  },
];

// Initial positions for landmarks (can be overridden by persisted positions)
export const LANDMARK_INITIAL_POSITIONS: Record<
  string,
  { x: number; y: number }
> = {
  "landmark-doomtown": { x: 100, y: 900 },
  "landmark-slop-factory": { x: 1800, y: 100 },
  "landmark-empowerment": { x: 3500, y: 500 },
};
