const {Router} = require('express');
const { getKelas, 
        getKelasById, 
        SiswaKelasById, 
        getKelasOptions, 
        getClassName, 
        addKelas, 
        deleteKelas, 
        updateKelas } = require('../controller/kelasController');
const { verifyToken, verifyRole } = require('../middleware/verify')

const router = Router();
router.get('/detail/:id', SiswaKelasById);  
router.get('/', verifyToken, getKelas);
router.get('/auth/kelas', getKelas);
router.get('/option', getKelasOptions);
router.get('/nama-kelas', getClassName);
router.get('/:id', getKelasById);
router.post('/tambah-kelas', verifyToken, verifyRole('admin'), addKelas);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteKelas);
router.put('/:id',  updateKelas);

module.exports = router;
