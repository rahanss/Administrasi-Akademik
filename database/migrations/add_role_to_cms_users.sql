-- Migration: Tambah kolom role ke cms_users
-- Role: 'super_admin' (akses penuh) atau 'admin' (akses terbatas)

ALTER TABLE cms_users 
ADD COLUMN role ENUM('admin', 'super_admin') DEFAULT 'admin' AFTER email;

-- Update user admin yang sudah ada menjadi super_admin
UPDATE cms_users SET role = 'super_admin' WHERE username = 'admin';

-- Index untuk performa query
CREATE INDEX idx_role ON cms_users(role);
