import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsPage.css';

const NewsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await axios.get(`/api/berita/${slug}`);
        setBerita(response.data);
      } catch (error) {
        console.error('Error fetching berita:', error);
        setBerita(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBerita();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="news-page">
        <div className="news-loading">Memuat berita...</div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="news-page">
        <div className="news-error">
          <h2>Berita tidak ditemukan</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <div className="news-meta">
          <span className="news-date-full">
            {new Date(berita.created_at).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {berita.featured && (
            <span className="news-badge">Featured</span>
          )}
        </div>
      </div>

      <h1 className="news-title-full">{berita.judul}</h1>

      {berita.gambar && (
        <div className="news-image">
          <img src={berita.gambar} alt={berita.judul} />
        </div>
      )}

      <div 
        className="news-content-full"
        dangerouslySetInnerHTML={{ __html: berita.konten }}
      />

      <div className="news-footer">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default NewsPage;


