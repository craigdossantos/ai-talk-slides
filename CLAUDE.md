# AI Native Skills Presentation Project

## Project Overview
This is a presentation creation project for building reveal.js slideshows with enhanced capabilities through Claude Code skills. The presentation is about "Using AI as a Native Skill" - a practical map for learning, working, and building with AI.

## Core Technology Stack
- **Presentation Framework**: reveal.js 5.x (loaded via CDN)
- **Styling**: Custom CSS with modern design principles (avoiding "AI slop" aesthetics)
- **Interactive Elements**: React components bundled for embedding
- **Images**: Generated via Nano Banana (Gemini 2.5 Flash Image API)
- **Videos**: Generated via Veo3 for illustrative content (future capability)

## Project Structure
```
.
├── CLAUDE.md                    # This file - project instructions
├── index.html                   # Main reveal.js presentation
├── slides/                      # Individual slide content (markdown)
├── assets/
│   ├── images/                  # Generated and static images
│   ├── videos/                  # Generated videos
│   └── artifacts/               # Bundled interactive components
├── .claude/
│   └── skills/                  # Claude Code skills
│       ├── presentation-builder/ # Main skill with init & bundle scripts
│       ├── presentation-core/   # Design guidelines for reveal.js
│       ├── interactive-artifacts/ # React artifact templates
│       ├── nano-banana-images/  # Image generation skill
│       └── veo3-videos/         # Video generation skill (future)
└── scripts/                     # Build and utility scripts
```

## Available Skills
When working on this project, Claude should use the following skills:

1. **presentation-builder**: Main skill for creating presentations with two modes:
   - **Simple Mode**: Single HTML with embedded CSS/JS (quick, minimal)
   - **Modern Mode**: React + Tailwind → bundled to single HTML (complex artifacts)
   - Includes scripts: `init-project.sh` and `bundle-artifact.sh`

2. **presentation-core**: Design guidelines for reveal.js (typography, colors, avoiding AI slop)

3. **interactive-artifacts**: Templates for specific artifact types (explorers, flowcharts, etc.)

4. **nano-banana-images**: For generating presentation graphics via Gemini 2.5 Flash Image

5. **veo3-videos**: For creating illustrative videos (when implemented)

## Design Principles
- **Avoid Generic AI Aesthetics**: No Inter/Roboto fonts, no purple gradients on white
- **Use Distinctive Typography**: Prefer fonts like Space Grotesk, JetBrains Mono, Playfair Display
- **Rich Backgrounds**: Use gradients, patterns, atmospheric effects - not solid colors
- **Purposeful Animation**: Meaningful transitions, not gratuitous effects
- **Cohesive Themes**: Match the talk's tone - professional but approachable

## Workflow Commands
- `/build` - Bundle artifacts and prepare presentation for serving
- `/preview` - Start local server to preview presentation
- `/generate-image [prompt]` - Use Nano Banana skill to create image
- `/add-artifact [name]` - Create new interactive artifact for slides

## Key Presentation Sections
1. Mental Models, Not Magic - Opening thesis
2. From Chatting to Labor - The shift to execution
3. Why Mapping the Journey Matters - Sequencing vs intelligence
4. The Map Itself - Non-technical and technical tracks
5. Examples and Closing

## Notes
- The talk outline is available in the project for reference
- Each major section should have engaging visuals
- Interactive artifacts can demonstrate concepts (e.g., a mini "mental model" visualizer)
- Keep slides minimal - the presenter does the explaining
