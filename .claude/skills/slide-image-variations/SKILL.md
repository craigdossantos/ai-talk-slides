---
name: slide-image-variations
description: This skill should be used when generating images for presentation slides using Gemini. It creates 4-8 variations, presents them in an interactive HTML gallery for selection, and supports iterative refinement based on feedback. Triggers on requests like "create slide image", "generate variations for my slide", or "make images for the presentation".
---

# Slide Image Variations

Generate multiple image variations for presentation slides using Gemini, then select the best one through an interactive gallery.

## Workflow

### Step 1: Gather Slide Context

Collect the following information:

- **Slide title**: The heading or topic of the slide
- **Slide notes/content**: Key points or speaker notes that inform the image
- **Style preferences**: Any specific aesthetic direction (optional)
- **Aspect ratio**: Default is 16:9 for presentations

### Step 2: Craft the Prompt

Transform slide context into an effective image generation prompt:

```
Create a [style] illustration for a presentation slide about [topic].
The slide covers: [key points from notes]
Style: [professional/abstract/photorealistic/minimal/etc.]
Mood: [energetic/calm/serious/playful/etc.]
```

Prompt tips:

- Be specific about visual elements
- Include mood and atmosphere
- Mention what to avoid if needed
- Keep prompts under 200 words

### Step 3: Generate Variations

Run the generation script:

```bash
python scripts/generate_variations.py \
  --prompt "Your crafted prompt here" \
  --count 6 \
  --aspect-ratio 16:9 \
  --output-dir assets/variations
```

Parameters:

- `--count`: Number of variations (4-8 recommended, max 10)
- `--aspect-ratio`: `16:9` (slides), `1:1` (square), `4:3` (classic)
- `--output-dir`: Where to save images (default: `assets/variations`)

The script outputs:

1. Generated images in the output directory
2. An HTML gallery at `assets/variations/gallery.html`
3. A JSON summary of all generated files

### Step 4: Present the Gallery

Open the HTML gallery for the user to review variations:

```bash
open assets/variations/gallery.html
```

The gallery allows the user to:

- View all variations side-by-side
- Click to select their preferred image
- Enter feedback for iteration
- Copy selection data to clipboard

### Step 5: Process User Selection

The user will provide a JSON selection from the gallery:

```json
{
  "action": "select",
  "filename": "variation_20240107_143022_03.jpg",
  "index": 2,
  "feedback": ""
}
```

**If action is "select"**: Copy the chosen image to the final location:

```bash
cp assets/variations/[filename] assets/images/[descriptive-name].jpg
```

Name the file descriptively based on the slide content (e.g., `slide-03-ai-workflow.jpg`).

**If action is "iterate"**: Use the feedback to refine the prompt and generate new variations. Incorporate the feedback directly:

```bash
python scripts/generate_variations.py \
  --prompt "Original prompt. Additional direction: [user feedback]" \
  --count 6 \
  --aspect-ratio 16:9
```

### Step 6: Clean Up (Optional)

After final selection, offer to clean up the variations folder:

```bash
rm -f assets/variations/variation_*.jpg assets/variations/gallery.html
```

## Example Session

**User**: Create an image for my slide about "The AI Learning Curve"

**Process**:

1. Ask for slide notes/key points
2. Craft prompt: "Create a modern illustration showing a learning curve graph transforming into a rocket ship, representing accelerated AI skill acquisition. Professional tech aesthetic with blue and purple gradients. Minimal, clean design suitable for a presentation."
3. Generate 6 variations
4. Open gallery for selection
5. User selects variation 4 with feedback "love it but make the rocket more prominent"
6. Either use as-is or iterate based on feedback
7. Copy final image to `assets/images/slide-ai-learning-curve.jpg`

## Requirements

- `GEMINI_API_KEY` environment variable must be set
- Python packages: `google-genai`, `Pillow`

Install dependencies:

```bash
pip install google-genai Pillow
```

## Model

Uses **Nano Banana Pro** (`gemini-3-pro-image-preview`) by default - Google's most advanced image model with:

- Superior photorealism and text rendering
- Detailed control (lighting, camera angles)
- 4K resolution support
- Consistency for complex professional tasks

For faster generation (lower quality), use `--model gemini-2.5-flash-image`.

## Resources

### scripts/

- `generate_variations.py` - Main script for generating image variations and creating the selection gallery
