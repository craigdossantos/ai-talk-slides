#!/usr/bin/env python3
"""
Generate all slide images with Round 4 Comic Book style based on feedback.
Skips slide 13 (placeholder) and slide 17 (removed/integrated into 16).
"""

import os
import sys
import shutil
from pathlib import Path
from datetime import datetime

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed.")
    sys.exit(1)

# LOCKED Ada character - very specific about hairstyle
ADA_CHARACTER = """EXACT CHARACTER - must match precisely:
A young woman named Ada, mid-20s.

FACE: Large expressive Pixar-style eyes, sleek rectangular glasses with TEAL frames, subtle freckles across nose bridge, warm confident smile, slightly rounded friendly face shape.

HAIR - CRITICAL: Short chin-length bob haircut, slightly wavy/bouncy texture, BROWN base color with vivid ELECTRIC BLUE highlights throughout (not just tips - the blue is mixed in). Hair frames her face, parted slightly to the side. NOT long hair, NOT straight hair, NOT ponytail - specifically a short wavy bob.

OUTFIT: Fitted cream/off-white jacket with BOLD TEAL geometric accent panels on shoulders and lapels, soft white top underneath. The jacket has clean lines.

CAPE: A flowing digital cape in ELECTRIC BLUE with glowing teal circuit/progress patterns.

EXPRESSION: Confident, warm, encouraging - like a friendly mentor."""

# Comic book style with maximum saturation
STYLE_PROMPT = """Colored pencil illustration with MAXIMUM SATURATION COMIC BOOK COLORS.

Style requirements:
- Hand-drawn colored pencil texture with visible strokes
- Pixar-quality character expressiveness (large eyes, appealing proportions)
- COMIC BOOK COLOR PALETTE: Pure saturated primaries and secondaries
  - ELECTRIC BLUE (#0066FF) - bold, pure blue
  - VIVID RED/CORAL (#FF3B30) - punchy, eye-catching
  - BRIGHT TEAL (#00CED1) - vibrant cyan-teal
  - SUNNY YELLOW (#FFD60A) - bold yellow
  - HOT PINK/MAGENTA (#FF2D55) - accent color
  - Pure BLACK for outlines and contrast
  - Clean WHITE backgrounds

- Colors should be FULLY SATURATED - no pastels, no muted tones
- High contrast like comic book art - colors POP off the white background
- Bold black outlines or strong edges where colors meet
- Think: Roy Lichtenstein meets Pixar meets colored pencil

Clean white background for all non-essential elements. Professional presentation quality. 16:9 aspect ratio.

IMPORTANT: Title text should be large, bold comic book style text integrated into the image."""

# All slide definitions with scene descriptions based on feedback
SLIDES = {
    "slide-01": {
        "title": "The Widening Gulf of Technology",
        "scene": """A dramatic visualization of a GULF/CHASM that is thin at the bottom and wide at the top.

On the LEFT SIDE of the gulf: primitive technologies stacked vertically:
- At the very bottom (narrowest part): a small fire/flame
- Above that: a bicycle
- Above that: the Internet symbol

On the RIGHT SIDE: The gulf spreads WIDER with each technology layer

At the TOP: AI is pushing the gulf apart dramatically - the widest point. Ada stands confidently on the AI side, her cape flowing.

Colors: Fire in CORAL/RED, bicycle in YELLOW, Internet in BLUE, AI section in ELECTRIC BLUE and TEAL.

White background. NO yellow text boxes. The title "The Widening Gulf of Technology" should be bold text at the top."""
    },
    "slide-02": {
        "title": "Mental Models Through Use",
        "scene": """Ada in a simple, clean scene demonstrating learning through practice.

Show a simple progression:
- Ada USING a tool (interacting with a glowing interface)
- An arrow or flow showing: USE → LEARN → IMPROVE

Keep it MINIMAL and clean. White background. Not busy.

The visual should convey that understanding comes from doing, not from reading instructions.

Simple, iconic representation. Bold colors: ELECTRIC BLUE for the learning flow, TEAL for highlights."""
    },
    "slide-03": {
        "title": "New Tech, Old Mental Model",
        "scene": """Ada looking thoughtfully at a visual transformation:

CENTER: Google logo morphing/transforming into ChatGPT logo - show the transition happening.

SUBTLE ELEMENT: Surreal "hallucination" visual elements - like Dali's melting/dripping clocks in the corner to represent AI inconsistency.

Keep the background MINIMAL and WHITE - less busy than before.

The focus is on the Google → ChatGPT transformation and the subtle hallucination imagery.

NO confusing text boxes. Clean and clear."""
    },
    "slide-04": {
        "title": "From Savant to Digital Employee",
        "scene": """Ada stands confidently center frame, transitioning from one role to another.

LEFT SIDE: A friendly "all-knowing sage" figure (representing chatbot as confidant) - fading away or smaller

RIGHT SIDE: Multiple small helpful AI robot assistants in ELECTRIC BLUE and TEAL - cute, eager, ready for action. They represent digital employees.

Ada's ELECTRIC BLUE cape flows behind her. She's now a team lead/director.

LESS BUSY BACKGROUND - clean white, keep the foreground clear to see what's happening.

The transformation from "getting advice" to "directing execution" should be visually clear."""
    },
    "slide-05": {
        "title": "Mapping the Journey",
        "scene": """Ada holding a LARGE, PROMINENT flowchart/roadmap in her hands or floating beside her.

The flowchart should resemble a skill tree or learning path with:
- Connected nodes in different colors (CORAL, TEAL, YELLOW, BLUE)
- Pathways branching and connecting
- Progress indicators

The flowchart should be MUCH LARGER than before - it's the main focus of the image.

Background should be MINIMAL - much less busy. Clean white.

Ada looks confident and encouraging, showing the map to the viewer."""
    },
    "slide-06": {
        "title": "What It Takes",
        "scene": """Ada LEAPING dynamically over a gulf/chasm.

In the GULF below: "AI" written or symbolized in glowing ELECTRIC BLUE

Ada is BREAKING THROUGH restraints/ropes as she jumps - the ropes represent "resistance to change" and she's snapping them.

Her cape flows dramatically behind her in the leap.

NO labels on the sides like "technical/non-technical" - remove all side labels.

The focus is on her breaking free and leaping forward.

Dynamic action pose. Bold colors. White background."""
    },
    "slide-07": {
        "title": "Avoidance",
        "scene": """A person with their HEAD IN THE SAND (classic ostrich pose) - NOT Ada, but a generic figure.

Around the image, TWO QUOTE BOXES in comic book style:

Quote 1: "I think there is a world market for maybe five computers." - Thomas Watson, IBM, 1943

Quote 2: "I see little commercial potential for the internet for the next 10 years" - Bill Gates

NO level badge. The head-in-sand visual is the main focus.

Background: Clean white. The quotes should be styled like comic book speech bubbles or bold text panels.

Colors: The sand in YELLOW/CORAL, the figure in muted tones to contrast with Ada's vibrant colors in other slides."""
    },
    "slide-08": {
        "title": "AI = Portal to Internet Research",
        "scene": """Ada pointing at or interacting with a transformation happening:

Google logo/icon smoothly MORPHING INTO or being ABSORBED BY ChatGPT/AI interface.

Keep it SIMPLE and CLEAN - less busy than before.

NO level badge. NO confusing bottom boxes.

Can include a small "Prompt Engineering" label or icon if it fits cleanly.

The focus is on the Google → ChatGPT transition as the main visual metaphor.

White background. Bold colors: Google colors transitioning to ELECTRIC BLUE/TEAL of AI."""
    },
    "slide-09": {
        "title": "AI as Thought Partner",
        "scene": """Ada having a CONVERSATION with an AI representation - maybe an AI DOCTOR figure (robot with stethoscope or medical symbol).

Show the back-and-forth dialogue: speech bubbles going between Ada and the AI.

Make it feel like a genuine thoughtful conversation, not just Q&A.

LESS BUSY background. Remove any boxes at the bottom.

Clean white background. The conversation/dialogue is the focus.

Colors: AI doctor/figure in ELECTRIC BLUE and TEAL, speech bubbles in CORAL and WHITE."""
    },
    "slide-10": {
        "title": "Context Engineering",
        "scene": """Ada putting TOKENS (small colorful blocks/shapes) into a large MEMORY BANK or BASKET.

The basket/container has HOLES in the side near the top.

Show tokens SPILLING OUT through the holes when the basket gets too full - representing context overflow.

The basket is the main visual metaphor - make it prominent.

NO level badge. Clean white background.

Colors: Tokens in various saturated colors (CORAL, YELLOW, TEAL, BLUE). Basket in ELECTRIC BLUE outline."""
    },
    "slide-11": {
        "title": "Using AI Tools",
        "scene": """Ada surrounded by floating tool ICONS in a clean arrangement:

- Microphone icon (Wispr Flow - voice dictation)
- Notes/document icon (Granola - meeting notes)
- Obsidian logo or vault icon
- Figma, Canva, Notion, Slack icons (smaller, in background)

Keep the SAME STYLE as other icons - consistent visual language.

LESS BUSY background - the current version looks like a dollar bill pattern, remove that.

NO level badge. Clean white background.

Colors: Icons in ELECTRIC BLUE, TEAL, CORAL, YELLOW. Maintain visual consistency."""
    },
    "slide-12": {
        "title": "AI-Powered Browsing",
        "scene": """Ada in front of a browser window, with THREE key browser tools highlighted:

1. Claude extension icon/interface
2. ChatGPT Atlas browser representation
3. Gemini in the TOP RIGHT CORNER of a Chrome browser - make it VERY VISIBLE where people can find it

Make the Gemini corner location prominent - show a browser chrome with the Gemini icon in the top right.

LESS DARK than before. Brighter, cleaner.

NO level badge. White background where possible.

Colors: Browser in ELECTRIC BLUE, tool icons in TEAL, CORAL, and brand colors."""
    },
    # SLIDE 13 SKIPPED - will use placeholder
    "slide-14": {
        "title": "AI for Automation",
        "scene": """Ada looking at or interacting with an N8N-STYLE automation interface.

Show a visual workflow diagram like N8n uses:
- Connected nodes with arrows
- Different colored nodes representing different actions
- Clean, readable workflow structure

The automation interface should be PROMINENT - replace the machine imagery from before.

NO level badge. Clean white background.

Colors: Workflow nodes in ELECTRIC BLUE, CORAL, TEAL, YELLOW. Connectors in dark blue."""
    },
    "slide-15": {
        "title": "Natural Language Software Tools",
        "scene": """Ada SPEAKING (speech bubble with words/text) and those words are TRANSFORMING INTO software/code/interface.

Show the transformation: Natural language → Software

Include small brand icons: Google AI Studio, Lovable, Bolt

LESS DARK background than before - brighter, cleaner.

NO level badge. White background.

The language-to-software transformation is the key visual.

Colors: Speech in CORAL, transforming text in ELECTRIC BLUE, resulting software in TEAL."""
    },
    "slide-16": {
        "title": "Command Line Interface (CLI)",
        "scene": """A PROMINENT terminal/command line window as the central focus.

The terminal should look like a PORTAL - glowing, with energy emanating from it.

From the terminal, connections/rays extend out to:
- Files and folders
- Applications
- The rest of the computer

Make the COMMAND LINE PROMPT very visible and clear - it's the portal to everything.

Ada stands beside it, gesturing to show this is the gateway.

No level badge. Clean background.

Colors: Terminal in BLACK with ELECTRIC BLUE glow, connections in TEAL, files/apps in various colors."""
    },
    # SLIDE 17 REMOVED - integrated into slide 16
    "slide-18": {
        "title": "Using Git and GitHub",
        "scene": """Ada with a LARGE, PROMINENT GitHub logo/octocat as a central element.

Show the concept of versioning:
- Snapshots/checkpoints visual
- Branching tree structure
- Cloud storage representation

The GitHub logo should be BIG and recognizable.

NO level badge. Clean white background.

Colors: GitHub octocat in BLACK, version nodes in CORAL, TEAL, YELLOW, cloud in ELECTRIC BLUE."""
    },
    "slide-19": {
        "title": "Agents and AI Coding",
        "scene": """Ada surrounded by three tool logos/symbols prominently displayed:

1. Google Anti-Gravity symbol/representation
2. Cursor IDE logo/interface
3. VSCode logo

Show the concept of IDE - chat window on one side, code on the other.

The feedback loop: Agent writes → sees result → adjusts → improves (can show with circular arrows)

NO level badge. Clean white background.

Colors: Tool icons in their brand colors, IDE interface in ELECTRIC BLUE and TEAL."""
    },
    "slide-20": {
        "title": "Modes and Workflows",
        "scene": """Ada orchestrating a CYCLE DIAGRAM showing the software development lifecycle:

Plan → Build → Test → Review → Deploy → Bug Fix → (back to Plan)

Each step shows Ada or the AI in a DIFFERENT MODE/FORM - shape-shifting.

The cycle should be clear and readable.

Show the model changing form at each step - maybe different colored versions or different poses.

NO level badge. Clean white background.

Colors: Each step in a different bold color - BLUE, CORAL, YELLOW, TEAL, PINK, GREEN."""
    }
}


def build_prompt(slide_key: str) -> str:
    """Build a complete prompt for the slide."""
    slide = SLIDES[slide_key]

    prompt = f"""{STYLE_PROMPT}

{ADA_CHARACTER}

Scene for "{slide['title']}":
{slide['scene']}

CRITICAL REMINDERS:
- Ada's hair is a SHORT WAVY BOB - brown with electric blue highlights mixed throughout
- Colors must be MAXIMUM SATURATION - comic book bold, not muted
- White background for non-essential areas
- Ada should look IDENTICAL across all images
- NO level badges unless specifically mentioned

Title text in bold comic book style: "{slide['title']}"
"""
    return prompt


def generate_image(client, prompt: str, aspect_ratio: str = "16:9", model: str = "gemini-3-pro-image-preview"):
    """Generate a single image from a prompt."""
    config_kwargs = {"response_modalities": ["TEXT", "IMAGE"]}
    if aspect_ratio:
        config_kwargs["image_config"] = types.ImageConfig(aspect_ratio=aspect_ratio)
    config = types.GenerateContentConfig(**config_kwargs)

    response = client.models.generate_content(
        model=model,
        contents=[prompt],
        config=config,
    )

    for part in response.parts:
        if part.inline_data is not None:
            return part.as_image()

    return None


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Output to main assets/images directory
    output_dir = Path(__file__).parent.parent.parent / "images"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Also save to round5 for version tracking
    round_dir = Path(__file__).parent / "round5"
    round_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    generated = []
    failed = []

    print(f"Generating {len(SLIDES)} slide images...")
    print(f"Output: {output_dir}")
    print(f"Archive: {round_dir}")
    print("-" * 50)

    for slide_key, slide_data in SLIDES.items():
        print(f"Generating {slide_key}: {slide_data['title']}...", end=" ", flush=True)

        prompt = build_prompt(slide_key)

        try:
            image = generate_image(client, prompt)

            if image:
                # Filename for main assets (matches slides.ts)
                main_filename = f"{slide_key}-{slide_data['title'].lower().replace(' ', '-').replace('=', '').replace('(', '').replace(')', '')}.jpg"
                main_filepath = output_dir / main_filename

                # Archive filename with timestamp
                archive_filename = f"{slide_key}_comic-saturated_{timestamp}.jpg"
                archive_filepath = round_dir / archive_filename

                # Save to both locations
                image.save(main_filepath)
                shutil.copy(main_filepath, archive_filepath)

                generated.append({
                    "slide": slide_key,
                    "title": slide_data["title"],
                    "main_file": str(main_filepath),
                    "archive_file": str(archive_filepath)
                })
                print("OK")
            else:
                print("FAILED (no image)")
                failed.append(slide_key)

        except Exception as e:
            print(f"FAILED: {e}")
            failed.append(slide_key)

    print("-" * 50)
    print(f"Generated: {len(generated)} images")
    if failed:
        print(f"Failed: {len(failed)} images - {', '.join(failed)}")

    # Generate gallery for round5
    images_html = ""
    for img in generated:
        archive_name = Path(img['archive_file']).name
        images_html += f'''
        <div class="image-card">
            <img src="{archive_name}" alt="{img['title']}">
            <div class="card-info">
                <div class="slide-id">{img['slide'].replace('slide-', 'Slide ')}</div>
                <div class="slide-title">{img['title']}</div>
            </div>
        </div>'''

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Round 5: All Slides - Comic Book Style</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Space Grotesk', sans-serif;
            background: linear-gradient(135deg, #ffe4e6 0%, #e0f2fe 50%, #fef9c3 100%);
            min-height: 100vh;
            padding: 2rem;
        }}
        .container {{ max-width: 1600px; margin: 0 auto; }}
        header {{ text-align: center; margin-bottom: 2rem; }}
        h1 {{ font-size: 2rem; font-weight: 700; color: #1a1a2e; }}
        .subtitle {{ color: #666; margin-top: 0.5rem; }}
        .stats {{ margin-top: 1rem; font-size: 0.9rem; color: #888; }}
        .gallery {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }}
        .image-card {{
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s;
        }}
        .image-card:hover {{ transform: translateY(-4px); }}
        .image-card img {{ width: 100%; display: block; }}
        .card-info {{ padding: 1rem; }}
        .slide-id {{ font-size: 0.8rem; color: #888; text-transform: uppercase; }}
        .slide-title {{ font-size: 1rem; font-weight: 600; color: #1a1a2e; }}
        .lightbox {{
            display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.9); z-index: 1000; cursor: pointer;
        }}
        .lightbox.active {{ display: flex; align-items: center; justify-content: center; }}
        .lightbox img {{ max-width: 95%; max-height: 95%; }}
        @media (max-width: 1200px) {{ .gallery {{ grid-template-columns: repeat(2, 1fr); }} }}
        @media (max-width: 800px) {{ .gallery {{ grid-template-columns: 1fr; }} }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Round 5: All Slides - Comic Book Style</h1>
            <p class="subtitle">Based on feedback - updated titles, visuals, no level badges</p>
            <p class="stats">Generated: {len(generated)} slides | Failed: {len(failed)} | Timestamp: {timestamp}</p>
        </header>
        <div class="gallery">{images_html}</div>
    </div>
    <div class="lightbox" id="lightbox" onclick="this.classList.remove('active')">
        <img id="lightbox-img" src="">
    </div>
    <script>
        document.querySelectorAll('.image-card').forEach(card => {{
            card.addEventListener('click', () => {{
                document.getElementById('lightbox-img').src = card.querySelector('img').src;
                document.getElementById('lightbox').classList.add('active');
            }});
        }});
    </script>
</body>
</html>'''

    with open(round_dir / "gallery.html", 'w') as f:
        f.write(html)
    print(f"\nGallery: {round_dir / 'gallery.html'}")

    # Save manifest
    import json
    manifest = {
        "timestamp": timestamp,
        "generated": generated,
        "failed": failed
    }
    with open(round_dir / f"manifest_{timestamp}.json", 'w') as f:
        json.dump(manifest, f, indent=2)


if __name__ == "__main__":
    main()
