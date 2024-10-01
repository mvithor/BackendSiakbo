const { Router } = require('express');
const { Register, Login,  Logout}  = require('../controller/Users');
const { registerWaliSiswa } = require('../controller/waliSiswaController')
const router = Router();


router.get('/logout', Logout)
router.post('/register', Register);
router.post('/register/wali-siswa',registerWaliSiswa);
router.post('/login', Login);
router.delete ('/logout', Logout);




module.exports = router;