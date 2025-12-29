# Cara Build APK Kostmunity

## Langkah 1: Install EAS CLI (jika belum)
```bash
npm install -g eas-cli
```

## Langkah 2: Login ke Expo
```bash
eas login
```
Jika belum punya akun Expo, daftar di https://expo.dev

## Langkah 3: Konfigurasi Project
```bash
eas build:configure
```

## Langkah 4: Build APK

### Preview Build (untuk testing):
```bash
eas build --platform android --profile preview
```

### Production Build:
```bash
eas build --platform android --profile production
```

## Langkah 5: Download APK
Setelah build selesai (sekitar 10-20 menit), Anda akan mendapat link untuk download APK.
Link juga bisa diakses di: https://expo.dev/accounts/[your-username]/projects/kostmunity/builds

## Build Lokal (tanpa cloud - lebih cepat tapi butuh Android Studio):
```bash
# Install dependencies
npm install

# Build APK lokal
npx expo run:android --variant release
```

## Notes:
- Build pertama akan lebih lama (15-25 menit)
- Build berikutnya lebih cepat (5-10 menit)
- APK bisa langsung diinstall di HP Android
- Untuk publish ke Play Store, gunakan AAB format (ganti buildType di eas.json)

## Troubleshooting:
- Jika error "No bundle identifier", pastikan package name sudah ada di app.json
- Jika error Firebase, pastikan google-services.json ada di folder android/app/
- Untuk production build, tambahkan keystore di EAS Secrets
