const { Router } = require('express');
const { getWaliSiswa,
        getStatusKeluarga,
        getWaliSiswaById,
        updateWaliSiswa
      } = require('../controller/WaliSiswaController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, verifyRole('admin'), getWaliSiswa);
router.get('/', verifyToken, getWaliSiswaById);
router.get('/status-keluarga/options', getStatusKeluarga )
router.put('/:id', verifyToken, verifyRole('wali siswa'), updateWaliSiswa);

module.exports = router;