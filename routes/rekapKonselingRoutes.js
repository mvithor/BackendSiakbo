const { Router } = require('express');
const { getRekapKonselingIndividu } = require('../controller/rekapKonselingController');
const router = Router();
const { verifyToken, verifyRole } = require('../middleware/verify');

router.get('/', verifyToken, verifyRole('admin'), getRekapKonselingIndividu);

module.exports = router;