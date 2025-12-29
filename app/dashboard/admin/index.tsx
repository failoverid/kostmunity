import { useRouter } from "expo-router";
import {
    ArrowRight,
    Check,
    Home,
    LogOut,
    MapPin,
    Pencil,
    User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// --- FIREBASE IMPORTS ---
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../lib/firebase-clients";

// --- IMPORT SERVICES & HOOKS ---
// Pastikan file-file hooks ini sudah Anda buat sebelumnya
import { useAuth } from "../../../contexts/AuthContext";
import { useMembers } from "../../../hooks/useMembers";
import { useTagihanList } from "../../../hooks/useTagihan";
import { formatCurrency } from "../../../lib/formatting";
import { MemberInfo } from "../../../models/MemberInfo";

// Import service update profile
import { ProfileKostType, updateKostProfile } from "../../../services/kostService";

// --- INTERFACES ---
interface MemberData { id: string; nama: string; kamar: string; status: string; }
interface BillData { id: string; nama: string; total: number; status: string; dueDate: string; }
interface ServiceData { id: string; title: string; link: string; }

// --- KOMPONEN HELPER ---

const PlaceholderRow = () => (
    <View style={styles.placeholderContainer}>
      <View style={[styles.placeholderBox, { flex: 1 }]} />
      <View style={[styles.placeholderBox, { flex: 1 }]} />
      <View style={[styles.placeholderBox, { flex: 1 }]} />
    </View>
);

const SeeMoreLink = ({ href, router }: { href: string; router: any }) => (
    <TouchableOpacity onPress={() => router.push(href)} style={styles.seeMoreContainer}>
      <Text style={styles.seeMoreText}>Lihat Selengkapnya</Text>
      <ArrowRight size={16} color="#2563eb" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
);

const StatBox = ({ title, value, subtext, loading }: { title: string; value: number | string, subtext?: string, loading: boolean }) => (
    <View style={styles.statBox}>
      <Text numberOfLines={1} style={styles.statTitle}>{title}</Text>
      {loading ? (
          <ActivityIndicator color="#fff" style={{marginTop: 8, alignSelf:'flex-start'}} />
      ) : (
          <View>
            <Text style={styles.statValue}>{value}</Text>
            {subtext && <Text style={styles.statSubtext}>{subtext}</Text>}
          </View>
      )}
    </View>
);

const ManagementCard = ({ title, href, children, router }: { title: string; href: string; children: React.ReactNode; router: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
        <SeeMoreLink href={href} router={router} />
      </View>
    </View>
);

const BottomStatBox = ({ title, count, href, router, color = "#ef4444" }: { title: string; count: number; href: string; router: any; color?: string }) => (
    <View style={styles.bottomStatBox}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
      <Text style={styles.bottomStatTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push(href)} style={styles.bottomLink}>
        <Text style={styles.bottomLinkText}>Lihat Selengkapnya</Text>
        <ArrowRight size={12} color="#d1d5db" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    </View>
);

const MiniMemberRow = ({ item }: { item: MemberData }) => (
    <View style={styles.miniRow}>
      <Text style={[styles.miniText, { flex: 1.5, fontWeight: '600' }]} numberOfLines={1}>{item.nama}</Text>
      <View style={[styles.miniPill, { flex: 1 }]}>
        <Text style={styles.miniPillText}>{item.kamar}</Text>
      </View>
      <View style={{ flex: 1, alignItems:'flex-end' }}>
        <Text style={[styles.miniText, { color: '#16a34a', fontSize: 10 }]}>Aktif</Text>
      </View>
    </View>
);

const MiniBillRow = ({ item }: { item: any }) => {
  const isLunas = item.status === 'Lunas' || item.status === 'Paid';
  return (
      <View style={styles.miniRow}>
        <Text style={[styles.miniText, { flex: 1.5 }]} numberOfLines={1}>{item.memberName}</Text>
        <View style={[styles.miniPill, { flex: 1 }]}>
          <Text style={styles.miniPillText}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={{ flex: 1.2, alignItems:'flex-end' }}>
          <View style={[styles.statusBadge, isLunas ? {backgroundColor: '#dcfce7'} : {backgroundColor: '#fee2e2'}]}>
            <Text style={[styles.statusText, isLunas ? {color: '#166534'} : {color: '#991b1b'}]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
  );
};

const MiniServiceRow = ({ item }: { item: ServiceData }) => (
    <View style={styles.miniRow}>
      <View style={[styles.miniPill, { flex: 1 }]}>
        <Text style={styles.miniPillText} numberOfLines={1}>{item.title}</Text>
      </View>
      <View style={[styles.miniPill, { flex: 1 }]}>
        <Text style={styles.miniPillText} numberOfLines={1}>{item.link}</Text>
      </View>
    </View>
);

// --- KOMPONEN UTAMA ---
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'owner') {
      router.replace('/dashboard/member');
    }
  }, [user]);

  const kostId = user?.kostId;

  // --- USE HOOKS BARU ---
  const { members: allMembers, loading: loadingMembers } = useMembers(kostId || "");
  const { tagihan: tagihanList, loading: loadingTagihan } = useTagihanList('kost', kostId || "");

  // --- STATE KOST PROFILE ---
  const [kostProfile, setKostProfile] = useState<ProfileKostType | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- STATE SERVICES ---
  const [services, setServices] = useState<ServiceData[]>([]);

  // --- STATE COUNTS (Menggabungkan semua counter) ---
  const [counts, setCounts] = useState({
    activeComplaint: 0,
    activeLostFound: 0,
    activeBills: 0
  });

  // 1. FETCH KOST PROFILE
  useEffect(() => {
    if (!kostId) {
      setLoadingProfile(false);
      return;
    }
    
    console.log('Fetching kost profile for:', kostId);
    const unsubKost = onSnapshot(
      doc(db, "profileKost", kostId), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileKostType;
          console.log('Kost profile loaded:', data);
          setKostProfile({ ...data, id: docSnap.id } as any);
          setTempName(data.name);
          setTempAddress(data.address || 'Belum diatur');
        } else {
          console.log('Kost profile not found for:', kostId);
          // Set default data if not exists
          setKostProfile({
            id: kostId,
            name: 'Kost Baru',
            address: 'Belum diatur',
            rooms: '0',
            idKost: kostId,
            ownerId: user?.uid || '',
            inviteCode: '',
            createdAt: null as any
          });
          setTempName('Kost Baru');
          setTempAddress('Belum diatur');
        }
        setLoadingProfile(false);
      },
      (error) => {
        console.error('Error fetching kost profile:', error);
        setLoadingProfile(false);
      }
    );
    return () => unsubKost();
  }, [kostId]);

  // 2. FETCH SERVICES & COUNTS (Feedback + LostFound)
  useEffect(() => {
    // A. Services (Iklan/Layanan)
    const qServices = query(collection(db, "ads")); // Sesuaikan query jika perlu filter kostId
    const unsubServices = onSnapshot(qServices, (snap) => {
       const data = snap.docs.slice(0, 3).map(d => ({ id: d.id, ...d.data() } as ServiceData));
       setServices(data);
    });

    // B. Feedback Count (Yang statusnya belum selesai)
    const qFeedback = query(collection(db, "feedback"));
    const unsubFeedback = onSnapshot(qFeedback, (snap) => {
       // Filter: Ambil yang statusnya BUKAN "Selesai"
       const activeCount = snap.docs.filter(doc => doc.data().status !== 'Selesai').length;
       setCounts(prev => ({ ...prev, activeComplaint: activeCount }));
    });

    // C. Lost & Found Count (Yang statusnya found == false)
    const qLost = query(collection(db, "lostItems"));
    const unsubLost = onSnapshot(qLost, (snap) => {
       // Filter: Ambil yang found === false
       const activeCount = snap.docs.filter(doc => doc.data().found === false).length;
       setCounts(prev => ({ ...prev, activeLostFound: activeCount }));
    });

    return () => {
        unsubServices();
        unsubFeedback();
        unsubLost();
    };
  }, []);

  // 3. Update Bill Count saat tagihanList berubah
  useEffect(() => {
      if (Array.isArray(tagihanList) && tagihanList.length > 0) {
          const unpaid = tagihanList.filter((t: any) => t.status === "Belum Lunas").length;
          setCounts(prev => ({ ...prev, activeBills: unpaid }));
      } else {
          setCounts(prev => ({ ...prev, activeBills: 0 }));
      }
  }, [tagihanList]);

  // --- DERIVED DATA ---
  const members: MemberData[] = allMembers.slice(0, 3).map((m: MemberInfo) => ({
    id: m.id,
    nama: m.name,
    kamar: m.room,
    status: m.status || 'active'
  }));
  const bills = Array.isArray(tagihanList) ? tagihanList.slice(0, 3) : [];

  const loading = loadingMembers || loadingTagihan || loadingProfile;

  // --- HANDLER UPDATE PROFILE KOST ---
  const handleSaveProfile = async () => {
    if (!tempName.trim()) {
      Alert.alert("Error", "Nama kost tidak boleh kosong");
      return;
    }
    if (!tempAddress.trim()) {
      Alert.alert("Error", "Alamat tidak boleh kosong");
      return;
    }

    try {
      await updateKostProfile(kostId, { 
        name: tempName,
        address: tempAddress 
      });
      setIsEditingProfile(false);
      Alert.alert("Berhasil", "Profil kost berhasil diupdate");
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan profil kost");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Memuat data...</Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

        {/* 1. HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image
                source={require("../../../assets/kostmunity-logo.png")}
                style={styles.headerLogo}
                resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Kostmunity</Text>
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitleTop}>Admin</Text>
              <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 16 }}>
            <TouchableOpacity 
              onPress={() => router.push('/dashboard/admin/profile')}
              style={styles.userButton}
            >
              <User size={20} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* 2. CARD IDENTITAS KOST */}
          <View style={styles.card}>
            <View style={styles.nameCardContent}>
              <View style={{flex: 1}}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom: 8}}>
                  <Text style={{fontSize: 14, fontWeight: '600', color: '#6b7280'}}>Profil Kost</Text>
                  <TouchableOpacity
                      onPress={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                      style={styles.iconButton}
                  >
                    {isEditingProfile ? <Check size={20} color="#16a34a" /> : <Pencil size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>

                {/* Nama Kost */}
                <View style={{marginBottom: 8}}>
                  <Text style={{fontSize: 11, color: '#9ca3af', marginBottom: 4}}>Nama Kost</Text>
                  {isEditingProfile ? (
                      <TextInput
                          style={[styles.nameInput, {fontSize: 16}]}
                          value={tempName}
                          onChangeText={setTempName}
                          placeholder="Nama kost"
                      />
                  ) : (
                      <Text style={[styles.nameText, {fontSize: 16}]}>{kostProfile?.name || "Memuat..."}</Text>
                  )}
                </View>

                {/* Alamat */}
                <View>
                  <Text style={{fontSize: 11, color: '#9ca3af', marginBottom: 4}}>Alamat</Text>
                  {isEditingProfile ? (
                      <TextInput
                          style={[styles.nameInput, {fontSize: 12}]}
                          value={tempAddress}
                          onChangeText={setTempAddress}
                          placeholder="Alamat lengkap kost"
                          multiline
                      />
                  ) : (
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                        <MapPin size={12} color="#1f2937" style={{marginRight: 4}}/>
                        <Text style={{fontSize: 12, color: '#1f2937', flex: 1}} numberOfLines={2}>
                          {kostProfile?.address || "Alamat belum diatur"}
                        </Text>
                      </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* 3. GRID STATISTIK ATAS */}
          <View style={styles.gridContainer}>
            <View style={{ flex: 1 }}>
              <StatBox
                  title="Kamar Terisi"
                  value={allMembers.length}
                  subtext={kostProfile?.rooms ? `dari ${kostProfile.rooms} kamar` : ""}
                  loading={loadingMembers}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatBox
                title="Tagihan Aktif"
                value={counts.activeBills}
                loading={loading}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatBox
                title="Aduan Baru"
                value={counts.activeComplaint} // Menggunakan count realtime
                loading={loading}
              />
            </View>
          </View>

          {/* 4. MANAJEMEN MEMBER */}
          <ManagementCard title="Manajemen Member" href="/dashboard/admin/members" router={router}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 1.5 }]}>Nama</Text>
              <Text style={[styles.tableHeadText, { flex: 1 }]}>Kamar</Text>
              <Text style={[styles.tableHeadText, { flex: 1, textAlign:'right' }]}>Status</Text>
            </View>
            <View style={{ gap: 8 }}>
              {loading ? <PlaceholderRow /> : members.map(m => <MiniMemberRow key={m.id} item={m}/>)}
              {!loading && members.length === 0 && <Text style={styles.emptyText}>Belum ada member</Text>}
            </View>
          </ManagementCard>

          {/* 5. MANAJEMEN TAGIHAN */}
          <ManagementCard title="Manajemen Tagihan" href="/dashboard/admin/billing" router={router}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 1.5 }]}>Nama</Text>
              <Text style={[styles.tableHeadText, { flex: 1 }]}>Total</Text>
              <Text style={[styles.tableHeadText, { flex: 1.2, textAlign:'right' }]}>Status</Text>
            </View>
            <View style={{ gap: 8 }}>
              {loading ? <PlaceholderRow /> : bills.map(b => <MiniBillRow key={b.id} item={b}/>)}
              {!loading && bills.length === 0 && <Text style={styles.emptyText}>Belum ada tagihan</Text>}
            </View>
          </ManagementCard>

          {/* 6. MANAJEMEN LAYANAN */}
          <ManagementCard title="Manajemen Layanan" href="/dashboard/admin/services" router={router}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 1 }]}>Nama Layanan</Text>
              <Text style={[styles.tableHeadText, { flex: 1 }]}>Kontak</Text>
            </View>
            <View style={{ gap: 8 }}>
              {loading ? <PlaceholderRow /> : services.map(s => <MiniServiceRow key={s.id} item={s}/>)}
              {!loading && services.length === 0 && <Text style={styles.emptyText}>Belum ada layanan</Text>}
            </View>
          </ManagementCard>

          {/* 7. GRID STATISTIK BAWAH */}
          <View style={styles.gridContainer}>
            <View style={{ flex: 1 }}>
              <BottomStatBox
                  title="Lost and Found (Aktif)"
                  count={counts.activeLostFound} // Menggunakan count realtime
                  href="/dashboard/admin/lost-found"
                  router={router}
                  color="#f59e0b"
              />
            </View>
            <View style={{ flex: 1 }}>
              <BottomStatBox
                  title="Aduan / Feedback (Baru)"
                  count={counts.activeComplaint} // Menggunakan count realtime
                  href="/dashboard/admin/feedback"
                  router={router}
                  color="#ef4444"
              />
            </View>
          </View>

          {/* 8. SIGN OUT */}
          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={async () => {
              try {
                await signOut();
                router.replace('/landing');
              } catch (error) {
                Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
              }
            }}>
              <LogOut size={16} color="#4b5563" style={{ marginRight: 8 }} />
              <Text style={{ color: '#4b5563', fontSize: 14 }}>Sign Out</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* FAB */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} onPress={() => router.replace("/")}>
            <Home size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.fabText}>Home</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 24 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, zIndex: 50, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  headerSubtitleContainer: { alignItems: "flex-start" },
  headerSubtitleTop: { fontSize: 14, color: "#4b5563", fontWeight: "600", marginTop: 4, lineHeight: 14 },
  headerSubtitleBottom: { fontSize: 14, color: "#1f2937", fontWeight: "bold", lineHeight: 14 },
  userButton: { 
    backgroundColor: "#f3f4f6", 
    padding: 10, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: "#e5e7eb" 
  },

  card: { backgroundColor: "#fff", borderRadius: 8, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, overflow: "hidden" },
  nameCardContent: { padding: 16 },
  nameText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  nameInput: { fontSize: 18, fontWeight: "bold", color: "#000", borderBottomWidth: 1, borderColor: "#2563eb", padding: 0, flex: 1, marginRight: 8 },
  iconButton: { padding: 4 },

  gridContainer: { flexDirection: "row", gap: 12 },

  statBox: { backgroundColor: "#1f2937", padding: 16, borderRadius: 8, elevation: 3 },
  statTitle: { fontSize: 11, color: "#d1d5db" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 4 },
  statSubtext: { fontSize: 10, color: "#9ca3af", marginTop: 2 },

  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardContent: { padding: 16 },
  tableHeader: { flexDirection: "row", marginBottom: 12, gap: 8 },
  tableHeadText: { fontSize: 12, fontWeight: "bold", color: "#6b7280" },
  emptyText: { textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', fontSize: 12 },

  miniRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  miniText: { fontSize: 13, color: '#374151' },
  miniPill: { backgroundColor: "#e5e7eb", borderRadius: 12, paddingVertical: 2, paddingHorizontal: 8, marginHorizontal: 4, alignItems: 'center', alignSelf:'flex-start' },
  miniPillText: { fontSize: 11, color: "#374151", fontWeight: "500" },

  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  placeholderContainer: { flexDirection: "row", gap: 16, alignItems: "center" },
  placeholderBox: { height: 16, backgroundColor: "#e5e7eb", borderRadius: 4 },

  seeMoreContainer: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 16 },
  seeMoreText: { fontSize: 12, color: "#2563eb", fontWeight: '600' },

  bottomStatBox: { backgroundColor: "#1f2937", padding: 16, borderRadius: 8, elevation: 3, position: 'relative', height: 110, justifyContent: 'space-between' },
  bottomStatTitle: { fontSize: 14, fontWeight: "600", color: "#fff", paddingRight: 20, marginTop: 16 },
  badge: { position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", zIndex: 10 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  bottomLink: { flexDirection: "row", alignItems: "center" },
  bottomLinkText: { fontSize: 11, color: "#d1d5db" },

  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center", zIndex: 100 },
  fabButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 56, borderRadius: 28, elevation: 6 },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
