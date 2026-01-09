#!/usr/bin/env node

/**
 * Font File Converter and Validator
 * 
 * This script helps you:
 * 1. Check which font files are missing
 * 2. Convert TTF files to WOFF2 format (requires fonttools)
 * 3. Validate font file names
 * 
 * Usage:
 *   node scripts/font-converter.js check
 *   node scripts/font-converter.js convert
 *   node scripts/font-converter.js validate
 */

const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../public/fonts');
const FONTS_CSS = path.join(__dirname, '../src/fonts.css');

// All required font files (from fonts.css)
const REQUIRED_FONTS = [
  // Script/Handwritten
  'Alexa', 'Barcelona', 'Bayview', 'Amsterdam', 'Florence', 'Greenworld',
  'LazySunday', 'NewCursive', 'NottingHill', 'Odessa', 'Vintage', 'Venetican',
  'Weekender', 'Amanda', 'Austin', 'Beachfront', 'Chelsea', 'Freehand',
  'Freeprint', 'LoveNote', 'Manchester', 'Manscript', 'Northlore', 'Photogenic',
  'Royalty', 'Rocket', 'Signature', 'Sorrento', 'MAScript',
  // Modern/Sans-serif
  'Avante', 'Buttercup', 'ClassicType', 'LOSANGELES', 'Melbourne', 'NeoTokyo',
  'MONACO', 'SanDiego', 'SIMPLICITY', 'Typewriter', 'WAIKIKI',
  // Outline/Neon
  'Bellview', 'LOVENEON', 'majorca', 'Manhattan', 'MARQUEE', 'Mayfair',
  'MILAN', 'NeonGlow', 'NEONLITE', 'NEONTRACE', 'Nevada', 'SCIFI',
  'ROCKSTAR', 'Submarine', 'VANCOUVER', 'WestCoast'
];

const EXTENSIONS = ['.woff2', '.woff', '.ttf'];

function checkFonts() {
  console.log('🔍 Checking font files...\n');
  
  if (!fs.existsSync(FONTS_DIR)) {
    console.log('❌ Fonts directory does not exist!');
    console.log(`   Creating: ${FONTS_DIR}`);
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    console.log('✅ Fonts directory created\n');
  }

  const existingFiles = fs.readdirSync(FONTS_DIR).filter(f => 
    EXTENSIONS.some(ext => f.endsWith(ext))
  );

  const missing = [];
  const found = [];
  const wrongCase = [];

  REQUIRED_FONTS.forEach(fontName => {
    const foundFile = existingFiles.find(file => {
      const baseName = path.basename(file, path.extname(file));
      return baseName === fontName || baseName.toLowerCase() === fontName.toLowerCase();
    });

    if (foundFile) {
      const baseName = path.basename(foundFile, path.extname(foundFile));
      if (baseName === fontName) {
        found.push(fontName);
      } else {
        wrongCase.push({ expected: fontName, found: baseName });
      }
    } else {
      missing.push(fontName);
    }
  });

  console.log(`📊 Font Status:\n`);
  console.log(`✅ Found: ${found.length}/${REQUIRED_FONTS.length}`);
  console.log(`❌ Missing: ${missing.length}`);
  console.log(`⚠️  Wrong case: ${wrongCase.length}\n`);

  if (found.length > 0) {
    console.log('✅ Found fonts:');
    found.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  if (wrongCase.length > 0) {
    console.log('⚠️  Wrong case (need to rename):');
    wrongCase.forEach(({ expected, found }) => {
      console.log(`   ${found} → ${expected}`);
    });
    console.log('');
  }

  if (missing.length > 0) {
    console.log('❌ Missing fonts:');
    missing.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  // Check for extra files
  const extraFiles = existingFiles.filter(file => {
    const baseName = path.basename(file, path.extname(file));
    return !REQUIRED_FONTS.includes(baseName);
  });

  if (extraFiles.length > 0) {
    console.log('ℹ️  Extra files (not in required list):');
    extraFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  return { found, missing, wrongCase };
}

function validateFonts() {
  console.log('✅ Validating font file names...\n');
  
  if (!fs.existsSync(FONTS_DIR)) {
    console.log('❌ Fonts directory does not exist!');
    return;
  }

  const files = fs.readdirSync(FONTS_DIR);
  const fontFiles = files.filter(f => EXTENSIONS.some(ext => f.endsWith(ext)));

  console.log(`Found ${fontFiles.length} font files\n`);

  fontFiles.forEach(file => {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    
    if (REQUIRED_FONTS.includes(baseName)) {
      console.log(`✅ ${file} - Correct name`);
    } else {
      const match = REQUIRED_FONTS.find(f => f.toLowerCase() === baseName.toLowerCase());
      if (match) {
        console.log(`⚠️  ${file} - Wrong case! Should be: ${match}${ext}`);
      } else {
        console.log(`❓ ${file} - Not in required list`);
      }
    }
  });
}

function convertInstructions() {
  console.log('📝 Font Conversion Instructions\n');
  console.log('To convert TTF files to WOFF2 format, you have several options:\n');
  
  console.log('Option 1: Using online converter');
  console.log('  1. Visit: https://cloudconvert.com/ttf-to-woff2');
  console.log('  2. Upload your TTF file');
  console.log('  3. Download the WOFF2 file');
  console.log('  4. Rename to match required name\n');

  console.log('Option 2: Using fonttools (Python)');
  console.log('  1. Install: pip install fonttools brotli');
  console.log('  2. Run: pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2');
  console.log('  3. Or use: ttx -f font.ttf && ttx -f font.ttx --flavor woff2\n');

  console.log('Option 3: Using Node.js (woff2)');
  console.log('  1. Install: npm install -g woff2');
  console.log('  2. Run: woff2_compress font.ttf\n');

  console.log('Option 4: Using Font Squirrel Webfont Generator');
  console.log('  1. Visit: https://www.fontsquirrel.com/tools/webfont-generator');
  console.log('  2. Upload your font');
  console.log('  3. Download the generated webfont kit\n');
}

function generateFontList() {
  console.log('📋 Generating font file checklist...\n');
  
  const { found, missing } = checkFonts();
  
  const checklist = REQUIRED_FONTS.map(font => {
    const status = found.includes(font) ? '✅' : '❌';
    return `${status} ${font}.woff2`;
  });

  const outputPath = path.join(FONTS_DIR, 'CHECKLIST.txt');
  fs.writeFileSync(outputPath, checklist.join('\n'));
  
  console.log(`✅ Checklist saved to: ${outputPath}\n`);
}

// Main
const command = process.argv[2] || 'check';

switch (command) {
  case 'check':
    checkFonts();
    break;
  case 'validate':
    validateFonts();
    break;
  case 'convert':
    convertInstructions();
    break;
  case 'list':
    generateFontList();
    break;
  default:
    console.log('Font Converter Tool\n');
    console.log('Usage:');
    console.log('  node scripts/font-converter.js check     - Check which fonts are missing');
    console.log('  node scripts/font-converter.js validate  - Validate font file names');
    console.log('  node scripts/font-converter.js convert   - Show conversion instructions');
    console.log('  node scripts/font-converter.js list      - Generate checklist file');
}

