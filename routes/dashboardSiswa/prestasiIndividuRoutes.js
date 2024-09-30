const {Router} = require('express');
const { getPrestasiIndividuByStudentId} = require('../../controller/dashboardSiswa/prestasiIndividuController');
const { verifyToken, verifyRole } = require('../../middleware/verify');
const router = Router();

router.get('/', verifyToken, verifyRole('siswa'), getPrestasiIndividuByStudentId);

module.exports = router;