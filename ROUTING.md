# 🏠 Kostmunity - Routing Documentation

## 📋 Flow Navigasi Aplikasi

### 1️⃣ Entry Point
```
app/index.tsx → Redirect otomatis ke /splash
```

### 2️⃣ Splash Screen
```
app/splash.tsx
```
- Tampil 2 detik minimal
- Auto-detect status auth user:
  - **Sudah login + role admin** → `/dashboard/admin`
  - **Sudah login + role member** → `/dashboard/member`
  - **Belum login** → `/landing`

### 3️⃣ Landing Page
```
app/landing.tsx
```
Halaman pilihan:
- **Member** → Login atau Register Member
- **Admin** → Login atau Register Admin/Kost

---

## 🔐 Authentication Routes

### Member Authentication
- **Login Member**: `/(auth)/login-member`
- **Register Member**: `/(auth)/register-member`

### Admin Authentication  
- **Login Admin**: `/(auth)/login-admin`
- **Register Admin**: `/(auth)/register-admin`

### Legacy Routes (Backward Compatibility)
- `/(auth)/onboarding` - Login gabungan lama
- `/(auth)/success-login`
- `/(auth)/success-register`

---

## 📊 Dashboard Routes

### Admin Dashboard
```
/dashboard/admin
├── /billing
├── /feedback
├── /lost-found
├── /members
└── /services
```

### Member Dashboard
```
/dashboard/member
├── /billing
├── /profile
└── /services
    ├── /feedback
    ├── /lost-found
    │   └── /my-reports
    └── /mitra
```

---

## 🎯 User Journey

### Sebagai Member Baru
1. Buka app → Splash → Landing
2. Pilih "Saya Penghuni Kost" → Klik "Daftar"
3. Isi form register member
4. Status: "pending" (menunggu admin approve)
5. Login → Dashboard Member

### Sebagai Admin Baru
1. Buka app → Splash → Landing
2. Pilih "Saya Pemilik/Admin Kost" → Klik "Daftar Kost Baru"
3. Isi form pendaftaran kost (nama kost, nama pemilik, dll)
4. Otomatis membuat:
   - User dengan role "admin"
   - Document kost di collection "kosts"
5. Redirect ke Dashboard Admin

### User yang Sudah Login
1. Buka app → Splash
2. Auto-detect role
3. Langsung ke dashboard yang sesuai

---

## 🔧 Technical Details

### File Structure
```
app/
├── _layout.tsx          # Root layout dengan Stack Navigator
├── index.tsx            # Entry → redirect to splash
├── splash.tsx           # Splash + Auth detection
├── landing.tsx          # Landing page
├── (auth)/
│   ├── _layout.tsx
│   ├── login-member/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── register-member/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── login-admin/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── register-admin/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   └── ... (legacy routes)
└── dashboard/
    ├── admin/...
    └── member/...
```

### Auth Logic
- **Member Login**: Cek role harus "member" di Firestore
- **Admin Login**: Cek role harus "admin", auto-create jika first time
- **Auto-logout**: Jika role tidak sesuai dengan halaman login yang dipilih

### Database Structure (Firestore)
```javascript
// Collection: users
{
  uid: string,
  email: string,
  name: string,
  role: "admin" | "member",
  createdAt: timestamp,
  // Admin specific:
  ownerId: string,
  kostName: string,
  // Member specific:
  status: "pending" | "active",
}

// Collection: kosts
{
  kostId: string,
  name: string,
  ownerId: string,
  ownerName: string,
  ownerEmail: string,
  createdAt: timestamp,
  status: "active" | "inactive"
}
```

---

## 📦 Dependencies Added
- `expo-linear-gradient@~14.0.2` - Untuk UI gradient di landing page

## ⚡ Next Steps
1. Install dependencies: `npm install`
2. Run: `npm start`
3. Jalankan di emulator/device

---

**Last Updated**: December 25, 2025
