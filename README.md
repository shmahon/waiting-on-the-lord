# Waiting on the Lord: A Lexical and Morphological Analysis

This project generates a comprehensive document analyzing the Hebrew and Greek lexemes used in Scripture to describe "waiting on the Lord."

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
- Docker (for containerized builds)
- Git

### Quick Build

```bash
# Clone or extract the repository
cd waiting-on-the-lord

# Build using Docker (recommended)
./build.sh

# Output will be in: output/waiting_on_the_lord_analysis.docx
```

### Alternative: Manual Build

If you prefer to build without Docker:

```bash
# Requires Node.js 18+ and npm
npm install
npm run build
```

## Project Structure

```
waiting-on-the-lord/
├── SESSION.md                 # Project status and resumption guide
├── README.md                  # This file
├── source_data.json          # Extracted source data (41 entries)
├── data/                     # Structured data (generated in Stage 2)
│   ├── lexemes.json          # Parsed lexeme information
│   └── educational.json      # Learners' notes
├── src/                      # Document generator (Stage 4)
│   ├── generator.js          # Main generator
│   ├── formatters.js         # Formatting utilities
│   └── endnotes.js           # Endnote system
├── Dockerfile                # Container definition (Stage 5)
├── build.sh                  # Build script (Stage 5)
└── output/                   # Generated documents
    └── waiting_on_the_lord_analysis.docx
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

## Document Contents (Planned)

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

**Stage 1: Repository Setup** ✓ (IN PROGRESS)

See `SESSION.md` for current status and how to resume in a new chat session.

## License

This is a personal study document. Scripture quotations and lexical data are from public domain sources or used under fair use for educational purposes.

## Author

Created for Biblical lexical study and personal edification.
