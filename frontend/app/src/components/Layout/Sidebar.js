import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import './Sidebar.css';

const Sidebar = ({ currentModule }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/menu/${currentModule}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentModule) {
      fetchMenuItems();
    }
  }, [currentModule]);

  const handleMenuClick = (slug) => {
    // Special handling for panduan-administrasi sub-menus
    if (slug === 'daftar-ulang' || slug === 'cuti-akademik' || slug === 'tidak-aktif-kuliah' || 
        slug === 'pengecekan-nilai' || slug === 'pindah-lokasi-waktu' || slug === 'pindah-jurusan') {
      navigate(`/panduan-administrasi#${slug}`);
    } else if (slug === 'panduan-administrasi') {
      navigate('/panduan-administrasi');
    } else {
      navigate(`/${slug}`);
    }
  };

  const getMenuIcon = (iconName, slug) => {
    // Mapping icon berdasarkan slug untuk akurasi yang lebih baik
    const iconMap = {
      'jadwal-kelas': '/icons/JamKuliah.png',
      'kalender-akademik': '/icons/KalenderAkademik.png',
      'daftar-mata-kuliah': '/icons/DaftarMatkul.png',
      'daftar-dosen-wali': '/icons/DaftarDosen.png',
      'koordinator-mata-kuliah': '/icons/DaftarMatkul.png',
      'dosen-pembimbing-pi': '/icons/DaftarDosen.png',
      'jadwal-kuliah': '/icons/JamKuliah.png',
      'jadwal-ujian': '/icons/JadwalUjian.png',
      'ujian-bentrok': '/icons/JadwalUjian.png',
      'formulir-rencana-studi': '/icons/FormRencanaStudi.png',
      'panduan-pendaftaran': '/icons/PanduanAdministrasi.png',
      'panduan-akademik': '/icons/PanduanAdministrasi.png',
      'panduan-ujian': '/icons/JadwalUjian.png',
      'panduan-administrasi': '/icons/PanduanAdministrasi.png',
      'informasi-layanan': '/icons/InformasiLayanan.png'
    };
    
    // Fallback berdasarkan iconName jika slug tidak ditemukan
    const iconNameMap = {
      calendar: '/icons/KalenderAkademik.png',
      book: '/icons/DaftarMatkul.png',
      users: '/icons/DaftarDosen.png',
      schedule: '/icons/JamKuliah.png',
      exam: '/icons/JadwalUjian.png',
      form: '/icons/FormRencanaStudi.png',
      academic: '/icons/PanduanAdministrasi.png',
      admin: '/icons/PanduanAdministrasi.png',
      register: '/icons/PanduanAdministrasi.png'
    };
    
    return iconMap[slug] || iconNameMap[iconName] || '/icons/PanduanAdministrasi.png';
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <LoadingSpinner message="Memuat menu..." />
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems
          .filter((item) => item.slug !== 'panduan-administrasi') // Hide "Administrasi Umum" from sidebar
          .map((item) => {
            // Special handling for panduan-administrasi sub-menus
            let isActive = false;
            if (item.slug === 'daftar-ulang' || item.slug === 'cuti-akademik' || 
                item.slug === 'tidak-aktif-kuliah' || item.slug === 'pengecekan-nilai' || 
                item.slug === 'pindah-lokasi-waktu' || item.slug === 'pindah-jurusan') {
              isActive = location.pathname === '/panduan-administrasi' && 
                        location.hash === `#${item.slug}`;
            } else {
              isActive = location.pathname === `/${item.slug}` || 
                        location.pathname.startsWith(`/${item.slug}/`);
            }
            return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.slug)}
              aria-label={`Buka halaman ${item.nama}`}
            >
              <span className="sidebar-icon">
                <img 
                  src={getMenuIcon(item.icon, item.slug)} 
                  alt={`${item.nama} icon`}
                  className="sidebar-icon-image"
                />
              </span>
              <span className="sidebar-text">{item.nama}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


