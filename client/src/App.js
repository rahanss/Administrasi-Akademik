import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Homepage from './pages/Homepage';
import AcademicCalendar from './pages/AcademicCalendar';
import CourseList from './pages/CourseList';
import LecturerList from './pages/LecturerList';
import ClassSchedule from './pages/ClassSchedule';
import ExamSchedule from './pages/ExamSchedule';
import AdministrationGuide from './pages/AdministrationGuide';
import ServiceInformation from './pages/ServiceInformation';
import NewsPage from './pages/NewsPage';
import ContentPage from './pages/ContentPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/kalender-akademik" element={<AcademicCalendar />} />
          <Route path="/daftar-mata-kuliah" element={<CourseList />} />
          <Route path="/daftar-mata-kuliah/:prodiId" element={<CourseList />} />
          <Route path="/daftar-dosen-wali" element={<LecturerList />} />
          <Route path="/jadwal-kuliah" element={<ClassSchedule />} />
          <Route path="/jadwal-ujian" element={<ExamSchedule />} />
          <Route path="/informasi-layanan" element={<ServiceInformation />} />
          <Route path="/berita/:slug" element={<NewsPage />} />
          <Route path="/panduan/:slug" element={<AdministrationGuide />} />
          <Route path="/:slug" element={<ContentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

