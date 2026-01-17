#!/usr/bin/env python3
"""
Generate Round 2 variations - exploring new styles while keeping Ada consistent.
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

# Consistent Ada character description (based on Pixar version user liked)
ADA_CHARACTER = """A young woman named Ada, mid-20s with expressive eyes behind sleek rectangular glasses with teal frames. Her short, bouncy hair has a natural brown base with playful electric blue highlights that catch the light. She has subtle freckles across her nose bridge and a warm, determined but friendly smile. She wears a fitted cream-colored jacket with teal geometric accents over a soft white top."""

# Three style variations
STYLES = {
    "colored-pencil": {
        "name": "Pixar Colored Pencil",
        "description": "Pixar character design rendered in colored pencil style on white background",
        "style_prompt": """Colored pencil illustration style with Pixar-quality character design. Hand-drawn texture with visible pencil strokes and soft color blending. Rich, saturated colored pencil colors with subtle paper texture. Character has that appealing Pixar expressiveness but rendered in traditional colored pencil medium. Clean white background for any non-essential elements. Professional illustration quality, warm and inviting."""
    },
    "gouache-storybook": {
        "name": "Gouache Storybook",
        "description": "Warm matte painterly style like Oliver Jeffers children's books",
        "style_prompt": """Gouache painting illustration in the style of modern children's book illustrators like Oliver Jeffers or Jon Klassen. Matte, flat colors with subtle texture. Limited but warm color palette. Slightly simplified forms with expressive character design. Soft edges where paint meets paper. Dreamlike, whimsical atmosphere. White or very light cream background for non-essential areas. Emotionally resonant and approachable."""
    },
    "clean-vector": {
        "name": "Clean Vector Modern",
        "description": "Minimal geometric vector illustration with limited palette",
        "style_prompt": """Clean, modern vector illustration style. Geometric shapes with smooth gradients and precise edges. Limited color palette of 5-6 harmonious colors (cream, teal, coral, warm gold, soft blue). Flat design with subtle shadows for depth. Inspired by Dropbox, Slack, and Mailchimp illustration styles. Intentional white space. Professional, contemporary, and approachable. Character maintains expressiveness within geometric constraints."""
    }
}

# Slide-specific content (simplified for white background approach)
SLIDES = {
    "slide-04": {
        "title": "From Confidant to Digital Employee",
        "scene": """Ada stands confidently in the center, orchestrating a transformation. On her left, a single friendly chat bubble represents conversation. On her right, three small helpful AI assistant characters (cute, simple, eager) represent digital employees ready for action. Ada gestures with open arms showing the transition. Her expression shows an "aha moment" of realization. A flowing digital cape with subtle holographic progress patterns drapes from her shoulders. Simple icons or UI elements float nearby suggesting task management."""
    },
    "slide-08": {
        "title": "Level 1: AI as Uber Google",
        "scene": """Ada stands at the beginning of a journey, pointing forward with an encouraging gesture. Before her, a simple skill path with connected nodes - the first node glows brightly (unlocked), others await in soft outline. She holds or interacts with a search/question icon. A "Level 1" badge or indicator is visible. Her cape shows a progress bar just beginning to fill. Floating nearby: a search icon, chat bubble, lightbulb - simple and friendly."""
    },
    "slide-13": {
        "title": "Level 6: Media & Creative Production",
        "scene": """Ada in a creative flow state, surrounded by the outputs of her creative abilities. Floating around her: simple frames containing images, video play icons, creative sparkles. Her cape displays a progress indicator showing significant advancement (6 of 8). She gestures with creative confidence - perhaps hands directing or conducting the creative elements. Achievement badges visible. Expression is joyful and accomplished."""
    },
    "closing": {
        "title": "You're Not Behind",
        "scene": """Ada in a welcoming, encouraging pose - perhaps reaching out a hand toward the viewer or standing in a confident but inviting stance. Behind her, a simplified skill journey path shows the full progression - some nodes lit, some waiting. Her cape flows majestically showing all accumulated progress. The composition says "you've got this" and "your place is valid." Warm, triumphant feeling without being intimidating. Perhaps floating text elements: "Learn the next step" and "Ignore the rest"."""
    }
}


def build_prompt(style_key: str, slide_key: str) -> str:
    """Build a complete prompt for a style + slide combination."""
    style = STYLES[style_key]
    slide = SLIDES[slide_key]

    prompt = f"""{style['style_prompt']}

Character: {ADA_CHARACTER}

Scene for "{slide['title']}":
{slide['scene']}

Important: Keep background white or very minimal for any non-essential elements. Focus on Ada and the key conceptual elements. The image should be clean and uncluttered with plenty of breathing room.

Title text integrated naturally: "{slide['title']}"

16:9 aspect ratio. Professional presentation quality.
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
    output_dir = Path(__file__).parent / "round2"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    generated = []

    # Generate for each slide and each style
    for slide_key, slide_data in SLIDES.items():
        for style_key, style_data in STYLES.items():
            style_name = style_data["name"]

            print(f"Generating {slide_key} - {style_name}...", end=" ", flush=True)

            prompt = build_prompt(style_key, slide_key)

            try:
                image = generate_image(client, prompt)

                if image:
                    filename = f"{slide_key}_{style_key}_{timestamp}.jpg"
                    filepath = output_dir / filename
                    image.save(filepath)

                    generated.append({
                        "slide": slide_key,
                        "title": slide_data["title"],
                        "style": style_name,
                        "style_key": style_key,
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
        print(f"  {img['slide']} ({img['style']}): {img['filename']}")

    # Write manifest
    import json
    manifest_path = output_dir / f"manifest_{timestamp}.json"
    with open(manifest_path, 'w') as f:
        json.dump(generated, f, indent=2)
    print(f"\nManifest saved to: {manifest_path}")

    # Generate gallery HTML
    generate_gallery(generated, output_dir, timestamp)


def generate_gallery(generated: list, output_dir: Path, timestamp: str):
    """Generate an HTML gallery for the round 2 images."""

    # Group by slide
    slides_data = {}
    for img in generated:
        slide = img["slide"]
        if slide not in slides_data:
            slides_data[slide] = {"title": img["title"], "images": []}
        slides_data[slide]["images"].append(img)

    # Build HTML sections
    sections_html = ""
    for slide_key in ["slide-04", "slide-08", "slide-13", "closing"]:
        if slide_key not in slides_data:
            continue
        slide = slides_data[slide_key]

        images_html = ""
        for img in slide["images"]:
            style_class = img["style_key"]
            images_html += f'''
                <div class="image-card" data-slide="{img['slide']}" data-style="{img['style_key']}" data-filename="{img['filename']}">
                    <img src="{img['filename']}" alt="{img['title']} - {img['style']}">
                    <div class="card-overlay">
                        <span class="style-badge {style_class}">{img['style']}</span>
                    </div>
                    <div class="selected-badge">Selected</div>
                </div>'''

        slide_id = slide_key.replace("slide-", "Slide ").title() if "slide" in slide_key else slide_key.title()
        sections_html += f'''
        <section class="slide-section">
            <div class="slide-header">
                <div class="slide-id">{slide_id}</div>
                <h2 class="slide-title">{slide['title']}</h2>
            </div>
            <div class="comparison-grid three-col">
                {images_html}
            </div>
        </section>'''

    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leveling Up - Round 2 Styles</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}

        body {{
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
            padding: 2rem;
            color: #333;
        }}

        .container {{ max-width: 1800px; margin: 0 auto; }}

        header {{ text-align: center; margin-bottom: 3rem; }}

        h1 {{ font-size: 2.5rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.5rem; }}

        .subtitle {{ font-size: 1.1rem; color: #666; margin-bottom: 1.5rem; }}

        .style-legend {{
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
        }}

        .legend-item {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            font-size: 0.9rem;
        }}

        .legend-dot {{
            width: 14px;
            height: 14px;
            border-radius: 50%;
        }}

        .legend-dot.colored-pencil {{ background: linear-gradient(135deg, #e57373, #ef5350); }}
        .legend-dot.gouache-storybook {{ background: linear-gradient(135deg, #81c784, #66bb6a); }}
        .legend-dot.clean-vector {{ background: linear-gradient(135deg, #64b5f6, #42a5f5); }}

        .slide-section {{
            margin-bottom: 3rem;
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }}

        .slide-header {{
            text-align: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f0f0f0;
        }}

        .slide-id {{
            font-size: 0.85rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.25rem;
        }}

        .slide-title {{ font-size: 1.4rem; font-weight: 600; color: #1a1a2e; }}

        .comparison-grid {{
            display: grid;
            gap: 1.5rem;
        }}

        .comparison-grid.three-col {{
            grid-template-columns: repeat(3, 1fr);
        }}

        .image-card {{
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid transparent;
            background: #fafafa;
        }}

        .image-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }}

        .image-card.selected {{
            border-color: #4CAF50;
            box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
        }}

        .image-card img {{ width: 100%; height: auto; display: block; }}

        .card-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 0.75rem;
            background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%);
        }}

        .style-badge {{
            display: inline-block;
            padding: 0.35rem 0.7rem;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
        }}

        .style-badge.colored-pencil {{ background: linear-gradient(135deg, #e57373, #ef5350); }}
        .style-badge.gouache-storybook {{ background: linear-gradient(135deg, #81c784, #66bb6a); }}
        .style-badge.clean-vector {{ background: linear-gradient(135deg, #64b5f6, #42a5f5); }}

        .selected-badge {{
            position: absolute;
            bottom: 0.75rem;
            right: 0.75rem;
            background: #4CAF50;
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 16px;
            font-weight: 600;
            font-size: 0.8rem;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.2s ease;
        }}

        .image-card.selected .selected-badge {{ opacity: 1; transform: scale(1); }}

        .actions {{
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
            z-index: 100;
        }}

        button {{
            padding: 0.7rem 1.2rem;
            border: none;
            border-radius: 20px;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }}

        .btn-primary {{
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
        }}

        .btn-primary:hover {{ transform: scale(1.05); }}

        .btn-secondary {{ background: #f0f0f0; color: #333; }}
        .btn-secondary:hover {{ background: #e0e0e0; }}

        .selection-count {{ display: flex; align-items: center; font-weight: 500; color: #666; font-size: 0.9rem; }}

        .modal {{
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            padding: 2rem;
        }}

        .modal.active {{ display: flex; align-items: center; justify-content: center; }}

        .modal-content {{
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 700px;
            width: 100%;
            max-height: 80vh;
            overflow: auto;
        }}

        .modal-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }}

        .modal-close {{ background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }}

        pre {{ background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; }}

        .lightbox {{
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 1001;
            cursor: pointer;
        }}

        .lightbox.active {{ display: flex; align-items: center; justify-content: center; }}
        .lightbox img {{ max-width: 95%; max-height: 95%; object-fit: contain; }}
        .lightbox-close {{ position: absolute; top: 1rem; right: 1rem; color: white; font-size: 2rem; background: none; border: none; cursor: pointer; }}

        @media (max-width: 1200px) {{ .comparison-grid.three-col {{ grid-template-columns: repeat(2, 1fr); }} }}
        @media (max-width: 700px) {{ .comparison-grid.three-col {{ grid-template-columns: 1fr; }} }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Round 2: New Style Explorations</h1>
            <p class="subtitle">Keeping Ada consistent, exploring new rendering styles with cleaner backgrounds</p>
            <div class="style-legend">
                <div class="legend-item">
                    <span class="legend-dot colored-pencil"></span>
                    <span>Pixar Colored Pencil</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot gouache-storybook"></span>
                    <span>Gouache Storybook</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot clean-vector"></span>
                    <span>Clean Vector Modern</span>
                </div>
            </div>
        </header>

        {sections_html}
    </div>

    <div class="actions">
        <span class="selection-count"><span id="count">0</span>/4 slides selected</span>
        <button class="btn-secondary" onclick="clearSelections()">Clear All</button>
        <button class="btn-primary" onclick="showSelections()">Confirm Selections</button>
    </div>

    <div class="modal" id="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Your Selections</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <p style="margin-bottom: 1rem; color: #666;">Copy this JSON to record your style preferences:</p>
            <pre id="selection-output"></pre>
        </div>
    </div>

    <div class="lightbox" id="lightbox" onclick="closeLightbox()">
        <button class="lightbox-close">&times;</button>
        <img id="lightbox-img" src="" alt="">
    </div>

    <script>
        const selections = {{}};

        document.querySelectorAll('.image-card').forEach(card => {{
            card.addEventListener('click', (e) => {{
                if (e.shiftKey) {{ openLightbox(card.querySelector('img').src); return; }}

                const slide = card.dataset.slide;
                const style = card.dataset.style;
                const filename = card.dataset.filename;

                document.querySelectorAll(`.image-card[data-slide="${{slide}}"]`).forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selections[slide] = {{ style, filename }};
                updateCount();
            }});

            card.addEventListener('dblclick', () => openLightbox(card.querySelector('img').src));
        }});

        function updateCount() {{ document.getElementById('count').textContent = Object.keys(selections).length; }}

        function clearSelections() {{
            document.querySelectorAll('.image-card').forEach(c => c.classList.remove('selected'));
            for (const key in selections) delete selections[key];
            updateCount();
        }}

        function showSelections() {{
            const styleNames = {{'colored-pencil': 'Pixar Colored Pencil', 'gouache-storybook': 'Gouache Storybook', 'clean-vector': 'Clean Vector Modern'}};
            const output = {{
                timestamp: new Date().toISOString(),
                stylePreferences: Object.entries(selections).map(([slide, data]) => ({{
                    slide,
                    selectedStyle: styleNames[data.style] || data.style,
                    filename: data.filename
                }}))
            }};
            document.getElementById('selection-output').textContent = JSON.stringify(output, null, 2);
            document.getElementById('modal').classList.add('active');
        }}

        function closeModal() {{ document.getElementById('modal').classList.remove('active'); }}
        function openLightbox(src) {{ document.getElementById('lightbox-img').src = src; document.getElementById('lightbox').classList.add('active'); }}
        function closeLightbox() {{ document.getElementById('lightbox').classList.remove('active'); }}

        document.addEventListener('keydown', (e) => {{ if (e.key === 'Escape') {{ closeModal(); closeLightbox(); }} }});
    </script>
</body>
</html>'''

    gallery_path = output_dir / "gallery.html"
    with open(gallery_path, 'w') as f:
        f.write(html_content)
    print(f"Gallery saved to: {gallery_path}")


if __name__ == "__main__":
    main()
