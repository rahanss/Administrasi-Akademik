const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all menus by type
router.get('/:tipe', async (req, res) => {
  try {
    const { tipe } = req.params;
    const [rows] = await db.query(`
      SELECT m.*, k.nama as kategori_nama
      FROM menu_sidebar m
      LEFT JOIN kategori_konten k ON m.kategori_id = k.id
      WHERE m.tipe = ?
      ORDER BY m.urutan ASC
    `, [tipe]);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, k.nama as kategori_nama
      FROM menu_sidebar m
      LEFT JOIN kategori_konten k ON m.kategori_id = k.id
      WHERE m.slug = ?
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




