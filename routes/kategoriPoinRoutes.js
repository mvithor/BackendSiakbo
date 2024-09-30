const { Router } = require('express');
const { getKategoriPoin, 
        getKategoriPoinOptions,
        getKategoriPoinById,
        addKategoriPoin,
        updateKategoriPoin,
        deleteKategoriPoin
    } = require('../controller/kategoriPoinController');
const { verifyToken, verifyRole } = require('../middleware/verify');
const router = Router();

router.get('/', verifyToken, getKategoriPoin);
router.get('/options', verifyToken, getKategoriPoinOptions);
router.get('/:id', verifyToken, getKategoriPoinById);
router.post('/tambah-kategori-poin', verifyToken, verifyRole('admin'), addKategoriPoin);
router.put('/:id', verifyToken, verifyRole('admin'), updateKategoriPoin);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteKategoriPoin);

module.exports = router;