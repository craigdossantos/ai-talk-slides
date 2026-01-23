/**
 * Landmark destination images for the metro map background.
 * These are large decorative images representing different AI futures,
 * geographic features (water/landmass), and entry points (ports).
 */

export interface Landmark {
  id: string;
  image?: string; // Optional - for PNG landmarks
  svgType?: "water" | "landmass"; // For inline SVG landmarks
  label: string;
  defaultScale?: number; // 1.0 = 500px width (current default)
}

export const LANDMARKS: Landmark[] = [
  // Existing destinations (PNG)
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

  // Geographic features (inline SVG)
  {
    id: "landmark-water-1",
    svgType: "water",
    label: "Water Body 1",
    defaultScale: 1.5,
  },
  {
    id: "landmark-water-2",
    svgType: "water",
    label: "Water Body 2",
    defaultScale: 1.2,
  },
  {
    id: "landmark-landmass-1",
    svgType: "landmass",
    label: "Landmass 1",
    defaultScale: 2.0,
  },
  {
    id: "landmark-landmass-2",
    svgType: "landmass",
    label: "Landmass 2",
    defaultScale: 1.8,
  },
  {
    id: "landmark-landmass-3",
    svgType: "landmass",
    label: "Landmass 3",
    defaultScale: 1.5,
  },

  // Entry ports (PNG - to be generated via Gemini)
  {
    id: "landmark-port-no-fear",
    image: "/assets/images/landmarks/port-no-fear.png",
    label: "Port of No Fear",
    defaultScale: 0.6,
  },
  {
    id: "landmark-port-curiosity",
    image: "/assets/images/landmarks/port-curiosity.png",
    label: "Port of Curiosity",
    defaultScale: 0.6,
  },
  {
    id: "landmark-port-necessity",
    image: "/assets/images/landmarks/port-necessity.png",
    label: "Port of Necessity",
    defaultScale: 0.6,
  },
];

// Initial positions for landmarks (can be overridden by persisted positions)
export const LANDMARK_INITIAL_POSITIONS: Record<
  string,
  { x: number; y: number }
> = {
  // Existing
  "landmark-doomtown": { x: 100, y: 900 },
  "landmark-slop-factory": { x: 1800, y: 100 },
  "landmark-empowerment": { x: 3500, y: 500 },

  // Geographic (to be positioned by user)
  "landmark-water-1": { x: -200, y: -200 },
  "landmark-water-2": { x: 3800, y: 1200 },
  "landmark-landmass-1": { x: 1000, y: 400 },
  "landmark-landmass-2": { x: 2200, y: 200 },
  "landmark-landmass-3": { x: 3000, y: 800 },

  // Entry ports (near CLI/research metro stops)
  "landmark-port-no-fear": { x: 650, y: 750 },
  "landmark-port-curiosity": { x: 200, y: 250 },
  "landmark-port-necessity": { x: 400, y: 500 },
};
