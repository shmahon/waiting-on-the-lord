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
npm run build
# OR
node src/generator.js

# Using Docker manually
docker build -t waiting-on-the-lord:latest .
docker run --rm -v "$(pwd)/output:/app/output" waiting-on-the-lord:latest
```

### Testing
```bash
npm test  # Runs the generator (same as npm run build)
```

Output: `output/waiting_on_the_lord_analysis.docx`

## Architecture

### Data-Driven Document Generation

The project follows a **multi-stage data transformation pipeline**:

1. **Source Data** (`source_data.json`) - 41 Scripture references extracted from original table
2. **Structured Data** (`data/`) - Parsed and organized into multiple JSON files by category
3. **Generator** (`src/generator.js`) - Consumes all data files to produce DOCX output

### Critical Data Files

The generator loads **5 core data files** from `data/`:

- `structured_by_theme.json` - All 41 entries organized by 12 theological themes
- `hebrew_lexemes.json` - Hebrew word definitions and morphological details
- `greek_lexemes.json` - Greek word definitions and grammatical details
- `hebrew_concepts.json` - Explanations of Hebrew grammatical concepts (stems, aspects, etc.)
- `greek_concepts.json` - Explanations of Greek grammatical concepts (voices, moods, etc.)
- `hebrew_stems.json` - Detailed explanations of the Hebrew verb stem system (Qal, Piel, Hiphil, etc.)

**Important**: The generator (`src/generator.js`) expects all these files to exist. Missing files will cause runtime errors.

### Generator Architecture

The generator (`src/generator.js`) uses the `docx` npm package (v8.5.0) to programmatically construct Word documents with:

- Title and introduction sections
- 12 thematic sections with lexeme analysis
- Morphological parsing explanations for each occurrence
- Inline learners' notes for obscure grammatical concepts
- Comprehensive endnotes section explaining Hebrew/Greek grammar

Key functions in generator:
- `getLexemeDefinition(word, strongs, language)` - Retrieves lexeme data
- `getConceptExplanation(term, language)` - Finds grammatical concept explanations

### Alternative Generator

There is also `generate_document.js` in the root directory - this appears to be an older/alternate implementation that embeds lexical data inline rather than loading from JSON files. The primary generator is `src/generator.js`.

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

The Dockerfile uses `node:18-alpine` for minimal image size. Build process:
1. Copies package files and installs production dependencies
2. Copies source code (`src/`) and data files (`data/`)
3. Creates output directory
4. Runs `node src/generator.js` which writes to `/app/output`

The volume mount `-v "$(pwd)/output:/app/output"` ensures generated files appear in the host's `output/` directory.

## Development Workflow

This project was developed incrementally across 6 stages:
1. Repository setup & data extraction
2. Lexeme analysis & data structuring
3. Educational content creation
4. Document generator development
5. Docker build system & documentation
6. Final delivery

See `SESSION.md` for stage details and `STAGE*_SUMMARY.md` files for historical records.

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

When editing `src/generator.js`:
- The script is executable (`#!/usr/bin/env node`) and can run directly
- Uses `docx` package for document construction - refer to its API for formatting options
- All data is loaded synchronously at startup (lines 8-14)
- The `sections` array accumulates all document paragraphs before packing
- Output path is `../output/waiting_on_the_lord_analysis.docx` (relative to src/)

## Adding New Data

To add new lexemes or concepts:
1. Update relevant JSON file in `data/` directory
2. Ensure structure matches existing entries
3. Run generator to verify output
4. For Hebrew stems, update `hebrew_stems.json` with new stem explanations
5. For grammatical concepts, update `hebrew_concepts.json` or `greek_concepts.json`

## Version Control Notes

- The repository uses Git with commits tracking each development stage
- Each stage (1-6) has dedicated commits for traceability
- See `CHANGELOG.md` for change history
- The main branch is `master`
