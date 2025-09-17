# Location Mocker - Native Android App

Aplikasi Android native untuk mock/simulasi lokasi GPS dengan fitur lengkap. Dibuat menggunakan Expo React Native dengan antarmuka yang modern dan mudah digunakan.

## 🚀 Fitur Utama

- **Mock Lokasi Real-time**: Simulasi lokasi GPS secara langsung
- **Peta Interaktif**: Pilih lokasi dengan tap pada peta Leaflet
- **Lokasi Favorit**: Simpan lokasi yang sering digunakan
- **Riwayat 7 Hari**: Lacak penggunaan mock location
- **Pencarian Alamat**: Cari lokasi berdasarkan nama atau alamat
- **Bantuan Lengkap**: Panduan penggunaan step-by-step
- **UI Modern**: Antarmuka yang clean dan responsif

## 📋 Persyaratan

### Sistem
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Android Studio (untuk build lokal)
- Java Development Kit (JDK) 11 atau 17

### Perangkat Android
- Android 6.0 (API level 23) atau lebih baru
- Developer Options diaktifkan
- Mock Location diaktifkan
- Izin lokasi diberikan

## 🛠️ Instalasi dan Setup

### 1. Clone dan Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd location-mocker

# Install dependencies
npm install

# Install Expo CLI global
npm install -g @expo/cli
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```bash
# .env
EXPO_PUBLIC_API_URL=https://nominatim.openstreetmap.org
```

### 3. Development Server

```bash
# Mulai development server
npm run dev

# Atau dengan Expo
expo start
```

## 📱 Build APK

### Metode 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login ke Expo account
eas login

# Konfigurasi build
eas build:configure

# Build APK untuk Android
eas build --platform android --profile preview

# Download APK setelah build selesai
```

### Metode 2: Build Lokal

```bash
# Generate native code
expo run:android

# Atau build release APK
cd android
./gradlew assembleRelease

# APK akan tersedia di: android/app/build/outputs/apk/release/
```

## 📂 Struktur Project

```
location-mocker/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── map.tsx            # Map screen
│   │   ├── favorites.tsx      # Favorites screen
│   │   ├── history.tsx        # History screen
│   │   ├── help.tsx           # Help screen
│   │   ├── about.tsx          # About screen
│   │   └── _layout.tsx        # Tab navigation
│   ├── _layout.tsx            # Root layout
│   └── +not-found.tsx         # 404 screen
├── components/                # Reusable components
├── hooks/                     # Custom hooks
├── assets/                    # Images and fonts
├── app.json                   # Expo configuration
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## 🔧 Konfigurasi Android

### 1. Enable Developer Options

1. Buka **Pengaturan** > **Tentang Ponsel**
2. Ketuk **Build Number** sebanyak 7 kali
3. Developer Options akan muncul di Pengaturan

### 2. Enable Mock Location

1. Buka **Pengaturan** > **Developer Options**
2. Cari **Select mock location app**
3. Pilih **Location Mocker** dari daftar aplikasi

### 3. Permissions

Aplikasi akan meminta izin berikut:
- **ACCESS_FINE_LOCATION**: Untuk mengakses GPS
- **ACCESS_COARSE_LOCATION**: Untuk lokasi kasar
- **INTERNET**: Untuk peta dan geocoding

## 💡 Cara Penggunaan

### 1. Pilih Lokasi
- Buka tab **Peta**
- Tap pada lokasi yang diinginkan di peta
- Atau gunakan fitur pencarian untuk mencari alamat
- Tap **Gunakan Lokasi Ini**

### 2. Mulai Mocking
- Kembali ke tab **Home**
- Tap **Mulai Mocking**
- Aplikasi akan mulai mock lokasi

### 3. Verifikasi
- Buka Google Maps atau aplikasi lain yang menggunakan GPS
- Lokasi Anda akan terlihat sesuai dengan yang di-mock

### 4. Hentikan Mocking
- Tap **Hentikan Mocking** ketika selesai

### 5. Fitur Tambahan
- **Favorit**: Simpan lokasi untuk penggunaan berulang
- **Riwayat**: Lihat lokasi yang pernah di-mock
- **Bantuan**: Panduan lengkap penggunaan

## 🔍 Troubleshooting

### Mock Location Tidak Berfungsi
- Pastikan Developer Options sudah diaktifkan
- Pilih aplikasi ini sebagai Mock Location App
- Restart aplikasi dan coba lagi

### Peta Tidak Muncul
- Periksa koneksi internet
- Berikan izin lokasi ke aplikasi
- Restart aplikasi

### Lokasi Tidak Akurat
- Zoom in pada peta untuk lokasi yang tepat
- Gunakan fitur pencarian untuk alamat spesifik
- Verifikasi koordinat sebelum mulai mocking

## 📋 Dependencies Utama

```json
{
  "expo": "^53.0.0",
  "react-native": "0.79.1",
  "expo-router": "~5.0.2",
  "expo-location": "latest",
  "react-native-webview": "latest",
  "react-native-maps": "latest",
  "@react-native-async-storage/async-storage": "latest",
  "lucide-react-native": "latest"
}
```

## 🚢 Deployment

### APK Release Steps

1. **Update Version**
   ```bash
   # Update version di app.json
   {
     "expo": {
       "version": "1.0.0"
     }
   }
   ```

2. **Build Production APK**
   ```bash
   eas build --platform android --profile production
   ```

3. **Test APK**
   - Install di beberapa perangkat Android
   - Test semua fitur utama
   - Verifikasi mock location berfungsi

4. **Upload ke Play Store** (Opsional)
   - Buat akun Google Play Developer
   - Upload APK dan isi metadata
   - Submit untuk review

## 🔒 Security & Privacy

- **Data Lokal**: Semua data disimpan lokal di perangkat
- **No Analytics**: Tidak ada tracking atau analytics
- **Open Source**: Code transparan dan dapat diaudit
- **Minimal Permissions**: Hanya minta izin yang diperlukan

## ⚠️ Disclaimer

Aplikasi ini dibuat untuk tujuan pengujian dan pengembangan. Penggunaan untuk menipu layanan berbasis lokasi dapat melanggar ketentuan layanan dan hukum yang berlaku. Pengguna bertanggung jawab penuh atas penggunaan aplikasi.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - Lihat [LICENSE](LICENSE) untuk detail lengkap.

## 📞 Support

- **Email**: developer@locationmocker.com
- **GitHub Issues**: [Create Issue](https://github.com/yourusername/location-mocker/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/location-mocker/wiki)

## 🙏 Credits

- **Maps**: OpenStreetMap & Leaflet
- **Icons**: Lucide React Native
- **Framework**: Expo React Native
- **Geocoding**: Nominatim OpenStreetMap

---

**Happy Mocking! 🎯**