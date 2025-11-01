# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project generates a comprehensive DOCX document analyzing Hebrew and Greek lexemes related to "waiting on the Lord" from biblical texts. The generator processes structured JSON data containing lexical information, morphological parsing, and educational content to produce a professionally formatted document with endnotes and learners' notes.

## Build Commands

### Build the document (recommended)
```bash
./build.sh
```
The build script auto-detects Docker or Node.js and builds accordingly.

### Alternative build methods
```bash
# Using Node.js directly
cd project/config && npm install && cd ../..
./project/scripts/generate-diagram.sh
node project/src/generator.js

# Using Docker manually
docker build -f project/config/Dockerfile -t waiting-on-the-lord:latest .
docker run --rm -v "$(pwd)/study/output:/app/study/output" waiting-on-the-lord:latest
```

Output: `study/output/waiting_on_the_lord_analysis.docx`

## Architecture

### Data-Driven Document Generation

The project follows a **multi-stage data transformation pipeline**:

1. **Source Data** (`study/source/source_data.json`) - 41 Scripture references extracted from original table
2. **Structured Data** (`project/data/`) - Parsed and organized into multiple JSON files by category
3. **Generator** (`project/src/generator.js`) - Consumes all data files to produce DOCX output

### Critical Data Files

The generator loads **6 core data files** from `project/data/`:

- `structured_by_theme.json` - All 41 entries organized by 12 theological themes
- `hebrew_lexemes.json` - Hebrew word definitions and morphological details
- `greek_lexemes.json` - Greek word definitions and grammatical details
- `hebrew_concepts.json` - Explanations of Hebrew grammatical concepts (stems, aspects, etc.)
- `greek_concepts.json` - Explanations of Greek grammatical concepts (voices, moods, etc.)
- `hebrew_stems.json` - Detailed explanations of the Hebrew verb stem system (Qal, Piel, Hiphil, etc.)

**Important**: The generator (`project/src/generator.js`) expects all these files to exist. Missing files will cause runtime errors.

### Generator Architecture

The generator (`project/src/generator.js`) uses the `docx` npm package (v8.5.0) to programmatically construct Word documents with:

- Title and introduction sections
- Visual lexeme-form-theme overview diagram
- 12 thematic sections with lexeme analysis
- Morphological parsing explanations for each occurrence
- Inline learners' notes for obscure grammatical concepts
- Comprehensive endnotes section explaining Hebrew/Greek grammar

Key functions in generator:
- `getLexemeDefinition(word, strongs, language)` - Retrieves lexeme data
- `getConceptExplanation(term, language)` - Finds grammatical concept explanations

### Historical Note

There is also `generate_document.js` in `project/docs/stages/` - this is an older implementation that embeds lexical data inline rather than loading from JSON files. The primary generator is `project/src/generator.js`.

## Data Structure Patterns

### Lexeme Entries
Each lexeme in `hebrew_lexemes.json` and `greek_lexemes.json` follows this structure:
- `word` - Transliterated word with original script
- `strongs` - Strong's number (H#### or G####)
- `rootMeaning` - Core semantic meaning
- `occurrences` - Array of references with parsing details
- `stems` - Hebrew verb stems used (Qal, Piel, Hiphil, etc.) or Greek voices
- `thematicAnalysis` - Detailed explanation of usage patterns

### Thematic Organization
The source data is organized into 12 themes:
1. Strength & Renewal
2. Trust & Hope
3. Patience & Endurance
4. Blessing & Inheritance
5. Help & Deliverance
6. Teaching & Guidance
7. Praise & Worship
8. Faithfulness & Devotion
9. Goodness of God
10. Judgment & Justice
11. Eschatological Hope
12. (Additional themes in data)

## Docker Build System

The Dockerfile (located in `project/config/Dockerfile`) uses `node:18-alpine` for minimal image size. Build process:
1. Copies package files from `project/config/` and installs all dependencies
2. Copies project structure (`project/src/`, `project/data/`, `project/scripts/`)
3. Copies study materials (`study/diagrams/`)
4. Creates output directory at `/app/study/output`
5. Generates Mermaid diagram and runs `node project/src/generator.js`

The volume mount `-v "$(pwd)/study/output:/app/study/output"` ensures generated files appear in the host's `study/output/` directory.

## Development Workflow

This project was developed incrementally across 6 stages:
1. Repository setup & data extraction
2. Lexeme analysis & data structuring
3. Educational content creation
4. Document generator development
5. Docker build system & documentation
6. Final delivery

See `project/docs/SESSION.md` for stage details and `project/docs/stages/STAGE*_SUMMARY.md` files for historical records.

## Content Philosophy

The document assumes readers have some biblical language exposure but need:
- Brief, clear explanations of obscure grammatical terms
- Examples to aid understanding
- Morphological details that illuminate theological meaning

Educational notes explain concepts like:
- Sequential imperfect
- Hebrew verb stems (Qal, Piel, Hiphil, Niphal, etc.)
- Greek participles and deponent verbs
- Construct forms

## Modifying the Generator

When editing `project/src/generator.js`:
- The script is executable (`#!/usr/bin/env node`) and can run directly
- Uses `docx` package for document construction - refer to its API for formatting options
- All data is loaded synchronously at startup from `../data/` (relative to src/)
- The `sections` array accumulates all document paragraphs before packing
- Output path is `../../study/output/waiting_on_the_lord_analysis.docx` (relative to src/)

## Adding New Data

To add new lexemes or concepts:
1. Update relevant JSON file in `project/data/` directory
2. Ensure structure matches existing entries
3. Run generator to verify output: `node project/src/generator.js`
4. For Hebrew stems, update `project/data/hebrew_stems.json` with new stem explanations
5. For grammatical concepts, update `project/data/hebrew_concepts.json` or `project/data/greek_concepts.json`

## Repository Organization

The repository is organized for clarity:
- **Root**: Only `README.md`, `build.sh`, and `.gitignore`
- **study/**: All study materials, source documents, diagrams, and generated output
- **project/**: All code, configuration, data, and documentation

This structure separates study content from project internals, making it easy to navigate.

## Version Control Notes

- The repository uses Git with commits tracking each development stage
- Each stage (1-6) has dedicated commits for traceability
- See `project/docs/CHANGELOG.md` for change history
- The main branch is `master`
