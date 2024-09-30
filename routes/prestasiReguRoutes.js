const {Router} = require('express');
const { getPrestasiRegu,
        getPrestasiReguByReguId,
        addPrestasiRegu,
        updatePrestasiRegu,
        deletePrestasiRegu
    } = require('../controller/prestasiReguController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, verifyRole('admin'), getPrestasiRegu);
router.get('/:id', getPrestasiReguByReguId);
router.put('/:id', verifyToken, verifyRole('admin'), updatePrestasiRegu);
router.post('/tambah-prestasi', verifyToken, verifyRole('admin'), addPrestasiRegu);
router.delete('/:reguId/:studentId', verifyToken, verifyRole('admin'), deletePrestasiRegu);

module.exports = router;