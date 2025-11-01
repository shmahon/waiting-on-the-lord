#!/bin/bash

# Generate lexeme overview diagram from Mermaid markdown

set -e

echo "Generating lexeme overview diagram..."

# Remove old diagram if it exists
rm -f study/output/lexeme-overview*.png

# Generate PNG from Mermaid (mmdc adds -1 suffix when file exists)
npx mmdc -i study/diagrams/lexeme-overview.md -o study/output/lexeme-overview.png -t neutral -b transparent -w 1400 -H 2000

# mmdc might have created lexeme-overview-1.png instead, so handle both cases
if [ -f "study/output/lexeme-overview-1.png" ]; then
    mv study/output/lexeme-overview-1.png study/output/lexeme-overview.png
fi

echo "✓ Diagram generated: study/output/lexeme-overview.png"
ls -lh study/output/lexeme-overview.png
