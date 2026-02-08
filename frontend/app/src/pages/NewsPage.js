import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorMessage, logError } from '../utils/errorHandler';
import './NewsPage.css';

const NewsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      if (!slug) {
        setError('Slug tidak valid');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await axios.get(`/api/berita/${slug}`);
        setBerita(response.data);
      } catch (error) {
        logError('NewsPage - fetchBerita', error);
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        setBerita(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [slug]);

  if (loading) {
    return (
      <div className="news-page">
        <LoadingSpinner message="Memuat berita..." />
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="news-page">
        <div className="news-error">
          <ErrorMessage 
            message={error || 'Berita tidak ditemukan'} 
            dismissible={false}
          />
          <button onClick={() => navigate('/berita')} className="back-button">
            ← Kembali ke Daftar Berita
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




