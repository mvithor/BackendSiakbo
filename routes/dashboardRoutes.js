const { Router } = require("express");
const { getCountStudent, 
        getCountKelas,
        getCountPelanggaran,
        getCountKonselor,
        getCountWaliKelas,
        getCountWaliSiswa,
        getCountPrestasiIndividu,
        getCountPrestasiRegu,
        getCountPrestasiMadrasah,
        getCountKonselingIndividu,
        getCountKonsultasiWaliSiswa
    } = require('../controller/dashboardController');
const { verifyToken, verifyRole } = require('../middleware/verify')
const router = Router();


router.get("/admin/count-students", verifyToken, verifyRole('admin'), getCountStudent);
router.get("/admin/count-kelas", verifyToken, verifyRole('admin'), getCountKelas);
router.get("/admin/count-pelanggaran", verifyToken, verifyRole('admin'), getCountPelanggaran);
router.get("/admin/count-konselor", verifyToken, verifyRole('admin'), getCountKonselor);
router.get("/admin/count-wali-kelas", verifyToken, verifyRole('admin'), getCountWaliKelas);
router.get("/admin/count-wali-siswa", verifyToken, verifyRole('admin'), getCountWaliSiswa);
router.get("/admin/count-prestasi-individu", verifyToken, verifyRole('admin'), getCountPrestasiIndividu);
router.get("/admin/count-prestasi-regu", verifyToken, verifyRole('admin'), getCountPrestasiRegu);
router.get("/admin/count-prestasi-madrasah", verifyToken, verifyRole('admin'), getCountPrestasiMadrasah);
router.get("/admin/count-konseling-individu", verifyToken, verifyRole('admin'), getCountKonselingIndividu);
router.get("/admin/count-konsultasi-wali-siswa", verifyToken, verifyRole('admin'), getCountKonsultasiWaliSiswa);

module.exports = router;



