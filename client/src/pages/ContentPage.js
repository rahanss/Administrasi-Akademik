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
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent({
          judul: 'Halaman Tidak Ditemukan',
          konten: '<p>Konten yang Anda cari tidak ditemukan.</p>'
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
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


