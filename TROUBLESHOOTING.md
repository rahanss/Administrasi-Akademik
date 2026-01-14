# Troubleshooting Guide

## Proxy Error: Could not proxy request

Jika Anda mendapatkan error:
```
Proxy error: Could not proxy request /api/berita?limit=3 from localhost:3000 to http://localhost:5000/.
```

### Solusi:

1. **Pastikan Backend Server Berjalan**
   
   Buka terminal baru dan jalankan:
   ```bash
   cd backend/server
   node index.js
   ```
   
   Atau dari root project:
   ```bash
   npm run backend
   ```
   
   Anda harus melihat pesan:
   ```
   Server running on port 5000
   API available at http://localhost:5000/api
   ```

2. **Pastikan Database MySQL Berjalan**
   
   - Pastikan MySQL service berjalan
   - Pastikan database `piam_db` sudah dibuat
   - Pastikan tabel sudah dibuat dengan menjalankan `database/schema.sql`

3. **Cek Konfigurasi Database**
   
   Buat file `.env` di `backend/server/` dengan isi:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=piam_db
   PORT=5000
   ```

4. **Restart Frontend**
   
   Setelah backend berjalan, restart frontend:
   ```bash
   cd frontend/app
   npm start
   ```

5. **Cek Port 5000**
   
   Pastikan tidak ada aplikasi lain yang menggunakan port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```

### Menjalankan Keduanya Bersamaan

Dari root project, jalankan:
```bash
npm run dev
```

Ini akan menjalankan backend dan frontend secara bersamaan.
