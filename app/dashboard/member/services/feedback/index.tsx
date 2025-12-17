import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, Modal, TextInput } from "react-native";
import { ArrowLeft, ArrowRight, X, Image as ImageIcon, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import FloatingNavbar from "@/components/FloatingNavbar";

const COLORS = {
    background: "#181A20",
    cardPurple: "#6C5CE7",
    cardDarkPurple: "#544AB5",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    inputBg: "#262A34",
    inputPurple: "#5A4FCF",
    navbar: "#262A34",
    statusDone: "#544AB5",
    statusProcess: "#5CE1E6",
    statusSent: "#C6F432",
};

const ADUAN_DATA = [
    { id: 1, name: "Indah Wijayanti", date: "12.00 WIB | 01/01/25", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", status: "Selesai", statusColor: COLORS.statusDone, statusTextColor: "#FFF" },
    { id: 2, name: "Aisyah Clara Riyanti", date: "12.00 WIB | 01/01/25", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", status: "Dalam Penanganan", statusColor: COLORS.statusProcess, statusTextColor: "#000" },
];
const FEEDBACK_DATA = [
    { id: 101, name: "Susan Simmons", date: "12.00 WIB | 01/01/25", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...", image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
];

export default function FeedbackPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"Aduan" | "Feedback">("Aduan");
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const renderContent = () => {
        const data = activeTab === "Aduan" ? ADUAN_DATA : FEEDBACK_DATA;
        return data.map((item: any) => (
            <View key={item.id} style={styles.card}>
                <View style={styles.cardRow}>
                    <Image source={{ uri: item.image }} style={styles.avatar} />
                    <View style={styles.cardTextContainer}>
                        <View style={styles.cardHeaderRow}><Text style={styles.cardName}>{item.name}</Text><Text style={styles.cardDate}>{item.date}</Text></View>
                        <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                        {activeTab === "Aduan" ? (
                            <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}><Text style={[styles.statusText, { color: item.statusTextColor }]}>Status - <Text style={{ fontWeight: 'bold' }}>{item.status}</Text></Text></View>
                        ) : (
                            <TouchableOpacity style={styles.commentButton}><Text style={styles.commentButtonText}>Lihat Komentar</Text></TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 20, zIndex: 10 }}><ArrowLeft size={24} color="#FFF" /></TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Image source={require("../../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                    <Text style={styles.headerTitle}>Kostmunity</Text>
                    <View style={{ marginLeft: 4 }}><Text style={styles.headerSubtitle}>ADUAN &</Text><Text style={styles.headerSubtitle}>FEEDBACK</Text></View>
                </View>
            </View>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Aduan")}>
                    <Text style={[styles.tabText, activeTab === "Aduan" ? styles.tabTextActive : styles.tabTextInactive]}>Aduan</Text>
                    {activeTab === "Aduan" && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("Feedback")}>
                    <Text style={[styles.tabText, activeTab === "Feedback" ? styles.tabTextActive : styles.tabTextInactive]}>Feedback</Text>
                    {activeTab === "Feedback" && <View style={styles.activeLine} />}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {renderContent()}
                <View style={{ height: 160 }} />
            </ScrollView>
            <View style={styles.createButtonContainer}>
                <TouchableOpacity style={styles.createButton} onPress={() => { setTitle(""); setDescription(""); setModalVisible(true); }}>
                    <Text style={styles.createButtonText}>{activeTab === "Aduan" ? "Kirim Aduan" : "Kirim Feedback"}</Text>
                    <View style={styles.arrowCircle}><ArrowRight size={14} color={COLORS.lime} /></View>
                </TouchableOpacity>
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={styles.logoBoxWhite}><Image source={require("../../../../../assets/kostmunity-logo.png")} style={styles.logoModal} resizeMode="contain" tintColor={COLORS.cardPurple} /></View>
                                <View><Text style={styles.modalBrand}>{activeTab === "Aduan" ? "Aduan.Kostmunity" : "Feedback.Kostmunity"}</Text></View>
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><View style={styles.closeButton}><X size={20} color="#FFF" /></View></TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}><Text style={styles.label}>{activeTab === "Aduan" ? "Judul Aduan" : "Judul Feedback"}</Text><TextInput style={styles.input} placeholder={activeTab === "Aduan" ? "Contoh: Air Mati" : "Contoh: Pelayanan Ramah"} placeholderTextColor="rgba(255,255,255,0.5)" value={title} onChangeText={setTitle} /></View>
                            <View style={styles.inputGroup}><Text style={styles.label}>Deskripsi</Text><TextInput style={[styles.input, styles.textArea]} placeholder="Jelaskan detailnya di sini..." placeholderTextColor="rgba(255,255,255,0.5)" value={description} onChangeText={setDescription} multiline textAlignVertical="top" /></View>
                            <View style={styles.uploadContainer}>
                                <View style={styles.uploadBox}><ImageIcon size={40} color="rgba(0,0,0,0.3)" /><Text style={styles.uploadText}>Upload Foto Barang</Text><TouchableOpacity style={styles.uploadButton}><Text style={styles.uploadButtonText}>Pilih Foto</Text><Plus size={12} color="#FFF" /></TouchableOpacity></View>
                            </View>
                            <TouchableOpacity style={styles.submitButton} onPress={() => { setModalVisible(false); alert(`${activeTab} Berhasil Dikirim!`); }}>
                                <Text style={styles.submitButtonText}>Kirim Laporan</Text><ArrowRight size={18} color="#000" />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Platform.OS === 'android' ? 40 : 20, paddingHorizontal: 20, marginBottom: 20, position: 'relative' },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoSmall: { width: 24, height: 24 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textWhite },
    headerSubtitle: { fontSize: 8, color: '#CCC', fontWeight: 'bold', lineHeight: 8 },
    tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#262A34' },
    tabButton: { paddingVertical: 12, paddingHorizontal: 30, alignItems: 'center' },
    tabText: { fontSize: 16, fontWeight: '500' },
    tabTextActive: { color: COLORS.textWhite, fontWeight: 'bold' },
    tabTextInactive: { color: '#666' },
    activeLine: { height: 3, backgroundColor: COLORS.lime, width: '80%', marginTop: 8, borderRadius: 2 },
    card: { backgroundColor: COLORS.cardPurple, borderRadius: 16, padding: 16, marginBottom: 16 },
    cardRow: { flexDirection: 'row', gap: 12 },
    avatar: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#CCC' },
    cardTextContainer: { flex: 1 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    cardName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textWhite, flex: 1 },
    cardDate: { fontSize: 8, color: '#E0E0E0', marginTop: 2 },
    cardDesc: { fontSize: 10, color: '#E0E0E0', marginBottom: 12, lineHeight: 14 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 10 },
    commentButton: { backgroundColor: COLORS.lime, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    commentButtonText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    createButtonContainer: { position: 'absolute', bottom: 110, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
    createButton: { flexDirection: 'row', backgroundColor: '#262A34', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    createButtonText: { color: COLORS.lime, fontWeight: 'bold', fontSize: 14, marginRight: 8 },
    arrowCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.cardPurple, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    logoBoxWhite: { backgroundColor: '#FFF', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
    logoModal: { width: 24, height: 24 },
    modalBrand: { fontSize: 22, fontWeight: 'bold', color: '#FFF', lineHeight: 24 },
    closeButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    formScroll: { gap: 16, paddingBottom: 40 },
    inputGroup: { gap: 8 },
    label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 4 },
    input: { backgroundColor: COLORS.inputPurple, borderRadius: 8, padding: 12, color: '#FFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', fontWeight: 'bold' },
    textArea: { height: 120 },
    uploadContainer: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 16, alignItems: 'center', backgroundColor: COLORS.inputPurple, height: 150, justifyContent: 'center', marginTop: 8 },
    uploadBox: { alignItems: 'center', gap: 8 },
    uploadText: { color: '#FFF', fontSize: 12 },
    uploadButton: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center', gap: 4 },
    uploadButtonText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    submitButton: { backgroundColor: COLORS.lime, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 16, gap: 8 },
    submitButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});