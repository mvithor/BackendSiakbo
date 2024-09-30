const {Router} = require("express");
const { getStudents,
        getStudentsById, 
        updateStudent, 
        deleteStudent,
    } = require('../controller/siswaController');
const { verifyToken, verifyRole } = require('../middleware/verify')
const router = Router();


router.get("/", verifyToken, verifyRole('admin'), getStudents);
router.get('/:id', verifyToken, verifyRole('admin'),  getStudentsById);
router.put('/:id', verifyToken, updateStudent)
router.delete("/:id", verifyToken, verifyRole('admin'), deleteStudent);

module.exports = router;