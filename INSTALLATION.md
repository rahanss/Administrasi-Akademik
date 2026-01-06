# Panduan Instalasi PIAM

## Persyaratan Sistem

- Node.js (v16 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

## Langkah Instalasi

### 1. Clone atau Download Project

```bash
cd baak
```

### 2. Install Dependencies

Install semua dependencies untuk root, server, dan client:

```bash
npm run install-all
```

Atau install secara manual:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Setup Database MySQL

1. Buat database MySQL (atau gunakan database yang sudah ada)
2. Import schema database:

```bash
mysql -u root -p < database/schema.sql
```

Atau melalui MySQL client:

```sql
mysql -u root -p
source database/schema.sql
```

### 4. Konfigurasi Database

Buat file `.env` di folder `server/` berdasarkan `server/.env.example`:

```bash
cd server
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=piam_db
PORT=5000
```

### 5. Jalankan Aplikasi

Dari root directory, jalankan:

```bash
npm run dev
```

Ini akan menjalankan:
- Backend API di `http://localhost:5000`
- Frontend React di `http://localhost:3000`

Atau jalankan secara terpisah:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### 6. Akses Aplikasi

Buka browser dan akses:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/health

## Troubleshooting

### Error: Cannot connect to MySQL

- Pastikan MySQL service berjalan
- Periksa kredensial di `server/.env`
- Pastikan database `piam_db` sudah dibuat

### Error: Port already in use

- Ubah PORT di `server/.env` atau
- Tutup aplikasi yang menggunakan port 3000 atau 5000

### Error: Module not found

- Pastikan semua dependencies sudah diinstall
- Hapus `node_modules` dan install ulang:
  ```bash
  rm -rf node_modules client/node_modules server/node_modules
  npm run install-all
  ```

## Struktur Database

Database menggunakan MySQL dengan tabel-tabel berikut:

- `kategori_konten` - Kategori konten
- `menu_sidebar` - Menu sidebar
- `halaman_konten` - Halaman konten
- `prodi` - Program studi
- `mata_kuliah` - Mata kuliah
- `dosen` - Dosen
- `jadwal_kuliah` - Jadwal kuliah
- `jadwal_ujian` - Jadwal ujian
- `layanan` - Informasi layanan

## Fitur Utama

✅ Single Page Application (SPA) tanpa reload
✅ Navigasi hybrid (Homepage → Card System → Sidebar + Content)
✅ Kalender Akademik (konten naratif)
✅ Daftar Mata Kuliah per Program Studi
✅ Daftar Dosen
✅ Jadwal Kuliah & Ujian
✅ Panduan Administrasi (SPA, bukan PDF)
✅ Informasi Layanan Kampus

## Development

Untuk development dengan auto-reload:

```bash
# Backend dengan nodemon
cd server
npm run dev

# Frontend (sudah auto-reload dengan react-scripts)
cd client
npm start
```


