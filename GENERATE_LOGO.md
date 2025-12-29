# Generate Logo Kostmunity

## Deskripsi Logo

**Konsep**: Aplikasi manajemen kost modern dengan komunitas

**Design Elements**:
- 🏠 Ikon rumah/building stylized
- 👥 Elemen komunitas/people
- 🔑 Key/access symbol
- Warna utama: **Lime (#C6F432)** dan **Cream (#FDF9ED)**
- Style: Modern, minimal, flat design

## Option 1: Generate dengan AI

### Menggunakan ChatGPT/DALL-E/Midjourney:

**Prompt**:
```
Create a modern mobile app icon for "Kostmunity" - a boarding house management app.

Design requirements:
- Square icon (1024x1024px)
- Main elements: stylized house/building icon with community/people elements
- Color scheme: Lime green (#C6F432) as primary, cream (#FDF9ED) as background
- Style: Flat design, minimal, modern
- Text: Letter "K" incorporated into the house icon
- Should look good on both light and dark backgrounds
- Professional, trustworthy feel
```

### Menggunakan Canva (Free):

1. Buka https://www.canva.com
2. Pilih "App Icon" template (1024x1024)
3. Design dengan elements:
   - Background: Cream (#FDF9ED)
   - Icon rumah warna Lime (#C6F432)
   - Tambah huruf "K" bold
4. Export sebagai PNG (1024x1024)

## Option 2: Generate dengan Code (Simple Placeholder)

Jalankan script ini untuk generate placeholder logo:

```bash
npm install -g @expo/image-utils
npx expo-cli@latest generate-icon ./logo-source.png
```

## Files yang Dibutuhkan

Setelah punya logo (1024x1024px), replace files berikut:

1. **icon.png** - Main app icon (1024x1024)
2. **android-icon-foreground.png** - Android adaptive icon foreground (1024x1024)
3. **android-icon-background.png** - Android adaptive icon background (1024x1024, solid color)
4. **android-icon-monochrome.png** - Android monochrome icon (1024x1024, single color)
5. **splash-icon.png** - Splash screen icon (400x400 recommended)
6. **favicon.png** - Web favicon (48x48)

## Quick Steps

### Jika sudah punya logo 1024x1024:

1. Rename file jadi `logo-1024.png`
2. Copy ke `assets/images/`
3. Generate variants:

```bash
# Install sharp untuk resize
npm install sharp

# Jalankan script generate (lihat generate-icons.js)
node generate-icons.js
```

### Atau Manual:

1. **icon.png**: Main logo 1024x1024
2. **android-icon-foreground.png**: Logo transparent background 1024x1024
3. **android-icon-background.png**: Solid lime #C6F432, 1024x1024
4. **splash-icon.png**: Logo 400x400
5. **favicon.png**: Logo 48x48

## Rebuild App Setelah Ganti Logo

```bash
# Clear cache
npx expo start -c

# Rebuild untuk testing
npx expo run:android

# Atau build APK
eas build --platform android --profile preview
```

## Design Tips

✅ **Good**:
- Simple shapes
- High contrast
- Recognizable at small sizes
- No text (kecuali single letter)
- Works on both light/dark backgrounds

❌ **Avoid**:
- Too detailed/complex
- Low contrast colors
- Thin lines
- Full words/long text
- Gradients that don't scale well
