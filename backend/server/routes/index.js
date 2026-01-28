const express = require('express');
const router = express.Router();

const halamanRoutes = require('./halaman');
const menuRoutes = require('./menu');
const prodiRoutes = require('./prodi');
const mataKuliahRoutes = require('./mataKuliah');
const dosenRoutes = require('./dosen');
const jadwalRoutes = require('./jadwal');
const layananRoutes = require('./layanan');
const beritaRoutes = require('./berita');
const koordinatorRoutes = require('./koordinator');
const dosenPembimbingPIRoutes = require('./dosenPembimbingPI');
const cmsRoutes = require('./cms');

router.use('/cms', cmsRoutes);
router.use('/halaman', halamanRoutes);
router.use('/menu', menuRoutes);
router.use('/prodi', prodiRoutes);
router.use('/mata-kuliah', mataKuliahRoutes);
router.use('/dosen', dosenRoutes);
router.use('/jadwal', jadwalRoutes);
router.use('/layanan', layananRoutes);
router.use('/berita', beritaRoutes);
router.use('/koordinator', koordinatorRoutes);
router.use('/dosen-pembimbing-pi', dosenPembimbingPIRoutes);

module.exports = router;

