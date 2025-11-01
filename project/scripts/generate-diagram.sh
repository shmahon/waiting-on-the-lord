#!/bin/bash

# Generate all Mermaid diagrams from markdown files

set -e

echo "Generating diagrams from Mermaid markdown files..."
echo ""

# Function to generate a single diagram
generate_diagram() {
    local input=$1
    local output=$2
    local width=${3:-1400}
    local height=${4:-2000}

    echo "  Processing: $(basename "$input")"

    # Remove old versions
    rm -f "${output}"*.png

    # Generate PNG from Mermaid
    npx mmdc -i "$input" -o "$output" -t neutral -b transparent -w "$width" -H "$height"

    # Handle mmdc's -1 suffix behavior
    if [ -f "${output%.png}-1.png" ]; then
        mv "${output%.png}-1.png" "$output"
    fi

    if [ -f "$output" ]; then
        echo "  ✓ Generated: $(basename "$output") ($(du -h "$output" | cut -f1))"
    else
        echo "  ✗ Failed to generate: $(basename "$output")"
    fi
}

# Generate main lexeme overview diagram (used in document)
echo "Main diagram (included in document):"
generate_diagram \
    "study/diagrams/lexeme-overview.md" \
    "study/output/lexeme-overview.png" \
    1400 2000

echo ""
echo "Alternative diagrams (for preview/potential inclusion):"

# Generate Option A: Grammar-First Decision Tree
generate_diagram \
    "study/diagrams/option-a-grammar-first-tree.md" \
    "study/output/option-a-grammar-first-tree.png" \
    1600 2200

# Generate Option B: Heatmap Matrix
generate_diagram \
    "study/diagrams/option-b-heatmap-matrix.md" \
    "study/output/option-b-heatmap-matrix.png" \
    1400 1800

# Generate Option C: Sankey Flow
generate_diagram \
    "study/diagrams/option-c-sankey-flow.md" \
    "study/output/option-c-sankey-flow.png" \
    1600 2400

# Generate Option D: Concentric Layers
generate_diagram \
    "study/diagrams/option-d-concentric-layers.md" \
    "study/output/option-d-concentric-layers.png" \
    1600 2200

echo ""
echo "✓ All diagrams generated in study/output/"
echo ""
echo "Preview diagrams:"
ls -lh study/output/*.png | awk '{print "  " $9 " (" $5 ")"}'
