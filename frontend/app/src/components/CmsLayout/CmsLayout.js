import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './CmsLayout.css';

const CmsLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const user = JSON.parse(localStorage.getItem('cms_user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const getIcon = (to) => {
    const iconMap = {
      'berita': '/icons/PanduanAdministrasi.png',
      'halaman': '/icons/PanduanAdministrasi.png',
      'prodi': '/icons/DaftarMatkul.png',
      'dosen': '/icons/DaftarDosen.png',
      'mata-kuliah': '/icons/DaftarMatkul.png',
      'layanan': '/icons/InformasiLayanan.png',
      'kategori': '/icons/PanduanAdministrasi.png',
      'menu': '/icons/PanduanAdministrasi.png',
      'koordinator': '/icons/DaftarMatkul.png',
      'dosen-pi': '/icons/DaftarDosen.png',
      'jadwal-kelas': '/icons/JamKuliah.png',
      'jadwal-kuliah': '/icons/JamKuliah.png',
      'jadwal-ujian': '/icons/JadwalUjian.png',
    };
    return iconMap[to] || '/icons/PanduanAdministrasi.png';
  };

  // Menu berdasarkan role
  // Admin: Hanya Konten (Berita, Halaman, Layanan)
  // Super Admin: Semua menu
  const nav = [
    { section: 'Konten', items: [
      { to: 'berita', label: 'Berita', adminOnly: false },
      { to: 'halaman', label: 'Halaman', adminOnly: false },
      { to: 'layanan', label: 'Layanan', adminOnly: false },
    ]},
    ...(isSuperAdmin ? [{
      section: 'Master', items: [
        { to: 'prodi', label: 'Program Studi', adminOnly: true },
        { to: 'dosen', label: 'Dosen', adminOnly: true },
        { to: 'mata-kuliah', label: 'Mata Kuliah', adminOnly: true },
      ]
    }] : []),
    ...(isSuperAdmin ? [{
      section: 'Struktur', items: [
        { to: 'kategori', label: 'Kategori', adminOnly: true },
        { to: 'menu', label: 'Menu', adminOnly: true },
      ]
    }] : []),
    ...(isSuperAdmin ? [{
      section: 'Akademik', items: [
        { to: 'koordinator', label: 'Koordinator MK', adminOnly: true },
        { to: 'dosen-pi', label: 'Dosen Pembimbing PI', adminOnly: true },
        { to: 'jadwal-kelas', label: 'Jadwal Kelas', adminOnly: true },
        { to: 'jadwal-kuliah', label: 'Jadwal Kuliah', adminOnly: true },
        { to: 'jadwal-ujian', label: 'Jadwal Ujian', adminOnly: true },
      ]
    }] : []),
  ];

  return (
    <div className="cms-layout">
      <aside className="cms-sidebar">
        <div className="cms-sidebar-header">
          <span className="cms-sidebar-title">CMS PIAM</span>
          <a href="/" className="cms-sidebar-back">Ke Website</a>
        </div>
        <div className="cms-sidebar-user">
          <div className="cms-sidebar-user-info">
            <span className="cms-sidebar-user-name">{user.nama || user.username || 'User'}</span>
            <span className="cms-sidebar-user-role">
              {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
            </span>
          </div>
          <button type="button" className="cms-sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <nav className="cms-nav">
          {nav.map((s) => (
            <div key={s.section}>
              <div className="cms-nav-section">{s.section}</div>
              {s.items.map((it) => (
                <NavLink
                  key={it.to}
                  to={`/cms/${it.to}`}
                  className={({ isActive }) => `cms-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="cms-nav-icon">
                    <img src={getIcon(it.to)} alt={`${it.label} icon`} className="cms-nav-icon-image" />
                  </span>
                  <span className="cms-nav-text">{it.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="cms-main">
        <Outlet />
      </main>
    </div>
  );
};

export default CmsLayout;
