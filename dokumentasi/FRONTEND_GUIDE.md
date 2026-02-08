#  Panduan Frontend

Dokumentasi lengkap tentang struktur dan cara kerja frontend PIAM.

##  Struktur Folder

```
frontend/app/src/
 components/          # Komponen yang bisa dipakai ulang
    Layout/         # Layout utama untuk public pages
       Layout.js   # Layout wrapper dengan Header & Sidebar
       Header.js   # Header dengan logo dan search
       Sidebar.js  # Sidebar dinamis berdasarkan modul
       Layout.css
   
    CmsLayout/      # Layout khusus untuk CMS
       CmsLayout.js
       CmsLayout.css
   
    Breadcrumb.js   # Navigasi breadcrumb
    LoadingSpinner.js  # Spinner loading
    ProtectedRoute.js  # Route protection untuk CMS

 pages/              # Halaman-halaman aplikasi
    Homepage.js     # Halaman utama dengan cards
    LecturerList.js # Daftar dosen dengan search
    CourseList.js   # Daftar mata kuliah
    NewsList.js     # Daftar berita
    NewsPage.js     # Detail berita
    ContentPage.js  # Halaman konten dinamis
    cms/           # Halaman CMS (admin)
        CmsLogin.js
        CmsBerita.js
        CmsHalaman.js
        ...

 utils/              # Utility functions
    axiosConfig.js  # Konfigurasi axios dengan interceptors

 App.js              # Router utama - semua routing di sini
 index.js            # Entry point - import axiosConfig di sini
```

##  Routing System

Aplikasi menggunakan **React Router v6** untuk navigasi.

### Public Routes

Semua route public dibungkus dengan `<Layout />`:

```javascript
<Route path="/" element={<Layout />}>
  <Route index element={<Homepage />} />
  <Route path="daftar-dosen-wali" element={<LecturerList />} />
  <Route path="berita/:slug" element={<NewsPage />} />
  // ... routes lainnya
</Route>
```

### CMS Routes

Route CMS dibungkus dengan `<ProtectedRoute>` dan `<CmsLayout>`:

```javascript
<Route path="/cms" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}>
  <Route path="berita" element={<CmsBerita />} />
  <Route path="dosen" element={<CmsDosen />} />
  // ... routes lainnya
</Route>
```

### Catch-All Route

Route `/:slug` untuk halaman konten dinamis:

```javascript
<Route path=":slug" element={<ContentPage />} />
```

## 🧩 Komponen Utama

### Layout Component

Komponen wrapper untuk semua halaman public.

**Fitur:**
- Header dengan logo dan search
- Sidebar dinamis (muncul/hilang berdasarkan route)
- Breadcrumb navigation
- Responsive design

**Props:**
- Tidak ada props (menggunakan `useLocation` untuk detect route)

### Sidebar Component

Sidebar yang muncul di halaman akademik dan panduan.

**Fitur:**
- Fetch menu dari API berdasarkan `currentModule`
- Highlight menu aktif
- Icon untuk setiap menu
- Responsive (hide di mobile)

**Props:**
- `currentModule` - 'akademik', 'panduan', atau 'layanan'

### ProtectedRoute Component

Komponen untuk protect CMS routes.

**Cara kerja:**
1. Cek token di localStorage
2. Validasi token dengan API `/api/cms/auth/me`
3. Jika valid → render children
4. Jika invalid → redirect ke `/cms/login`

##  Halaman Utama

### Homepage

**Fitur:**
- Kalender akademik (hardcoded untuk sekarang)
- Cards navigasi (hardcoded)
- Berita terbaru (fetch dari API)
- Tabel pelayanan loket BAAK

**Data Fetching:**
- Berita: `GET /api/berita?limit=3`

### LecturerList (Daftar Dosen)

**Fitur:**
- Search bar untuk filter dosen
- Grid layout untuk card dosen
- Filter berdasarkan: nama, NIP, prodi, email, jabatan

**Data Fetching:**
- `GET /api/dosen` (dengan token jika admin)

**Privacy:**
- Public: Hanya nama, email, jabatan, prodi
- Admin: Semua data termasuk NIP dan telepon

### CourseList (Daftar Mata Kuliah)

**Fitur:**
- List program studi
- Expandable list mata kuliah per prodi
- Download PDF FRS (jika ada)

**Data Fetching:**
- `GET /api/prodi`
- `GET /api/mata-kuliah/prodi/:prodiId`

##  CMS Pages

### CmsLogin

Halaman login untuk CMS.

**Fitur:**
- Form login dengan username & password
- Error handling
- Loading state
- Tombol kembali ke homepage

**Flow:**
1. User input username & password
2. POST ke `/api/cms/auth/login`
3. Simpan token & user info ke localStorage
4. Redirect ke `/cms/berita`

### CmsBerita, CmsDosen, dll

Halaman CRUD untuk masing-masing resource.

**Struktur umum:**
- Header dengan title dan tombol "Tambah"
- Table dengan data
- Modal untuk create/edit
- Delete dengan confirmation

**Edit Only Mode:**
- Menu dan Halaman: Hanya bisa edit, tidak bisa tambah baru
- Tombol "Tambah" sudah dihapus
- Pesan info: "Mode Edit Only"

##  Styling

### CSS Organization

- Setiap komponen punya file CSS sendiri
- Menggunakan CSS variables untuk konsistensi
- Responsive dengan media queries

### Color Scheme

```css
--primary-color: #1e40af;      /* Biru utama */
--text-primary: #374151;      /* Teks utama */
--text-secondary: #6b7280;    /* Teks sekunder */
--surface-color: #ffffff;     /* Background card */
--border-color: #e5e7eb;      /* Border */
```

### Typography

- Font: Inter (atau system font fallback)
- Sizes: Menggunakan rem untuk scalability

##  State Management

### Local State (useState)

Setiap komponen manage state sendiri:
- Loading state
- Data state
- Form state
- Error state

### Global State (localStorage)

- `cms_token` - JWT token untuk CMS
- `cms_user` - User info (username, role, dll)

### Data Fetching Pattern

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

##  Utility Functions

### axiosConfig.js

**Fungsi:**
- Auto-attach token ke request CMS
- Auto-attach token ke request `/api/dosen` (untuk admin)
- Handle 401 error → auto logout

**Cara kerja:**
- Interceptor memodifikasi axios instance global
- Import di `index.js` agar terpasang sebelum komponen lain

##  Best Practices

1. **Component Reusability** - Komponen dibuat reusable
2. **Error Handling** - Try-catch di setiap async function
3. **Loading States** - Tampilkan loading saat fetch data
4. **Empty States** - Tampilkan pesan jika data kosong
5. **Responsive Design** - Mobile-friendly dengan media queries
6. **Accessibility** - ARIA labels, semantic HTML
7. **Code Organization** - File terorganisir dengan baik

##  Common Issues & Solutions

### Issue: Token tidak ter-attach
**Solution**: Pastikan `axiosConfig.js` di-import di `index.js`

### Issue: CORS error
**Solution**: Cek backend sudah enable CORS dan proxy di package.json

### Issue: Route tidak bekerja
**Solution**: Cek route sudah terdaftar di `App.js` dan path sudah benar

### Issue: Data tidak muncul
**Solution**: 
- Cek console untuk error
- Cek network tab untuk request/response
- Cek backend sudah running

##  Responsive Design

Aplikasi responsive dengan breakpoints:
- Desktop: > 768px
- Tablet: 768px - 1024px
- Mobile: < 768px

Media queries digunakan untuk:
- Hide/show sidebar di mobile
- Adjust grid columns
- Font size adjustments

---

**Tips**: Gunakan React DevTools untuk debug component state dan props. Happy coding! 
