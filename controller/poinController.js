const pool = require ('../config/connection');
const Joi = require('joi');
const queries = require('../model/poinModel');

// Dapatkan Log data poin
// const getPoints = async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit, 10) || 5;
//         const offset = parseInt(req.query.offset, 10) || 0;

//         const getLogPoints = `
//           SELECT * FROM public.points
//           ORDER BY "date" DESC
//           LIMIT $1 OFFSET $2
//         `;

//         const countQuery = `
//           SELECT COUNT(*) FROM public.points
//         `;

//         const [pointsResult, countResult] = await Promise.all([
//             pool.query(getLogPoints, [limit, offset]),
//             pool.query(countQuery)
//         ]);

//         const points = pointsResult.rows;
//         const totalPoints = parseInt(countResult.rows[0].count, 10);

//         // Hitung jumlah halaman total berdasarkan limit
//         const totalPages = Math.ceil(totalPoints / limit);

//         res.status(200).json({
//             data: points,
//             total: totalPoints,
//             totalPages,  // Jumlah halaman total
//         });
//     } catch (error) {
//         console.error('Terjadi kesalahan saat mengambil log data poin:', error);
//         res.status(500).json({ msg: 'Internal Server Error' });
//     }
// };






// Dapatkan Log data poin
const getPoints = async (req, res) => {
    try {
        const result = await pool.query(queries.getLogPoints);
        const points = result.rows;
        res.json(points);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil log data poin :', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Dapatkan data poin 
const getJumlahPoints = async (req, res) => {
    try {
        const result = await pool.query(queries.getJumlahPoints);
        const jumlahPoints = result.rows;
        res.json(jumlahPoints);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data poin :', error);
        res.status(500).json({ msg: 'Internal Server Error' }); 
    }
}

// Dapatkan nama siswa dari tabel students
const getNameStudent = async (req, res) => {
    try {
        const result = await pool.query(queries.getNamaSiswa);
        const nama_siswa = result.rows;
        res.json(nama_siswa);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil nama siswa', error);
        res.status(500).json({ msg:'Internal Server Error'});
    };
};

// Dapatkan data poin by Id
const getPointsById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getPointsById, [id]);
        const pointsById = result.rows[0];
        res.json(pointsById);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data poin by id:', error);
        res.status(500).json({ msg: 'Internal Server Error' }); 
    };
};

// Tambahkan data poin
const schema = Joi.object({
    student_ids: Joi.array().items(Joi.number().integer().required())
        .required(),
    kategori_poin_id: Joi.number().integer()
    .required()
    .messages({
        'any.required': 'Kategori poin tidak boleh kosong'
    }),
    points: Joi.number().integer()
    .required()
    .messages({
        'number.base': 'Poin harus berupa angka',
        'any.required': 'Poin tidak boleh kosong'
    }),
    description: Joi.string()
    .required()
    .messages({
        'string.base': 'Deskripsi harus berupa teks.',
        'any.required': 'Deskripsi tidak boleh kosong.'
    }),
});

const addPoints = async (req, res) => {
    try {
        const { student_ids, kategori_poin_id, points, description } = req.body;

        // Validasi data menggunakan skema Joi dengan pesan kesalahan khusus
        const { error } = schema.validate({ student_ids, kategori_poin_id, points, description }, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ msg: `Data poin tidak valid: ${errorMessages.join(', ')}` });
        }

        const promises = student_ids.map(async (student_id) => {
            // 1. Tambah data poin ke tabel "points" (log poin)
            await pool.query(queries.addPoints, [
                student_id,
                kategori_poin_id,
                points,
                description,
            ]);

            // 2. Cek apakah entri untuk student_id dan kategori_poin_id sudah ada di tabel total_poin_siswa
            const { rows } = await pool.query(queries.getTotalPoints, [student_id, kategori_poin_id]);

            if (rows.length > 0) {
                // Jika entri ada, update total_points dengan menambahkan points
                await pool.query(queries.updateTotalPoints, [points, student_id, kategori_poin_id]);
            } else {
                // Jika entri tidak ada, tambahkan entri baru ke total_poin_siswa
                await pool.query(queries.addTotalPoints, [student_id, kategori_poin_id, points]);
            }
        });

        await Promise.all(promises);
        res.status(200).json({ msg: "Poin berhasil ditambahkan dan total poin diperbarui" });
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data poin:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};



// Update data poin
const updatePoints = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { student_id, kategori_poin_id, points, description } = req.body;

        // Validasi data
        if(!student_id || !kategori_poin_id || !points || !description ) {
            return res.status(400).json({msg: "Data poin tidak boleh kosong"});
        };

        // Update data poin
        await pool.query(queries.updatePoints, [
            student_id,
            kategori_poin_id,
            points,
            description,
            id
        ]);
        return res.json({msg: "Poin berhasil diperbarui"});
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate data poin', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Hapus LOG poin
const deletePoints = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check if the log exists
        const checkPoinTerdaftar = await pool.query(queries.getPointsById, [id]);
        if (checkPoinTerdaftar.rows.length === 0) {
            return res.status(404).json({ msg: "Log poin tidak ditemukan" });
        }

        // Get the point details (student_id, kategori_poin_id, and points)
        const { student_id, kategori_poin_id, points } = checkPoinTerdaftar.rows[0];

        // Update total_poin_siswa by subtracting the points
        const totalPoinSiswa = await pool.query(queries.getTotalPoints, [student_id, kategori_poin_id]);

        if (totalPoinSiswa.rows.length === 0) {
            return res.status(404).json({ msg: "Total poin siswa tidak ditemukan" });
        }

        // Calculate the new total points by subtracting the deleted points
        const newTotalPoints = totalPoinSiswa.rows[0].total_points - points;

        // If the new total is 0 or more, update it
        if (newTotalPoints >= 0) {
            await pool.query(queries.updateLogPoints, [newTotalPoints, student_id, kategori_poin_id]);
        } else {
            // Optionally, you can choose to set the total points to 0 if it goes negative
            await pool.query(queries.updateTotalPoints, [0, student_id, kategori_poin_id]);
        }

        // Delete the log point
        await pool.query(queries.deletePoints, [id]);

        res.status(200).json({ msg: "Log poin siswa berhasil dihapus dan total poin diperbarui" });
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus data poin', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Reset Log Poin dan Data Poin
const deleteAllPoints = async (req, res) => {
    const client = await pool.connect();
    try {
        // Mulai transaksi
        await client.query('BEGIN');

        await client.query(queries.deleteAllPoints);
        await client.query(queries.deleteAllTotalPoints);

        await client.query('COMMIT');
        res.status(200).json({msg: "Semua data poin berhasil di hapus"})
    } catch (error) {
        await client.query('ROLLBACK'); // Menggagalkan transaksi jika ada kesalahan
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data.', error });
    } finally {
        client.release();
    }
}

// const deletePoints = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const checkPoinTerdaftar = await pool.query(queries.getPointsById, [id]);
//         if (checkPoinTerdaftar.rows.length === 0 ) {
//             return res.status(404).json({msg: "Log poin tidak ditemukan"});
//         }
//         await pool.query(queries.deletePoints, [id]);
//         res.status(200).json({msg: "Log poin siswa berhasil di hapus"});
//     } catch (error) {
//         console.error('Terjadi kesalahan saat menghapus data poin', error);
//         res.status(500).json({msg:'Internal Server Error'});
//     };
// };

module.exports = {
    getPoints,
    getJumlahPoints,
    getNameStudent,
    getPointsById,
    addPoints,
    updatePoints,
    deletePoints,
    deleteAllPoints
}