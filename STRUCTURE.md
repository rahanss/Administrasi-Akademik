# Struktur Project PIAM

## Overview

Project PIAM dibagi menjadi 3 bagian utama dengan pemisahan yang jelas:

1. **Backend** - REST API Server (Node.js + Express)
2. **Frontend Apps** - Aplikasi SPA untuk pengguna (mahasiswa) - **yang sedang dikerjakan**
3. **Frontend CMS** - Content Management System untuk admin - **akan dibuat nanti**

## Struktur Folder Saat Ini

```
baak/
├── backend/                 # Backend API Server
│   └── server/              # Server code
│       ├── config/          # Konfigurasi
│       │   └── database.js  # Konfigurasi koneksi database
│       ├── routes/          # API Routes
│       │   ├── index.js     # Router utama
│       │   ├── berita.js    # Routes untuk berita
│       │   ├── dosen.js     # Routes untuk dosen
│       │   ├── halaman.js   # Routes untuk halaman konten
│       │   ├── jadwal.js    # Routes untuk jadwal
│       │   ├── layanan.js   # Routes untuk layanan
│       │   ├── mataKuliah.js # Routes untuk mata kuliah
│       │   ├── menu.js      # Routes untuk menu sidebar
│       │   └── prodi.js     # Routes untuk program studi
│       ├── index.js         # Entry point server
│       └── package.json     # Dependencies backend
│
├── frontend/                # Frontend Applications
│   └── app/                 # Frontend User Apps (YANG SEDANG DIKERJAKAN)
│       ├── public/          # Assets statis
│       │   ├── documents/   # Dokumen PDF (daftar mata kuliah)
│       │   ├── icons/       # Icon untuk card dan sidebar
│       │   └── images/      # Gambar (banner, dll)
│       ├── src/
│       │   ├── components/  # Komponen React reusable
│       │   │   ├── Layout/  # Layout components (Header, Sidebar)
│       │   │   ├── Breadcrumb.js
│       │   │   └── LoadingSpinner.js
│       │   ├── pages/       # Halaman aplikasi
│       │   │   ├── Homepage.js
│       │   │   ├── AcademicCalendar.js
│       │   │   ├── CourseList.js
│       │   │   └── ...
│       │   ├── App.js       # Router utama
│       │   ├── index.js     # Entry point React
│       │   └── index.css    # Global styles
│       └── package.json     # Dependencies frontend
│
├── frontend-cms/            # Frontend CMS (AKAN DIBUAT NANTI)
│   └── (Content Management System untuk admin)
│
├── database/                # Database
│   └── schema.sql           # MySQL schema dan sample data
│
└── docs/                    # Dokumentasi
    └── ...
```

## Pemisahan Concerns

### Backend (`backend/` atau `server/`)
- **Tujuan**: Menyediakan REST API untuk semua frontend
- **Teknologi**: Node.js + Express + MySQL
- **Port**: 5000 (default)
- **Fungsi**:
  - Menyediakan data untuk **frontend-apps** (yang sedang dikerjakan)
  - Akan menyediakan data untuk **frontend-cms** (nanti)
  - Mengelola database MySQL
  - Single source of truth untuk semua data
  - Authentication & Authorization (jika diperlukan)

### Frontend Apps (`frontend-apps/` atau `client/`)
- **Tujuan**: Aplikasi SPA untuk pengguna (mahasiswa) - **YANG SEDANG DIKERJAKAN**
- **Teknologi**: React + React Router
- **Port**: 3000 (default)
- **Fungsi**:
  - Menampilkan informasi akademik
  - Navigasi tanpa reload
  - User-facing interface
  - Tidak memerlukan login
  - Menampilkan dokumen PDF untuk daftar mata kuliah

### Frontend CMS (`frontend-cms/`)
- **Tujuan**: Content Management System untuk admin
- **Status**: **AKAN DIBUAT NANTI**
- **Port**: 3001 (rencana)
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
  - **Shared database** untuk semua frontend (apps dan CMS)

## Alur Data

```
┌─────────────────┐
│  Frontend Apps  │ ────┐
│  (Mahasiswa)    │     │
│  [SEDANG        │     │
│   DIKERJAKAN]   │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │     ┌──────────┐     ┌──────────┐
│  Frontend CMS   │ ────┼────▶│ Backend  │────▶│ Database │
│  (Admin)        │     │     │   API    │     │  MySQL   │
│  [AKAN DIBUAT]  │     │     └──────────┘     └──────────┘
└─────────────────┘     │
                        │
                        └───── Semua frontend menggunakan backend API yang sama
```

## Scripts di Root `package.json`

```json
{
  "dev": "Menjalankan backend + frontend-apps secara bersamaan",
  "backend": "Menjalankan backend saja",
  "server": "Menjalankan backend saja (legacy)",
  "frontend-apps": "Menjalankan frontend-apps saja",
  "client": "Menjalankan frontend-apps saja (legacy)",
  "install-all": "Install dependencies untuk semua bagian"
}
```

## Port Configuration

- **Backend API**: `http://localhost:5000`
- **Frontend Apps**: `http://localhost:3000` (yang sedang dikerjakan)
- **Frontend CMS**: `http://localhost:3001` (akan dibuat nanti)

## Development Workflow

### Saat Ini (Frontend Apps)
1. **Setup awal**:
   ```bash
   npm run install-all
   ```

2. **Development**:
   ```bash
   # Jalankan semua (backend + frontend-apps)
   npm run dev
   
   # Atau jalankan terpisah
   npm run backend        # Backend saja
   npm run frontend-apps  # Frontend apps saja
   ```

3. **Production**:
   - Build frontend-apps: `cd frontend-apps && npm run build`
   - Deploy backend dan frontend-apps secara terpisah

### Nanti (Frontend CMS)
Ketika frontend-cms dibuat:
- Akan menggunakan backend API yang sama
- Port terpisah (3001)
- Development terpisah dari frontend-apps
- Shared database dengan frontend-apps

## Catatan Penting

1. **Backend** adalah single source of truth untuk semua data
2. **Frontend Apps** dan **Frontend CMS** adalah client yang berbeda dengan tujuan berbeda
3. **Database** adalah shared resource untuk semua aplikasi
4. Struktur ini memungkinkan:
   - Pengembangan yang terpisah
   - Deployment yang terpisah
   - Scalability yang lebih baik
   - Team collaboration yang lebih mudah

## Status Folder Saat Ini

- ✅ `backend/` atau `server/` - Backend API (ada)
- ✅ `frontend-apps/` atau `client/` - Frontend Apps (ada, sedang dikerjakan)
- ⏳ `frontend-cms/` - Frontend CMS (akan dibuat nanti)
- ✅ `database/` - Database schema (ada)

## Rename Folder (Jika Diperlukan)

Jika folder masih menggunakan nama lama:
- `client/` → `frontend-apps/`
- `server/` → `backend/` (opsional)

Lihat `package.json` untuk script yang mendukung kedua nama (legacy dan baru).
