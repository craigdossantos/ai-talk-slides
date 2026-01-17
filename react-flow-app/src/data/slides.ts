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
    id: "projects",
    title: "Projects",
    track: "general",
  },
  {
    id: "closing",
    title: "Closing",
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
    backgroundImage:
      "/assets/images/slide-01-the-widening-gulf-of-technology.jpg",
    bullets: [
      "Technology gives us speed and capabilities: fire, bicycles, cars, Internet",
      "AI might create a larger gulf than previous tech",
      "People with AI tools will outperform people without",
    ],
  },
  {
    id: "slide-02",
    sectionId: "intro",
    type: "content",
    title: "Mental Models Through Use",
    subtitle: "Understanding comes from doing, not reading",
    backgroundImage: "/assets/images/slide-02-mental-models-through-use.jpg",
    bullets: ["Mental models improve more through use, not instruction"],
  },

  // Section: Understanding AI
  {
    id: "slide-03",
    sectionId: "understanding",
    type: "content",
    title: "New Tech, Old Mental Model",
    subtitle: "The temptation to treat AI like enhanced Google",
    backgroundImage: "/assets/images/slide-03-new-tech,-old-mental-model.jpg",
    bullets: [
      "Mental Model: ChatGPT as a better Google",
      "It has different flaws: hallucinations",
    ],
  },
  {
    id: "slide-03b",
    sectionId: "understanding",
    type: "image",
    title: "",
    backgroundImage:
      "https://framerusercontent.com/images/wImRiJQUuEpMwbYOB5dUXUcrUk.png?width=2752&height=1536",
    bullets: [],
  },
  {
    id: "slide-04",
    sectionId: "understanding",
    type: "content",
    title: "From Savant to Digital Employee",
    subtitle: "The major mental leap",
    backgroundImage:
      "/assets/images/slide-04-from-savant-to-digital-employee.jpg",
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
    backgroundImage: "/assets/images/slide-05-mapping-the-journey.jpg",
    bullets: [
      "Overwhelming amount of information",
      "Skipping steps makes nothing feel coherent",
      "Feeling confused is a sequencing problem, not a capability",
      "We have the greatest self learning tool ever",
    ],
  },
  {
    id: "slide-06",
    sectionId: "mapping",
    type: "content",
    title: "What It Takes",
    subtitle: "Resistance to change is the real barrier",
    backgroundImage: "/assets/images/slide-06-what-it-takes.jpg",
    bullets: [
      'What does it mean to be "technical"',
      "Resistance to change is the only barrier to entry",
    ],
  },
  {
    id: "slide-07",
    sectionId: "mapping",
    type: "quote",
    title: "Avoidance",
    backgroundImage: "/assets/images/slide-07-avoidance.jpg",
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
    level: 1,
    backgroundImage:
      "/assets/images/slide-08-ai--portal-to-internet-research.jpg",
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
    level: 2,
    backgroundImage: "/assets/images/slide-09-ai-as-thought-partner.jpg",
    bullets: [
      "Giving AI more context: PDFs, docs, images",
      "Back and forth dialogue on complex topics like health",
      "Trying different models: ChatGPT, Gemini, Claude",
    ],
  },
  {
    id: "slide-10",
    sectionId: "levels-nontech",
    type: "content",
    title: "Context Management",
    level: 5,
    backgroundImage: "/assets/images/slide-10-context-engineering.jpg",
    bullets: [
      "Understanding how context works",
      "Structured input (Markdown) yields better results",
      "Using Projects to manage context",
      "Results start feeling reliable",
    ],
  },
  {
    id: "slide-11",
    sectionId: "levels-nontech",
    type: "content",
    title: "Using AI Tools",
    level: 3,
    backgroundImage: "/assets/images/slide-11-using-ai-tools.jpg",
    bullets: [
      "Still getting unreliable results",
      "Wispr Flow - voice dictation",
      "Granola - automatic meeting notes",
      "Obsidian - AI-accessible notes in Markdown",
      "Figma, Canva, Notion, Slack with AI features",
    ],
  },
  {
    id: "slide-12",
    sectionId: "levels-nontech",
    type: "content",
    title: "AI-Powered Browsing",
    level: 4,
    backgroundImage: "/assets/images/slide-12-ai-powered-browsing.jpg",
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
    level: 6,
    backgroundImage: "/assets/images/slide-13-placeholder.jpg",
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
    level: 7,
    backgroundImage: "/assets/images/slide-14-ai-for-automation.jpg",
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
    level: 8,
    backgroundImage:
      "/assets/images/slide-15-natural-language-software-tools.jpg",
    bullets: [
      "Lovable, Bolt AI, Google AI Studio",
      "Create software without knowing code syntax",
      "Great playground to get comfortable with using AI for software",
      "Understanding the limits is part of the learning",
    ],
  },

  // Section: Technical Levels (1-9) - Note: slide-17 removed, content merged into slide-16
  {
    id: "slide-16",
    sectionId: "levels-tech",
    type: "section-header",
    title: "Command Line Interface (CLI)",
    subtitle: "Where AI meets full computer access",
    backgroundImage: "/assets/images/slide-16-command-line-interface-cli.jpg",
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
    level: 2,
    backgroundImage: "/assets/images/slide-18-using-git-and-github.jpg",
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
    level: 3,
    backgroundImage: "/assets/images/slide-19-agents-and-ai-coding.jpg",
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
    level: 4,
    backgroundImage: "/assets/images/slide-20-modes-and-workflows.jpg",
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
    title: "Using AI to Go Live",
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
    title: "Context Engineering",
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
    title: "Parallel Agents and Sub-agent Orchestration",
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

  // Section: Projects - Things I've Built
  {
    id: "project-01",
    sectionId: "projects",
    type: "content",
    title: "CraigDosSantos.com",
    subtitle: "Personal portfolio and blog",
    backgroundImage: "/assets/images/project-01-craigdossantos.jpg",
    bullets: ["Showcasing my work and writing", "Built with AI assistance"],
  },
  {
    id: "project-02",
    sectionId: "projects",
    type: "content",
    title: "The Secret Game",
    subtitle: "Share secrets with friends",
    backgroundImage: "/assets/images/project-02-secret-game.jpg",
    bullets: [
      "Pass a URL to a group of friends",
      "Answer questions to reveal hidden answers",
      "Social game for WhatsApp threads",
    ],
  },
  {
    id: "project-03",
    sectionId: "projects",
    type: "content",
    title: "Freestyle Flow",
    subtitle: "Learn to freestyle rap",
    backgroundImage: "/assets/images/project-03-freestyle-flow.jpg",
    bullets: [
      "Mobile app for freestyle rap training",
      "Also teaches improv singing",
      "Practice at your own pace",
    ],
  },
  {
    id: "project-04",
    sectionId: "projects",
    type: "content",
    title: "OurWeUnion.com",
    subtitle: "Wedding website",
    backgroundImage: "/assets/images/project-04-ourweunion.jpg",
    bullets: [
      "Wedding site for Craig and Stef",
      "Single landing page with Google Form",
    ],
  },
  {
    id: "project-05",
    sectionId: "projects",
    type: "content",
    title: "Dialogue Dojo",
    subtitle: "Practice communication skills",
    backgroundImage: "/assets/images/project-05-dialogue-dojo.jpg",
    bullets: [
      "Voice-to-voice practice sessions",
      "Communication and negotiation training",
      "Non-violent communication practice",
    ],
  },
  {
    id: "project-06",
    sectionId: "projects",
    type: "content",
    title: "Instant Book",
    subtitle: "Learn from books faster",
    backgroundImage: "/assets/images/project-06-instant-book.jpg",
    bullets: [
      "Upload EPUB books",
      "Breaks content into chapters",
      "Zoom in and out of book content",
    ],
  },
  {
    id: "project-07",
    sectionId: "projects",
    type: "content",
    title: "YouTube Summary",
    subtitle: "Summarize YouTube videos",
    backgroundImage: "/assets/images/project-07-youtube-summary.jpg",
    bullets: [
      "Drop in video or playlist links",
      "Get summaries, key takeaways, action items",
      "Chat with content via Gemini",
    ],
  },
  {
    id: "project-08",
    sectionId: "projects",
    type: "content",
    title: "Video Sum",
    subtitle: "Desktop video summarizer",
    backgroundImage: "/assets/images/project-08-video-sum.jpg",
    bullets: ["Mac desktop application", "Summarize video content locally"],
  },
  {
    id: "project-09",
    sectionId: "projects",
    type: "content",
    title: "UseQuota.app",
    subtitle: "Credit-based AI billing",
    backgroundImage: "/assets/images/project-09-usequota.jpg",
    bullets: [
      "Launch AI apps with credit billing",
      "Users get a portable wallet",
      "Works across multiple AI apps",
    ],
  },
  {
    id: "project-10",
    sectionId: "projects",
    type: "content",
    title: "Stef's Birthday",
    subtitle: "Audio card maker",
    backgroundImage: "/assets/images/project-10-stefsbirthday.jpg",
    bullets: [
      "Create personalized audio birthday cards",
      "Record and share voice messages",
      "Built for my wife's birthday",
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
      "Use AI as your learning tool!",
      "It's changing so fast, no one is that far ahead",
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
  // Project Resources
  {
    id: "res-project-01",
    slideId: "project-01",
    type: "tool",
    title: "CraigDosSantos.com",
    url: "https://craigdossantos.com",
  },
  {
    id: "res-project-02",
    slideId: "project-02",
    type: "tool",
    title: "The Secret Game",
    url: "https://secretgame.lightersky.com",
  },
  // project-03 (Freestyle Flow) - mobile app, no URL
  {
    id: "res-project-04",
    slideId: "project-04",
    type: "tool",
    title: "OurWeUnion.com",
    url: "https://ourweunion.com",
  },
  {
    id: "res-project-05",
    slideId: "project-05",
    type: "tool",
    title: "Dialogue Dojo",
    url: "https://dialoguedojo.lightersky.com",
  },
  {
    id: "res-project-06",
    slideId: "project-06",
    type: "tool",
    title: "Instant Book",
    url: "https://instantbook.lightersky.com",
  },
  {
    id: "res-project-07",
    slideId: "project-07",
    type: "tool",
    title: "YouTube Summary",
    url: "https://youtubesummary.lightersky.com",
  },
  // project-08 (Video Sum) - Mac app, no URL
  {
    id: "res-project-09",
    slideId: "project-09",
    type: "tool",
    title: "UseQuota.app",
    url: "https://usequota.app",
  },
  {
    id: "res-project-10",
    slideId: "project-10",
    type: "tool",
    title: "Stef's Birthday",
    url: "https://stefsbirthday.com",
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
