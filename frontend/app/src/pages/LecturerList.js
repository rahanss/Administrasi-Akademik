import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LecturerList.css';

const LecturerList = () => {
  const navigate = useNavigate();
  const [dosenList, setDosenList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const response = await axios.get('/api/dosen');
        setDosenList(response.data);
      } catch (error) {
        console.error('Error fetching dosen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDosen();
  }, []);

  if (loading) {
    return (
      <div className="lecturer-page">
        <div className="loading">Memuat daftar dosen...</div>
      </div>
    );
  }

  return (
    <div className="lecturer-page">
      <div className="lecturer-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <h1 className="lecturer-title">Daftar Nama Dosen</h1>
      </div>

      <div className="lecturer-grid">
        {dosenList.map(dosen => (
          <div key={dosen.id} className="lecturer-card">
            <h3 className="lecturer-name">
              {dosen.gelar_depan ? `${dosen.gelar_depan} ` : ''}
              {dosen.nama}
              {dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : ''}
            </h3>
            <div className="lecturer-info">
              <div className="lecturer-field">
                <span className="field-label">NIP:</span>
                <span className="field-value">{dosen.nip}</span>
              </div>
              {dosen.prodi_nama && (
                <div className="lecturer-field">
                  <span className="field-label">Program Studi:</span>
                  <span className="field-value">{dosen.prodi_nama}</span>
                </div>
              )}
              {dosen.email && (
                <div className="lecturer-field">
                  <span className="field-label">📧 Email:</span>
                  <span className="field-value">{dosen.email}</span>
                </div>
              )}
              {dosen.telepon && (
                <div className="lecturer-field">
                  <span className="field-label">📞 Telepon:</span>
                  <span className="field-value">{dosen.telepon}</span>
                </div>
              )}
              {dosen.jabatan && (
                <div className="lecturer-field">
                  <span className="field-label">Jabatan:</span>
                  <span className="field-value">{dosen.jabatan}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerList;

