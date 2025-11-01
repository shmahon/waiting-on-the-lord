# Quick Start Guide

## I Just Want the Document

**Option 1: Use Pre-Generated Document**
```
output/waiting_on_the_lord_analysis.docx
```
Open with Microsoft Word, Google Docs, or LibreOffice.

**Option 2: Build It Yourself**
```bash
./build.sh
```
Output: `output/waiting_on_the_lord_analysis.docx`

---

## Requirements

**Choose ONE:**
- Node.js 18+ (fastest, recommended)
- Docker (most reproducible)

---

## Build Commands

### Using Build Script (Auto-Detect)
```bash
./build.sh
```

### Using Node.js
```bash
npm install          # First time only
npm run build        # Build document
```

### Using Docker
```bash
docker build -t waiting-on-the-lord .
docker run --rm -v "$(pwd)/output:/app/output" waiting-on-the-lord
```

---

## What You Get

A Word document with:
- Introduction to Hebrew and Greek "waiting" vocabulary
- 12 thematic sections
- 41 Scripture occurrences analyzed
- Complete morphological parsing
- Inline learners' notes
- Endnotes explaining Hebrew stems

---

## Project Structure

```
waiting-on-the-lord/
├── build.sh                      ← Run this to build
├── output/
│   └── waiting_on_the_lord_analysis.docx  ← Your document
├── data/                         ← All content (JSON)
├── src/generator.js              ← Code that builds document
└── [documentation files]
```

---

## Need More Info?

- **Complete guide:** `PROJECT_DOCUMENTATION.md`
- **Build issues:** See "Troubleshooting" in PROJECT_DOCUMENTATION.md
- **Modify content:** Edit JSON files in `data/` then rebuild

---

## Troubleshooting

**"npm not found"**
→ Install Node.js from nodejs.org

**"docker not found"**
→ Install Docker from docker.com

**"Permission denied"**
→ Run: `chmod +x build.sh`

**Build fails**
→ Run: `npm install` then try again

---

## That's It!

Run `./build.sh` and you're done.

Document will be in: `output/waiting_on_the_lord_analysis.docx`
