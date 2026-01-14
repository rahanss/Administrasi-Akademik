const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET semua koordinator mata kuliah
router.get('/', async (req, res) => {
  try {
    const { search, semester, tahun } = req.query;
    
    let query = `
      SELECT 
        id,
        mata_kuliah,
        kelas,
        dosen_nama,
        semester,
        tahun_akademik
      FROM koordinator_mata_kuliah
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
    
    if (search) {
      query += ' AND (mata_kuliah LIKE ? OR kelas LIKE ? OR dosen_nama LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    query += ' ORDER BY mata_kuliah ASC, kelas ASC';
    
    const [results] = await db.execute(query, params);
    
    if (!results || !Array.isArray(results)) {
      return res.status(500).json({ error: 'Format data tidak valid' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching koordinator:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ error: 'Koneksi database gagal. Pastikan database sudah berjalan dan konfigurasi benar.' });
    }
    res.status(500).json({ error: 'Gagal mengambil data koordinator mata kuliah' });
  }
});

// GET koordinator berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [results] = await db.execute(
      'SELECT * FROM koordinator_mata_kuliah WHERE id = ? AND aktif = 1',
      [id]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Koordinator tidak ditemukan' });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching koordinator:', error);
    res.status(500).json({ error: 'Gagal mengambil data koordinator' });
  }
});

module.exports = router;
