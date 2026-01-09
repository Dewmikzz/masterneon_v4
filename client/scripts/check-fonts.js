#!/usr/bin/env node

/**
 * Quick Font Checker
 * Simple script to check which font files exist
 */

const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../public/fonts');

const REQUIRED_FONTS = [
  'Alexa', 'Barcelona', 'Bayview', 'Amsterdam', 'Florence', 'Greenworld',
  'LazySunday', 'NewCursive', 'NottingHill', 'Odessa', 'Vintage', 'Venetican',
  'Weekender', 'Amanda', 'Austin', 'Beachfront', 'Chelsea', 'Freehand',
  'Freeprint', 'LoveNote', 'Manchester', 'Manscript', 'Northlore', 'Photogenic',
  'Royalty', 'Rocket', 'Signature', 'Sorrento', 'MAScript',
  'Avante', 'Buttercup', 'ClassicType', 'LOSANGELES', 'Melbourne', 'NeoTokyo',
  'MONACO', 'SanDiego', 'SIMPLICITY', 'Typewriter', 'WAIKIKI',
  'Bellview', 'LOVENEON', 'majorca', 'Manhattan', 'MARQUEE', 'Mayfair',
  'MILAN', 'NeonGlow', 'NEONLITE', 'NEONTRACE', 'Nevada', 'SCIFI',
  'ROCKSTAR', 'Submarine', 'VANCOUVER', 'WestCoast'
];

if (!fs.existsSync(FONTS_DIR)) {
  console.log('❌ Fonts directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(FONTS_DIR);
const found = [];
const missing = [];

REQUIRED_FONTS.forEach(font => {
  const hasFont = files.some(file => {
    const name = file.replace(/\.(woff2|woff|ttf)$/i, '');
    return name === font;
  });
  
  if (hasFont) {
    found.push(font);
  } else {
    missing.push(font);
  }
});

console.log(`\n📊 Font Status: ${found.length}/${REQUIRED_FONTS.length} fonts found\n`);

if (found.length > 0) {
  console.log('✅ Found:');
  found.forEach(f => console.log(`   ${f}`));
}

if (missing.length > 0) {
  console.log('\n❌ Missing:');
  missing.forEach(f => console.log(`   ${f}`));
}

console.log('');

