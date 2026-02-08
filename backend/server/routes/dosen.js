// Route untuk handle semua request terkait data dosen
// File ini handle 2 jenis request: public (untuk mahasiswa) dan admin (untuk CMS)
// Public hanya bisa lihat data terbatas, admin bisa lihat semua data termasuk NIP

const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Import connection pool
const jwt = require('jsonwebtoken'); // Untuk verify JWT token

// JWT Secret untuk verify token
// Ini harus sama dengan yang dipakai saat generate token di login
// Jangan lupa ganti di production ya!
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================
// HELPER FUNCTION: CHECK CMS ADMIN
// ============================================
// Function ini cek apakah request datang dari admin CMS yang sudah login
// Caranya: cek apakah ada JWT token yang valid di header Authorization
// Kalau ada token valid, berarti admin yang login
// Kalau gak ada atau invalid, berarti public user (mahasiswa)
const isCmsAdmin = (req) => {
  try {
    // Ambil token dari header Authorization
    // Format header: "Authorization: Bearer <token>"
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Kalau gak ada token, berarti bukan admin
    if (!token) return false;
    
    // Verify token dengan JWT_SECRET
    // Kalau token valid, verify() akan return payload
    // Kalau invalid, akan throw error (ditangkap di catch)
    jwt.verify(token, JWT_SECRET);
    
    // Kalau sampai sini, berarti token valid = admin
    return true;
  } catch {
    // Kalau ada error (token invalid/expired), berarti bukan admin
    return false;
  }
};

// ============================================
// GET ALL DOSEN
// ============================================
// Endpoint: GET /api/dosen
// 
// Privacy Feature:
// - Public (mahasiswa): Hanya bisa lihat nama, email, jabatan, prodi
// - Admin CMS: Bisa lihat semua data termasuk NIP dan telepon
//
// Query Parameters:
// - prodi_id (optional): Filter berdasarkan program studi
//
// Contoh request:
// - Public: GET /api/dosen
// - Admin: GET /api/dosen (dengan token di header)
// - Filter: GET /api/dosen?prodi_id=1
router.get('/', async (req, res) => {
  try {
    // Ambil query parameter prodi_id (kalau ada)
    const { prodi_id } = req.query;
    
    // Cek apakah request dari admin CMS
    const isAdmin = isCmsAdmin(req);
    
    // Tentukan field apa aja yang akan di-select berdasarkan role
    // Kalau admin: ambil semua field (d.*) termasuk NIP dan telepon
    // Kalau public: ambil field terbatas (tanpa NIP dan telepon)
    // Ini penting untuk privacy - kita gak mau NIP dosen terlihat oleh mahasiswa
    let selectFields = isAdmin 
      ? 'd.*, p.nama as prodi_nama, p.kode as prodi_kode' // Admin: semua data
      : 'd.id, d.nama, d.gelar_depan, d.gelar_belakang, d.email, d.jabatan, d.prodi_id, p.nama as prodi_nama, p.kode as prodi_kode'; // Public: data terbatas
    
    // Build SQL query
    // LEFT JOIN dengan prodi supaya kita bisa ambil nama dan kode prodi
    // WHERE d.aktif = TRUE: hanya ambil dosen yang aktif
    let query = `
      SELECT ${selectFields}
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      WHERE d.aktif = TRUE
    `;
    const params = []; // Array untuk parameterized query (prevent SQL injection)
    
    // Kalau ada filter prodi_id, tambahkan ke query
    if (prodi_id) {
      query += ' AND d.prodi_id = ?';
      params.push(prodi_id);
    }
    
    // Sort berdasarkan nama (A-Z)
    query += ' ORDER BY d.nama';
    
    // Execute query
    // db.query() return array dengan 2 elemen: [rows, fields]
    // Kita cuma butuh rows, jadi pakai destructuring [rows]
    const [rows] = await db.query(query, params);
    
    // Return hasil query sebagai JSON
    res.json(rows);
  } catch (error) {
    // Kalau ada error, return error message
    // Status 500 = Internal Server Error
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET DOSEN BY ID
// ============================================
// Endpoint: GET /api/dosen/:id
// 
// Sama seperti GET all dosen, tapi ini untuk ambil 1 dosen berdasarkan ID
// Privacy feature sama: admin bisa lihat semua, public hanya data terbatas
//
// Contoh request:
// - GET /api/dosen/1
router.get('/:id', async (req, res) => {
  try {
    // Cek apakah request dari admin
    const isAdmin = isCmsAdmin(req);
    
    // Tentukan field yang akan di-select (sama seperti GET all)
    const selectFields = isAdmin
      ? 'd.*, p.nama as prodi_nama, p.kode as prodi_kode' // Admin: semua data
      : 'd.id, d.nama, d.gelar_depan, d.gelar_belakang, d.email, d.jabatan, d.prodi_id, p.nama as prodi_nama, p.kode as prodi_kode'; // Public: data terbatas
    
    // Query untuk ambil 1 dosen berdasarkan ID
    // req.params.id itu ID yang dikirim di URL (contoh: /api/dosen/1 → id = 1)
    // Pakai parameterized query (? placeholder) untuk prevent SQL injection
    const [rows] = await db.query(`
      SELECT ${selectFields}
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      WHERE d.id = ? AND d.aktif = TRUE
    `, [req.params.id]);
    
    // Kalau gak ketemu (rows.length === 0), return 404 Not Found
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dosen not found' });
    }
    
    // Return dosen pertama (rows[0]) karena kita cuma expect 1 hasil
    res.json(rows[0]);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: error.message });
  }
});

// Export router supaya bisa dipakai di index.js
module.exports = router;

module.exports = router;




