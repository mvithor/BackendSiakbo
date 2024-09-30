const { Router } = require ('express');
const { getKonsultasiWaliByWaliById,
        getKonsultasiWaliSiswaById,
        getStatusKonselingOptions,
        addKonsultasiWaliSiswa,
        getNamaSiswaByWaliSiswa,
        updateKonsultasiWaliSiswa,
        deleteKonsultasiWaliSiswa
      } = require('../../controller/dashboardWaliSiswa/konsultasiController');
const { verifyToken, verifyRole } = require ('../../middleware/verify');
const router = Router();

router.get('/', verifyToken, getKonsultasiWaliByWaliById);
router.get('/options', verifyToken, getStatusKonselingOptions);
router.get('/nama-siswa', verifyToken, getNamaSiswaByWaliSiswa)
router.post('/tambah-konsultasi', verifyToken, addKonsultasiWaliSiswa);
router.get('/:id', verifyToken, getKonsultasiWaliSiswaById);
router.put('/:id', verifyToken, updateKonsultasiWaliSiswa);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteKonsultasiWaliSiswa);

module.exports = router;