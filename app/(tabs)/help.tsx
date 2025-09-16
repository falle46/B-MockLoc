import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { CircleHelp as HelpCircle, Settings, MapPin, Smartphone, Shield, ExternalLink, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';

export default function HelpScreen() {
  const openSettings = () => {
    Linking.openSettings();
  };

  const openDeveloperOptions = () => {
    // This is a general guide, actual implementation may vary
    Linking.openURL('intent://settings/#Intent;scheme=android-app;package=com.android.settings;end');
  };

  const HelpSection = ({ icon, title, children }: { 
    icon: React.ReactNode; 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bantuan & Panduan</Text>
        <Text style={styles.headerSubtitle}>Panduan lengkap menggunakan Location Mocker</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Getting Started */}
        <HelpSection 
          icon={<MapPin size={20} color="#3B82F6" />}
          title="Cara Memulai"
        >
          <Text style={styles.stepNumber}>1. Aktifkan Developer Options</Text>
          <Text style={styles.stepDescription}>
            Buka Pengaturan → Tentang Ponsel → Ketuk "Build Number" 7 kali
          </Text>
          
          <Text style={styles.stepNumber}>2. Aktifkan Mock Location</Text>
          <Text style={styles.stepDescription}>
            Pengaturan → Developer Options → Select mock location app → Pilih "Location Mocker"
          </Text>
          
          <Text style={styles.stepNumber}>3. Berikan Izin Lokasi</Text>
          <Text style={styles.stepDescription}>
            Izinkan aplikasi mengakses lokasi perangkat Anda
          </Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={openSettings}>
            <Settings size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Buka Pengaturan</Text>
          </TouchableOpacity>
        </HelpSection>

        {/* Using the App */}
        <HelpSection
          icon={<Smartphone size={20} color="#10B981" />}
          title="Menggunakan Aplikasi"
        >
          <Text style={styles.stepNumber}>1. Pilih Lokasi</Text>
          <Text style={styles.stepDescription}>
            Buka tab "Peta" → Tap pada lokasi yang diinginkan → Tap "Gunakan Lokasi Ini"
          </Text>
          
          <Text style={styles.stepNumber}>2. Mulai Mocking</Text>
          <Text style={styles.stepDescription}>
            Kembali ke tab "Home" → Tap "Mulai Mocking"
          </Text>
          
          <Text style={styles.stepNumber}>3. Verifikasi</Text>
          <Text style={styles.stepDescription}>
            Buka aplikasi peta (Google Maps) untuk memverifikasi lokasi yang ter-mock
          </Text>
          
          <Text style={styles.stepNumber}>4. Hentikan Mocking</Text>
          <Text style={styles.stepDescription}>
            Tap "Hentikan Mocking" ketika selesai
          </Text>
        </HelpSection>

        {/* Features */}
        <HelpSection
          icon={<HelpCircle size={20} color="#8B5CF6" />}
          title="Fitur Aplikasi"
        >
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🏠 Home</Text>
            <Text style={styles.featureDescription}>
              Kontrol utama untuk memulai dan menghentikan mocking lokasi
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🗺️ Peta</Text>
            <Text style={styles.featureDescription}>
              Pilih lokasi dengan tap pada peta atau cari alamat
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>❤️ Favorit</Text>
            <Text style={styles.featureDescription}>
              Simpan lokasi yang sering digunakan untuk akses cepat
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>📝 Riwayat</Text>
            <Text style={styles.featureDescription}>
              Lihat riwayat mocking selama 7 hari terakhir
            </Text>
          </View>
        </HelpSection>

        {/* Troubleshooting */}
        <HelpSection
          icon={<Shield size={20} color="#EF4444" />}
          title="Pemecahan Masalah"
        >
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>❌ Mocking Tidak Berfungsi</Text>
            <Text style={styles.troubleDescription}>
              • Pastikan Developer Options dan Mock Location sudah diaktifkan{'\n'}
              • Pilih aplikasi ini sebagai mock location app di pengaturan{'\n'}
              • Restart aplikasi dan coba lagi
            </Text>
          </View>
          
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>🗺️ Peta Tidak Muncul</Text>
            <Text style={styles.troubleDescription}>
              • Periksa koneksi internet{'\n'}
              • Berikan izin lokasi ke aplikasi{'\n'}
              • Restart aplikasi
            </Text>
          </View>
          
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>📍 Lokasi Tidak Akurat</Text>
            <Text style={styles.troubleDescription}>
              • Zoom in pada peta untuk memilih lokasi yang tepat{'\n'}
              • Gunakan fitur pencarian untuk alamat spesifik{'\n'}
              • Verifikasi koordinat sebelum mulai mocking
            </Text>
          </View>
        </HelpSection>

        

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  warningCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionContent: {
    padding: 16,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  troubleItem: {
    marginBottom: 20,
  },
  troubleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  troubleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});