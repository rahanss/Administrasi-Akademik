import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './ClassScheduleSearch.css';

const ClassScheduleSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Check for search query from URL params (from header search)
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
      // Don't set searchQuery in state, just perform search directly
      // This way input field stays empty
      performSearch(queryFromUrl);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query || !query.trim()) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await axios.get('/api/jadwal/kelas', {
        params: { search: query.trim() }
      });
      setSchedules(response.data || []);
      // Clear input after search
      setSearchQuery('');
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
      setSearchQuery('');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    await performSearch(searchQuery);
  };

  return (
    <div className="class-schedule-search-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      
      <div className="schedule-search-header">
        <h1 className="schedule-search-title">Jadwal Kelas</h1>
        <div className="content-underline"></div>
      </div>

      <div className="schedule-search-section">
        <div className="schedule-search-info">
          <h3 className="schedule-info-title">Jadwal Perkuliahan Ganjil (PTA) 2025/2026</h3>
          <p className="schedule-info-subtitle">Untuk Input (kelas/dosen)</p>
        </div>

        <form onSubmit={handleSearch} className="schedule-search-form">
          <div className="schedule-input-group">
            <label htmlFor="search-input" className="schedule-input-label">
              (kolom input kelas/dosen)
            </label>
              <div className="schedule-input-wrapper">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan kelas atau nama dosen"
                  className="schedule-search-input"
                  autoFocus
                />
                <button type="submit" className="schedule-search-button" disabled={loading || !searchQuery.trim()}>
                  {loading ? 'Mencari...' : 'Cari'}
                </button>
              </div>
          </div>
        </form>

        <div className="schedule-keterangan">
          <h4 className="keterangan-title">Keterangan</h4>
          <ul className="keterangan-list">
            <li>
              Untuk input berdasarkan kelas, tidak menggunakan spasi.
              <br />
              <strong>Contoh :</strong> 4ka03 atau 2DB18
            </li>
            <li>
              Untuk input berdasarkan dosen, boleh berupa satu kata (dari keseluruhan kata) dari nama dosen.
              <br />
              <strong>Contoh :</strong> widya atau silfianti
            </li>
          </ul>
        </div>
      </div>

      {loading && (
        <div className="schedule-loading">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasSearched && schedules.length > 0 && (
        <div className="schedule-results">
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="schedule-th">KELAS</th>
                  <th className="schedule-th">HARI</th>
                  <th className="schedule-th">MATA KULIAH</th>
                  <th className="schedule-th">WAKTU</th>
                  <th className="schedule-th">RUANG</th>
                  <th className="schedule-th">DOSEN</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={schedule.id || index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td className="schedule-td schedule-td-kelas">{schedule.kelas}</td>
                    <td className="schedule-td schedule-td-hari">{schedule.hari}</td>
                    <td className="schedule-td schedule-td-matkul">{schedule.mata_kuliah}</td>
                    <td className="schedule-td schedule-td-waktu">{schedule.waktu}</td>
                    <td className="schedule-td schedule-td-ruang">{schedule.ruang}</td>
                    <td className="schedule-td schedule-td-dosen">{schedule.dosen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && hasSearched && schedules.length === 0 && (
        <div className="schedule-no-results">
          <p>Tidak ada jadwal ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default ClassScheduleSearch;
