# Dokumentasi PIAM - Pusat Informasi Akademik Mahasiswa

## Tentang Proyek

PIAM adalah sistem informasi akademik berbasis web yang dibangun untuk memudahkan mahasiswa dalam mengakses informasi akademik seperti jadwal kuliah, daftar dosen, mata kuliah, dan berbagai informasi akademik lainnya.

Proyek ini dibuat sebagai tugas mata kuliah Pemrograman Web dengan menggunakan teknologi modern seperti React untuk frontend dan Node.js/Express untuk backend.

## Teknologi yang Digunakan

### Frontend
- **React 18.2.0** - Library untuk membangun user interface yang interaktif
- **React Router DOM 6.20.0** - Untuk navigasi antar halaman tanpa reload
- **Axios 1.6.2** - Library untuk melakukan HTTP request ke backend
- **React Scripts 5.0.1** - Tools untuk build dan development

### Backend
- **Express.js 4.18.2** - Framework web untuk Node.js
- **MySQL2 3.6.5** - Driver untuk koneksi ke database MySQL
- **JWT (JSON Web Token) 9.0.3** - Untuk autentikasi dan autorisasi
- **bcrypt 6.0.0** - Untuk enkripsi password
- **CORS 2.8.5** - Untuk mengizinkan request dari frontend
- **dotenv 16.3.1** - Untuk mengelola environment variables

### Database
- **MySQL** - Database relasional untuk menyimpan data

## Struktur Proyek

```
baak/
 backend/              # Backend API Server
    server/
        config/       # Konfigurasi (database, dll)
        routes/       # API Routes
        scripts/      # Script utility (create user, dll)
        index.js      # Entry point server

 frontend/             # Frontend React App
    app/
        src/
           components/   # Komponen reusable
           pages/        # Halaman-halaman aplikasi
           utils/        # Utility functions
           App.js        # Router utama
        public/       # Assets statis (icons, images, documents)

 database/             # Database schema dan migrations
    schema.sql        # Schema database lengkap
    migrations/       # File migration untuk update database

 dokumentasi/          # Dokumentasi proyek (folder ini)
```

## Quick Start

### 1. Install Dependencies

```bash
# Install semua dependencies sekaligus
npm run install-all

# Atau install manual per folder
npm install                    # Root
cd backend/server && npm install
cd ../../frontend/app && npm install
```

### 2. Setup Database

1. Buat database MySQL:
```sql
CREATE DATABASE piam_db;
```

2. Import schema:
```bash
mysql -u root -p piam_db < database/schema.sql
```

3. Jalankan migration (jika perlu):
```bash
mysql -u root -p piam_db < database/migrations/add_role_to_cms_users.sql
```

### 3. Setup Environment Variables

Buat file `.env` di `backend/server/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=piam_db
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Buat Admin User

```bash
cd backend/server
node scripts/create-admin-user.js
```

Default credentials:
- Username: `admin`
- Password: `admin123`

### 5. Jalankan Aplikasi

```bash
# Jalankan backend dan frontend bersamaan
npm run dev

# Atau jalankan terpisah
npm run backend      # Backend di port 5000
npm run frontend-apps # Frontend di port 3000
```

## Dokumentasi Lengkap

- **[SETUP.md](./SETUP.md)** - Panduan instalasi dan setup lengkap
- **[ARSITEKTUR.md](./ARSITEKTUR.md)** - Arsitektur sistem dan struktur kode
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Dokumentasi API endpoints
- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Panduan frontend dan komponen
- **[CMS_GUIDE.md](./CMS_GUIDE.md)** - Panduan penggunaan CMS
- **[ROLE_SYSTEM.md](./ROLE_SYSTEM.md)** - Sistem role dan keamanan
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Struktur database

## Fitur Utama

### Untuk Mahasiswa (Public)
- Homepage dengan kalender akademik
- Daftar mata kuliah per program studi
- Daftar dosen (tanpa NIP dan telepon)
- Jadwal kuliah dan ujian
- Informasi layanan kampus
- Berita dan pengumuman
- Panduan administrasi

### Untuk Admin CMS
- Manajemen konten (Berita, Halaman, Layanan)
- Manajemen data master (Dosen, Prodi, Mata Kuliah)
- Manajemen jadwal (Kelas, Kuliah, Ujian)
- Sistem role (Super Admin & Admin)
- Edit Only mode untuk Menu & Halaman

## Sistem Keamanan

- JWT Authentication untuk CMS
- Role-based access control (Super Admin & Admin)
- Password hashing dengan bcrypt
- Data privacy (NIP dosen hanya untuk admin)
- Protected routes dengan middleware

## Catatan Penting

1. **Password Default**: Ganti password admin sebelum production!
2. **JWT Secret**: Ganti JWT_SECRET di environment variables
3. **Database**: Backup database secara berkala
4. **Edit Only**: Menu dan Halaman hanya bisa edit, tidak bisa tambah baru

## Kontribusi

Proyek ini dibuat untuk keperluan akademik. Jika ada saran atau perbaikan, silakan buat issue atau pull request.

## License

Proyek ini dibuat untuk keperluan akademik.

---

**Dibuat untuk memudahkan akses informasi akademik**
