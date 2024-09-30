const { Router } = require ('express');
const { getAllUser,
        getUsers,
        getUsersById,
        getRoleOptions, 
        deleteUsers,
        updatedUsers, 
        getJenisKelamin
      } = require ('../controller/Users');
const { verifyToken, verifyRole} = require('../middleware/verify')
const router = Router();

router.get('/jenis-kelamin', getJenisKelamin);

router.get('/all', verifyToken, verifyRole('admin'), getAllUser);
router.get('/options', verifyToken, verifyRole('admin'),  getRoleOptions);
router.get('/', getUsers);
router.get('/:id', verifyToken, verifyRole('admin'), getUsersById); // Rute untuk ID
router.put('/:id', verifyToken, verifyRole('admin'), updatedUsers);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUsers);

module.exports = router;