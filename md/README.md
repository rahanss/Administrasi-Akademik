# PIAM - Pusat Informasi Akademik Mahasiswa

Single Page Application (SPA) untuk sistem informasi akademik universitas dengan desain yang mengikuti prinsip-prinsip Interaksi Manusia dan Komputer (IMK/HCI).

## Fitur Utama

- ✅ Navigasi SPA tanpa reload halaman
- ✅ Kalender Akademik (konten naratif)
- ✅ Daftar Mata Kuliah per Program Studi
- ✅ Daftar Dosen
- ✅ Jadwal Kuliah & Ujian
- ✅ Panduan Administrasi (SPA, bukan PDF)
- ✅ Informasi Layanan Kampus
- ✅ **Baru**: Search functionality di header
- ✅ **Baru**: Breadcrumb navigation untuk orientasi
- ✅ **Baru**: Loading states dengan spinner
- ✅ **Baru**: Konsistensi visual dengan CSS variables
- ✅ **Baru**: Perbaikan keterbacaan dan feedback sistem

## Prinsip HCI yang Diterapkan

- **Heuristik Nielsen**: Visibility of system status, user control, consistency, error prevention
- **User-Centered Design**: Fokus pada pengalaman mahasiswa sebagai pengguna utama
- **Konsistensi Antarmuka**: Font, warna, dan spacing seragam
- **Pengurangan Beban Kognitif**: Hierarki visual jelas, grouping informasi

## Teknologi

- **Frontend**: React + React Router
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Styling**: CSS dengan custom properties untuk konsistensi

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
├── backend/             # Backend API (Node.js + Express)
│   ├── config/          # Konfigurasi database
│   ├── routes/          # API routes
│   └── index.js         # Entry point server
├── frontend-apps/        # Frontend User Apps (React SPA untuk mahasiswa)
│   ├── src/
│   │   ├── components/  # Komponen React
│   │   └── pages/       # Halaman aplikasi
│   └── public/          # Assets statis
├── frontend-cms/        # Frontend CMS (akan dibuat nanti untuk admin)
├── database/            # Schema SQL MySQL
└── docs/                # Dokumentasi
```


