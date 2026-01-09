#!/usr/bin/env node

/**
 * Font Management Tools
 * Helps check, validate, and manage font files
 */

const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../public/fonts');

// All required fonts from fonts.css
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

function checkFonts() {
  console.log('🔍 Checking font files...\n');
  
  if (!fs.existsSync(FONTS_DIR)) {
    console.log('❌ Fonts directory does not exist!');
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    console.log('✅ Created fonts directory\n');
  }

  const files = fs.readdirSync(FONTS_DIR);
  const fontFiles = files.filter(f => /\.(woff2|woff|ttf)$/i.test(f));
  
  const found = [];
  const missing = [];
  const wrongCase = [];

  REQUIRED_FONTS.forEach(fontName => {
    const match = fontFiles.find(file => {
      const baseName = file.replace(/\.(woff2|woff|ttf)$/i, '');
      return baseName === fontName;
    });

    if (match) {
      found.push({ name: fontName, file: match });
    } else {
      const caseMatch = fontFiles.find(file => {
        const baseName = file.replace(/\.(woff2|woff|ttf)$/i, '');
        return baseName.toLowerCase() === fontName.toLowerCase();
      });
      
      if (caseMatch) {
        wrongCase.push({ expected: fontName, found: caseMatch });
      } else {
        missing.push(fontName);
      }
    }
  });

  console.log(`📊 Status: ${found.length}/${REQUIRED_FONTS.length} fonts found\n`);

  if (found.length > 0) {
    console.log('✅ Found fonts:');
    found.forEach(({ name, file }) => {
      const ext = path.extname(file);
      const size = fs.statSync(path.join(FONTS_DIR, file)).size;
      const sizeKB = (size / 1024).toFixed(1);
      console.log(`   ${name}${ext} (${sizeKB} KB)`);
    });
    console.log('');
  }

  if (wrongCase.length > 0) {
    console.log('⚠️  Wrong case (rename these):');
    wrongCase.forEach(({ expected, found }) => {
      const ext = path.extname(found);
      console.log(`   ${found} → ${expected}${ext}`);
    });
    console.log('');
  }

  if (missing.length > 0) {
    console.log(`❌ Missing ${missing.length} fonts:`);
    missing.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }

  // Show TTF files that can be converted
  const ttfFiles = fontFiles.filter(f => /\.ttf$/i.test(f));
  if (ttfFiles.length > 0) {
    console.log('💡 TTF files found (can convert to WOFF2):');
    ttfFiles.forEach(f => {
      const baseName = f.replace(/\.ttf$/i, '');
      console.log(`   ${f} → ${baseName}.woff2`);
    });
    console.log('');
  }

  return { found, missing, wrongCase, ttfFiles };
}

function generateConversionScript() {
  console.log('📝 Generating conversion instructions...\n');
  
  const { ttfFiles } = checkFonts();
  
  if (ttfFiles.length === 0) {
    console.log('No TTF files found to convert.\n');
    return;
  }

  console.log('To convert TTF to WOFF2, use one of these methods:\n');
  
  console.log('Method 1: Online Converter (Easiest)');
  console.log('  1. Visit: https://cloudconvert.com/ttf-to-woff2');
  console.log('  2. Upload each TTF file');
  console.log('  3. Download and save as .woff2 in fonts/ directory\n');

  console.log('Method 2: Font Squirrel (Recommended)');
  console.log('  1. Visit: https://www.fontsquirrel.com/tools/webfont-generator');
  console.log('  2. Upload your TTF files');
  console.log('  3. Download the webfont kit\n');

  console.log('Method 3: Command Line (if you have fonttools)');
  console.log('  Install: pip install fonttools brotli');
  ttfFiles.forEach(file => {
    const baseName = file.replace(/\.ttf$/i, '');
    console.log(`  pyftsubset ${file} --output-file=${baseName}.woff2 --flavor=woff2`);
  });
  console.log('');
}

function createFontMapping() {
  console.log('📋 Creating font file mapping...\n');
  
  const files = fs.existsSync(FONTS_DIR) ? fs.readdirSync(FONTS_DIR) : [];
  const fontFiles = files.filter(f => /\.(woff2|woff|ttf)$/i.test(f));
  
  const mapping = {};
  
  REQUIRED_FONTS.forEach(fontName => {
    const match = fontFiles.find(file => {
      const baseName = file.replace(/\.(woff2|woff|ttf)$/i, '');
      return baseName === fontName;
    });
    
    mapping[fontName] = match || 'MISSING';
  });

  const output = Object.entries(mapping)
    .map(([name, file]) => `${name.padEnd(20)} → ${file}`)
    .join('\n');

  const outputPath = path.join(FONTS_DIR, 'FONT_MAPPING.txt');
  fs.writeFileSync(outputPath, output);
  
  console.log(`✅ Mapping saved to: ${outputPath}\n`);
}

// Main
const command = process.argv[2] || 'check';

switch (command) {
  case 'check':
    checkFonts();
    break;
  case 'convert':
    generateConversionScript();
    break;
  case 'map':
    createFontMapping();
    break;
  default:
    console.log('Font Management Tools\n');
    console.log('Usage:');
    console.log('  node scripts/font-tools.js check    - Check font files');
    console.log('  node scripts/font-tools.js convert  - Show conversion guide');
    console.log('  node scripts/font-tools.js map      - Create font mapping file');
}

