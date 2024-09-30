const {Router} = require ('express');
const { getPrestasiIndividu,
        getNameStudent,
        getPrestasiIndividuById,
        addPrestasiIndividu,
        updatePrestasiIndividu,
        deletePrestasiIndividu
    } = require('../controller/prestasiIndividuController');
const { verifyToken } = require('../middleware/verify');
const router = Router();

router.get('/', getPrestasiIndividu);
router.get('/nama-siswa', verifyToken, getNameStudent);
router.get('/:id', verifyToken, getPrestasiIndividuById);
router.post('/tambah-prestasi', verifyToken, addPrestasiIndividu);
router.put('/:id', verifyToken, updatePrestasiIndividu);
router.delete('/:id', verifyToken, deletePrestasiIndividu);

module.exports = router;