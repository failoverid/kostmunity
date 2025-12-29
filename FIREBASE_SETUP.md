# Firebase Firestore Setup untuk Emergencies

## Lokasi Data di Firebase Console

1. Buka: https://console.firebase.google.com
2. Pilih project Kostmunity
3. Menu kiri: **Firestore Database**
4. Collection yang digunakan:
   - `emergencies` - Data emergency alerts
   - `users` - Data user (admin/member)
   - `memberInfo` - Info detail member
   - `profileKost` - Data kost
   - `tagihan` - Billing
   - `feedback` - Feedback member
   - `lostItems` - Lost & Found

## Struktur Collection `emergencies`

```
emergencies/
  ├─ {emergencyId1}/
  │   ├─ userId: "user123"
  │   ├─ kostId: "kost456" 
  │   ├─ message: "DARURAT! Budi membutuhkan bantuan!"
  │   ├─ status: "active" | "handled"
  │   ├─ createdAt: timestamp
  │   └─ location: { lat: -6.xxx, lng: 106.xxx } | null
  │
  └─ {emergencyId2}/
      └─ ...
```

## Firestore Rules untuk Emergencies

Tambahkan di Firestore Rules (tab "Rules" di Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Atau lebih spesifik untuk emergencies:
    match /emergencies/{emergencyId} {
      // Member bisa create emergency
      allow create: if request.auth != null;
      
      // Semua member di kost yang sama bisa read
      allow read: if request.auth != null;
      
      // Hanya pembuat atau admin yang bisa update
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Hanya admin yang bisa delete
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Testing Emergency Feature

1. Login sebagai member di app
2. Buka Dashboard Member
3. Klik tombol "Darurat" / "Emergency"
4. Cek Firebase Console → Firestore → Collection `emergencies`
5. Seharusnya muncul document baru dengan:
   - userId = UID member yang login
   - kostId = ID kost member
   - status = "active"
   - message = "DARURAT! ..."

## Troubleshooting

### Collection `emergencies` tidak muncul:
- **Penyebab**: Belum ada data yang ditulis
- **Solusi**: Coba trigger emergency dari app, lalu refresh Firebase Console

### Error "Missing or insufficient permissions":
- **Penyebab**: Firestore Rules terlalu ketat
- **Solusi**: Update rules di Firebase Console > Firestore > Rules

### Notifikasi tidak muncul setiap 5 detik:
- **Penyebab**: Interval belum jalan atau emergency belum ter-create
- **Cek**: Console browser/terminal untuk error logs

### Emergency tidak auto-stop saat tombol Batalkan ditekan:
- **Cek**: Status di Firestore apakah berubah jadi "handled"
- **Debug**: Lihat console logs untuk error updateDoc

## Query Emergencies untuk Admin

Untuk menampilkan semua emergency di dashboard admin:

```typescript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';

// Listen real-time emergencies by kost
const q = query(
  collection(db, 'emergencies'),
  where('kostId', '==', yourKostId),
  where('status', '==', 'active')
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  const emergencies = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  console.log('Active emergencies:', emergencies);
  // Show alert or notification to admin
});
```

## Integration dengan Admin Dashboard

Admin dashboard bisa mendengarkan emergency real-time dan menampilkan:
- Toast notification
- Sound alert
- Badge count
- Modal emergency dengan detail member dan tombol "Mark as Handled"
