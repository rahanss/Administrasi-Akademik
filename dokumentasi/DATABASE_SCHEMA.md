#  Dokumentasi Database Schema

Dokumentasi lengkap tentang struktur database PIAM.

##  Overview

Database menggunakan **MySQL** dengan struktur relasional. Semua tabel menggunakan:
- `id` sebagai PRIMARY KEY (AUTO_INCREMENT)
- `created_at` dan `updated_at` untuk tracking waktu
- Index untuk performa query

##  Daftar Tabel

### 1. cms_users
Tabel untuk user yang bisa login ke CMS.

**Kolom:**
- `id` - Primary key
- `username` - Username untuk login (UNIQUE)
- `password_hash` - Password yang sudah di-hash dengan bcrypt
- `nama` - Nama lengkap user
- `email` - Email user
- `role` - Role user ('admin' atau 'super_admin')
- `aktif` - Status aktif (TRUE/FALSE)
- `created_at` - Waktu dibuat
- `updated_at` - Waktu terakhir di-update

**Index:**
- `idx_username` - Untuk lookup cepat
- `idx_role` - Untuk filter berdasarkan role
- `idx_aktif` - Untuk filter user aktif

### 2. kategori_konten
Kategori untuk mengelompokkan konten.

**Kolom:**
- `id` - Primary key
- `nama` - Nama kategori (contoh: "Akademik", "Panduan")
- `slug` - URL-friendly name (UNIQUE)
- `deskripsi` - Deskripsi kategori
- `icon` - Nama icon
- `created_at`, `updated_at`

**Relasi:**
- One-to-Many dengan `menu_sidebar`
- One-to-Many dengan `halaman_konten`

### 3. menu_sidebar
Menu yang muncul di sidebar website.

**Kolom:**
- `id` - Primary key
- `kategori_id` - Foreign key ke `kategori_konten`
- `parent_id` - Foreign key ke `menu_sidebar` (untuk sub-menu)
- `nama` - Nama menu
- `slug` - URL-friendly name (UNIQUE)
- `urutan` - Urutan tampilan
- `icon` - Nama icon
- `tipe` - Tipe menu ('akademik', 'panduan', 'layanan')
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `kategori_konten`
- Self-reference untuk parent menu (sub-menu)

**Index:**
- `idx_tipe` - Untuk filter berdasarkan tipe
- `idx_urutan` - Untuk sorting

### 4. halaman_konten
Halaman konten dinamis yang bisa di-edit via CMS.

**Kolom:**
- `id` - Primary key
- `menu_id` - Foreign key ke `menu_sidebar`
- `kategori_id` - Foreign key ke `kategori_konten`
- `judul` - Judul halaman
- `slug` - URL-friendly name (UNIQUE)
- `konten` - Konten HTML (LONGTEXT)
- `tipe_konten` - Tipe konten ('narrative', 'list', 'table', 'card')
- `meta_deskripsi` - Meta description untuk SEO
- `published` - Status publish (TRUE/FALSE)
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `menu_sidebar`
- Many-to-One dengan `kategori_konten`

**Index:**
- `idx_slug` - Untuk lookup cepat
- `idx_published` - Untuk filter published

### 5. prodi
Program studi (jurusan).

**Kolom:**
- `id` - Primary key
- `kode` - Kode program studi (UNIQUE, contoh: "S1-IF")
- `nama` - Nama program studi
- `jenjang` - Jenjang ('D3', 'S1', 'S2', 'S3')
- `deskripsi` - Deskripsi program studi
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Relasi:**
- One-to-Many dengan `mata_kuliah`
- One-to-Many dengan `dosen`

**Index:**
- `idx_jenjang` - Untuk filter berdasarkan jenjang
- `idx_aktif` - Untuk filter aktif

### 6. mata_kuliah
Mata kuliah per program studi.

**Kolom:**
- `id` - Primary key
- `prodi_id` - Foreign key ke `prodi` (NOT NULL)
- `kode` - Kode mata kuliah
- `nama` - Nama mata kuliah
- `sks` - Jumlah SKS
- `semester` - Semester (1-8)
- `deskripsi` - Deskripsi mata kuliah
- `prasyarat` - Mata kuliah prasyarat
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `prodi`
- One-to-Many dengan `jadwal_kuliah`
- One-to-Many dengan `jadwal_ujian`

**Index:**
- `idx_prodi` - Untuk filter berdasarkan prodi
- `idx_semester` - Untuk filter berdasarkan semester
- `idx_aktif` - Untuk filter aktif
- `unique_kode_prodi` - Unique constraint (kode + prodi_id)

### 7. dosen
Data dosen.

**Kolom:**
- `id` - Primary key
- `nip` - NIP dosen (UNIQUE)
- `nama` - Nama dosen
- `gelar_depan` - Gelar depan (contoh: "Dr.")
- `gelar_belakang` - Gelar belakang (contoh: "M.Kom")
- `prodi_id` - Foreign key ke `prodi`
- `email` - Email dosen
- `telepon` - Nomor telepon
- `jabatan` - Jabatan dosen
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `prodi`
- One-to-Many dengan `jadwal_kuliah` (dosen_id)
- One-to-Many dengan `jadwal_ujian` (dosen_id)

**Index:**
- `idx_prodi` - Untuk filter berdasarkan prodi
- `idx_aktif` - Untuk filter aktif

**Privacy:**
- NIP dan telepon hanya untuk admin CMS
- Public hanya melihat nama, email, jabatan, prodi

### 8. jadwal_kuliah
Jadwal perkuliahan.

**Kolom:**
- `id` - Primary key
- `mata_kuliah_id` - Foreign key ke `mata_kuliah` (NOT NULL)
- `dosen_id` - Foreign key ke `dosen`
- `hari` - Hari kuliah ('Senin', 'Selasa', dll)
- `jam_mulai` - Jam mulai (TIME)
- `jam_selesai` - Jam selesai (TIME)
- `ruang` - Ruang kuliah
- `kampus` - Kampus ('A', 'C', 'D', 'E', 'G', 'H')
- `semester` - Semester
- `tahun_akademik` - Tahun akademik (contoh: "2025/2026")
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `mata_kuliah`
- Many-to-One dengan `dosen`

**Index:**
- `idx_hari` - Untuk filter berdasarkan hari
- `idx_semester` - Untuk filter berdasarkan semester dan tahun

### 9. jadwal_ujian
Jadwal ujian (UTS/UAS).

**Kolom:**
- `id` - Primary key
- `mata_kuliah_id` - Foreign key ke `mata_kuliah` (NOT NULL)
- `dosen_id` - Foreign key ke `dosen`
- `jenis_ujian` - Jenis ('UTS', 'UAS', 'UTS-UAS')
- `tanggal` - Tanggal ujian (DATE)
- `jam_mulai` - Jam mulai (TIME)
- `jam_selesai` - Jam selesai (TIME)
- `ruang` - Ruang ujian
- `kampus` - Kampus
- `semester` - Semester
- `tahun_akademik` - Tahun akademik
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `mata_kuliah`
- Many-to-One dengan `dosen`

**Index:**
- `idx_tanggal` - Untuk filter berdasarkan tanggal
- `idx_jenis` - Untuk filter berdasarkan jenis
- `idx_semester` - Untuk filter berdasarkan semester dan tahun

### 10. jadwal_kelas
Jadwal kelas (format lama).

**Kolom:**
- `id` - Primary key
- `kelas` - Nama kelas
- `hari` - Hari
- `mata_kuliah` - Nama mata kuliah (VARCHAR, bukan FK)
- `waktu` - Waktu kuliah
- `ruang` - Ruang
- `dosen` - Nama dosen (VARCHAR, bukan FK)
- `semester` - Semester
- `tahun_akademik` - Tahun akademik
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Catatan:**
- Tabel ini menggunakan VARCHAR untuk dosen dan mata_kuliah (bukan FK)
- Bisa di-migrate ke struktur yang lebih normalized nanti

### 11. berita
Berita dan pengumuman.

**Kolom:**
- `id` - Primary key
- `judul` - Judul berita
- `slug` - URL-friendly name (UNIQUE)
- `ringkasan` - Ringkasan berita
- `konten` - Konten lengkap (LONGTEXT)
- `gambar` - URL gambar
- `published` - Status publish
- `featured` - Berita featured (muncul di homepage)
- `created_at`, `updated_at`

**Index:**
- `idx_slug` - Untuk lookup cepat
- `idx_published` - Untuk filter published
- `idx_featured` - Untuk filter featured
- `idx_created_at` - Untuk sorting

### 12. layanan
Informasi layanan kampus.

**Kolom:**
- `id` - Primary key
- `nama` - Nama layanan
- `slug` - URL-friendly name (UNIQUE)
- `deskripsi` - Deskripsi layanan (TEXT)
- `lokasi` - Lokasi layanan
- `telepon` - Nomor telepon
- `email` - Email
- `jam_operasional` - Jam operasional (TEXT)
- `icon` - Nama icon
- `urutan` - Urutan tampilan
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Index:**
- `idx_urutan` - Untuk sorting
- `idx_aktif` - Untuk filter aktif

### 13. koordinator_mata_kuliah
Koordinator mata kuliah per semester.

**Kolom:**
- `id` - Primary key
- `mata_kuliah` - Nama mata kuliah (VARCHAR)
- `kelas` - Kelas
- `dosen_id` - Foreign key ke `dosen`
- `dosen_nama` - Nama dosen (VARCHAR, untuk backup)
- `semester` - Semester ('Ganjil', 'Genap')
- `tahun_akademik` - Tahun akademik
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `dosen`

**Index:**
- Multiple index untuk performa query

### 14. dosen_pembimbing_pi
Dosen pembimbing Penulisan Ilmiah.

**Kolom:**
- `id` - Primary key
- `kelas` - Kelas
- `kelompok` - Kelompok
- `npm` - NPM mahasiswa
- `nama_mhs` - Nama mahasiswa
- `dosen_pembimbing` - Nama dosen pembimbing (VARCHAR)
- `dosen_id` - Foreign key ke `dosen`
- `semester` - Semester
- `tahun_akademik` - Tahun akademik
- `aktif` - Status aktif
- `created_at`, `updated_at`

**Relasi:**
- Many-to-One dengan `dosen`

##  Relasi Database

```
kategori_konten (1) < (N) menu_sidebar
kategori_konten (1) < (N) halaman_konten
menu_sidebar (1) < (N) halaman_konten
menu_sidebar (1) < (N) menu_sidebar (parent_id)

prodi (1) < (N) mata_kuliah
prodi (1) < (N) dosen

mata_kuliah (1) < (N) jadwal_kuliah
mata_kuliah (1) < (N) jadwal_ujian

dosen (1) < (N) jadwal_kuliah
dosen (1) < (N) jadwal_ujian
dosen (1) < (N) koordinator_mata_kuliah
dosen (1) < (N) dosen_pembimbing_pi
```

##  Index Strategy

Index dibuat untuk:
1. **Primary Keys** - Otomatis indexed
2. **Foreign Keys** - Untuk join yang cepat
3. **Frequently Queried Columns** - Seperti `slug`, `aktif`, `published`
4. **Sorting Columns** - Seperti `urutan`, `created_at`

##  Query Optimization

### Best Practices

1. **SELECT Specific Columns** - Jangan SELECT *
2. **Use Indexes** - Query kolom yang sudah di-index
3. **Limit Results** - Pakai LIMIT untuk pagination
4. **JOIN Efficiently** - Pakai INNER JOIN jika perlu
5. **Avoid N+1 Queries** - Pakai JOIN atau batch query

### Contoh Query Optimal

```sql
--  Good: Specific columns, use index
SELECT id, nama, email FROM dosen WHERE aktif = TRUE ORDER BY nama;

--  Bad: SELECT *, no index
SELECT * FROM dosen;
```

##  Migration

### Menambah Kolom Baru

```sql
ALTER TABLE nama_tabel 
ADD COLUMN kolom_baru VARCHAR(255) AFTER kolom_lama;
```

### Update Data

```sql
UPDATE nama_tabel 
SET kolom = 'value' 
WHERE kondisi;
```

### Backup Database

```bash
# Backup
mysqldump -u root -p piam_db > backup.sql

# Restore
mysql -u root -p piam_db < backup.sql
```

##  Catatan Penting

1. **Foreign Keys**: Beberapa tabel menggunakan ON DELETE CASCADE, hati-hati saat delete
2. **Unique Constraints**: Slug harus unique untuk menghindari konflik URL
3. **Boolean**: MySQL menggunakan TINYINT(1), TRUE = 1, FALSE = 0
4. **Timestamps**: `created_at` dan `updated_at` otomatis di-update
5. **LONGTEXT**: Digunakan untuk konten HTML yang panjang

---

**Tips**: Gunakan phpMyAdmin atau MySQL Workbench untuk visualisasi database. Lebih mudah untuk memahami relasi! 
