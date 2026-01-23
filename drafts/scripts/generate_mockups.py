#!/usr/bin/env python3
"""Generate 10 UI design mockups using Gemini API"""

import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

prompts = [
    {
        "name": "01-constellation-navigator",
        "prompt": "UI screenshot of a presentation canvas application with a deep space black background filled with subtle star field texture. Presentation slides appear as glowing celestial bodies - major sections are larger golden suns with radiating halos, individual slides are smaller blue-white stars connected by delicate constellation lines in silver. The layout follows actual constellation patterns with generous spacing between clusters. A subtle nebula gradient in deep purple and teal provides depth. Floating navigation shows current sector with a circular star map minimap. Resources appear as small orbiting moons around their parent slides. Typography uses elegant thin sans-serif in white. The overall feel is like navigating a beautiful star chart."
    },
    {
        "name": "02-topographic-journey",
        "prompt": "UI screenshot of a presentation canvas designed like a vintage topographic map. Warm cream/parchment background with brown contour lines creating elevation zones. Major sections are mountain peaks with decorative illustrated icons, slides flow downhill like a river path in deep teal blue. Connected resources branch off as tributaries. Hand-drawn style annotations and compass rose in the corner. Section labels use vintage serif typography with decorative flourishes. The layout uses natural terrain flow - content clusters in valleys, milestone slides on hilltops. A worn paper texture overlay and subtle fold marks add authenticity. Navigation appears as a brass compass widget."
    },
    {
        "name": "03-archipelago-atlas",
        "prompt": "UI screenshot of a presentation canvas styled as an illustrated ocean map. Deep blue gradient background representing water depth with subtle wave patterns. Presentation sections are distinct islands of varying sizes - large continents for major topics, smaller islands for slides, tiny atolls for resources. Sandy beige island shapes with illustrated vegetation. Dotted sailing routes connect islands in flowing curves. Depth zones shown through color gradation from light turquoise shallows to dark navy depths. Playful illustrated elements like tiny boats and sea creatures. Navigation uses a ship's wheel motif. Typography is bold and nautical with rope-textured accents."
    },
    {
        "name": "04-neural-pathways",
        "prompt": "UI screenshot of a presentation canvas resembling a bioluminescent neural network on dark charcoal background. Slides are organic cell-shaped nodes with soft glowing edges in electric cyan and magenta. Connections flow as synaptic tendrils with animated pulse effects, branching naturally like dendrites. Major sections are larger neuron bodies with multiple extending axons. Resources cluster as vesicles near their parent nodes. The layout is asymmetric and organic - no grid, natural clustering and flow. Subtle particle effects suggest neural activity. Rounded, biological shapes throughout. Typography uses a modern humanist font in soft white. The overall effect is alive and breathing."
    },
    {
        "name": "05-blueprint-workshop",
        "prompt": "UI screenshot of a presentation canvas styled as architectural blueprints. Rich Prussian blue background with white technical grid lines. Slides appear as detailed floor plan sections with dimension markers and annotation callouts. Connections are precise orthogonal lines with measurement labels. Major sections have decorative title blocks with borders. Resources appear as detail drawings in circular magnification bubbles. Cross-hatching patterns fill different zones. Technical typography in a monospace engineering font. Corner stamps show revision numbers. Drawing instruments (compass, ruler) as subtle decorative elements. The layout uses precise technical spacing and alignment with generous margins."
    },
    {
        "name": "06-botanical-garden",
        "prompt": "UI screenshot of a presentation canvas designed as a botanical illustration garden. Soft sage green background with delicate watercolor texture. The main presentation flow grows upward like a central tree trunk, with slides branching off as leaves and flowers at natural intervals. Major sections are larger blooming flowers, individual slides are leaf clusters, resources are small buds or seeds. Elegant vine-like connections with illustrated tendrils. Soft color palette of greens, dusty pinks, and cream. Decorative botanical border elements. Typography uses elegant serif with swash capitals. Scientific name-style labels. Insects and birds as subtle navigation markers. Natural, breathing layout with lots of white space."
    },
    {
        "name": "07-metro-network",
        "prompt": "UI screenshot of a presentation canvas designed as a modern metro transit map. Clean white background with subtle geometric grid. Presentation sections are major transit lines in distinct bold colors (red, blue, yellow, green, orange) following clean horizontal, vertical, and 45-degree paths. Slides are station dots along each line with hover cards showing content. Interchange stations where topics connect. Resources are marked as points of interest with distinctive icons. Typography uses bold geometric sans-serif like the London Underground style. A legend shows the line names. The layout is highly organized but not rigid - lines curve elegantly. Minimal decoration, maximum clarity."
    },
    {
        "name": "08-comic-universe",
        "prompt": "UI screenshot of a presentation canvas designed as a comic book page layout. Bright yellow/cream background with halftone dot texture and dramatic speed lines radiating from center. Slides appear as dynamic comic panels of varying sizes - large dramatic splash panels for key points, smaller sequential panels for details. Bold black panel borders with some panels breaking the grid at dramatic angles. Speech bubble style labels for titles. POW/ZAP style burst shapes highlighting resources. Ben-day dots and action lines throughout. Typography uses bold comic book lettering with 3D drop shadows. Characters or mascots peek from corners. High energy, visual movement, asymmetric panel arrangement."
    },
    {
        "name": "09-gallery-exhibition",
        "prompt": "UI screenshot of a presentation canvas designed as a 3D museum gallery space viewed from above. Dark charcoal floor with subtle wood grain, creating depth. Slides appear as framed artworks floating in 3D space at varying depths and angles, casting soft shadows below. Major sections are gallery rooms with invisible walls suggested by lighting pools. Dramatic spotlight effects illuminate each slide with warm golden light. Resources appear as smaller complementary pieces near main works. Elegant brass placard labels. Navigation uses an elegant gallery map aesthetic. Typography is refined serif in cream/gold. Generous negative space between pieces. The overall feel is sophisticated, curated, and worth exploring."
    },
    {
        "name": "10-editorial-spread",
        "prompt": "UI screenshot of a presentation canvas designed as an editorial magazine spread. Off-white textured paper background with subtle grain. Slides arranged in an asymmetric editorial grid - large hero cards with oversized display typography, medium feature cards, small caption-sized resource cards. Heavy use of typography as design element - large drop caps, pull quotes, varied type sizes. Color accents in deep editorial red and black. Horizontal rules and column dividers. Some slides overlap others at angles. Article-style labels with section names in small caps. Masthead-style title treatment for the presentation name. The layout feels curated and designed with clear visual hierarchy but breaks from rigid grids."
    }
]

def generate_image(name, prompt):
    """Generate a single image and save it"""
    print(f"Generating {name}...")
    try:
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
                # Save as JPG (Gemini returns JPEG)
                output_path = f"/Users/craigdossantos/Coding/ai-talk-slides/UI-plans/{name}.jpg"
                img.save(output_path)
                print(f"  Saved: {output_path}")
                return True
            elif part.text:
                print(f"  Text response: {part.text[:100]}...")

        print(f"  Warning: No image in response for {name}")
        return False
    except Exception as e:
        print(f"  Error generating {name}: {e}")
        return False

if __name__ == "__main__":
    print("Starting mockup generation...")
    print("=" * 50)

    success_count = 0
    for item in prompts:
        if generate_image(item["name"], item["prompt"]):
            success_count += 1
        print()

    print("=" * 50)
    print(f"Generation complete: {success_count}/{len(prompts)} images created")
