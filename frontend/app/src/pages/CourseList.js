import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './CourseList.css';

const CourseList = () => {
  const { prodiId } = useParams();
  const navigate = useNavigate();
  const [prodiList, setProdiList] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await axios.get('/api/prodi');
        setProdiList(response.data);
      } catch (error) {
        console.error('Error fetching program studi:', error);
      }
    };

    fetchProdi();
  }, []);

  useEffect(() => {
    if (prodiId) {
      fetchProdiDetail(prodiId);
    } else {
      setLoading(false);
    }
  }, [prodiId]);

  const fetchProdiDetail = async (id) => {
    setLoading(true);
    try {
      // Fetch hanya data prodi, tidak perlu mata kuliah
      const response = await axios.get(`/api/prodi/${id}`);
      setSelectedProdi(response.data);
    } catch (error) {
      console.error('Error fetching prodi detail:', error);
      // Fallback: coba ambil dari list prodi
      const prodi = prodiList.find(p => p.id === parseInt(id));
      if (prodi) {
        setSelectedProdi(prodi);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDocumentPath = (prodi) => {
    if (!prodi || !prodi.nama) {
      return null;
    }

    // Mapping langsung berdasarkan nama prodi dari database
    const docMap = {
      // D3
      'Akuntansi Komputer': 'D3-AKUNTANSI.pdf',
      'Manajemen Keuangan': 'D3-KEUANGAN.pdf',
      'Manajemen Informatika': 'D3-MI.pdf',
      'Manajemen Pemasaran': 'D3-PEMASARAN.pdf',
      'Teknik Komputer': 'D3-TK.pdf',
      // S1
      'Sistem Informasi': 'S1-SISTEM INFORMASI.pdf',
      'Sistem Komputer': 'S1-SISTEM KOMPUTER.pdf',
      'Akuntansi': 'S1-AKUNTANSI.pdf',
      'Manajemen': 'S1-MANAJEMEN.pdf',
      'Ekonomi Syariah': 'S1-EKONOMI SYARIAH.pdf',
      'Teknik Elektro': 'S1-ELEKTRO.pdf',
      'Teknik Industri': 'S1-INDUSTRI.pdf',
      'Informatika': 'S1-INFORMATIKA.pdf',
      'Teknik Mesin': 'S1-MESIN.pdf',
      'Agroteknologi': 'S1-AGROTEKNOLOGI.pdf',
      'Teknik Sipil': 'S1-SIPIL.pdf',
      'Teknik Arsitektur': 'S1-ARSITEKTUR.pdf',
      'Desain Interior': 'S1-INTERIOR.pdf',
      'Psikologi': 'S1-PSIKOLOGI.pdf',
      'Sastra Inggris': 'S1-SASTRA INGGRIS.pdf',
      'Sastra Tiongkok': 'S1-SASTRA TIONGKOK.pdf',
      'Pariwisata': 'S1-PARIWISATA.pdf',
      'Komunikasi': 'S1-KOMUNIKASI.pdf',
      'Farmasi': 'S1-FARMASI.pdf',
      'Kebidanan': 'S1-KEBIDANAN.pdf',
      'Kedokteran': 'S1-KEDOKTERAN.pdf'
    };
    
    // Cek exact match
    const fileName = docMap[prodi.nama];
    
    return fileName ? `/documents/${fileName}` : null;
  };

  const handleProdiClick = (prodi) => {
    navigate(`/daftar-mata-kuliah/${prodi.id}`);
  };

  const groupByJenjang = () => {
    const grouped = {};
    
    // Urutan program studi sesuai dengan list yang diberikan
    const prodiOrder = {
      'D3': [
        'Akuntansi Komputer',
        'Manajemen Keuangan',
        'Manajemen Informatika',
        'Manajemen Pemasaran',
        'Teknik Komputer'
      ],
      'S1': [
        'Sistem Informasi',
        'Sistem Komputer',
        'Akuntansi',
        'Manajemen',
        'Ekonomi Syariah',
        'Teknik Elektro',
        'Teknik Industri',
        'Informatika',
        'Teknik Mesin',
        'Agroteknologi',
        'Teknik Sipil',
        'Teknik Arsitektur',
        'Desain Interior',
        'Psikologi',
        'Sastra Inggris',
        'Sastra Tiongkok',
        'Pariwisata',
        'Komunikasi',
        'Farmasi',
        'Kebidanan',
        'Kedokteran'
      ]
    };
    
    prodiList.forEach(prodi => {
      if (!grouped[prodi.jenjang]) {
        grouped[prodi.jenjang] = [];
      }
      grouped[prodi.jenjang].push(prodi);
    });
    
    // Sort berdasarkan urutan yang ditentukan
    Object.keys(grouped).forEach(jenjang => {
      if (prodiOrder[jenjang]) {
        grouped[jenjang].sort((a, b) => {
          const indexA = prodiOrder[jenjang].indexOf(a.nama);
          const indexB = prodiOrder[jenjang].indexOf(b.nama);
          // Jika tidak ditemukan di order, taruh di akhir
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }
    });
    
    return grouped;
  };

  if (prodiId && selectedProdi) {
    // Show document only
    const documentPath = getDocumentPath(selectedProdi);
    
    // Debug: log untuk memastikan mapping bekerja
    console.log('Selected Prodi:', selectedProdi);
    console.log('Document Path:', documentPath);

    return (
      <div className="course-list-page">
        <div className="course-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Kembali ke Beranda
          </button>
          <button 
            className="back-button"
            onClick={() => navigate('/daftar-mata-kuliah')}
            style={{ marginTop: '0.5rem' }}
          >
            ← Kembali ke Daftar Program Studi
          </button>
          <h1 className="course-title">{selectedProdi.jenjang} - {selectedProdi.nama}</h1>
        </div>

        <div className="document-section">
          {documentPath ? (
            <>
              <div className="document-header">
                <h3 className="document-title"> Dokumen Daftar Mata Kuliah</h3>
                <a 
                  href={documentPath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-download-btn"
                  download
                >
                  Unduh PDF
                </a>
              </div>
              <div className="document-viewer">
                <iframe
                  src={`${documentPath}#toolbar=1&navpanes=1&scrollbar=1`}
                  title={`Dokumen ${selectedProdi.nama}`}
                  className="pdf-viewer"
                  type="application/pdf"
                >
                  <p>
                    Browser Anda tidak mendukung PDF viewer. 
                    <a href={documentPath} download>Klik di sini untuk mengunduh PDF</a>
                  </p>
                </iframe>
              </div>
            </>
          ) : (
            <div className="document-header">
              <h3 className="document-title"> Dokumen Daftar Mata Kuliah</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Dokumen untuk program studi ini sedang dalam proses persiapan.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show program studi list
  const groupedProdi = groupByJenjang();

  return (
    <div className="course-list-page">
      <div className="course-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <h1 className="course-title">Daftar Mata Kuliah</h1>
        <p className="course-subtitle">Pilih program studi untuk melihat daftar mata kuliah</p>
      </div>

      <div className="prodi-list">
        {Object.keys(groupedProdi).sort().map(jenjang => (
          <div key={jenjang} className="jenjang-section">
            <h2 className="jenjang-title">{jenjang}</h2>
            <div className="prodi-items">
              {groupedProdi[jenjang].map(prodi => (
                <div
                  key={prodi.id}
                  className="prodi-item"
                  onClick={() => handleProdiClick(prodi)}
                >
                  <span className="prodi-arrow">›</span>
                  <span className="prodi-name">{prodi.nama}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;

