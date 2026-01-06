-- PIAM Database Schema
-- MySQL Database untuk Sistem Informasi Akademik

CREATE DATABASE IF NOT EXISTS piam_db;
USE piam_db;

-- Tabel Kategori Konten
CREATE TABLE kategori_konten (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    deskripsi TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Menu Sidebar
CREATE TABLE menu_sidebar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kategori_id INT,
    parent_id INT NULL,
    nama VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    urutan INT DEFAULT 0,
    icon VARCHAR(50),
    tipe ENUM('akademik', 'panduan', 'layanan') NOT NULL,
    FOREIGN KEY (kategori_id) REFERENCES kategori_konten(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES menu_sidebar(id) ON DELETE CASCADE,
    INDEX idx_tipe (tipe),
    INDEX idx_urutan (urutan)
);

-- Tabel Halaman Konten
CREATE TABLE halaman_konten (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT,
    kategori_id INT,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    konten LONGTEXT NOT NULL,
    tipe_konten ENUM('narrative', 'list', 'table', 'card') DEFAULT 'narrative',
    meta_deskripsi TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menu_sidebar(id) ON DELETE SET NULL,
    FOREIGN KEY (kategori_id) REFERENCES kategori_konten(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_published (published)
);

-- Tabel Program Studi
CREATE TABLE prodi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenjang ENUM('D3', 'S1', 'S2', 'S3') NOT NULL,
    deskripsi TEXT,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_jenjang (jenjang),
    INDEX idx_aktif (aktif)
);

-- Tabel Mata Kuliah
CREATE TABLE mata_kuliah (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prodi_id INT NOT NULL,
    kode VARCHAR(20) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    sks INT NOT NULL,
    semester INT NOT NULL,
    deskripsi TEXT,
    prasyarat TEXT,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prodi_id) REFERENCES prodi(id) ON DELETE CASCADE,
    INDEX idx_prodi (prodi_id),
    INDEX idx_semester (semester),
    INDEX idx_aktif (aktif),
    UNIQUE KEY unique_kode_prodi (kode, prodi_id)
);

-- Tabel Dosen
CREATE TABLE dosen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nip VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    gelar_depan VARCHAR(50),
    gelar_belakang VARCHAR(50),
    prodi_id INT,
    email VARCHAR(255),
    telepon VARCHAR(20),
    jabatan VARCHAR(100),
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prodi_id) REFERENCES prodi(id) ON DELETE SET NULL,
    INDEX idx_prodi (prodi_id),
    INDEX idx_aktif (aktif)
);

-- Tabel Jadwal Kuliah
CREATE TABLE jadwal_kuliah (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mata_kuliah_id INT NOT NULL,
    dosen_id INT,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruang VARCHAR(50) NOT NULL,
    kampus VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    tahun_akademik VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE SET NULL,
    INDEX idx_hari (hari),
    INDEX idx_semester (semester, tahun_akademik)
);

-- Tabel Jadwal Ujian
CREATE TABLE jadwal_ujian (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mata_kuliah_id INT NOT NULL,
    dosen_id INT,
    jenis_ujian ENUM('UTS', 'UAS', 'UTS-UAS') NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruang VARCHAR(50) NOT NULL,
    kampus VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    tahun_akademik VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE SET NULL,
    INDEX idx_tanggal (tanggal),
    INDEX idx_jenis (jenis_ujian),
    INDEX idx_semester (semester, tahun_akademik)
);

-- Tabel Informasi Layanan
CREATE TABLE layanan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    deskripsi TEXT NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    telepon VARCHAR(20),
    email VARCHAR(255),
    jam_operasional TEXT NOT NULL,
    icon VARCHAR(50),
    urutan INT DEFAULT 0,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_urutan (urutan),
    INDEX idx_aktif (aktif)
);

-- Tabel Berita
CREATE TABLE berita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    ringkasan TEXT,
    konten LONGTEXT NOT NULL,
    gambar VARCHAR(255),
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (published),
    INDEX idx_featured (featured),
    INDEX idx_created_at (created_at)
);

-- Insert Data Sample

-- Kategori Konten
INSERT INTO kategori_konten (nama, slug, deskripsi, icon) VALUES
('Akademik', 'akademik', 'Informasi akademik dan perkuliahan', 'academic'),
('Panduan', 'panduan', 'Panduan administrasi akademik', 'guide'),
('Layanan', 'layanan', 'Informasi layanan kampus', 'service');

-- Menu Sidebar Akademik
INSERT INTO menu_sidebar (kategori_id, nama, slug, urutan, icon, tipe) VALUES
(1, 'Kalender Akademik', 'kalender-akademik', 1, 'calendar', 'akademik'),
(1, 'Daftar Mata Kuliah', 'daftar-mata-kuliah', 2, 'book', 'akademik'),
(1, 'Daftar Dosen Wali Kelas', 'daftar-dosen-wali', 3, 'users', 'akademik'),
(1, 'Koordinator Mata Kuliah', 'koordinator-mata-kuliah', 4, 'coordinate', 'akademik'),
(1, 'Dosen Pembimbing PI', 'dosen-pembimbing-pi', 5, 'mentor', 'akademik'),
(1, 'Jadwal Kuliah', 'jadwal-kuliah', 6, 'schedule', 'akademik'),
(1, 'Jadwal Ujian', 'jadwal-ujian', 7, 'exam', 'akademik'),
(1, 'Pengurusan Ujian Bentrok', 'ujian-bentrok', 8, 'conflict', 'akademik'),
(1, 'Formulir Rencana Studi', 'formulir-rencana-studi', 9, 'form', 'akademik');

-- Menu Sidebar Panduan
INSERT INTO menu_sidebar (kategori_id, nama, slug, urutan, icon, tipe) VALUES
(2, 'Pendaftaran & Registrasi', 'panduan-pendaftaran', 1, 'register', 'panduan'),
(2, 'Akademik', 'panduan-akademik', 2, 'academic', 'panduan'),
(2, 'Ujian & Penilaian', 'panduan-ujian', 3, 'exam', 'panduan'),
(2, 'Administrasi Umum', 'panduan-administrasi', 4, 'admin', 'panduan');

-- Halaman Konten - Kalender Akademik
INSERT INTO halaman_konten (menu_id, kategori_id, judul, slug, konten, tipe_konten) VALUES
(1, 1, 'Kalender Akademik', 'kalender-akademik', 
'<h2>Kalender Akademik</h2>
<p>Satu Tahun Akademik dibagi dalam dua semester yaitu perkuliahan pada Semester Ganjil dan Semester Genap. Semester Ganjil biasanya dimulai pada bulan September sampai dengan bulan Januari, sedangkan Semester Genap dimulai pada bulan Februari sampai dengan bulan Agustus.</p>
<p>Kalender akademik yang berisi kegiatan-kegiatan selama satu semester akan diumumkan pada awal semester melalui BAAK On_Line atau dengan cara ditempelkan di papan pengumuman dan di beberapa tempat strategis di berbagai kampus (Kampus A, C, D, E, G, dan H).</p>
<p><strong>Setiap mahasiswa wajib memperhatikan jadwal kegiatan yang tercantum dalam kalender akademik. Keterlambatan atau kelalaian dalam mengikuti kegiatan akademik akan berakibat mendapat sanksi akademik, skorsing, atau tidak diperkenankan mengikuti kegiatan akademik tertentu.</strong></p>
<h3>Kegiatan Akademik Semester Ganjil 2025/2026</h3>
<ul>
<li><strong>02 September 2025:</strong> Awal Semester Ganjil</li>
<li><strong>02-06 September 2025:</strong> Masa Perwalian dan Pengisian KRS</li>
<li><strong>09 September 2025:</strong> Kuliah Perdana</li>
<li><strong>16-20 September 2025:</strong> Masa Tambah/Batal Mata Kuliah</li>
<li><strong>07-12 Oktober 2025:</strong> Ujian Tengah Semester (UTS)</li>
<li><strong>28 Oktober 2025:</strong> Batas Akhir Pengumpulan Nilai UTS</li>
<li><strong>10-14 November 2025:</strong> Evaluasi Perkuliahan Tengah Semester</li>
<li><strong>01-06 Desember 2025:</strong> Ujian Akhir Semester (UAS)</li>
</ul>', 
'narrative');

-- Program Studi Sample
INSERT INTO prodi (kode, nama, jenjang, deskripsi) VALUES
('D3-AK', 'Akuntansi Komputer', 'D3', 'Program studi D3 Akuntansi Komputer'),
('D3-MI', 'Manajemen Informatika', 'D3', 'Program studi D3 Manajemen Informatika'),
('D3-MK', 'Manajemen Keuangan', 'D3', 'Program studi D3 Manajemen Keuangan'),
('D3-MP', 'Manajemen Pemasaran', 'D3', 'Program studi D3 Manajemen Pemasaran'),
('D3-TK', 'Teknik Komputer', 'D3', 'Program studi D3 Teknik Komputer'),
('S1-SI', 'Sistem Informasi', 'S1', 'Program studi S1 Sistem Informasi'),
('S1-SK', 'Sistem Komputer', 'S1', 'Program studi S1 Sistem Komputer'),
('S1-AK', 'Akuntansi', 'S1', 'Program studi S1 Akuntansi'),
('S1-MN', 'Manajemen', 'S1', 'Program studi S1 Manajemen'),
('S1-ES', 'Ekonomi Syariah', 'S1', 'Program studi S1 Ekonomi Syariah'),
('S1-TE', 'Teknik Elektro', 'S1', 'Program studi S1 Teknik Elektro'),
('S1-TI', 'Teknik Industri', 'S1', 'Program studi S1 Teknik Industri'),
('S1-IF', 'Informatika', 'S1', 'Program studi S1 Informatika'),
('S1-TM', 'Teknik Mesin', 'S1', 'Program studi S1 Teknik Mesin'),
('S1-AG', 'Agroteknologi', 'S1', 'Program studi S1 Agroteknologi'),
('S1-TS', 'Teknik Sipil', 'S1', 'Program studi S1 Teknik Sipil'),
('S1-TA', 'Teknik Arsitektur', 'S1', 'Program studi S1 Teknik Arsitektur');

-- Mata Kuliah Sample (S1 Informatika)
INSERT INTO mata_kuliah (prodi_id, kode, nama, sks, semester, deskripsi) VALUES
(13, 'IF101', 'Pemrograman Dasar', 3, 1, 'Mata kuliah dasar pemrograman'),
(13, 'IF102', 'Matematika Diskrit', 3, 1, 'Matematika untuk ilmu komputer'),
(13, 'IF103', 'Algoritma dan Struktur Data', 3, 2, 'Struktur data dan algoritma'),
(13, 'IF104', 'Basis Data', 3, 2, 'Konsep dan implementasi basis data'),
(13, 'IF201', 'Pemrograman Web', 3, 3, 'Pengembangan aplikasi web'),
(13, 'IF202', 'Jaringan Komputer', 3, 3, 'Konsep jaringan komputer');

-- Dosen Sample
INSERT INTO dosen (nip, nama, gelar_depan, gelar_belakang, prodi_id, email, telepon, jabatan) VALUES
('198501012010121001', 'Ahmad Susanto', 'Dr.', 'M.Kom', 13, 'ahmad.susanto@university.ac.id', '081234567890', 'Dosen Tetap'),
('197803152005012001', 'Siti Rahmawati', 'Prof. Dr.', 'M.T', 6, 'siti.rahmawati@university.ac.id', '081234567891', 'Guru Besar'),
('198209202008121002', 'Budi Santoso', 'Dr.', 'M.Sc', 13, 'budi.santoso@university.ac.id', '081234567892', 'Dosen Tetap'),
('197512102003121003', 'Wahyu Hidayat', 'Dra.', 'M.Kom', 6, 'wahyu.hidayat@university.ac.id', '081234567893', 'Dosen Tetap'),
('198706182012122001', 'Rina Kurniawati', 'Dr.', 'M.T', 13, 'rina.kurniawati@university.ac.id', '081234567894', 'Dosen Tetap'),
('198001052006041001', 'Joko', 'Ir.', 'M.Kom', 6, 'joko.s@university.ac.id', '081234567895', 'Dosen Tetap');

-- Layanan Sample
INSERT INTO layanan (nama, slug, deskripsi, lokasi, telepon, email, jam_operasional, icon, urutan) VALUES
('Bagian Akademik', 'bagian-akademik', 'Layanan administrasi akademik, KRS, transkrip nilai, dan surat keterangan', 'Gedung Rektorat Lantai 1', '(021) 1234-5678', 'akademik@university.ac.id', 'Senin - Jumat: 08:00 - 16:00', 'academic', 1),
('Bagian Kemahasiswaan', 'bagian-kemahasiswaan', 'Layanan organisasi mahasiswa, beasiswa, dan kegiatan kemahasiswaan', 'Gedung Rektorat Lantai 2', '(021) 1234-5679', 'kemahasiswaan@university.ac.id', 'Senin - Jumat: 08:00 - 16:00', 'student', 2),
('Perpustakaan', 'perpustakaan', 'Layanan peminjaman buku, jurnal digital, dan ruang baca', 'Gedung Perpustakaan Pusat', '(021) 1234-5680', 'perpustakaan@university.ac.id', 'Senin - Jumat: 08:00 - 20:00, Sabtu: 08:00 - 14:00', 'library', 3),
('Laboratorium Komputer', 'laboratorium-komputer', 'Fasilitas praktikum dan akses komputer untuk mahasiswa', 'Gedung Fakultas Lantai 3', '(021) 1234-5681', 'labkom@university.ac.id', 'Senin - Jumat: 08:00 - 17:00', 'lab', 4),
('Unit Layanan Keuangan', 'unit-layanan-keuangan', 'Pembayaran UKT, beasiswa, dan administrasi keuangan', 'Gedung Rektorat Lantai 1', '(021) 1234-5682', 'keuangan@university.ac.id', 'Senin - Jumat: 08:00 - 15:00', 'finance', 5),
('Pusat Karir', 'pusat-karir', 'Layanan konsultasi karir, magang, dan informasi lowongan kerja', 'Gedung Career Center', '(021) 1234-5683', 'career@university.ac.id', 'Senin - Jumat: 09:00 - 16:00', 'career', 6);

-- Berita Sample
INSERT INTO berita (judul, slug, ringkasan, konten, published, featured, created_at) VALUES
('Pengumuman Jadwal Ujian Tengah Semester Ganjil 2025/2026', 'pengumuman-jadwal-uts-ganjil-2025-2026', 'Pengumuman resmi jadwal Ujian Tengah Semester untuk Semester Ganjil Tahun Akademik 2025/2026', '<h2>Pengumuman Jadwal Ujian Tengah Semester Ganjil 2025/2026</h2><p>Dengan ini diumumkan kepada seluruh mahasiswa bahwa jadwal Ujian Tengah Semester (UTS) untuk Semester Ganjil Tahun Akademik 2025/2026 akan dilaksanakan pada:</p><p><strong>Tanggal:</strong> 07-12 Oktober 2025</p><p><strong>Waktu:</strong> Sesuai jadwal yang telah ditentukan per mata kuliah</p><p>Seluruh mahasiswa diharapkan untuk mempersiapkan diri dengan baik dan mengikuti ujian sesuai jadwal yang telah ditetapkan. Keterlambatan atau ketidakhadiran akan mengakibatkan tidak dapat mengikuti ujian.</p><p>Untuk informasi lebih lanjut, silakan hubungi Bagian Akademik atau koordinator mata kuliah masing-masing.</p>', TRUE, TRUE, '2025-12-05 10:00:00'),
('Informasi Beasiswa Prestasi untuk Mahasiswa Berprestasi Tahun 2025', 'informasi-beasiswa-prestasi-2025', 'Pembukaan pendaftaran beasiswa prestasi untuk mahasiswa berprestasi tahun 2025', '<h2>Informasi Beasiswa Prestasi untuk Mahasiswa Berprestasi Tahun 2025</h2><p>Universitas membuka kesempatan bagi mahasiswa berprestasi untuk mendapatkan beasiswa prestasi tahun 2025. Beasiswa ini diberikan kepada mahasiswa yang memiliki prestasi akademik maupun non-akademik yang membanggakan.</p><h3>Persyaratan:</h3><ul><li>IPK minimal 3.50</li><li>Tidak sedang menerima beasiswa lain</li><li>Mengikuti kegiatan kemahasiswaan aktif</li><li>Mengisi formulir pendaftaran</li></ul><h3>Dokumen yang Diperlukan:</h3><ul><li>Transkrip nilai</li><li>Sertifikat prestasi (jika ada)</li><li>Surat rekomendasi dari dosen wali</li><li>Foto copy KTM</li></ul><p>Pendaftaran dibuka hingga 31 Desember 2025. Informasi lebih lanjut dapat menghubungi Bagian Kemahasiswaan.</p>', TRUE, TRUE, '2025-12-03 09:00:00'),
('Perpanjangan Masa Pengisian KRS Hingga 20 September 2025', 'perpanjangan-masa-pengisian-krs-september-2025', 'Diumumkan perpanjangan masa pengisian Kartu Rencana Studi (KRS) hingga tanggal 20 September 2025', '<h2>Perpanjangan Masa Pengisian KRS Hingga 20 September 2025</h2><p>Berdasarkan pertimbangan dan permohonan dari berbagai pihak, dengan ini diumumkan bahwa masa pengisian Kartu Rencana Studi (KRS) untuk Semester Ganjil Tahun Akademik 2025/2026 diperpanjang hingga:</p><p><strong>Tanggal Akhir:</strong> 20 September 2025</p><p>Seluruh mahasiswa diharapkan untuk segera menyelesaikan pengisian KRS sebelum batas waktu yang telah ditetapkan. Keterlambatan pengisian KRS akan mengakibatkan tidak dapat mengikuti perkuliahan pada semester ini.</p><p>Untuk bantuan teknis pengisian KRS, silakan menghubungi Bagian Akademik atau melalui sistem online BAAK.</p>', TRUE, FALSE, '2025-11-28 14:00:00'),
('Seminar Nasional: Teknologi dan Inovasi di Era Digital - Pendaftaran Dibuka', 'seminar-nasional-teknologi-inovasi-digital-2025', 'Pembukaan pendaftaran Seminar Nasional dengan tema Teknologi dan Inovasi di Era Digital', '<h2>Seminar Nasional: Teknologi dan Inovasi di Era Digital - Pendaftaran Dibuka</h2><p>Universitas dengan bangga mengumumkan penyelenggaraan Seminar Nasional dengan tema "Teknologi dan Inovasi di Era Digital" yang akan dilaksanakan pada:</p><p><strong>Tanggal:</strong> 15 Desember 2025</p><p><strong>Waktu:</strong> 08:00 - 17:00 WIB</p><p><strong>Tempat:</strong> Auditorium Utama Universitas</p><h3>Pembicara:</h3><ul><li>Prof. Dr. Ahmad Susanto, M.Kom - Pakar Teknologi Informasi</li><li>Dr. Siti Rahmawati, M.T - Ahli Sistem Informasi</li><li>Ir. Budi Santoso, M.Sc - Praktisi Industri Digital</li></ul><h3>Topik Pembahasan:</h3><ul><li>Perkembangan Teknologi Digital Terkini</li><li>Inovasi dalam Sistem Informasi</li><li>Transformasi Digital di Berbagai Sektor</li><li>Peluang Karir di Era Digital</li></ul><p>Pendaftaran dibuka mulai 25 November 2025. Biaya pendaftaran: Rp 50.000 untuk mahasiswa, Rp 100.000 untuk umum.</p><p>Informasi pendaftaran: seminar@university.ac.id atau hubungi Bagian Kemahasiswaan.</p>', TRUE, FALSE, '2025-11-25 11:00:00');

