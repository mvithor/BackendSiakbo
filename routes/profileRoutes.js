// profileRoutes.js
const { Router } = require('express');
const router = Router();
const { uploadProfileImage, downloadProfileImage, getProfileImage } = require('../controller/profileController');
const upload = require('../middleware/uploud'); // Pastikan path middleware upload sudah sesuai
const { verifyToken } = require('../middleware/verify'); // Import verifyToken middleware

router.post('/upload', upload.single('file'), uploadProfileImage);
router.get('/download/:filename', verifyToken, downloadProfileImage);
router.get('/current-image/:userId', verifyToken, getProfileImage); // Tambahkan rute untuk mendapatkan gambar profil berdasarkan userId

module.exports = router;
