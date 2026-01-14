const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all dosen
router.get('/', async (req, res) => {
  try {
    const { prodi_id } = req.query;
    let query = `
      SELECT d.*, p.nama as prodi_nama, p.kode as prodi_kode
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      WHERE d.aktif = TRUE
    `;
    const params = [];
    
    if (prodi_id) {
      query += ' AND d.prodi_id = ?';
      params.push(prodi_id);
    }
    
    query += ' ORDER BY d.nama';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dosen by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, p.nama as prodi_nama, p.kode as prodi_kode
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      WHERE d.id = ? AND d.aktif = TRUE
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dosen not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




