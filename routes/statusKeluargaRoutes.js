const { Router } = require('express');
const { getStatusKeluarga,
        getStatusKeluargaById,
        getStatusKeluargaOptions,
        addStatusKeluarga,
        updateStatusKeluarga,
        deleteStatusKeluarga
    } = require('../controller/statusKeluargaController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, getStatusKeluarga);
router.get('/options', verifyToken, getStatusKeluargaOptions);
router.get('/:id', verifyToken, getStatusKeluargaById);
router.post('/tambah-status-keluarga', verifyToken, verifyRole('admin'), addStatusKeluarga);
router.put('/:id', verifyToken, verifyRole('admin'), updateStatusKeluarga);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteStatusKeluarga);

module.exports = router;