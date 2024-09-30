const { arrayAsString } = require('pdf-lib');
const pool = require('../../config/connection');
const queries = require('../../model/dashboardWaliSiswa/konsultasiModel');
const moment = require('moment');

// Dapatkan data konsultasi berdasarkan peran 
const getKonsultasiWaliByWaliById = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin') {
            // Jika admin ambil semua data konsultasi
            const result = await pool.query(queries.getAllKonsultasiWaliSiswa);
            if (result.rows.length === 0) {
                return res.status(404).json({msg: 'Data konsultasi tidak ditemukan'});
            }

            // Format tanggal dengan moment
            const formattedResults = result.rows.map(row => ({
                ...row,
                created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
                request_date: row.request_date ? moment(row.request_date).format('YYYY-MM-DD HH:mm:ss') : null
            }));
            res.status(200).json(formattedResults);
        } else {
            // Jika bukan admin ambil data konsultasi berdasarkan wali siswa id
            const waliSiswaResult = await pool.query(queries.getWaliSiswaIdByUserIdQuery, [userId]);
            if (waliSiswaResult.rows.length === 0 ) {
                return res.status(404).json({msg: 'Wali siswa tidak ditemukan'})
            }

            const waliSiswaId = waliSiswaResult.rows[0].id;
            const result = await pool.query(queries.getKonsultasiWaliSiswaById, [waliSiswaId]);
            if (result.rows.length === 0) {
                return res.status(404).json({msg: 'Anda belum mengajukan konsultasi'});
            }

            // Format tanggal dengan moment
            const formattedResults = result.rows.map(row => ({
                ...row,
                created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
                request_date: row.request_date ? moment(row.request_date).format('YYYY-MM-DD HH:mm:ss') : null
            }));
            res.status(200).json(formattedResults);
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data konsultasi', error);
        res.status(500).send({ msg: 'Internal Server Error' });
    };
};

// Dapatkan Id Konsultasi 
const getKonsultasiWaliSiswaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getKonsultasiWaliSiswaById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({msg: 'Anda belum mengajukan konsultasi'})
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil ID konsultasi ', error);
        res.status(500).send({msg:'Internal Server Error'}); 
    };
};

// Dapatkan status konseling
const getStatusKonselingOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getStatusKonseling);
        res.status(200).json(rows)
    } catch (error) {
        console.error("Error fetching status konsultasi options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Tambahkan data status konseling 
const addKonsultasiWaliSiswa = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { topik, pelaksana_dituju, bidang_bimbingan_id, status_konseling_id, request_date } = req.body;

        const userId = req.user.id;
        
        // Dapatkan wali_siswa berdasarkan user_id
        const waliSiswaById = await pool.query(queries.getWaliSiswaIdByUserIdQuery, [userId]);
        if (waliSiswaById.rows.length === 0) {
            return res.status(404).json({msg: 'Wali siswa tidak ditemukan'});
        }

        const waliSiswaId = waliSiswaById.rows[0].id;
        
        // Validasi input
        if (!topik || !pelaksana_dituju || !bidang_bimbingan_id || !status_konseling_id || !request_date) {
            console.log(topik, pelaksana_dituju, bidang_bimbingan_id, status_konseling_id, request_date);
            return res.status(400).json({msg: 'Semua kolom harus diisi'});
        }

        console.log('Wali Siswa ID ', waliSiswaId);

        // Tambahkan data konsultasi ke tabel
        await pool.query(queries.addKonsultasiWaliSiswa, [
            waliSiswaId,
            topik,
            pelaksana_dituju,
            null,
            bidang_bimbingan_id,
            status_konseling_id,
            request_date
        ]);

        // Berikan respons dengan nama siswa
        res.status(201).json({msg: 'Konsultasi berhasil diajukan'});
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan konseling individu', error);
        res.status(500).send({msg:'Internal Server Error'});
    }
};

// Dapatkan nama siswa berdasarkan wali siswa
const getNamaSiswaByWaliSiswa = async (req, res) => {
    try {
        const userId = req.user.id;

        // Cari wali siswa berdasarkan user id
        const waliSiswaById = await pool.query(queries.getWaliSiswaIdByUserIdQuery, [userId]);
        if (waliSiswaById.rows.length === 0) {
            return res.status(404).json({msg: 'Wali siswa tidak ditemukan'});
        }

        const waliSiswaId = waliSiswaById.rows[0].id;

        // Ambil nama siswa berdasarkan wali_siswa_id
        const namaSiswaResult = await pool.query(queries.getNamaSiswaByWaliSiswaId, [waliSiswaId]);
        if (namaSiswaResult.rows.length === 0) {
            return res.status(404).json({msg: 'Siswa tidak ditemukan untuk wali siswa ini'});
        }

        const namaSiswa = namaSiswaResult.rows[0].name;
        res.json({ namaSiswa });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil nama siswa', error);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
};



// Update konsultasi wali siswa
const updateKonsultasiWaliSiswa = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ msg: 'ID tidak valid' });
        }
        
        const { 
            wali_siswa_id,
            topik, 
            pelaksana_dituju, 
            hasil_konsultasi, 
            bidang_bimbingan_id, 
            status_konseling_id, 
        } = req.body;

        console.log('Data Diterima:', {
            wali_siswa_id,
            topik, 
            pelaksana_dituju, 
            hasil_konsultasi, 
            bidang_bimbingan_id, 
            status_konseling_id, 
        });

        // Menjalankan query
        const result = await pool.query(queries.updateKonsultasiWaliSiswa, [
            wali_siswa_id,
            topik, 
            pelaksana_dituju, 
            hasil_konsultasi, 
            bidang_bimbingan_id, 
            status_konseling_id, 
            id
        ]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Konsultasi tidak ditemukan' });
        }
        
        // Mengambil data hasil konsultasi yang telah diperbarui
        const updatedKonsultasi = result.rows[0];
        res.status(200).json({
            msg: 'Data konsultasi wali siswa berhasil diperbarui',
            data: updatedKonsultasi // Mengembalikan data yang telah diperbarui
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui data konsultasi wali siswa', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// const updateKonsultasiWaliSiswa = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         if (isNaN(id)) {
//             return res.status(400).json({ msg: 'ID tidak valid' });
//         }
        
//         const { 
//                 wali_siswa_id,
//                 topik, 
//                 pelaksana_dituju, 
//                 hasil_konsultasi, 
//                 bidang_bimbingan_id, 
//                 status_konseling_id, 
//                 request_date 
//               } = req.body;

//               console.log('Data Diterima:', {
//                 wali_siswa_id,
//                 topik, 
//                 pelaksana_dituju, 
//                 hasil_konsultasi, 
//                 bidang_bimbingan_id, 
//                 status_konseling_id, 
//                 request_date 
//               });

//               const result = await pool.query(queries.updateKonsultasiWaliSiswa, [
//                 wali_siswa_id,
//                 topik, 
//                 pelaksana_dituju, 
//                 hasil_konsultasi, 
//                 bidang_bimbingan_id, 
//                 status_konseling_id, 
//                 request_date,
//                 id
//               ]);
              
//               if (result.rowCount === 0) {
//                     return res.status(404).json ({msg: 'Konsultasi tidak ditemukan'});
//               }
//               res.status(200).json({msg: 'Data konsultasi wali siswa berhasil diperbarui'})
//     } catch (error) {
//         console.error('Terjadi kesalahan saat memperbarui data konsultasi wali siswa', error);
//         res.status(500).json({ msg: 'Internal Server Error' });
//     };
// };

// Hapus data konsultasi wali siswa
const deleteKonsultasiWaliSiswa = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const result = await pool.query(queries.deleteKonsultasiWaliSiswa, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Konsultasi tidak ditemukan' });
        }
        res.status(204).json({msg: 'Konsultasi wali siswa berhasil dihapus'})
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui data konseling individu', error);
        res.status(500).send({msg:'Internal Server Error'}); 
    };
};

module.exports = {
    getKonsultasiWaliByWaliById,
    getKonsultasiWaliSiswaById,
    getStatusKonselingOptions,
    addKonsultasiWaliSiswa,
    getNamaSiswaByWaliSiswa,
    updateKonsultasiWaliSiswa,
    deleteKonsultasiWaliSiswa
}