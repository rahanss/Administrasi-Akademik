const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, m.nama as menu_nama, k.nama as kategori_nama
      FROM halaman_konten h
      LEFT JOIN menu_sidebar m ON h.menu_id = m.id
      LEFT JOIN kategori_konten k ON h.kategori_id = k.id
      WHERE h.published = TRUE
      ORDER BY h.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get page by slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, m.nama as menu_nama, m.slug as menu_slug, k.nama as kategori_nama
      FROM halaman_konten h
      LEFT JOIN menu_sidebar m ON h.menu_id = m.id
      LEFT JOIN kategori_konten k ON h.kategori_id = k.id
      WHERE h.slug = ? AND h.published = TRUE
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pages by menu
router.get('/menu/:menuSlug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, m.nama as menu_nama, k.nama as kategori_nama
      FROM halaman_konten h
      JOIN menu_sidebar m ON h.menu_id = m.id
      LEFT JOIN kategori_konten k ON h.kategori_id = k.id
      WHERE m.slug = ? AND h.published = TRUE
      ORDER BY h.created_at DESC
    `, [req.params.menuSlug]);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




