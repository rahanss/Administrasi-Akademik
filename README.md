# PIAM - Pusat Informasi Akademik Mahasiswa

Single Page Application (SPA) untuk sistem informasi akademik universitas dengan desain yang mengikuti prinsip-prinsip Interaksi Manusia dan Komputer (IMK/HCI).

## Struktur Project

Project ini dibagi menjadi beberapa bagian yang jelas terpisah:

```
baak/
├── backend/              # Backend API Server (Node.js + Express)
│   └── server/           # Server code
│       ├── config/      # Konfigurasi database
│       ├── routes/      # API Routes (REST endpoints)
│       └── index.js     # Entry point server
│
├── frontend/             # Frontend Applications
│   └── app/              # Frontend User Apps (React SPA untuk mahasiswa) - YANG SEDANG DIKERJAKAN
│       ├── src/          # Source code React
│       ├── public/       # Assets statis (images, documents, icons)
│       └── package.json  # Dependencies frontend-apps
│
├── frontend-cms/         # Frontend CMS (akan dibuat nanti untuk admin)
│   └── (Content Management System untuk admin)
│
├── database/             # Database schema dan migrations
│   └── schema.sql        # MySQL schema
│
└── docs/                 # Dokumentasi
```

## Pemisahan Concerns

### Backend (`backend/` atau `server/`)
- **Tujuan**: Menyediakan REST API untuk semua frontend
- **Teknologi**: Node.js + Express + MySQL
- **Port**: 5000 (default)
- **Fungsi**:
  - Menyediakan data untuk frontend-apps
  - Akan menyediakan data untuk frontend-cms (nanti)
  - Mengelola database MySQL
  - Single source of truth untuk semua data

### Frontend Apps (`frontend/app/`)
- **Tujuan**: Aplikasi SPA untuk pengguna (mahasiswa)
- **Teknologi**: React + React Router
- **Port**: 3000 (default)
- **Fungsi**:
  - Menampilkan informasi akademik
  - Navigasi tanpa reload
  - User-facing interface
  - Tidak memerlukan login

### Frontend CMS (`frontend-cms/`)
- **Tujuan**: Content Management System untuk admin
- **Status**: Akan dibuat nanti
- **Fungsi** (rencana):
  - Mengelola konten akademik
  - CRUD untuk berita, halaman, dll
  - Mengelola program studi dan mata kuliah
  - Mengelola jadwal dan dosen
  - Memerlukan authentication & authorization

### Database (`database/`)
- **Tujuan**: Menyimpan semua data aplikasi
- **Teknologi**: MySQL
- **Fungsi**:
  - Menyimpan konten akademik
  - Menyimpan data program studi, mata kuliah, dosen
  - Menyimpan jadwal dan berita
  - Shared database untuk semua frontend

## Alur Data

```
┌─────────────────┐
│  Frontend Apps  │ ────┐
│  (Mahasiswa)    │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │     ┌──────────┐     ┌──────────┐
│  Frontend CMS   │ ────┼────▶│ Backend  │────▶│ Database │
│  (Admin)        │     │     │   API    │     │  MySQL   │
└─────────────────┘     │     └──────────┘     └──────────┘
                        │
                        └───── Semua frontend menggunakan backend API yang sama
```

## Instalasi

1. Install dependencies:
```bash
npm run install-all
```

2. Setup database MySQL:
```bash
mysql -u root -p < database/schema.sql
```

3. Update konfigurasi database di `backend/server/config/database.js`

4. Jalankan aplikasi:
```bash
npm run dev
```

Frontend Apps akan berjalan di http://localhost:3000
Backend API akan berjalan di http://localhost:5000

## Scripts

### Root `package.json`
- `npm run dev` - Menjalankan backend + frontend-apps secara bersamaan
- `npm run server` - Menjalankan backend saja
- `npm run frontend-apps` - Menjalankan frontend-apps saja
- `npm run install-all` - Install dependencies untuk semua bagian

## Fitur Utama

- ✅ Navigasi SPA tanpa reload halaman
- ✅ Kalender Akademik (konten naratif)
- ✅ Daftar Mata Kuliah per Program Studi (dengan dokumen PDF)
- ✅ Daftar Dosen
- ✅ Jadwal Kuliah & Ujian
- ✅ Panduan Administrasi (SPA, bukan PDF)
- ✅ Informasi Layanan Kampus
- ✅ Berita dengan halaman detail
- ✅ Formulir Rencana Studi

## Teknologi

- **Backend**: Node.js + Express (REST API)
- **Frontend Apps**: React + React Router
- **Frontend CMS**: Akan dibuat nanti
- **Database**: MySQL
- **Styling**: CSS dengan custom properties untuk konsistensi

## Development

### Development Mode
```bash
# Jalankan semua (backend + frontend-apps)
npm run dev

# Atau jalankan terpisah
npm run server        # Backend saja
npm run frontend-apps # Frontend apps saja
```

### Production Build
```bash
# Build frontend-apps
cd frontend-apps
npm run build

# Deploy backend dan frontend secara terpisah
```

## Catatan Penting

- **Backend** adalah single source of truth untuk semua data
- **Frontend Apps** dan **Frontend CMS** adalah client yang berbeda dengan tujuan berbeda
- **Database** adalah shared resource untuk semua aplikasi
- Struktur ini memungkinkan pengembangan yang terpisah dan scalable
