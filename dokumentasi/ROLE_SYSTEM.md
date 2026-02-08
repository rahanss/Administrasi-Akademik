#  Sistem Role dan Keamanan

Dokumentasi lengkap tentang sistem role, autentikasi, dan keamanan di PIAM.

##  Role yang Tersedia

Sistem menggunakan 2 level role:

### 1. Super Admin (`super_admin`)

**Akses Penuh** ke semua fitur CMS:
-  Konten: Berita, Halaman, Layanan
-  Master Data: Program Studi, Dosen, Mata Kuliah
-  Struktur: Kategori, Menu
-  Akademik: Koordinator, Dosen PI, Jadwal (Kelas, Kuliah, Ujian)

**Digunakan untuk:**
- Administrator utama
- Developer/IT yang manage sistem
- User yang perlu akses penuh

### 2. Admin (`admin`)

**Akses Terbatas** hanya untuk konten:
-  Konten: Berita, Halaman, Layanan
-  Master Data: Tidak bisa akses
-  Struktur: Tidak bisa akses
-  Akademik: Tidak bisa akses

**Digunakan untuk:**
- Content editor
- Staff yang hanya manage konten
- User yang tidak perlu akses data master

##  Authentication System

### JWT (JSON Web Token)

Sistem menggunakan JWT untuk authentication karena:
- Stateless (tidak perlu session di server)
- Secure (signed dengan secret key)
- Expire time (7 hari)

### Login Flow

```
1. User input username & password
   ↓
2. POST /api/cms/auth/login
   ↓
3. Backend verify credentials
   ↓
4. Generate JWT token
   ↓
5. Return token + user info
   ↓
6. Frontend store token di localStorage
   ↓
7. Token digunakan untuk request berikutnya
```

### Token Storage

Token disimpan di `localStorage` dengan key:
- `cms_token` - JWT token
- `cms_user` - User info (JSON string)

### Token Validation

Setiap request ke CMS route:
1. Frontend attach token di header: `Authorization: Bearer <token>`
2. Backend middleware `requireAuth` verify token
3. Jika valid → extract user info → continue
4. Jika invalid → return 401 → frontend redirect ke login

##  Authorization (Role-Based Access)

### Middleware Stack

```
Request → requireAuth → requireSuperAdmin → Route Handler
```

### requireAuth Middleware

**Fungsi:**
- Verify JWT token
- Extract user info dari token
- Attach user ke `req.user`
- Reject jika token invalid

**Dilindungi:**
- Semua route `/api/cms/*` (kecuali `/api/cms/auth/login`)

### requireSuperAdmin Middleware

**Fungsi:**
- Cek `req.user.role === 'super_admin'`
- Reject jika bukan super admin (return 403)

**Dilindungi:**
- `/api/cms/menu`
- `/api/cms/kategori`
- `/api/cms/dosen`
- `/api/cms/prodi`
- `/api/cms/mata-kuliah`
- `/api/cms/koordinator`
- `/api/cms/dosen-pembimbing-pi`
- `/api/cms/jadwal-*`

##  Data Privacy

### Dosen Data Privacy

**Public (Mahasiswa):**
-  Bisa lihat: Nama, Email, Jabatan, Program Studi
-  Tidak bisa lihat: NIP, Telepon

**Admin CMS:**
-  Bisa lihat: Semua data termasuk NIP dan Telepon

**Implementasi:**
- Backend filter data berdasarkan token
- Jika ada token valid → return semua data
- Jika tidak ada token → return data terbatas

### Cara Kerja

1. Frontend fetch `/api/dosen`
2. Axios interceptor attach token (jika ada)
3. Backend check token:
   - Ada token → `isCmsAdmin = true` → return semua data
   - Tidak ada token → `isCmsAdmin = false` → return data terbatas
4. Frontend render sesuai data yang diterima

##  Database Schema

### Tabel cms_users

```sql
CREATE TABLE cms_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    nama VARCHAR(255),
    email VARCHAR(255),
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Password Hashing

Password di-hash menggunakan **bcrypt** dengan salt rounds 10:
- Password tidak pernah disimpan plain text
- Hash tidak bisa di-reverse
- Secure untuk production

##  Setup Role System

### 1. Jalankan Migration

```sql
-- File: database/migrations/add_role_to_cms_users.sql
ALTER TABLE cms_users 
ADD COLUMN role ENUM('admin', 'super_admin') DEFAULT 'admin';

UPDATE cms_users SET role = 'super_admin' WHERE username = 'admin';
```

### 2. Buat User Baru

#### Super Admin

```sql
-- Generate password hash dulu:
-- node -e "const bcrypt=require('bcrypt');bcrypt.hash('password',10).then(h=>console.log(h));"

INSERT INTO cms_users (username, password_hash, nama, email, role, aktif) 
VALUES (
  'superadmin', 
  '$2b$10$...hash...', 
  'Super Admin', 
  'superadmin@university.ac.id', 
  'super_admin', 
  TRUE
);
```

#### Admin Biasa

```sql
INSERT INTO cms_users (username, password_hash, nama, email, role, aktif) 
VALUES (
  'editor', 
  '$2b$10$...hash...', 
  'Content Editor', 
  'editor@university.ac.id', 
  'admin',  -- Default role
  TRUE
);
```

### 3. Update Role User

```sql
-- Update user menjadi super admin
UPDATE cms_users SET role = 'super_admin' WHERE username = 'editor';

-- Update user menjadi admin biasa
UPDATE cms_users SET role = 'admin' WHERE username = 'superadmin';
```

## 🧪 Testing Role System

### Test Super Admin

1. Login sebagai super admin
2. Cek semua menu muncul di sidebar
3. Cek bisa akses semua route CMS
4. Cek bisa lihat NIP dosen

### Test Admin Biasa

1. Login sebagai admin biasa
2. Cek hanya menu "Konten" yang muncul
3. Cek tidak bisa akses route master data (403 error)
4. Cek bisa lihat NIP dosen (karena sudah login CMS)

### Test Public

1. Tidak login (atau logout)
2. Cek tidak bisa akses `/cms/*` (redirect ke login)
3. Cek tidak bisa lihat NIP dosen di daftar dosen

##  Security Best Practices

1. **Password Policy**
   - Minimal 8 karakter
   - Kombinasi huruf, angka, simbol
   - Ganti password berkala

2. **JWT Secret**
   - Gunakan string random yang panjang
   - Jangan commit ke repository
   - Ganti secara berkala

3. **Token Expiration**
   - Token berlaku 7 hari
   - Auto logout jika token expired
   - Refresh token (bisa ditambahkan nanti)

4. **HTTPS**
   - Gunakan HTTPS di production
   - JWT token lebih aman via HTTPS

5. **Rate Limiting**
   - Bisa ditambahkan untuk prevent brute force
   - Limit login attempts

##  Troubleshooting

### Error: Unauthorized (401)
-  Cek token masih valid (belum expired)
-  Cek token sudah ter-attach di request
-  Cek JWT_SECRET di backend sudah benar

### Error: Forbidden (403)
-  Cek role user sudah sesuai
-  Cek route memerlukan super_admin
-  Cek user sudah login dengan benar

### Tidak bisa lihat NIP dosen
-  Cek sudah login sebagai admin CMS
-  Cek token sudah ter-attach di request
-  Cek backend sudah return data lengkap

### Menu tidak muncul
-  Cek role user (admin biasa tidak bisa lihat menu master)
-  Cek user sudah login
-  Refresh browser

##  Catatan Penting

1. **Default Role**: User baru default role adalah `admin`
2. **Role Update**: Hanya super admin yang bisa update role (via database)
3. **Token Security**: Jangan share token dengan orang lain
4. **Logout**: Selalu logout setelah selesai menggunakan CMS
5. **Password**: Ganti password default sebelum production

---

**Tips Keamanan**: 
- Jangan commit file `.env` ke repository
- Gunakan password yang kuat
- Backup database secara berkala
- Monitor aktivitas user jika perlu

Stay secure! 
