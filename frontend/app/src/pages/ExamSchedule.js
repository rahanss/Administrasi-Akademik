import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Schedule.css';

const ExamSchedule = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchSchedules();
  }, []);

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const response = await axios.get('/api/halaman/jadwal-ujian');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching exam content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/jadwal/ujian');
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
      </div>

      {!contentLoading && content && (
        <div
          className="schedule-content-intro"
          dangerouslySetInnerHTML={{ __html: content.konten }}
        />
      )}

      {loading ? (
        <div className="loading">Memuat jadwal ujian...</div>
      ) : (
        schedules.length > 0 && (
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
        )
      )}
    </div>
  );
};

export default ExamSchedule;

