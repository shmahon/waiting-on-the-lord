# Waiting on the Lord: A Lexical and Morphological Analysis

This project generates a comprehensive document analyzing the Hebrew and Greek lexemes used in Scripture to describe "waiting on the Lord."

## Quick Start

```bash
# Build the document (auto-detects Docker or Node.js)
./build.sh

# Output: study/output/waiting_on_the_lord_analysis.docx
```

## Project Purpose

This document provides:
- Detailed analysis of Hebrew and Greek words for "waiting"
- Morphological parsing explanation for each occurrence
- Thematic grouping rationale
- Educational notes on obscure grammatical concepts
- Endnotes explaining Hebrew verb stems and Greek grammatical features

## Source Material

The analysis is based on a curated table of 41 Scripture references containing various Hebrew and Greek words related to waiting on the Lord, organized by theme.

## Building the Document

### Prerequisites
- **Docker** (recommended) OR **Node.js 18+**

### Quick Build (Recommended)

```bash
./build.sh
```

The build script automatically detects whether you have Docker or Node.js and uses the appropriate method.

### Alternative: Manual Build with Node.js

```bash
# Install dependencies (first time only)
cd project/config && npm install && cd ../..

# Generate diagram and document
./project/scripts/generate-diagram.sh
node project/src/generator.js
```

### Alternative: Manual Build with Docker

```bash
# Build the Docker image
docker build -f project/config/Dockerfile -t waiting-on-the-lord:latest .

# Run the generator
docker run --rm -v "$(pwd)/study/output:/app/study/output" waiting-on-the-lord:latest
```

### Output

The generated document will be in `study/output/waiting_on_the_lord_analysis.docx` and includes:
- Introduction to the study
- Visual diagram of lexeme-form-theme relationships
- 12 thematic sections with lexeme analysis
- Detailed morphological parsing for each occurrence
- Inline learners' notes for obscure concepts
- Endnotes explaining Hebrew stem system and Greek grammar
- Professional academic formatting

## Project Structure

```
waiting-on-the-lord/
├── README.md                       # This file
├── build.sh                        # Build script (auto-detects Docker/Node.js)
├── .gitignore
│
├── study/                          # Study materials and output
│   ├── source/                     # Original source materials
│   │   ├── source_data.json        # Extracted source data (41 entries)
│   │   ├── waiting_on_the_lord-table.docx
│   │   └── Hebrew Grammar for American Readers.md
│   ├── diagrams/                   # Mermaid diagrams
│   │   └── lexeme-overview.md      # Visual lexeme-form-theme diagram
│   ├── summaries/                  # Human-readable summaries
│   │   └── waiting_on_the_lord_summary.md
│   └── output/                     # Generated documents
│       ├── waiting_on_the_lord_analysis.docx
│       └── lexeme-overview.png
│
└── project/                        # Project internals
    ├── docs/                       # Project documentation
    │   ├── CLAUDE.md               # Instructions for Claude Code
    │   ├── SESSION.md              # Project status guide
    │   ├── CHANGELOG.md
    │   └── stages/                 # Historical stage documentation
    │       ├── STAGE1_SUMMARY.md through STAGE6_SUMMARY.md
    │       ├── COMPLETION.md
    │       └── generate_document.js (old backup)
    ├── config/                     # Build configuration
    │   ├── package.json
    │   ├── package-lock.json
    │   └── Dockerfile
    ├── src/                        # Source code
    │   └── generator.js            # DOCX document generator
    ├── scripts/                    # Build automation scripts
    │   ├── generate-diagram.sh
    │   ├── reorder-themes.js
    │   ├── content-inventory.js
    │   └── validate-content.js
    ├── data/                       # Structured data (JSON files)
    │   ├── structured_by_theme.json
    │   ├── hebrew_lexemes.json
    │   ├── greek_lexemes.json
    │   ├── hebrew_concepts.json
    │   ├── greek_concepts.json
    │   ├── hebrew_stems.json
    │   └── lexeme_summary.json
    └── validation/                 # Content validation baselines
        └── content-inventory-baseline.txt
```

## Development Stages

This project is developed incrementally across 6 stages:

1. **Repository Setup** - Git initialization, data extraction
2. **Data Structuring** - Parse and organize lexeme information
3. **Educational Content** - Create learners' notes and explanations
4. **Document Generator** - JavaScript-based DOCX generator
5. **Docker Build System** - Containerized, reproducible builds
6. **Documentation & Delivery** - Final testing and documentation

See `SESSION.md` for detailed stage information.

## Document Contents

### Main Sections
1. **Introduction** - Overview of the study
2. **Lexeme Analysis by Theme** - Detailed word studies grouped by theme:
   - Strength & Renewal
   - Trust & Hope
   - Patience & Endurance
   - Expectation & Anticipation
   - Silence & Rest
   - And others...
3. **Endnotes** - Comprehensive grammatical explanations

### For Each Lexeme
- Hebrew/Greek word with transliteration
- Strong's number and TWOT/Greek reference
- Part of speech, stem, type, person, gender, number
- Explanation of how the morphology contributes to the theme
- Scripture references with context
- Learners' notes for obscure concepts (e.g., "sequential imperfect")

### Endnotes Section
- Hebrew verb stem system (Qal, Piel, Hiphil, Niphal, etc.)
- Greek voice and mood system
- Participles in Hebrew and Greek
- Construct forms
- Deponent verbs
- And other grammatical concepts

## Educational Philosophy

This document assumes:
- Reader has some biblical language exposure
- Obscure grammatical terms need brief, clear explanation
- Examples help understanding
- Morphology illuminates theology

## Technical Notes

### Data Format
Source data is extracted from a Word document table containing:
- Theme (theological grouping)
- Reference (Bible verse)
- Lexeme & Parsing (Hebrew/Greek with grammatical details)
- Scripture Text (verse with context)

### Generation Approach
- JavaScript with `docx` npm package for DOCX generation
- Structured data in JSON format
- Docker for reproducible builds across environments

## Version Control

This project uses Git for version control. Each development stage is committed separately, allowing rollback to any previous version.

## Current Status

**Stage 6: Documentation & Delivery** ✓ COMPLETE

All stages have been completed. The project is production-ready and generates a fully functional document.

## License

This is a personal study document. Scripture quotations and lexical data are from public domain sources or used under fair use for educational purposes.

## Author

Created for Biblical lexical study and personal edification.
