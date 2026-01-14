# Quick Start Guide - PIAM

## Setup Cepat (5 Menit)

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Setup Database

```bash
# Pastikan MySQL berjalan, lalu:
mysql -u root -p < database/schema.sql
```

### 3. Konfigurasi Environment

Buat file `server/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=piam_db
PORT=5000
```

**Catatan**: Sesuaikan password MySQL Anda jika diperlukan.

### 4. Jalankan Aplikasi

```bash
npm run dev
```

### 5. Akses Aplikasi

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/health

## Verifikasi Instalasi

### Cek Database

```sql
USE piam_db;
SHOW TABLES;
SELECT COUNT(*) FROM prodi;
SELECT COUNT(*) FROM dosen;
SELECT COUNT(*) FROM layanan;
```

### Cek API

```bash
# Test endpoint
curl http://localhost:5000/health
curl http://localhost:5000/api/prodi
curl http://localhost:5000/api/layanan
```

### Cek Frontend

1. Buka http://localhost:3000
2. Klik card "Kalender Akademik"
3. Pastikan sidebar muncul di kiri
4. Klik menu sidebar lainnya
5. Pastikan konten berubah tanpa reload halaman

## Troubleshooting Cepat

### Database Error
```bash
# Pastikan MySQL service berjalan
# Windows: net start MySQL80
# Linux/Mac: sudo service mysql start
```

### Port Already in Use
```bash
# Ubah PORT di server/.env atau
# Kill process di port 3000/5000
```

### Module Not Found
```bash
# Hapus dan install ulang
rm -rf node_modules frontend-apps/node_modules server/node_modules
npm run install-all
```

## Struktur Navigasi

```
Homepage (/)
├── Kalender Akademik → /kalender-akademik
├── Daftar Mata Kuliah → /daftar-mata-kuliah
│   └── [Prodi] → /daftar-mata-kuliah/:prodiId
├── Daftar Dosen → /daftar-dosen-wali
├── Jadwal Kuliah → /jadwal-kuliah
├── Jadwal Ujian → /jadwal-ujian
├── Panduan Administrasi → /panduan/panduan-akademik
└── Informasi Layanan → /informasi-layanan
```

## Data Sample

Database sudah termasuk data sample:
- 17 Program Studi (D3 & S1)
- 6 Dosen
- 6 Mata Kuliah (S1 Informatika)
- 6 Layanan Kampus
- 1 Halaman Kalender Akademik

## Next Steps

1. **Tambah Konten**: Edit data di database atau melalui API
2. **Customize Styling**: Edit CSS di `frontend-apps/src/components` dan `frontend-apps/src/pages`
3. **Tambah Fitur**: Ikuti pola yang sudah ada di komponen existing
4. **Deploy**: Build untuk production dengan `npm run build` di folder frontend-apps

## Development Tips

- Gunakan React DevTools untuk debugging
- Check Network tab untuk melihat API calls
- Database queries bisa di-monitor di MySQL logs
- Hot reload aktif untuk perubahan kode

## Support

Lihat dokumentasi lengkap di:
- `README.md` - Overview project
- `ARCHITECTURE.md` - Arsitektur detail
- `INSTALLATION.md` - Instalasi lengkap




