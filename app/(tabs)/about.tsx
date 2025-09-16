import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { 
  Info, 
  User, 
  Mail, 
  ExternalLink, 
  Shield,
  Heart,
  Star,
  Github,
  MessageCircle
} from 'lucide-react-native';

export default function AboutScreen() {
  const appVersion = '1.0.0';
  const buildNumber = '001';
  
  const handleEmailPress = () => {
    Linking.openURL('mailto:developer@locationmocker.com?subject=Location Mocker - Feedback');
  };

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/yourusername/location-mocker');
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Kebijakan Privasi',
      'Aplikasi ini tidak mengumpulkan data pribadi. Semua data disimpan secara lokal di perangkat Anda dan tidak dikirim ke server eksternal.',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Aplikasi',
      'Terima kasih! Fitur ini akan tersedia ketika aplikasi sudah dipublikasi di Play Store.',
      [{ text: 'OK' }]
    );
  };

  const InfoCard = ({ icon, title, subtitle, onPress }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.infoCard, onPress && styles.infoCardClickable]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoCardContent}>
        <View style={styles.infoCardIcon}>
          {icon}
        </View>
        <View style={styles.infoCardText}>
          <Text style={styles.infoCardTitle}>{title}</Text>
          {subtitle && <Text style={styles.infoCardSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {onPress && <ExternalLink size={16} color="#6B7280" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        <Text style={styles.headerSubtitle}>Location Mocker v{appVersion}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIcon}>
            <Info size={40} color="#3B82F6" />
          </View>
          <Text style={styles.appName}>Location Mocker</Text>
          <Text style={styles.appTagline}>Mock lokasi dengan mudah dan aman</Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Versi {appVersion} (Build {buildNumber})</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Tentang Aplikasi</Text>
          <Text style={styles.descriptionText}>
            Location Mocker adalah aplikasi Android yang memungkinkan Anda untuk mock (simulasi) lokasi GPS perangkat. 
            Aplikasi ini dibuat untuk keperluan pengujian dan pengembangan aplikasi yang bergantung pada layanan berbasis lokasi.
          </Text>
          
          <Text style={styles.descriptionText}>
            Dengan antarmuka yang sederhana dan intuitif, Anda dapat dengan mudah memilih lokasi di peta, 
            menyimpan lokasi favorit, dan melacak riwayat penggunaan mock location.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Fitur Utama</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ Mock lokasi GPS secara real-time</Text>
            <Text style={styles.featureItem}>🗺️ Pilih lokasi dengan tap di peta interaktif</Text>
            <Text style={styles.featureItem}>❤️ Simpan lokasi favorit untuk akses cepat</Text>
            <Text style={styles.featureItem}>📝 Riwayat penggunaan selama 7 hari</Text>
            <Text style={styles.featureItem}>🔍 Pencarian lokasi berdasarkan alamat</Text>
            <Text style={styles.featureItem}>🛡️ Antarmuka yang aman dan mudah digunakan</Text>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Developer</Text>
          
          <InfoCard
            icon={<User size={20} color="#3B82F6" />}
            title="Developer"
            subtitle="Meaow Teams"
          />
          
          <InfoCard
            icon={<Mail size={20} color="#10B981" />}
            title="Email Dev"
            subtitle="meaowcats3@gmail.com"
            onPress={handleEmailPress}
          />
          
        </View>

        {/* App Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aksi</Text>
          
          <InfoCard
            icon={<Star size={20} color="#F59E0B" />}
            title="Rate Aplikasi"
            subtitle="Berikan rating di Play Store"
            onPress={handleRateApp}
          />
          
          <InfoCard
            icon={<MessageCircle size={20} color="#8B5CF6" />}
            title="Feedback"
            subtitle="Kirim saran dan masukan"
            onPress={handleEmailPress}
          />
          
          <InfoCard
            icon={<Shield size={20} color="#6366F1" />}
            title="Kebijakan Privasi"
            subtitle="Informasi tentang data dan privasi"
            onPress={handlePrivacyPress}
          />
        </View>

        {/* Made with Love */}
        <View style={styles.madeWithLove}>
          <Text style={styles.madeWithLoveText}>
            Made with <Heart size={16} color="#EF4444" /> for users
          </Text>
          <Text style={styles.copyrightText}>
            © 2025 Meaow Teams. All rights reserved.
          </Text>
        </View>

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
    alignItems: 'center',
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
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appIcon: {
    backgroundColor: '#EFF6FF',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  versionInfo: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardClickable: {
    // Add visual feedback for clickable cards if needed
  },
  infoCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardIcon: {
    marginRight: 12,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  infoCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  legalSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legalText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  madeWithLove: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  madeWithLoveText: {
    fontSize: 14,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 40,
  },
});