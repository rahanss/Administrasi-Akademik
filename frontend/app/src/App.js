// File utama untuk routing aplikasi PIAM
// Di sini kita define semua route yang ada di aplikasi
// React Router akan handle navigasi antar halaman tanpa reload browser
// 
// Struktur routing:
// - Public routes: Bisa diakses semua orang (mahasiswa)
// - CMS routes: Hanya bisa diakses admin yang sudah login
// - Protected routes: Dibungkus dengan ProtectedRoute component

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout components
import Layout from './components/Layout/Layout'; // Layout untuk public pages (dengan header & sidebar)
import CmsLayout from './components/CmsLayout/CmsLayout'; // Layout untuk CMS pages
import ProtectedRoute from './components/ProtectedRoute'; // Component untuk protect CMS routes

// Import Public Pages
import Homepage from './pages/Homepage';
import AcademicCalendar from './pages/AcademicCalendar';
import CourseList from './pages/CourseList';
import LecturerList from './pages/LecturerList';
import ClassSchedule from './pages/ClassSchedule';
import ExamSchedule from './pages/ExamSchedule';
import AdministrationGuide from './pages/AdministrationGuide';
import PanduanAdministrasi from './pages/PanduanAdministrasi';
import ServiceInformation from './pages/ServiceInformation';
import StudyPlanForm from './pages/StudyPlanForm';
import ExamConflict from './pages/ExamConflict';
import NewsPage from './pages/NewsPage';
import NewsList from './pages/NewsList';
import ContentPage from './pages/ContentPage';
import CoordinatorList from './pages/CoordinatorList';
import DosenPembimbingPI from './pages/DosenPembimbingPI';
import ClassScheduleSearch from './pages/ClassScheduleSearch';
import AboutUs from './pages/AboutUs';

// Import CMS Pages
import CmsLogin from './pages/cms/CmsLogin';
import CmsBerita from './pages/cms/CmsBerita';
import CmsHalaman from './pages/cms/CmsHalaman';
import CmsLayanan from './pages/cms/CmsLayanan';
import CmsProdi from './pages/cms/CmsProdi';
import CmsDosen from './pages/cms/CmsDosen';
import CmsMataKuliah from './pages/cms/CmsMataKuliah';
import CmsKategori from './pages/cms/CmsKategori';
import CmsMenu from './pages/cms/CmsMenu';
import CmsKoordinator from './pages/cms/CmsKoordinator';
import CmsDosenPI from './pages/cms/CmsDosenPI';
import CmsJadwalKelas from './pages/cms/CmsJadwalKelas';
import CmsJadwalKuliah from './pages/cms/CmsJadwalKuliah';
import CmsJadwalUjian from './pages/cms/CmsJadwalUjian';

function App() {
  return (
    // Router component - ini yang handle semua routing
    // future props untuk enable fitur React Router v7 (masih experimental)
    <Router
      future={{
        v7_startTransition: true, // Smooth transitions saat navigasi
        v7_relativeSplatPath: true // Better handling untuk nested routes
      }}
    >
      <Routes>
        {/* ============================================
            STANDALONE ROUTES (Tidak pakai Layout)
            ============================================ */}
        
        {/* About Us - halaman khusus tanpa layout */}
        <Route path="/about-us" element={<AboutUs />} />
        
        {/* CMS Login - halaman login tanpa layout CMS */}
        <Route path="/cms/login" element={<CmsLogin />} />
        
        {/* ============================================
            CMS ROUTES (Protected - Hanya untuk Admin)
            ============================================ */}
        {/* Semua route di bawah /cms dibungkus dengan ProtectedRoute */}
        {/* ProtectedRoute akan cek apakah user sudah login, kalau belum redirect ke login */}
        <Route path="/cms" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}>
          {/* Default route: redirect ke /cms/berita saat akses /cms */}
          <Route index element={<Navigate to="/cms/berita" replace />} />
          
          {/* CMS Routes - Semua route ini hanya bisa diakses admin yang sudah login */}
          {/* Menu yang muncul di sidebar CMS tergantung role user (super_admin vs admin) */}
          <Route path="berita" element={<CmsBerita />} /> {/* CRUD Berita */}
          <Route path="halaman" element={<CmsHalaman />} /> {/* Edit Halaman (Edit Only) */}
          <Route path="layanan" element={<CmsLayanan />} /> {/* CRUD Layanan */}
          
          {/* Routes di bawah ini hanya untuk Super Admin */}
          <Route path="prodi" element={<CmsProdi />} /> {/* CRUD Program Studi */}
          <Route path="dosen" element={<CmsDosen />} /> {/* CRUD Dosen */}
          <Route path="mata-kuliah" element={<CmsMataKuliah />} /> {/* CRUD Mata Kuliah */}
          <Route path="kategori" element={<CmsKategori />} /> {/* CRUD Kategori */}
          <Route path="menu" element={<CmsMenu />} /> {/* Edit Menu (Edit Only) */}
          <Route path="koordinator" element={<CmsKoordinator />} /> {/* CRUD Koordinator */}
          <Route path="dosen-pi" element={<CmsDosenPI />} /> {/* CRUD Dosen PI */}
          <Route path="jadwal-kelas" element={<CmsJadwalKelas />} /> {/* CRUD Jadwal Kelas */}
          <Route path="jadwal-kuliah" element={<CmsJadwalKuliah />} /> {/* CRUD Jadwal Kuliah */}
          <Route path="jadwal-ujian" element={<CmsJadwalUjian />} /> {/* CRUD Jadwal Ujian */}
        </Route>
        
        {/* ============================================
            PUBLIC ROUTES (Untuk Mahasiswa)
            ============================================ */}
        {/* Semua route di bawah ini dibungkus dengan Layout (Header + Sidebar) */}
        {/* Bisa diakses semua orang tanpa perlu login */}
        <Route path="/" element={<Layout />}>
          {/* Homepage - halaman utama */}
          <Route index element={<Homepage />} />
          
          {/* Routes Akademik */}
          <Route path="jadwal-kelas" element={<ClassScheduleSearch />} />
          <Route path="kalender-akademik" element={<AcademicCalendar />} />
          <Route path="daftar-mata-kuliah" element={<CourseList />} />
          <Route path="daftar-mata-kuliah/:prodiId" element={<CourseList />} /> {/* Dengan parameter prodiId */}
          <Route path="daftar-dosen-wali" element={<LecturerList />} />
          <Route path="koordinator-mata-kuliah" element={<CoordinatorList />} />
          <Route path="dosen-pembimbing-pi" element={<DosenPembimbingPI />} />
          <Route path="jadwal-kuliah" element={<ClassSchedule />} />
          <Route path="jadwal-ujian" element={<ExamSchedule />} />
          
          {/* Routes Layanan & Formulir */}
          <Route path="informasi-layanan" element={<ServiceInformation />} />
          <Route path="formulir-rencana-studi" element={<StudyPlanForm />} />
          <Route path="ujian-bentrok" element={<ExamConflict />} />
          
          {/* Routes Berita */}
          <Route path="berita" element={<NewsList />} /> {/* List semua berita */}
          <Route path="berita/:slug" element={<NewsPage />} /> {/* Detail berita berdasarkan slug */}
          
          {/* Routes Panduan */}
          <Route path="panduan-administrasi" element={<PanduanAdministrasi />} />
          <Route path="panduan-administrasi/:slug" element={<PanduanAdministrasi />} />
          <Route path="panduan/:slug" element={<AdministrationGuide />} />
          
          {/* Catch-all route untuk halaman konten dinamis */}
          {/* Route ini akan match semua path yang belum terdefinisi di atas */}
          {/* Contoh: /tentang-kami → akan render ContentPage dengan slug "tentang-kami" */}
          <Route path=":slug" element={<ContentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Export App component sebagai default export
// File ini akan di-import di index.js sebagai root component
export default App;

