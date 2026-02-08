import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getErrorMessage, logError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [loadingBerita, setLoadingBerita] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/berita', {
          params: { limit: 3 }
        });
        setBeritaList(response.data || []);
      } catch (error) {
        logError('Homepage - fetchBerita', error);
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        setBeritaList([]);
      } finally {
        setLoadingBerita(false);
      }
    };

    fetchBerita();
  }, []);

  const cards = [
    {
      id: 1,
      title: 'Jadwal Kelas',
      icon: '/icons/JamKuliah.png',
      route: '/jadwal-kelas',
      description: 'Cari jadwal berdasarkan kelas atau dosen'
    },
    {
      id: 2,
      title: 'Kalender Akademik',
      icon: '/icons/KalenderAkademik.png',
      route: '/kalender-akademik',
      description: 'Lihat jadwal kegiatan akademik semester'
    },
    {
      id: 3,
      title: 'Daftar Mata Kuliah',
      icon: '/icons/DaftarMatkul.png',
      route: '/daftar-mata-kuliah',
      description: 'Jelajahi mata kuliah per program studi'
    },
    {
      id: 4,
      title: 'Daftar Dosen',
      icon: '/icons/DaftarDosen.png',
      route: '/daftar-dosen-wali',
      description: 'Informasi dosen wali kelas dan pembimbing'
    },
    {
      id: 5,
      title: 'Koordinator Mata Kuliah',
      icon: '/icons/DaftarMatkul.png',
      route: '/koordinator-mata-kuliah',
      description: 'Daftar koordinator mata kuliah per semester'
    },
    {
      id: 6,
      title: 'Dosen Pembimbing PI',
      icon: '/icons/DaftarDosen.png',
      route: '/dosen-pembimbing-pi',
      description: 'Daftar dosen pembimbing penulisan ilmiah'
    },
    {
      id: 7,
      title: 'Jadwal Kuliah',
      icon: '/icons/JamKuliah.png',
      route: '/jadwal-kuliah',
      description: 'Jadwal perkuliahan semester ini'
    },
    {
      id: 8,
      title: 'Jadwal Ujian',
      icon: '/icons/JadwalUjian.png',
      route: '/jadwal-ujian',
      description: 'Jadwal UTS dan UAS'
    },
    {
      id: 9,
      title: 'Pengurusan Ujian Bentrok',
      icon: '/icons/JadwalUjian.png',
      route: '/ujian-bentrok',
      description: 'Prosedur pengurusan ujian yang bentrok'
    },
    {
      id: 10,
      title: 'Formulir Rencana Studi',
      icon: '/icons/FormRencanaStudi.png',
      route: '/formulir-rencana-studi',
      description: 'Informasi tentang KRS dan FRS'
    },
    {
      id: 10,
      title: 'Panduan Administrasi',
      icon: '/icons/PanduanAdministrasi.png',
      route: '/panduan-administrasi',
      description: 'Panduan lengkap administrasi akademik'
    },
    {
      id: 11,
      title: 'Informasi Layanan',
      icon: '/icons/InformasiLayanan.png',
      route: '/informasi-layanan',
      description: 'Layanan kampus dan kontak'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <h2 className="homepage-title">Selamat Datang di PIAM</h2>
        <p className="homepage-subtitle">Pusat Informasi Akademik Mahasiswa</p>

        <div className="homepage-main-grid">
          <div className="homepage-left">
            <div className="homepage-calendar-section">
              <div className="homepage-calendar-header">
                <h3 className="homepage-section-title">
                  Kalender Akademik Ganjil (PTA) 2025/2026
                </h3>
              </div>

              <div className="homepage-calendar">
                <table className="calendar-table">
                  <thead>
                    <tr>
                      <th className="calendar-header-date">Tanggal</th>
                      <th className="calendar-header-event">Kegiatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="calendar-date">22 - 26 September 2025</td>
                      <td className="calendar-event">
                        Pengenalan Kehidupan Kampus bagi Mahasiswa Baru (PKKMB)
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">22 - 27 September 2025</td>
                      <td className="calendar-event">
                        Kursus/Pelatihan Berbasis Kompetensi untuk kelas 2 dan 4 jenjang S1, kelas 3 jenjang D3
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">29 September - 6 Desember 2025</td>
                      <td className="calendar-event">
                        Perkuliahan Sebelum Ujian Tengah Semester (UTS)
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">25 September - 25 Oktober 2025</td>
                      <td className="calendar-event">
                        Pendistribusian FRS ke mahasiswa melalui situs www.baak.gunadarma.ac.id
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">29 September - 25 Oktober 2025</td>
                      <td className="calendar-event">
                        Kegiatan Pengisian dan Cetak KRS online (termasuk Batal/Ubah/Tambah)
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">22 November 2025</td>
                      <td className="calendar-event">
                        Batas akhir Cetak KRS Online
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">8 - 24 Desember 2025</td>
                      <td className="calendar-event">
                        Ujian Tengah Semester (UTS)
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">15 Desember 2025</td>
                      <td className="calendar-event">
                        Batas akhir pengurusan cuti akademik
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">25 Desember 2025 - 1 Januari 2026</td>
                      <td className="calendar-event">
                        Libur Hari Natal dan Tahun Baru
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">2 Januari - 29 Januari 2026</td>
                      <td className="calendar-event">
                        Perkuliahan setelah UTS
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">2 - 7 Februari 2026</td>
                      <td className="calendar-event">
                        Ujian Utama
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">9 - 21 Februari 2026</td>
                      <td className="calendar-event">
                        Ujian Akhir Semester (UAS)
                      </td>
                    </tr>
                    <tr>
                      <td className="calendar-date">23 - 28 Februari 2026</td>
                      <td className="calendar-event">
                        Kursus/Pelatihan Berbasis Kompetensi untuk kelas 1 dan kelas 3 jenjang S1
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabel Pelayanan Loket BAAK */}
              <div className="homepage-service-table-section">
                <h3 className="homepage-section-title">
                  Pelayanan di Loket BAAK 1-8
                </h3>
                <div className="homepage-service-table">
                  <table className="service-table">
                    <thead>
                      <tr>
                        <th className="service-header-hari">Hari</th>
                        <th className="service-header-waktu">Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="service-hari">Senin-Kamis</td>
                        <td className="service-waktu">10.00-15.00 WIB</td>
                      </tr>
                      <tr>
                        <td className="service-hari">(Istirahat)</td>
                        <td className="service-waktu">12.00-13.00 WIB</td>
                      </tr>
                      <tr>
                        <td className="service-hari">Jum'at</td>
                        <td className="service-waktu">10.00-14.30 WIB</td>
                      </tr>
                      <tr>
                        <td className="service-hari">(Istirahat)</td>
                        <td className="service-waktu">11.30-13.30 WIB</td>
                      </tr>
                      <tr>
                        <td className="service-hari">Sabtu</td>
                        <td className="service-waktu">09.30-12.00 WIB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="homepage-right">
            <div className="homepage-cards">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="homepage-card"
                  onClick={() => handleCardClick(card.route)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card.route);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Buka halaman ${card.title}`}
                >
                  <div className="homepage-card-icon" aria-hidden="true">
                    <img 
                      src={card.icon} 
                      alt={`${card.title} icon`}
                      className="card-icon-image"
                    />
                  </div>
                  <h3 className="homepage-card-title">{card.title}</h3>
                  <p className="homepage-card-description">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bagian Berita */}
        <div className="homepage-news-section">
          <div className="homepage-news-header">
            <h3 className="homepage-section-title">Berita</h3>
            <button 
              className="homepage-news-view-all"
              onClick={() => navigate('/berita')}
              aria-label="Lihat semua berita"
            >
              lihat semua berita
            </button>
          </div>
          {loadingBerita ? (
            <LoadingSpinner message="Memuat berita..." size="small" />
          ) : error ? (
            <ErrorMessage message={error} dismissible onDismiss={() => setError(null)} />
          ) : beritaList.length === 0 ? (
            <div className="news-empty" role="status">Belum ada berita tersedia</div>
          ) : (
            <div className="homepage-news-list">
              {beritaList.map((berita) => (
                <div key={berita.id} className="news-item">
                  <div className="news-date">
                    {berita.created_at ? new Date(berita.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : '-'}
                  </div>
                  <div className="news-content">
                    <h4 className="news-title">{berita.judul || 'Judul tidak tersedia'}</h4>
                    {berita.ringkasan && (
                      <p className="news-summary">{berita.ringkasan}</p>
                    )}
                    {berita.slug && (
                    <button
                      className="news-read-more"
                      onClick={() => navigate(`/berita/${berita.slug}`)}
                      aria-label={`Baca lebih lanjut tentang ${berita.judul}`}
                    >
                      Lebih lanjut
                    </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

