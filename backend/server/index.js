// Entry point untuk backend server PIAM
// File ini adalah tempat dimana semua magic terjadi - server Express dimulai dari sini
// Dibuat dengan penuh semangat untuk tugas Pemrograman Web 

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables dari file .env
const routes = require('./routes'); // Import semua routes yang sudah kita buat

// Inisialisasi Express app
// Express adalah framework yang sangat membantu untuk bikin API dengan mudah
const app = express();
const PORT = process.env.PORT || 5000; // Ambil port dari .env, kalau gak ada pakai 5000

// ============================================
// MIDDLEWARE SETUP
// ============================================
// Middleware itu kayak filter yang jalan sebelum request masuk ke route handler
// Urutannya penting lho, jadi jangan diacak-acak ya!

// CORS - ini penting banget! Tanpa ini, frontend React kita gak bisa akses API
// CORS itu singkatan dari Cross-Origin Resource Sharing
// Intinya, kita kasih izin frontend (yang jalan di port 3000) untuk akses backend (port 5000)
app.use(cors());

// express.json() - untuk parse request body yang formatnya JSON
// Jadi kalau frontend kirim data JSON, kita bisa langsung pakai req.body
app.use(express.json());

// express.urlencoded() - untuk parse request body yang formatnya URL-encoded
// Biasanya dipakai untuk form submission
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES SETUP
// ============================================
// Semua route API kita taruh di folder routes/
// Jadi kalau ada request ke /api/*, akan di-handle oleh routes yang sesuai
// Contoh: /api/berita → routes/berita.js, /api/cms/* → routes/cms.js
app.use('/api', routes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
// Endpoint sederhana untuk cek apakah server masih hidup
// Berguna banget untuk monitoring atau testing
// Coba akses http://localhost:5000/health di browser, harusnya muncul JSON
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PIAM API Server is running' });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
// Ini adalah middleware terakhir yang akan handle semua error
// Kalau ada error di route manapun yang gak di-handle, akan masuk ke sini
// Penting banget untuk prevent server crash dan kasih response yang user-friendly
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error ke console untuk debugging
  res.status(500).json({ error: 'Something went wrong!' }); // Kasih response error ke client
});

// ============================================
// START SERVER
// ============================================
// Ini dia, moment of truth! Server kita mulai jalan di sini
// '0.0.0.0' artinya server bisa diakses dari mana aja (localhost, IP lokal, dll)
// Kalau cuma 'localhost', cuma bisa diakses dari komputer yang sama
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  // Kalau muncul pesan ini, berarti server sudah jalan dengan baik! 
});




