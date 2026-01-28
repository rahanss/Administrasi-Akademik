const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'piam_db'
  });

  try {
    // Generate hash untuk password 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);
    console.log('Password hash untuk admin123:', passwordHash);

    // Cek apakah user admin sudah ada
    const [existing] = await connection.query(
      'SELECT id, username FROM cms_users WHERE username = ?',
      ['admin']
    );

    if (existing.length > 0) {
      console.log('User admin sudah ada. Mengupdate password...');
      await connection.query(
        'UPDATE cms_users SET password_hash = ?, aktif = 1 WHERE username = ?',
        [passwordHash, 'admin']
      );
      console.log('✓ Password admin berhasil diupdate!');
    } else {
      console.log('User admin belum ada. Membuat user baru...');
      await connection.query(
        'INSERT INTO cms_users (username, password_hash, nama, email, aktif) VALUES (?, ?, ?, ?, ?)',
        ['admin', passwordHash, 'Administrator', 'admin@university.ac.id', 1]
      );
      console.log('✓ User admin berhasil dibuat!');
    }

    // Verifikasi password
    const [users] = await connection.query(
      'SELECT password_hash FROM cms_users WHERE username = ?',
      ['admin']
    );
    if (users.length > 0) {
      const match = await bcrypt.compare('admin123', users[0].password_hash);
      console.log('✓ Verifikasi password:', match ? 'BERHASIL' : 'GAGAL');
    }

    console.log('\nLogin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n❌ Tabel cms_users belum ada!');
      console.error('Jalankan database/schema.sql terlebih dahulu.');
    }
  } finally {
    await connection.end();
  }
}

createAdminUser();
