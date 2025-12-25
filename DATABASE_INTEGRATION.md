# Firestore Database Integration Guide

## 📁 Project Structure

```
models/          # TypeScript interfaces for all collections
├── User.ts
├── KostProfile.ts
├── MemberInfo.ts
├── Tagihan.ts
├── Ad.ts
├── SuperAdmin.ts
└── index.ts

services/        # CRUD operations for each collection
├── userService.ts
├── kostService.ts
├── memberService.ts
├── tagihanService.ts
├── adsService.ts
├── superAdminService.ts
└── index.ts
```

## 🔥 Collections Overview

### 1. **users** - User Authentication & Roles
- Stores user credentials and role information
- Roles: `user`, `owner`, `admin`, `member`
- Links to other collections via `ownerId`

### 2. **profileKost** - Kost Properties
- Contains boarding house details
- Each kost has unique `inviteCode` for member registration
- Owned by a user with `owner` role

### 3. **memberInfo** - Kost Members
- Information about residents
- Linked to specific rooms and kost
- Can be active or inactive

### 4. **tagihan** - Billing Records
- Payment records for members
- Status: `Belum Lunas`, `Lunas`, `Terlambat`
- Linked to members and rooms

### 5. **ads** - Advertisements
- Banner/ads to display in app
- Can be activated/deactivated
- Supports ordering

### 6. **superAdmin** - Super Administrators
- Special access level users
- Can manage multiple kosts

## 📝 Usage Examples

### User Management

```typescript
import { 
  createUser, 
  getUserById, 
  getUserByEmail,
  updateUser,
  deleteUser 
} from '@/services';

// Create new user
const userId = await createUser({
  nama: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'secure123', // Consider hashing
  role: 'member',
  ownerId: 'owner123'
});

// Get user by email
const user = await getUserByEmail('john@example.com');

// Update user
await updateUser(userId, {
  nama: 'John Updated',
  role: 'owner'
});

// Delete user
await deleteUser(userId);
```

### Kost Management

```typescript
import { 
  createKost, 
  getKostByOwnerId,
  getKostByInviteCode,
  updateKost,
  generateInviteCode 
} from '@/services';

// Create new kost
const kostId = await createKost({
  idKost: 'kost_indah_01',
  name: 'Kost Indah',
  address: 'Jl. Merdeka No. 123',
  rooms: '20',
  inviteCode: generateInviteCode(), // Auto-generate code
  ownerId: 'owner123'
});

// Get kost by owner
const myKosts = await getKostByOwnerId('owner123');

// Join kost using invite code
const kost = await getKostByInviteCode('ABC123');
if (kost) {
  console.log(`Found kost: ${kost.name}`);
}

// Update kost
await updateKost(kostId, {
  rooms: '25',
  address: 'New address'
});
```

### Member Management

```typescript
import { 
  createMember, 
  getMembersByKostId,
  getActiveMembers,
  updateMember,
  deactivateMember 
} from '@/services';

// Add new member
const memberId = await createMember({
  name: 'Jane Smith',
  phone: '081234567890',
  room: 'A101',
  kostId: 'kost123',
  userId: 'user456',
  status: 'active'
});

// Get all active members in a kost
const activeMembers = await getActiveMembers('kost123');

// Update member info
await updateMember(memberId, {
  room: 'A102',
  phone: '081234567891'
});

// Deactivate member (soft delete)
await deactivateMember(memberId);
```

### Billing (Tagihan) Management

```typescript
import { 
  createTagihan, 
  getTagihanByMemberId,
  getUnpaidTagihan,
  markTagihanAsPaid,
  getTagihanSummary,
  getTotalUnpaidAmount 
} from '@/services';

// Create new bill
const tagihanId = await createTagihan({
  memberId: 'member123',
  memberName: 'Jane Smith',
  amount: 2500000,
  room: 'A101',
  dueDate: '25 Jan',
  status: 'Belum Lunas',
  kostId: 'kost123'
});

// Get all unpaid bills
const unpaid = await getUnpaidTagihan('kost123');

// Mark as paid
await markTagihanAsPaid(tagihanId);

// Get member's bills
const memberBills = await getTagihanByMemberId('member123');

// Get summary for dashboard
const summary = await getTagihanSummary('kost123');
console.log(`Total: ${summary.total}`);
console.log(`Paid: Rp ${summary.totalPaid}`);
console.log(`Unpaid: Rp ${summary.totalUnpaid}`);

// Calculate total unpaid for a member
const totalUnpaid = await getTotalUnpaidAmount('member123');
```

### Ads Management

```typescript
import { 
  createAd, 
  getActiveAds,
  updateAd,
  activateAd,
  deactivateAd 
} from '@/services';

// Create new ad
const adId = await createAd({
  title: 'Promo Kost Bulan Ini!',
  imageUrl: 'https://example.com/banner.jpg',
  link: 'https://wa.me/62812345678',
  isActive: true,
  displayOrder: 1
});

// Get active ads for display
const ads = await getActiveAds();

// Update ad
await updateAd(adId, {
  title: 'New Title',
  displayOrder: 2
});

// Toggle ad status
await deactivateAd(adId);
await activateAd(adId);
```

### Super Admin Management

```typescript
import { 
  createSuperAdmin, 
  isSuperAdmin,
  getSuperAdminByUserId 
} from '@/services';

// Create super admin
const adminId = await createSuperAdmin({
  userId: 'auth_uid_123',
  name: 'Super Admin',
  email: 'admin@kostmunity.com'
});

// Check if user is super admin
const isAdmin = await isSuperAdmin('auth_uid_123');
if (isAdmin) {
  console.log('User has super admin access');
}

// Get super admin data
const admin = await getSuperAdminByUserId('auth_uid_123');
```

## 🔐 Integration with UI Components

### Example: Display Members in Dashboard

```typescript
import { useEffect, useState } from 'react';
import { getMembersByKostId } from '@/services';
import { MemberInfo } from '@/models';

export default function MemberListScreen() {
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const kostId = 'kost123'; // Get from context/auth
      const data = await getMembersByKostId(kostId);
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      {members.map(member => (
        <View key={member.id}>
          <Text>{member.name}</Text>
          <Text>Room: {member.room}</Text>
          <Text>Phone: {member.phone}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Example: Create Tagihan Form

```typescript
import { useState } from 'react';
import { createTagihan } from '@/services';

export default function CreateTagihanScreen() {
  const [amount, setAmount] = useState('');
  const [room, setRoom] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    try {
      await createTagihan({
        memberId: 'member123',
        memberName: 'John Doe',
        amount: parseInt(amount),
        room: room,
        dueDate: dueDate,
        kostId: 'kost123'
      });
      
      Alert.alert('Success', 'Tagihan created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create tagihan');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput 
        placeholder="Room"
        value={room}
        onChangeText={setRoom}
      />
      <TextInput 
        placeholder="Due Date (e.g., 25 Jan)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Create Tagihan" onPress={handleSubmit} />
    </View>
  );
}
```

## ⚠️ Important Notes

1. **Password Security**: Currently passwords are stored as plain text. Consider implementing proper hashing (bcrypt/scrypt) before production.

2. **Error Handling**: All service functions throw errors. Always wrap in try-catch blocks.

3. **Timestamps**: Firebase `serverTimestamp()` is used for createdAt/updatedAt fields.

4. **Authentication**: Services don't check authentication. Implement auth checks in your UI components.

5. **Validation**: Add input validation before calling service functions.

6. **Real-time Updates**: These services use one-time reads. For real-time updates, use Firestore's `onSnapshot()` listeners.

## 🚀 Next Steps

1. Add authentication guards to service functions
2. Implement real-time listeners for live data
3. Add data validation layer
4. Create custom hooks for React components
5. Add pagination for large datasets
6. Implement proper password hashing
7. Add file upload service for images

---

**Created**: December 25, 2025
**Version**: 1.0.0
