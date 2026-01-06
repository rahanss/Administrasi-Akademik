# Arsitektur PIAM - Single Page Application

## Overview

PIAM adalah Single Page Application (SPA) untuk sistem informasi akademik universitas yang dibangun dengan React di frontend dan Node.js/Express di backend, menggunakan MySQL sebagai database.

## Prinsip Arsitektur

### 1. Hybrid SPA Navigation Pattern

Aplikasi menggunakan pola navigasi hybrid:

- **Homepage**: Card System untuk navigasi utama
- **Modul Akademik & Panduan**: Sidebar Kiri + Konten Kanan (Dynamic)

### 2. No Page Reload

- Semua navigasi menggunakan React Router
- Tidak ada full page reload
- Header dan Sidebar tetap di tempat
- Hanya konten kanan yang berubah

### 3. Content Management

- Semua konten akademik disimpan di MySQL sebagai TEXT/LONGTEXT
- Konten dapat berformat HTML
- Tidak menggunakan PDF untuk konten utama

## Struktur Frontend

```
client/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.js       # Layout utama dengan Header + Sidebar
│   │   │   ├── Layout.css
│   │   │   ├── Header.js       # Header global dengan search
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.js      # Sidebar dinamis berdasarkan modul
│   │   │   └── Sidebar.css
│   │   ├── Breadcrumb.js       # Navigasi breadcrumb (HCI)
│   │   ├── Breadcrumb.css
│   │   ├── Loading.js          # Komponen loading (HCI)
│   │   └── Loading.css
│   ├── pages/
│   │   ├── Homepage.js         # Dashboard dengan card system
│   │   ├── AcademicCalendar.js # Kalender akademik (narrative)
│   │   ├── CourseList.js       # Daftar mata kuliah per prodi
│   │   ├── LecturerList.js     # Daftar dosen
│   │   ├── ClassSchedule.js    # Jadwal kuliah
│   │   ├── ExamSchedule.js     # Jadwal ujian
│   │   ├── AdministrationGuide.js # Panduan administrasi
│   │   ├── ServiceInformation.js  # Informasi layanan
│   │   └── ContentPage.js      # Halaman konten dinamis
│   ├── App.js                  # Router configuration
│   └── index.js                # Entry point
```

## 🎨 Aspek HCI (Human-Computer Interaction)

Aplikasi ini dirancang dengan mempertimbangkan prinsip-prinsip IMK/HCI untuk memberikan pengalaman pengguna yang optimal:

### Komponen HCI Utama
- **Breadcrumb Navigation**: Memberikan orientasi spatial kepada pengguna
- **Loading States**: Feedback visual saat aplikasi memuat data
- **Search Functionality**: Pencarian cepat berdasarkan keyword
- **Consistent Typography**: Font Inter dengan ukuran optimal
- **CSS Variables**: Sistem warna dan spacing yang konsisten

### Prinsip Nielsen yang Diterapkan
1. **Visibility of System Status**: Loading spinner dan pesan
2. **User Control and Freedom**: Breadcrumb dan search untuk navigasi
3. **Consistency and Standards**: CSS variables untuk tampilan seragam
4. **Error Prevention**: Validasi input dan feedback visual
5. **Recognition Rather Than Recall**: Ikon dan struktur navigasi familiar

## Struktur Backend

```
server/
├── config/
│   └── database.js             # MySQL connection pool
├── routes/
│   ├── index.js                # Route aggregator
│   ├── halaman.js              # CRUD halaman konten
│   ├── menu.js                 # Menu sidebar
│   ├── prodi.js                # Program studi
│   ├── mataKuliah.js           # Mata kuliah
│   ├── dosen.js                # Dosen
│   ├── jadwal.js               # Jadwal kuliah & ujian
│   └── layanan.js              # Informasi layanan
└── index.js                     # Express server
```

## Database Schema

### Tabel Utama

1. **kategori_konten**: Kategori konten (Akademik, Panduan, Layanan)
2. **menu_sidebar**: Menu sidebar dengan tipe (akademik, panduan)
3. **halaman_konten**: Konten halaman dengan HTML/LONGTEXT
4. **prodi**: Program studi (D3, S1, dll)
5. **mata_kuliah**: Mata kuliah per program studi
6. **dosen**: Data dosen
7. **jadwal_kuliah**: Jadwal perkuliahan
8. **jadwal_ujian**: Jadwal ujian
9. **layanan**: Informasi layanan kampus

## Routing Flow

### Homepage (`/`)
- Menampilkan card navigasi
- Tidak ada sidebar
- Klik card → navigasi ke modul dengan sidebar

### Modul Akademik (`/kalender-akademik`, `/daftar-mata-kuliah`, dll)
- Sidebar kiri muncul dengan menu akademik
- Konten kanan berubah berdasarkan route
- Sidebar tetap, tidak reload

### Modul Panduan (`/panduan/:slug`)
- Sidebar kiri dengan menu panduan
- Konten dinamis dari database
- Navigasi silang antar panduan

## Komponen Kunci

### Layout Component
- Mengatur struktur global (Header + Sidebar + Content)
- Menentukan apakah sidebar ditampilkan berdasarkan route
- Menentukan modul aktif (akademik/panduan)

### Sidebar Component
- Dinamis berdasarkan `currentModule`
- Fetch menu dari API berdasarkan tipe
- Highlight menu aktif berdasarkan route

### Content Pages
- Fetch konten dari API berdasarkan slug
- Render HTML dengan `dangerouslySetInnerHTML`
- Navigasi silang ke halaman terkait

## API Endpoints

### Halaman Konten
- `GET /api/halaman` - Semua halaman
- `GET /api/halaman/:slug` - Halaman by slug
- `GET /api/halaman/menu/:menuSlug` - Halaman by menu

### Menu
- `GET /api/menu/:tipe` - Menu by tipe (akademik/panduan)
- `GET /api/menu/slug/:slug` - Menu by slug

### Program Studi
- `GET /api/prodi` - Semua program studi
- `GET /api/prodi/:id` - Program studi by id

### Mata Kuliah
- `GET /api/mata-kuliah` - Semua mata kuliah
- `GET /api/mata-kuliah/prodi/:prodiId` - Mata kuliah by prodi (grouped by semester)

### Dosen
- `GET /api/dosen` - Semua dosen
- `GET /api/dosen/:id` - Dosen by id

### Jadwal
- `GET /api/jadwal/kuliah` - Jadwal kuliah (dengan filter semester/tahun)
- `GET /api/jadwal/ujian` - Jadwal ujian (dengan filter semester/tahun/jenis)

### Layanan
- `GET /api/layanan` - Semua layanan
- `GET /api/layanan/:slug` - Layanan by slug

## State Management

Aplikasi menggunakan React Hooks untuk state management:

- `useState` untuk state lokal komponen
- `useEffect` untuk side effects (fetch data)
- `useNavigate` untuk navigasi programmatic
- `useLocation` untuk tracking route saat ini
- `useParams` untuk mendapatkan route parameters

## Styling

- CSS Modules per komponen
- Warna utama: Biru institusi (#1e40af)
- Card putih dengan shadow ringan
- Responsive design dengan media queries
- Tipografi akademik yang nyaman dibaca

## Fitur Utama

### 1. Kalender Akademik
- Konten naratif panjang (bukan hanya tabel)
- Disimpan sebagai HTML di database
- Card navigasi terkait di bawah konten

### 2. Daftar Mata Kuliah
- List expandable per program studi
- Detail mata kuliah dikelompokkan per semester
- Navigasi SPA tanpa reload

### 3. Jadwal Kuliah & Ujian
- Filter berdasarkan semester dan tahun akademik
- Tabel waktu kuliah (jam ke-1 sampai jam ke-10)
- Grouping berdasarkan hari/tanggal

### 4. Panduan Administrasi
- Konten internal SPA (bukan PDF)
- Sidebar tetap untuk navigasi
- Navigasi silang antar panduan

### 5. Informasi Layanan
- Card grid dengan informasi lengkap
- Lokasi, kontak, jam operasional
- Icon untuk setiap layanan

## Keamanan

- Input validation di backend
- SQL injection prevention dengan parameterized queries
- CORS configuration untuk API
- Environment variables untuk sensitive data

## Performance

- Lazy loading untuk komponen besar (jika diperlukan)
- Optimized database queries dengan indexes
- CSS optimization dengan minimal re-renders
- Efficient React Router navigation

## Maintenance

- Struktur modular untuk mudah di-maintain
- Separation of concerns (frontend/backend/database)
- Clear naming conventions
- Comprehensive documentation


