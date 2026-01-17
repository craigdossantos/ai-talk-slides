#!/usr/bin/env python3
"""
Generate Round 3 - Pixar Colored Pencil with vibrant pop art colors.
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

# Consistent Ada character description
ADA_CHARACTER = """A young woman named Ada, mid-20s with large expressive eyes behind sleek rectangular glasses with teal frames. Her short, bouncy hair has a natural brown base with vivid electric blue highlights. She has subtle freckles across her nose bridge and a warm, confident smile. She wears a fitted cream-colored jacket with bold teal geometric accents over a soft white top."""

# The refined style prompt
STYLE_PROMPT = """Colored pencil illustration with Pixar-quality character design and VIBRANT POP ART colors.

Art style combines:
- Hand-drawn colored pencil texture with visible strokes and soft blending
- Pixar's appealing character expressiveness (large eyes, warm expressions)
- BOLD, SATURATED pop art color palette: electric blue, vivid coral/orange, bright teal, sunny yellow, hot pink accents
- High contrast between colors - colors should POP and be eye-catching
- Clean white or very light backgrounds for non-essential elements

The colored pencil medium should feel hand-crafted and warm, but the colors should be punchy and energetic like pop art - not muted or pastel. Think: if a Pixar character was illustrated by someone who loves bold, vibrant colors.

Professional presentation quality. 16:9 aspect ratio."""

# Slide-specific content
SLIDES = {
    "slide-04": {
        "title": "From Confidant to Digital Employee",
        "scene": """Ada stands confidently in the center, orchestrating a transformation. On her left, a friendly chat bubble character (bold coral/orange) represents conversation. On her right, three small helpful AI assistant characters (bright teal, vivid blue) represent digital employees ready for action. Ada gestures with open arms showing the transition. Her flowing digital cape has vibrant electric blue and teal patterns. Simple task icons float nearby in punchy colors."""
    },
    "slide-08": {
        "title": "Level 1: AI as Uber Google",
        "scene": """Ada stands at the beginning of a journey, pointing forward with an encouraging gesture. Before her, a skill path with connected nodes - the first node glows in bright coral (unlocked), others await in softer outlines. She holds a vivid teal search/question icon. A bold "Level 1" badge in electric blue is visible. Her cape shows a progress bar in vibrant colors. Floating icons (search, chat, lightbulb) in punchy pop art colors."""
    },
    "slide-13": {
        "title": "Level 6: Media & Creative Production",
        "scene": """Ada in a creative flow state, surrounded by vibrant creative outputs. Floating around her: image frames with bold colored borders, video play icons in hot pink and orange, creative sparkles in electric blue. Her cape displays progress in vivid teal and coral. She gestures with creative confidence. Achievement badges in bright saturated colors. Expression is joyful and accomplished. Maximum color vibrancy for this creative slide."""
    },
    "closing": {
        "title": "You're Not Behind",
        "scene": """Ada in a welcoming, encouraging pose - reaching out toward the viewer. Behind her, a simplified skill journey path shows progression - nodes in various vibrant colors (coral for completed, teal for current, softer for future). Her cape flows majestically with all the bold colors accumulated. Floating text elements in punchy colors: "Learn the next step" "Ignore the rest". Warm, triumphant, inviting feeling with maximum pop art energy."""
    }
}


def build_prompt(slide_key: str) -> str:
    """Build a complete prompt for the slide."""
    slide = SLIDES[slide_key]

    prompt = f"""{STYLE_PROMPT}

Character: {ADA_CHARACTER}

Scene for "{slide['title']}":
{slide['scene']}

Important:
- Keep background white or very minimal for non-essential elements
- Make the colors VIBRANT and SATURATED - this should feel energetic and eye-catching
- Focus on Ada and the key conceptual elements with plenty of white space
- The colored pencil texture should be visible but colors should be bold, not washed out

Title text integrated naturally: "{slide['title']}"
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

    # Create output directory
    output_dir = Path(__file__).parent / "round3"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    generated = []

    # Generate for each slide
    for slide_key, slide_data in SLIDES.items():
        print(f"Generating {slide_key} - Pixar Colored Pencil Pop Art...", end=" ", flush=True)

        prompt = build_prompt(slide_key)

        try:
            image = generate_image(client, prompt)

            if image:
                filename = f"{slide_key}_pop-pencil_{timestamp}.jpg"
                filepath = output_dir / filename
                image.save(filepath)

                generated.append({
                    "slide": slide_key,
                    "title": slide_data["title"],
                    "style": "Pixar Colored Pencil Pop Art",
                    "filename": filename,
                    "filepath": str(filepath)
                })
                print("✓")
            else:
                print("✗ No image in response")

        except Exception as e:
            print(f"✗ Error: {e}")

    # Print summary
    print(f"\n{'='*50}")
    print(f"Generated {len(generated)} images")
    print(f"Output directory: {output_dir}")
    print(f"{'='*50}\n")

    for img in generated:
        print(f"  {img['slide']}: {img['filename']}")

    # Write manifest
    import json
    manifest_path = output_dir / f"manifest_{timestamp}.json"
    with open(manifest_path, 'w') as f:
        json.dump(generated, f, indent=2)
    print(f"\nManifest saved to: {manifest_path}")

    # Generate simple gallery
    generate_gallery(generated, output_dir)


def generate_gallery(generated: list, output_dir: Path):
    """Generate a simple HTML gallery."""

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

    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Round 3: Pixar Colored Pencil + Pop Art Colors</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Space Grotesk', -apple-system, sans-serif;
            background: linear-gradient(135deg, #fff5f5 0%, #f0f9ff 50%, #fefce8 100%);
            min-height: 100vh;
            padding: 2rem;
        }}
        .container {{ max-width: 1400px; margin: 0 auto; }}
        header {{ text-align: center; margin-bottom: 2rem; }}
        h1 {{ font-size: 2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.5rem; }}
        .subtitle {{ color: #666; }}
        .gallery {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }}
        .image-card {{
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }}
        .image-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }}
        .image-card img {{ width: 100%; height: auto; display: block; }}
        .card-info {{ padding: 1rem; }}
        .slide-id {{ font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }}
        .slide-title {{ font-size: 1.1rem; font-weight: 600; color: #1a1a2e; }}
        .lightbox {{
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 1000;
            cursor: pointer;
        }}
        .lightbox.active {{ display: flex; align-items: center; justify-content: center; }}
        .lightbox img {{ max-width: 95%; max-height: 95%; object-fit: contain; }}
        @media (max-width: 800px) {{ .gallery {{ grid-template-columns: 1fr; }} }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Pixar Colored Pencil + Pop Art Colors</h1>
            <p class="subtitle">Vibrant, saturated colors with hand-drawn colored pencil texture</p>
        </header>
        <div class="gallery">
            {images_html}
        </div>
    </div>
    <div class="lightbox" id="lightbox" onclick="this.classList.remove('active')">
        <img id="lightbox-img" src="" alt="">
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
        f.write(html_content)
    print(f"Gallery saved to: {output_dir / 'gallery.html'}")


if __name__ == "__main__":
    main()
