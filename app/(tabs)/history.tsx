import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Clock, MapPin, Trash2, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HistorySession {
  id: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startTime: string;
  duration: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const allHistory: HistorySession[] = [];
      const today = new Date();
      
      // Load history from last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = `history_${date.toISOString().split('T')[0]}`;
        
        const dayHistoryData = await AsyncStorage.getItem(dateKey);
        if (dayHistoryData) {
          const dayHistory = JSON.parse(dayHistoryData);
          allHistory.push(...dayHistory);
        }
      }
      
      // Sort by start time (newest first)
      allHistory.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setHistory(allHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Hapus Semua Riwayat',
      'Yakin ingin menghapus semua riwayat mocking?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const today = new Date();
              for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateKey = `history_${date.toISOString().split('T')[0]}`;
                await AsyncStorage.removeItem(dateKey);
              }
              setHistory([]);
              Alert.alert('Berhasil', 'Semua riwayat telah dihapus.');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus riwayat.');
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    
    let dayLabel;
    if (dateStr === todayStr) {
      dayLabel = 'Hari ini';
    } else if (dateStr === yesterdayStr) {
      dayLabel = 'Kemarin';
    } else {
      dayLabel = date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short' 
      });
    }
    
    const time = date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `${dayLabel}, ${time}`;
  };

  const reuseLocation = async (session: HistorySession) => {
    try {
      await AsyncStorage.setItem('selectedLocationForMocking', JSON.stringify(session.location));
      
      Alert.alert(
        'Lokasi Dipilih',
        `Lokasi dari riwayat telah dipilih untuk mocking:\n${session.location.address}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih lokasi dari riwayat.');
      console.error('Error reusing location:', error);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistorySession }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => reuseLocation(item)}
    >
      <View style={styles.historyInfo}>
        <View style={styles.historyHeader}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.historyDate}>{formatDateTime(item.startTime)}</Text>
        </View>
        
        <View style={styles.locationInfo}>
          <MapPin size={16} color="#3B82F6" />
          <Text style={styles.locationAddress} numberOfLines={2}>
            {item.location.address}
          </Text>
        </View>
        
        <View style={styles.durationInfo}>
          <Clock size={16} color="#10B981" />
          <Text style={styles.durationText}>
            Durasi: {formatDuration(item.startTime)}
          </Text>
        </View>
      </View>
      
      <View style={styles.reuseIndicator}>
        <Text style={styles.reuseText}>Tap untuk gunakan</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Clock size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Tidak Ada Riwayat</Text>
      <Text style={styles.emptySubtitle}>
        Riwayat mocking lokasi selama 7 hari terakhir akan ditampilkan di sini.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Riwayat Mocking</Text>
          <Text style={styles.headerSubtitle}>
            {history.length > 0 ? `${history.length} sesi dalam 7 hari terakhir` : '7 hari terakhir'}
          </Text>
        </View>
        
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={history.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadHistory}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
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
  clearButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyInfo: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 6,
    fontWeight: '500',
  },
  reuseIndicator: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    alignItems: 'center',
  },
  reuseText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});