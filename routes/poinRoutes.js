const { Router } = require('express');
const { getPoints,
        getJumlahPoints,
        getNameStudent, 
        getPointsById,
        addPoints,
        updatePoints,
        deletePoints,
        deleteAllPoints
    } = require('../controller/poinController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, getPoints);
router.get('/jumlah-poin', verifyToken, getJumlahPoints);
router.get('/options', verifyToken, getNameStudent);
router.get('/:id', verifyToken, getPointsById);
router.post('/tambah-poin', verifyToken, verifyRole(['admin', 'guru']), addPoints);
router.put('/:id', verifyToken, verifyRole(['admin, guru']), updatePoints);
router.delete('/:id', verifyToken, verifyRole(['admin']), deletePoints);
router.delete('/api/delete-all', verifyToken, verifyRole('admin'), deleteAllPoints);

module.exports = router;
