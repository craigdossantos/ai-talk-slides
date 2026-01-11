import type { Section, SlideContent, Resource } from "../types/presentation";

// Define the sections of the presentation
export const sections: Section[] = [
  {
    id: "intro",
    title: "The Widening Gulf",
    track: "general",
  },
  {
    id: "understanding",
    title: "Understanding AI",
    track: "non-technical",
  },
  {
    id: "mapping",
    title: "Mapping the Journey",
    track: "general",
  },
  {
    id: "levels",
    title: "The Levels",
    track: "non-technical",
  },
];

// Define all 15 slides with their content
export const slides: SlideContent[] = [
  // Section: Introduction - The Widening Gulf
  {
    id: "slide-01",
    sectionId: "intro",
    type: "title",
    title: "Technology and the Widening Gulf",
    subtitle: "The growing divide between tech-literate and non-tech-literate",
    backgroundImage: "/assets/images/slide-01-technology-widening-gulf.jpg",
    bullets: [
      "Technology makes us more efficient: bicycle, typewriter, Google",
      "AI is creating a much larger gulf than previous tech",
      "Think about it from a mental model perspective first",
    ],
  },
  {
    id: "slide-02",
    sectionId: "intro",
    type: "content",
    title: "Mental Models Through Use",
    subtitle: "Understanding comes from doing, not reading",
    backgroundImage: "/assets/images/slide-02-mental-models.jpg",
    bullets: [
      'First tried: "Please give me directions to the nearest ice cream store..."',
      'Learned: "Molly Moon directions"',
      "This understanding comes through use, not instruction",
    ],
  },

  // Section: Understanding AI
  {
    id: "slide-03",
    sectionId: "understanding",
    type: "content",
    title: "New Tech, Old Mental Models",
    subtitle: "The temptation to treat AI like enhanced Google",
    backgroundImage: "/assets/images/slide-03-new-tech-old-models.jpg",
    bullets: [
      "First instinct: ChatGPT is a better Google",
      "Use it like a knowledgeable friend",
      "Back and forth conversation",
      "But it's inconsistent: sometimes brilliant, sometimes wrong",
    ],
  },
  {
    id: "slide-04",
    sectionId: "understanding",
    type: "content",
    title: "From Confidant to Digital Employee",
    subtitle: "The major mental leap",
    backgroundImage: "/assets/images/slide-04-confidant-to-employee.jpg",
    bullets: [
      "AI is not just an all-knowing friend",
      "Think of it as a digital employee",
      "Shift from getting advice to actual execution",
      "You become a director/orchestrator",
      "You can have as many as you can handle",
    ],
  },

  // Section: Mapping the Journey
  {
    id: "slide-05",
    sectionId: "mapping",
    type: "content",
    title: "Mapping the Journey",
    subtitle: "A progressive approach to understanding AI",
    backgroundImage: "/assets/images/slide-05-mapping-journey.jpg",
    bullets: [
      "Overwhelming amount of information out there",
      "Skipping steps makes nothing feel coherent",
      "Confusion is a sequencing problem, not an identity problem",
      "We now have the greatest learning tool ever",
    ],
  },
  {
    id: "slide-06",
    sectionId: "mapping",
    type: "content",
    title: "The Wrong Split",
    subtitle: "Technical vs Non-Technical is a cultural issue",
    backgroundImage: "/assets/images/slide-06-wrong-split.jpg",
    bullets: [
      "The floor of what you can do without code is now incredibly high",
      "Lines are blurring",
      "The real question: How much resistance to change do you feel?",
      "This is the real gulf",
    ],
  },

  // Section: The Levels (0-8)
  {
    id: "slide-07",
    sectionId: "levels",
    type: "quote",
    title: "Avoidance",
    level: 0,
    backgroundImage: "/assets/images/slide-07-level-0-avoidance.jpg",
    quote: '"This won\'t affect my job."',
    bullets: [
      "Historical echoes of famous people dismissing transformative technology",
    ],
  },
  {
    id: "slide-08",
    sectionId: "levels",
    type: "content",
    title: "AI as Uber Google",
    level: 1,
    backgroundImage: "/assets/images/slide-08-level-1-uber-google.jpg",
    bullets: [
      "Questions and answers",
      "Summaries and explanations",
      "Brainstorming",
      "Prompt engineering basics",
      "This is where most daily ChatGPT users start",
    ],
  },
  {
    id: "slide-09",
    sectionId: "levels",
    type: "content",
    title: "AI as Thought Partner",
    level: 2,
    backgroundImage: "/assets/images/slide-09-level-2-thought-partner.jpg",
    bullets: [
      "Giving AI more context: PDFs, docs, images",
      "Back and forth dialogue on complex topics",
      "Trying different models: ChatGPT, Gemini, Claude",
      "Each has strengths and weaknesses",
    ],
  },
  {
    id: "slide-10",
    sectionId: "levels",
    type: "content",
    title: "Context Engineering",
    level: 3,
    backgroundImage: "/assets/images/slide-10-level-3-context-engineering.jpg",
    bullets: [
      "Understanding how context helps or hurts",
      "Longer chat = more memory used = degraded performance",
      "Structured input (Markdown) yields better results",
      "Using Projects to keep context clean",
      "Choosing the right model for the task",
      "Results start feeling reliable",
    ],
  },
  {
    id: "slide-11",
    sectionId: "levels",
    type: "content",
    title: "Tools in Your Workflow",
    level: 4,
    backgroundImage: "/assets/images/slide-11-level-4-tools-workflow.jpg",
    bullets: [
      "Wispr Flow - voice dictation",
      "Granola - automatic meeting notes",
      "Obsidian - AI-accessible notes in Markdown",
      "Figma, Canva, Notion, Slack with AI features",
      "Making your data accessible and usable by AI",
    ],
  },
  {
    id: "slide-12",
    sectionId: "levels",
    type: "content",
    title: "AI-Enabled Browsing",
    level: 5,
    backgroundImage: "/assets/images/slide-12-level-5-ai-browsing.jpg",
    bullets: [
      "Google Gemini built into Chrome",
      "ChatGPT Operator (Atlas) browser",
      "Claude extension - takes actions in browser",
      "Be mindful of security with sensitive sites",
    ],
  },
  {
    id: "slide-13",
    sectionId: "levels",
    type: "content",
    title: "Media & Creative Production",
    level: 6,
    backgroundImage: "/assets/images/slide-13-level-6-media-creative.jpg",
    bullets: [
      "Image generation: Nano Banana, Midjourney",
      "Video production: Veo, O3",
      "The skill: Can you get it to give you what you want?",
    ],
  },
  {
    id: "slide-14",
    sectionId: "levels",
    type: "content",
    title: "Automation Tools",
    level: 7,
    backgroundImage: "/assets/images/slide-14-level-7-automation.jpg",
    bullets: [
      "Zapier - most common automation tool",
      "N8n - bridge to complex automations",
      "Gumloop - built with AI in mind",
      "Visual interfaces to doing things with code - without looking at code",
    ],
  },
  {
    id: "slide-15",
    sectionId: "levels",
    type: "content",
    title: "Natural Language Software",
    level: 8,
    backgroundImage: "/assets/images/slide-15-level-8-nl-software.jpg",
    bullets: [
      "Lovable, Bolt AI, Google AI Studio",
      "Create software without knowing code syntax",
      "Currently best for front-end / visual things",
      "Great playground to get comfortable",
      "Understanding the limits is part of the learning",
    ],
  },
];

// Define resources linked to key slides
export const resources: Resource[] = [
  // Level 1: AI as Uber Google - link to ChatGPT
  {
    id: "res-01",
    slideId: "slide-08",
    type: "tool",
    title: "ChatGPT",
    url: "https://chat.openai.com",
    image: "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  },
  // Level 2: AI as Thought Partner - link to Claude
  {
    id: "res-02",
    slideId: "slide-09",
    type: "tool",
    title: "Claude AI",
    url: "https://claude.ai",
    image: "https://claude.ai/images/claude_app_icon.png",
  },
  // Level 4: Tools in Your Workflow - link to Wispr Flow
  {
    id: "res-03",
    slideId: "slide-11",
    type: "tool",
    title: "Wispr Flow",
    url: "https://www.wispr.ai",
    image: "https://www.wispr.ai/favicon.ico",
  },
  // Level 4: Tools in Your Workflow - link to Granola
  {
    id: "res-04",
    slideId: "slide-11",
    type: "tool",
    title: "Granola Notes",
    url: "https://www.granola.so",
    image: "https://www.granola.so/icon.svg",
  },
  // Level 6: Media & Creative Production - link to Midjourney
  {
    id: "res-05",
    slideId: "slide-13",
    type: "tool",
    title: "Midjourney",
    url: "https://www.midjourney.com",
    image: "https://www.midjourney.com/apple-touch-icon.png",
  },
  // Level 7: Automation Tools - link to Zapier docs
  {
    id: "res-06",
    slideId: "slide-14",
    type: "docs",
    title: "Zapier Guide",
    url: "https://zapier.com/learn",
    image: "https://zapier.com/favicon.ico",
  },
  // Level 8: Natural Language Software - link to Lovable
  {
    id: "res-07",
    slideId: "slide-15",
    type: "tool",
    title: "Lovable Dev",
    url: "https://lovable.dev",
    image: "https://lovable.dev/icon.svg",
  },
];

// Helper function to get slides by section
export function getSlidesBySection(sectionId: string): SlideContent[] {
  return slides.filter((slide) => slide.sectionId === sectionId);
}

// Helper function to get section by ID
export function getSectionById(sectionId: string): Section | undefined {
  return sections.find((section) => section.id === sectionId);
}
