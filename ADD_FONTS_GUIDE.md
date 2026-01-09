# 🎨 How to Add Font Files - Quick Guide

## Step-by-Step Instructions

### Method 1: Using File Explorer (Windows/Mac)

1. **Navigate to the fonts folder**:
   - Open: `client/public/fonts/`
   - This folder should already exist in your project

2. **Copy your font files**:
   - Copy all your `.woff2`, `.woff`, or `.ttf` files
   - Paste them into the `client/public/fonts/` folder

3. **Rename files if needed**:
   - Make sure filenames match exactly (see `FONT_FILES_LIST.txt`)
   - Remove spaces: "Lazy Sunday.woff2" → "LazySunday.woff2"
   - Keep case: "MONACO.woff2" (not "Monaco.woff2")

### Method 2: Using Command Line

```bash
# Navigate to your project root
cd MasterNeonWeb

# Create fonts directory (if it doesn't exist)
mkdir -p client/public/fonts

# Copy font files (example - adjust path to your font files)
cp /path/to/your/fonts/*.woff2 client/public/fonts/

# Or copy individual files
cp /path/to/Barcelona.woff2 client/public/fonts/
cp /path/to/Alexa.woff2 client/public/fonts/
# ... etc
```

### Method 3: Drag and Drop

1. Open `client/public/fonts/` folder in File Explorer/Finder
2. Open the folder containing your font files
3. Drag and drop font files into the `fonts` folder
4. Rename if necessary to match the required names

## 📋 Quick Checklist

- [ ] Located `client/public/fonts/` folder
- [ ] Have font files ready (.woff2, .woff, or .ttf)
- [ ] Renamed files to match exact names (see `FONT_FILES_LIST.txt`)
- [ ] Copied files to `client/public/fonts/` folder
- [ ] Restarted development server (`npm run dev`)
- [ ] Tested font dropdown in browser

## 🔍 Verifying Fonts Are Working

1. **Start your development server**:
   ```bash
   cd client
   npm run dev
   ```

2. **Open browser** and go to the builder page

3. **Click the Font dropdown** - you should see:
   - Fonts displaying in their actual typefaces
   - Search bar working
   - Fonts grouped by category

4. **Check browser console** (F12):
   - Look for any 404 errors
   - If you see errors like "Failed to load resource: /fonts/Barcelona.woff2"
     → That font file is missing or incorrectly named

## ⚠️ Common Issues

### Issue: Fonts not showing
**Solution**: 
- Check file names match exactly (case-sensitive!)
- Make sure files are in `client/public/fonts/` (not `client/src/fonts/`)
- Restart development server
- Clear browser cache (Ctrl+Shift+R)

### Issue: Some fonts work, others don't
**Solution**:
- Check browser console for 404 errors
- Verify the missing font file name matches exactly
- Check file extension (.woff2, .woff, or .ttf)

### Issue: Font names have spaces
**Solution**:
- Remove spaces from filenames
- Example: "Lazy Sunday.woff2" → "LazySunday.woff2"
- See `FONT_FILES_LIST.txt` for exact names

## 📁 File Structure Example

```
MasterNeonWeb/
└── client/
    └── public/
        └── fonts/
            ├── README.md
            ├── FONT_FILES_LIST.txt
            ├── .gitkeep
            ├── Barcelona.woff2  ← Your font files go here
            ├── Alexa.woff2
            ├── Bayview.woff2
            ├── ... (all other fonts)
            └── WestCoast.woff2
```

## 🎯 Priority Order

If you can't add all fonts at once, add them in this order:

1. **Barcelona.woff2** (default font - most important!)
2. Popular/commonly used fonts
3. Fonts marked with ✨ NEW
4. Remaining fonts

## 💡 Tips

- **File format**: `.woff2` is best (smallest file size)
- **File naming**: Must be exact match (case-sensitive)
- **Testing**: After adding fonts, always restart the dev server
- **Browser cache**: Clear cache if fonts don't update

## 📞 Need Help?

Check these files for reference:
- `client/public/fonts/README.md` - Detailed guide
- `client/public/fonts/FONT_FILES_LIST.txt` - Complete file list
- `client/src/fonts.css` - See how fonts are referenced

