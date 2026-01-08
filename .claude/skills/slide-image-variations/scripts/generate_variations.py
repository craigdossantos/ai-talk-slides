#!/usr/bin/env python3
"""
Generate multiple image variations for presentation slides using Gemini.

This script generates 4 distinct interpretations with different styles,
not just variations of the same prompt.

Usage:
    python generate_variations.py --prompt "Slide concept description" --count 4
    python generate_variations.py --prompt "AI learning curve" --aspect-ratio 16:9
"""

import argparse
import os
import sys
import json
from pathlib import Path
from datetime import datetime

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed.")
    print("Install with: pip install google-genai")
    sys.exit(1)


# Style templates following Nano Banana Pro best practices
STYLE_TEMPLATES = [
    {
        "name": "Cinematic Photorealistic",
        "template": """A cinematic, photorealistic {concept}.
Shot with a 35mm anamorphic lens creating subtle lens flares.
Dramatic three-point lighting with strong key light and soft fill.
Film grain texture, teal and orange color grading.
Ultra high resolution, sharp focus on subject with cinematic depth of field.
Professional photography for a major tech publication cover."""
    },
    {
        "name": "Modern Illustrated",
        "template": """A modern, stylized illustration of {concept}.
Clean vector-inspired aesthetic with bold geometric shapes.
Limited color palette of 4-5 harmonious colors with strong contrast.
Subtle gradients and smooth shading, no outlines.
Inspired by contemporary editorial illustration for The New Yorker.
Balanced negative space, sophisticated and minimal."""
    },
    {
        "name": "Abstract Conceptual",
        "template": """An abstract, conceptual visualization of {concept}.
Metaphorical representation using symbolic imagery and visual metaphors.
Flowing organic forms mixed with precise geometric elements.
Rich, saturated colors with luminous highlights.
Dreamlike atmosphere with surreal spatial relationships.
High-concept art direction for a premium tech brand."""
    },
    {
        "name": "Documentary Authentic",
        "template": """An authentic, documentary-style photograph of {concept}.
Natural available light, capturing a genuine moment.
Shot on 50mm prime lens at eye level, intimate perspective.
Warm, slightly desaturated tones suggesting lived-in reality.
Environmental context visible, telling a story.
Pulitzer-prize-winning photojournalism aesthetic."""
    },
    {
        "name": "Retro Futurism",
        "template": """A retro-futuristic interpretation of {concept}.
1960s space-age optimism meets mid-century modern design.
Bold primary colors, chrome accents, and atomic-age motifs.
Clean lines, geometric patterns, and optimistic composition.
Inspired by Saul Bass poster design and Eames aesthetics.
Nostalgic yet forward-looking, sophisticated vintage appeal."""
    },
    {
        "name": "Dark Cinematic",
        "template": """A dark, moody cinematic portrayal of {concept}.
Chiaroscuro lighting with deep shadows and selective highlights.
Rich blacks, muted colors with occasional vibrant accents.
Shot on vintage Cooke lenses for organic, painterly bokeh.
Atmospheric haze and volumetric light rays.
Neo-noir aesthetic, visually striking and emotionally evocative."""
    },
    {
        "name": "Minimalist Tech",
        "template": """A minimalist, tech-forward visualization of {concept}.
Clean white or dark gradient background with precise subject placement.
Subtle ambient occlusion shadows grounding the elements.
Sleek, Apple-inspired product photography aesthetic.
Precise geometry, perfect symmetry, intentional negative space.
Premium, sophisticated, and effortlessly modern."""
    },
    {
        "name": "Vibrant Pop Art",
        "template": """A vibrant pop art interpretation of {concept}.
Bold, saturated colors with high contrast and sharp edges.
Ben-Day dots, halftone patterns, and comic book influences.
Dynamic composition with energetic diagonal lines.
Warhol and Lichtenstein inspired, playful yet impactful.
Eye-catching and memorable, perfect for grabbing attention."""
    }
]


def generate_diverse_prompts(concept: str, count: int = 4) -> list[dict]:
    """Generate diverse prompts from different style templates."""
    import random

    # Select diverse styles
    selected_styles = random.sample(STYLE_TEMPLATES, min(count, len(STYLE_TEMPLATES)))

    prompts = []
    for style in selected_styles:
        prompt = style["template"].format(concept=concept)
        prompts.append({
            "style": style["name"],
            "prompt": prompt.strip()
        })

    return prompts


def generate_variations(
    concept: str,
    count: int = 4,
    aspect_ratio: str = "16:9",
    output_dir: str = "assets/variations",
    model: str = "gemini-3-pro-image-preview"
) -> list[dict]:
    """Generate multiple image variations with different styles."""

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate timestamp for this batch
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Generate diverse prompts
    prompts = generate_diverse_prompts(concept, count)

    print(f"Generating {len(prompts)} diverse interpretations...")
    print(f"Concept: {concept}")
    print(f"Aspect ratio: {aspect_ratio}")
    print()

    generated_files = []

    # Build config
    config_kwargs = {"response_modalities": ["TEXT", "IMAGE"]}
    if aspect_ratio:
        config_kwargs["image_config"] = types.ImageConfig(aspect_ratio=aspect_ratio)
    config = types.GenerateContentConfig(**config_kwargs)

    for i, prompt_data in enumerate(prompts):
        style_name = prompt_data["style"]
        prompt = prompt_data["prompt"]

        print(f"  [{i + 1}/{len(prompts)}] {style_name}...", end=" ", flush=True)

        try:
            response = client.models.generate_content(
                model=model,
                contents=[prompt],
                config=config,
            )

            # Extract image from response
            for part in response.parts:
                if part.inline_data is not None:
                    image = part.as_image()

                    # Save with style name in filename
                    safe_style = style_name.lower().replace(" ", "-")
                    filename = f"variation_{timestamp}_{i + 1:02d}_{safe_style}.jpg"
                    filepath = output_path / filename
                    image.save(filepath)

                    generated_files.append({
                        "filepath": filepath,
                        "filename": filename,
                        "style": style_name,
                        "prompt": prompt
                    })
                    print(f"✓")
                    break
            else:
                print("✗ No image in response")

        except Exception as e:
            print(f"✗ Error: {e}")

    print()
    print(f"Generated {len(generated_files)} images in {output_path}/")

    return generated_files


def create_gallery_html(
    generated_files: list[dict],
    concept: str,
    output_path: str = "assets/variations/gallery.html"
) -> Path:
    """Create an HTML gallery for selecting among variations."""

    gallery_path = Path(output_path)

    # Build image cards HTML with style info
    image_cards = []
    for i, file_data in enumerate(generated_files):
        card = f'''
        <div class="image-card" data-index="{i}" data-filename="{file_data['filename']}" data-style="{file_data['style']}">
            <img src="{file_data['filename']}" alt="{file_data['style']}">
            <div class="card-overlay">
                <span class="card-style">{file_data['style']}</span>
            </div>
            <div class="selected-badge">✓ Selected</div>
            <div class="style-badge">{file_data['style']}</div>
        </div>'''
        image_cards.append(card)

    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Image Variations</title>
    <style>
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        body {{
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            padding: 2rem;
            color: #e4e4e7;
        }}

        .container {{
            max-width: 1600px;
            margin: 0 auto;
        }}

        header {{
            text-align: center;
            margin-bottom: 2rem;
        }}

        h1 {{
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}

        .subtitle {{
            color: #a1a1aa;
            font-size: 1rem;
        }}

        .concept-display {{
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 2rem;
            font-style: italic;
            color: #a1a1aa;
        }}

        .gallery {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
        }}

        @media (max-width: 1200px) {{
            .gallery {{
                grid-template-columns: 1fr;
            }}
        }}

        .image-card {{
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid transparent;
            background: rgba(255, 255, 255, 0.05);
        }}

        .image-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }}

        .image-card.selected {{
            border-color: #667eea;
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
        }}

        .image-card img {{
            width: 100%;
            height: auto;
            display: block;
        }}

        .card-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: flex-end;
            padding: 1.5rem;
        }}

        .image-card:hover .card-overlay {{
            opacity: 1;
        }}

        .card-style {{
            font-size: 1.25rem;
            font-weight: 600;
            color: white;
        }}

        .style-badge {{
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.875rem;
        }}

        .selected-badge {{
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #667eea;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.875rem;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        }}

        .image-card.selected .selected-badge {{
            opacity: 1;
            transform: scale(1);
        }}

        .feedback-section {{
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }}

        .feedback-section h2 {{
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: #e4e4e7;
        }}

        textarea {{
            width: 100%;
            min-height: 100px;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            color: #e4e4e7;
            font-family: inherit;
            font-size: 1rem;
            resize: vertical;
        }}

        textarea:focus {{
            outline: none;
            border-color: #667eea;
        }}

        .actions {{
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }}

        button {{
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }}

        .btn-primary {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}

        .btn-primary:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }}

        .btn-primary:disabled {{
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }}

        .btn-secondary {{
            background: rgba(255, 255, 255, 0.1);
            color: #e4e4e7;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }}

        .btn-secondary:hover {{
            background: rgba(255, 255, 255, 0.2);
        }}

        .output {{
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.875rem;
            white-space: pre-wrap;
            display: none;
        }}

        .output.visible {{
            display: block;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Select Your Image Variation</h1>
            <p class="subtitle">4 unique interpretations with different artistic styles</p>
        </header>

        <div class="concept-display">
            <strong>Concept:</strong> {concept}
        </div>

        <div class="gallery">
            {"".join(image_cards)}
        </div>

        <div class="feedback-section">
            <h2>Feedback for Iteration (optional)</h2>
            <textarea id="feedback" placeholder="Describe refinements... e.g., 'I like the cinematic style but make it warmer' or 'Try a more abstract approach'"></textarea>
        </div>

        <div class="actions">
            <button class="btn-primary" id="confirmBtn" disabled>Confirm Selection</button>
            <button class="btn-secondary" id="iterateBtn">Generate New Variations with Feedback</button>
        </div>

        <pre class="output" id="output"></pre>
    </div>

    <script>
        let selectedCard = null;
        const cards = document.querySelectorAll('.image-card');
        const confirmBtn = document.getElementById('confirmBtn');
        const iterateBtn = document.getElementById('iterateBtn');
        const feedback = document.getElementById('feedback');
        const output = document.getElementById('output');

        cards.forEach(card => {{
            card.addEventListener('click', () => {{
                if (selectedCard) {{
                    selectedCard.classList.remove('selected');
                }}
                card.classList.add('selected');
                selectedCard = card;
                confirmBtn.disabled = false;
            }});
        }});

        confirmBtn.addEventListener('click', () => {{
            if (!selectedCard) return;

            const selection = {{
                action: 'select',
                filename: selectedCard.dataset.filename,
                style: selectedCard.dataset.style,
                index: parseInt(selectedCard.dataset.index),
                feedback: feedback.value.trim()
            }};

            output.textContent = JSON.stringify(selection, null, 2);
            output.classList.add('visible');

            navigator.clipboard.writeText(JSON.stringify(selection));
            alert('Selection copied to clipboard! Paste this back to Claude.');
        }});

        iterateBtn.addEventListener('click', () => {{
            const selection = {{
                action: 'iterate',
                filename: selectedCard ? selectedCard.dataset.filename : null,
                style: selectedCard ? selectedCard.dataset.style : null,
                index: selectedCard ? parseInt(selectedCard.dataset.index) : null,
                feedback: feedback.value.trim()
            }};

            if (!selection.feedback) {{
                alert('Please provide feedback for iteration.');
                return;
            }}

            output.textContent = JSON.stringify(selection, null, 2);
            output.classList.add('visible');

            navigator.clipboard.writeText(JSON.stringify(selection));
            alert('Iteration request copied to clipboard! Paste this back to Claude.');
        }});
    </script>
</body>
</html>'''

    gallery_path.write_text(html_content)
    print(f"Created gallery: {gallery_path}")

    return gallery_path


def main():
    parser = argparse.ArgumentParser(description="Generate diverse slide image variations")
    parser.add_argument("--prompt", required=True, help="Slide concept description")
    parser.add_argument("--count", type=int, default=4, help="Number of style variations (2-8)")
    parser.add_argument("--aspect-ratio", default="16:9", help="Image aspect ratio")
    parser.add_argument("--output-dir", default="assets/variations", help="Output directory")
    parser.add_argument("--model", default="gemini-3-pro-image-preview", help="Gemini model")

    args = parser.parse_args()

    # Validate count
    if args.count < 2 or args.count > 8:
        print("Error: Count must be between 2 and 8")
        sys.exit(1)

    # Generate variations
    generated_files = generate_variations(
        concept=args.prompt,
        count=args.count,
        aspect_ratio=args.aspect_ratio,
        output_dir=args.output_dir,
        model=args.model
    )

    if generated_files:
        # Create gallery
        gallery_path = create_gallery_html(
            generated_files,
            args.prompt,
            output_path=f"{args.output_dir}/gallery.html"
        )

        # Output summary as JSON
        summary = {
            "images": [
                {
                    "filepath": str(f["filepath"]),
                    "style": f["style"],
                    "prompt": f["prompt"][:100] + "..." if len(f["prompt"]) > 100 else f["prompt"]
                }
                for f in generated_files
            ],
            "gallery": str(gallery_path),
            "concept": args.prompt,
            "count": len(generated_files)
        }

        print()
        print("=== SUMMARY ===")
        print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
