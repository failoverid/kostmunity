# 🚀 Quick Start Guide - Database Integration

## 📦 What You Have Now

### ✅ Models (TypeScript Interfaces)
```
models/
├── User.ts           - User authentication & roles
├── KostProfile.ts    - Kost/boarding house data
├── MemberInfo.ts     - Kost residents/members
├── Tagihan.ts        - Billing/payment records
├── Ad.ts             - Advertisements
├── SuperAdmin.ts     - Super admin access
└── index.ts          - Export all models
```

### ✅ Services (Database Operations)
```
services/
├── userService.ts        - User CRUD operations
├── kostService.ts        - Kost management
├── memberService.ts      - Member management
├── tagihanService.ts     - Billing operations
├── adsService.ts         - Ads management
├── superAdminService.ts  - Super admin ops
└── index.ts              - Export all services
```

### ✅ React Hooks (Easy UI Integration)
```
hooks/
├── useMembers.ts    - Fetch members data
├── useTagihan.ts    - Fetch billing data
├── useKost.ts       - Fetch kost data
└── useAds.ts        - Fetch ads data
```

### ✅ Utilities
```
lib/
├── formatting.ts    - Format currency, dates, etc.
└── validation.ts    - Input validation helpers
```

---

## 🎯 Common Use Cases

### 1. Display Member List in Dashboard

```tsx
import { useMembers } from '@/hooks/useMembers';
import { formatPhone, formatTimestamp } from '@/lib/formatting';

export default function MembersDashboard() {
  const { members, loading, error, refetch } = useMembers('kost123', true);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {members.map(member => (
        <View key={member.id} style={styles.card}>
          <Text style={styles.name}>{member.name}</Text>
          <Text>Room: {member.room}</Text>
          <Text>{formatPhone(member.phone)}</Text>
          <Text>Joined: {formatTimestamp(member.joinedAt)}</Text>
        </View>
      ))}
    </View>
  );
}
```

### 2. Display Billing Summary

```tsx
import { useTagihanSummary } from '@/hooks/useTagihan';
import { formatCurrency } from '@/lib/formatting';

export default function BillingSummary() {
  const { summary, loading } = useTagihanSummary('kost123');

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>Total Tagihan: {summary.total}</Text>
        <Text>Lunas: {summary.lunas}</Text>
        <Text>Belum Lunas: {summary.belumLunas}</Text>
      </View>
      
      <View style={styles.card}>
        <Text>Total Amount: {formatCurrency(summary.totalAmount)}</Text>
        <Text style={{color: 'green'}}>
          Paid: {formatCurrency(summary.totalPaid)}
        </Text>
        <Text style={{color: 'red'}}>
          Unpaid: {formatCurrency(summary.totalUnpaid)}
        </Text>
      </View>
    </View>
  );
}
```

### 3. Create New Tagihan Form

```tsx
import { useState } from 'react';
import { createTagihan } from '@/services';
import { validateRequired, validatePositiveNumber } from '@/lib/validation';

export default function CreateTagihanForm() {
  const [amount, setAmount] = useState('');
  const [room, setRoom] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    // Validate
    const amountValidation = validatePositiveNumber(amount, 'Jumlah');
    const roomValidation = validateRequired(room, 'Nomor Kamar');
    const dateValidation = validateRequired(dueDate, 'Tanggal Jatuh Tempo');

    if (!amountValidation.isValid || !roomValidation.isValid || !dateValidation.isValid) {
      setErrors({
        amount: amountValidation.error,
        room: roomValidation.error,
        dueDate: dateValidation.error
      });
      return;
    }

    try {
      await createTagihan({
        memberId: 'member123',
        memberName: 'John Doe',
        amount: parseInt(amount),
        room: room,
        dueDate: dueDate,
        kostId: 'kost123'
      });
      
      Alert.alert('Success', 'Tagihan berhasil dibuat!');
      // Reset form
      setAmount('');
      setRoom('');
      setDueDate('');
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat tagihan');
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Jumlah (Rp)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

      <TextInput
        placeholder="Nomor Kamar"
        value={room}
        onChangeText={setRoom}
      />
      {errors.room && <Text style={styles.error}>{errors.room}</Text>}

      <TextInput
        placeholder="Tanggal Jatuh Tempo (e.g., 25 Jan)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      {errors.dueDate && <Text style={styles.error}>{errors.dueDate}</Text>}

      <Button title="Buat Tagihan" onPress={handleSubmit} />
    </View>
  );
}
```

### 4. Mark Tagihan as Paid

```tsx
import { markTagihanAsPaid } from '@/services';

const handleMarkAsPaid = async (tagihanId: string) => {
  try {
    await markTagihanAsPaid(tagihanId);
    Alert.alert('Success', 'Tagihan telah dibayar!');
    refetch(); // Refresh the list
  } catch (error) {
    Alert.alert('Error', 'Gagal update status');
  }
};
```

### 5. Display Active Ads

```tsx
import { useAds } from '@/hooks/useAds';
import { Image } from 'react-native';

export default function AdsBanner() {
  const { ads, loading } = useAds(true); // true = active only

  if (loading || ads.length === 0) return null;

  return (
    <ScrollView horizontal>
      {ads.map(ad => (
        <TouchableOpacity
          key={ad.id}
          onPress={() => Linking.openURL(ad.link)}
        >
          <Image
            source={{ uri: ad.imageUrl }}
            style={{ width: 300, height: 150, marginRight: 10 }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

### 6. Add New Member

```tsx
import { createMember } from '@/services';
import { validateRequired, validatePhone } from '@/lib/validation';

const handleAddMember = async () => {
  // Validate
  const nameCheck = validateRequired(name, 'Nama');
  const phoneCheck = validatePhone(phone);
  const roomCheck = validateRequired(room, 'Nomor Kamar');

  if (!nameCheck.isValid || !phoneCheck.isValid || !roomCheck.isValid) {
    // Show errors
    return;
  }

  try {
    await createMember({
      name: name,
      phone: phone,
      room: room,
      kostId: 'kost123',
      status: 'active'
    });
    
    Alert.alert('Success', 'Member berhasil ditambahkan!');
  } catch (error) {
    Alert.alert('Error', 'Gagal menambahkan member');
  }
};
```

---

## 🔗 Import Cheat Sheet

```tsx
// Models
import { User, MemberInfo, Tagihan, KostProfile } from '@/models';

// Services
import { 
  createMember, 
  getMemberById, 
  updateMember,
  createTagihan,
  markTagihanAsPaid,
  getKostByOwnerId 
} from '@/services';

// Hooks
import { useMembers } from '@/hooks/useMembers';
import { useTagihan, useTagihanSummary } from '@/hooks/useTagihan';
import { useKost } from '@/hooks/useKost';
import { useAds } from '@/hooks/useAds';

// Utilities
import { 
  formatCurrency, 
  formatPhone, 
  formatTimestamp 
} from '@/lib/formatting';

import { 
  validateEmail, 
  validatePhone, 
  validateRequired 
} from '@/lib/validation';
```

---

## 💡 Pro Tips

1. **Always handle loading states**
   ```tsx
   if (loading) return <ActivityIndicator />;
   ```

2. **Handle errors gracefully**
   ```tsx
   if (error) return <Text>Error: {error.message}</Text>;
   ```

3. **Use refetch to refresh data**
   ```tsx
   const { data, loading, error, refetch } = useMembers();
   
   // Call refetch after mutations
   await createMember({...});
   refetch();
   ```

4. **Validate before submitting**
   ```tsx
   const validation = validateEmail(email);
   if (!validation.isValid) {
     Alert.alert('Error', validation.error);
     return;
   }
   ```

5. **Format data for display**
   ```tsx
   <Text>{formatCurrency(2500000)}</Text> // Rp 2.500.000
   <Text>{formatPhone('081234567890')}</Text> // 0812-3456-7890
   ```

---

## 📚 Next Steps

1. ✅ Models & Services are ready
2. ✅ React Hooks for easy data fetching
3. ✅ Validation & Formatting utilities
4. 🔲 Integrate into your UI components
5. 🔲 Add authentication guards
6. 🔲 Implement real-time listeners (optional)
7. 🔲 Add pagination for large lists
8. 🔲 Implement search & filter features

---

**Need Help?** Check [DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md) for detailed documentation.
