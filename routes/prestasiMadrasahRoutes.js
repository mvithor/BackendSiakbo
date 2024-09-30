const {Router} = require('express');
const { getPrestasiMadrasah, 
        getPrestasiMadrasahById,
        addPrestasiMadrasah,
        updatePrestasiMadrasah,
        deletePrestasiMadrasah
    } = require('../controller/prestasiMadrasahController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, verifyRole('admin'), getPrestasiMadrasah);
router.get('/:id', verifyToken, verifyRole('admin'), getPrestasiMadrasahById);
router.put('/:id', verifyToken, verifyRole('admin'), updatePrestasiMadrasah);
router.post('/tambah-prestasi', verifyToken, verifyRole('admin'), addPrestasiMadrasah);
router.delete('/:id', verifyToken, verifyRole('admin'), deletePrestasiMadrasah);

module.exports = router;