import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Schedule.css';

const ExamSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAkademik, setTahunAkademik] = useState('2025/2026');
  const [jenis, setJenis] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, [semester, tahunAkademik, jenis]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/jadwal/ujian', {
        params: {
          semester,
          tahun_akademik: tahunAkademik,
          ...(jenis && { jenis })
        }
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching exam schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedByDate = schedules.reduce((acc, schedule) => {
    const date = schedule.tanggal;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="schedule-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="schedule-header">
        <h1 className="schedule-title">Jadwal Ujian</h1>
        <div className="schedule-filters">
          <select 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)}
            className="schedule-filter"
          >
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>
          <select 
            value={tahunAkademik} 
            onChange={(e) => setTahunAkademik(e.target.value)}
            className="schedule-filter"
          >
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>
          <select 
            value={jenis} 
            onChange={(e) => setJenis(e.target.value)}
            className="schedule-filter"
          >
            <option value="">Semua Jenis</option>
            <option value="UTS">UTS</option>
            <option value="UAS">UAS</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Memuat jadwal ujian...</div>
      ) : schedules.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada jadwal ujian untuk periode ini.</p>
        </div>
      ) : (
        <div className="schedule-list">
          {sortedDates.map(date => {
            const dateSchedules = groupedByDate[date];
            return (
              <div key={date} className="schedule-day">
                <h2 className="day-title">
                  {new Date(date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <div className="day-schedules">
                  {dateSchedules.map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                      <div className="schedule-time">
                        {schedule.jam_mulai} - {schedule.jam_selesai}
                      </div>
                      <div className="schedule-details">
                        <div className="schedule-badge">
                          {schedule.jenis_ujian}
                        </div>
                        <h3 className="schedule-course">{schedule.mata_kuliah_nama}</h3>
                        <div className="schedule-meta">
                          <span className="schedule-code">{schedule.mata_kuliah_kode}</span>
                          <span className="schedule-room">{schedule.ruang}</span>
                          <span className="schedule-campus">Kampus {schedule.kampus}</span>
                          {schedule.dosen_nama && (
                            <span className="schedule-lecturer">{schedule.dosen_nama}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamSchedule;

