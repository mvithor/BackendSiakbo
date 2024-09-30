const pool = require ('../../config/connection');
const queries = require('../../model/dashboardSiswa/catatanKonselingModel');
const { getStudentIdByUserIdQuery } = require('../../model/dashboardSiswa/prestasiIndividuModel')

// Dapatkan catatan konseling berdasarkan siswa login
const getCatatanKonselingIndividuByStudentId = async (req, res) => {
    try {
        const userId = req.user.id;
       // Ambil data konseling berdasarkan student_id
        const studentResult = await pool.query(getStudentIdByUserIdQuery, [userId]);
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Siswa tidak ditemukan' });
        }
        // Ambil catatan konseling
        const studentId = studentResult.rows[0].id;
        const result = await pool.query(queries.getCatatanKonselingIndividuByStudentId, [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Catatan konseling tidak ditemukan' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil catatan konseling individu', error);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getCatatanKonselingIndividuByStudentId
}