#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the correct theme order from source_data.json
const correctThemeOrder = [
  'STRENGTH & RENEWAL',
  'TRUST & HOPE',
  'PATIENCE & ENDURANCE',
  'HELP & DELIVERANCE',
  'BLESSING & INHERITANCE',
  'TEACHING & GUIDANCE',
  'PRAISE & WORSHIP',
  'FAITHFULNESS & DEVOTION',
  'GOODNESS OF GOD',
  'JUDGMENT & JUSTICE',
  'MESSIANIC EXPECTATION',
  'ESCHATOLOGICAL HOPE'
];

// Load structured data
const dataPath = path.join(__dirname, '../data/structured_by_theme.json');
const structuredData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create a map for quick lookup
const themeMap = new Map();
structuredData.forEach(theme => {
  themeMap.set(theme.theme, theme);
});

// Reorder according to source_data.json
const reorderedData = correctThemeOrder.map(themeName => {
  const theme = themeMap.get(themeName);
  if (!theme) {
    console.error(`Warning: Theme "${themeName}" not found in structured data`);
    return null;
  }
  return theme;
}).filter(Boolean);

// Verify we got all themes
if (reorderedData.length !== structuredData.length) {
  console.error('Warning: Number of themes changed after reordering');
  console.error(`Original: ${structuredData.length}, Reordered: ${reorderedData.length}`);
}

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(reorderedData, null, 2));

console.log('✓ Themes reordered successfully');
console.log(`  Themes: ${reorderedData.length}`);
console.log(`  Order: ${reorderedData.map(t => t.theme).join(' → ')}`);
