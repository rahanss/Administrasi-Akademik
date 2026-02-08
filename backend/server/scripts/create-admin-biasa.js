const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminBiasa() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'piam_db'
  });

  try {
    // Generate hash untuk password 'admin321'
    const passwordHash = await bcrypt.hash('admin321', 10);
    console.log('Password hash untuk admin321:', passwordHash);

    // Cek apakah user admin_biasa sudah ada
    const [existing] = await connection.query(
      'SELECT id, username FROM cms_users WHERE username = ?',
      ['admin_biasa']
    );

    if (existing.length > 0) {
      console.log('User admin_biasa sudah ada. Mengupdate password...');
      await connection.query(
        'UPDATE cms_users SET password_hash = ?, role = ?, aktif = 1 WHERE username = ?',
        [passwordHash, 'admin', 'admin_biasa']
      );
      console.log(' Password admin_biasa berhasil diupdate!');
    } else {
      console.log('User admin_biasa belum ada. Membuat user baru...');
      await connection.query(
        'INSERT INTO cms_users (username, password_hash, nama, email, role, aktif) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin_biasa', passwordHash, 'Admin Biasa', 'admin_biasa@university.ac.id', 'admin', 1]
      );
      console.log(' User admin_biasa berhasil dibuat!');
    }

    // Verifikasi password
    const [users] = await connection.query(
      'SELECT password_hash FROM cms_users WHERE username = ?',
      ['admin_biasa']
    );
    if (users.length > 0) {
      const match = await bcrypt.compare('admin321', users[0].password_hash);
      console.log(' Verifikasi password:', match ? 'BERHASIL' : 'GAGAL');
    }

    console.log('\nLogin credentials:');
    console.log('Username: admin_biasa');
    console.log('Password: admin321');
    console.log('Role: admin (akses terbatas)');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n Tabel cms_users belum ada!');
      console.error('Jalankan database/schema.sql terlebih dahulu.');
    }
  } finally {
    await connection.end();
  }
}

createAdminBiasa();