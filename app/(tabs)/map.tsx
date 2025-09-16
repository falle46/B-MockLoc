import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Search, MapPin, Heart, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin lokasi untuk menampilkan posisi Anda.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Center map to current location
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'setLocation',
          latitude,
          longitude,
        }));
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Masukkan nama lokasi atau alamat.');
      return;
    }

    try {
      // Use Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const result = results[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        const address = result.display_name;
        
        // Center map to searched location
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'searchLocation',
            latitude,
            longitude,
          }));
        }
      } else {
        Alert.alert('Tidak Ditemukan', 'Lokasi yang dicari tidak ditemukan.');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mencari lokasi. Periksa koneksi internet Anda.');
      console.error('Error searching location:', error);
    }
  };

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'locationSelected') {
        setSelectedLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address || `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`,
        });
        setIsLocationSelected(true);
      }
    } catch (error) {
      console.error('Error handling map message:', error);
    }
  };

  const selectLocationForMocking = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Pilih lokasi di peta terlebih dahulu.');
      return;
    }

    try {
      await AsyncStorage.setItem('selectedLocationForMocking', JSON.stringify(selectedLocation));
      Alert.alert(
        'Lokasi Dipilih',
        `Lokasi untuk mocking telah dipilih:\n${selectedLocation.address}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan lokasi yang dipilih.');
      console.error('Error saving selected location:', error);
    }
  };

  const addToFavorites = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Pilih lokasi di peta terlebih dahulu.');
      return;
    }

    try {
      const favoritesData = await AsyncStorage.getItem('favoriteLocations');
      const favorites = favoritesData ? JSON.parse(favoritesData) : [];
      
      // Check if location already exists
      const exists = favorites.some((fav: LocationData) => 
        Math.abs(fav.latitude - selectedLocation.latitude) < 0.0001 &&
        Math.abs(fav.longitude - selectedLocation.longitude) < 0.0001
      );
      
      if (exists) {
        Alert.alert('Info', 'Lokasi sudah ada di favorit.');
        return;
      }
      
      const newFavorite = {
        ...selectedLocation,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      
      favorites.push(newFavorite);
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favorites));
      
      Alert.alert('Berhasil', 'Lokasi telah ditambahkan ke favorit.');
    } catch (error) {
      Alert.alert('Error', 'Gagal menambahkan ke favorit.');
      console.error('Error adding to favorites:', error);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([-6.2088, 106.8456], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        let currentMarker = null;
        
        map.on('click', async function(e) {
          if (currentMarker) {
            map.removeLayer(currentMarker);
          }
          
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          
          currentMarker = L.marker([lat, lng]).addTo(map);
          
          // Get address using reverse geocoding
          try {
            const response = await fetch(
              \`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}\`
            );
            const result = await response.json();
            const address = result.display_name || \`\${lat.toFixed(6)}, \${lng.toFixed(6)}\`;
            
            currentMarker.bindPopup(address).openPopup();
            
            // Send data to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationSelected',
              latitude: lat,
              longitude: lng,
              address: address
            }));
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            currentMarker.bindPopup(\`\${lat.toFixed(6)}, \${lng.toFixed(6)}\`).openPopup();
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationSelected',
              latitude: lat,
              longitude: lng,
              address: \`\${lat.toFixed(6)}, \${lng.toFixed(6)}\`
            }));
          }
        });
        
        // Listen for messages from React Native
        window.addEventListener('message', function(event) {
          const data = JSON.parse(event.data);
          
          if (data.type === 'setLocation') {
            map.setView([data.latitude, data.longitude], 15);
            if (currentMarker) {
              map.removeLayer(currentMarker);
            }
            currentMarker = L.marker([data.latitude, data.longitude]).addTo(map);
            currentMarker.bindPopup('Lokasi Anda saat ini').openPopup();
          }
          
          if (data.type === 'searchLocation') {
            map.setView([data.latitude, data.longitude], 15);
            if (currentMarker) {
              map.removeLayer(currentMarker);
            }
            currentMarker = L.marker([data.latitude, data.longitude]).addTo(map);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pilih Lokasi</Text>
        <Text style={styles.headerSubtitle}>Tap pada peta untuk memilih lokasi mock</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari alamat atau tempat..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.map}
          onMessage={handleMapMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </View>

      {/* Selected Location Info */}
      {isLocationSelected && selectedLocation && (
        <View style={styles.locationInfo}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.locationCard}>
              <MapPin size={16} color="#3B82F6" />
              <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.favoriteButton} onPress={addToFavorites}>
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.selectButton} onPress={selectLocationForMocking}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.selectButtonText}>Gunakan Lokasi Ini</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 300,
  },
  locationAddress: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: '#EF4444',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});