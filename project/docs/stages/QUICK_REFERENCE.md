# Quick Reference: Iterative Document Refinement

## Standard Workflow

1. **Edit** `generate_document.js`
2. **Generate**: `node generate_document.js`
3. **Review**: Open `waiting_on_the_lord_analysis.docx`
4. **Commit**: `git commit -am "Brief description of change"`

## Common Modifications

### Add Learner's Note

Location: `generateLearnerNotes()` or `generateGreekLearnerNotes()` functions

```javascript
if (parsings.includes("your-term")) {
  notes.push("Explanation of the term...");
}
```

### Modify Thematic Analysis

Location: `lexicalData.hebrew` or `lexicalData.greek` arrays

Edit the `thematicAnalysis` field for any lexeme.

### Adjust Document Formatting

Location: `styles` object in `new Document()`

```javascript
styles: {
  paragraphStyles: [
    {
      id: "StyleID",
      name: "Display Name",
      run: { size: 28, bold: true, font: "Times New Roman" },
      paragraph: { spacing: { before: 240, after: 120 } }
    }
  ]
}
```

### Add New Section

Location: `sections[0].children` array

```javascript
new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun("Your Section Title")]
}),
new Paragraph({
  children: [new TextRun("Content...")]
})
```

## Git Commands Cheatsheet

```bash
# Check status
git status

# See what changed
git diff

# View commit history
git log --oneline

# View specific commit
git show <commit-hash>

# Revert file to previous commit
git checkout <commit-hash> -- generate_document.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create branch for experiment
git checkout -b experimental-feature

# Switch back to master
git checkout master

# Merge experimental branch
git merge experimental-feature
```

## Testing Strategy

### Quick Test
```bash
node generate_document.js && echo "✓ Document generated successfully"
```

### View Document Metadata
```bash
file waiting_on_the_lord_analysis.docx
ls -lh waiting_on_the_lord_analysis.docx
```

### Extract Text for Quick Review
```bash
pandoc waiting_on_the_lord_analysis.docx -o preview.txt
less preview.txt
```

## Troubleshooting

### Syntax Error
- Check matching braces: `{`, `}`, `(`, `)`, `[`, `]`
- Verify comma placement in arrays and objects
- Ensure strings are properly quoted

### Document Won't Open
- Usually means malformed XML
- Check for unclosed tags in any raw XML
- Verify all TextRun objects are wrapped in Paragraph

### Unexpected Formatting
- Review style inheritance (`basedOn` property)
- Check spacing values (in twentieths of a point: 1440 = 1 inch)
- Verify HeadingLevel constants match style IDs

## Performance Tips

The script runs in < 1 second typically. If it's slow:
- Check for infinite loops in generator functions
- Verify data structures aren't duplicated unnecessarily
- Ensure no blocking operations in async code

## Backup Strategy

Git provides automatic backups, but for extra safety:

```bash
# Tag major versions
git tag -a v1.0 -m "Initial complete version"
git tag -a v1.1 -m "Added comparative analysis section"

# View tags
git tag -l

# Checkout tagged version
git checkout v1.0
```

## Example: Adding a New Hebrew Word

```javascript
// 1. Add to lexicalData.hebrew array
{
  lexeme: "shāmar (שָׁמַר)",
  strongsNum: "H8104",
  twot: "TWOT 2414",
  theme: "Trust & Hope",
  rootMeaning: "To keep, to guard, to watch over",
  occurrences: [
    { ref: "Genesis 2:15", parsing: "Qal, Infinitive Construct", pos: "Verb" }
  ],
  stems: ["Qal", "Niphal"],
  thematicAnalysis: "Your analysis here..."
}

// 2. Generate
node generate_document.js

// 3. Commit
git commit -am "Added shāmar to Hebrew lexemes"
```

## Example: Enhancing Existing Analysis

```javascript
// Find lexeme in lexicalData
const qawah = lexicalData.hebrew.find(lex => lex.lexeme.includes("qāwāh"));

// Update thematicAnalysis
qawah.thematicAnalysis = "Enhanced analysis with additional insights...";

// Generate and commit
node generate_document.js
git commit -am "Enhanced qāwāh thematic analysis with covenant theology connections"
```

---

Remember: Git allows fearless experimentation. You can always revert to any previous state!
