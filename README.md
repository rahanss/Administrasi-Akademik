# PIAM - Pusat Informasi Akademik Mahasiswa

Single Page Application (SPA) untuk sistem informasi akademik universitas.

## Fitur Utama

- ✅ Navigasi SPA tanpa reload halaman
- ✅ Kalender Akademik (konten naratif)
- ✅ Daftar Mata Kuliah per Program Studi
- ✅ Daftar Dosen
- ✅ Jadwal Kuliah & Ujian
- ✅ Panduan Administrasi (SPA, bukan PDF)
- ✅ Informasi Layanan Kampus

## Teknologi

- **Frontend**: React + React Router
- **Backend**: Node.js + Express
- **Database**: MySQL

## Instalasi

1. Install dependencies:
```bash
npm run install-all
```

2. Setup database MySQL:
```bash
mysql -u root -p < database/schema.sql
```

3. Update konfigurasi database di `server/config/database.js`

4. Jalankan aplikasi:
```bash
npm run dev
```

Frontend akan berjalan di http://localhost:3000
Backend API akan berjalan di http://localhost:5000

## Struktur Project

```
├── client/          # Frontend React
├── server/          # Backend API
├── database/        # SQL schema
└── package.json
```


