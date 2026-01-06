import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Schedule.css';

const ClassSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAkademik, setTahunAkademik] = useState('2025/2026');

  useEffect(() => {
    fetchSchedules();
  }, [semester, tahunAkademik]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/jadwal/kuliah', {
        params: {
          semester,
          tahun_akademik: tahunAkademik
        }
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const groupedByDay = days.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.hari === day);
    return acc;
  }, {});

  return (
    <div className="schedule-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      <div className="schedule-header">
        <h1 className="schedule-title">Jadwal Kuliah</h1>
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
        </div>
      </div>

      {loading ? (
        <div className="loading">Memuat jadwal kuliah...</div>
      ) : schedules.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada jadwal kuliah untuk periode ini.</p>
        </div>
      ) : (
        <div className="schedule-content">
          <div className="schedule-info">
            <h3>Waktu Kuliah</h3>
            <p>Dalam satu hari, waktu kuliah dibagi menjadi empat belas (14) jam kuliah:</p>
            <ul>
              <li>Waktu kuliah kelas pagi akan dimulai jam ke-1 s/d jam ke-10;</li>
              <li>Waktu kuliah kelas malam akan dimulai jam ke-11 s/d jam ke-14.</li>
            </ul>
            <div className="time-table">
              <table>
                <thead>
                  <tr>
                    <th>Jam ke -</th>
                    <th>Pukul</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6,7,8,9,10].map(jam => (
                    <tr key={jam}>
                      <td>{jam}</td>
                      <td>
                        {String(6 + jam).padStart(2, '0')}:30 - {String(7 + jam).padStart(2, '0')}:30
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="schedule-list">
            {days.map(day => {
              const daySchedules = groupedByDay[day];
              if (!daySchedules || daySchedules.length === 0) return null;

              return (
                <div key={day} className="schedule-day">
                  <h2 className="day-title">{day}</h2>
                  <div className="day-schedules">
                    {daySchedules.map(schedule => (
                      <div key={schedule.id} className="schedule-item">
                        <div className="schedule-time">
                          {schedule.jam_mulai} - {schedule.jam_selesai}
                        </div>
                        <div className="schedule-details">
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
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;

