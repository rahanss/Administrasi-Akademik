import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

// Import banner image
const bannerImage = process.env.PUBLIC_URL + '/images/banner.png';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search: navigate to relevant pages based on keywords
      const query = searchQuery.toLowerCase().trim();
      if (query.includes('kalender') || query.includes('akademik')) {
        navigate('/kalender-akademik');
      } else if (query.includes('mata kuliah') || query.includes('kuliah')) {
        navigate('/daftar-mata-kuliah');
      } else if (query.includes('dosen') || query.includes('wali')) {
        navigate('/daftar-dosen-wali');
      } else if (query.includes('jadwal') && query.includes('kuliah')) {
        navigate('/jadwal-kuliah');
      } else if (query.includes('jadwal') && query.includes('ujian')) {
        navigate('/jadwal-ujian');
      } else if (query.includes('panduan') || query.includes('administrasi')) {
        navigate('/panduan/panduan-akademik');
      } else if (query.includes('layanan') || query.includes('kontak')) {
        navigate('/informasi-layanan');
      } else {
        // Default: search in news/articles
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div 
        className="header-background"
        style={{ backgroundImage: `url(${bannerImage})` }}
      ></div>
      <div className="header-content">
        <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h1 className="header-title">PIAM</h1>
          <p className="header-subtitle">Pusat Informasi Akademik Mahasiswa</p>
        </div>
        <div className="header-right">
          <form onSubmit={handleSearch} className="header-search">
            <input
              type="text"
              placeholder="Input Kelas/Dosen"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
      <div className="header-banner">
        <div className="header-banner-track">
          <p className="header-banner-text">
            Selamat Datang di PIAM - Pusat Informasi Akademik Mahasiswa • Akses informasi akademik Anda dengan mudah • Cek kalender akademik, jadwal kuliah, dan berita terkini • Kelola rencana studi dan jadwal ujian Anda
          </p>
          <p className="header-banner-text header-banner-text-duplicate">
            Selamat Datang di PIAM - Pusat Informasi Akademik Mahasiswa • Akses informasi akademik Anda dengan mudah • Cek kalender akademik, jadwal kuliah, dan berita terkini • Kelola rencana studi dan jadwal ujian Anda
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

