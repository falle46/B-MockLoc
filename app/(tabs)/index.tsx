import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Play, Square, MapPin, Clock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

interface MockLocation {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: number;
}

export default function HomeScreen() {
  const [isMocking, setIsMocking] = useState(false);
  const [currentMockLocation, setCurrentMockLocation] = useState<MockLocation | null>(null);
  const [mockingStartTime, setMockingStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadMockingState();
  }, []);

  const loadMockingState = async () => {
    try {
      const mockingState = await AsyncStorage.getItem('isMocking');
      const mockLocation = await AsyncStorage.getItem('currentMockLocation');
      const startTime = await AsyncStorage.getItem('mockingStartTime');
      
      if (mockingState === 'true') {
        setIsMocking(true);
        setMockingStartTime(startTime ? new Date(startTime) : null);
      }
      
      if (mockLocation) {
        setCurrentMockLocation(JSON.parse(mockLocation));
      }
    } catch (error) {
      console.error('Error loading mocking state:', error);
    }
  };

  const startMocking = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Aplikasi memerlukan izin lokasi untuk bekerja dengan baik.',
          [{ text: 'OK' }]
        );
        return;
      }

      const mockLocation = await AsyncStorage.getItem('selectedLocationForMocking');
      if (!mockLocation) {
        Alert.alert(
          'Pilih Lokasi',
          'Silakan pilih lokasi di peta terlebih dahulu.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location: MockLocation = JSON.parse(mockLocation);
      const startTime = new Date();
      
      setIsMocking(true);
      setCurrentMockLocation(location);
      setMockingStartTime(startTime);
      
      // Save state
      await AsyncStorage.setItem('isMocking', 'true');
      await AsyncStorage.setItem('currentMockLocation', JSON.stringify(location));
      await AsyncStorage.setItem('mockingStartTime', startTime.toISOString());
      
      // Save to history
      await saveMockingSession(location, startTime);
      
      Alert.alert(
        'Mocking Dimulai',
        `Lokasi mock telah diaktifkan di:\n${location.address}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal memulai mocking lokasi.');
      console.error('Error starting location mocking:', error);
    }
  };

  const stopMocking = async () => {
    try {
      setIsMocking(false);
      setCurrentMockLocation(null);
      setMockingStartTime(null);
      
      // Clear state
      await AsyncStorage.removeItem('isMocking');
      await AsyncStorage.removeItem('currentMockLocation');
      await AsyncStorage.removeItem('mockingStartTime');
      await AsyncStorage.removeItem('selectedLocationForMocking');
      
      Alert.alert(
        'Mocking Dihentikan',
        'Lokasi mock telah dinonaktifkan.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal menghentikan mocking lokasi.');
      console.error('Error stopping location mocking:', error);
    }
  };

  const saveMockingSession = async (location: MockLocation, startTime: Date) => {
    try {
      const historyKey = `history_${startTime.toISOString().split('T')[0]}`;
      const existingHistory = await AsyncStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const session = {
        id: Date.now(),
        location,
        startTime: startTime.toISOString(),
        duration: 0, // Will be updated when stopped
      };
      
      history.push(session);
      await AsyncStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving mocking session:', error);
    }
  };

  const formatDuration = () => {
    if (!mockingStartTime) return '00:00:00';
    
    const now = new Date();
    const diff = now.getTime() - mockingStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Location Mocker</Text>
          <Text style={styles.headerSubtitle}>Mock lokasi Anda dengan mudah dan aman</Text>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, isMocking ? styles.statusCardActive : styles.statusCardInactive]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.statusTitle, { color: isMocking ? '#059669' : '#6B7280' }]}>
              Status Mocking
            </Text>
            <View style={[styles.statusIndicator, { backgroundColor: isMocking ? '#10B981' : '#9CA3AF' }]} />
          </View>
          
          <Text style={[styles.statusText, { color: isMocking ? '#059669' : '#6B7280' }]}>
            {isMocking ? 'AKTIF' : 'TIDAK AKTIF'}
          </Text>
          
          {isMocking && currentMockLocation && (
            <View style={styles.locationInfo}>
              <MapPin size={16} color="#059669" />
              <Text style={styles.locationText}>{currentMockLocation.address}</Text>
            </View>
          )}
          
          {isMocking && (
            <View style={styles.durationInfo}>
              <Clock size={16} color="#059669" />
              <Text style={styles.durationText}>Durasi: {formatDuration()}</Text>
            </View>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          {!isMocking ? (
            <TouchableOpacity style={styles.startButton} onPress={startMocking}>
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Mulai Mocking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopMocking}>
              <Square size={24} color="#FFFFFF" />
              <Text style={styles.stopButtonText}>Hentikan Mocking</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Information Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>⚠️ Peringatan Penting</Text>
            <Text style={styles.infoCardText}>
              Pastikan Developer Options dan Mock Location sudah diaktifkan di pengaturan Android Anda.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>📍 Cara Menggunakan</Text>
            <Text style={styles.infoCardText}>
              1. Pilih lokasi di tab "Peta"{'\n'}
              2. Kembali ke Home dan tekan "Mulai Mocking"{'\n'}
              3. Lokasi Anda akan ter-mock sesuai pilihan
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  statusCardActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  statusCardInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    flex: 1,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  controlButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCards: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});