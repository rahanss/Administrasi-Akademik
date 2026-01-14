const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET semua dosen pembimbing PI
router.get('/', async (req, res) => {
  try {
    const { search, semester, tahun, kelas, kelompok } = req.query;
    
    let query = `
      SELECT 
        id,
        kelas,
        kelompok,
        npm,
        nama_mhs,
        dosen_pembimbing,
        semester,
        tahun_akademik
      FROM dosen_pembimbing_pi
      WHERE aktif = 1
    `;
    
    const params = [];
    
    if (semester) {
      query += ' AND semester = ?';
      params.push(semester);
    }
    
    if (tahun) {
      query += ' AND tahun_akademik = ?';
      params.push(tahun);
    }
    
    if (kelas) {
      query += ' AND kelas = ?';
      params.push(kelas);
    }
    
    if (kelompok) {
      query += ' AND kelompok = ?';
      params.push(kelompok);
    }
    
    if (search) {
      query += ' AND (kelas LIKE ? OR dosen_pembimbing LIKE ? OR nama_mhs LIKE ? OR npm LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    query += ' ORDER BY kelas ASC, kelompok ASC, nama_mhs ASC';
    
    const [results] = await db.execute(query, params);
    
    if (!results || !Array.isArray(results)) {
      return res.status(500).json({ error: 'Format data tidak valid' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching dosen pembimbing PI:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ error: 'Koneksi database gagal. Pastikan database sudah berjalan dan konfigurasi benar.' });
    }
    res.status(500).json({ error: 'Gagal mengambil data dosen pembimbing PI' });
  }
});

// GET dosen pembimbing PI berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [results] = await db.execute(
      'SELECT * FROM dosen_pembimbing_pi WHERE id = ? AND aktif = 1',
      [id]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching dosen pembimbing PI:', error);
    res.status(500).json({ error: 'Gagal mengambil data dosen pembimbing PI' });
  }
});

module.exports = router;
