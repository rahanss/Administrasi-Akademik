const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all berita (with limit for homepage)
router.get('/', async (req, res) => {
  try {
    const { limit, featured } = req.query;
    let query = `
      SELECT id, judul, slug, ringkasan, gambar, created_at, featured
      FROM berita
      WHERE published = TRUE OR published = 1
    `;
    const params = [];
    
    if (featured === 'true') {
      query += ' AND (featured = TRUE OR featured = 1)';
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const [rows] = await db.query(query, params);
    console.log(`Found ${rows.length} berita`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching berita:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get berita by slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM berita
      WHERE slug = ? AND published = TRUE
    `, [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Berita not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

