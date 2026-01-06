import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentPage.css';

const AdministrationGuide = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/halaman/${slug}`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching guide content:', error);
        // Fallback content
        setContent({
          judul: 'Panduan Administrasi',
          konten: '<p>Konten panduan sedang dalam pengembangan.</p>'
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  const handleRelatedClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="content-page">
        <div className="content-loading">Memuat panduan...</div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="content-header">
        <h1 className="content-title">{content?.judul || 'Panduan Administrasi'}</h1>
        <div className="content-underline"></div>
      </div>

      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content?.konten || '' }}
      />

      <div className="content-related">
        <h3 className="content-related-title">Panduan Lainnya</h3>
        <div className="content-related-cards">
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/panduan/panduan-pendaftaran')}
          >
            <span className="related-icon">📝</span>
            <span className="related-text">Pendaftaran & Registrasi</span>
          </div>
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/panduan/panduan-akademik')}
          >
            <span className="related-icon">🎓</span>
            <span className="related-text">Akademik</span>
          </div>
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/panduan/panduan-ujian')}
          >
            <span className="related-icon">📝</span>
            <span className="related-text">Ujian & Penilaian</span>
          </div>
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/kalender-akademik')}
          >
            <span className="related-icon">📅</span>
            <span className="related-text">Kalender Akademik</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrationGuide;

