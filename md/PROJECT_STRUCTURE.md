# Struktur Project PIAM

## Overview

Project PIAM dibagi menjadi beberapa bagian yang jelas untuk memisahkan concerns dan memudahkan pengembangan:

1. **Backend** - API Server (Node.js + Express)
2. **Frontend Apps** - Aplikasi SPA untuk pengguna (mahasiswa)
3. **Frontend CMS** - Content Management System untuk admin (akan dibuat nanti)
4. **Database** - Schema dan migrations MySQL

## Struktur Folder

```
baak/
├── backend/                 # Backend API Server
│   ├── config/              # Konfigurasi
│   │   └── database.js      # Konfigurasi koneksi database
│   ├── routes/              # API Routes
│   │   ├── index.js         # Router utama
│   │   ├── berita.js        # Routes untuk berita
│   │   ├── dosen.js         # Routes untuk dosen
│   │   ├── halaman.js       # Routes untuk halaman konten
│   │   ├── jadwal.js        # Routes untuk jadwal
│   │   ├── layanan.js       # Routes untuk layanan
│   │   ├── mataKuliah.js    # Routes untuk mata kuliah
│   │   ├── menu.js          # Routes untuk menu sidebar
│   │   └── prodi.js         # Routes untuk program studi
│   ├── index.js             # Entry point server
│   └── package.json         # Dependencies backend
│
├── frontend-apps/            # Frontend User Applications
│   ├── public/              # Assets statis
│   │   ├── documents/       # Dokumen PDF (daftar mata kuliah)
│   │   ├── icons/           # Icon untuk card dan sidebar
│   │   └── images/          # Gambar (banner, dll)
│   ├── src/
│   │   ├── components/      # Komponen React reusable
│   │   │   ├── Layout/      # Layout components (Header, Sidebar)
│   │   │   ├── Breadcrumb.js
│   │   │   └── LoadingSpinner.js
│   │   ├── pages/           # Halaman aplikasi
│   │   │   ├── Homepage.js
│   │   │   ├── AcademicCalendar.js
│   │   │   ├── CourseList.js
│   │   │   └── ...
│   │   ├── App.js           # Router utama
│   │   ├── index.js         # Entry point React
│   │   └── index.css        # Global styles
│   └── package.json         # Dependencies frontend
│
├── frontend-cms/            # Frontend CMS (akan dibuat nanti)
│   └── (Content Management System untuk admin)
│
├── database/                # Database
│   └── schema.sql           # MySQL schema dan sample data
│
└── docs/                    # Dokumentasi
    ├── ARCHITECTURE.md      # Dokumentasi arsitektur
    ├── IMK_IMPROVEMENTS.md  # Dokumentasi perbaikan IMK/HCI
    ├── PROJECT_SUMMARY.md   # Ringkasan project
    └── ...
```

## Pemisahan Concerns

### Backend (`backend/`)
- **Tujuan**: Menyediakan REST API untuk semua frontend
- **Teknologi**: Node.js + Express + MySQL
- **Port**: 5000 (default)
- **Fungsi**:
  - Menyediakan data untuk frontend-apps
  - Akan menyediakan data untuk frontend-cms (nanti)
  - Mengelola database MySQL
  - Authentication & Authorization (jika diperlukan)

### Frontend Apps (`frontend-apps/`)
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

## Scripts

### Root `package.json`
```json
{
  "dev": "Menjalankan backend + frontend-apps secara bersamaan",
  "server": "Menjalankan backend saja",
  "frontend-apps": "Menjalankan frontend-apps saja",
  "install-all": "Install dependencies untuk semua bagian"
}
```

### Backend (`backend/package.json`)
- Scripts untuk menjalankan server API

### Frontend Apps (`frontend-apps/package.json`)
- Scripts untuk development dan build React app

## Port Configuration

- **Backend API**: `http://localhost:5000`
- **Frontend Apps**: `http://localhost:3000`
- **Frontend CMS**: `http://localhost:3001` (akan dibuat nanti)

## Development Workflow

1. **Setup awal**:
   ```bash
   npm run install-all
   ```

2. **Development**:
   ```bash
   # Jalankan semua (backend + frontend-apps)
   npm run dev
   
   # Atau jalankan terpisah
   npm run server        # Backend saja
   npm run frontend-apps # Frontend apps saja
   ```

3. **Production**:
   - Build frontend-apps: `cd frontend-apps && npm run build`
   - Deploy backend dan frontend secara terpisah

## Catatan Penting

- **Backend** adalah single source of truth untuk semua data
- **Frontend Apps** dan **Frontend CMS** adalah client yang berbeda dengan tujuan berbeda
- **Database** adalah shared resource untuk semua aplikasi
- Struktur ini memungkinkan pengembangan yang terpisah dan scalable
