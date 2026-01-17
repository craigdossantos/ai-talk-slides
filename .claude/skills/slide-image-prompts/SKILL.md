---
name: slide-image-prompts
description: Generate tailored image prompts for presentation slides featuring Ada, a consistent character, in pop art comic style. Use this skill when creating slide images, when asked for "slide image prompts", or when generating visuals for the AI talk presentation.
---

# Slide Image Prompts

Generate 4 unique, creative image prompts for presentation slides featuring Ada (a consistent character) in a pop art comic book style.

## When to Use

- User provides slide content (title, talking points, visual suggestions)
- User asks for "slide image prompts" or "generate prompts for slide X"
- User wants to create slide images for the presentation

## Workflow

### Step 1: Understand the Slide

Read the slide content and understand:

1. **The slide's core message** - What's the key takeaway?
2. **Where it fits in the talk** - See `references/talk-outline.md`
3. **The emotion/energy** - Is it inspiring? Cautionary? Informative?

### Step 2: Generate 4 Unique Prompts

Each prompt must include:

1. **Ada character description** (from `references/character.md`) - keep consistent
2. **Scene description** - unique per variation, tailored to the slide's message
3. **Pop art style specification** (from `references/style.md`) - keep consistent
4. **Slide title as caption** - in a speech bubble or bold caption

**Critical**: Each variation should be conceptually different, not just minor tweaks:

| Variation | Approach                                          |
| --------- | ------------------------------------------------- |
| 1         | Direct visual metaphor for the slide's concept    |
| 2         | Ada demonstrating/teaching the concept            |
| 3         | Before/after or transformation scene              |
| 4         | Unexpected/creative interpretation of the concept |

### Step 3: Output Format

Provide prompts in this format:

```
## Prompt 1: [Brief concept description]

[Full prompt text ready for Nano Banana]

---

## Prompt 2: [Brief concept description]

[Full prompt text]

---

## Prompt 3: [Brief concept description]

[Full prompt text]

---

## Prompt 4: [Brief concept description]

[Full prompt text]
```

## Prompt Structure

Each prompt should follow this structure:

```
Pop art comic book illustration, 16:9 aspect ratio.

[Ada character block - see references/character.md]

[Scene description - unique to this variation]

[Style block - see references/style.md]

Caption in bold speech bubble: "[SLIDE TITLE]"
```

## Example

**Slide**: "Mental Models, Not Magic"
**Talking Points**: This talk is about mental models for AI, not specific tools. Understanding HOW to think about AI matters more than which app to use.

**Prompt 1: Ada with a glowing mental map**

```
Pop art comic book illustration, 16:9 aspect ratio.

Young woman named Ada, mid-20s, short asymmetrical hair with electric purple tips, thick black-rimmed glasses, freckles across her nose. Wearing a modern purple hoodie and high-top sneakers. She has a flowing cape with glowing blue neural network patterns woven into the fabric. Confident and approachable expression.

Ada stands in front of a massive glowing holographic brain made of interconnected nodes and pathways. She's pointing at different sections while neural connections light up. Behind her, shadows of various AI logos (representing "tools") are small and dim compared to the bright mental map she's illuminating.

Clean bold black outlines, not too busy. Color palette: electric blue, red, yellow, black, white. Subtle Ben-Day dots in background only. Main subject POPS against the background.

Bold caption in angular speech bubble: "MENTAL MODELS, NOT MAGIC"
```

## Resources

### references/

- `character.md` - Ada's complete visual description (use verbatim in prompts)
- `style.md` - Pop art style specifications (use verbatim in prompts)
- `talk-outline.md` - Full talk structure for context

## Integration with Nano Banana

After generating prompts, use the `slide-image-variations` skill or Nano Banana directly:

```bash
python .claude/skills/slide-image-variations/scripts/generate_variations.py \
  --prompt "[Your generated prompt]" \
  --count 4 \
  --aspect-ratio 16:9
```

Or generate each prompt variation individually for more control.
