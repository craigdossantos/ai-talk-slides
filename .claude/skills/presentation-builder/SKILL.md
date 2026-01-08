# Presentation Builder Skill

## Overview
This skill enables building reveal.js presentations with two approaches:
1. **Simple Mode**: Single HTML file with embedded CSS/JS (like D-Squared70's approach)
2. **Modern Mode**: React + Tailwind + shadcn → bundled to single HTML (like Anthropic's web-artifacts-builder)

Choose based on complexity:
- Simple interactive elements → Simple Mode
- Complex components, state management, design systems → Modern Mode

---

## Simple Mode: Single HTML File

Best for: Quick presentations, straightforward interactivity, minimal dependencies.

### Structure
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation</title>
    <!-- Reveal.js from CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap" rel="stylesheet">
    <style>
        /* All CSS embedded here */
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            <section><!-- Slides --></section>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
    <script>
        // All JavaScript embedded here
        Reveal.initialize({ hash: true });
    </script>
</body>
</html>
```

### For Simple Interactive Elements
Use vanilla JS or inline React via CDN:
```html
<!-- React via CDN for simple components -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>

<div id="interactive-component"></div>
<script type="text/babel">
    function MyComponent() {
        const [count, setCount] = React.useState(0);
        return <button onClick={() => setCount(c => c+1)}>Clicked {count}</button>;
    }
    ReactDOM.createRoot(document.getElementById('interactive-component')).render(<MyComponent />);
</script>
```

---

## Modern Mode: React → Single HTML Bundle

Best for: Complex interactive artifacts, design systems, multiple components, type safety.

### Step 1: Initialize Project
Run the init script from `.claude/skills/presentation-builder/scripts/`:

```bash
bash .claude/skills/presentation-builder/scripts/init-project.sh my-presentation
cd my-presentation
```

This creates:
```
my-presentation/
├── index.html          # Entry point
├── src/
│   ├── index.tsx       # React entry
│   ├── App.tsx         # Main component
│   ├── components/     # React components
│   │   └── ui/         # shadcn components
│   └── styles/
│       └── globals.css # Tailwind + custom styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .parcelrc
```

### Step 2: Develop Normally
Edit multiple files, create components, use TypeScript:

```tsx
// src/components/SkillExplorer.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function SkillExplorer() {
    const [level, setLevel] = useState(0);
    return (
        <Card className="bg-slate-900 border-slate-700">
            <CardContent>
                {/* Complex interactive UI */}
            </CardContent>
        </Card>
    );
}
```

### Step 3: Bundle to Single HTML
```bash
bash .claude/skills/presentation-builder/scripts/bundle-artifact.sh
```

Output: `bundle.html` - a single file containing everything!

### Step 4: Use in Presentation
Either:
- Embed directly in reveal.js slide
- Use as iframe source

---

## Scripts

### scripts/init-project.sh
```bash
#!/bin/bash
# Initialize a React + Tailwind + shadcn project for presentation artifacts

PROJECT_NAME=${1:-"presentation-artifact"}

echo "🚀 Creating presentation artifact project: $PROJECT_NAME"

# Create project with Vite
pnpm create vite@latest "$PROJECT_NAME" --template react-ts
cd "$PROJECT_NAME"

# Install dependencies
pnpm install

# Install Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p

# Install shadcn/ui dependencies
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add -D @types/node

# Create Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        foreground: "#e6edf3",
        card: "#161b22",
        "card-foreground": "#e6edf3",
        primary: "#58a6ff",
        "primary-foreground": "#0d1117",
        secondary: "#21262d",
        "secondary-foreground": "#e6edf3",
        muted: "#8b949e",
        "muted-foreground": "#8b949e",
        accent: "#f78166",
        "accent-foreground": "#0d1117",
        border: "#30363d",
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
EOF

# Create base CSS
cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
  
  body {
    @apply bg-background text-foreground;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }
}
EOF

# Create tsconfig paths
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create lib/utils.ts for shadcn
mkdir -p src/lib
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create components/ui directory
mkdir -p src/components/ui

echo "✅ Project initialized!"
echo ""
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  pnpm dev              # Start dev server"
echo "  # Edit src/App.tsx"
echo "  bash ../scripts/bundle-artifact.sh  # Bundle when ready"
```

### scripts/bundle-artifact.sh
```bash
#!/bin/bash
# Bundle React app to single HTML file for presentation embedding

echo "📦 Bundling React app to single HTML artifact..."

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Run this script from your project root."
  exit 1
fi

# Install bundling dependencies
echo "📦 Installing bundling dependencies..."
pnpm add -D parcel @parcel/config-default parcel-resolver-tspaths html-inline

# Create Parcel config with tspaths resolver
if [ ! -f ".parcelrc" ]; then
  echo "🔧 Creating Parcel configuration..."
  cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-tspaths", "..."]
}
EOF
fi

# Build with Parcel
echo "🔨 Building with Parcel..."
pnpm exec parcel build index.html --dist-dir dist --no-source-maps --no-cache

# Inline everything into single HTML
echo "🎯 Inlining all assets into single HTML file..."
pnpm exec html-inline dist/index.html > bundle.html

# Get file size
FILE_SIZE=$(du -h bundle.html | cut -f1)

echo ""
echo "✅ Bundle complete!"
echo "📄 Output: bundle.html ($FILE_SIZE)"
echo ""
echo "To use in reveal.js presentation:"
echo '  <section>'
echo '    <iframe src="bundle.html" style="width:100%;height:600px;border:none;"></iframe>'
echo '  </section>'
```

---

## Design Guidelines

### Color Palette
```css
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-elevated: #21262d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent-blue: #58a6ff;
  --accent-orange: #f78166;
  --accent-purple: #a371f7;
  --accent-green: #3fb950;
}
```

### Typography
- **Display**: Space Grotesk (300, 400, 500, 600, 700)
- **Mono**: JetBrains Mono (400, 500)
- **Avoid**: Inter, Roboto, Arial, system defaults

### Avoiding "AI Slop" Aesthetics
❌ Don't:
- Purple gradients on white
- Inter/Roboto fonts
- Generic blue/gray corporate palettes
- Cookie-cutter layouts

✅ Do:
- Dark themes with accent colors
- Distinctive typography
- Atmospheric backgrounds with depth
- High contrast, purposeful design

---

## When to Use Each Mode

| Scenario | Mode |
|----------|------|
| Quick prototype | Simple |
| Few interactive elements | Simple |
| Complex state management | Modern |
| Multiple reusable components | Modern |
| Need TypeScript | Modern |
| Using shadcn/ui components | Modern |
| Design system consistency | Modern |
| Maximum performance | Modern (tree-shaking) |

---

## Reveal.js Integration

### Embedding Bundled Artifact
```html
<section>
    <h2>Interactive Demo</h2>
    <iframe 
        src="artifacts/skill-explorer.html"
        style="width: 100%; height: 500px; border: none; border-radius: 8px;"
        loading="lazy"
    ></iframe>
</section>
```

### Full-Slide Artifact
```html
<section data-background-iframe="artifacts/full-page-demo.html" 
         data-background-interactive>
</section>
```

### Keyboard Passthrough
For artifacts that need keyboard input:
```javascript
Reveal.initialize({
    // ... other config
    keyboard: {
        // Disable reveal.js shortcuts when in iframe
        13: null, // Enter
        32: null, // Space (if needed by artifact)
    }
});
```
