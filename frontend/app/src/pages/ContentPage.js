import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContentPage.css';

const ContentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/halaman/${slug}`);
        if (response.data) {
          setContent(response.data);
        } else {
          throw new Error('Content not found');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        // Jika 404, tampilkan pesan yang lebih informatif
        if (error.response && error.response.status === 404) {
          setContent({
            judul: 'Halaman Tidak Ditemukan',
            konten: `
              <p>Konten yang Anda cari tidak ditemukan.</p>
              <p>Silakan kembali ke <a href="/">beranda</a> atau gunakan menu navigasi untuk menemukan informasi yang Anda butuhkan.</p>
            `
          });
        } else {
          setContent({
            judul: 'Terjadi Kesalahan',
            konten: `
              <p>Terjadi kesalahan saat memuat konten. Silakan coba lagi nanti.</p>
              <p>Jika masalah berlanjut, silakan kembali ke <a href="/">beranda</a>.</p>
            `
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    } else {
      setLoading(false);
    }
  }, [slug]);

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
        <h1 className="content-title">{content?.judul || 'Halaman'}</h1>
        <div className="content-underline"></div>
      </div>

      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content?.konten || '' }}
      />
    </div>
  );
};

export default ContentPage;




