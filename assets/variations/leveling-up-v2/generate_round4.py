#!/usr/bin/env python3
"""
Generate Round 4 - Maximum saturation comic book colors with locked Ada design.
"""

import os
import sys
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

Clean white background for all non-essential elements. Professional presentation quality. 16:9 aspect ratio."""

# Slide-specific content with color guidance
SLIDES = {
    "slide-04": {
        "title": "From Confidant to Digital Employee",
        "scene": """Ada stands confidently center frame, arms open in a welcoming orchestrating gesture.

LEFT SIDE: A friendly chat bubble character in VIVID CORAL/RED with a cute smile face - represents conversation.

RIGHT SIDE: Three small helpful AI robot assistants in ELECTRIC BLUE and TEAL - cute, eager, ready for action.

Ada's ELECTRIC BLUE cape flows behind her with glowing teal patterns. Small colorful icons float above (calendar in YELLOW, chat in CORAL, task checkmark in TEAL).

White background. Bold saturated colors throughout. The transformation from chat to action is clear."""
    },
    "slide-08": {
        "title": "Level 1: AI as Uber Google",
        "scene": """Ada pointing forward encouragingly, standing at the START of a skill journey.

A simple node path stretches before her:
- FIRST NODE: Glowing VIVID CORAL (unlocked/current)
- REMAINING NODES: Outlined circles waiting to be unlocked

Ada holds or points to a TEAL magnifying glass/search icon. A bold "LEVEL 1" badge in ELECTRIC BLUE is visible.

Floating icons in saturated colors: YELLOW lightbulb, CORAL chat bubble, BLUE question mark.

Her cape shows a progress bar just starting to fill. White background, maximum color pop."""
    },
    "slide-13": {
        "title": "Level 6: Media & Creative Production",
        "scene": """Ada in creative flow, surrounded by her creative outputs.

Floating around her in BOLD SATURATED COLORS:
- Image frames with CORAL/RED borders containing colorful artwork
- Video play button icons in HOT PINK and YELLOW
- Creative sparkles in ELECTRIC BLUE
- Music/audio icons in TEAL

Achievement badges in YELLOW, CORAL, BLUE scattered around.

Ada's cape shows significant progress (6 of 8 lit). Her expression is joyful and accomplished - she's mastered creativity.

Maximum vibrancy - this is the creative explosion slide. White background."""
    },
    "closing": {
        "title": "You're Not Behind",
        "scene": """Ada in welcoming pose, one hand reaching toward viewer with an encouraging smile.

Behind her: A simplified skill path showing the full journey
- CORAL nodes = completed steps
- TEAL node = current position
- Outlined nodes = future possibilities

Her cape flows majestically, filled with ALL the vibrant colors (blue, teal, coral, yellow, pink) like accumulated achievements.

Bold text elements:
- "LEARN THE NEXT STEP" in ELECTRIC BLUE
- "IGNORE THE REST" in CORAL

Triumphant but welcoming. You belong here. White background, maximum saturation throughout."""
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

    output_dir = Path(__file__).parent / "round4"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    generated = []

    for slide_key, slide_data in SLIDES.items():
        print(f"Generating {slide_key} - Comic Book Saturation...", end=" ", flush=True)

        prompt = build_prompt(slide_key)

        try:
            image = generate_image(client, prompt)

            if image:
                filename = f"{slide_key}_comic-saturated_{timestamp}.jpg"
                filepath = output_dir / filename
                image.save(filepath)

                generated.append({
                    "slide": slide_key,
                    "title": slide_data["title"],
                    "style": "Comic Book Saturated",
                    "filename": filename,
                    "filepath": str(filepath)
                })
                print("✓")
            else:
                print("✗ No image in response")

        except Exception as e:
            print(f"✗ Error: {e}")

    print(f"\n{'='*50}")
    print(f"Generated {len(generated)} images")
    print(f"Output directory: {output_dir}")
    print(f"{'='*50}\n")

    for img in generated:
        print(f"  {img['slide']}: {img['filename']}")

    import json
    manifest_path = output_dir / f"manifest_{timestamp}.json"
    with open(manifest_path, 'w') as f:
        json.dump(generated, f, indent=2)

    # Generate gallery
    images_html = ""
    for img in generated:
        images_html += f'''
        <div class="image-card">
            <img src="{img['filename']}" alt="{img['title']}">
            <div class="card-info">
                <div class="slide-id">{img['slide'].replace('slide-', 'Slide ').replace('closing', 'Closing')}</div>
                <div class="slide-title">{img['title']}</div>
            </div>
        </div>'''

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Round 4: Comic Book Maximum Saturation</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Space Grotesk', sans-serif;
            background: linear-gradient(135deg, #ffe4e6 0%, #e0f2fe 50%, #fef9c3 100%);
            min-height: 100vh;
            padding: 2rem;
        }}
        .container {{ max-width: 1400px; margin: 0 auto; }}
        header {{ text-align: center; margin-bottom: 2rem; }}
        h1 {{ font-size: 2rem; font-weight: 700; color: #1a1a2e; }}
        .subtitle {{ color: #666; margin-top: 0.5rem; }}
        .gallery {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }}
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
        .slide-title {{ font-size: 1.1rem; font-weight: 600; color: #1a1a2e; }}
        .lightbox {{
            display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.9); z-index: 1000; cursor: pointer;
        }}
        .lightbox.active {{ display: flex; align-items: center; justify-content: center; }}
        .lightbox img {{ max-width: 95%; max-height: 95%; }}
        @media (max-width: 800px) {{ .gallery {{ grid-template-columns: 1fr; }} }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Comic Book Maximum Saturation</h1>
            <p class="subtitle">Bold primary colors, colored pencil texture, consistent Ada</p>
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

    with open(output_dir / "gallery.html", 'w') as f:
        f.write(html)
    print(f"Gallery: {output_dir / 'gallery.html'}")


if __name__ == "__main__":
    main()
