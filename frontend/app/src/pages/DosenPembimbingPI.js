import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './DosenPembimbingPI.css';

const DosenPembimbingPI = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAkademik, setTahunAkademik] = useState('2025/2026');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          semester: semester,
          tahun: tahunAkademik
        };
        const response = await axios.get('/api/dosen-pembimbing-pi', { params });
        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
          setFilteredData(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error('Error fetching dosen pembimbing PI:', error);
        if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        }
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [semester, tahunAkademik]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.kelas.toLowerCase().includes(searchLower) ||
          item.dosen_pembimbing.toLowerCase().includes(searchLower) ||
          item.nama_mhs.toLowerCase().includes(searchLower) ||
          item.npm.toLowerCase().includes(searchLower)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  if (loading) {
    return (
      <div className="dosen-pi-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="dosen-pi-page">
      <div className="dosen-pi-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <h1 className="dosen-pi-title">
          Daftar Dosen Pembimbing dan Mahasiswa Penulisan Ilmiah (PI) Semester {semester} (PTA) {tahunAkademik}
        </h1>
      </div>

      <div className="dosen-pi-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Cari Berdasarkan Kelas / Nama Dosen Pembimbing"
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

      <div className="dosen-pi-table-container">
        <table className="dosen-pi-table">
          <thead>
            <tr>
              <th className="col-kelas">KELAS</th>
              <th className="col-kelompok">KELOMPOK</th>
              <th className="col-npm">NPM</th>
              <th className="col-nama">NAMA MHS</th>
              <th className="col-dosen">DOSEN PEMBIMBING</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {data.length === 0 
                    ? 'Tidak ada data dosen pembimbing PI untuk semester dan tahun akademik yang dipilih'
                    : 'Tidak ada hasil pencarian'}
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="col-kelas">{item.kelas}</td>
                  <td className="col-kelompok">{item.kelompok}</td>
                  <td className="col-npm">{item.npm}</td>
                  <td className="col-nama">{item.nama_mhs}</td>
                  <td className="col-dosen">{item.dosen_pembimbing}</td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="dosen-pi-info">
          <p className="info-text">
            Menampilkan {filteredData.length} dari {data.length} mahasiswa
          </p>
        </div>
      )}
    </div>
  );
};

export default DosenPembimbingPI;
