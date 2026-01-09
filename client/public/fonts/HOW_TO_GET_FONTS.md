# How to Get/Create Font Files

Since you already have `Barcelona.ttf`, here's how to get the remaining font files:

## 🎯 Quick Options

### Option 1: You Already Have the Font Files
If you have the font files in another location:
1. Copy them to `client/public/fonts/`
2. Rename them to match the required names (see `FONT_FILES_LIST.txt`)
3. Run: `node scripts/font-tools.js check` to verify

### Option 2: Convert TTF to WOFF2
If you have TTF files:
1. Use online converter: https://cloudconvert.com/ttf-to-woff2
2. Or use Font Squirrel: https://www.fontsquirrel.com/tools/webfont-generator
3. Save as `.woff2` files in `client/public/fonts/`

### Option 3: Purchase/License Fonts
If these are commercial fonts:
1. Purchase from the font foundry
2. Download the webfont versions (WOFF2 format)
3. Place in `client/public/fonts/`

### Option 4: Use Font Files from Design Software
If you have fonts installed on your computer:
1. Locate font files (usually in system fonts folder)
2. Copy to `client/public/fonts/`
3. Rename to match required names

## 🔧 Converting Barcelona.ttf to WOFF2

Since you have `Barcelona.ttf`, here's how to convert it:

### Online Method (Easiest):
1. Go to: https://cloudconvert.com/ttf-to-woff2
2. Upload `Barcelona.ttf`
3. Download `Barcelona.woff2`
4. Place in `client/public/fonts/`

### Using Font Squirrel:
1. Go to: https://www.fontsquirrel.com/tools/webfont-generator
2. Upload `Barcelona.ttf`
3. Download the webfont kit
4. Extract and use the `.woff2` file

## 📝 Font File Locations

### Windows:
- System fonts: `C:\Windows\Fonts\`
- User fonts: `C:\Users\[YourName]\AppData\Local\Microsoft\Windows\Fonts\`

### Mac:
- System fonts: `/System/Library/Fonts/`
- User fonts: `~/Library/Fonts/`

### Linux:
- System fonts: `/usr/share/fonts/`
- User fonts: `~/.fonts/` or `~/.local/share/fonts/`

## ✅ Verification

After adding fonts, run:
```bash
cd client
node scripts/font-tools.js check
```

This will show:
- ✅ Which fonts are found
- ❌ Which fonts are missing
- ⚠️  Which fonts have wrong names

## 💡 Tips

1. **File Format Priority**: WOFF2 > WOFF > TTF
   - WOFF2 is smallest and fastest
   - TTF works but is larger

2. **Naming is Critical**: 
   - Must match exactly (case-sensitive)
   - "Lazy Sunday" → `LazySunday.woff2` (no space)

3. **Testing**:
   - After adding fonts, restart dev server
   - Check browser console for 404 errors
   - Test font dropdown in the app

## 🚀 Quick Start

If you have all font files ready:
1. Copy all files to `client/public/fonts/`
2. Verify names match `FONT_FILES_LIST.txt`
3. Run: `node scripts/font-tools.js check`
4. Restart dev server: `npm run dev`
5. Test the font dropdown!

