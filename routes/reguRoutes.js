const {Router} = require('express');
const { getRegu, getReguById, addRegu, updateRegu, deleteRegu } = require('../controller/reguController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, verifyRole('admin'), getRegu);
router.get('/:id', verifyToken, verifyRole('admin'), getReguById);
router.put('/:id', verifyToken, verifyRole('admin'), updateRegu);
router.post('/tambah-regu', verifyToken, verifyRole('admin'), addRegu);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteRegu);

module.exports = router;