#  Dokumentasi API

Dokumentasi lengkap untuk semua API endpoints di sistem PIAM.

##  Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

##  Authentication

### CMS Authentication

CMS menggunakan **JWT (JSON Web Token)** untuk authentication.

**Cara mendapatkan token:**
1. POST ke `/api/cms/auth/login` dengan username & password
2. Backend return token
3. Attach token di header: `Authorization: Bearer <token>`

**Token berlaku**: 7 hari

##  Public API Endpoints

### Berita

#### GET `/api/berita`
Mendapatkan semua berita yang published.

**Query Parameters:**
- `limit` (optional) - Limit jumlah berita (contoh: `?limit=5`)
- `featured` (optional) - Filter berita featured (`?featured=true`)

**Response:**
```json
[
  {
    "id": 1,
    "judul": "Judul Berita",
    "slug": "judul-berita",
    "ringkasan": "Ringkasan berita...",
    "gambar": "path/to/image.jpg",
    "created_at": "2025-01-01T00:00:00.000Z",
    "featured": true
  }
]
```

#### GET `/api/berita/:slug`
Mendapatkan detail berita berdasarkan slug.

**Response:**
```json
{
  "id": 1,
  "judul": "Judul Berita",
  "slug": "judul-berita",
  "ringkasan": "Ringkasan...",
  "konten": "<p>Konten lengkap...</p>",
  "gambar": "path/to/image.jpg",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

### Dosen

#### GET `/api/dosen`
Mendapatkan semua dosen aktif.

**Query Parameters:**
- `prodi_id` (optional) - Filter berdasarkan program studi

**Response (Public):**
```json
[
  {
    "id": 1,
    "nama": "Dr. Ahmad Susanto, M.Kom",
    "gelar_depan": "Dr.",
    "gelar_belakang": "M.Kom",
    "email": "ahmad@university.ac.id",
    "jabatan": "Dosen Tetap",
    "prodi_nama": "Informatika",
    "prodi_kode": "S1-IF"
    // NIP dan telepon TIDAK termasuk untuk public
  }
]
```

**Response (Admin CMS - dengan token):**
```json
[
  {
    "id": 1,
    "nip": "198501012010121001",
    "nama": "Ahmad Susanto",
    "gelar_depan": "Dr.",
    "gelar_belakang": "M.Kom",
    "email": "ahmad@university.ac.id",
    "telepon": "081234567890",
    "jabatan": "Dosen Tetap",
    "prodi_id": 1,
    "prodi_nama": "Informatika",
    "prodi_kode": "S1-IF"
    // Semua data termasuk NIP dan telepon
  }
]
```

#### GET `/api/dosen/:id`
Mendapatkan detail dosen berdasarkan ID.

**Response:** Sama seperti GET `/api/dosen` tapi single object.

### Program Studi

#### GET `/api/prodi`
Mendapatkan semua program studi aktif.

**Response:**
```json
[
  {
    "id": 1,
    "kode": "S1-IF",
    "nama": "Informatika",
    "jenjang": "S1",
    "deskripsi": "Program studi...",
    "aktif": true
  }
]
```

#### GET `/api/prodi/:id`
Mendapatkan detail program studi berdasarkan ID.

### Mata Kuliah

#### GET `/api/mata-kuliah`
Mendapatkan semua mata kuliah.

**Response:**
```json
[
  {
    "id": 1,
    "kode": "IF101",
    "nama": "Pemrograman Dasar",
    "sks": 3,
    "semester": 1,
    "prodi_id": 1,
    "prodi_nama": "Informatika",
    "deskripsi": "Mata kuliah dasar..."
  }
]
```

#### GET `/api/mata-kuliah/:id`
Mendapatkan detail mata kuliah berdasarkan ID.

#### GET `/api/mata-kuliah/prodi/:prodiId`
Mendapatkan mata kuliah berdasarkan program studi.

### Jadwal

#### GET `/api/jadwal/kuliah`
Mendapatkan jadwal kuliah.

**Query Parameters:**
- `semester` (optional) - Filter semester
- `tahun_akademik` (optional) - Filter tahun akademik

**Response:**
```json
[
  {
    "id": 1,
    "mata_kuliah": "Pemrograman Dasar",
    "hari": "Senin",
    "jam_mulai": "08:00:00",
    "jam_selesai": "10:00:00",
    "ruang": "E341",
    "kampus": "D",
    "semester": "Ganjil",
    "tahun_akademik": "2025/2026"
  }
]
```

#### GET `/api/jadwal/ujian`
Mendapatkan jadwal ujian.

**Query Parameters:**
- `semester` (optional)
- `tahun_akademik` (optional)
- `jenis` (optional) - UTS, UAS, atau UTS-UAS

### Layanan

#### GET `/api/layanan`
Mendapatkan semua layanan aktif.

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Bagian Akademik",
    "slug": "bagian-akademik",
    "deskripsi": "Layanan administrasi...",
    "lokasi": "Gedung Rektorat Lantai 1",
    "telepon": "(021) 1234-5678",
    "email": "akademik@university.ac.id",
    "jam_operasional": "Senin - Jumat: 08:00 - 16:00"
  }
]
```

#### GET `/api/layanan/:slug`
Mendapatkan detail layanan berdasarkan slug.

### Halaman Konten

#### GET `/api/halaman`
Mendapatkan semua halaman yang published.

#### GET `/api/halaman/:slug`
Mendapatkan halaman berdasarkan slug.

#### GET `/api/halaman/menu/:menuSlug`
Mendapatkan halaman berdasarkan menu.

### Menu

#### GET `/api/menu/:tipe`
Mendapatkan menu berdasarkan tipe (akademik, panduan, layanan).

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Jadwal Kelas",
    "slug": "jadwal-kelas",
    "tipe": "akademik",
    "urutan": 1,
    "icon": "schedule"
  }
]
```

##  CMS API Endpoints (Protected)

Semua endpoint di bawah ini memerlukan **JWT token** di header:
```
Authorization: Bearer <token>
```

### Authentication

#### POST `/api/cms/auth/login`
Login ke CMS.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "email": "admin@university.ac.id",
    "role": "super_admin"
  }
}
```

#### GET `/api/cms/auth/me`
Mendapatkan informasi user yang sedang login.

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "email": "admin@university.ac.id",
    "role": "super_admin"
  }
}
```

### Berita (CMS)

#### GET `/api/cms/berita`
Mendapatkan semua berita (termasuk yang tidak published).

#### GET `/api/cms/berita/:id`
Mendapatkan detail berita.

#### POST `/api/cms/berita`
Membuat berita baru.

**Request Body:**
```json
{
  "judul": "Judul Berita",
  "slug": "judul-berita",
  "ringkasan": "Ringkasan...",
  "konten": "<p>Konten lengkap...</p>",
  "gambar": "path/to/image.jpg",
  "published": true,
  "featured": false
}
```

#### PUT `/api/cms/berita/:id`
Update berita.

#### DELETE `/api/cms/berita/:id`
Hapus berita.

### Halaman (CMS) - Edit Only

#### GET `/api/cms/halaman`
Mendapatkan semua halaman.

#### GET `/api/cms/halaman/:id`
Mendapatkan detail halaman.

#### PUT `/api/cms/halaman/:id`
Update halaman (Edit Only - tidak bisa create baru).

#### DELETE `/api/cms/halaman/:id`
Hapus halaman.

### Menu (CMS) - Super Admin Only - Edit Only

#### GET `/api/cms/menu`
Mendapatkan semua menu.

#### GET `/api/cms/menu/:id`
Mendapatkan detail menu.

#### PUT `/api/cms/menu/:id`
Update menu (Edit Only).

#### DELETE `/api/cms/menu/:id`
Hapus menu.

### Dosen (CMS) - Super Admin Only

#### GET `/api/cms/dosen`
Mendapatkan semua dosen.

#### GET `/api/cms/dosen/:id`
Mendapatkan detail dosen.

#### POST `/api/cms/dosen`
Membuat dosen baru.

**Request Body:**
```json
{
  "nip": "198501012010121001",
  "nama": "Ahmad Susanto",
  "gelar_depan": "Dr.",
  "gelar_belakang": "M.Kom",
  "prodi_id": 1,
  "email": "ahmad@university.ac.id",
  "telepon": "081234567890",
  "jabatan": "Dosen Tetap",
  "aktif": true
}
```

#### PUT `/api/cms/dosen/:id`
Update dosen.

#### DELETE `/api/cms/dosen/:id`
Hapus dosen.

### Program Studi (CMS) - Super Admin Only

#### GET `/api/cms/prodi`
Mendapatkan semua program studi.

#### POST `/api/cms/prodi`
Membuat program studi baru.

#### PUT `/api/cms/prodi/:id`
Update program studi.

#### DELETE `/api/cms/prodi/:id`
Hapus program studi.

### Mata Kuliah (CMS) - Super Admin Only

#### GET `/api/cms/mata-kuliah`
Mendapatkan semua mata kuliah.

#### POST `/api/cms/mata-kuliah`
Membuat mata kuliah baru.

#### PUT `/api/cms/mata-kuliah/:id`
Update mata kuliah.

#### DELETE `/api/cms/mata-kuliah/:id`
Hapus mata kuliah.

##  Response Format

### Success Response
```json
{
  "data": [...],
  // atau langsung array/object
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (role tidak cukup)
- `404` - Not Found
- `500` - Internal Server Error

##  Query Parameters

### Pagination (jika diperlukan)
```
?page=1&limit=10
```

### Filtering
```
?prodi_id=1
?semester=Ganjil
?tahun_akademik=2025/2026
```

### Sorting (jika diperlukan)
```
?sort=created_at&order=desc
```

## 🧪 Testing API

### Menggunakan cURL

```bash
# Test public endpoint
curl http://localhost:5000/api/berita

# Test dengan token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/cms/berita
```

### Menggunakan Postman

1. Import collection (jika ada)
2. Set base URL: `http://localhost:5000/api`
3. Untuk protected routes, set header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`

##  Catatan Penting

1. **Rate Limiting**: Belum diimplementasikan (bisa ditambahkan nanti)
2. **Pagination**: Beberapa endpoint belum ada pagination
3. **Filtering**: Beberapa endpoint sudah support filtering
4. **Validation**: Input validation dilakukan di backend
5. **Error Handling**: Semua error di-handle dengan try-catch

---

**Tips**: Untuk testing API, bisa pakai Postman, Insomnia, atau langsung dari browser untuk GET requests. Happy coding! 
