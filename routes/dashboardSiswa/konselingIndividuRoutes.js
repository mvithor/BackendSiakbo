const { Router } = require ('express')
const { getKonselingIndividuById,
        getKonselingIndividuByStudentId,
        getStatusKonselingOptions,
        addKonselingIndividu,
        updateKonselingIndividu,
        deleteKonselingIndividu
 } = require('../../controller/dashboardSiswa/konselingIndividuController');
 const { verifyToken, verifyRole } = require('../../middleware/verify')
 const router = Router();

 router.get('/', verifyToken, getKonselingIndividuByStudentId );
 router.get('/options', verifyToken,getStatusKonselingOptions );
 router.post('/tambah-konseling-individu', verifyToken, addKonselingIndividu);
 router.get('/:id', verifyToken, getKonselingIndividuById);
 router.put('/:id', verifyToken, updateKonselingIndividu);
 router.delete('/:id', verifyToken, verifyRole('admin'), deleteKonselingIndividu);

 module.exports = router;