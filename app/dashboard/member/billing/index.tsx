import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTagihanList } from "../../../../hooks/useTagihan";
import { formatCurrency } from "../../../../lib/formatting";

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

    const { tagihan, loading, error } = useTagihanList('member', user?.memberId || "");

    const filteredBills = tagihan.filter((item: any) => {
        const isPaid = item.status === 'Lunas' || item.status === 'Paid';
        return activeTab === "bills" ? !isPaid : isPaid;
    });

    const renderBillCard = (item: any) => (
        <View key={item.id} style={styles.billCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.notes || "Tagihan Sewa Kost"}</Text>
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
                    <TouchableOpacity style={styles.payButton} onPress={() => alert("Fitur pembayaran akan segera hadir!")}>
                        <Text style={styles.payButtonText}>Bayar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderHistoryCard = (item: any) => (
        <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: '#888' }]}>{item.notes || "Tagihan Sewa Kost"}</Text>
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
});
