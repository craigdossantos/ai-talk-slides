#!/bin/bash
# Initialize a React + Tailwind project for presentation artifacts
# Usage: bash init-project.sh [project-name]

set -e

PROJECT_NAME=${1:-"presentation-artifact"}

echo "🚀 Creating presentation artifact project: $PROJECT_NAME"
echo ""

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "presentation-artifact",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "bundle": "parcel build index.html --dist-dir dist --no-source-maps && html-inline dist/index.html > bundle.html"
  }
}
EOF

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install react react-dom
pnpm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom
pnpm install -D tailwindcss postcss autoprefixer
pnpm install class-variance-authority clsx tailwind-merge lucide-react
pnpm install -D parcel @parcel/config-default html-inline

# Create vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# Create tsconfig.json
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
  "include": ["src"]
}
EOF

# Create tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

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
        card: {
          DEFAULT: "#161b22",
          foreground: "#e6edf3",
        },
        primary: {
          DEFAULT: "#58a6ff",
          foreground: "#0d1117",
        },
        secondary: {
          DEFAULT: "#21262d",
          foreground: "#e6edf3",
        },
        muted: {
          DEFAULT: "#8b949e",
          foreground: "#8b949e",
        },
        accent: {
          DEFAULT: "#f78166",
          foreground: "#0d1117",
          blue: "#58a6ff",
          orange: "#f78166",
          purple: "#a371f7",
          green: "#3fb950",
        },
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

# Create PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create Parcel config
cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default"
}
EOF

# Create source directories
mkdir -p src/components/ui src/lib

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Presentation Artifact</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create App.tsx
cat > src/App.tsx << 'EOF'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Presentation Artifact
        </h1>
        <p className="text-muted mb-6">
          This is a React + Tailwind artifact that will be bundled into a single HTML file.
        </p>
        
        <div className="bg-card rounded-lg p-6 border border-border">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
EOF

# Create index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }
  
  * {
    @apply border-border;
  }
}
EOF

# Create utils.ts
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# Create a basic Card component
cat > src/components/ui/card.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.parcel-cache
bundle.html
*.log
EOF

echo ""
echo "✅ Project initialized successfully!"
echo ""
echo "📁 Project structure:"
echo "   $PROJECT_NAME/"
echo "   ├── index.html"
echo "   ├── src/"
echo "   │   ├── main.tsx"
echo "   │   ├── App.tsx"
echo "   │   ├── index.css"
echo "   │   ├── lib/utils.ts"
echo "   │   └── components/ui/card.tsx"
echo "   ├── package.json"
echo "   ├── tailwind.config.js"
echo "   └── vite.config.ts"
echo ""
echo "🚀 Next steps:"
echo "   cd $PROJECT_NAME"
echo "   pnpm dev              # Start dev server at http://localhost:5173"
echo "   pnpm run bundle       # Bundle to single HTML file"
echo ""
