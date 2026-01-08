#!/bin/bash
# Bundle React + Tailwind app to single HTML file
# Usage: bash bundle-artifact.sh

set -e

echo "📦 Bundling React app to single HTML artifact..."
echo ""

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found."
  echo "   Run this script from your project root."
  exit 1
fi

# Check for required files
if [ ! -f "index.html" ]; then
  echo "❌ Error: No index.html found in project root."
  exit 1
fi

# Ensure bundling dependencies are installed
echo "📦 Checking bundling dependencies..."
if ! grep -q "parcel" package.json; then
  echo "   Installing parcel and html-inline..."
  pnpm add -D parcel @parcel/config-default html-inline
fi

# Create Parcel config if missing
if [ ! -f ".parcelrc" ]; then
  echo "🔧 Creating Parcel configuration..."
  cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default"
}
EOF
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist .parcel-cache bundle.html

# Build with Parcel
echo "🔨 Building with Parcel..."
pnpm exec parcel build index.html \
  --dist-dir dist \
  --no-source-maps \
  --no-cache \
  --public-url ./ \
  2>&1 | grep -v "^$"

# Check if build succeeded
if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: Parcel build failed. Check for errors above."
  exit 1
fi

# Inline everything into single HTML
echo "🎯 Inlining all assets into single HTML file..."
pnpm exec html-inline dist/index.html > bundle.html

# Verify output
if [ ! -f "bundle.html" ]; then
  echo "❌ Error: Failed to create bundle.html"
  exit 1
fi

# Get file size
FILE_SIZE=$(du -h bundle.html | cut -f1)
LINE_COUNT=$(wc -l < bundle.html | tr -d ' ')

echo ""
echo "════════════════════════════════════════════════"
echo "✅ Bundle complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "📄 Output: bundle.html"
echo "📊 Size: $FILE_SIZE"
echo "📝 Lines: $LINE_COUNT"
echo ""
echo "🎯 To use in reveal.js presentation:"
echo ""
echo '   <!-- As iframe -->'
echo '   <section>'
echo '     <iframe src="bundle.html" style="width:100%;height:500px;border:none;"></iframe>'
echo '   </section>'
echo ""
echo '   <!-- As full-slide background -->'
echo '   <section data-background-iframe="bundle.html" data-background-interactive>'
echo '   </section>'
echo ""
echo "🧪 To test locally: open bundle.html in your browser"
echo ""
