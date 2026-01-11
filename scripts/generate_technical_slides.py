#!/usr/bin/env python3
"""Generate 11 slide images for the technical track using Gemini API."""

import os
import time
from google import genai
from google.genai import types

# Initialize client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Output directory
OUTPUT_DIR = "/Users/craigdossantos/Coding/ai-talk-slides/assets/images"

# Ada character description (consistent across all images)
ADA_DESC = """Young woman named Ada, mid-20s, short asymmetrical hair with electric purple tips, thick black-rimmed glasses, freckles across her nose. Wearing a modern purple hoodie and high-top sneakers. She has a flowing cape with glowing blue neural network patterns woven into the fabric."""

# Style description (consistent across all images)
STYLE_DESC = """Clean bold black outlines, not too busy. Color palette: electric blue, red, yellow, black, white. Subtle Ben-Day dots in background only. Main subject POPS against the background."""

# Define all 11 slides with their prompts
SLIDES = [
    {
        "filename": "slide-16-entering-technical-track.jpg",
        "caption": "ENTERING THE TECHNICAL TRACK",
        "scene": f"""{ADA_DESC} Confident expression. Ada stands before a massive glowing terminal/command line interface that forms an archway or gateway. The terminal displays code and commands. Behind her is the colorful world of chat interfaces, in front through the gateway is a more structured world of code and systems."""
    },
    {
        "filename": "slide-17-level-1-cli-basics.jpg",
        "caption": "COMMAND LINE BASICS",
        "scene": f"""{ADA_DESC} Ada stands confidently in front of a large terminal window showing basic commands like "cd", "ls", "pwd". From the terminal, glowing lines connect out to icons representing files, folders, photos, and apps on her computer. The terminal is a portal to everything."""
    },
    {
        "filename": "slide-18-level-2-git-github.jpg",
        "caption": "VERSION CONTROL",
        "scene": f"""{ADA_DESC} Ada gestures toward a visual representation of Git branches - a tree-like structure with glowing branches merging and splitting. On one side, a Dropbox-like cloud icon with the GitHub logo. On the other, documents with "Save" buttons showing version history. The parallel is clear - familiar concepts in new form."""
    },
    {
        "filename": "slide-19-level-3-ai-native-ides.jpg",
        "caption": "AI-NATIVE IDEs",
        "scene": f"""{ADA_DESC} Ada sits at a futuristic workstation showing a split-screen IDE - on the left, a chat window with AI conversation; on the right, code files being written and edited. The two panels show the feedback loop - Ada types in chat, code appears on the other side."""
    },
    {
        "filename": "slide-20-level-4-modes-workflows.jpg",
        "caption": "MODES AND WORKFLOWS",
        "scene": f"""{ADA_DESC} Ada stands at the center of a circular workflow diagram showing: PLAN → BUILD → TEST → REVIEW → DEPLOY → BUG FIX → back to PLAN. At each step, a small version of an AI assistant appears in a different "mode" or pose - planning mode wears glasses, build mode has tools, test mode has a checklist."""
    },
    {
        "filename": "slide-21-level-5-software-lifecycle.jpg",
        "caption": "FULL SOFTWARE LIFECYCLE",
        "scene": f"""{ADA_DESC} Ada gestures triumphantly as code/an app launches from her laptop up through clouds toward a globe/world. Icons for databases, deployment platforms, and cloud services float around the deployment path. The journey from local laptop to live website for real users."""
    },
    {
        "filename": "slide-22-level-6-customizing-harness.jpg",
        "caption": "CUSTOMIZING THE HARNESS",
        "scene": f"""{ADA_DESC} Ada is wearing a skydiving-style harness, but instead of a parachute, attached to the harness are glowing components labeled: "SKILLS", "SLASH COMMANDS", "SUB-AGENTS", "INSTRUCTIONS", "HOOKS". She's confidently preparing to jump, fully equipped with her customized AI toolkit."""
    },
    {
        "filename": "slide-23-level-7-context-management.jpg",
        "caption": "CONTEXT MANAGEMENT",
        "scene": f"""{ADA_DESC} Ada stands next to a large bucket being filled with structured blocks of context (labeled: "chat history", "code", "docs"). The bucket has a line near the top - above the line, context overflows and spills. Below the bucket, a brain creating art on a canvas - as overflow splashes down, the painting becomes messy. Context overflow leads to degraded output."""
    },
    {
        "filename": "slide-24-level-8-parallel-agents.jpg",
        "caption": "PARALLEL AGENTS",
        "scene": f"""{ADA_DESC} Ada stands in the center, arms outstretched like a conductor. Around her, 4 smaller AI agents (represented as glowing humanoid figures with screens for heads) work on different tasks simultaneously - one writes code, one tests, one reviews, one deploys. Lines of work flow from each agent back to Ada as the orchestrator."""
    },
    {
        "filename": "slide-25-level-9-swarms.jpg",
        "caption": "SWARMS AND INFRASTRUCTURE",
        "scene": f"""{ADA_DESC} Ada stands heroically with eyes closed and arms outstretched, conducting a massive swarm of robotic bees. The bees are small AI agents with glowing circuit patterns. They swarm around a large server/cloud infrastructure in the sky. Ada is the superhero orchestrating an army of AI workers that never sleep."""
    },
    {
        "filename": "slide-26-closing.jpg",
        "caption": "THE ONLY WAY FORWARD IS THROUGH",
        "scene": f"""{ADA_DESC} Ada takes a confident step forward through a doorway of light. Behind her is darkness/uncertainty. In front of her is a bright path filled with possibility - glowing tools, connections, knowledge. Her cape billows dramatically. She's not looking back, only forward. Triumphant and determined."""
    },
]


def generate_image(slide_info: dict) -> bool:
    """Generate a single slide image."""
    filename = slide_info["filename"]
    caption = slide_info["caption"]
    scene = slide_info["scene"]

    # Build the full prompt
    prompt = f"""Pop art comic book illustration, 16:9 aspect ratio.

{scene}

{STYLE_DESC}

Bold caption in angular speech bubble: "{caption}"
"""

    print(f"\n{'='*60}")
    print(f"Generating: {filename}")
    print(f"Caption: {caption}")
    print(f"{'='*60}")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image-preview",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE'],
                image_config=types.ImageConfig(
                    aspect_ratio="16:9",
                ),
            ),
        )

        # Save the image
        for part in response.parts:
            if part.inline_data:
                image = part.as_image()
                output_path = os.path.join(OUTPUT_DIR, filename)
                image.save(output_path)
                print(f"✓ Saved: {output_path}")
                return True
            elif part.text:
                print(f"Response text: {part.text}")

        print(f"✗ No image generated for {filename}")
        return False

    except Exception as e:
        print(f"✗ Error generating {filename}: {e}")
        return False


def main():
    """Generate all 11 slide images."""
    print("Starting image generation for 11 technical track slides...")
    print(f"Output directory: {OUTPUT_DIR}")

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    success_count = 0
    failed_slides = []

    for i, slide in enumerate(SLIDES, 1):
        print(f"\n[{i}/11] Processing {slide['filename']}...")

        if generate_image(slide):
            success_count += 1
        else:
            failed_slides.append(slide['filename'])

        # Brief pause between requests to avoid rate limiting
        if i < len(SLIDES):
            time.sleep(2)

    # Summary
    print(f"\n{'='*60}")
    print("GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"Successfully generated: {success_count}/11 images")

    if failed_slides:
        print(f"\nFailed slides:")
        for slide in failed_slides:
            print(f"  - {slide}")
    else:
        print("\nAll images generated successfully!")


if __name__ == "__main__":
    main()
