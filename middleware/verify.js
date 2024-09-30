const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: 'Sesi anda telah berakhir, Silahkan login kembali' });
    }
    // console.log('Decoded token:', decoded); // Tambahkan log ini untuk melihat isi token
    req.user = decoded;
    next();
  });
};
const verifyRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Forbidden: You do not have the right access' });
  }
  console.log('Peran pengguna valid:', req.user.role); // Log untuk memastikan peran benar
  next();
};

module.exports = {
  verifyToken,
  verifyRole,
};