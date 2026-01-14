# Panduan Rename Folder

## Overview

Untuk memisahkan frontend dan backend dengan jelas, folder perlu di-rename:

- `client/` → `frontend-apps/` (Aplikasi SPA untuk mahasiswa)
- `server/` → `backend/` (Backend API Server)

## Langkah Rename

### 1. Rename Folder `client` ke `frontend-apps`

**Windows (PowerShell):**
```powershell
# Pastikan tidak ada proses yang menggunakan folder
# Tutup semua terminal dan IDE yang membuka folder client
Move-Item "client" "frontend-apps"
```

**Linux/Mac:**
```bash
mv client frontend-apps
```

### 2. Rename Folder `server` ke `backend` (Opsional)

**Windows (PowerShell):**
```powershell
Move-Item "server" "backend"
```

**Linux/Mac:**
```bash
mv server backend
```

### 3. Update Scripts di `package.json`

Scripts sudah di-update untuk menggunakan `frontend-apps`. Jika folder `server` di-rename menjadi `backend`, update juga:

```json
{
  "scripts": {
    "server": "cd backend && node index.js"
  }
}
```

### 4. Update Konfigurasi Lain

Setelah rename, pastikan:
- ✅ `package.json` root sudah di-update
- ✅ Dokumentasi sudah di-update
- ✅ `.gitignore` tidak perlu diubah (menggunakan pattern)
- ✅ File konfigurasi lain yang mereferensi path

## Struktur Setelah Rename

```
baak/
├── backend/              # Backend API (dari server/)
├── frontend-apps/        # Frontend User Apps (dari client/)
├── frontend-cms/         # Frontend CMS (akan dibuat nanti)
├── database/             # Database schema
└── docs/                 # Dokumentasi
```

## Catatan

- Jika ada proses yang masih menggunakan folder lama, tutup dulu sebelum rename
- Setelah rename, restart development server
- Pastikan semua path di dokumentasi sudah di-update
