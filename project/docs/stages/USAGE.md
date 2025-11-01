# Usage Guide: Waiting on the Lord Document Generator

## Quick Start

### For End Users (Just Want the Document)

**The easiest way: Download the pre-generated document**
- File: `waiting_on_the_lord_analysis.docx`
- Open with Microsoft Word, Google Docs, LibreOffice, or any DOCX viewer
- No build process required!

### For Developers (Want to Regenerate or Modify)

**Three ways to build:**

#### Method 1: Auto-Build Script (Recommended)
```bash
./build.sh
```
This script automatically detects whether you have Docker or Node.js and uses the appropriate method.

#### Method 2: Node.js (Fastest)
```bash
# First time only: install dependencies
npm install

# Generate the document
npm run build

# Or run directly
node src/generator.js
```

**Requirements:** Node.js 18 or higher

#### Method 3: Docker (Most Portable)
```bash
# Build the container
docker build -t waiting-on-the-lord:latest .

# Generate the document
docker run --rm -v "$(pwd)/output:/app/output" waiting-on-the-lord:latest
```

**Requirements:** Docker

## Output Location

All build methods create the document at:
```
output/waiting_on_the_lord_analysis.docx
```

## Customization

### Modifying the Document Content

1. **Edit source data** - Modify files in `data/` directory:
   - `structured_by_theme.json` - Scripture references and themes
   - `hebrew_lexemes.json` - Hebrew word definitions
   - `greek_lexemes.json` - Greek word definitions
   - `hebrew_concepts.json` - Hebrew grammar explanations
   - `greek_concepts.json` - Greek grammar explanations
   - `hebrew_stems.json` - Hebrew stem system

2. **Edit the generator** - Modify `src/generator.js`:
   - Change formatting
   - Add new sections
   - Modify layout
   - Adjust content selection

3. **Rebuild** - Run any build method above

### Adding New Content

To add a new Scripture reference:

1. Edit `data/structured_by_theme.json`
2. Add entry in appropriate theme section:
```json
{
  "word": "קָוָה",
  "transliteration": "qāwāh",
  "strongs": "H6960",
  "twot": "1994, 1995",
  "language": "Hebrew",
  "occurrences": [
    {
      "reference": "Psalm 27:14",
      "parsing": "Verb, Qal, Imperative, Masculine Singular",
      "morphology": {
        "part_of_speech": "Verb",
        "stem": "Qal",
        "type": "Imperative",
        "gender": "Masculine",
        "number": "Singular"
      },
      "scripture_text": "Wait on the LORD..."
    }
  ]
}
```
3. Rebuild the document

## Troubleshooting

### Build Fails with "npm: command not found"
**Solution:** Install Node.js 18 or higher from https://nodejs.org/

### Build Fails with "docker: command not found"  
**Solution:** Install Docker from https://docker.com/ or use Node.js method

### "Module not found" Error
**Solution:** Run `npm install` first to install dependencies

### Document Not Generated
**Solution:** Check that `output/` directory exists and is writable

### Wrong Output Location
**Solution:** Document is always created in `output/waiting_on_the_lord_analysis.docx`, relative to project root

## File Structure

```
waiting-on-the-lord/
├── README.md              # Project overview
├── USAGE.md              # This file
├── SESSION.md            # Project status for continuation
├── package.json          # Node.js dependencies
├── Dockerfile            # Docker build configuration
├── build.sh              # Universal build script
├── src/
│   └── generator.js      # Main document generator
├── data/                 # Source data (JSON files)
│   ├── structured_by_theme.json
│   ├── hebrew_lexemes.json
│   ├── greek_lexemes.json
│   ├── hebrew_concepts.json
│   ├── greek_concepts.json
│   ├── hebrew_stems.json
│   └── ...
└── output/               # Generated documents
    └── waiting_on_the_lord_analysis.docx
```

## System Requirements

### Minimum Requirements
- **To view document:** Any DOCX viewer (Word, Google Docs, LibreOffice)
- **To rebuild:** Node.js 18+ OR Docker

### Recommended Setup
- Node.js 20+ for fastest builds
- 100 MB disk space
- Any modern OS (Windows, macOS, Linux)

## Performance

- **Build time:** 2-5 seconds (Node.js), 30-60 seconds (Docker first build)
- **Output size:** ~14 KB DOCX file
- **Memory usage:** Minimal (<100 MB)

## Getting Help

1. Check `README.md` for project overview
2. Check `SESSION.md` for detailed project status
3. Check `STAGE4_SUMMARY.md` for technical implementation details
4. Review error messages - they usually indicate missing dependencies

## Version Control

This project uses Git for version control. Each stage is committed separately:
- Stage 1: Repository setup and data extraction
- Stage 2: Lexeme analysis and data structuring  
- Stage 3: Educational content creation
- Stage 4: Document generator implementation
- Stage 5: Documentation and testing

To see project history:
```bash
git log --oneline
```

To return to a specific stage:
```bash
git checkout <commit-hash>
```

## License

This is a personal study document. Scripture quotations and lexical data are from public domain sources or used under fair use for educational purposes.
