import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentPage.css';

const ExamConflict = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/halaman/ujian-bentrok');
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching exam conflict content:', error);
        setContent({
          judul: 'Pengurusan Ujian Bentrok',
          konten: '<p>Gagal memuat konten. Silakan coba lagi nanti.</p>'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleRelatedClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="content-page">
        <div className="content-loading">Memuat konten...</div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="content-header">
        <h1 className="content-title">{content?.judul || 'Pengurusan Ujian Bentrok'}</h1>
        <div className="content-underline"></div>
      </div>

      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content?.konten || '' }}
      />

      <div className="content-related">
        <h3 className="content-related-title">Informasi Terkait</h3>
        <div className="content-related-cards">
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/jadwal-ujian')}
          >
            <span className="related-icon">
              <img src="/icons/JadwalUjian.png" alt="Jadwal Ujian" className="related-icon-image" />
            </span>
            <span className="related-text">Jadwal Ujian</span>
          </div>
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/jadwal-kuliah')}
          >
            <span className="related-icon">
              <img src="/icons/JamKuliah.png" alt="Jadwal Kuliah" className="related-icon-image" />
            </span>
            <span className="related-text">Jadwal Kuliah</span>
          </div>
          <div 
            className="content-related-card"
            onClick={() => handleRelatedClick('/kalender-akademik')}
          >
            <span className="related-icon">
              <img src="/icons/KalenderAkademik.png" alt="Kalender Akademik" className="related-icon-image" />
            </span>
            <span className="related-text">Kalender Akademik</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamConflict;
