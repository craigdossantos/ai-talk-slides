#!/usr/bin/env python3
"""Generate 4 title slide image options using Gemini API (Nano Banana)"""

import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Output directory
output_dir = "/Users/craigdossantos/conductor/workspaces/conductor-playground/hangzhou/assets/images"
os.makedirs(output_dir, exist_ok=True)

prompts = [
    # Option 1: User's direction - comparative scene
    """A split-scene cinematic illustration comparing two eras of work.
    LEFT SIDE: A person hunched over a desk with a physical notepad and an old CRT computer showing green monospace text on black screen, dim lighting, isolated, working alone.
    RIGHT SIDE: A person standing confidently, arms raised, orchestrating a massive luminous sphere floating above them. The sphere contains interconnected glowing nodes representing digital workers, computers, startup logos, and data streams. The person appears to be conducting this constellation of AI-powered possibility like a maestro.
    Style: Modern conceptual art, dramatic lighting, deep blue and purple tones with warm orange accents, cinematic composition, professional presentation quality.""",

    # Option 2: My take - Evolution/transformation metaphor
    """A single figure transforming mid-stride. On the left side of their body, they appear as a traditional office worker carrying a heavy briefcase full of papers. On the right side, they are becoming luminous, with their arm extended upward releasing a flock of glowing geometric birds that transform into abstract AI symbols and code fragments.
    Style: Surrealist digital art, gradient from muted earth tones to vibrant electric blue and purple, dynamic motion, ethereal lighting, professional and sophisticated.""",

    # Option 3: My take - Mountain/levels metaphor (ties to "leveling up")
    """A person standing at the base of a translucent crystalline mountain, looking upward. The mountain has visible levels/platforms spiraling upward, each level glowing with different capabilities: chat bubbles at the bottom, then tools, then multiple agent figures, then at the peak a brilliant sun-like burst representing mastery. A glowing path illuminates the way up.
    Style: Epic fantasy meets tech aesthetic, dramatic scale, rich purples and blues with golden highlights, inspired by video game concept art, aspirational and empowering.""",

    # Option 4: My take - Hands/capability expansion
    """A pair of human hands in the center of the frame, palms up. From the hands, dozens of translucent holographic arms extend outward in all directions, each performing different tasks: coding, designing, writing, analyzing data, building. The holographic arms are connected by subtle luminous threads back to the central human hands, suggesting orchestration and control.
    Style: Clean modern illustration, dark background, hands rendered realistically, holographic elements in cyan and magenta, elegant and powerful, minimal but impactful.""",
]

for i, prompt in enumerate(prompts, 1):
    print(f"Generating image {i}/4...")
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
                image_size="2K"
            ),
        ),
    )

    for part in response.parts:
        if part.inline_data:
            img = part.as_image()
            output_path = f"{output_dir}/title_option_{i}.jpg"
            img.save(output_path)
            print(f"  Saved: {output_path}")
        elif part.text:
            print(f"  Model said: {part.text[:100]}...")

print("\nDone! All 4 images generated.")
