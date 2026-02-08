// File ini handle koneksi ke database MySQL
// Kita pakai connection pooling supaya lebih efisien
// Connection pooling itu kayak punya beberapa koneksi yang siap dipakai, jadi gak perlu buka-tutup terus

const mysql = require('mysql2/promise'); // mysql2 dengan promise support (lebih modern dari callback)
require('dotenv').config(); // Load environment variables

// ============================================
// DATABASE CONFIGURATION
// ============================================
// Semua config kita ambil dari .env file untuk keamanan
// Jangan pernah hardcode credentials di sini ya! Itu bahaya banget
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Host MySQL (biasanya localhost)
  user: process.env.DB_USER || 'root', // Username MySQL
  password: process.env.DB_PASSWORD || '', // Password MySQL (kosong kalau gak ada password)
  database: process.env.DB_NAME || 'piam_db', // Nama database kita
  
  // Connection Pool Settings
  // Pool itu kayak kolam renang, kita punya beberapa koneksi yang siap dipakai
  waitForConnections: true, // Tunggu kalau semua koneksi sedang dipakai
  connectionLimit: 10, // Maksimal 10 koneksi sekaligus (cukup untuk development)
  queueLimit: 0 // Unlimited queue (kalau semua koneksi penuh, request akan antri)
};

// ============================================
// CREATE CONNECTION POOL
// ============================================
// Pool ini akan manage semua koneksi ke database
// Keuntungan pakai pool:
// 1. Lebih efisien - koneksi bisa dipakai ulang
// 2. Auto reconnect kalau koneksi putus
// 3. Load balancing - distribusi query ke beberapa koneksi
const pool = mysql.createPool(dbConfig);

// Export pool supaya bisa dipakai di file lain
// Jadi kalau ada file yang butuh akses database, tinggal require file ini
module.exports = pool;




