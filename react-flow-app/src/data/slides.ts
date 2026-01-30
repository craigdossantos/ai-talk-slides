import type { Section, SlideContent, Resource } from "../types/presentation";

// Define the sections of the presentation
export const sections: Section[] = [
  {
    id: "understanding",
    title: "AI Mental Models",
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
    id: "hypophobia",
    title: "AI Hypophobia",
    track: "general",
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
  // Section: AI Mental Models (merged intro + understanding)
  {
    id: "slide-01",
    sectionId: "understanding",
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
    sectionId: "understanding",
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
    sectionId: "understanding",
    type: "content",
    title: "Mental Models Through Use",
    subtitle: "Understanding comes from doing, not reading",
    backgroundImage: "/assets/images/slide-02_billboard_v4_20260123_110517.jpg",
    bullets: ["Mental models improve more through use, not instruction"],
  },
  // (slides 03, 04 were already in understanding section)
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
    id: "slide-14b",
    sectionId: "levels-nontech",
    type: "content",
    title: "Meta Level Meta Thinking",
    backgroundImage:
      "/assets/images/slide-20b_billboard_v2_20260123_123045.jpg",
    bullets: [],
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
    sectionId: "hypophobia",
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
    backgroundImage: "/assets/images/project-01-craigdossantos.jpg",
    bullets: ["Showcasing my work and writing", "Built with AI assistance"],
  },
  {
    id: "project-secretgame",
    sectionId: "projects",
    type: "content",
    title: "The Secret Game",
    subtitle: "Share secrets with friends",
    backgroundImage: "/assets/images/project-02-secret-game.jpg",
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
    backgroundImage: "/assets/images/project-03-freestyle-flow.jpg",
    bullets: ["Improv singing and rap practice", "Practice at your own pace"],
  },
  {
    id: "project-ourweunion",
    sectionId: "projects",
    type: "content",
    title: "OurWeUnion.com",
    subtitle: "Wedding website",
    backgroundImage: "/assets/images/project-04-ourweunion.jpg",
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
    backgroundImage: "/assets/images/project-05-dialogue-dojo.jpg",
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
    backgroundImage: "/assets/images/project-06-instant-book.jpg",
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
    backgroundImage: "/assets/images/project-07-youtube-summary.jpg",
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
    backgroundImage: "/assets/images/project-08-video-sum.jpg",
    bullets: ["Summarizing video content locally"],
  },
  {
    id: "project-stefsbirthday",
    sectionId: "projects",
    type: "content",
    title: "Stef's Birthday",
    subtitle: "Interactive birthday audio card",
    backgroundImage: "/assets/images/project-10-stefsbirthday.jpg",
    bullets: [
      "stefsbirthday.com",
      "Friends record voice messages for Stef's 40th",
    ],
  },
  {
    id: "project-quota",
    sectionId: "projects",
    type: "content",
    title: "Quota",
    subtitle: "Credit-based AI billing",
    backgroundImage: "/assets/images/project-09-usequota.jpg",
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
    backgroundImage: "/assets/images/project-11-presentation.jpg",
    bullets: [
      "Interactive metro map visualization",
      "Built with React Flow and AI",
    ],
  },
];

// Define resources linked to key slides
export const resources: Resource[] = [
  // New Tech, Old Mental Model - ChatGPT Billboard
  {
    id: "res-49",
    slideId: "slide-03",
    type: "article",
    title: "ChatGPT Billboard Ad",
    url: "https://creativereview.imgix.net/uploads/2025/09/ChatGPTCarUK1.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&q=60&w=2000&h=1125",
    description: "ChatGPT billboard treating AI like Google search",
  },
  // Avoidance - Millennials and platform shifts
  {
    id: "res-47",
    slideId: "slide-07",
    type: "article",
    title: "Millennials and the Platform Shift",
    url: "https://x.com/katelin_cruse/status/2015186335150326227",
    description: "How millennials might view the upcoming platform shift",
  },
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
  {
    id: "res-12",
    slideId: "slide-09",
    type: "tool",
    title: "Google Gemini",
    url: "https://gemini.google.com",
  },
  {
    id: "res-13",
    slideId: "slide-09",
    type: "tool",
    title: "ChatGPT",
    url: "https://chat.openai.com",
  },
  {
    id: "res-14",
    slideId: "slide-09",
    type: "tool",
    title: "ChatGPT Desktop App",
    url: "https://openai.com/chatgpt/download/",
  },
  {
    id: "res-15",
    slideId: "slide-09",
    type: "tool",
    title: "Claude Desktop App",
    url: "https://claude.ai/download",
  },
  {
    id: "res-16",
    slideId: "slide-09",
    type: "article",
    title: "ChatGPT for Health",
    url: "https://openai.com/index/introducing-chatgpt-health/",
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
  {
    id: "res-48",
    slideId: "slide-10",
    type: "article",
    title: "Best Nested Data Format Comparison",
    url: "https://www.improvingagents.com/blog/best-nested-data-format/",
    description: "Comparing JSON vs Markdown vs XML vs YAML for AI context",
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
  {
    id: "res-17",
    slideId: "slide-11",
    type: "tool",
    title: "Obsidian",
    url: "https://obsidian.md",
  },
  {
    id: "res-18",
    slideId: "slide-11",
    type: "tool",
    title: "NotebookLM",
    url: "https://notebooklm.google.com",
  },
  {
    id: "res-19",
    slideId: "slide-11",
    type: "tool",
    title: "Perplexity",
    url: "https://www.perplexity.ai",
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
  {
    id: "res-20",
    slideId: "slide-13",
    type: "tool",
    title: "Nano Banana (Google Image Generation)",
    url: "https://gemini.google/overview/image-generation/",
  },
  {
    id: "res-21",
    slideId: "slide-13",
    type: "tool",
    title: "Veo3 (Google Video Generation)",
    url: "https://gemini.google/overview/video-generation/",
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
  {
    id: "res-22",
    slideId: "slide-14",
    type: "tool",
    title: "Gumloop",
    url: "https://www.gumloop.com",
  },
  {
    id: "res-23",
    slideId: "slide-14",
    type: "article",
    title: "N8n Workflow Example",
    url: "https://n8n.io/workflows/4658-automate-instagram-content-discovery-and-repurposing-w-apify-gpt-4o-and-perplexity/",
    description: "Example of a medium-complexity N8n automation",
  },
  {
    id: "res-24",
    slideId: "slide-14",
    type: "article",
    title: "Gumloop Automation Examples",
    url: "https://www.gumloop.com/blog/ai-workflow-automation-examples",
    description: "Examples of AI workflow automations with Gumloop",
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
  {
    id: "res-25",
    slideId: "slide-15",
    type: "tool",
    title: "Bolt AI",
    url: "https://bolt.new",
  },
  {
    id: "res-26",
    slideId: "slide-15",
    type: "tool",
    title: "Google AI Studio",
    url: "https://aistudio.google.com",
  },
  // Claude Co-work
  {
    id: "res-27",
    slideId: "slide-15b",
    type: "tool",
    title: "Claude Co-work",
    url: "https://claude.ai",
  },
  {
    id: "res-28",
    slideId: "slide-15b",
    type: "docs",
    title: "Claude Co-work Documentation",
    url: "https://docs.anthropic.com/en/docs/claude-code",
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
  {
    id: "res-29",
    slideId: "slide-16",
    type: "tool",
    title: "Ghostty Terminal",
    url: "https://ghostty.org/",
    description: "A better terminal emulator for Mac and Linux",
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
  {
    id: "res-30",
    slideId: "slide-18",
    type: "tool",
    title: "GitHub",
    url: "https://github.com",
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
  {
    id: "res-31",
    slideId: "slide-19",
    type: "tool",
    title: "Google Antigravity",
    url: "https://antigravity.dev/",
  },
  {
    id: "res-32",
    slideId: "slide-19",
    type: "tool",
    title: "Visual Studio Code",
    url: "https://code.visualstudio.com",
  },
  {
    id: "res-33",
    slideId: "slide-19",
    type: "tool",
    title: "Windsurf IDE",
    url: "https://windsurf.com",
  },
  // Modes and Workflows - Claude Code docs
  {
    id: "res-50",
    slideId: "slide-20",
    type: "docs",
    title: "Claude Code Common Workflows",
    url: "https://code.claude.com/docs/en/common-workflows",
    description: "Common workflows and understanding Plan mode",
  },
  // Meta Level / Skill Creator
  {
    id: "res-34",
    slideId: "slide-20b",
    type: "github",
    title: "Anthropic Skill Creator",
    url: "https://github.com/anthropics/skills/tree/main/skills/skill-creator",
  },
  {
    id: "res-51",
    slideId: "slide-20b",
    type: "github",
    title: "Last 30 Days Skill",
    url: "https://github.com/mvanhorn/last30days-skill",
    description: "Find recent talk about topics on X and Reddit",
  },
  // Full Software Lifecycle - Vercel
  {
    id: "res-10",
    slideId: "slide-21",
    type: "tool",
    title: "Vercel",
    url: "https://vercel.com",
    image: "https://vercel.com/favicon.ico",
    description: "Hosting and deployment platform for web applications",
  },
  // Full Software Lifecycle - Supabase
  {
    id: "res-11",
    slideId: "slide-21",
    type: "tool",
    title: "Supabase",
    url: "https://supabase.com",
    image: "https://supabase.com/favicon.ico",
    description: "Open-source database and authentication platform",
  },
  {
    id: "res-35",
    slideId: "slide-21",
    type: "tool",
    title: "Cloudflare",
    url: "https://www.cloudflare.com",
    description: "Domains, DNS, and web security",
  },
  // Customizing the Harness
  {
    id: "res-36",
    slideId: "slide-22",
    type: "tool",
    title: "Smithery AI Skills",
    url: "https://smithery.ai/skills",
  },
  {
    id: "res-37",
    slideId: "slide-22",
    type: "tool",
    title: "Skills Directory",
    url: "https://www.skillsdirectory.org/",
  },
  {
    id: "res-38",
    slideId: "slide-22",
    type: "github",
    title: "Compound Engineering Plugin",
    url: "https://github.com/EveryInc/compound-engineering-plugin/blob/main/plugins/compound-engineering/commands/workflows/plan.md",
  },
  {
    id: "res-39",
    slideId: "slide-22",
    type: "article",
    title: "Superpowers Plugin for Dev Lifecycle",
    url: "https://blog.fsck.com/2025/10/09/superpowers/",
    description: "Great brainstorming skill for software development lifecycle",
  },
  {
    id: "res-40",
    slideId: "slide-22",
    type: "video",
    title: "Claude Code Creator Describes His Setup",
    url: "https://youtu.be/aqtseECSdtY?si=McKdLNsgVLnDA63K",
  },
  {
    id: "res-41",
    slideId: "slide-22",
    type: "github",
    title: "CC Statusline Customization",
    url: "https://github.com/chongdashu/cc-statusline",
  },
  // Context Engineering
  {
    id: "res-42",
    slideId: "slide-23",
    type: "article",
    title: "Steve Yegge's Beads",
    url: "https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a",
    description: "A coding agent memory system for context management",
  },
  {
    id: "res-46",
    slideId: "slide-23",
    type: "docs",
    title: "Claude Code Tasks",
    url: "https://docs.claude.com/en/docs/claude-code/sdk/todo-tracking",
    description: "Persistent, cross-session task management replacing Todos",
  },
  // Parallel Agents
  {
    id: "res-43",
    slideId: "slide-24",
    type: "tool",
    title: "Conductor.build",
    url: "https://conductor.build",
  },
  // Swarms and Infrastructure
  {
    id: "res-44",
    slideId: "slide-25",
    type: "article",
    title: "Welcome to Gas Town",
    url: "https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04",
    description: "Steve Yegge on scaling AI agent infrastructure",
  },
  {
    id: "res-45",
    slideId: "slide-25",
    type: "tool",
    title: "Agent Flywheel",
    url: "https://agent-flywheel.com/",
    description: "VPS setup to run 10+ agents simultaneously",
  },
  {
    id: "res-52",
    slideId: "slide-25",
    type: "tool",
    title: "Clawd.bot",
    url: "https://clawd.bot/",
    description: "Run Claude on your local machine",
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
    id: "prompt-04",
    slideId: "slide-08",
    type: "prompt",
    title: "Learn Better Prompting",
    url: "#",
    prompt: `I'm new to using AI chatbots and I want to get better at writing prompts. Please teach me:

1. What makes a good prompt vs a bad one? Give me 3 examples of each.
2. What are the most common mistakes beginners make?
3. What are 3-5 simple techniques I can start using right now to get better answers?
4. How do I know if the AI understood what I meant?

Keep it practical — I want tips I can use in my very next conversation.`,
  },
  {
    id: "prompt-05",
    slideId: "slide-08",
    type: "prompt",
    title: "Understanding Model Limitations",
    url: "#",
    prompt: `I've been using AI for questions, summaries, explanations, and brainstorming. Help me understand the boundaries:

1. When should I trust the AI's answer vs double-check it myself?
2. What kinds of questions is AI reliably good at answering?
3. What kinds of questions does it frequently get wrong or make up?
4. How can I tell when it's "hallucinating" (making something up confidently)?
5. What's the difference between using AI for brainstorming vs using it for facts?

Give me practical rules of thumb I can follow.`,
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
    id: "prompt-06",
    slideId: "slide-09",
    type: "prompt",
    title: "Exploring File Upload Capabilities",
    url: "#",
    prompt: `I want to understand what I can upload to AI chatbots and what happens when I do. Please explain:

1. What file types can I upload? (PDFs, Word docs, images, spreadsheets, etc.)
2. What does the AI actually "see" when I upload each type?
3. What works well? (e.g., summarizing a PDF, analyzing an image)
4. What doesn't work well or has limitations?
5. Are there size limits or other restrictions I should know about?
6. What's different between ChatGPT, Claude, and Gemini when it comes to file uploads?

I want to know what's possible so I can start using this in my daily work.`,
  },
  // slide-10: Context Management
  {
    id: "prompt-07",
    slideId: "slide-10",
    type: "prompt",
    title: "Using Projects in Claude and ChatGPT",
    url: "#",
    prompt: `I want to learn how to use "Projects" in AI chatbots to organize my work better. Please explain:

1. What are Projects in Claude and ChatGPT? How do they work?
2. When should I create a new Project vs just starting a new conversation?
3. How do I add context to a Project (files, instructions, etc.)?
4. What are the benefits of using Projects over regular conversations?
5. What are some practical examples of good Project setups?
6. Any tips for keeping Projects organized as they grow?

Please cover both Claude Projects and ChatGPT Projects, noting any differences between them.`,
  },
  {
    id: "prompt-08",
    slideId: "slide-10",
    type: "prompt",
    title: "Understanding AI Context Windows",
    url: "#",
    prompt: `I've noticed that AI chatbots sometimes seem to "forget" things or give worse answers in long conversations. Help me understand why:

1. What is a "context window" and how does it work?
2. Why do AI responses get worse as a conversation gets longer?
3. How much can I put into a single conversation before quality drops?
4. What are the signs that the context is getting too full?
5. When should I start a fresh conversation vs continue an existing one?
6. Are there tricks to keep conversations effective for longer?

Explain this in simple terms — I don't have a technical background.`,
  },
  {
    id: "prompt-09",
    slideId: "slide-10",
    type: "prompt",
    title: "Understanding Markdown",
    url: "#",
    prompt: `I keep hearing that using Markdown formatting when talking to AI gives better results. Please teach me:

1. What is Markdown and why does it help when communicating with AI?
2. Show me the most useful Markdown basics: headings, lists, bold, code blocks
3. Give me a before/after example — a messy prompt vs the same prompt formatted in Markdown
4. What's the minimum I need to know to start using it right away?
5. Where else is Markdown used? (so I know if it's worth learning more)

Keep it simple — I've never used Markdown before.`,
  },
  {
    id: "prompt-10",
    slideId: "slide-10",
    type: "prompt",
    title: "Understanding JSON for Non-Technical People",
    url: "#",
    prompt: `I'm not a programmer, but I keep running into something called JSON when working with AI tools and automations. Help me understand it:

1. What is JSON in plain English? What's it used for?
2. Show me a simple example and explain each part
3. Why do AI tools and automations use JSON so much?
4. What are the basic rules I need to know to read or edit JSON without breaking it?
5. What are the most common mistakes people make with JSON?
6. Are there any free tools that help me work with JSON more easily?

Remember, I'm not a developer — please use everyday analogies.`,
  },
  // slide-12: AI-Powered Browsing
  {
    id: "prompt-11",
    slideId: "slide-12",
    type: "prompt",
    title: "Using Google Gemini in the Browser",
    url: "#",
    prompt: `I have Google Gemini available in my Chrome browser. Please help me understand how to use it:

1. How do I activate and use Gemini within Chrome?
2. What can Gemini do with the web page I'm currently viewing?
3. What does the blue outline mean when it appears around elements on a page?
4. Can Gemini summarize articles, extract information, or help me fill out forms?
5. What are the most useful things I can ask Gemini to do while browsing?
6. What are its limitations — what can't it do with web pages?

Give me practical examples I can try right now.`,
  },
  {
    id: "prompt-12",
    slideId: "slide-12",
    type: "prompt",
    title: "Using the Claude Browser Extension",
    url: "#",
    prompt: `I have the Claude browser extension installed. Help me understand what it can do:

1. What actions can the Claude extension take in my browser?
2. Can it read and summarize the page I'm on?
3. Can it interact with web pages — clicking buttons, filling forms, navigating?
4. What are the most useful everyday use cases for the extension?
5. How is it different from just copying text into Claude's chat?
6. What are its limitations and what should I be careful about?

Give me 5 practical things I can try today with the Claude extension.`,
  },
  // slide-14b: Meta Level Meta Thinking (non-technical)
  {
    id: "prompt-13",
    slideId: "slide-14b",
    type: "prompt",
    title: "AI Automation for Knowledge Work",
    url: "#",
    prompt: `Help me understand which types of my daily knowledge work I can automate or enhance with AI:

1. What types of activities can AI do on its own (fully automate)?
2. What types of work can AI assist with but still need my input?
3. What types of knowledge work is AI NOT good at automating?
4. Give me examples of automations I could build using tools like Gumloop or N8n
5. What's the difference between simple automations (like auto-forwarding emails) and AI-powered automations?
6. Where should I start if I've never built an automation before?

I'm not a programmer. Focus on things I can set up using visual/drag-and-drop tools.`,
  },
  // slide-15: Natural Language Software Tools
  {
    id: "prompt-14",
    slideId: "slide-15",
    type: "prompt",
    title: "Getting Started with Google AI Studio",
    url: "#",
    prompt: `I've never created software before, and I want to try Google AI Studio. Please help me understand:

1. What is Google AI Studio and what can I build with it?
2. How is it different from just chatting with an AI?
3. Walk me through creating something simple — step by step
4. What do terms like "front-end" and "back-end" mean in simple language?
5. What's Google AI Studio good at, and where does it struggle?
6. What should I expect as a complete beginner — what's realistic to build?
7. How does it compare to similar tools like Lovable and Bolt AI?

Assume I have zero coding experience. Use analogies to explain technical concepts.`,
  },
  // slide-15b: Claude Co-work
  {
    id: "prompt-15",
    slideId: "slide-15b",
    type: "prompt",
    title: "Getting the Most Out of Claude Co-work",
    url: "#",
    prompt: `I want to understand Claude's Co-work feature. Please explain:

1. What is Claude Co-work and how is it different from regular Claude conversations?
2. What types of tasks is Co-work best suited for?
3. What can Co-work do that regular Claude can't?
4. What are its current limitations?
5. Walk me through a practical example of using Co-work effectively
6. What tips or best practices should I know to get the best results?

I want to know if and how I should start using this in my daily work.`,
  },
  // slide-16: Command Line Interface
  {
    id: "prompt-16",
    slideId: "slide-16",
    type: "prompt",
    title: "Command Line Basics for Mac",
    url: "#",
    prompt: `I'm a Mac user and I've never used the command line before. Please teach me:

1. How do I open the Terminal app on my Mac?
2. What is the command line and why would I want to use it?
3. Teach me the 5 most essential commands I need to know:
   - How to see where I am (pwd)
   - How to see what files are here (ls)
   - How to move to a different folder (cd)
   - How to create a new folder (mkdir)
   - How to go back to my home folder (cd ~)
4. Give me a simple exercise to practice these commands
5. What are common mistakes beginners make?
6. What should I do if something goes wrong or I get stuck?

I'm a complete beginner — please be patient and explain everything.`,
  },
  {
    id: "prompt-17",
    slideId: "slide-16",
    type: "prompt",
    title: "Command Line Basics for Windows",
    url: "#",
    prompt: `I'm a Windows user and I've never used the command line before. Please teach me:

1. How do I open a terminal on Windows? (Command Prompt, PowerShell, or Windows Terminal)
2. Which terminal should I use as a beginner?
3. What is the command line and why would I want to use it?
4. Teach me the 5 most essential commands:
   - How to see where I am (cd or pwd)
   - How to see what files are here (dir or ls)
   - How to move to a different folder (cd)
   - How to create a new folder (mkdir)
   - How to go back to my home folder
5. Give me a simple exercise to practice
6. What should I do if something goes wrong?

I'm a complete beginner — please be patient and explain everything.`,
  },
  // slide-18: Git and GitHub
  {
    id: "prompt-18",
    slideId: "slide-18",
    type: "prompt",
    title: "Understanding Git Basics",
    url: "#",
    prompt: `I'm learning about software development with AI and I keep hearing about Git. Please teach me:

1. What is Git in simple terms? Use an analogy I can relate to.
2. Why do I need Git if I'm using AI to write code?
3. What are the most important Git concepts I need to understand?
   - Commits (saving snapshots)
   - Branches (parallel versions)
   - Merging (combining work)
4. What are the 5 Git commands I'll use most often?
5. What happens if I make a mistake — can I undo things?
6. What's the minimum I need to know to start using Git today?

Assume I've never used Git or the command line before.`,
  },
  {
    id: "prompt-19",
    slideId: "slide-18",
    type: "prompt",
    title: "Understanding GitHub",
    url: "#",
    prompt: `I understand the basics of Git (saving snapshots of code). Now help me understand GitHub:

1. What is GitHub and how is it different from Git?
2. Why do developers use GitHub? What problems does it solve?
3. What is a "repository" (repo) on GitHub?
4. How do I create a GitHub account and my first repo?
5. How does GitHub help when AI makes mistakes with my code?
6. What are the most important GitHub features I should know about?

Use simple analogies — think of me as someone who uses Google Docs but has never seen code before.`,
  },
  // slide-20: Modes and Workflows
  {
    id: "prompt-20",
    slideId: "slide-20",
    type: "prompt",
    title: "Understanding Claude Code Modes",
    url: "#",
    prompt: `I'm using Claude Code (the CLI tool) and want to understand its different modes. Please explain:

1. What is "Plan Mode" and when should I use it?
2. What does "Accept with Edits" mean and how do I use it effectively?
3. What other modes or settings affect how Claude Code works?
4. How do I switch between modes and what's the workflow?
5. When should I plan first vs just start building?
6. What are common mistakes people make with these modes?

Give me a practical workflow example showing when to use each mode.`,
  },
  // Project Resources
  {
    id: "res-proj-01",
    slideId: "project-craigdossantos",
    type: "tool",
    title: "CraigDosSantos.com",
    url: "https://craigdossantos.com/",
  },
  {
    id: "res-proj-02",
    slideId: "project-secretgame",
    type: "tool",
    title: "The Secret Game",
    url: "https://secretgame.lightersky.com/",
  },
  {
    id: "res-proj-03",
    slideId: "project-freestyleflow",
    type: "video",
    title: "Freestyle Flow Demo",
    url: "https://youtube.com/shorts/wwJlxvHnJFI?si=oZlh1rnWQyaPXYqv",
  },
  {
    id: "res-proj-04",
    slideId: "project-ourweunion",
    type: "tool",
    title: "OurWeUnion.com",
    url: "https://www.ourweunion.com/",
  },
  {
    id: "res-proj-05",
    slideId: "project-dialoguedojo",
    type: "tool",
    title: "Dialogue Dojo",
    url: "https://dialoguedojo.lightersky.com/",
  },
  {
    id: "res-proj-06",
    slideId: "project-instantbook",
    type: "tool",
    title: "Instant Book",
    url: "https://instantbook.lightersky.com/",
  },
  {
    id: "res-proj-07",
    slideId: "project-youtubesummary",
    type: "tool",
    title: "YouTube Summary",
    url: "https://youtubesummary.lightersky.com/",
  },
  {
    id: "res-proj-08",
    slideId: "project-stefsbirthday",
    type: "tool",
    title: "Stef's Birthday",
    url: "https://stefsbirthday.com/",
  },
  {
    id: "res-proj-09",
    slideId: "project-quota",
    type: "tool",
    title: "Quota",
    url: "https://usequota.app/",
  },
  {
    id: "res-proj-10",
    slideId: "project-levelupai",
    type: "tool",
    title: "Level Up with AI",
    url: "https://levelupwithai.lightersky.com/",
  },
  {
    id: "prompt-21",
    slideId: "slide-20",
    type: "prompt",
    title: "Using Skills in Claude Code",
    url: "#",
    prompt: `I want to understand how to use Skills in Claude Code. Please look up the most recent Anthropic documentation on Skills and explain:

1. What are Skills and how do they work?
2. How do I find and install Skills?
3. How do I create my own custom Skills?
4. When should I use a Skill vs just giving instructions directly?
5. What are some examples of useful Skills?
6. What's the difference between Skills, slash commands, and system prompts?

Focus on practical usage — I want to start using Skills in my next coding session.`,
  },
  {
    id: "prompt-22",
    slideId: "slide-20",
    type: "prompt",
    title: "Understanding Subagents",
    url: "#",
    prompt: `I'm using AI coding tools and I keep hearing about "subagents." Please explain:

1. What is a subagent? How is it different from a regular AI conversation?
2. When should I use subagents vs doing everything in one conversation?
3. How do subagents work — do they share context with the main conversation?
4. What are practical examples of tasks that benefit from subagents?
5. How do I launch and manage subagents in Claude Code?
6. What are the limitations and gotchas I should know about?

Explain this assuming I'm comfortable with AI chat but new to agent-based workflows.`,
  },
  // slide-20b: Meta Level Meta Thinking (technical)
  {
    id: "prompt-23",
    slideId: "slide-20b",
    type: "prompt",
    title: "Competing Subagents for Code Review",
    url: "#",
    prompt: `Please dispatch two subagents to carefully review phase 5. Tell them that they're competing with another agent. Make sure they look at both architecture and implementation. Tell them that whomever finds more issues gets promoted.`,
  },
  // slide-21: Using AI to Go Live
  {
    id: "prompt-24",
    slideId: "slide-21",
    type: "prompt",
    title: "CLI Tools for Deployment Services",
    url: "#",
    prompt: `I'm learning to deploy web applications with AI assistance. Please teach me how to use the CLI (command line) tools for these services:

1. **Supabase CLI**: How do I install it, connect to my project, and manage my database from the terminal?
2. **Vercel CLI**: How do I install it, deploy my app, and manage deployments from the terminal?
3. **Cloudflare CLI (Wrangler)**: How do I install it, manage domains/DNS, and deploy Workers?

For each one:
- Show me the installation command
- Show me the 3-5 most common commands I'll use
- Explain what each command does in plain language
- Tell me when to use the CLI vs the web dashboard

Assume I know basic command line skills but am new to deployment.`,
  },
  // slide-24: Parallel Agents
  {
    id: "prompt-25",
    slideId: "slide-24",
    type: "prompt",
    title: "Understanding GitHub Worktrees",
    url: "#",
    prompt: `I'm using AI coding tools and want to understand Git Worktrees for running parallel agents. Please explain:

1. What is a Git Worktree in simple terms?
2. Why are worktrees useful when working with AI coding agents?
3. How do I create, list, and remove worktrees?
4. How do worktrees differ from branches?
5. What's a practical workflow for using worktrees with multiple AI agents working simultaneously?
6. What are common pitfalls or mistakes with worktrees?

I understand Git basics (commits, branches) but have never used worktrees.`,
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
