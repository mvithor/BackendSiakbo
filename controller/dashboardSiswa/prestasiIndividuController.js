const pool = require('../../config/connection');
const queries = require('../../model/dashboardSiswa/prestasiIndividuModel');


// Dapatkan data prestasi siswa yang login
const getPrestasiIndividuByStudentId = async (req, res) => {
    try {
        const userId = req.user.id; // ID siswa dari token

         // Dapatkan student_id berdasarkan user_id
         const studentResult = await pool.query(queries.getStudentIdByUserIdQuery, [userId]);
         if (studentResult.rows.length === 0) {
             return res.status(404).json({ msg: 'Siswa tidak ditemukan' });
         }
        const studentId = studentResult.rows[0].id;
        const result = await pool.query(queries.getPrestasiIndividuByStudentId, [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Prestasi tidak ditemukan' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving individual achievements', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


module.exports = {
    getPrestasiIndividuByStudentId,
};