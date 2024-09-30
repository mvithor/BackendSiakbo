const { Router } = require('express');
const { getCatatanKonselingIndividuByStudentId } = require('../../controller/dashboardSiswa/catatanKonselingController');
const { verifyToken, verifyRole } = require('../../middleware/verify')
const router = Router();

router.get('/', verifyToken, verifyRole('siswa'), getCatatanKonselingIndividuByStudentId );

module.exports = router;

