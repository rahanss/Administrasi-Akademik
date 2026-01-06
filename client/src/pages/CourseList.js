import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';
import Loading from '../components/Loading';
import './CourseList.css';

const CourseList = () => {
  const { prodiId } = useParams();
  const navigate = useNavigate();
  const [prodiList, setProdiList] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState(null);
  const [mataKuliah, setMataKuliah] = useState({});
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
      fetchMataKuliah(prodiId);
    } else {
      setLoading(false);
    }
  }, [prodiId]);

  const fetchMataKuliah = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/mata-kuliah/prodi/${id}`);
      setSelectedProdi(response.data.prodi);
      setMataKuliah(response.data.mataKuliah);
    } catch (error) {
      console.error('Error fetching mata kuliah:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProdiClick = (prodi) => {
    navigate(`/daftar-mata-kuliah/${prodi.id}`);
  };

  const groupByJenjang = () => {
    const grouped = {};
    prodiList.forEach(prodi => {
      if (!grouped[prodi.jenjang]) {
        grouped[prodi.jenjang] = [];
      }
      grouped[prodi.jenjang].push(prodi);
    });
    return grouped;
  };

  if (prodiId && selectedProdi) {
    // Show mata kuliah detail
    const semesters = Object.keys(mataKuliah).sort((a, b) => parseInt(a) - parseInt(b));

    return (
      <div className="course-list-page">
        <Breadcrumb items={[
          { label: 'Beranda', path: '/' },
          { label: 'Daftar Mata Kuliah', path: '/daftar-mata-kuliah' },
          { label: `${selectedProdi.jenjang} - ${selectedProdi.nama}` }
        ]} />
        <div className="course-header">
          <h1 className="course-title">{selectedProdi.jenjang} - {selectedProdi.nama}</h1>
        </div>

        {loading ? (
          <Loading message="Memuat mata kuliah..." />
        ) : (
          <div className="course-detail">
            {semesters.map(semester => (
              <div key={semester} className="semester-section">
                <h2 className="semester-title">Semester {semester}</h2>
                <div className="course-items">
                  {mataKuliah[semester].map(mk => (
                    <div key={mk.id} className="course-item">
                      <div className="course-code">{mk.kode}</div>
                      <div className="course-info">
                        <h3 className="course-name">{mk.nama}</h3>
                        <div className="course-meta">
                          <span className="course-sks">{mk.sks} SKS</span>
                          {mk.deskripsi && (
                            <p className="course-description">{mk.deskripsi}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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

