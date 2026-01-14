import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Schedule.css';

const ClassSchedule = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/halaman/jadwal-kuliah');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const waktuKuliah = [
    { jam: 1, pukul: '07.30 - 08.30' },
    { jam: 2, pukul: '08.30 - 09.30' },
    { jam: 3, pukul: '09.30 - 10.30' },
    { jam: 4, pukul: '10.30 - 11.30' },
    { jam: 5, pukul: '11.30 - 12.30' },
    { jam: 6, pukul: '12.30 - 13.30' },
    { jam: 7, pukul: '13.30 - 14.30' },
    { jam: 8, pukul: '14.30 - 15.30' },
    { jam: 9, pukul: '15.30 - 16.30' },
    { jam: 10, pukul: '16.30 - 17.30' },
    { jam: 11, pukul: '17.30 - 18.30' },
    { jam: 12, pukul: '18.30 - 19.30' },
    { jam: 13, pukul: '19.30 - 20.30' },
    { jam: 14, pukul: '20.30 - 21.30' }
  ];


  return (
    <div className="schedule-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Kembali ke Beranda
      </button>
      
      <div className="schedule-header">
        <h1 className="schedule-title">Jadwal Kuliah</h1>
      </div>

      {loading ? (
        <div className="schedule-loading">
          <LoadingSpinner />
        </div>
      ) : content && (() => {
        const konten = content.konten;
        const introEnd = konten.indexOf('<h3>Cara Membaca Jadwal Kuliah</h3>');
        const introContent = introEnd > 0 ? konten.substring(0, introEnd) : konten.split('<h3>Waktu Kuliah</h3>')[0] + konten.split('<h3>Waktu Kuliah</h3>')[1]?.split('<h3>Cara Membaca Jadwal Kuliah</h3>')[0] || konten;
        const guideStart = konten.indexOf('<h3>Cara Membaca Jadwal Kuliah</h3>');
        const guideContent = guideStart >= 0 ? konten.substring(guideStart) : '';

        return (
          <>
            <div 
              className="schedule-content-intro"
              dangerouslySetInnerHTML={{ __html: introContent }}
            />
            
            <div className="schedule-two-column">
              <div className="schedule-column-left">
                <div className="schedule-time-table-container">
                  <h3 className="schedule-section-title">Tabel Waktu Kuliah</h3>
                  <div className="time-table-wrapper">
                    <table className="time-table">
                      <thead>
                        <tr>
                          <th>Jam ke -</th>
                          <th>Pukul</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waktuKuliah.map(item => (
                          <tr key={item.jam}>
                            <td>Jam ke - {item.jam}</td>
                            <td>{item.pukul}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="schedule-column-right">
                {guideContent && (
                  <div 
                    className="schedule-content-guide"
                    dangerouslySetInnerHTML={{ __html: guideContent }}
                  />
                )}
              </div>
            </div>
          </>
        );
      })()}

    </div>
  );
};

export default ClassSchedule;
