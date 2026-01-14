const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all layanan
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM layanan
      WHERE aktif = TRUE
      ORDER BY urutan ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get layanan by slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM layanan
      WHERE slug = ? AND aktif = TRUE
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Layanan not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




