#!/usr/bin/env python3
"""
Generate images for the new Leveling Up visual styles.
Generates both Animal Crossing Hero and Pixar 3D versions for each test slide.
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
    print("Install with: pip install google-genai")
    sys.exit(1)


# Full prompts for each slide and style
PROMPTS = {
    "slide-04": {
        "title": "From Confidant to Digital Employee",
        "ac-hero": """Warm, rounded illustrated style in the aesthetic of Animal Crossing meets comic book heroism, 16:9 aspect ratio.

A young woman named Ada, mid-20s, with soft rounded features and a warm, inviting smile. Her chin-length wavy hair is honey-blonde with vibrant electric blue tips that catch the light. She wears round tortoiseshell glasses that frame her bright, curious eyes. Distinctive freckles dot her cheeks and nose. She wears a cozy oversized cardigan in soft coral pink over a cream-colored turtleneck, paired with comfortable high-waisted pants and canvas sneakers. Around her shoulders drapes a warm golden-orange cape decorated with glowing constellation patterns. A "Level Up" badge is freshly pinned to her cardigan.

Ada stands confidently in the center of the frame. On her left side, a friendly chat bubble character (soft, rounded, with a gentle face) represents conversation and advice. On her right side, multiple smaller helper characters (cute, round, eager assistants) line up ready for action. Ada gestures with open arms, orchestrating the transition. Her expression shows the "aha moment" of realization - she's becoming a director.

The background transitions from a cozy conversational corner (soft pink, tea cup, books) on the left to an active workspace (warm golden light, floating task icons, progress indicators) on the right.

Art style: Soft rounded shapes, no harsh edges. Warm inviting colors. Gentle cell-shaded quality. The vibe is transformation through friendly progression.

Title in a warm, rounded banner: "FROM CONFIDANT TO DIGITAL EMPLOYEE"
""",
        "pixar": """Pixar-quality 3D rendered illustration with warm, cinematic lighting, 16:9 aspect ratio.

A young woman named Ada rendered in a warm Pixar-style 3D aesthetic, mid-20s with expressive doe eyes behind sleek rectangular glasses with teal frames. Her short, bouncy hair has a natural brown base with playful electric blue highlights. She wears a fitted cream-colored tech jacket with teal geometric panels over a soft white top. A flowing digital cape drapes from her shoulders showing animated progress bars that pulse with teal and gold light.

Ada is captured mid-transformation - on one side of the composition, a friendly chat interface represents the "advisor" phase (soft, glowing, conversational). On the other side, multiple smaller AI agent characters (rendered as cute, helpful assistants in Pixar style) represent the "digital employees" she now directs. Ada stands confidently in the center, her cape billowing as she orchestrates the transition. Her expression shows realization and empowerment.

Three-point lighting with warm key light. The holographic cape displays a skill tree transitioning from "Conversation" to "Execution" with animated arrows. Background shows a workspace that seems to expand and multiply with possibility.

Technical style: Clean 3D render with subsurface scattering, expressive Pixar character design, depth of field softening the edges.

Clean, modern title at bottom: "FROM CONFIDANT TO DIGITAL EMPLOYEE"
"""
    },
    "slide-08": {
        "title": "Level 1 - AI as Uber Google",
        "ac-hero": """Warm, rounded illustrated style in the aesthetic of Animal Crossing meets comic book heroism, 16:9 aspect ratio.

A young woman named Ada, mid-20s, with soft rounded features and a warm, inviting smile. Her chin-length wavy hair is honey-blonde with vibrant electric blue tips. She wears round tortoiseshell glasses, has distinctive freckles, and wears a cozy coral cardigan over cream turtleneck. Her golden-orange constellation cape has just one star lit up - her first achievement. A shiny "Level 1" badge is pinned to her cardigan.

Ada stands at the very beginning of a whimsical skill pathway, pointing forward with an encouraging gesture. Before her stretches a gentle journey of connected nodes - the first one (a friendly search icon) glows brightly as "unlocked," while the rest await in soft outline form. She holds a small glowing question mark icon, representing her first tool - asking AI questions. A cute search bar character and chat bubble float nearby as friendly companions.

Background features soft pastel gradients (warm peach fading to soft sky blue). The pathway winds gently into the distance, showing all the adventures ahead. Progress indicator shows "Level 1 of 8" in warm golden light.

Art style: Soft rounded shapes, cozy and inviting. This is the "starting your adventure" screen - full of possibility and zero intimidation.

Title in a wooden sign or friendly banner: "AI AS UBER GOOGLE"
""",
        "pixar": """Pixar-quality 3D rendered illustration with warm, cinematic lighting, 16:9 aspect ratio.

A young woman named Ada rendered in a warm Pixar-style 3D aesthetic, mid-20s with expressive doe eyes behind sleek teal-framed glasses. Her bouncy brown hair has electric blue highlights. She wears a cream tech jacket with teal accents. Her holographic cape shows a simple progress bar at the very beginning - just starting to fill with warm light.

Ada stands at the entrance of a beautifully rendered skill path. She looks forward with curious excitement, one hand gesturing toward the first glowing node (a search/question icon). The path extends into a warmly-lit digital landscape - nodes representing future skills visible but softened by distance and depth of field. Floating around her are friendly UI elements: a search bar, chat bubble, lightbulb icon.

Three-point lighting creates a sense of new beginning - morning golden hour quality. The environment blends a cozy physical space (warm wood desk, coffee cup) with emerging digital elements.

Technical style: Clean Pixar 3D render, warm and inviting. The composition emphasizes "first step on a journey" - lots of positive space ahead.

Clean title overlay: "LEVEL 1: AI AS UBER GOOGLE"
"""
    },
    "slide-13": {
        "title": "Level 6 - Media & Creative Production",
        "ac-hero": """Warm, rounded illustrated style in the aesthetic of Animal Crossing meets comic book heroism, 16:9 aspect ratio.

A young woman named Ada, mid-20s, with honey-blonde hair and electric blue tips, round tortoiseshell glasses, freckles, coral cardigan. Her golden constellation cape now has SIX stars brightly lit - showing her journey so far. Multiple achievement badges are pinned proudly to her cardigan. A special "Creative Master" badge glows newest.

Ada stands in a creative studio space, surrounded by her work. Floating around her are the fruits of her creative abilities: generated images in cute frames, video clips playing in rounded screens, sparkles of creative magic. She might be actively creating - hands gesturing as colorful particles flow from them into finished works. Her expression is confident and joyful - she's mastered something exciting.

Background is a warm, vibrant creative space - easels, screens, floating galleries of work. Color palette reaches peak vibrancy here - coral, gold, electric blue, creative purples and oranges. Confetti and achievement particles celebrate this milestone.

Art style: Celebratory and accomplished. This is the "creative powers unlocked!" moment. Rich colors, floating creations, maximum warmth.

Title in an artistic, creative banner: "MEDIA & CREATIVE PRODUCTION"
""",
        "pixar": """Pixar-quality 3D rendered illustration with warm, cinematic lighting, 16:9 aspect ratio.

A young woman named Ada rendered in Pixar-style 3D, with brown hair and electric blue highlights, teal-framed glasses, cream tech jacket. Her holographic cape now displays a rich skill tree with many nodes lit up, progress bars mostly filled. Achievement icons float around her shoulders.

Ada stands in a high-tech creative studio, confidently directing the creation of media. Around her float the outputs of her creative abilities: beautifully rendered images in sleek frames, video content playing on holographic screens, 3D models spinning in mid-air. She gestures with creative authority - particles of light flowing from her hands into finished works.

The environment is a gorgeous blend of warm physical studio space (plants, warm wood, comfortable lighting) and advanced creative technology (holographic displays, floating interfaces). Lighting is dramatic but warm - golden key light with creative splashes of teal.

Technical style: Pixar's best creative production quality. Rich detail, warm atmosphere, the sense of "creative mastery achieved."

Elegant title integration: "LEVEL 6: MEDIA & CREATIVE PRODUCTION"
"""
    },
    "closing": {
        "title": "You're Not Behind",
        "ac-hero": """Warm, rounded illustrated style in the aesthetic of Animal Crossing meets comic book heroism, 16:9 aspect ratio.

A young woman named Ada, mid-20s, with honey-blonde hair and electric blue tips, round tortoiseshell glasses, freckles, coral cardigan with many achievement badges. Her golden constellation cape is fully lit with stars, flowing majestically. She stands in a heroic but welcoming pose.

Ada stands at a beautiful overlook point, looking back at the viewer with an encouraging expression. Behind her, the FULL skill journey is visible - a gorgeous winding path with all its nodes, some lit (showing what's been done) and some soft (showing what's possible). The path isn't intimidating - it's inviting. Her posture says "you've got this."

The environment is warm and triumphant - sunrise/golden hour lighting, the path visible below, floating text or banners saying encouraging things like "Learn the next step" and "Ignore the rest." Small companion characters wave encouragingly.

Art style: Ultimate warmth and encouragement. This is the "you belong here" closing. Heroic but accessible, triumphant but welcoming. The visual message: "Your place on this journey is valid, wherever you are."

Title in a grand but friendly banner: "YOU'RE NOT BEHIND"
""",
        "pixar": """Pixar-quality 3D rendered illustration with warm, cinematic lighting, 16:9 aspect ratio.

A young woman named Ada rendered in Pixar-style 3D, brown hair with electric blue highlights, teal-framed glasses, cream tech jacket. Her holographic cape displays the complete skill tree - all possibilities visible, glowing with potential. She stands in a confident, welcoming power pose.

Ada is positioned at a scenic overlook, turning back to reach out a hand to the viewer with an encouraging smile. Behind her stretches the full journey - a beautiful digital landscape showing the complete skill path from beginning to mastery. Some nodes glow brightly (achieved), others shimmer softly (waiting). The path winds through gorgeous terrain that's inviting, not intimidating.

Epic lighting - golden hour, volumetric light rays, the sense of "you've arrived at somewhere good, and there's more ahead when you're ready." The environment combines physical beauty (mountains, sky, warmth) with digital progression elements seamlessly.

Technical style: Pixar's most emotional, triumphant rendering. This is the movie's final frame - hopeful, warm, empowering. Scale suggests possibility without overwhelm.

Inspirational title: "YOU'RE NOT BEHIND"
"""
    }
}


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
    output_dir = Path(__file__).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    generated = []

    for slide_id, slide_data in PROMPTS.items():
        title = slide_data["title"]

        for style_key, prompt in slide_data.items():
            if style_key == "title":
                continue

            style_name = "Animal Crossing Hero" if style_key == "ac-hero" else "Pixar 3D"
            safe_style = style_key

            print(f"Generating {slide_id} - {style_name}...", end=" ", flush=True)

            try:
                image = generate_image(client, prompt)

                if image:
                    filename = f"{slide_id}_{safe_style}_{timestamp}.jpg"
                    filepath = output_dir / filename
                    image.save(filepath)

                    generated.append({
                        "slide": slide_id,
                        "title": title,
                        "style": style_name,
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
    manifest_path = output_dir / f"manifest_{timestamp}.json"
    import json
    with open(manifest_path, 'w') as f:
        json.dump(generated, f, indent=2)
    print(f"\nManifest saved to: {manifest_path}")


if __name__ == "__main__":
    main()
