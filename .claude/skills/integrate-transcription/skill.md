---
name: integrate-transcription
description: Integrate a new talk transcription into slide writeups -- from audio/video recording or existing markdown
---

# Integrate Transcription

You are integrating content from a new talk run into the slide writeups on the `/resources` page. Craig gives this talk multiple times to different audiences, and each run produces new anecdotes, explanations, and emphasis that should be folded into the existing writeups.

## Two Entry Points

### A. From a Recording (audio/video file)

1. **Transcribe** using Whisper or Claude's audio capabilities:
   - If the user provides an audio file (`.m4a`, `.mp3`, `.wav`, etc.), use Claude Code to transcribe it
   - If the file is too large for direct processing, use FFmpeg to split it into chunks first:
     ```bash
     ffmpeg -i input.m4a -f segment -segment_time 600 -c copy chunk_%03d.m4a
     ```
   - Transcribe each chunk and concatenate the results

2. **Format the transcription** as structured Markdown following the convention in `docs/transcription.md`:
   - Top-level heading with session name and date
   - `## Section:` headers matching the presentation sections
   - `### Slide N: Title` headers for each slide discussed
   - `>` blockquotes for Craig's key quotes
   - `_[Editorial notes]_` for context about delivery, demos, or tangents
   - Speaker labels (`**Speaker 1:**`, `**Craig:**`, etc.) for multi-speaker conversations

3. **Save** the transcription to `docs/` with a descriptive filename:
   - Convention: `transcription-{audience}-{date}.md`
   - Example: `transcription-design-team-2026-02-15.md`

### B. From Existing Markdown

If Craig provides an already-transcribed Markdown file, skip to the integration step below. Read the file to understand its structure and content.

## Integration Workflow

### Step 1: Inventory What Changed

Read the new transcription and the existing writeups to build a change list.

**Files to read:**

- The new transcription (provided by user)
- `react-flow-app/src/data/slideWriteups.ts` (current writeups)
- `react-flow-app/src/data/slides.ts` (slide metadata -- IDs, titles, bullets, sections)
- `.claude/skills/slide-blog-writer/skill.md` (writing voice/format guidelines)

**For each slide discussed in the new transcription, categorize it as one of:**

| Category            | Criteria                                                                                            | Action                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **New slide**       | Slide ID exists in `slides.ts` but has no entry in `slideWriteups.ts`                               | Write a new writeup from scratch                               |
| **Richer content**  | Existing writeup, but new transcription has better anecdotes, clearer explanations, or new examples | Update the writeup to incorporate the new material             |
| **Same content**    | New transcription covers the same ground as existing writeup, no new insights                       | Skip -- do not rewrite for the sake of rewriting               |
| **New emphasis**    | Craig spent more time on this slide than before, or framed it differently for this audience         | Consider updating if the new framing is stronger or adds depth |
| **Slide removed**   | Slide discussed in transcription but no longer in `slides.ts`                                       | Skip entirely                                                  |
| **New slide added** | New slide ID in `slides.ts` that wasn't there before                                                | Write a new writeup if the transcription covers it             |

Present this inventory to the user before making changes. Format it as a table:

```
| Slide ID | Category | What's New |
|----------|----------|------------|
| slide-03 | Richer content | New analogy about GPS vs map for hallucinations |
| slide-17 | New slide | Entirely new slide on prompt libraries |
| slide-10 | Same content | Same context window explanation |
```

### Step 2: Write or Update Writeups

After user approval of the inventory, update `slideWriteups.ts`.

**Follow the `slide-blog-writer` skill guidelines exactly:**

- First-person Craig voice, conversational but polished
- 1-4 paragraphs per slide, ~100-300 words
- No headers, no bullet lists, no opening with the slide title
- Cross-references: `[link text](/resources#slide-SLIDEID)` or `[link text](/resources#project-SLIDEID)`
- Explain WHY, not just WHAT (bullets already cover what)

**When UPDATING an existing writeup:**

- Do NOT rewrite from scratch unless the new version would be dramatically better
- Blend new material into existing prose naturally
- Preserve existing cross-references unless they're broken
- Preserve existing anecdotes and examples -- add to them, don't replace
- If the new transcription has a clearly stronger explanation, swap it in
- Keep the total length in the 100-300 word range -- if adding new material, trim elsewhere
- Never duplicate content that's already in the slide's `bullets` or `title`

**When WRITING a new writeup:**

- Read ALL available transcriptions for that slide (listed in the source registry below)
- Take the strongest explanation from each source
- Follow the slide-blog-writer skill fully

### Step 3: Batching Strategy for Subagents

If updating more than 5 slides, use parallel subagents. Each subagent should:

1. Receive the full new transcription
2. Receive relevant sections of existing transcriptions
3. Receive the current writeup for each assigned slide (if one exists)
4. Receive the slide metadata (title, bullets, subtitle)
5. Know whether each slide is "new writeup" or "update existing"

Batch by presentation section:

- Intro + Understanding + Mapping (slides 01-07)
- Non-Tech first half (slides 08-12)
- Non-Tech second half (slides 13-15b)
- Tech first half (slides 16-20)
- Tech second half + Closing (slides 21-26)
- Projects (project-\*)

Each subagent should output the complete updated entries for its batch as TypeScript template literal strings in `Record<string, string>` format.

### Step 4: Assemble and Verify

1. **Assemble** all subagent outputs into `slideWriteups.ts`
   - For updated slides, replace the existing entry with the new version
   - For new slides, add the entry in the correct position (ordered by slide ID)
   - For unchanged slides, keep the existing entry exactly as-is

2. **Verify cross-references** -- every `(/resources#slide-XXXXX)` link should reference a valid slide ID in `slides.ts`

3. **Build check**: Run `npm run build` from `react-flow-app/` to verify TypeScript compiles

4. **No test changes expected** -- writeups are data-only, existing tests should still pass

### Step 5: Update the Source Registry

Add the new transcription to the registry below so future runs know what sources exist.

## Source Registry

This is the authoritative list of all transcription sources. Update it whenever a new one is integrated.

| #   | Filename                            | Location                                                            | Date       | Audience                                   | Notes                                                                               |
| --- | ----------------------------------- | ------------------------------------------------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1   | `transcription.md`                  | `docs/transcription.md`                                             | 2026-01    | Technical friend (Cursor/Claude Code user) | Best for: technical depth, workflow details, tool comparisons                       |
| 2   | `AI Talk to Alissa January 23rd.md` | `/Users/craigdossantos/Downloads/AI Talk to Alissa January 23rd.md` | 2026-01-23 | Alissa (newer to AI, marketing background) | Best for: foundational explanations, non-technical perspectives, everyday analogies |

## Slide ID Reference

Slides are NOT sequentially numbered. Here is the canonical ordering:

**Intro + Understanding + Mapping:** `slide-01`, `slide-06`, `slide-02`, `slide-03`, `slide-04`, `slide-05`, `slide-07`

**Non-Technical Track:** `slide-08`, `slide-09`, `slide-11`, `slide-10`, `slide-12`, `slide-13`, `slide-14`, `slide-14b`, `slide-15`, `slide-15b`

**Technical Track:** `slide-16`, `slide-18`, `slide-19`, `slide-20`, `slide-20b`, `slide-21`, `slide-22`, `slide-23`, `slide-24`, `slide-25`

**Closing:** `slide-26`

**Projects (magenta line):** `project-craigdossantos`, `project-secretgame`, `project-freestyleflow`, `project-ourweunion`, `project-dialoguedojo`, `project-instantbook`, `project-youtubesummary`, `project-videosum`, `project-quota`, `project-levelupai`

**Slides currently skipped** (no standalone transcript content): `slide-14b`, `slide-20b`

**Always re-check `slides.ts` for the current list** -- slides may be added, removed, or reordered between runs.

## Key Files

| File                                                     | Purpose                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `react-flow-app/src/data/slideWriteups.ts`               | The writeup content (edit this)                             |
| `react-flow-app/src/data/slides.ts`                      | Slide metadata -- IDs, titles, bullets, sections, resources |
| `react-flow-app/src/types/presentation.ts`               | TypeScript types for slides, resources, tracks              |
| `react-flow-app/src/components/resources/SlideEntry.tsx` | Renders writeups using `<Remark>` (rarely needs changes)    |
| `react-flow-app/src/styles/resources.css`                | Writeup styling (rarely needs changes)                      |
| `.claude/skills/slide-blog-writer/skill.md`              | Voice, tone, and format guidelines for writeup prose        |
| `docs/`                                                  | All transcription source files                              |

## Edge Cases

- **Craig added new slides**: Check `slides.ts` for IDs not in `slideWriteups.ts`. Write new entries if the transcription covers them.
- **Craig removed slides**: Remove the corresponding entry from `slideWriteups.ts`. Dead keys won't cause errors but are clutter.
- **Craig renamed a slide ID**: The old key in `slideWriteups.ts` will silently stop matching. Check for orphaned keys.
- **Cross-reference targets changed**: If a slide ID was renamed, update all `(/resources#slide-OLDID)` links across all writeups.
- **Transcription covers slides out of order**: That's normal. Craig doesn't always follow the metro map linearly. Map content to slide IDs by topic, not by sequence in the transcript.
- **Two speakers disagree**: Craig's view is authoritative. Audience questions/pushback can inform the writeup but the conclusion should reflect Craig's position.
- **Transcription has demos/screen-sharing**: These won't appear in text. If Craig says "as you can see here" or "let me show you," note the context but focus on what was explained verbally.
