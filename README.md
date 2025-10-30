# Waiting on the Lord - Lexical Analysis Project

## Overview
This repository contains a comprehensive lexical and morphological analysis of Hebrew and Greek terms for "waiting on the Lord" in Scripture. The analysis examines verb stems, parsing, and thematic groupings to enrich understanding of faithful waiting across various biblical contexts.

## Repository Structure

```
waiting-on-the-lord/
├── README.md                          # This file
├── generate_document.js               # Main document generation script
└── waiting_on_the_lord_analysis.docx # Generated Word document
```

## Document Contents

The generated document includes:

### Hebrew Lexemes
1. **qāwāh (קָוָה)** - H6960: Most frequent waiting verb (16 occurrences)
2. **yāḥal (יָחַל)** - H3176: Intensive hoping/trusting (4 occurrences)
3. **dāmam (דָּמַם)** - H1826: Silent/still waiting (1 occurrence)
4. **ḥûl (חוּל)** - H2342: Waiting with labor-like intensity (2 occurrences)
5. **ḥākāh (חָכָה)** - H2442: Patient tarrying/longing (5 occurrences)

### Greek Lexemes
1. **apekdechomai (ἀπεκδέχομαι)** - G553: Eager eschatological expectation (6 occurrences)
2. **prosdechomai (προσδέχομαι)** - G4327: Messianic expectation (4 occurrences)
3. **elpizō (ἐλπίζω)** - G1679: Confident hope (1 occurrence)
4. **makrothymeō (μακροθυμέω)** - G3114: Long-suffering patience (1 occurrence)
5. **hypomonē (ὑπομονή)** - G5281: Patient endurance noun (1 occurrence)
6. **anamenō (ἀναμένω)** - G362: Abiding expectation (1 occurrence)

### Special Features

- **Morphological Breakdowns**: Each occurrence includes detailed parsing information (stem, type, person, gender, number)
- **Learner's Notes**: Explanations of technical terms like "sequential imperfect," "infinitive absolute," "deponent verb," etc.
- **Thematic Analysis**: Comprehensive discussion of how each word's morphology contributes to its thematic grouping
- **Endnotes Section**: Complete explanation of Hebrew verb stems (Qal, Piel, Hiphil, Hithpolel, etc.)

## Usage

### Generating the Document

```bash
node generate_document.js
```

This creates `waiting_on_the_lord_analysis.docx` with all formatting, styles, and content.

### Version Control Workflow

The repository uses Git for version control, allowing you to:

1. **Make changes** to `generate_document.js`
2. **Regenerate** the document: `node generate_document.js`
3. **Review changes**: Compare the new document with previous versions
4. **Commit** if satisfied: `git add -A && git commit -m "Description of changes"`
5. **Revert** if needed: `git checkout <commit-hash> -- generate_document.js`

### Viewing Commit History

```bash
# See all commits
git log --oneline

# See detailed changes
git log -p

# See specific commit
git show <commit-hash>
```

### Reverting to Previous Versions

```bash
# Revert file to specific commit
git checkout <commit-hash> -- generate_document.js

# Then regenerate
node generate_document.js

# Commit the reversion
git commit -m "Reverted to version from <date>"
```

## Source Data

The analysis is based on a comprehensive table of 41 biblical passages (OT and NT) examining "waiting on the Lord" across multiple thematic categories:

- Strength & Renewal
- Trust & Hope
- Patience & Endurance
- Help & Deliverance
- Blessing & Inheritance
- Teaching & Guidance
- Praise & Worship
- Faithfulness & Devotion
- Goodness of God
- Judgment & Justice
- Messianic Expectation
- Eschatological Hope

## Technical Details

### Dependencies
- **Node.js**: Runtime environment
- **docx**: Word document generation library (`npm install -g docx`)

### Document Format
- **Font**: Times New Roman (professional scholarly standard)
- **Size**: Letter (8.5" x 11") with 1" margins
- **Styles**: Professional hierarchy (Title, Heading 1-3, Block Quote)
- **Footer**: Page numbers

### Code Structure

The script uses a data-driven approach:
1. **Lexical data objects** contain all information about each Hebrew/Greek word
2. **Generator functions** create document sections programmatically
3. **Helper functions** parse morphology and generate learner's notes
4. **Style definitions** ensure professional, consistent formatting

## Modification Guide

### Adding a New Lexeme

1. Add entry to `lexicalData.hebrew` or `lexicalData.greek` array:

```javascript
{
  lexeme: "transliteration (script)",
  strongsNum: "H0000 or G000",
  theme: "Thematic categories",
  rootMeaning: "Base meaning",
  occurrences: [
    { ref: "Book 1:1", parsing: "Stem, Type, Person Gender Number", pos: "Part of Speech" }
  ],
  stems: ["List", "of", "Stems"], // For Hebrew
  voice: "Voice description", // For Greek (if applicable)
  thematicAnalysis: "Detailed analysis paragraph..."
}
```

2. If new technical terms appear, add learner's notes in `generateLearnerNotes()` or `generateGreekLearnerNotes()`

3. Regenerate: `node generate_document.js`

4. Commit: `git commit -am "Added lexeme X"`

### Modifying Existing Content

1. Edit the relevant section in `generate_document.js`
2. Regenerate document
3. Review changes
4. Commit with descriptive message

### Adjusting Formatting

Styles are defined in the `styles` object within `new Document()`:
- Fonts, sizes, spacing in `paragraphStyles` array
- Margins in `properties.page.margin`
- Numbering formats in `numbering.config`

## Future Enhancements

Potential additions for future versions:
- Comparative analysis section (Hebrew vs. Greek waiting concepts)
- Statistical summary (stem distribution, thematic frequency)
- Visual diagrams (stem relationships, semantic fields)
- Expanded Scripture quotations
- Cross-references to related non-waiting vocabulary

## License

This analysis is for educational and devotional use. Source Scripture references are from the King James Version (public domain).

## Author

Created for biblical language study and theological reflection on the concept of "waiting on the Lord."

---

Last Updated: October 30, 2025
Version: 1.0
