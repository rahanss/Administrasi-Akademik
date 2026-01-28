import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CmsLayout from './components/CmsLayout/CmsLayout';
import ProtectedRoute from './components/ProtectedRoute';
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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/cms/login" element={<CmsLogin />} />
        <Route path="/cms" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/cms/berita" replace />} />
          <Route path="berita" element={<CmsBerita />} />
          <Route path="halaman" element={<CmsHalaman />} />
          <Route path="layanan" element={<CmsLayanan />} />
          <Route path="prodi" element={<CmsProdi />} />
          <Route path="dosen" element={<CmsDosen />} />
          <Route path="mata-kuliah" element={<CmsMataKuliah />} />
          <Route path="kategori" element={<CmsKategori />} />
          <Route path="menu" element={<CmsMenu />} />
          <Route path="koordinator" element={<CmsKoordinator />} />
          <Route path="dosen-pi" element={<CmsDosenPI />} />
          <Route path="jadwal-kelas" element={<CmsJadwalKelas />} />
          <Route path="jadwal-kuliah" element={<CmsJadwalKuliah />} />
          <Route path="jadwal-ujian" element={<CmsJadwalUjian />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="jadwal-kelas" element={<ClassScheduleSearch />} />
          <Route path="kalender-akademik" element={<AcademicCalendar />} />
          <Route path="daftar-mata-kuliah" element={<CourseList />} />
          <Route path="daftar-mata-kuliah/:prodiId" element={<CourseList />} />
          <Route path="daftar-dosen-wali" element={<LecturerList />} />
          <Route path="koordinator-mata-kuliah" element={<CoordinatorList />} />
          <Route path="dosen-pembimbing-pi" element={<DosenPembimbingPI />} />
          <Route path="jadwal-kuliah" element={<ClassSchedule />} />
          <Route path="jadwal-ujian" element={<ExamSchedule />} />
          <Route path="informasi-layanan" element={<ServiceInformation />} />
          <Route path="formulir-rencana-studi" element={<StudyPlanForm />} />
          <Route path="ujian-bentrok" element={<ExamConflict />} />
          <Route path="berita" element={<NewsList />} />
          <Route path="berita/:slug" element={<NewsPage />} />
          <Route path="panduan-administrasi" element={<PanduanAdministrasi />} />
          <Route path="panduan-administrasi/:slug" element={<PanduanAdministrasi />} />
          <Route path="panduan/:slug" element={<AdministrationGuide />} />
          <Route path=":slug" element={<ContentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

