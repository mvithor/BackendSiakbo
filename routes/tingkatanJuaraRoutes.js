const {Router} = require ('express');
const { getJuaraOptions, getTingkatanOptions } = require('../controller/tingkatanJuaraController');
const { verifyToken } = require('../middleware/verify');
const router = Router();

router.get('/juara', verifyToken, getJuaraOptions);
router.get('/tingkatan', verifyToken, getTingkatanOptions);

module.exports = router;