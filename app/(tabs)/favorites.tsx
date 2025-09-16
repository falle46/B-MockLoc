import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { MapPin, Trash2, Play } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteLocation {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favoriteLocations');
      const favoritesList = favoritesData ? JSON.parse(favoritesData) : [];
      setFavorites(favoritesList.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFavorite = async (id: number) => {
    Alert.alert(
      'Hapus Favorit',
      'Yakin ingin menghapus lokasi ini dari favorit?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(fav => fav.id !== id);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites.reverse()));
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus favorit.');
              console.error('Error deleting favorite:', error);
            }
          },
        },
      ]
    );
  };

  const useFavoriteForMocking = async (favorite: FavoriteLocation) => {
    try {
      const locationData = {
        latitude: favorite.latitude,
        longitude: favorite.longitude,
        address: favorite.address,
      };
      
      await AsyncStorage.setItem('selectedLocationForMocking', JSON.stringify(locationData));
      
      Alert.alert(
        'Lokasi Dipilih',
        `Lokasi favorit telah dipilih untuk mocking:\n${favorite.address}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih lokasi favorit.');
      console.error('Error selecting favorite for mocking:', error);
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteLocation }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.favoriteInfo}>
        <MapPin size={20} color="#3B82F6" />
        <View style={styles.favoriteDetails}>
          <Text style={styles.favoriteAddress} numberOfLines={2}>
            {item.address}
          </Text>
          <Text style={styles.favoriteCoords}>
            {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
          </Text>
          <Text style={styles.favoriteDate}>
            Ditambahkan: {new Date(item.timestamp).toLocaleDateString('id-ID')}
          </Text>
        </View>
      </View>
      
      <View style={styles.favoriteActions}>
        <TouchableOpacity
          style={styles.useButton}
          onPress={() => useFavoriteForMocking(item)}
        >
          <Play size={16} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteFavorite(item.id)}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MapPin size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Tidak Ada Favorit</Text>
      <Text style={styles.emptySubtitle}>
        Tambahkan lokasi favorit dari halaman Peta untuk memudahkan akses ke lokasi yang sering digunakan.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lokasi Favorit</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length > 0 ? `${favorites.length} lokasi tersimpan` : 'Belum ada lokasi favorit'}
        </Text>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadFavorites}
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
  favoriteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  favoriteDetails: {
    flex: 1,
    marginLeft: 12,
  },
  favoriteAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  favoriteCoords: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  favoriteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});