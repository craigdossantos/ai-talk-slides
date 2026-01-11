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
];

// Define all 26 slides with their content
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

  // Section: Non-Technical Levels (0-8)
  {
    id: "slide-07",
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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
    sectionId: "levels-nontech",
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

  // Section: Technical Levels (1-9)
  {
    id: "slide-16",
    sectionId: "levels-tech",
    type: "section-header",
    title: "Entering the Technical Track",
    subtitle: "Where AI meets full computer access",
    backgroundImage: "/assets/images/slide-16-entering-technical-track.jpg",
    bullets: [
      "Still using natural language as the interface",
      "AI does the technical work — you direct it with words",
      "Command line = text-based access to everything on your machine",
      "AI now has full access to whatever you give it",
    ],
  },
  {
    id: "slide-17",
    sectionId: "levels-tech",
    type: "content",
    title: "Command Line Basics",
    level: 1,
    backgroundImage: "/assets/images/slide-17-level-1-cli-basics.jpg",
    bullets: [
      "CLI = Command Line Interface",
      "Learn basic navigation: cd, ls, pwd",
      "Commands differ slightly between Mac and PC",
      "Get comfortable with this text-based interface",
      "Ask ChatGPT or Claude to teach you",
    ],
  },
  {
    id: "slide-18",
    sectionId: "levels-tech",
    type: "content",
    title: "Version Control",
    subtitle: "Git & GitHub",
    level: 2,
    backgroundImage: "/assets/images/slide-18-level-2-git-github.jpg",
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
    title: "AI-Native IDEs",
    subtitle: "Where code meets conversation",
    level: 3,
    backgroundImage: "/assets/images/slide-19-level-3-ai-native-ides.jpg",
    bullets: [
      "IDE = Integrated Development Environment",
      "Google's Anti-Gravity - easiest place to start",
      "Cursor - chat window + code editor side by side",
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
    level: 4,
    backgroundImage: "/assets/images/slide-20-level-4-modes-workflows.jpg",
    bullets: [
      "Plan → Build → Test → Review → Deploy → Bug Fix → Plan",
      "One model in different modes for each step",
      "Model shape-shifts depending on the task",
      "You're executing an actual software development lifecycle",
      "Structured workflow vs. freeform conversation",
    ],
  },
  {
    id: "slide-21",
    sectionId: "levels-tech",
    type: "content",
    title: "Full Software Lifecycle",
    subtitle: "Deployment, databases, hosting",
    level: 5,
    backgroundImage: "/assets/images/slide-21-level-5-software-lifecycle.jpg",
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
    level: 6,
    backgroundImage: "/assets/images/slide-22-level-6-customizing-harness.jpg",
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
    title: "Context Management",
    subtitle: "The memory game",
    level: 7,
    backgroundImage: "/assets/images/slide-23-level-7-context-management.jpg",
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
    title: "Parallel Agents",
    subtitle: "Orchestration at scale",
    level: 8,
    backgroundImage: "/assets/images/slide-24-level-8-parallel-agents.jpg",
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
    level: 9,
    backgroundImage: "/assets/images/slide-25-level-9-swarms.jpg",
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
    backgroundImage: "/assets/images/slide-26-closing.jpg",
    bullets: [
      "Ask the models to teach you — no embarrassment about not knowing",
      "Use tools → modify how you think → try again → richer understanding",
      "It's changing so fast, you're not behind if you start now",
      "The danger: putting it on the shelf for a couple years",
      "Even if you think this doesn't apply to you — someone using this learns faster",
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
  // Technical Track Resources
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
];

// Helper function to get slides by section
export function getSlidesBySection(sectionId: string): SlideContent[] {
  return slides.filter((slide) => slide.sectionId === sectionId);
}

// Helper function to get section by ID
export function getSectionById(sectionId: string): Section | undefined {
  return sections.find((section) => section.id === sectionId);
}
