const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get jadwal kuliah
router.get('/kuliah', async (req, res) => {
  try {
    const { semester, tahun_akademik } = req.query;
    let query = `
      SELECT jk.*, 
        mk.nama as mata_kuliah_nama, mk.kode as mata_kuliah_kode,
        d.nama as dosen_nama, d.nip as dosen_nip,
        p.nama as prodi_nama
      FROM jadwal_kuliah jk
      JOIN mata_kuliah mk ON jk.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON jk.dosen_id = d.id
      JOIN prodi p ON mk.prodi_id = p.id
      WHERE 1=1
    `;
    const params = [];
    
    if (semester) {
      query += ' AND jk.semester = ?';
      params.push(semester);
    }
    
    if (tahun_akademik) {
      query += ' AND jk.tahun_akademik = ?';
      params.push(tahun_akademik);
    }
    
    query += ' ORDER BY jk.hari, jk.jam_mulai';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get jadwal ujian
router.get('/ujian', async (req, res) => {
  try {
    const { semester, tahun_akademik, jenis } = req.query;
    let query = `
      SELECT ju.*, 
        mk.nama as mata_kuliah_nama, mk.kode as mata_kuliah_kode,
        d.nama as dosen_nama, d.nip as dosen_nip,
        p.nama as prodi_nama
      FROM jadwal_ujian ju
      JOIN mata_kuliah mk ON ju.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON ju.dosen_id = d.id
      JOIN prodi p ON mk.prodi_id = p.id
      WHERE 1=1
    `;
    const params = [];
    
    if (semester) {
      query += ' AND ju.semester = ?';
      params.push(semester);
    }
    
    if (tahun_akademik) {
      query += ' AND ju.tahun_akademik = ?';
      params.push(tahun_akademik);
    }
    
    if (jenis) {
      query += ' AND ju.jenis_ujian = ?';
      params.push(jenis);
    }
    
    query += ' ORDER BY ju.tanggal, ju.jam_mulai';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


