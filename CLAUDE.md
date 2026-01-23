# Leveling Up with AI - Presentation Project

## Project Overview

An interactive metro map presentation about "Leveling Up with AI" - a visual journey for learning, working, and building with AI. The presentation uses a metro/subway map metaphor where different "lines" represent learning tracks and "stops" represent key concepts and skills.

The metro map architecture is designed to be **reusable** across different presentations.

## Core Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Visualization**: @xyflow/react (React Flow) for the interactive metro map canvas
- **Styling**: Custom CSS with metro map design language
- **Testing**: Vitest + React Testing Library + Playwright
- **Deployment**: Vercel
- **Images**: Generated via slide-image-variations skill (Gemini 2.5 Flash Image API)

## Project Structure

```
.
├── CLAUDE.md                    # This file - project instructions
├── docs/                        # All documentation & status
│   ├── architecture/            # Technical decisions, metro map design
│   │   └── talk-outline.md      # Full talk outline
│   ├── plans/                   # Implementation plans
│   │   ├── 2026-01-14-metro-redesign.md
│   │   └── 2026-01-15-metro-map-visual-refinements.md
│   └── prd/                     # Product requirements docs
│       └── prd-react-flow-migration.md
├── drafts/                      # Working assets (not production)
│   ├── images/                  # WIP slide images
│   ├── approved/                # Staging area for production
│   ├── variations/              # .gitignored - Nano Banana outputs
│   ├── mockups/                 # UI concepts and reference images
│   ├── scripts/                 # Image generation scripts (Python)
│   └── data/                    # Slide content drafts
├── react-flow-app/              # Production application
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetroCanvas.tsx      # Main metro map view
│   │   │   ├── PresentationCanvas.tsx
│   │   │   ├── nodes/               # Custom node components
│   │   │   │   ├── MetroStopNode.tsx
│   │   │   │   ├── MetroLineLabelNode.tsx
│   │   │   │   ├── MetroBackgroundNode.tsx
│   │   │   │   ├── SlideNode.tsx
│   │   │   │   ├── SectionHeaderNode.tsx
│   │   │   │   └── ResourceNode.tsx
│   │   │   └── panels/
│   │   │       ├── MetroLegend.tsx
│   │   │       ├── NavigationControls.tsx
│   │   │       ├── SlidePanel.tsx
│   │   │       ├── SectionNavigator.tsx
│   │   │       └── EditorPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useKeyboardNavigation.ts
│   │   │   ├── useEdgeEdits.ts
│   │   │   └── useSlideNotes.ts
│   │   ├── utils/
│   │   │   ├── generateMetroLayout.ts
│   │   │   ├── navigationGraph.ts
│   │   │   ├── generateNodes.ts
│   │   │   ├── generateEdges.ts
│   │   │   └── persistence.ts
│   │   ├── data/
│   │   │   ├── slides.ts            # Slide content and metadata
│   │   │   └── slides.md
│   │   └── types/
│   ├── public/assets/images/        # Production-ready images
│   └── dist/                        # Build output
├── scripts/                     # Project-wide tooling
│   └── ralph/                   # Ralph autonomous agent setup
├── .claude/
│   └── skills/                  # Claude Code skills
│       ├── slide-image-prompts/
│       └── slide-image-variations/
└── .gitignore
```

## Key Concepts

### Two Orthogonal Workflows

1. **Visual Asset Creation** (`/drafts`)
   - Creating slide images with Nano Banana / Gemini
   - Iterating on variations
   - Approving images for production
   - Workflow: `drafts/variations/` → `drafts/approved/` → `react-flow-app/public/assets/images/`

2. **Metro Map Architecture** (`/react-flow-app/src`)
   - Reusable metro map components
   - Navigation, layout, and interaction logic
   - Can be extracted for other presentations

### Asset Pipeline

```
drafts/variations/     # Raw Nano Banana outputs (.gitignored)
       ↓ (select best)
drafts/approved/       # Curated, ready for production
       ↓ (copy)
react-flow-app/public/assets/images/   # Production
```

## Key Features

- **Metro Map Visualization**: Subway-style map where lines represent learning tracks
- **Zoom-Adaptive Display**: Three zoom levels showing different detail amounts
- **Track-Aware Navigation**: Arrow keys follow metro lines logically
- **Click-to-Open Slides**: Click metro stops to view slide content
- **Hover Tooltips**: Preview slide images on hover
- **Edge Editing**: Create/delete connections with drag and Shift+click

## Available Skills

When working on this project, use these skills:

1. **superpowers:brainstorming**: Use before any creative work - designing features, building components, or modifying behavior

2. **slide-image-prompts**: Generate tailored image prompts for slides featuring Ada (consistent character) in pop art comic style

3. **slide-image-variations**: Create 4-8 image variations using Gemini, present in HTML gallery for selection

## Development Commands

```bash
cd react-flow-app
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Lint code
```

## Design Principles

- **Metro Map Aesthetic**: Clean lines, station circles, color-coded tracks
- **Zoom Levels**: Show/hide detail based on zoom (labels, previews, full slides)
- **Intuitive Navigation**: Arrow keys follow tracks, not just grid positions
- **Responsive Interactions**: Hover previews, click-to-expand, smooth transitions

## Metro Lines (Learning Tracks)

The map uses colored lines to represent different learning paths:

- Each line connects related concepts
- Stops can be on multiple lines (junction nodes)
- Navigation follows the track you're currently on
