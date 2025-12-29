import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import { createFeedback, Feedback } from "../../../../../services/feedbackService";

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

export default function FeedbackPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"complaint" | "suggestion">("complaint");
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        loadData();
    }, [user?.kostId]);

    const loadData = async () => {
        setLoading(true);
        try {
            let data: Feedback[] = [];
            
            // Fetch all feedback in the kost so members can see all complaints and responses
            if (user?.kostId) {
                console.log("Fetching all feedback by kostId:", user.kostId);
                const { getFeedbackByKostId } = await import("../../../../../services/feedbackService");
                data = await getFeedbackByKostId(user.kostId);
                console.log("Found all feedback in kost:", data.length);
            }
            
            setFeedbacks(data);
        } catch (error) {
            console.error("Error loading feedback:", error);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description) {
            Alert.alert("Error", "Judul dan deskripsi harus diisi");
            return;
        }
        setSubmitting(true);
        try {
            await createFeedback({
                kostId: user?.kostId || "",
                memberId: user?.memberId || "",
                memberName: user?.nama || "Member",
                category: activeTab === 'complaint' ? 'complaint' : 'suggestion',
                subject: title,
                message: description,
                priority: 'medium'
            });
            Alert.alert("Sukses", "Laporan berhasil dikirim!");
            setModalVisible(false);
            setTitle(""); setDescription("");
            setLoading(true);
            loadData();
        } catch (error) {
            Alert.alert("Error", "Gagal mengirim laporan");
        } finally {
            setSubmitting(false);
        }
    };

    const renderContent = () => {
        if (loading) return <ActivityIndicator color={COLORS.lime} style={{ marginTop: 40 }} />;

        const filtered = feedbacks.filter(f => {
            const isComplaint = activeTab === 'complaint';
            return isComplaint ? f.category === 'complaint' : f.category === 'suggestion' || f.category === 'praise';
        });

        if (filtered.length === 0) return <Text style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Belum ada data untuk {activeTab}.</Text>;

        return filtered.map((item) => (
            <View key={item.id} style={styles.card}>
                <View style={styles.cardTextContainer}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardName}>{item.subject}</Text>
                        <Text style={styles.cardDate}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</Text>
                    </View>
                    <Text style={styles.cardDesc} numberOfLines={3}>{item.message}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={[styles.statusBadge, {
                            backgroundColor: item.status === 'resolved' ? COLORS.statusDone :
                                item.status === 'in-progress' ? COLORS.statusProcess : COLORS.statusSent
                        }]}>
                            <Text style={[styles.statusText, { color: item.status === 'in-progress' ? '#000' : '#FFF' }]}>
                                {item.status === 'resolved' ? 'Selesai' : item.status === 'in-progress' ? 'Diproses' : 'Terkirim'}
                            </Text>
                        </View>
                        {item.response && (
                            <TouchableOpacity 
                                style={styles.commentButton} 
                                onPress={() => {
                                    setSelectedFeedback(item);
                                    setResponseModalVisible(true);
                                }}
                            >
                                <Text style={styles.commentButtonText}>Lihat Balasan</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        ));
    };

    // ... (Sisa Return JSX dan Styles SAMA seperti sebelumnya) ...
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
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("complaint")}>
                    <Text style={[styles.tabText, activeTab === "complaint" ? styles.tabTextActive : styles.tabTextInactive]}>Aduan</Text>
                    {activeTab === "complaint" && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("suggestion")}>
                    <Text style={[styles.tabText, activeTab === "suggestion" ? styles.tabTextActive : styles.tabTextInactive]}>Saran</Text>
                    {activeTab === "suggestion" && <View style={styles.activeLine} />}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {renderContent()}
                <View style={{ height: 160 }} />
            </ScrollView>

            <View style={styles.createButtonContainer}>
                <TouchableOpacity style={styles.createButton} onPress={() => { setTitle(""); setDescription(""); setModalVisible(true); }}>
                    <Text style={styles.createButtonText}>{activeTab === "complaint" ? "Buat Aduan Baru" : "Beri Saran Baru"}</Text>
                    <View style={styles.arrowCircle}><ArrowRight size={14} color={COLORS.lime} /></View>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalBrand}>{activeTab === "complaint" ? "Form Aduan" : "Form Saran"}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><View style={styles.closeButton}><X size={20} color="#FFF" /></View></TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}><Text style={styles.label}>Judul</Text><TextInput style={styles.input} placeholder="Contoh: Air Mati / Wifi Lemot" placeholderTextColor="rgba(255,255,255,0.5)" value={title} onChangeText={setTitle} /></View>
                            <View style={styles.inputGroup}><Text style={styles.label}>Detail</Text><TextInput style={[styles.input, styles.textArea]} placeholder="Jelaskan detailnya di sini..." placeholderTextColor="rgba(255,255,255,0.5)" value={description} onChangeText={setDescription} multiline textAlignVertical="top" /></View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                                {submitting ? <ActivityIndicator color="#000" /> : (
                                    <>
                                        <Text style={styles.submitButtonText}>Kirim</Text><ArrowRight size={18} color="#000" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Response Modal */}
            <Modal animationType="fade" transparent={true} visible={responseModalVisible} onRequestClose={() => setResponseModalVisible(false)}>
                <View style={styles.responseModalOverlay}>
                    <View style={[styles.responseModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalBrand}>Tanggapan Admin</Text>
                            <TouchableOpacity onPress={() => setResponseModalVisible(false)}>
                                <View style={styles.closeButton}><X size={20} color="#FFF" /></View>
                            </TouchableOpacity>
                        </View>
                        
                        {selectedFeedback && (
                            <ScrollView contentContainerStyle={styles.responseScroll} showsVerticalScrollIndicator={false}>
                                <View style={styles.responseSection}>
                                    <Text style={styles.responseSectionTitle}>Judul Aduan:</Text>
                                    <Text style={styles.responseSectionText}>{selectedFeedback.subject}</Text>
                                </View>
                                
                                <View style={styles.responseSection}>
                                    <Text style={styles.responseSectionTitle}>Pesan Anda:</Text>
                                    <Text style={styles.responseSectionText}>{selectedFeedback.message}</Text>
                                </View>
                                
                                <View style={[styles.responseSection, { backgroundColor: 'rgba(198, 244, 50, 0.1)', padding: 16, borderRadius: 12 }]}>
                                    <Text style={[styles.responseSectionTitle, { color: COLORS.lime }]}>Balasan Admin:</Text>
                                    <Text style={[styles.responseSectionText, { fontSize: 16, lineHeight: 24 }]}>
                                        {selectedFeedback.response || "Belum ada balasan"}
                                    </Text>
                                </View>
                                
                                <View style={styles.responseSection}>
                                    <Text style={styles.responseSectionTitle}>Status:</Text>
                                    <View style={[styles.statusBadge, {
                                        backgroundColor: selectedFeedback.status === 'resolved' ? COLORS.statusDone :
                                            selectedFeedback.status === 'in-progress' ? COLORS.statusProcess : COLORS.statusSent,
                                        alignSelf: 'flex-start'
                                    }]}>
                                        <Text style={[styles.statusText, { color: selectedFeedback.status === 'in-progress' ? '#000' : '#FFF' }]}>
                                            {selectedFeedback.status === 'resolved' ? 'Selesai' : selectedFeedback.status === 'in-progress' ? 'Diproses' : 'Terkirim'}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
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

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? 40 : 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        position: "relative",
    },

    headerTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    logoSmall: {
        width: 24,
        height: 24,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textWhite,
    },

    headerSubtitle: {
        fontSize: 8,
        color: "#CCC",
        fontWeight: "bold",
        lineHeight: 8,
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

    card: {
        backgroundColor: COLORS.cardPurple,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },

    cardRow: {
        flexDirection: "row",
        gap: 12,
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#CCC",
    },

    cardTextContainer: {
        flex: 1,
    },

    cardHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
    },

    cardName: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.textWhite,
        flex: 1,
    },

    cardDate: {
        fontSize: 10,
        color: "#E0E0E0",
        marginTop: 2,
    },

    cardDesc: {
        fontSize: 12,
        color: "#E0E0E0",
        marginBottom: 12,
        lineHeight: 16,
    },

    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 10,
        fontWeight: "bold",
    },

    commentButton: {
        backgroundColor: COLORS.lime,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    commentButtonText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#000",
    },

    createButtonContainer: {
        position: "absolute",
        bottom: 110,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 20,
    },

    createButton: {
        flexDirection: "row",
        backgroundColor: "#262A34",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    createButtonText: {
        color: COLORS.lime,
        fontWeight: "bold",
        fontSize: 14,
        marginRight: 8,
    },

    arrowCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.lime,
        alignItems: "center",
        justifyContent: "center",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },

    modalContent: {
        backgroundColor: COLORS.cardPurple,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        height: "85%",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    logoBoxWhite: {
        backgroundColor: "#FFF",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },

    logoModal: {
        width: 24,
        height: 24,
    },

    modalBrand: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFF",
        lineHeight: 24,
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },

    formScroll: {
        gap: 16,
        paddingBottom: 40,
    },

    inputGroup: {
        gap: 8,
    },

    label: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        marginLeft: 4,
    },

    input: {
        backgroundColor: COLORS.inputPurple,
        borderRadius: 8,
        padding: 12,
        color: "#FFF",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        fontWeight: "bold",
    },

    textArea: {
        height: 120,
    },

    uploadContainer: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        backgroundColor: COLORS.inputPurple,
        height: 150,
        justifyContent: "center",
        marginTop: 8,
    },

    uploadBox: {
        alignItems: "center",
        gap: 8,
    },

    uploadText: {
        color: "#FFF",
        fontSize: 12,
    },

    uploadButton: {
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: "center",
        gap: 4,
    },

    uploadButtonText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },

    submitButton: {
        backgroundColor: COLORS.lime,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },

    submitButtonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },

    // Response Modal Styles
    responseModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    responseModalContent: {
        backgroundColor: COLORS.cardPurple,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },

    responseScroll: {
        gap: 16,
        paddingBottom: 20,
    },

    responseSection: {
        gap: 8,
    },

    responseSectionTitle: {
        fontSize: 12,
        color: COLORS.textGray,
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    responseSectionText: {
        fontSize: 14,
        color: COLORS.textWhite,
        lineHeight: 20,
    },
});
