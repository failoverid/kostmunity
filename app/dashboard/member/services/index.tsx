import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, Image } from "react-native";
import { ArrowRight, HeartHandshake, FileSearch, MessageSquarePlus } from "lucide-react-native";
import { useRouter } from "expo-router";
import FloatingNavbar from "@/components/FloatingNavbar";

const COLORS = {
    background: "#181A20",
    navbar: "#262A34",
    purple: "#6C5CE7",
    lime: "#C6F432",
    cyan: "#5CE1E6",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
};

const SERVICES = [
    { id: 1, title: "Jasa Mitra\nPanggilan", icon: <HeartHandshake size={40} color={COLORS.lime} />, route: "/dashboard/member/services/mitra" },
    { id: 2, title: "Lost and\nFound", icon: <FileSearch size={40} color={COLORS.lime} />, route: "/dashboard/member/services/lost-found" },
    { id: 3, title: "Aduan dan\nFeedback", icon: <MessageSquarePlus size={40} color={COLORS.lime} />, route: "/dashboard/member/services/feedback" },
];

export default function ServicesPage() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                    <Text style={styles.headerTitle}>Layanan . <Text style={{ fontWeight: 'normal' }}>Kostmunity</Text></Text>
                </View>
                <Text style={styles.instructionText}>Pilih Salah Satu Jenis Layanan</Text>
                <View style={styles.cardsContainer}>
                    {SERVICES.map((service) => (
                        <TouchableOpacity key={service.id} style={styles.serviceCard} activeOpacity={0.8} onPress={() => router.push(service.route as any)}>
                            <View style={styles.iconContainer}>{service.icon}</View>
                            <View style={styles.textContainer}><Text style={styles.serviceTitle}>{service.title}</Text></View>
                            <View style={styles.arrowContainer}><ArrowRight size={32} color={COLORS.cyan} /></View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40, gap: 8 },
    logoSmall: { width: 24, height: 24 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textWhite },
    instructionText: { textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 24 },
    cardsContainer: { gap: 20 },
    serviceCard: { backgroundColor: COLORS.purple, borderRadius: 20, height: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    iconContainer: { width: 50, alignItems: 'flex-start' },
    textContainer: { flex: 1, paddingHorizontal: 10 },
    serviceTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textWhite, lineHeight: 24 },
    arrowContainer: { width: 40, alignItems: 'flex-end' },
});