# Font Files Setup Guide

This directory contains the custom font files for the Master Neon sign builder.

## 📁 Directory Structure

```
client/public/fonts/
├── README.md (this file)
├── Alexa.woff2 (or .woff, .ttf)
├── Barcelona.woff2
├── Bayview.woff2
├── ... (all other font files)
└── WestCoast.woff2
```

## 📝 How to Add Font Files

### Step 1: Obtain Font Files

You need to have the font files in one of these formats:
- **`.woff2`** (recommended - best compression, modern browsers)
- **`.woff`** (good compression, wide support)
- **`.ttf`** (fallback, larger file size)

### Step 2: Naming Convention

Font files must be named **exactly** as specified below. The naming follows these rules:

#### Standard Fonts (no spaces):
- `Alexa.woff2`
- `Barcelona.woff2`
- `Bayview.woff2`
- etc.

#### Fonts with Spaces (remove spaces):
- **"Lazy Sunday"** → `LazySunday.woff2`
- **"Notting Hill"** → `NottingHill.woff2`
- **"LOS ANGELES"** → `LOSANGELES.woff2` (all caps, no space)
- **"West Coast"** → `WestCoast.woff2`

#### Special Cases:
- **"majorca"** (lowercase) → `majorca.woff2` (keep lowercase)
- **"MONACO"** (all caps) → `MONACO.woff2` (keep all caps)
- **"WAIKIKI"** (all caps) → `WAIKIKI.woff2` (keep all caps)

### Step 3: Complete Font File List

Here are all 58 fonts that need to be added:

#### Script/Handwritten Fonts (28 fonts):
1. `Alexa.woff2`
2. `Barcelona.woff2` ⭐ (Default font)
3. `Bayview.woff2`
4. `Amsterdam.woff2`
5. `Florence.woff2` ✨ NEW
6. `Greenworld.woff2`
7. `LazySunday.woff2` ✨ NEW (note: no space)
8. `NewCursive.woff2`
9. `NottingHill.woff2` ✨ NEW (note: no space)
10. `Odessa.woff2` ✨ NEW
11. `Vintage.woff2`
12. `Venetican.woff2`
13. `Weekender.woff2` ✨ NEW
14. `Amanda.woff2`
15. `Austin.woff2`
16. `Beachfront.woff2`
17. `Chelsea.woff2`
18. `Freehand.woff2`
19. `Freeprint.woff2`
20. `LoveNote.woff2`
21. `Manchester.woff2` ✨ NEW
22. `Manscript.woff2`
23. `Northlore.woff2`
24. `Photogenic.woff2`
25. `Royalty.woff2`
26. `Rocket.woff2`
27. `Signature.woff2`
28. `Sorrento.woff2`
29. `MAScript.woff2`

#### Modern/Sans-serif Fonts (11 fonts):
30. `Avante.woff2`
31. `Buttercup.woff2`
32. `ClassicType.woff2`
33. `LOSANGELES.woff2` ✨ NEW (all caps, no space)
34. `Melbourne.woff2`
35. `NeoTokyo.woff2`
36. `MONACO.woff2` (all caps)
37. `SanDiego.woff2` ✨ NEW
38. `SIMPLICITY.woff2` ✨ NEW (all caps)
39. `Typewriter.woff2`
40. `WAIKIKI.woff2` (all caps)

#### Outline/Neon Fonts (16 fonts):
41. `Bellview.woff2` ✨ NEW
42. `LOVENEON.woff2` (all caps)
43. `majorca.woff2` ✨ NEW (lowercase)
44. `Manhattan.woff2` ✨ NEW
45. `MARQUEE.woff2` (all caps)
46. `Mayfair.woff2`
47. `MILAN.woff2` ✨ NEW (all caps)
48. `NeonGlow.woff2`
49. `NEONLITE.woff2` (all caps)
50. `NEONTRACE.woff2` (all caps)
51. `Nevada.woff2`
52. `SCIFI.woff2` (all caps)
53. `ROCKSTAR.woff2` ✨ NEW (all caps)
54. `Submarine.woff2` ✨ NEW
55. `VANCOUVER.woff2` ✨ NEW (all caps)
56. `WestCoast.woff2` ✨ NEW

### Step 4: Add Files to Directory

1. **Create the fonts directory** (if it doesn't exist):
   ```bash
   mkdir -p client/public/fonts
   ```

2. **Copy your font files** into `client/public/fonts/`

3. **Verify file names** match exactly (case-sensitive!)

### Step 5: Verify Font Files Are Working

After adding the font files:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Open the browser** and navigate to the builder page

3. **Open the font dropdown** - you should see:
   - Fonts displaying in their respective typefaces
   - Search functionality working
   - Fonts grouped by category

4. **Check browser console** for any 404 errors (missing font files)

## 🔍 Troubleshooting

### Fonts Not Loading?

1. **Check file names** - Must match exactly (case-sensitive)
2. **Check file format** - Should be `.woff2`, `.woff`, or `.ttf`
3. **Check file location** - Must be in `client/public/fonts/`
4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. **Check browser console** - Look for 404 errors

### Font File Naming Issues?

- **Spaces removed**: "Lazy Sunday" → `LazySunday.woff2`
- **Case sensitive**: `MONACO.woff2` ≠ `Monaco.woff2`
- **Special characters**: Remove all spaces, keep only letters and numbers

### Font Preview Not Showing?

- Fonts will fall back to system fonts if files are missing
- Check that `fonts.css` is imported in `main.tsx`
- Verify font files are in the correct directory

## 📦 Font File Sources

You can obtain font files from:
- Your font provider/license
- Font conversion tools (if you have TTF files)
- Design software exports

## ✅ Quick Checklist

- [ ] Created `client/public/fonts/` directory
- [ ] Added all 56 font files with correct names
- [ ] Verified file names match CSS exactly (case-sensitive)
- [ ] Restarted development server
- [ ] Tested font dropdown in browser
- [ ] Checked browser console for errors

## 🎯 Priority Fonts

If you can't add all fonts immediately, prioritize these:
1. **Barcelona** (default font) - `Barcelona.woff2`
2. Most commonly used fonts
3. Fonts marked with ✨ NEW

---

**Note**: The application will work without font files, but fonts will fall back to system defaults. For the best experience, add all font files.

