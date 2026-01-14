import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentPage.css';

const AcademicCalendar = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/halaman/kalender-akademik');
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching academic calendar:', error);
        // Fallback content
        setContent({
          judul: 'Kalender Akademik',
          konten: `
            <h2>Kalender Akademik</h2>
            <p>Satu Tahun Akademik dibagi dalam dua semester yaitu perkuliahan pada Semester Ganjil dan Semester Genap. Semester Ganjil biasanya dimulai pada bulan September sampai dengan bulan Januari, sedangkan Semester Genap dimulai pada bulan Februari sampai dengan bulan Agustus.</p>
            <p>Kalender akademik yang berisi kegiatan-kegiatan selama satu semester akan diumumkan pada awal semester melalui BAAK On_Line atau dengan cara ditempelkan di papan pengumuman dan di beberapa tempat strategis di berbagai kampus (Kampus A, C, D, E, G, dan H).</p>
            <p><strong>Setiap mahasiswa wajib memperhatikan jadwal kegiatan yang tercantum dalam kalender akademik. Keterlambatan atau kelalaian dalam mengikuti kegiatan akademik akan berakibat mendapat sanksi akademik, skorsing, atau tidak diperkenankan mengikuti kegiatan akademik tertentu.</strong></p>
            <h3>Kegiatan Akademik Semester Ganjil 2025/2026</h3>
            <ul>
              <li><strong>02 September 2025:</strong> Awal Semester Ganjil</li>
              <li><strong>02-06 September 2025:</strong> Masa Perwalian dan Pengisian KRS</li>
              <li><strong>09 September 2025:</strong> Kuliah Perdana</li>
              <li><strong>16-20 September 2025:</strong> Masa Tambah/Batal Mata Kuliah</li>
              <li><strong>07-12 Oktober 2025:</strong> Ujian Tengah Semester (UTS)</li>
              <li><strong>28 Oktober 2025:</strong> Batas Akhir Pengumpulan Nilai UTS</li>
              <li><strong>10-14 November 2025:</strong> Evaluasi Perkuliahan Tengah Semester</li>
              <li><strong>01-06 Desember 2025:</strong> Ujian Akhir Semester (UAS)</li>
            </ul>
          `
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
        <h1 className="content-title">{content?.judul || 'Kalender Akademik'}</h1>
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
            onClick={() => handleRelatedClick('/daftar-mata-kuliah')}
          >
            <span className="related-icon">
              <img src="/icons/DaftarMatkul.png" alt="Daftar Mata Kuliah" className="related-icon-image" />
            </span>
            <span className="related-text">Daftar Mata Kuliah</span>
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
            onClick={() => handleRelatedClick('/jadwal-ujian')}
          >
            <span className="related-icon">
              <img src="/icons/JadwalUjian.png" alt="Jadwal Ujian" className="related-icon-image" />
            </span>
            <span className="related-text">Jadwal Ujian</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;

