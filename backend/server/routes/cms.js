const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Middleware untuk protect routes (kecuali /auth/login dan /health)
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await db.query('SELECT id, username, nama, email, role, aktif FROM cms_users WHERE id = ? AND aktif = 1', [decoded.userId]);
    if (!users.length) {
      return res.status(401).json({ error: 'Unauthorized - User not found or inactive' });
    }
    req.user = users[0];
    next();
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Middleware untuk require super_admin role
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden - Super Admin access required' });
  }
  next();
};

// ============ AUTH ============
// Login (POST /api/cms/auth/login)
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password diperlukan' });
    }
    const [users] = await db.query('SELECT * FROM cms_users WHERE username = ? AND aktif = 1', [username]);
    if (!users.length) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }
    const user = users[0];
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Password hash tidak ditemukan' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        email: user.email,
        role: user.role || 'admin'
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get current user (GET /api/cms/auth/me) - protected
router.get('/auth/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      nama: req.user.nama,
      email: req.user.email,
      role: req.user.role || 'admin'
    }
  });
});

// Logout (POST /api/cms/auth/logout) - client-side only (hapus token)
router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Cek koneksi database (GET /api/cms/health)
router.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, db: e.message });
  }
});

// Protect semua route CMS kecuali /auth/* dan /health
router.use((req, res, next) => {
  if (req.path.startsWith('/auth/') || req.path === '/health') {
    return next();
  }
  return requireAuth(req, res, next);
});

// Role-based access: Super Admin only routes
// Menu, Kategori, Dosen, Prodi, Mata Kuliah, Koordinator, Dosen PI, Jadwal (semua master data)
router.use('/menu', requireSuperAdmin);
router.use('/kategori', requireSuperAdmin);
router.use('/dosen', requireSuperAdmin);
router.use('/prodi', requireSuperAdmin);
router.use('/mata-kuliah', requireSuperAdmin);
router.use('/koordinator', requireSuperAdmin);
router.use('/dosen-pembimbing-pi', requireSuperAdmin);
router.use('/jadwal-kelas', requireSuperAdmin);
router.use('/jadwal-kuliah', requireSuperAdmin);
router.use('/jadwal-ujian', requireSuperAdmin);

// ============ KATEGORI ============
router.get('/kategori', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori_konten ORDER BY nama');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/kategori/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori_konten WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/kategori', async (req, res) => {
  try {
    const { nama, slug, deskripsi, icon } = req.body;
    const s = slug || slugify(nama);
    await db.query(
      'INSERT INTO kategori_konten (nama, slug, deskripsi, icon) VALUES (?, ?, ?, ?)',
      [nama || '', s, deskripsi || null, icon || null]
    );
    const [r] = await db.query('SELECT * FROM kategori_konten ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/kategori/:id', async (req, res) => {
  try {
    const { nama, slug, deskripsi, icon } = req.body;
    await db.query(
      'UPDATE kategori_konten SET nama=?, slug=?, deskripsi=?, icon=? WHERE id=?',
      [nama, slug, deskripsi, icon, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM kategori_konten WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/kategori/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM kategori_konten WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ MENU ============
router.get('/menu', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, k.nama as kategori_nama
      FROM menu_sidebar m
      LEFT JOIN kategori_konten k ON m.kategori_id = k.id
      ORDER BY m.tipe, m.urutan, m.id
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/menu/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, k.nama as kategori_nama
      FROM menu_sidebar m
      LEFT JOIN kategori_konten k ON m.kategori_id = k.id
      WHERE m.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/menu', async (req, res) => {
  // Edit Only Mode: Tidak dapat menambah menu baru
  res.status(403).json({ error: 'Mode Edit Only: Tidak dapat menambah menu baru. Hanya dapat mengedit menu yang sudah ada.' });
});

router.put('/menu/:id', async (req, res) => {
  try {
    const { kategori_id, parent_id, nama, slug, urutan, icon, tipe } = req.body;
    await db.query(
      'UPDATE menu_sidebar SET kategori_id=?, parent_id=?, nama=?, slug=?, urutan=?, icon=?, tipe=? WHERE id=?',
      [kategori_id || null, parent_id || null, nama, slug, urutan, icon, tipe, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM menu_sidebar WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM menu_sidebar WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Menu tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ PRODI ============
router.get('/prodi', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prodi ORDER BY jenjang, nama');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/prodi/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM prodi WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Prodi tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/prodi', async (req, res) => {
  try {
    const { kode, nama, jenjang, deskripsi, aktif } = req.body;
    await db.query(
      'INSERT INTO prodi (kode, nama, jenjang, deskripsi, aktif) VALUES (?, ?, ?, ?, ?)',
      [kode || '', nama || '', jenjang || 'S1', deskripsi || null, aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM prodi ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/prodi/:id', async (req, res) => {
  try {
    const { kode, nama, jenjang, deskripsi, aktif } = req.body;
    await db.query(
      'UPDATE prodi SET kode=?, nama=?, jenjang=?, deskripsi=?, aktif=? WHERE id=?',
      [kode, nama, jenjang, deskripsi, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM prodi WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Prodi tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/prodi/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM prodi WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Prodi tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ BERITA ============
router.get('/berita', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM berita ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/berita/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/berita', async (req, res) => {
  try {
    const { judul, slug, ringkasan, konten, gambar, published, featured } = req.body;
    const s = slug || slugify(judul);
    await db.query(
      'INSERT INTO berita (judul, slug, ringkasan, konten, gambar, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [judul || '', s, ringkasan || null, konten || '', gambar || null, published !== false ? 1 : 0, featured ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM berita ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/berita/:id', async (req, res) => {
  try {
    const { judul, slug, ringkasan, konten, gambar, published, featured } = req.body;
    await db.query(
      'UPDATE berita SET judul=?, slug=?, ringkasan=?, konten=?, gambar=?, published=?, featured=? WHERE id=?',
      [judul, slug, ringkasan, konten, gambar, published !== false ? 1 : 0, featured ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM berita WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/berita/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM berita WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ HALAMAN ============
router.get('/halaman', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, m.nama as menu_nama, k.nama as kategori_nama
      FROM halaman_konten h
      LEFT JOIN menu_sidebar m ON h.menu_id = m.id
      LEFT JOIN kategori_konten k ON h.kategori_id = k.id
      ORDER BY h.updated_at DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/halaman/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM halaman_konten WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Halaman tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/halaman', async (req, res) => {
  // Edit Only Mode: Tidak dapat menambah halaman baru
  res.status(403).json({ error: 'Mode Edit Only: Tidak dapat menambah halaman baru. Hanya dapat mengedit halaman yang sudah ada.' });
});

router.put('/halaman/:id', async (req, res) => {
  try {
    const { menu_id, kategori_id, judul, slug, konten, tipe_konten, meta_deskripsi, published } = req.body;
    await db.query(
      'UPDATE halaman_konten SET menu_id=?, kategori_id=?, judul=?, slug=?, konten=?, tipe_konten=?, meta_deskripsi=?, published=? WHERE id=?',
      [menu_id || null, kategori_id || null, judul, slug, konten, tipe_konten, meta_deskripsi, published !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM halaman_konten WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Halaman tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/halaman/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM halaman_konten WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Halaman tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ LAYANAN ============
router.get('/layanan', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM layanan ORDER BY urutan, id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/layanan/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM layanan WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/layanan', async (req, res) => {
  try {
    const { nama, slug, deskripsi, lokasi, telepon, email, jam_operasional, icon, urutan, aktif } = req.body;
    const s = slug || slugify(nama);
    await db.query(
      'INSERT INTO layanan (nama, slug, deskripsi, lokasi, telepon, email, jam_operasional, icon, urutan, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nama || '', s, deskripsi || '', lokasi || '', telepon || null, email || null, jam_operasional || '', icon || null, urutan != null ? urutan : 0, aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM layanan ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/layanan/:id', async (req, res) => {
  try {
    const { nama, slug, deskripsi, lokasi, telepon, email, jam_operasional, icon, urutan, aktif } = req.body;
    await db.query(
      'UPDATE layanan SET nama=?, slug=?, deskripsi=?, lokasi=?, telepon=?, email=?, jam_operasional=?, icon=?, urutan=?, aktif=? WHERE id=?',
      [nama, slug, deskripsi, lokasi, telepon, email, jam_operasional, icon, urutan, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM layanan WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/layanan/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM layanan WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ DOSEN ============
router.get('/dosen', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, p.nama as prodi_nama, p.kode as prodi_kode
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      ORDER BY d.nama
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/dosen/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, p.nama as prodi_nama, p.kode as prodi_kode
      FROM dosen d
      LEFT JOIN prodi p ON d.prodi_id = p.id
      WHERE d.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Dosen tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/dosen', async (req, res) => {
  try {
    const { nip, nama, gelar_depan, gelar_belakang, prodi_id, email, telepon, jabatan, aktif } = req.body;
    await db.query(
      'INSERT INTO dosen (nip, nama, gelar_depan, gelar_belakang, prodi_id, email, telepon, jabatan, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nip || '', nama || '', gelar_depan || null, gelar_belakang || null, prodi_id || null, email || null, telepon || null, jabatan || null, aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM dosen ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/dosen/:id', async (req, res) => {
  try {
    const { nip, nama, gelar_depan, gelar_belakang, prodi_id, email, telepon, jabatan, aktif } = req.body;
    await db.query(
      'UPDATE dosen SET nip=?, nama=?, gelar_depan=?, gelar_belakang=?, prodi_id=?, email=?, telepon=?, jabatan=?, aktif=? WHERE id=?',
      [nip, nama, gelar_depan, gelar_belakang, prodi_id || null, email, telepon, jabatan, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM dosen WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Dosen tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/dosen/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM dosen WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Dosen tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ MATA KULIAH ============
router.get('/mata-kuliah', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mk.*, p.nama as prodi_nama, p.kode as prodi_kode, p.jenjang
      FROM mata_kuliah mk
      LEFT JOIN prodi p ON mk.prodi_id = p.id
      ORDER BY p.jenjang, p.nama, mk.semester, mk.kode
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/mata-kuliah/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mk.*, p.nama as prodi_nama, p.kode as prodi_kode
      FROM mata_kuliah mk
      LEFT JOIN prodi p ON mk.prodi_id = p.id
      WHERE mk.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Mata kuliah tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/mata-kuliah', async (req, res) => {
  try {
    const { prodi_id, kode, nama, sks, semester, deskripsi, prasyarat, aktif } = req.body;
    await db.query(
      'INSERT INTO mata_kuliah (prodi_id, kode, nama, sks, semester, deskripsi, prasyarat, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [prodi_id, kode || '', nama || '', parseInt(sks) || 0, parseInt(semester) || 1, deskripsi || null, prasyarat || null, aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM mata_kuliah ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/mata-kuliah/:id', async (req, res) => {
  try {
    const { prodi_id, kode, nama, sks, semester, deskripsi, prasyarat, aktif } = req.body;
    await db.query(
      'UPDATE mata_kuliah SET prodi_id=?, kode=?, nama=?, sks=?, semester=?, deskripsi=?, prasyarat=?, aktif=? WHERE id=?',
      [prodi_id, kode, nama, parseInt(sks), parseInt(semester), deskripsi, prasyarat, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM mata_kuliah WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Mata kuliah tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/mata-kuliah/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM mata_kuliah WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Mata kuliah tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ KOORDINATOR ============
router.get('/koordinator', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM koordinator_mata_kuliah
      ORDER BY tahun_akademik DESC, semester, mata_kuliah, kelas
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/koordinator/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM koordinator_mata_kuliah WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Koordinator tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/koordinator', async (req, res) => {
  try {
    const { mata_kuliah, kelas, dosen_id, dosen_nama, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'INSERT INTO koordinator_mata_kuliah (mata_kuliah, kelas, dosen_id, dosen_nama, semester, tahun_akademik, aktif) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [mata_kuliah || '', kelas || '', dosen_id || null, dosen_nama || '', semester || 'Ganjil', tahun_akademik || '', aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM koordinator_mata_kuliah ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/koordinator/:id', async (req, res) => {
  try {
    const { mata_kuliah, kelas, dosen_id, dosen_nama, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'UPDATE koordinator_mata_kuliah SET mata_kuliah=?, kelas=?, dosen_id=?, dosen_nama=?, semester=?, tahun_akademik=?, aktif=? WHERE id=?',
      [mata_kuliah, kelas, dosen_id || null, dosen_nama, semester, tahun_akademik, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM koordinator_mata_kuliah WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Koordinator tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/koordinator/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM koordinator_mata_kuliah WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Koordinator tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ DOSEN PEMBIMBING PI ============
router.get('/dosen-pembimbing-pi', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM dosen_pembimbing_pi
      ORDER BY tahun_akademik DESC, semester, kelas, kelompok, nama_mhs
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/dosen-pembimbing-pi/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dosen_pembimbing_pi WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/dosen-pembimbing-pi', async (req, res) => {
  try {
    const { kelas, kelompok, npm, nama_mhs, dosen_pembimbing, dosen_id, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'INSERT INTO dosen_pembimbing_pi (kelas, kelompok, npm, nama_mhs, dosen_pembimbing, dosen_id, semester, tahun_akademik, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [kelas || '', kelompok || '', npm || '', nama_mhs || '', dosen_pembimbing || '', dosen_id || null, semester || 'Ganjil', tahun_akademik || '', aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM dosen_pembimbing_pi ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/dosen-pembimbing-pi/:id', async (req, res) => {
  try {
    const { kelas, kelompok, npm, nama_mhs, dosen_pembimbing, dosen_id, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'UPDATE dosen_pembimbing_pi SET kelas=?, kelompok=?, npm=?, nama_mhs=?, dosen_pembimbing=?, dosen_id=?, semester=?, tahun_akademik=?, aktif=? WHERE id=?',
      [kelas, kelompok, npm, nama_mhs, dosen_pembimbing, dosen_id || null, semester, tahun_akademik, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM dosen_pembimbing_pi WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/dosen-pembimbing-pi/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM dosen_pembimbing_pi WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ JADWAL KELAS ============
router.get('/jadwal-kelas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM jadwal_kelas
      ORDER BY tahun_akademik DESC, semester, kelas,
        CASE hari WHEN 'Senin' THEN 1 WHEN 'Selasa' THEN 2 WHEN 'Rabu' THEN 3 WHEN 'Kamis' THEN 4 WHEN 'Jumat' THEN 5 WHEN 'Sabtu' THEN 6 WHEN 'Minggu' THEN 7 ELSE 8 END,
        waktu
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/jadwal-kelas/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jadwal_kelas WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/jadwal-kelas', async (req, res) => {
  try {
    const { kelas, hari, mata_kuliah, waktu, ruang, dosen, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'INSERT INTO jadwal_kelas (kelas, hari, mata_kuliah, waktu, ruang, dosen, semester, tahun_akademik, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [kelas || '', hari || '', mata_kuliah || '', waktu || '', ruang || '', dosen || '', semester || null, tahun_akademik || null, aktif !== false ? 1 : 0]
    );
    const [r] = await db.query('SELECT * FROM jadwal_kelas ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/jadwal-kelas/:id', async (req, res) => {
  try {
    const { kelas, hari, mata_kuliah, waktu, ruang, dosen, semester, tahun_akademik, aktif } = req.body;
    await db.query(
      'UPDATE jadwal_kelas SET kelas=?, hari=?, mata_kuliah=?, waktu=?, ruang=?, dosen=?, semester=?, tahun_akademik=?, aktif=? WHERE id=?',
      [kelas, hari, mata_kuliah, waktu, ruang, dosen, semester, tahun_akademik, aktif !== false ? 1 : 0, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM jadwal_kelas WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/jadwal-kelas/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM jadwal_kelas WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ JADWAL KULIAH ============
router.get('/jadwal-kuliah', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT jk.*, mk.nama as mata_kuliah_nama, mk.kode as mata_kuliah_kode, d.nama as dosen_nama
      FROM jadwal_kuliah jk
      JOIN mata_kuliah mk ON jk.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON jk.dosen_id = d.id
      ORDER BY jk.tahun_akademik DESC, jk.semester, jk.hari, jk.jam_mulai
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/jadwal-kuliah/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT jk.*, mk.nama as mata_kuliah_nama, d.nama as dosen_nama
      FROM jadwal_kuliah jk
      JOIN mata_kuliah mk ON jk.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON jk.dosen_id = d.id
      WHERE jk.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/jadwal-kuliah', async (req, res) => {
  try {
    const { mata_kuliah_id, dosen_id, hari, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik } = req.body;
    await db.query(
      'INSERT INTO jadwal_kuliah (mata_kuliah_id, dosen_id, hari, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [mata_kuliah_id, dosen_id || null, hari || 'Senin', jam_mulai || '08:00', jam_selesai || '10:00', ruang || '', kampus || 'D', semester || '', tahun_akademik || '']
    );
    const [r] = await db.query('SELECT * FROM jadwal_kuliah ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/jadwal-kuliah/:id', async (req, res) => {
  try {
    const { mata_kuliah_id, dosen_id, hari, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik } = req.body;
    await db.query(
      'UPDATE jadwal_kuliah SET mata_kuliah_id=?, dosen_id=?, hari=?, jam_mulai=?, jam_selesai=?, ruang=?, kampus=?, semester=?, tahun_akademik=? WHERE id=?',
      [mata_kuliah_id, dosen_id || null, hari, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM jadwal_kuliah WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/jadwal-kuliah/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM jadwal_kuliah WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ JADWAL UJIAN ============
router.get('/jadwal-ujian', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ju.*, mk.nama as mata_kuliah_nama, mk.kode as mata_kuliah_kode, d.nama as dosen_nama
      FROM jadwal_ujian ju
      JOIN mata_kuliah mk ON ju.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON ju.dosen_id = d.id
      ORDER BY ju.tanggal, ju.jam_mulai
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/jadwal-ujian/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ju.*, mk.nama as mata_kuliah_nama, d.nama as dosen_nama
      FROM jadwal_ujian ju
      JOIN mata_kuliah mk ON ju.mata_kuliah_id = mk.id
      LEFT JOIN dosen d ON ju.dosen_id = d.id
      WHERE ju.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Jadwal ujian tidak ditemukan' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/jadwal-ujian', async (req, res) => {
  try {
    const { mata_kuliah_id, dosen_id, jenis_ujian, tanggal, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik } = req.body;
    await db.query(
      'INSERT INTO jadwal_ujian (mata_kuliah_id, dosen_id, jenis_ujian, tanggal, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [mata_kuliah_id, dosen_id || null, jenis_ujian || 'UTS', tanggal || null, jam_mulai || '08:00', jam_selesai || '10:00', ruang || '', kampus || 'D', semester || '', tahun_akademik || '']
    );
    const [r] = await db.query('SELECT * FROM jadwal_ujian ORDER BY id DESC LIMIT 1');
    res.status(201).json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/jadwal-ujian/:id', async (req, res) => {
  try {
    const { mata_kuliah_id, dosen_id, jenis_ujian, tanggal, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik } = req.body;
    await db.query(
      'UPDATE jadwal_ujian SET mata_kuliah_id=?, dosen_id=?, jenis_ujian=?, tanggal=?, jam_mulai=?, jam_selesai=?, ruang=?, kampus=?, semester=?, tahun_akademik=? WHERE id=?',
      [mata_kuliah_id, dosen_id || null, jenis_ujian, tanggal, jam_mulai, jam_selesai, ruang, kampus, semester, tahun_akademik, req.params.id]
    );
    const [r] = await db.query('SELECT * FROM jadwal_ujian WHERE id=?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Jadwal ujian tidak ditemukan' });
    res.json(r[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/jadwal-ujian/:id', async (req, res) => {
  try {
    const [r] = await db.query('DELETE FROM jadwal_ujian WHERE id=?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Jadwal ujian tidak ditemukan' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
