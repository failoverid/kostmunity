import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { 
    ActivityIndicator, 
    Alert,
    Image, 
    Modal,
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StatusBar, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import { formatCurrency } from "../../../../lib/formatting";
import { getTagihanByMemberId, getTagihanByRoom, updateTagihan } from "../../../../services/tagihanService";
import { Tagihan } from "../../../../models/Tagihan";
import { X } from "lucide-react-native";

const COLORS = {
    background: "#181A20",
    cardDark: "#1F222A",
    purple: "#6C5CE7",
    lime: "#C6F432",
    cyan: "#5CE1E6",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
};

export default function BillingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"bills" | "paid">("bills");
    const [tagihan, setTagihan] = useState<Tagihan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState<Tagihan | null>(null);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paying, setPaying] = useState(false);

    const memberId = user?.memberId || "";
    const kamar = user?.kamar || "";
    const kostId = user?.kostId || "";

    // Fetch tagihan
    const fetchTagihan = async () => {
        setLoading(true);
        try {
            let result: Tagihan[] = [];
            
            // Try by memberId first
            if (memberId) {
                result = await getTagihanByMemberId(memberId);
            }
            
            // Fallback to room
            if (result.length === 0 && kamar) {
                result = await getTagihanByRoom(kamar, kostId);
            }
            
            setTagihan(result);
        } catch (error) {
            console.error("Error fetching tagihan:", error);
            setTagihan([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (memberId || kamar) {
            fetchTagihan();
        }
    }, [memberId, kamar, kostId]);

    const handlePaymentClick = (bill: Tagihan) => {
        setSelectedBill(bill);
        setPaymentModalVisible(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedBill) return;

        setPaying(true);
        try {
            await updateTagihan(selectedBill.id, {
                status: "Lunas",
            });

            if (Platform.OS === 'web') {
                alert("Pembayaran berhasil!");
            } else {
                Alert.alert("Sukses", "Pembayaran berhasil!");
            }

            setPaymentModalVisible(false);
            setSelectedBill(null);
            await fetchTagihan(); // Refresh data
        } catch (error) {
            console.error("Error processing payment:", error);
            if (Platform.OS === 'web') {
                alert("Gagal memproses pembayaran. Silakan coba lagi.");
            } else {
                Alert.alert("Gagal", "Gagal memproses pembayaran. Silakan coba lagi.");
            }
        } finally {
            setPaying(false);
        }
    };

    const filteredBills = tagihan.filter((item: any) => {
        const isPaid = item.status === 'Lunas' || item.status === 'Paid';
        return activeTab === "bills" ? !isPaid : isPaid;
    });

    const renderBillCard = (item: Tagihan) => (
        <View key={item.id} style={styles.billCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Tagihan Sewa Kost</Text>
                <Text style={styles.cardSubtitle}>Jatuh Tempo : {item.dueDate}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
                <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
                <View style={styles.actionRow}>
                    {item.status === "Terlambat" && (
                        <View style={[styles.statusBadge, { backgroundColor: '#ff4444' }]}>
                            <Text style={styles.statusText}>Terlambat</Text>
                        </View>
                    )}
                    <TouchableOpacity 
                        style={styles.payButton} 
                        onPress={() => handlePaymentClick(item)}
                    >
                        <Text style={styles.payButtonText}>Bayar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderHistoryCard = (item: Tagihan) => (
        <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: '#888' }]}>Tagihan Sewa Kost</Text>
                <Text style={styles.cardSubtitle}>Jatuh Tempo : {item.dueDate}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: '#333' }]} />
            <View style={styles.cardFooter}>
                <Text style={[styles.amountText, { color: '#666' }]}>{formatCurrency(item.amount)}</Text>
                <View style={styles.historyBadge}><Text style={styles.historyBadgeText}>Lunas</Text></View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.lime} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                <Text style={styles.headerTitle}>Tagihan . <Text style={{ fontWeight: 'normal' }}>Kostmunity</Text></Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("bills")}>
                    <Text style={[styles.tabText, activeTab === "bills" ? styles.tabTextActive : styles.tabTextInactive]}>Tagihan</Text>
                    {activeTab === "bills" && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("paid")}>
                    <Text style={[styles.tabText, activeTab === "paid" ? styles.tabTextActive : styles.tabTextInactive]}>Lunas</Text>
                    {activeTab === "paid" && <View style={styles.activeLine} />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredBills.length === 0 ? (
                    <Text style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Tidak ada data tagihan.</Text>
                ) : (
                    filteredBills.map(activeTab === "bills" ? renderBillCard : renderHistoryCard)
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Payment Confirmation Modal */}
            <Modal
                visible={paymentModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => !paying && setPaymentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Konfirmasi Pembayaran</Text>
                            <TouchableOpacity 
                                onPress={() => !paying && setPaymentModalVisible(false)}
                                disabled={paying}
                            >
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {selectedBill && (
                            <View style={styles.modalBody}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Kamar</Text>
                                    <Text style={styles.detailValue}>{selectedBill.room}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Jatuh Tempo</Text>
                                    <Text style={styles.detailValue}>{selectedBill.dueDate}</Text>
                                </View>
                                <View style={[styles.detailRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#333' }]}>
                                    <Text style={styles.detailLabel}>Total Tagihan</Text>
                                    <Text style={[styles.detailValue, { fontSize: 20, fontWeight: 'bold', color: COLORS.lime }]}>
                                        {formatCurrency(selectedBill.amount)}
                                    </Text>
                                </View>

                                <Text style={styles.warningText}>
                                    Pastikan Anda telah melakukan transfer ke rekening pengelola kost sebelum konfirmasi pembayaran ini.
                                </Text>
                            </View>
                        )}

                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={() => setPaymentModalVisible(false)}
                                disabled={paying}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.confirmButton, paying && { opacity: 0.5 }]} 
                                onPress={handleConfirmPayment}
                                disabled={paying}
                            >
                                {paying ? (
                                    <ActivityIndicator color="#000" size="small" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Konfirmasi Bayar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? 40 : 20,
        paddingBottom: 20,
        gap: 8,
    },

    logoSmall: {
        width: 24,
        height: 24,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textWhite,
    },

    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#262A34",
    },

    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignItems: "center",
    },

    tabText: {
        fontSize: 16,
        fontWeight: "500",
    },

    tabTextActive: {
        color: COLORS.textWhite,
        fontWeight: "bold",
    },

    tabTextInactive: {
        color: "#666",
    },

    activeLine: {
        height: 3,
        backgroundColor: COLORS.lime,
        width: "80%",
        marginTop: 8,
        borderRadius: 2,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },

    billCard: {
        backgroundColor: COLORS.purple,
        borderRadius: 20,
        padding: 20,
    },

    historyCard: {
        backgroundColor: COLORS.cardDark,
        borderRadius: 20,
        padding: 20,
    },

    cardHeader: {
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textWhite,
        marginBottom: 4,
    },

    cardSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 12,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    amountText: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textWhite,
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    statusBadge: {
        backgroundColor: "rgba(0,0,0,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        color: COLORS.textWhite,
        fontSize: 10,
        fontWeight: "600",
    },

    historyBadge: {
        backgroundColor: "#333",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    historyBadgeText: {
        color: "#AAA",
        fontSize: 10,
        fontWeight: "600",
    },

    payButton: {
        backgroundColor: COLORS.cyan,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },

    payButtonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 12,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContent: {
        backgroundColor: COLORS.cardDark,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        padding: 24,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },

    modalBody: {
        marginBottom: 24,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    detailLabel: {
        fontSize: 14,
        color: COLORS.textGray,
    },

    detailValue: {
        fontSize: 14,
        color: COLORS.textWhite,
        fontWeight: '600',
    },

    warningText: {
        fontSize: 12,
        color: '#ff9800',
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: 8,
        lineHeight: 18,
    },

    modalFooter: {
        flexDirection: 'row',
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },

    cancelButtonText: {
        color: COLORS.textWhite,
        fontWeight: '600',
        fontSize: 14,
    },

    confirmButton: {
        flex: 1,
        backgroundColor: COLORS.lime,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },

    confirmButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
