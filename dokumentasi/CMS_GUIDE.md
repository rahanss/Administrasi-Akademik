#  Panduan CMS (Content Management System)

Dokumentasi lengkap tentang cara menggunakan CMS untuk mengelola konten website.

##  Cara Login CMS

1. Buka browser dan akses: `http://localhost:3000/cms/login`
2. Masukkan username dan password
3. Klik tombol "Login"
4. Jika berhasil, akan redirect ke dashboard CMS

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

 **Penting**: Ganti password default sebelum production!

##  Sistem Role

CMS memiliki 2 level role dengan akses yang berbeda:

### Super Admin (`super_admin`)

**Akses Penuh:**
-  Konten: Berita, Halaman, Layanan
-  Master Data: Program Studi, Dosen, Mata Kuliah
-  Struktur: Kategori, Menu
-  Akademik: Koordinator, Dosen PI, Jadwal (Kelas, Kuliah, Ujian)

**Menu yang muncul:**
- Semua menu di sidebar CMS

### Admin (`admin`)

**Akses Terbatas:**
-  Konten: Berita, Halaman, Layanan
-  Master Data: Tidak bisa akses
-  Struktur: Tidak bisa akses
-  Akademik: Tidak bisa akses

**Menu yang muncul:**
- Hanya menu "Konten" (Berita, Halaman, Layanan)

##  Fitur CMS

### 1. Berita

**Lokasi**: `/cms/berita`

**Fitur:**
-  Tambah berita baru
-  Edit berita yang sudah ada
-  Hapus berita
-  Set berita sebagai featured
-  Publish/Unpublish berita

**Field yang bisa diisi:**
- Judul (wajib)
- Slug (auto-generate dari judul jika kosong)
- Ringkasan
- Konten (HTML)
- Gambar (URL)
- Published (checkbox)
- Featured (checkbox)

**Tips:**
- Slug digunakan untuk URL, jadi harus unique
- Konten bisa pakai HTML untuk formatting
- Featured berita akan muncul di homepage

### 2. Halaman (Edit Only)

**Lokasi**: `/cms/halaman`

**Fitur:**
-  Edit halaman yang sudah ada
-  Hapus halaman
-  **Tidak bisa tambah halaman baru** (Edit Only Mode)

**Field yang bisa diisi:**
- Judul (wajib)
- Slug
- Menu (pilih dari dropdown)
- Kategori (pilih dari dropdown)
- Konten (HTML - wajib)
- Tipe Konten (narrative, list, table, card)
- Meta Deskripsi (untuk SEO)
- Published (checkbox)

**Catatan:**
- Mode Edit Only untuk mencegah merusak struktur website
- Hanya bisa edit halaman yang sudah ada
- Konten HTML bisa di-edit untuk update informasi

### 3. Layanan

**Lokasi**: `/cms/layanan`

**Fitur:**
-  Tambah layanan baru
-  Edit layanan
-  Hapus layanan
-  Set urutan tampilan

**Field yang bisa diisi:**
- Nama (wajib)
- Slug
- Deskripsi (wajib)
- Lokasi
- Telepon
- Email
- Jam Operasional
- Icon (nama icon)
- Urutan (untuk sorting)
- Aktif (checkbox)

### 4. Program Studi (Super Admin Only)

**Lokasi**: `/cms/prodi`

**Fitur:**
-  Tambah program studi baru
-  Edit program studi
-  Hapus program studi
-  Set aktif/nonaktif

**Field:**
- Kode (wajib, unique)
- Nama (wajib)
- Jenjang (D3, S1, S2, S3)
- Deskripsi
- Aktif (checkbox)

### 5. Dosen (Super Admin Only)

**Lokasi**: `/cms/dosen`

**Fitur:**
-  Tambah dosen baru
-  Edit dosen
-  Hapus dosen
-  Set aktif/nonaktif

**Field:**
- NIP (wajib, unique)
- Nama (wajib)
- Gelar Depan
- Gelar Belakang
- Program Studi (dropdown)
- Email
- Telepon
- Jabatan
- Aktif (checkbox)

**Privacy:**
- NIP dan telepon hanya bisa dilihat admin CMS
- Public hanya melihat nama, email, jabatan, prodi

### 6. Mata Kuliah (Super Admin Only)

**Lokasi**: `/cms/mata-kuliah`

**Fitur:**
-  Tambah mata kuliah baru
-  Edit mata kuliah
-  Hapus mata kuliah

**Field:**
- Program Studi (wajib)
- Kode (wajib)
- Nama (wajib)
- SKS (wajib)
- Semester (wajib)
- Deskripsi
- Prasyarat
- Aktif (checkbox)

### 7. Menu (Super Admin Only - Edit Only)

**Lokasi**: `/cms/menu`

**Fitur:**
-  Edit menu yang sudah ada
-  Hapus menu
-  **Tidak bisa tambah menu baru** (Edit Only Mode)

**Field:**
- Nama (wajib)
- Slug
- Tipe (akademik, panduan, layanan)
- Kategori (dropdown)
- Parent (untuk sub-menu)
- Urutan
- Icon (nama icon)

**Catatan:**
- Mode Edit Only untuk mencegah merusak struktur sidebar
- Hanya bisa edit menu yang sudah ada

### 8. Kategori (Super Admin Only)

**Lokasi**: `/cms/kategori`

**Fitur:**
-  Tambah kategori baru
-  Edit kategori
-  Hapus kategori

**Field:**
- Nama (wajib)
- Slug
- Deskripsi
- Icon

### 9. Jadwal (Super Admin Only)

Ada 3 jenis jadwal:
- **Jadwal Kelas** (`/cms/jadwal-kelas`)
- **Jadwal Kuliah** (`/cms/jadwal-kuliah`)
- **Jadwal Ujian** (`/cms/jadwal-ujian`)

Semua punya fitur CRUD lengkap.

##  Keamanan

### Authentication

- Login menggunakan JWT token
- Token disimpan di localStorage
- Token berlaku 7 hari
- Auto logout jika token invalid

### Authorization

- Role-based access control
- Super Admin: Akses penuh
- Admin: Akses terbatas
- Middleware protect routes

### Data Privacy

- NIP dan telepon dosen hanya untuk admin
- Public tidak bisa akses data sensitif

##  Workflow Umum

### Menambah Berita Baru

1. Login ke CMS
2. Klik menu "Berita"
3. Klik tombol "Tambah Berita"
4. Isi form:
   - Judul: "Pengumuman UTS"
   - Ringkasan: "UTS akan dilaksanakan..."
   - Konten: HTML lengkap
   - Published:  Centang
5. Klik "Simpan"
6. Berita langsung muncul di frontend

### Mengedit Halaman

1. Login ke CMS
2. Klik menu "Halaman"
3. Cari halaman yang mau di-edit
4. Klik tombol "Edit"
5. Ubah konten HTML
6. Klik "Simpan"
7. Perubahan langsung terlihat di frontend

### Menambah Dosen Baru (Super Admin)

1. Login sebagai Super Admin
2. Klik menu "Dosen"
3. Klik "Tambah Dosen"
4. Isi form lengkap termasuk NIP
5. Klik "Simpan"
6. Dosen muncul di daftar (admin bisa lihat NIP, public tidak)

##  Mode Edit Only

Beberapa fitur menggunakan **Edit Only Mode**:

- **Menu**: Hanya bisa edit, tidak bisa tambah baru
- **Halaman**: Hanya bisa edit, tidak bisa tambah baru

**Alasan:**
- Mencegah merusak struktur website
- Menu baru tidak otomatis muncul di homepage
- Halaman baru tidak bisa diakses dengan benar

**Solusi:**
- Edit konten yang sudah ada untuk update informasi
- Jika perlu fitur baru, hubungi developer untuk update kode

##  Tips & Best Practices

1. **Backup Data**: Backup database sebelum edit besar-besaran
2. **Test di Development**: Test perubahan di development dulu
3. **Validasi Input**: Pastikan data yang di-input sudah benar
4. **Slug Unik**: Pastikan slug unique untuk menghindari konflik
5. **HTML Konten**: Gunakan HTML yang valid untuk konten
6. **Published Status**: Unpublish konten yang tidak perlu ditampilkan

##  Troubleshooting

### Tidak bisa login
-  Cek username dan password sudah benar
-  Cek user sudah aktif di database
-  Cek backend sudah running

### Menu tidak muncul
-  Cek role user (admin biasa tidak bisa akses menu master)
-  Cek user sudah login dengan benar
-  Refresh browser

### Data tidak tersimpan
-  Cek semua field wajib sudah diisi
-  Cek console untuk error message
-  Cek backend sudah running

### Tidak bisa edit
-  Cek role user (beberapa fitur hanya untuk super admin)
-  Cek item sudah ada di database
-  Cek token masih valid

---

**Catatan**: CMS ini dirancang untuk mudah digunakan, tapi tetap hati-hati saat edit data penting. Selalu backup dulu sebelum edit besar! 
