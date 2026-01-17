#!/usr/bin/env python3
"""Generate a realistic Metro Network mockup with actual slide content"""

import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

prompt = """Create a UI screenshot of a presentation canvas designed as a modern metro transit map for a presentation called "Using AI as a Native Skill".

EXACT CONTENT TO INCLUDE:

The map should show 6 colored transit lines representing sections:

**RED LINE - "The Widening Gulf" (Introduction)**
Stations in order:
• The Widening Gulf of Technology
• Mental Models Through Use

**YELLOW LINE - "Understanding AI"**
Stations in order:
• New Tech, Old Mental Model
• From Savant to Digital Employee
(Connects from red line)

**GREEN LINE - "Mapping the Journey"**
Stations in order:
• Mapping the Journey
• What It Takes
(Connects from yellow line)

**BLUE LINE - "Non-Technical Track" (Levels 0-8)**
This is the longest line with 9 stations:
• Level 0: Avoidance
• Level 1: AI as Research Portal
• Level 2: AI as Thought Partner
• Level 3: Context Engineering
• Level 4: Using AI Tools
• Level 5: AI-Powered Browsing
• Level 6: Creating Media
• Level 7: AI for Automation
• Level 8: Natural Language Software
(Connects from green line, has resource icons near stations)

**ORANGE LINE - "Technical Track" (Levels 1-9)**
10 stations running parallel/below blue line:
• Level 1: Command Line Interface
• Level 2: Git and GitHub
• Level 3: Agents and AI Coding
• Level 4: Modes and Workflows
• Level 5: Going Live (Deployment)
• Level 6: Customizing the Harness
• Level 7: Context Management
• Level 8: Parallel Agents
• Level 9: Swarms and Infrastructure
(Branches from green line, runs parallel to blue)

**PURPLE LINE - "Closing"**
Single station:
• The Only Way Forward Is Through
(Both blue and orange lines converge here)

VISUAL STYLE:
- Clean white/off-white background with subtle geometric grid
- Bold colored lines following horizontal, vertical, and 45-degree paths like London Underground or NYC subway
- Station dots are circles with station names next to them
- Interchange stations (where lines connect) shown as white circles with colored rings
- Small resource icons (tools, docs) appear as points of interest near relevant stations
- Bold geometric sans-serif typography
- Legend in corner showing all line names with their colors
- "Navigate" button and zoom controls in bottom right
- Title "USING AI AS A NATIVE SKILL" at top left in bold uppercase
- The layout feels spacious with generous whitespace between lines
- Lines curve elegantly at turns, not rigid 90-degree angles
- Some hover cards visible showing station details

Make it look like a real, polished transit map UI - clean, organized, information-dense but readable. The blue and orange lines should run somewhat parallel showing the non-technical and technical tracks as alternative paths to mastery."""

print("Generating realistic Metro Network mockup with actual slide content...")

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
        output_path = "/Users/craigdossantos/Coding/ai-talk-slides/UI-plans/metro-network-realistic.jpg"
        img.save(output_path)
        print(f"Saved: {output_path}")
    elif part.text:
        print(f"Text: {part.text[:200]}...")

print("Done!")
