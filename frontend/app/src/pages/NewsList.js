import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './NewsList.css';

const NewsList = () => {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await axios.get('/api/berita');
        setBeritaList(response.data || []);
      } catch (error) {
        console.error('Error fetching berita:', error);
        setBeritaList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  if (loading) {
    return (
      <div className="news-list-page">
        <div className="news-list-loading">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="news-list-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="news-list-header">
        <h1 className="news-list-title">Berita</h1>
        <div className="content-underline"></div>
      </div>

      {beritaList.length === 0 ? (
        <div className="news-list-empty">
          <p>Belum ada berita tersedia</p>
        </div>
      ) : (
        <div className="news-list-container">
          {beritaList.map((berita) => (
            <div 
              key={berita.id} 
              className="news-list-item"
              onClick={() => navigate(`/berita/${berita.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/berita/${berita.slug}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Baca berita ${berita.judul}`}
            >
              <div className="news-list-date">
                {berita.created_at ? new Date(berita.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : '-'}
              </div>
              <div className="news-list-content">
                <h3 className="news-list-item-title">{berita.judul || 'Judul tidak tersedia'}</h3>
                {berita.ringkasan && (
                  <p className="news-list-item-summary">{berita.ringkasan}</p>
                )}
                {berita.slug && (
                  <button
                    className="news-list-read-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/berita/${berita.slug}`);
                    }}
                    aria-label={`Baca lebih lanjut tentang ${berita.judul}`}
                  >
                    Lebih lanjut
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
