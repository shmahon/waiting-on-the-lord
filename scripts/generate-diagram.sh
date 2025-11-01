#!/bin/bash

# Generate lexeme overview diagram from Mermaid markdown

set -e

echo "Generating lexeme overview diagram..."

# Generate PNG from Mermaid
npx mmdc -i lexeme-overview.md -o output/lexeme-overview-temp.png -t neutral -b transparent -w 1400 -H 2000

# Rename to final name
mv output/lexeme-overview-temp.png output/lexeme-overview.png

echo "✓ Diagram generated: output/lexeme-overview.png"
ls -lh output/lexeme-overview.png
