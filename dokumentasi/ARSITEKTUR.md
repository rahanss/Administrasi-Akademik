#  Arsitektur Sistem PIAM

Dokumentasi ini menjelaskan arsitektur dan struktur sistem PIAM secara detail.

##  Overview Arsitektur

PIAM menggunakan arsitektur **Client-Server** dengan pemisahan yang jelas antara frontend dan backend:

```
         HTTP/REST API         
   Frontend       Backend   
   (React)            Port 3000              (Express)  
                                              Port 5000  
                               
                                                     
                                                      MySQL
                                                     
                                              
                                                Database   
                                                 (MySQL)   
                                              
```

##  Frontend Architecture

### Struktur Folder

```
frontend/app/src/
 components/          # Komponen reusable
    Layout/         # Layout utama (Header, Sidebar)
    CmsLayout/      # Layout khusus CMS
    Breadcrumb.js   # Navigasi breadcrumb
    LoadingSpinner.js

 pages/              # Halaman-halaman aplikasi
    Homepage.js     # Halaman utama
    LecturerList.js # Daftar dosen
    CourseList.js   # Daftar mata kuliah
    cms/           # Halaman CMS (admin)

 utils/              # Utility functions
    axiosConfig.js  # Konfigurasi axios dengan interceptors

 App.js              # Router utama
 index.js            # Entry point
```

### Routing Structure

Aplikasi menggunakan **React Router** dengan struktur routing:

```
/ (Homepage)
 /jadwal-kelas
 /kalender-akademik
 /daftar-mata-kuliah
 /daftar-dosen-wali
 /koordinator-mata-kuliah
 /dosen-pembimbing-pi
 /jadwal-kuliah
 /jadwal-ujian
 /informasi-layanan
 /formulir-rencana-studi
 /ujian-bentrok
 /berita
 /panduan-administrasi
 /:slug (catch-all untuk halaman dinamis)

/cms (CMS Admin)
 /cms/login
 /cms/* (protected routes)
     /cms/berita
     /cms/halaman
     /cms/layanan
     ... (sesuai role)
```

### State Management

Aplikasi menggunakan **React Hooks** untuk state management:
- `useState` - untuk state lokal komponen
- `useEffect` - untuk side effects (fetch data, dll)
- `useNavigate` - untuk navigasi programmatic
- `useLocation` - untuk tracking route saat ini
- `useParams` - untuk mendapatkan route parameters

### Data Fetching

- Menggunakan **Axios** untuk HTTP requests
- Axios interceptor untuk auto-attach token CMS
- Error handling terpusat di interceptor

##  Backend Architecture

### Struktur Folder

```
backend/server/
 config/
    database.js      # Konfigurasi koneksi MySQL

 routes/              # API Routes
    index.js        # Route aggregator
    cms.js          # CMS routes (protected)
    berita.js       # Public berita routes
    dosen.js        # Public dosen routes
    ... (routes lainnya)

 scripts/             # Utility scripts
    create-admin-user.js

 index.js            # Entry point server
```

### API Structure

```
/api
 /cms                # CMS routes (JWT protected)
    /auth/login     # Login (public)
    /auth/me        # Get current user (protected)
    /berita         # CRUD berita
    /halaman        # CRUD halaman
    ... (master data)

 /berita             # Public berita routes
 /dosen              # Public dosen routes (filtered)
 /prodi              # Public prodi routes
 ... (public routes)
```

### Middleware Stack

1. **CORS** - Enable cross-origin requests
2. **express.json()** - Parse JSON body
3. **express.urlencoded()** - Parse URL-encoded body
4. **requireAuth** - JWT authentication middleware
5. **requireSuperAdmin** - Role-based access middleware

##  Database Architecture

### Tabel Utama

1. **cms_users** - User untuk login CMS
2. **kategori_konten** - Kategori konten
3. **menu_sidebar** - Menu sidebar dengan hierarki
4. **halaman_konten** - Konten halaman dinamis
5. **prodi** - Program studi
6. **mata_kuliah** - Mata kuliah
7. **dosen** - Data dosen
8. **jadwal_kuliah** - Jadwal perkuliahan
9. **jadwal_ujian** - Jadwal ujian
10. **berita** - Berita dan pengumuman
11. **layanan** - Informasi layanan kampus

### Relasi Database

- `menu_sidebar` → `kategori_konten` (many-to-one)
- `menu_sidebar` → `menu_sidebar` (self-reference untuk parent)
- `halaman_konten` → `menu_sidebar` (many-to-one)
- `mata_kuliah` → `prodi` (many-to-one)
- `dosen` → `prodi` (many-to-one)
- `jadwal_kuliah` → `mata_kuliah` (many-to-one)
- `jadwal_ujian` → `mata_kuliah` (many-to-one)

##  Security Architecture

### Authentication Flow

```
1. User login → POST /api/cms/auth/login
2. Backend verify credentials → Generate JWT
3. Frontend store token → localStorage
4. Request berikutnya → Attach token via interceptor
5. Backend verify token → Middleware requireAuth
6. Grant access → Return data
```

### Authorization (Role-Based)

- **Super Admin**: Akses penuh ke semua fitur
- **Admin**: Hanya bisa akses konten (Berita, Halaman, Layanan)
- Middleware `requireSuperAdmin` untuk protect route tertentu

### Data Privacy

- NIP dan telepon dosen hanya untuk admin CMS
- Public route filter data sebelum return
- Token validation di setiap request protected

##  Data Flow

### Contoh: Menampilkan Daftar Dosen

```
1. User buka /daftar-dosen-wali
   ↓
2. LecturerList.js mount → useEffect trigger
   ↓
3. Axios GET /api/dosen
   ↓
4. Axios interceptor → Attach token (jika ada)
   ↓
5. Backend dosen.js → Check token
   ↓
6. Jika admin → Return semua data (dengan NIP)
   Jika public → Return data terbatas (tanpa NIP)
   ↓
7. Frontend receive data → setState
   ↓
8. Render component → Tampilkan data
```

##  Build & Deployment

### Development
- Frontend: `npm start` (port 3000, hot reload)
- Backend: `npm start` atau `npm run dev` (port 5000)

### Production Build
```bash
cd frontend/app
npm run build
```

Build output di `frontend/app/build/` - static files siap deploy.

##  Design Patterns

1. **Component-Based Architecture** - React components yang reusable
2. **RESTful API** - Backend menggunakan REST principles
3. **Middleware Pattern** - Express middleware untuk auth, error handling
4. **Repository Pattern** - Database queries terpisah di routes
5. **Single Page Application (SPA)** - No page reload, smooth navigation

##  Performance Considerations

- **Database Indexing** - Index pada kolom yang sering di-query
- **Connection Pooling** - MySQL connection pool untuk efisiensi
- **Lazy Loading** - Komponen dimuat saat diperlukan
- **Caching** - Browser cache untuk static assets
- **Optimized Queries** - SELECT hanya kolom yang diperlukan

##  Best Practices yang Diterapkan

1.  Separation of Concerns (Frontend/Backend/Database)
2.  Environment Variables untuk config
3.  Error Handling di setiap layer
4.  Input Validation di backend
5.  SQL Injection Prevention (parameterized queries)
6.  Password Hashing (bcrypt)
7.  JWT untuk stateless authentication
8.  CORS configuration
9.  Code organization yang rapi
10.  Consistent naming conventions

---

**Catatan**: Arsitektur ini dirancang untuk mudah di-maintain dan di-scale di masa depan. Jika ada pertanyaan, silakan cek dokumentasi lainnya atau tanyakan ke developer! 
