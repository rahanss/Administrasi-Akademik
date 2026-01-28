import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceInformation.css';

const ServiceInformation = () => {
  const navigate = useNavigate();
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const response = await axios.get('/api/layanan');
        setLayanan(response.data);
      } catch (error) {
        console.error('Error fetching layanan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
  }, []);

  if (loading) {
    return (
      <div className="service-page">
        <div className="loading">Memuat informasi layanan...</div>
      </div>
    );
  }

  return (
    <div className="service-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="service-header">
        <h1 className="service-title">Informasi Layanan</h1>
        <p className="service-subtitle">Informasi layanan kampus dan kontak</p>
      </div>

      <div className="service-grid">
        {layanan.map(item => (
          <div key={item.id} className="service-card">
            <div className="service-card-header">
              <h2 className="service-name">{item.nama}</h2>
            </div>
            <p className="service-description">{item.deskripsi}</p>
            <div className="service-details">
              <div className="service-detail-item">
                <span className="detail-label">Lokasi:</span>
                <span className="detail-value">{item.lokasi}</span>
              </div>
              {item.telepon && (
                <div className="service-detail-item">
                  <span className="detail-label">Telepon:</span>
                  <span className="detail-value">{item.telepon}</span>
                </div>
              )}
              {item.email && (
                <div className="service-detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{item.email}</span>
                </div>
              )}
              <div className="service-detail-item">
                <span className="detail-label">Jam Operasional:</span>
                <span className="detail-value">{item.jam_operasional}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceInformation;

