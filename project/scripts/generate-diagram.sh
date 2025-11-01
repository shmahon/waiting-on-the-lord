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
echo "Pattern analysis diagrams (Approach 3 - for Visual Summary section):"

# Generate Strong Pattern: prosdechomai
generate_diagram \
    "study/diagrams/pattern-strong-prosdechomai.md" \
    "study/output/pattern-strong-prosdechomai.png" \
    1000 800

# Generate Weak Pattern: qāwāh
generate_diagram \
    "study/diagrams/pattern-weak-qawah.md" \
    "study/output/pattern-weak-qawah.png" \
    1000 900

echo ""
echo "Alternative diagrams (for preview/potential inclusion):"

# Generate Option A: Grammar-First Decision Tree
generate_diagram \
    "study/diagrams/option-a-grammar-first-tree.md" \
    "study/output/option-a-grammar-first-tree.png" \
    1600 2200

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
echo "Theme-focused diagrams (Approach 1 - for individual theme sections):"

# Major themes (5 occurrences)
generate_diagram \
    "study/diagrams/theme-blessing-inheritance.md" \
    "study/output/theme-blessing-inheritance.png" \
    800 700

generate_diagram \
    "study/diagrams/theme-eschatological-hope.md" \
    "study/output/theme-eschatological-hope.png" \
    800 700

generate_diagram \
    "study/diagrams/theme-help-deliverance.md" \
    "study/output/theme-help-deliverance.png" \
    800 700

generate_diagram \
    "study/diagrams/theme-patience-endurance.md" \
    "study/output/theme-patience-endurance.png" \
    800 700

generate_diagram \
    "study/diagrams/theme-trust-hope.md" \
    "study/output/theme-trust-hope.png" \
    800 700

# Medium themes (3-4 occurrences)
generate_diagram \
    "study/diagrams/theme-strength-renewal.md" \
    "study/output/theme-strength-renewal.png" \
    800 700

generate_diagram \
    "study/diagrams/theme-messianic-expectation.md" \
    "study/output/theme-messianic-expectation.png" \
    800 700

# Minor themes (2 occurrences)
generate_diagram \
    "study/diagrams/theme-faithfulness-devotion.md" \
    "study/output/theme-faithfulness-devotion.png" \
    700 600

generate_diagram \
    "study/diagrams/theme-goodness-of-god.md" \
    "study/output/theme-goodness-of-god.png" \
    700 600

generate_diagram \
    "study/diagrams/theme-praise-worship.md" \
    "study/output/theme-praise-worship.png" \
    700 600

generate_diagram \
    "study/diagrams/theme-teaching-guidance.md" \
    "study/output/theme-teaching-guidance.png" \
    700 600

# Single occurrence theme
generate_diagram \
    "study/diagrams/theme-judgment-justice.md" \
    "study/output/theme-judgment-justice.png" \
    700 600

echo ""
echo "✓ All diagrams generated in study/output/"
echo ""
echo "Preview diagrams:"
ls -lh study/output/*.png | awk '{print "  " $9 " (" $5 ")"}'
