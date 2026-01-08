# Presentation Core Skill

## Overview
This skill enables Claude to create professional reveal.js presentations with modern design principles, avoiding generic AI aesthetics.

## When to Use
- Creating new presentation slides
- Editing existing slide content
- Configuring reveal.js themes and transitions
- Structuring multi-section presentations

## Core Principles

### Structure
Presentations use reveal.js with this basic structure:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation Title</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css">
    <style>
        /* Custom styles here */
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section><!-- Slide 1 --></section>
            <section><!-- Slide 2 --></section>
            <!-- Vertical slides use nested sections -->
            <section>
                <section><!-- Vertical slide 1 --></section>
                <section><!-- Vertical slide 2 --></section>
            </section>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            transition: 'slide',
            // Additional config
        });
    </script>
</body>
</html>
```

### Typography Guidelines
**Never use:** Inter, Roboto, Open Sans, Lato, Arial, system fonts

**Recommended fonts:**
- **Technical/Code:** JetBrains Mono, Fira Code, Space Mono
- **Headers:** Space Grotesk, Bricolage Grotesque, Outfit
- **Editorial:** Playfair Display, Crimson Pro, Newsreader
- **Modern:** IBM Plex Sans, Source Sans 3

**Loading fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Typography scale:**
- Use extreme weight contrasts: 300 vs 700, not 400 vs 500
- Use dramatic size jumps: 3x or more between levels
- Example: headers at 4rem, body at 1.2rem

### Color & Theme Guidelines
**Avoid:**
- Purple gradients on white backgrounds
- Flat, solid color backgrounds
- Low-contrast color schemes
- Generic blue/gray corporate palettes

**Recommended approaches:**
- Dark themes with accent colors (easier on eyes, more dramatic)
- Gradient backgrounds with depth
- Color schemes inspired by IDE themes (Dracula, Nord, One Dark)
- High contrast text on atmospheric backgrounds

**Example custom theme:**
```css
:root {
    --bg-primary: #0d1117;
    --bg-secondary: #161b22;
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --accent: #58a6ff;
    --accent-secondary: #f78166;
}

.reveal {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.reveal h1, .reveal h2 {
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text-primary);
    text-shadow: 0 0 40px rgba(88, 166, 255, 0.3);
}
```

### Background Treatments
**Create atmosphere, not flatness:**
```css
/* Gradient mesh effect */
.reveal {
    background: 
        radial-gradient(ellipse at 20% 80%, rgba(88, 166, 255, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(247, 129, 102, 0.1) 0%, transparent 50%),
        linear-gradient(180deg, #0d1117 0%, #161b22 100%);
}

/* Subtle grid pattern */
.reveal::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
}
```

### Animation & Transitions
**Reveal.js built-in transitions:** none, fade, slide, convex, concave, zoom

**Fragment animations for content reveal:**
```html
<p class="fragment fade-up">Appears with upward fade</p>
<p class="fragment highlight-blue">Highlights in blue</p>
<p class="fragment fade-in-then-out">Appears then disappears</p>
```

**Custom CSS animations (use sparingly):**
```css
@keyframes subtle-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

.accent-text {
    animation: subtle-pulse 3s ease-in-out infinite;
}
```

### Slide Content Patterns

**Title slide:**
```html
<section data-background-gradient="radial-gradient(circle at 30% 70%, #1a1a2e 0%, #0d0d1a 100%)">
    <h1 style="font-size: 3.5rem; font-weight: 700;">Using AI as a Native Skill</h1>
    <p style="font-size: 1.5rem; color: var(--text-secondary); margin-top: 2rem;">
        A practical map for learning, working, and building with AI
    </p>
</section>
```

**Content slide with fragments:**
```html
<section>
    <h2>The Real Starting Point</h2>
    <div style="text-align: left; max-width: 800px; margin: 0 auto;">
        <p class="fragment">This talk is not about tools.</p>
        <p class="fragment">It's about <strong style="color: var(--accent);">mental models</strong></p>
        <p class="fragment">How you think about what a tool <em>is</em>, what it can do, and how you work with it over time.</p>
    </div>
</section>
```

**Quote slide:**
```html
<section>
    <blockquote style="font-size: 2rem; border-left: 4px solid var(--accent); padding-left: 2rem;">
        "Confusion is almost always a sequencing problem, not an intelligence problem."
    </blockquote>
</section>
```

**Image slide with caption:**
```html
<section>
    <img src="assets/images/mental-model-diagram.png" alt="Mental Model" style="max-height: 60vh;">
    <p style="font-size: 0.9rem; color: var(--text-secondary);">The expanded mental model</p>
</section>
```

### Embedding Interactive Artifacts
When an interactive artifact is created using the interactive-artifacts skill:
```html
<section>
    <h2>Interactive Demo</h2>
    <iframe 
        src="assets/artifacts/skill-level-explorer.html" 
        style="width: 90%; height: 500px; border: none; border-radius: 8px;"
    ></iframe>
</section>
```

### Speaker Notes
```html
<section>
    <h2>Key Point</h2>
    <p>Visible content</p>
    <aside class="notes">
        These are speaker notes - only visible in speaker view (press 'S')
        - Remember to pause here
        - Ask audience about their experience
    </aside>
</section>
```

### Reveal.js Configuration Options
```javascript
Reveal.initialize({
    hash: true,                    // Enable URL hash for slides
    transition: 'slide',           // none/fade/slide/convex/concave/zoom
    transitionSpeed: 'default',    // default/fast/slow
    backgroundTransition: 'fade',  // Transition for backgrounds
    center: true,                  // Vertical centering
    controls: true,                // Navigation arrows
    progress: true,                // Progress bar
    slideNumber: 'c/t',            // Current/total slide numbers
    keyboard: true,                // Keyboard navigation
    overview: true,                // Slide overview mode
    touch: true,                   // Touch navigation
    loop: false,                   // Loop presentation
    autoSlide: 0,                  // Auto-advance (0 = disabled)
    
    // Plugins
    plugins: []
});
```

## File Outputs
- Main presentation: `index.html`
- Individual slides (optional): `slides/*.md` or `slides/*.html`
- Custom styles: embedded in `<style>` or `styles/custom.css`
