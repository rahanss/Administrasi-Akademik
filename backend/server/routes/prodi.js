const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all program studi
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM prodi
      WHERE aktif = TRUE
      ORDER BY jenjang, nama
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prodi by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM prodi
      WHERE id = ? AND aktif = TRUE
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Program studi not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




