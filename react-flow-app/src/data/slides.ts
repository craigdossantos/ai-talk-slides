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
    id: "levels-nontech",
    title: "Non-Technical Levels",
    track: "non-technical",
  },
  {
    id: "levels-tech",
    title: "Technical Levels",
    track: "technical",
  },
  {
    id: "closing",
    title: "Closing",
    track: "general",
  },
  {
    id: "projects",
    title: "The Project Path",
    track: "general",
  },
];

// Define all slides with their content (slide 17 removed - integrated into slide 16)
export const slides: SlideContent[] = [
  // Section: Introduction - The Widening Gulf
  {
    id: "slide-01",
    sectionId: "intro",
    type: "title",
    title: "The Widening Gulf of Technology",
    subtitle: "The growing divide between tech-literate and non-tech-literate",
    backgroundImage: "/assets/images/slide-01_billboard_v2_20260123_110517.jpg",
    bullets: [
      "Technology gives us speed and capabilities: fire, bicycles, cars, Internet",
      "AI might create a larger gulf than previous tech",
      "People with AI tools will outperform people without",
    ],
  },
  {
    id: "slide-06",
    sectionId: "intro",
    type: "content",
    title: "What It Takes",
    subtitle: "Resistance to change is the real barrier",
    backgroundImage: "/assets/images/slide-06_billboard_v1_20260123_110517.jpg",
    bullets: [
      'What does it mean to be "technical"',
      "Resistance to change is the only barrier to entry",
    ],
  },
  {
    id: "slide-02",
    sectionId: "intro",
    type: "content",
    title: "Mental Models Through Use",
    subtitle: "Understanding comes from doing, not reading",
    backgroundImage: "/assets/images/slide-02_billboard_v4_20260123_110517.jpg",
    bullets: ["Mental models improve more through use, not instruction"],
  },

  // Section: Understanding AI
  {
    id: "slide-03",
    sectionId: "understanding",
    type: "content",
    title: "New Tech, Old Mental Model",
    subtitle: "The temptation to treat AI like enhanced Google",
    backgroundImage: "/assets/images/slide-03_billboard_v1_20260123_110517.jpg",
    bullets: [
      "Mental Model: ChatGPT as a better Google",
      "It has different flaws: hallucinations",
    ],
    subnodes: [
      {
        id: "subnode-03-billboard",
        parentSlideId: "slide-03",
        type: "slide",
        title: "Billboard Example",
        image:
          "https://framerusercontent.com/images/wImRiJQUuEpMwbYOB5dUXUcrUk.png?width=2752&height=1536",
      },
      {
        id: "subnode-03-1",
        parentSlideId: "slide-03",
        type: "resource",
        title: "Understanding Hallucinations",
        url: "https://www.anthropic.com/news/claude-3-5-sonnet",
        content: "Why AI sometimes makes things up",
      },
      {
        id: "subnode-03-2",
        parentSlideId: "slide-03",
        type: "note",
        title: "Key Insight",
        content: "AI is a reasoning engine, not a search engine",
      },
    ],
  },
  {
    id: "slide-04",
    sectionId: "understanding",
    type: "content",
    title: "From Savant to Digital Employee",
    subtitle: "The major mental leap",
    backgroundImage: "/assets/images/slide-04_billboard_v3_20260123_110517.jpg",
    bullets: [
      "AI is not an all-knowing savant with advice",
      "It's a digital employee who can execute work",
      "You can become a team lead",
    ],
  },

  // Section: Mapping the Journey
  {
    id: "slide-05",
    sectionId: "mapping",
    type: "content",
    title: "Mapping the Journey",
    subtitle: "A progressive approach to understanding AI",
    backgroundImage: "/assets/images/slide-05_billboard_v2_20260123_110517.jpg",
    bullets: [
      "Overwhelming amount of information",
      "Skipping steps makes nothing feel coherent",
      "Feeling confused is a sequencing problem, not a capability",
      "We have the greatest self learning tool ever",
    ],
  },
  {
    id: "slide-07",
    sectionId: "mapping",
    type: "quote",
    title: "Avoidance",
    backgroundImage: "/assets/images/slide-07_billboard_v1_20260123_114739.jpg",
    quote: '"This won\'t affect my job."',
    bullets: [
      "Avoidance is just fear showing its head",
      "AI may require us to think at a higher level",
    ],
  },

  // Avoidance moved to mapping section
  // Section: Non-Technical Levels (1-8)
  {
    id: "slide-08",
    sectionId: "levels-nontech",
    type: "content",
    title: "AI = Portal to Internet Research",
    backgroundImage: "/assets/images/slide-08_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Use AI for Q&A, summaries and explanations, brainstorming",
      "Learn prompt engineering basics",
      "Where most daily ChatGPT users are",
    ],
  },
  {
    id: "slide-09",
    sectionId: "levels-nontech",
    type: "content",
    title: "AI as Thought Partner",
    backgroundImage: "/assets/images/slide-09_billboard_v2_20260123_114739.jpg",
    bullets: [
      "Giving AI more context: PDFs, docs, images",
      "Back and forth dialogue on complex topics like health",
      "Trying different models: ChatGPT, Gemini, Claude",
    ],
  },
  {
    id: "slide-11",
    sectionId: "levels-nontech",
    type: "content",
    title: "Using AI Tools",
    backgroundImage: "/assets/images/slide-11_billboard_v2_20260123_114739.jpg",
    bullets: [
      "Still getting unreliable results",
      "Wispr Flow - voice dictation",
      "Granola - automatic meeting notes",
      "Obsidian - AI-accessible notes in Markdown",
      "Figma, Canva, Notion, Slack with AI features",
    ],
  },
  {
    id: "slide-10",
    sectionId: "levels-nontech",
    type: "content",
    title: "Context Management",
    backgroundImage: "/assets/images/slide-10_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Understanding how context works",
      "Structured input (Markdown) yields better results",
      "Using Projects to manage context",
      "Results start feeling reliable",
    ],
  },
  {
    id: "slide-12",
    sectionId: "levels-nontech",
    type: "content",
    title: "AI-Powered Browsing",
    backgroundImage: "/assets/images/slide-12_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Browsers are the modern workbench",
      "Google Gemini built into Chrome",
      "ChatGPT Operator (Atlas) browser",
      "Claude extension - takes actions in browser",
    ],
  },
  {
    id: "slide-13",
    sectionId: "levels-nontech",
    type: "content",
    title: "Creating Media with AI",
    backgroundImage: "/assets/images/slide-13_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Image generation: Nano Banana, Midjourney, ChatGPT",
      "Video production: Veo3",
      "The skill is can you get it to give you what you want?",
    ],
  },
  {
    id: "slide-14",
    sectionId: "levels-nontech",
    type: "content",
    title: "AI for Automation",
    backgroundImage: "/assets/images/slide-14_billboard_v3_20260123_114739.jpg",
    bullets: [
      "Zapier - most common automation tool",
      "N8n - bridge to complex automations",
      "Gumloop - built with AI in mind",
      "Visual interfaces to doing things with code - without looking at code",
    ],
  },
  {
    id: "slide-15",
    sectionId: "levels-nontech",
    type: "content",
    title: "Natural Language Software Tools",
    backgroundImage: "/assets/images/slide-15_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Lovable, Bolt AI, Google AI Studio",
      "Create software without knowing code syntax",
      "Great playground to get comfortable with using AI for software",
      "Understanding the limits is part of the learning",
    ],
  },
  {
    id: "slide-15b",
    sectionId: "levels-nontech",
    type: "content",
    title: "Claude Co-work",
    backgroundImage:
      "/assets/images/slide-15b_billboard_v2_20260123_123045.jpg",
    bullets: [],
  },

  // Section: Technical Levels (1-9) - Note: slide-17 removed, content merged into slide-16
  {
    id: "slide-16",
    sectionId: "levels-tech",
    type: "section-header",
    title: "Command Line Interface (CLI)",
    subtitle: "Where AI meets full computer access",
    backgroundImage: "/assets/images/slide-16_billboard_v2_20260123_114739.jpg",
    bullets: [
      "Still using natural language as the interface",
      "Command line = text-based access to everything on your machine",
      "Learn command line basics - cd, ls, pwd",
    ],
  },
  // slide-17 REMOVED - content integrated into slide-16
  {
    id: "slide-18",
    sectionId: "levels-tech",
    type: "content",
    title: "Using Git and GitHub",
    subtitle: "Version control for AI-assisted development",
    backgroundImage: "/assets/images/slide-18_billboard_v2_20260123_123045.jpg",
    bullets: [
      "Git = versioning system (like Google Docs history, but for code)",
      "Take snapshots, rewind, merge work from multiple people",
      "GitHub = Dropbox for code (store, share, collaborate)",
      "Essential safety net when AI makes mistakes",
      "Worth taking time to understand properly",
    ],
  },
  {
    id: "slide-19",
    sectionId: "levels-tech",
    type: "content",
    title: "Agents and AI Coding",
    subtitle: "Where code meets conversation",
    backgroundImage: "/assets/images/slide-19_billboard_v2_20260123_114739.jpg",
    bullets: [
      "IDE = Integrated Development Environment",
      "Google's Anti-Gravity - easiest place to start",
      "Cursor = chat window + code editor side by side",
      "Inline execution: fast feedback loop",
      "Agent writes → sees result → adjusts → improves",
    ],
  },
  {
    id: "slide-20",
    sectionId: "levels-tech",
    type: "content",
    title: "Modes and Workflows",
    subtitle: "Beyond back-and-forth chat",
    backgroundImage: "/assets/images/slide-20_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Plan → Build → Test → Review → Deploy → Bug Fix → Plan",
      "One model in different modes for each step",
      "Model shape-shifts depending on the task",
      "You're executing an actual software development lifecycle",
      "Structured workflow vs. freeform conversation",
    ],
  },
  {
    id: "slide-20b",
    sectionId: "levels-tech",
    type: "content",
    title: "Meta Level Meta Thinking",
    backgroundImage:
      "/assets/images/slide-20b_billboard_v2_20260123_123045.jpg",
    bullets: [],
  },
  {
    id: "slide-21",
    sectionId: "levels-tech",
    type: "content",
    title: "Using AI to Go Live",
    subtitle: "Deployment, databases, hosting",
    backgroundImage: "/assets/images/slide-21_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Supabase — databases",
      "Vercel — hosting and deployment",
      "Cloudflare — domains and DNS",
      "AI-assisted deployment: MCP servers or CLI tools",
      "Learn as the AI does it — don't just press buttons",
    ],
  },
  {
    id: "slide-22",
    sectionId: "levels-tech",
    type: "content",
    title: "Customizing the Harness",
    subtitle: "Skills, commands, and agents",
    backgroundImage: "/assets/images/slide-22_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Skills: Markdown files loaded when needed (like Neo in The Matrix)",
      "Slash commands: shortcuts instead of repeating instructions",
      "Sub-agents: mini-versions doing tasks in separate contexts",
      "Guidance files (claude.md): system prompts for every interaction",
      "Hooks: trigger actions based on events",
    ],
  },
  {
    id: "slide-23",
    sectionId: "levels-tech",
    type: "content",
    title: "Context Engineering",
    subtitle: "The memory game",
    backgroundImage: "/assets/images/slide-23_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Context = everything you hand over with your instruction",
      "Too bloated → model forgets things, quality degrades",
      "New session = no context (like Memento amnesia)",
      "Solutions: write to files, databases, or start fresh",
      "Key skill: knowing when to reset your session",
    ],
  },
  {
    id: "slide-24",
    sectionId: "levels-tech",
    type: "content",
    title: "Parallel Agents and Sub-agent Orchestration",
    subtitle: "Orchestration at scale",
    backgroundImage: "/assets/images/slide-24_billboard_v3_20260123_124346.jpg",
    bullets: [
      "Multiple sub-agents and sessions simultaneously",
      "GitHub Worktrees: separate working directories",
      "Conductor.build, Beads: tools for parallel work",
      "Sub-agents return answers, not their full process",
      "You're coordinating, not executing",
    ],
  },
  {
    id: "slide-25",
    sectionId: "levels-tech",
    type: "content",
    title: "Swarms and Infrastructure",
    subtitle: "The edge of what's possible",
    backgroundImage: "/assets/images/slide-25_billboard_v2_20260123_114739.jpg",
    bullets: [
      "Large numbers of agents running simultaneously",
      "Ralph Wiggum: spin up agents in serial overnight",
      "Token usage at this level: $100-200+/month plans",
      "Virtual Private Servers: agents running in the cloud 24/7",
      "Where infrastructure meets intelligence",
    ],
  },

  // Section: Closing
  {
    id: "slide-26",
    sectionId: "closing",
    type: "title",
    title: "The Only Way Forward Is Through",
    subtitle: "Become good at it by using it",
    backgroundImage: "/assets/images/slide-26_billboard_v1_20260123_114739.jpg",
    bullets: [
      "Use AI as your learning tool!",
      "It's changing so fast, no one is that far ahead",
    ],
  },

  // Section: The Project Path (magenta line - standalone examples)
  {
    id: "project-craigdossantos",
    sectionId: "projects",
    type: "content",
    title: "CraigDosSantos.com",
    subtitle: "Personal portfolio and blog",
    bullets: ["Showcasing my work and writing", "Built with AI assistance"],
  },
  {
    id: "project-secretgame",
    sectionId: "projects",
    type: "content",
    title: "The Secret Game",
    subtitle: "Share secrets with friends",
    bullets: [
      "Pass a URL to a group",
      "Answer questions to reveal hidden answers",
    ],
  },
  {
    id: "project-freestyleflow",
    sectionId: "projects",
    type: "content",
    title: "Freestyle Flow",
    subtitle: "Mobile app for freestyle rap training",
    bullets: ["Improv singing and rap practice", "Practice at your own pace"],
  },
  {
    id: "project-ourweunion",
    sectionId: "projects",
    type: "content",
    title: "OurWeUnion.com",
    subtitle: "Wedding website",
    bullets: [
      "Single landing page with Google Form",
      "Built for Craig and Stef",
    ],
  },
  {
    id: "project-dialoguedojo",
    sectionId: "projects",
    type: "content",
    title: "Dialogue Dojo",
    subtitle: "Practice communication skills",
    bullets: [
      "Voice-to-voice sessions",
      "Negotiation and non-violent communication",
    ],
  },
  {
    id: "project-instantbook",
    sectionId: "projects",
    type: "content",
    title: "Instant Book",
    subtitle: "Learn from books faster",
    bullets: [
      "Upload EPUB books, break into chapters",
      "Zoom in and out of content",
    ],
  },
  {
    id: "project-youtubesummary",
    sectionId: "projects",
    type: "content",
    title: "YouTube Summary",
    subtitle: "Summarize YouTube videos",
    bullets: [
      "Drop in video or playlist links",
      "Get summaries and key takeaways",
    ],
  },
  {
    id: "project-videosum",
    sectionId: "projects",
    type: "content",
    title: "Video Sum",
    subtitle: "Mac desktop application",
    bullets: ["Summarizing video content locally"],
  },
  {
    id: "project-quota",
    sectionId: "projects",
    type: "content",
    title: "Quota",
    subtitle: "Credit-based AI billing",
    bullets: [
      "Launch AI apps with portable wallet system",
      "Works across multiple apps",
    ],
  },
  {
    id: "project-levelupai",
    sectionId: "projects",
    type: "content",
    title: "Level Up with AI Prez",
    subtitle: "This presentation",
    bullets: [
      "Interactive metro map visualization",
      "Built with React Flow and AI",
    ],
  },
];

// Define resources linked to key slides
export const resources: Resource[] = [
  // Level 1: AI as Portal to Internet Research - link to ChatGPT
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
  // Level 3: Context Engineering - Markdown Guide
  {
    id: "res-02b",
    slideId: "slide-10",
    type: "docs",
    title: "Markdown Guide",
    url: "https://www.markdownguide.org/basic-syntax/",
    image: "https://www.markdownguide.org/favicon.ico",
  },
  // Level 4: Using AI Tools - link to Wispr Flow
  {
    id: "res-03",
    slideId: "slide-11",
    type: "tool",
    title: "Wispr Flow",
    url: "https://www.wispr.ai",
    image: "https://www.wispr.ai/favicon.ico",
  },
  // Level 4: Using AI Tools - link to Granola
  {
    id: "res-04",
    slideId: "slide-11",
    type: "tool",
    title: "Granola Notes",
    url: "https://www.granola.so",
    image: "https://www.granola.so/icon.svg",
  },
  // Level 5: AI-Powered Browsing - Claude Extension
  {
    id: "res-04b",
    slideId: "slide-12",
    type: "tool",
    title: "Claude Chrome Extension",
    url: "https://claude.ai/download",
    image: "https://claude.ai/images/claude_app_icon.png",
  },
  // Level 5: AI-Powered Browsing - ChatGPT Operator
  {
    id: "res-04c",
    slideId: "slide-12",
    type: "tool",
    title: "ChatGPT Operator",
    url: "https://openai.com/index/introducing-operator/",
    image: "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  },
  // Level 5: AI-Powered Browsing - Gemini in Chrome
  {
    id: "res-04d",
    slideId: "slide-12",
    type: "tool",
    title: "Gemini in Chrome",
    url: "https://support.google.com/chrome/answer/14286918",
    image:
      "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
  },
  // Level 6: Creating Media with AI - link to Midjourney
  {
    id: "res-05",
    slideId: "slide-13",
    type: "tool",
    title: "Midjourney",
    url: "https://www.midjourney.com",
    image: "https://www.midjourney.com/apple-touch-icon.png",
  },
  // Level 7: AI for Automation - link to Zapier docs
  {
    id: "res-06",
    slideId: "slide-14",
    type: "docs",
    title: "Zapier Guide",
    url: "https://zapier.com/learn",
    image: "https://zapier.com/favicon.ico",
  },
  // Level 7: AI for Automation - link to N8n
  {
    id: "res-06b",
    slideId: "slide-14",
    type: "tool",
    title: "N8n",
    url: "https://n8n.io",
    image: "https://n8n.io/favicon.ico",
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
  // Technical Track Resources
  // CLI Tools - Claude Code
  {
    id: "res-07b",
    slideId: "slide-16",
    type: "docs",
    title: "Claude Code Installation",
    url: "https://docs.anthropic.com/en/docs/claude-code",
    image: "https://claude.ai/images/claude_app_icon.png",
  },
  // CLI Tools - OpenAI Codex CLI
  {
    id: "res-07c",
    slideId: "slide-16",
    type: "docs",
    title: "OpenAI Codex CLI",
    url: "https://github.com/openai/codex",
    image: "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  },
  // CLI Tools - Gemini CLI
  {
    id: "res-07d",
    slideId: "slide-16",
    type: "docs",
    title: "Gemini CLI",
    url: "https://github.com/google-gemini/gemini-cli",
    image:
      "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
  },
  // Git & GitHub
  {
    id: "res-08",
    slideId: "slide-18",
    type: "docs",
    title: "GitHub Docs",
    url: "https://docs.github.com",
    image: "https://github.githubassets.com/favicons/favicon.svg",
  },
  // AI-Native IDEs - Cursor
  {
    id: "res-09",
    slideId: "slide-19",
    type: "tool",
    title: "Cursor IDE",
    url: "https://cursor.sh",
    image: "https://cursor.sh/favicon.ico",
  },
  // Full Software Lifecycle - Vercel
  {
    id: "res-10",
    slideId: "slide-21",
    type: "tool",
    title: "Vercel",
    url: "https://vercel.com",
    image: "https://vercel.com/favicon.ico",
  },
  // Full Software Lifecycle - Supabase
  {
    id: "res-11",
    slideId: "slide-21",
    type: "tool",
    title: "Supabase",
    url: "https://supabase.com",
    image: "https://supabase.com/favicon.ico",
  },
  // Sample Prompt Resources
  {
    id: "prompt-01",
    slideId: "slide-08",
    type: "prompt",
    title: "Getting Started with AI Research",
    url: "#",
    prompt: `I want to learn about [TOPIC]. Please:

1. Give me a brief overview (2-3 paragraphs)
2. List the key concepts I should understand
3. Suggest 3 beginner-friendly resources
4. What questions should I be asking as a beginner?

Please use simple language and avoid jargon.`,
  },
  {
    id: "prompt-02",
    slideId: "slide-09",
    type: "prompt",
    title: "Deep Dive Conversation Starter",
    url: "#",
    prompt: `I'm trying to understand [TOPIC] more deeply.

Here's what I already know:
- [Your current understanding]

Here's what confuses me:
- [Specific questions or confusion points]

Can you help me build a better mental model? Please:
1. Correct any misconceptions
2. Fill in gaps in my understanding
3. Use analogies to explain complex parts
4. Ask me clarifying questions if needed`,
  },
  {
    id: "prompt-03",
    slideId: "slide-10",
    type: "prompt",
    title: "Structured Context Template",
    url: "#",
    prompt: `## Context
[Describe the situation or background]

## Goal
[What you're trying to achieve]

## Constraints
- [Any limitations or requirements]

## What I've Tried
- [Previous attempts if any]

## Question
[Your specific question or request]`,
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
