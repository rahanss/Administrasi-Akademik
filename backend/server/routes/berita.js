// Route untuk handle semua request terkait berita
// Public routes - bisa diakses semua orang tanpa authentication

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendErrorResponse } = require('../utils/errorHandler');
const { sanitizeString } = require('../utils/validators');

// ============================================
// GET ALL BERITA
// ============================================
// Endpoint: GET /api/berita
// Query Parameters:
// - limit (optional): Limit jumlah berita
// - featured (optional): Filter berita featured (true/false)
router.get('/', async (req, res) => {
  try {
    const { limit, featured } = req.query;
    
    // Build query
    let query = `
      SELECT id, judul, slug, ringkasan, gambar, created_at, featured
      FROM berita
      WHERE published = TRUE OR published = 1
    `;
    const params = [];
    
    // Filter featured berita
    if (featured === 'true') {
      query += ' AND (featured = TRUE OR featured = 1)';
    }
    
    // Order by created_at DESC (terbaru dulu)
    query += ' ORDER BY created_at DESC';
    
    // Limit results (untuk pagination atau homepage)
    if (limit) {
      const limitNum = parseInt(limit);
      // Validasi limit (maksimal 100 untuk prevent abuse)
      if (limitNum > 0 && limitNum <= 100) {
        query += ' LIMIT ?';
        params.push(limitNum);
      }
    }
    
    // Execute query
    const [rows] = await db.query(query, params);
    res.json(rows || []);
  } catch (error) {
    sendErrorResponse(res, error, req);
  }
});

// ============================================
// GET BERITA BY SLUG
// ============================================
// Endpoint: GET /api/berita/:slug
// Mendapatkan detail berita berdasarkan slug
router.get('/:slug', async (req, res) => {
  try {
    // Sanitize slug untuk prevent SQL injection
    const slug = sanitizeString(req.params.slug);
    
    if (!slug) {
      return res.status(400).json({ error: 'Slug tidak valid' });
    }
    
    // Query database
    const [rows] = await db.query(`
      SELECT * FROM berita
      WHERE slug = ? AND (published = TRUE OR published = 1)
    `, [slug]);
    
    // Kalau tidak ditemukan, return 404
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }
    
    // Return berita pertama
    res.json(rows[0]);
  } catch (error) {
    sendErrorResponse(res, error, req);
  }
});

module.exports = router;

