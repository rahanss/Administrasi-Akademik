import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './CoordinatorList.css';

const CoordinatorList = () => {
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAkademik, setTahunAkademik] = useState('2025/2026');

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        setLoading(true);
        const params = {
          semester: semester,
          tahun: tahunAkademik
        };
        const response = await axios.get('/api/koordinator', { params });
        if (response.data && Array.isArray(response.data)) {
          setCoordinators(response.data);
          setFilteredCoordinators(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setCoordinators([]);
          setFilteredCoordinators([]);
        }
      } catch (error) {
        console.error('Error fetching coordinators:', error);
        if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        }
        setCoordinators([]);
        setFilteredCoordinators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, [semester, tahunAkademik]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoordinators(coordinators);
    } else {
      const filtered = coordinators.filter(coord => {
        const searchLower = searchTerm.toLowerCase();
        return (
          coord.mata_kuliah.toLowerCase().includes(searchLower) ||
          coord.kelas.toLowerCase().includes(searchLower) ||
          coord.dosen_nama.toLowerCase().includes(searchLower)
        );
      });
      setFilteredCoordinators(filtered);
    }
  }, [searchTerm, coordinators]);

  if (loading) {
    return (
      <div className="coordinator-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="coordinator-page">
      <div className="coordinator-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <h1 className="coordinator-title">
          Koordinator Mata Kuliah Semester {semester} (PTA) {tahunAkademik}
        </h1>
      </div>

      <div className="coordinator-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Cari Berdasarkan Mata Kuliah / Kelas / Nama Dosen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <select
            className="filter-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>
          <select
            className="filter-select"
            value={tahunAkademik}
            onChange={(e) => setTahunAkademik(e.target.value)}
          >
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2026/2027">2026/2027</option>
          </select>
        </div>
      </div>

      <div className="coordinator-table-container">
        <table className="coordinator-table">
          <thead>
            <tr>
              <th className="col-no">No</th>
              <th className="col-mata-kuliah">Mata Kuliah</th>
              <th className="col-kelas">Kelas</th>
              <th className="col-dosen">Dosen</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoordinators.length === 0 && !loading ? (
              <tr>
                <td colSpan="4" className="no-data">
                  {coordinators.length === 0 
                    ? 'Tidak ada data koordinator mata kuliah untuk semester dan tahun akademik yang dipilih'
                    : 'Tidak ada hasil pencarian'}
                </td>
              </tr>
            ) : filteredCoordinators.length > 0 ? (
              filteredCoordinators.map((coord, index) => (
                <tr key={coord.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="col-no">{index + 1}</td>
                  <td className="col-mata-kuliah">{coord.mata_kuliah}</td>
                  <td className="col-kelas">{coord.kelas}</td>
                  <td className="col-dosen">{coord.dosen_nama}</td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {filteredCoordinators.length > 0 && (
        <div className="coordinator-info">
          <p className="info-text">
            Menampilkan {filteredCoordinators.length} dari {coordinators.length} koordinator mata kuliah
          </p>
        </div>
      )}
    </div>
  );
};

export default CoordinatorList;
