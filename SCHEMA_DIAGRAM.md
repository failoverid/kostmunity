# 🗂️ Firestore Collections Schema

## Database Structure Overview

```
Firestore Database
│
├── users/                          (User Authentication & Roles)
│   └── {userId}/
│       ├── id: string
│       ├── nama: string
│       ├── email: string
│       ├── username: string
│       ├── password: string
│       ├── role: "user" | "owner" | "admin" | "member"
│       ├── ownerId: string         (Links to Kost owner)
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── profileKost/                    (Kost Properties)
│   └── {kostId}/
│       ├── id: string
│       ├── idKost: string          (Custom ID)
│       ├── name: string
│       ├── address: string
│       ├── rooms: string
│       ├── inviteCode: string      (For member registration)
│       ├── ownerId: string         → users/{userId}
│       └── createdAt: Timestamp
│
├── memberInfo/                     (Kost Residents)
│   └── {memberId}/
│       ├── id: string
│       ├── name: string
│       ├── phone: string
│       ├── room: string
│       ├── joinedAt: Timestamp
│       ├── kostId: string          → profileKost/{kostId}
│       ├── userId: string          → users/{userId}
│       └── status: "active" | "inactive"
│
├── tagihan/                        (Billing Records)
│   └── {tagihanId}/
│       ├── id: string
│       ├── memberId: string        → memberInfo/{memberId}
│       ├── memberName: string
│       ├── amount: number
│       ├── room: string
│       ├── dueDate: string
│       ├── status: "Belum Lunas" | "Lunas" | "Terlambat"
│       ├── createdAt: Timestamp
│       ├── paidAt: Timestamp
│       └── kostId: string          → profileKost/{kostId}
│
├── ads/                            (Advertisements)
│   └── {adId}/
│       ├── id: string
│       ├── title: string
│       ├── imageUrl: string
│       ├── link: string
│       ├── createdAt: Timestamp
│       ├── updatedAt: Timestamp
│       ├── isActive: boolean
│       └── displayOrder: number
│
└── superAdmin/                     (Super Administrators)
    └── {adminId}/
        ├── id: string
        ├── userId: string          → users/{userId}
        ├── name: string
        ├── email: string
        ├── role: "superadmin"
        └── createdAt: Timestamp
```

---

## Relationships Diagram

```
┌─────────────┐
│   users     │
│  (Owner)    │
└──────┬──────┘
       │ owns
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│ profileKost │        │ superAdmin  │
│   (Kost)    │        │             │
└──────┬──────┘        └─────────────┘
       │ has
       ├───────────────────┐
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ memberInfo  │     │   tagihan   │
│  (Members)  │────>│  (Bills)    │
└─────────────┘     └─────────────┘
       │                   │
       │                   │
       └───────┬───────────┘
               │
               ▼
        ┌─────────────┐
        │    users    │
        │  (Member)   │
        └─────────────┘

┌─────────────┐
│     ads     │  (Independent)
└─────────────┘
```

---

## Data Flow Examples

### 1. Owner Creates Kost
```
1. Register as Owner
   users/ → { role: "owner", ... }

2. Create Kost Profile
   profileKost/ → { ownerId: userId, inviteCode: "ABC123", ... }

3. Generate Invite Code
   inviteCode: "ABC123" (for members to join)
```

### 2. Member Joins Kost
```
1. Register as Member
   users/ → { role: "member", ... }

2. Join using Invite Code
   Find Kost with inviteCode = "ABC123"

3. Create Member Info
   memberInfo/ → { 
     userId: memberId,
     kostId: kostId,
     room: "A101",
     ...
   }
```

### 3. Create & Pay Billing
```
1. Owner creates Tagihan
   tagihan/ → { 
     memberId: "member123",
     amount: 2500000,
     status: "Belum Lunas",
     ...
   }

2. Member pays
   Update: { status: "Lunas", paidAt: Timestamp }

3. Display in Dashboard
   Group by status, calculate totals
```

---

## Query Patterns

### Get Member's Kost Info
```typescript
// 1. Get member info
const member = await getMemberById(memberId);

// 2. Get kost details
const kost = await getKostById(member.kostId);

// 3. Get owner info
const owner = await getUserById(kost.ownerId);
```

### Get All Members of a Kost
```typescript
// 1. Get all members by kostId
const members = await getMembersByKostId(kostId);

// 2. Get active members only
const activeMembers = await getActiveMembers(kostId);
```

### Get Member's Billing
```typescript
// 1. Get all tagihan for a member
const bills = await getTagihanByMemberId(memberId);

// 2. Calculate unpaid
const unpaid = bills.filter(b => b.status !== 'Lunas');
const totalUnpaid = unpaid.reduce((sum, b) => sum + b.amount, 0);
```

### Dashboard Summary
```typescript
// Get summary statistics
const summary = await getTagihanSummary(kostId);
// Returns: { total, lunas, belumLunas, terlambat, totalAmount, ... }

// Get all kosts owned by user
const myKosts = await getKostByOwnerId(ownerId);

// Get all members
const members = await getMembersByKostId(kostId);
```

---

## Collection Size Estimates

| Collection | Typical Size | Index Needed |
|------------|--------------|--------------|
| users | 100-1000 | email, username |
| profileKost | 10-100 | ownerId, inviteCode |
| memberInfo | 100-5000 | kostId, userId, room |
| tagihan | 500-50000 | memberId, kostId, status |
| ads | 5-50 | isActive, displayOrder |
| superAdmin | 1-10 | userId, email |

---

## Indexing Recommendations

### Composite Indexes Needed
```
Collection: memberInfo
- kostId (ASC) + status (ASC) + joinedAt (DESC)
- userId (ASC) + status (ASC)

Collection: tagihan
- kostId (ASC) + status (ASC) + createdAt (DESC)
- memberId (ASC) + createdAt (DESC)
- status (ASC) + createdAt (DESC)

Collection: ads
- isActive (ASC) + displayOrder (ASC) + createdAt (DESC)
```

### Single Field Indexes
```
users: email, username, role, ownerId
profileKost: ownerId, inviteCode
memberInfo: kostId, userId, room, status
tagihan: memberId, kostId, status
ads: isActive
superAdmin: userId, email
```

---

## Security Rules Outline

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Kost: Owner can manage, members can read
    match /profileKost/{kostId} {
      allow read: if request.auth != null;
      allow write: if resource.data.ownerId == request.auth.uid;
    }
    
    // Members: Owner can manage, member can read own
    match /memberInfo/{memberId} {
      allow read: if request.auth.uid == resource.data.userId 
                  || isOwnerOfKost(resource.data.kostId);
      allow write: if isOwnerOfKost(resource.data.kostId);
    }
    
    // Tagihan: Owner can manage, member can read own
    match /tagihan/{tagihanId} {
      allow read: if request.auth.uid == resource.data.memberId
                  || isOwnerOfKost(resource.data.kostId);
      allow write: if isOwnerOfKost(resource.data.kostId);
    }
    
    // Ads: Everyone can read, only admin can write
    match /ads/{adId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }
    
    // Super Admin: Only super admins
    match /superAdmin/{adminId} {
      allow read: if isSuperAdmin();
      allow write: if isSuperAdmin();
    }
  }
}
```

---

Generated: December 25, 2025
