import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './ContentPage.css';
import './PanduanAdministrasi.css';

const PanduanAdministrasi = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subMenus, setSubMenus] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);


  useEffect(() => {
    const fetchSubMenus = async () => {
      try {
        // Fetch sub-menus of panduan-administrasi (parent_id = 10)
        const response = await axios.get('/api/menu/panduan');
        const allMenus = response.data || [];
        // Filter sub-menus (those with parent_id = 10)
        const subMenuItems = allMenus.filter(menu => menu.parent_id === 10);
        setSubMenus(subMenuItems);
      } catch (error) {
        console.error('Error fetching sub menus:', error);
        setSubMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubMenus();
  }, []);

  useEffect(() => {
    // Check URL hash on mount and when location changes
    const hash = location.hash.replace('#', '');
    if (hash) {
      loadContent(hash);
    } else if (slug) {
      loadContent(slug);
    } else {
      // If no slug or hash, show card view
      setSelectedContent(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash, slug]);

  const loadContent = async (contentSlug) => {
    setContentLoading(true);
    try {
      const response = await axios.get(`/api/halaman/${contentSlug}`);
      setSelectedContent(response.data);
      // Update URL hash using navigate to trigger React Router updates
      if (location.hash !== `#${contentSlug}`) {
        navigate(`/panduan-administrasi#${contentSlug}`, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setSelectedContent({
        judul: 'Konten Tidak Ditemukan',
        konten: '<p>Konten yang Anda cari tidak ditemukan.</p>'
      });
    } finally {
      setContentLoading(false);
    }
  };

  const handleCardClick = (menuSlug) => {
    loadContent(menuSlug);
  };

  const handleBackToCards = () => {
    setSelectedContent(null);
    // Use navigate to properly update the URL and trigger React Router updates
    navigate('/panduan-administrasi', { replace: true });
  };

  const getMenuIcon = (menuSlug) => {
    const iconMap = {
      'daftar-ulang': '/icons/PanduanAdministrasi.png',
      'cuti-akademik': '/icons/PanduanAdministrasi.png',
      'tidak-aktif-kuliah': '/icons/PanduanAdministrasi.png',
      'pengecekan-nilai': '/icons/PanduanAdministrasi.png',
      'pindah-lokasi-waktu': '/icons/PanduanAdministrasi.png',
      'pindah-jurusan': '/icons/PanduanAdministrasi.png'
    };
    return iconMap[menuSlug] || '/icons/PanduanAdministrasi.png';
  };

  if (loading) {
    return (
      <div className="content-page">
        <div className="content-loading">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // If content is selected, show content view
  if (selectedContent) {
    return (
      <div className="content-page">
        <button onClick={handleBackToCards} className="back-button">
          ← Kembali ke Daftar Panduan
        </button>
        <div className="content-header">
          <h1 className="content-title">{selectedContent.judul || 'Panduan Administrasi'}</h1>
          <div className="content-underline"></div>
        </div>

        {contentLoading ? (
          <div className="content-loading">
            <LoadingSpinner />
          </div>
        ) : (
          <div 
            className="content-body"
            dangerouslySetInnerHTML={{ __html: selectedContent.konten || '' }}
          />
        )}
      </div>
    );
  }

  // Show card view
  return (
    <div className="content-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="content-header">
        <h1 className="content-title">Panduan Administrasi</h1>
        <div className="content-underline"></div>
      </div>

      <div className="panduan-cards-container">
        <div className="panduan-cards-grid">
          {subMenus.map((menu) => (
            <div
              key={menu.id}
              className="panduan-card"
              onClick={() => handleCardClick(menu.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(menu.slug);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Buka panduan ${menu.nama}`}
            >
              <div className="panduan-card-icon">
                <img 
                  src={getMenuIcon(menu.slug)} 
                  alt={`${menu.nama} icon`}
                  className="panduan-card-icon-image"
                />
              </div>
              <h3 className="panduan-card-title">{menu.nama}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanduanAdministrasi;
