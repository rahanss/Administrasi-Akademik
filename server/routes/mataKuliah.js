const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all mata kuliah
router.get('/', async (req, res) => {
  try {
    const { prodi_id } = req.query;
    let query = `
      SELECT mk.*, p.nama as prodi_nama, p.kode as prodi_kode, p.jenjang
      FROM mata_kuliah mk
      JOIN prodi p ON mk.prodi_id = p.id
      WHERE mk.aktif = TRUE
    `;
    const params = [];
    
    if (prodi_id) {
      query += ' AND mk.prodi_id = ?';
      params.push(prodi_id);
    }
    
    query += ' ORDER BY mk.semester, mk.kode';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mata kuliah by prodi grouped by semester
router.get('/prodi/:prodiId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mk.*, p.nama as prodi_nama, p.kode as prodi_kode, p.jenjang
      FROM mata_kuliah mk
      JOIN prodi p ON mk.prodi_id = p.id
      WHERE mk.prodi_id = ? AND mk.aktif = TRUE
      ORDER BY mk.semester, mk.kode
    `, [req.params.prodiId]);
    
    // Group by semester
    const grouped = rows.reduce((acc, mk) => {
      const semester = mk.semester;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(mk);
      return acc;
    }, {});
    
    res.json({
      prodi: rows[0] ? {
        id: rows[0].prodi_id,
        nama: rows[0].prodi_nama,
        kode: rows[0].prodi_kode,
        jenjang: rows[0].jenjang
      } : null,
      mataKuliah: grouped
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


