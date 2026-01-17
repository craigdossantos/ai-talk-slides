# Visual Style Exploration Status

**Last Updated:** 2026-01-12
**Session Goal:** Find a new visual style for "Leveling Up with AI" presentation

---

## Current Status: Round 5 Complete

**18 slide images generated** with the Comic Book Colored Pencil style (Round 4 approved style).

### Changes Made This Session:

1. Updated talk outline (`react-flow-app/src/data/talk-outline.md`) with new titles, talking points, and bullets
2. Updated slide data (`react-flow-app/src/data/slides.ts`) with new titles and image paths
3. Removed slide 17 (content integrated into slide 16)
4. Generated 18 new images based on visual feedback
5. Created placeholder for slide 13 (will be replaced with actual screenshots later)

### Image Generation Summary:

- **Generated:** slides 01-12, 14-16, 18-20 (18 total)
- **Placeholder:** slide 13 (Creating Media with AI)
- **Removed:** slide 17 (Command Line Basics - merged into slide 16)
- **Skipped:** slides 21-26 (no feedback provided yet)

---

## Slide Title Updates (from feedback)

| Slide | Old Title                          | New Title                        |
| ----- | ---------------------------------- | -------------------------------- |
| 01    | Technology and the Widening Gulf   | The Widening Gulf of Technology  |
| 04    | From Confidant to Digital Employee | From Savant to Digital Employee  |
| 06    | The Wrong Split                    | What It Takes                    |
| 08    | AI as Uber Google                  | AI = Portal to Internet Research |
| 11    | Tools in Your Workflow             | Using AI Tools                   |
| 12    | AI-Enabled Browsing                | AI-Powered Browsing              |
| 13    | Media & Creative Production        | Creating Media with AI           |
| 14    | Automation Tools                   | AI for Automation                |
| 15    | Natural Language Software          | Natural Language Software Tools  |
| 16    | Entering the Technical Track       | Command Line Interface (CLI)     |
| 18    | Version Control                    | Using Git and GitHub             |
| 19    | AI-Native IDEs                     | Agents and AI Coding             |

---

## Current Direction: Comic Book Colored Pencil (Round 4)

**Style:** Pixar-quality character with colored pencil texture and **maximum saturation comic book colors**

**User Feedback:** Liked Round 4 - wants bold, saturated comic book primary colors with colored pencil texture. Ada should remain consistent.

---

## Locked Ada Character Design

```
FACE: Large expressive Pixar-style eyes, sleek rectangular glasses with TEAL frames,
subtle freckles across nose bridge, warm confident smile, slightly rounded friendly face.

HAIR: Short chin-length wavy bob, BROWN base with vivid ELECTRIC BLUE highlights
throughout (not just tips). Hair frames face, parted slightly to side.
NOT long, NOT straight, NOT ponytail - specifically a short wavy bob.

OUTFIT: Fitted cream/off-white jacket with BOLD TEAL geometric accent panels
on shoulders and lapels, soft white top underneath.

CAPE: Flowing digital cape in ELECTRIC BLUE with glowing teal circuit/progress patterns.

EXPRESSION: Confident, warm, encouraging - like a friendly mentor.
```

---

## Color Palette (Comic Book Saturated)

| Color            | Hex     | Usage                                            |
| ---------------- | ------- | ------------------------------------------------ |
| Electric Blue    | #0066FF | Cape, highlights, primary accent                 |
| Vivid Coral/Red  | #FF3B30 | Chat bubbles, completed nodes, warm accents      |
| Bright Teal      | #00CED1 | Glasses frames, jacket accents, current progress |
| Sunny Yellow     | #FFD60A | Lightbulbs, badges, achievements                 |
| Hot Pink/Magenta | #FF2D55 | Play buttons, creative accents                   |
| Pure Black       | -       | Outlines, contrast                               |
| Clean White      | -       | Backgrounds (non-essential areas)                |

---

## Files & Locations

### Generated Images (Round 5 - Latest)

```
assets/images/
├── slide-01-the-widening-gulf-of-technology.jpg
├── slide-02-mental-models-through-use.jpg
├── slide-03-new-tech,-old-mental-model.jpg
├── slide-04-from-savant-to-digital-employee.jpg
├── slide-05-mapping-the-journey.jpg
├── slide-06-what-it-takes.jpg
├── slide-07-avoidance.jpg
├── slide-08-ai--portal-to-internet-research.jpg
├── slide-09-ai-as-thought-partner.jpg
├── slide-10-context-engineering.jpg
├── slide-11-using-ai-tools.jpg
├── slide-12-ai-powered-browsing.jpg
├── slide-13-placeholder.jpg  ← Placeholder (needs actual screenshots)
├── slide-14-ai-for-automation.jpg
├── slide-15-natural-language-software-tools.jpg
├── slide-16-command-line-interface-cli.jpg
├── slide-18-using-git-and-github.jpg
├── slide-19-agents-and-ai-coding.jpg
└── slide-20-modes-and-workflows.jpg
```

### Archive (Round 5)

```
assets/variations/leveling-up-v2/round5/
├── gallery.html        ← View all generated images
├── manifest_*.json     ← Generation metadata
└── slide-*_comic-saturated_*.jpg
```

---

## Next Steps

1. **Review generated images** - Open `assets/variations/leveling-up-v2/round5/gallery.html`
2. **Provide feedback for slides 21-26** - Complete the JSON feedback
3. **Replace slide 13 placeholder** - Add actual screenshots of Nano Banana, Midjourney, ChatGPT
4. **Add connected slides** - Per feedback (slide 03, 09, 13, 16)
5. **Generate remaining slides** - 21-26 once feedback is provided

---

## How to Continue

To generate more slides or regenerate specific slides:

```bash
# Activate virtual environment
source .venv/bin/activate

# Use the all-slides generator
python3 assets/variations/leveling-up-v2/generate_all_slides.py

# Or modify the SLIDES dict in the script to generate specific slides only
```

---

## Key Decisions Made

- Removed "Level X" badges from all level slides
- Less busy backgrounds throughout
- Titles as large text on images (not speech bubbles)
- Slide 17 removed (content merged into slide 16)
- Slide 13 uses placeholder until actual screenshots are available
