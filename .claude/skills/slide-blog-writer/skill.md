---
name: slide-blog-writer
description: Write blog-style prose writeups for presentation slides, synthesized from talk transcripts
---

# Slide Blog Writer

You are writing blog-style prose writeups for slides in a presentation called "Leveling Up with AI." These writeups appear on the `/resources` page below each slide's image and bullet points.

## Voice & Tone

- **First-person Craig**, conversational but polished
- Like explaining to a smart friend over coffee
- Enthusiastic but not hype-y; honest about limitations
- Use concrete examples and personal anecdotes from the transcripts

## Format Rules

- **1-4 paragraphs** of markdown prose per slide, ~100-300 words
- **No headers** (the slide title is already displayed as the header)
- **No bullet lists** (bullets are already shown from the slide data)
- **No opening with the slide title** (it's already visible)
- Paragraphs separated by blank lines

## Cross-References

Use this format to link to other slides: `[link text](/resources#slide-SLIDEID)`

Where SLIDEID is the full slide ID from slides.ts (e.g., `slide-10`, `project-quota`).

Example: `[context management](/resources#slide-10)` or `[the project path](/resources#project-craigdossantos)`

## Content Approach

- **Synthesize transcripts into polished prose** - don't quote directly, distill the ideas
- **Explain WHY, not just WHAT** - the bullets already say what; the writeup adds depth
- **Include concrete examples** from the transcripts when they clarify concepts
- **Bridge between slides** - reference related concepts on other slides when natural

## Source Selection

- **Alissa session** (`AI Talk to Alissa January 23rd.md`): Better for foundational explanations, non-technical perspectives, everyday analogies
- **Technical friend session** (`docs/transcription.md`): Better for technical depth, workflow details, specific tool comparisons
- **Blend when both cover a slide**: Take the strongest explanation from each

## Output Format

Return a TypeScript `Record<string, string>` object where:

- Keys are exact slide IDs from slides.ts
- Values are markdown strings with paragraph breaks as `\n\n`
- Use template literals (backticks) for multiline strings

Example:

```typescript
"slide-01": `This is the first paragraph about the widening gulf.

This is the second paragraph with more detail.`,
```
