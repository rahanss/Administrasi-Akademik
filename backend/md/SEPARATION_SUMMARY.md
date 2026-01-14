# Ringkasan Pemisahan Frontend dan Backend

## Perubahan yang Sudah Dilakukan

### 1. Update `package.json` Root
✅ Scripts sudah di-update:
- `frontend-apps`: Menggantikan `client`
- `server`: Tetap menggunakan `server` (bisa di-rename ke `backend` nanti)

### 2. Update Dokumentasi
✅ Semua file dokumentasi sudah di-update:
- `README.md` - Struktur project
- `ARCHITECTURE.md` - Arsitektur dengan pemisahan jelas
- `INSTALLATION.md` - Instalasi dengan path baru
- `QUICKSTART.md` - Quick start guide
- `PROJECT_STRUCTURE.md` - Dokumentasi struktur lengkap (BARU)
- `RENAME_GUIDE.md` - Panduan rename folder (BARU)

### 3. Update `.gitignore`
✅ Menambahkan pattern untuk folder baru:
- `frontend-apps/node_modules/`
- `frontend-cms/node_modules/`
- `backend/node_modules/`
- Tetap support legacy `client/` dan `server/` untuk transisi

## Struktur yang Diharapkan

```
baak/
├── backend/              # Backend API Server (dari server/)
│   ├── config/
│   ├── routes/
│   └── index.js
│
├── frontend-apps/        # Frontend User Applications (dari client/)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── frontend-cms/         # Frontend CMS (akan dibuat nanti)
│   └── (Content Management System untuk admin)
│
├── database/             # Database schema
└── docs/                 # Dokumentasi
```

## Yang Perlu Dilakukan Manual

### 1. Rename Folder `client` ke `frontend-apps`

**Penting**: Tutup semua terminal, IDE, dan proses yang menggunakan folder `client` terlebih dahulu!

**Windows (PowerShell):**
```powershell
# Pastikan tidak ada proses yang menggunakan folder
Move-Item "client" "frontend-apps"
```

**Linux/Mac:**
```bash
mv client frontend-apps
```

### 2. (Opsional) Rename Folder `server` ke `backend`

Jika ingin konsistensi penamaan:

**Windows (PowerShell):**
```powershell
Move-Item "server" "backend"
```

**Linux/Mac:**
```bash
mv server backend
```

**Jika rename `server` ke `backend`, update juga:**
- `package.json` root: `"server": "cd backend && node index.js"`
- Semua referensi di dokumentasi

### 3. Verifikasi

Setelah rename, test dengan:
```bash
npm run install-all
npm run dev
```

## Konsep Pemisahan

### Backend (`backend/` atau `server/`)
- **Tujuan**: REST API untuk semua frontend
- **Port**: 5000
- **Fungsi**: 
  - Menyediakan data untuk frontend-apps
  - Akan menyediakan data untuk frontend-cms (nanti)
  - Shared API untuk semua aplikasi

### Frontend Apps (`frontend-apps/`)
- **Tujuan**: Aplikasi SPA untuk pengguna (mahasiswa)
- **Port**: 3000
- **Fungsi**: User-facing interface, tidak perlu login

### Frontend CMS (`frontend-cms/`)
- **Tujuan**: Content Management System untuk admin
- **Status**: Akan dibuat nanti
- **Port**: 3001 (rencana)
- **Fungsi**: CRUD konten, memerlukan authentication

### Database (`database/`)
- **Tujuan**: Shared database untuk semua aplikasi
- **Teknologi**: MySQL

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

## Manfaat Pemisahan

1. **Scalability**: Setiap bagian bisa di-deploy terpisah
2. **Maintainability**: Kode terorganisir dengan jelas
3. **Team Collaboration**: Tim bisa bekerja di bagian berbeda
4. **Future-proof**: Mudah menambah frontend CMS nanti
5. **Clear Separation**: Backend sebagai single source of truth

## Status

- ✅ Dokumentasi sudah di-update
- ✅ Scripts sudah di-update
- ✅ `.gitignore` sudah di-update
- ⏳ Folder rename perlu dilakukan manual (tutup proses yang menggunakan folder dulu)

## Next Steps

1. Tutup semua proses yang menggunakan folder `client`
2. Rename folder `client` ke `frontend-apps`
3. (Opsional) Rename folder `server` ke `backend`
4. Test dengan `npm run dev`
5. Buat folder `frontend-cms/` ketika siap membuat CMS
