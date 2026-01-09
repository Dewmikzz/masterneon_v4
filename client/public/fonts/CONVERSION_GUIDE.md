# Font File Conversion Guide

## Converting TTF to WOFF2

Since you have `Barcelona.ttf`, here are ways to convert it and other TTF files to WOFF2:

## 🌐 Online Converters (Easiest)

### 1. CloudConvert
- **URL**: https://cloudconvert.com/ttf-to-woff2
- **Steps**:
  1. Click "Select File" and choose your `.ttf` file
  2. Click "Convert"
  3. Download the `.woff2` file
  4. Save to `client/public/fonts/` with correct name

### 2. Font Squirrel Webfont Generator
- **URL**: https://www.fontsquirrel.com/tools/webfont-generator
- **Steps**:
  1. Upload your TTF file
  2. Choose "Optimal" settings
  3. Download the webfont kit
  4. Extract and use the `.woff2` file

### 3. Transfonter
- **URL**: https://transfonter.org/
- **Steps**:
  1. Upload TTF file
  2. Select "WOFF2" format
  3. Convert and download

## 💻 Command Line Tools

### Using fonttools (Python)

**Install**:
```bash
pip install fonttools brotli
```

**Convert**:
```bash
cd client/public/fonts
pyftsubset Barcelona.ttf --output-file=Barcelona.woff2 --flavor=woff2
```

### Using woff2 (Node.js)

**Install**:
```bash
npm install -g woff2
```

**Convert**:
```bash
cd client/public/fonts
woff2_compress Barcelona.ttf
# This creates Barcelona.woff2
```

## 📦 Batch Conversion

If you have multiple TTF files, you can convert them all:

### Windows (PowerShell):
```powershell
cd client/public/fonts
Get-ChildItem *.ttf | ForEach-Object {
    $name = $_.BaseName
    # Use online converter or command line tool
    Write-Host "Convert $name.ttf to $name.woff2"
}
```

### Mac/Linux (Bash):
```bash
cd client/public/fonts
for file in *.ttf; do
    name="${file%.ttf}"
    # Use conversion tool
    echo "Convert $file to ${name}.woff2"
done
```

## ✅ After Conversion

1. **Verify file names** match exactly (case-sensitive)
2. **Check file sizes** - WOFF2 should be smaller than TTF
3. **Test in browser** - Restart dev server and check font dropdown
4. **Run checker**: `npm run fonts:check`

## 🎯 Quick Conversion for Barcelona

Since you have `Barcelona.ttf`:

1. **Go to**: https://cloudconvert.com/ttf-to-woff2
2. **Upload**: `Barcelona.ttf`
3. **Download**: `Barcelona.woff2`
4. **Save to**: `client/public/fonts/Barcelona.woff2`
5. **Done!** ✅

The app will automatically use the WOFF2 version if available, falling back to TTF if needed.

