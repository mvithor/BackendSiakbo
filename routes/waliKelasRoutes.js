const { Router } = require('express');
const { getWaliKelas,
        getWaliKelasById,
        addWaliKelas,
        updateWaliKelas,
        deleteWaliKelas,
        getWaliKelasWithKelas
    } = require('../controller/waliKelasController');
const { verifyToken, verifyRole } = require ('../middleware/verify');
const router = Router();

router.get('/', getWaliKelas);
router.get('/withkelas', verifyToken, verifyRole('guru'), getWaliKelasWithKelas);
router.get('/:id', getWaliKelasById);
router.post('/tambah-wali-kelas', verifyToken, verifyRole('admin'), addWaliKelas);
router.put('/:id', verifyToken, verifyRole('admin'), updateWaliKelas);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteWaliKelas);

module.exports = router;