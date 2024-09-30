const {Router} = require('express');
const { getBimbingan,
        getBimbinganById,
        addBimbingan,
        updateBimbingan,
        deleteBimbingan
    } = require('../controller/bimbinganController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, getBimbingan);
router.get('/:id', verifyToken, getBimbinganById);
router.put('/:id', verifyToken, verifyRole('admin'), updateBimbingan);
router.post('/tambah-bidang-bimbingan', verifyToken, verifyRole('admin'), addBimbingan);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteBimbingan);

module.exports = router;