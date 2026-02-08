#  Panduan Setup dan Instalasi

Dokumentasi ini menjelaskan langkah-langkah untuk setup proyek PIAM dari awal sampai bisa dijalankan.

##  Prasyarat

Sebelum mulai, pastikan sudah terinstall:

- **Node.js** (versi 14 atau lebih baru) - [Download di sini](https://nodejs.org/)
- **MySQL** (versi 5.7 atau lebih baru) - [Download di sini](https://dev.mysql.com/downloads/)
- **Git** (opsional, untuk clone repository) - [Download di sini](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download di sini](https://code.visualstudio.com/)

##  Langkah 1: Clone/Download Proyek

Jika menggunakan Git:
```bash
git clone <repository-url>
cd baak
```

Atau download dan extract file ZIP proyek.

##  Langkah 2: Install Dependencies

### Opsi A: Install Semua Sekaligus (Recommended)

```bash
npm run install-all
```

Script ini akan otomatis install dependencies di:
- Root folder
- `backend/server/`
- `frontend/app/`

### Opsi B: Install Manual

```bash
# 1. Install di root
npm install

# 2. Install backend dependencies
cd backend/server
npm install

# 3. Install frontend dependencies
cd ../../frontend/app
npm install
```

##  Langkah 3: Setup Database

### 3.1 Buat Database

Buka MySQL (via command line atau phpMyAdmin) dan buat database:

```sql
CREATE DATABASE piam_db;
```

### 3.2 Import Schema

Import file schema database:

```bash
# Via command line
mysql -u root -p piam_db < database/schema.sql

# Atau via phpMyAdmin:
# 1. Pilih database piam_db
# 2. Klik tab "Import"
# 3. Pilih file database/schema.sql
# 4. Klik "Go"
```

### 3.3 Jalankan Migration (Opsional)

Jika perlu menambahkan fitur role:

```bash
mysql -u root -p piam_db < database/migrations/add_role_to_cms_users.sql
```

##  Langkah 4: Konfigurasi Environment

### 4.1 Buat File .env di Backend

Buat file `.env` di folder `backend/server/`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=piam_db

# Server Configuration
PORT=5000

# JWT Secret (ganti dengan string random yang aman!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

** Penting**: 
- Ganti `your_mysql_password` dengan password MySQL kamu
- Ganti `JWT_SECRET` dengan string random yang aman (bisa pakai generator online)

### 4.2 Cek Proxy di Frontend

File `frontend/app/package.json` sudah ada konfigurasi proxy:
```json
"proxy": "http://localhost:5000"
```

Ini sudah benar, jadi tidak perlu diubah kecuali port backend berbeda.

##  Langkah 5: Buat Admin User

### Opsi A: Via Script (Recommended)

```bash
cd backend/server
node scripts/create-admin-user.js
```

Script ini akan:
- Membuat user admin dengan username: `admin`
- Password: `admin123`
- Role: `super_admin` (setelah migration)

### Opsi B: Manual via SQL

```sql
-- Generate password hash dulu (jalankan di terminal):
-- node -e "const bcrypt=require('bcrypt');bcrypt.hash('admin123',10).then(h=>console.log(h));"

-- Lalu insert ke database:
INSERT INTO cms_users (username, password_hash, nama, email, role, aktif) 
VALUES (
  'admin', 
  '$2b$10$conjTZMAsqiDW.NH3fXDdufQThe5TvgLO07n7UMNDSBaCS9p1VKsa', 
  'Administrator', 
  'admin@university.ac.id', 
  'super_admin', 
  TRUE
);
```

##  Langkah 6: Jalankan Aplikasi

### Opsi A: Jalankan Bersamaan (Recommended)

Di root folder:
```bash
npm run dev
```

Ini akan menjalankan:
- Backend di `http://localhost:5000`
- Frontend di `http://localhost:3000`

### Opsi B: Jalankan Terpisah

**Terminal 1 - Backend:**
```bash
cd backend/server
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend/app
npm start
```

##  Verifikasi Setup

### 1. Cek Backend
Buka browser dan akses:
```
http://localhost:5000/health
```

Harusnya muncul:
```json
{
  "status": "OK",
  "message": "PIAM API Server is running"
}
```

### 2. Cek Frontend
Buka browser dan akses:
```
http://localhost:3000
```

Harusnya muncul homepage PIAM.

### 3. Test Login CMS
1. Buka `http://localhost:3000/cms/login`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Harusnya redirect ke dashboard CMS

##  Troubleshooting

### Error: Cannot connect to database
-  Cek MySQL sudah running
-  Cek credentials di `.env` sudah benar
-  Cek database `piam_db` sudah dibuat

### Error: Port already in use
-  Cek port 5000 dan 3000 tidak digunakan aplikasi lain
-  Kill process yang menggunakan port tersebut
-  Atau ubah PORT di `.env`

### Error: Module not found
-  Pastikan sudah `npm install` di semua folder
-  Hapus `node_modules` dan `package-lock.json`, lalu install ulang

### Error: JWT verification failed
-  Cek JWT_SECRET di `.env` sudah di-set
-  Pastikan JWT_SECRET sama antara saat login dan saat verify

### Frontend tidak bisa connect ke backend
-  Cek backend sudah running di port 5000
-  Cek proxy di `frontend/app/package.json` sudah benar
-  Cek CORS sudah di-enable di backend

##  Catatan Penting

1. **Password Default**: Ganti password admin sebelum production!
2. **JWT Secret**: Jangan commit file `.env` ke repository
3. **Database**: Backup database secara berkala
4. **Port**: Pastikan port 3000 dan 5000 tidak digunakan aplikasi lain

##  Selesai!

Jika semua langkah berhasil, aplikasi sudah siap digunakan. Selamat coding! 
