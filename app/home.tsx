import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomePage() {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: "💰",
      title: "Manajemen Billing Otomatis",
      description: "Kelola tagihan kost dengan sistem yang terintegrasi dan notifikasi otomatis"
    },
    {
      icon: "👥",
      title: "Kelola Member Mudah",
      description: "Tambah, edit, dan monitor aktivitas penghuni kost dalam satu dashboard"
    },
    {
      icon: "📊",
      title: "Dashboard Analytics",
      description: "Lihat statistik pendapatan, occupancy rate, dan performa kost secara real-time"
    },
    {
      icon: "🔔",
      title: "Notifikasi Real-time",
      description: "Dapatkan update langsung untuk pembayaran, keluhan, dan aktivitas penting"
    },
    {
      icon: "🔍",
      title: "Lost & Found System",
      description: "Sistem pelaporan barang hilang dan temuan untuk keamanan penghuni"
    },
    {
      icon: "💬",
      title: "Feedback & Complaints",
      description: "Channel komunikasi langsung antara penghuni dan pengelola kost"
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pemilik Kost Mawar",
      text: "Kostmunity sangat membantu saya mengelola 3 kost dengan total 45 kamar. Semuanya jadi lebih terorganisir!",
      avatar: "👨‍💼"
    },
    {
      name: "Siti Rahayu",
      role: "Admin Kost Melati",
      text: "Fitur billing otomatis menghemat waktu saya hingga 70%. Tidak perlu lagi catat manual di buku!",
      avatar: "👩‍💼"
    },
    {
      name: "Ahmad Rizki",
      role: "Penghuni Kost",
      text: "Sebagai penghuni, saya suka bisa bayar dan lapor masalah langsung dari aplikasi. Praktis!",
      avatar: "🧑‍🎓"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/kostmunity-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>kostmunity</Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/landing")}
            >
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/register-admin")}
            >
              <Text style={styles.registerButtonText}>Daftar Gratis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Kelola Kost Jadi{"\n"}
            <Text style={styles.heroTitleAccent}>Lebih Mudah & Modern</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Platform manajemen kost all-in-one untuk pemilik dan penghuni. 
            Dari billing, komunikasi, hingga analytics - semua dalam satu sistem.
          </Text>
          
          <View style={styles.heroCTA}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              onPress={() => router.push("/register-admin")}
            >
              <Text style={styles.ctaPrimaryText}>Mulai Sekarang - Gratis</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaSecondary}
              onPress={() => router.push("/landing")}
            >
              <Text style={styles.ctaSecondaryText}>Login ke Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaDownload}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('https://drive.google.com/uc?export=download&id=1kC6VsG1rN5ZnweOmB5TOaHWK8AzcWxIJ', '_blank');
                }
              }}
            >
              <Text style={styles.ctaDownloadText}>📱 Download APK Android</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Kost Terdaftar</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Penghuni Aktif</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
          </View>
        </View>
      </View>

      {/* FEATURES SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitur Unggulan</Text>
        <Text style={styles.sectionSubtitle}>
          Semua yang Anda butuhkan untuk mengelola kost secara profesional
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.featureCard,
                Platform.OS === 'web' && hoveredFeature === index && styles.featureCardHover
              ]}
              onMouseEnter={() => Platform.OS === 'web' && setHoveredFeature(index)}
              onMouseLeave={() => Platform.OS === 'web' && setHoveredFeature(null)}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* HOW IT WORKS */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Text style={styles.sectionTitle}>Cara Kerja</Text>
        <Text style={styles.sectionSubtitle}>Mulai dalam 3 langkah mudah</Text>

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Daftar & Setup</Text>
            <Text style={styles.stepDescription}>
              Daftar sebagai admin kost, isi data kost Anda, dan undang penghuni
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Kelola Member</Text>
            <Text style={styles.stepDescription}>
              Tambahkan penghuni, atur kamar, dan kelola tagihan bulanan
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Monitor & Grow</Text>
            <Text style={styles.stepDescription}>
              Pantau performa kost Anda dan tingkatkan kepuasan penghuni
            </Text>
          </View>
        </View>
      </View>

      {/* TESTIMONIALS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kata Mereka</Text>
        <Text style={styles.sectionSubtitle}>
          Dipercaya oleh pemilik kost di seluruh Indonesia
        </Text>

        <View style={styles.testimonials}>
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              <View style={styles.testimonialAuthor}>
                <Text style={styles.testimonialAvatar}>{testimonial.avatar}</Text>
                <View>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA SECTION */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaSectionTitle}>
          Siap Modernisasi Kost Anda?
        </Text>
        <Text style={styles.ctaSectionSubtitle}>
          Bergabung dengan ratusan pemilik kost yang sudah merasakan kemudahan Kostmunity
        </Text>
        <TouchableOpacity
          style={styles.ctaSectionButton}
          onPress={() => router.push("/register-admin")}
        >
          <Text style={styles.ctaSectionButtonText}>Daftar Sekarang - 100% Gratis</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <View style={styles.footerLogo}>
              <Image
                source={require("../assets/kostmunity-logo.png")}
                style={styles.footerLogoImage}
                resizeMode="contain"
              />
              <Text style={styles.footerLogoText}>kostmunity</Text>
            </View>
            <Text style={styles.footerDescription}>
              Platform manajemen kost modern untuk Indonesia
            </Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Produk</Text>
            <TouchableOpacity onPress={() => router.push("/landing")}>
              <Text style={styles.footerLink}>Dashboard Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/landing")}>
              <Text style={styles.footerLink}>Dashboard Member</Text>
            </TouchableOpacity>
            <Text style={styles.footerLink}>Mobile App</Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Perusahaan</Text>
            <Text style={styles.footerLink}>Tentang Kami</Text>
            <Text style={styles.footerLink}>Blog</Text>
            <Text style={styles.footerLink}>Kontak</Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Legal</Text>
            <Text style={styles.footerLink}>Syarat & Ketentuan</Text>
            <Text style={styles.footerLink}>Kebijakan Privasi</Text>
          </View>
        </View>

        <View style={styles.footerBottom}>
          <Text style={styles.footerCopyright}>
            © 2025 Kostmunity. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // HEADER
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 20,
    ...(Platform.OS === 'web' && {
      position: 'sticky' as any,
      top: 0,
      zIndex: 1000,
    }),
  },
  headerContent: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  loginButtonText: {
    color: "#1f2937",
    fontWeight: "600",
    fontSize: 16,
  },
  registerButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#C6F432",
  },
  registerButtonText: {
    color: "#1f2937",
    fontWeight: "600",
    fontSize: 16,
  },

  // HERO
  hero: {
    backgroundColor: "#FDF9ED",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    alignItems: "center",
    width: "100%",
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 64,
  },
  heroTitleAccent: {
    color: "#84cc16",
  },
  heroSubtitle: {
    fontSize: 20,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 700,
    marginBottom: 40,
    lineHeight: 30,
  },
  heroCTA: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 60,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ctaPrimary: {
    backgroundColor: "#84cc16",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaPrimaryText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  ctaSecondary: {
    backgroundColor: "transparent",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1f2937",
  },
  ctaSecondaryText: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "bold",
  },
  ctaDownload: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaDownloadText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    gap: 60,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  // SECTIONS
  section: {
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  sectionAlt: {
    backgroundColor: "#f9fafb",
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 60,
    maxWidth: 600,
    marginHorizontal: "auto",
  },

  // FEATURES
  featuresGrid: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
    width: "100%",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    padding: 32,
    borderRadius: 16,
    width: Platform.OS === 'web' ? 360 : "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...(Platform.OS === 'web' && {
      transition: "all 0.3s ease",
    }),
  },
  featureCardHover: {
    transform: [{ translateY: -8 }],
    borderColor: "#84cc16",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },

  // STEPS
  steps: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    justifyContent: "center",
    width: "100%",
  },
  step: {
    alignItems: "center",
    width: Platform.OS === 'web' ? 300 : "100%",
  },
  stepNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#84cc16",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepNumberText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },

  // TESTIMONIALS
  testimonials: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
    width: "100%",
  },
  testimonialCard: {
    backgroundColor: "#ffffff",
    padding: 32,
    borderRadius: 16,
    width: Platform.OS === 'web' ? 360 : "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  testimonialText: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 24,
    lineHeight: 24,
    fontStyle: "italic",
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  testimonialAvatar: {
    fontSize: 40,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  testimonialRole: {
    fontSize: 14,
    color: "#6b7280",
  },

  // CTA SECTION
  ctaSection: {
    backgroundColor: "#1f2937",
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  ctaSectionTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaSectionSubtitle: {
    fontSize: 18,
    color: "#d1d5db",
    textAlign: "center",
    maxWidth: 600,
    marginBottom: 32,
  },
  ctaSectionButton: {
    backgroundColor: "#84cc16",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
  },
  ctaSectionButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // FOOTER
  footer: {
    backgroundColor: "#f9fafb",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  footerContent: {
    maxWidth: 1200,
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 60,
    marginBottom: 40,
    width: "100%",
  },
  footerSection: {
    flex: 1,
    minWidth: 200,
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  footerLogoImage: {
    width: 32,
    height: 32,
  },
  footerLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  footerDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 32,
    alignItems: "center",
  },
  footerCopyright: {
    fontSize: 14,
    color: "#6b7280",
  },
});
