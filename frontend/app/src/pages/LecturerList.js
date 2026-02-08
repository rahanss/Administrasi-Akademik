// Halaman untuk menampilkan daftar dosen
// Fitur utama:
// - Menampilkan semua dosen aktif
// - Search/filter dosen berdasarkan nama, NIP, prodi, email, atau jabatan
// - Privacy: NIP dan telepon hanya muncul untuk admin CMS
//
// Data yang ditampilkan:
// - Public: Nama, Email, Jabatan, Program Studi
// - Admin: Semua data termasuk NIP dan Telepon

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios (akan otomatis pakai interceptor dari axiosConfig)
import './LecturerList.css';

const LecturerList = () => {
  // Hook untuk navigasi programmatic (redirect ke halaman lain)
  const navigate = useNavigate();
  
  // State untuk menyimpan data dosen dari API
  const [dosenList, setDosenList] = useState([]);
  
  // State untuk menyimpan hasil filter (dosen yang sesuai dengan search term)
  const [filteredDosenList, setFilteredDosenList] = useState([]);
  
  // State untuk search term (input dari user)
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk loading indicator (true saat fetch data, false setelah selesai)
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH DATA DOSEN
  // ============================================
  // useEffect ini jalan sekali saat component pertama kali di-render
  // Fungsinya: fetch data dosen dari API
  //
  // Dependency array [] artinya hanya jalan sekali (saat mount)
  // Kalau mau fetch ulang, bisa tambahkan dependency atau panggil function manual
  useEffect(() => {
    // Function async untuk fetch data
    const fetchDosen = async () => {
      try {
        // Request ke API untuk ambil data dosen
        // Axios interceptor akan otomatis attach token (kalau user sudah login)
        // Backend akan return data lengkap (dengan NIP) kalau ada token
        // Backend akan return data terbatas (tanpa NIP) kalau gak ada token
        const response = await axios.get('/api/dosen');
        
        // Simpan data ke state
        setDosenList(response.data);
        setFilteredDosenList(response.data); // Awalnya semua dosen ditampilkan
      } catch (error) {
        // Kalau ada error, log ke console untuk debugging
        console.error('Error fetching dosen:', error);
        // Bisa tambahkan toast notification atau error message ke user di sini
      } finally {
        // Set loading ke false setelah fetch selesai (sukses atau error)
        setLoading(false);
      }
    };

    // Panggil function fetch
    fetchDosen();
  }, []); // Empty dependency array = hanya jalan sekali saat mount

  // ============================================
  // SEARCH/FILTER FUNCTIONALITY
  // ============================================
  // useEffect ini jalan setiap kali searchTerm atau dosenList berubah
  // Fungsinya: filter dosen berdasarkan search term yang diinput user
  //
  // Search bisa berdasarkan:
  // - Nama dosen
  // - NIP (hanya muncul kalau admin)
  // - Program studi
  // - Email
  // - Jabatan
  // - Nama lengkap dengan gelar
  useEffect(() => {
    // Kalau search term kosong, tampilkan semua dosen
    if (searchTerm.trim() === '') {
      setFilteredDosenList(dosenList);
    } else {
      // Filter dosen yang sesuai dengan search term
      // Pakai toLowerCase() supaya case-insensitive (gak peduli huruf besar/kecil)
      const filtered = dosenList.filter(dosen => {
        const searchLower = searchTerm.toLowerCase();
        
        // Buat nama lengkap dengan gelar (contoh: "Dr. Ahmad Susanto, M.Kom")
        const fullName = `${dosen.gelar_depan || ''} ${dosen.nama} ${dosen.gelar_belakang || ''}`.toLowerCase();
        
        // Cek apakah search term ada di salah satu field
        // Pakai includes() untuk partial match (tidak harus exact match)
        return (
          dosen.nama.toLowerCase().includes(searchLower) || // Cek nama
          (dosen.nip && dosen.nip.toLowerCase().includes(searchLower)) || // Cek NIP (kalau ada)
          (dosen.prodi_nama && dosen.prodi_nama.toLowerCase().includes(searchLower)) || // Cek program studi
          (dosen.email && dosen.email.toLowerCase().includes(searchLower)) || // Cek email
          (dosen.jabatan && dosen.jabatan.toLowerCase().includes(searchLower)) || // Cek jabatan
          fullName.includes(searchLower) // Cek nama lengkap dengan gelar
        );
      });
      
      // Simpan hasil filter ke state
      setFilteredDosenList(filtered);
    }
  }, [searchTerm, dosenList]); // Jalan setiap kali searchTerm atau dosenList berubah

  // ============================================
  // LOADING STATE
  // ============================================
  // Tampilkan loading indicator saat fetch data
  // Ini penting untuk UX - user tahu kalau data sedang dimuat
  if (loading) {
    return (
      <div className="lecturer-page">
        <div className="loading">Memuat daftar dosen...</div>
      </div>
    );
  }

  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className="lecturer-page">
      {/* Header dengan tombol kembali dan title */}
      <div className="lecturer-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Kembali ke Beranda
        </button>
        <h1 className="lecturer-title">Daftar Nama Dosen</h1>
      </div>

      {/* Search section */}
      <div className="lecturer-search-section">
        <div className="lecturer-search-wrapper">
          {/* Input search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm saat user ketik
            placeholder="Cari dosen berdasarkan nama, NIP, program studi, email, atau jabatan..."
            className="lecturer-search-input"
          />
          {/* Tombol clear search (muncul kalau ada search term) */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')} // Clear search term
              className="lecturer-search-clear"
              aria-label="Clear search" // Accessibility: label untuk screen reader
            >
              
            </button>
          )}
        </div>
        {/* Info hasil pencarian (muncul kalau ada search term) */}
        {searchTerm && (
          <div className="lecturer-search-result-info">
            Menampilkan {filteredDosenList.length} dari {dosenList.length} dosen
          </div>
        )}
      </div>

      {/* Grid untuk menampilkan card dosen */}
      <div className="lecturer-grid">
        {/* Empty state: tampilkan pesan kalau gak ada data atau hasil pencarian */}
        {filteredDosenList.length === 0 && !loading ? (
          <div className="lecturer-empty">
            {searchTerm ? 'Tidak ada dosen yang sesuai dengan pencarian.' : 'Tidak ada data dosen.'}
          </div>
        ) : (
          // Map setiap dosen menjadi card
          filteredDosenList.map(dosen => (
            <div key={dosen.id} className="lecturer-card">
              {/* Nama dosen dengan gelar */}
              <h3 className="lecturer-name">
                {dosen.gelar_depan ? `${dosen.gelar_depan} ` : ''}
                {dosen.nama}
                {dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : ''}
              </h3>
              <div className="lecturer-info">
                {/* NIP - hanya muncul kalau ada di data (admin bisa lihat, public tidak) */}
                {/* Backend akan return NIP kalau request dari admin (dengan token) */}
                {/* Backend tidak akan return NIP kalau request dari public (tanpa token) */}
                {dosen.nip && (
                  <div className="lecturer-field">
                    <span className="field-label">NIP:</span>
                    <span className="field-value">{dosen.nip}</span>
                  </div>
                )}
                {/* Program Studi */}
                {dosen.prodi_nama && (
                  <div className="lecturer-field">
                    <span className="field-label">Program Studi:</span>
                    <span className="field-value">{dosen.prodi_nama}</span>
                  </div>
                )}
                {/* Email */}
                {dosen.email && (
                  <div className="lecturer-field">
                    <span className="field-label"> Email:</span>
                    <span className="field-value">{dosen.email}</span>
                  </div>
                )}
                {/* Telepon - hanya muncul kalau ada di data (admin bisa lihat, public tidak) */}
                {/* Sama seperti NIP, backend akan filter berdasarkan token */}
                {dosen.telepon && (
                  <div className="lecturer-field">
                    <span className="field-label"> Telepon:</span>
                    <span className="field-value">{dosen.telepon}</span>
                  </div>
                )}
                {/* Jabatan */}
                {dosen.jabatan && (
                  <div className="lecturer-field">
                    <span className="field-label">Jabatan:</span>
                    <span className="field-value">{dosen.jabatan}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Export component supaya bisa dipakai di App.js
export default LecturerList;

