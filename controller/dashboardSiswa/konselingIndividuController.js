const pool = require('../../config/connection');
const queries = require('../../model/dashboardSiswa/konselingIndividuModel')
const moment = require('moment')
const { getStudentIdByUserIdQuery } = require('../../model/dashboardSiswa/prestasiIndividuModel')

// Dapatkan data konseling berdasarkan Peran
const getKonselingIndividuByStudentId = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role; // Misalnya, ambil role user dari token atau database

        if (userRole === 'admin') {
            // Jika admin, ambil semua data konseling individu
            const result = await pool.query(queries.getAllKonselingIndividu);
            if (result.rows.length === 0) {
                return res.status(404).json({ msg: 'Data konseling tidak ditemukan' });
            }

            // Format tanggal dengan moment.js
            const formattedResults = result.rows.map(row => ({
                ...row,
                created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
                request_date: row.request_date ? moment(row.request_date).format('YYYY-MM-DD HH:mm:ss') : null
            }));

            res.status(200).json(formattedResults);
        } else {
            // Jika bukan admin, ambil data konseling berdasarkan student_id
            const studentResult = await pool.query(getStudentIdByUserIdQuery, [userId]);
            if (studentResult.rows.length === 0) {
                return res.status(404).json({ msg: 'Siswa tidak ditemukan' });
            }

            const studentId = studentResult.rows[0].id;
            const result = await pool.query(queries.getKonselingIndividuByStudentId, [studentId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ msg: 'Pengaduan tidak ditemukan' });
            }

            // Format tanggal dengan moment.js
            const formattedResults = result.rows.map(row => ({
                ...row,
                created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
                request_date: row.request_date ? moment(row.request_date).format('YYYY-MM-DD HH:mm:ss') : null
            }));

            res.status(200).json(formattedResults);
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data konseling individu', error);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
};


// Dapatkan Id Konseling Individu
const getKonselingIndividuById = async (req, res) => {
    try {
        const id  = parseInt(req.params.id);
        const result = await pool.query(queries.getKonselingIndividuById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Anda belum mengajukan konseling' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil ID konseling individu ', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

//Dapatkan ID Status Konseling
const getStatusKonselingOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getStatusKonseling);
        res.status(200).json(rows)
    } catch (error) {
        console.error("Error fetching status konseling options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
    
}

// Tambahkan data konseling individu
const addKonselingIndividu = async (req, res) => {
    try {

        console.log('Request Body:', req.body); // Tambahkan log ini
        const { judul_pengaduan, deskripsi_permasalahan, bidang_bimbingan_id, lampiran, status_konseling_id, request_date } = req.body;
        
        const userId = req.user.id;
         // Dapatkan student_id berdasarkan user_id
         const studentById = await pool.query(getStudentIdByUserIdQuery, [userId]);
         if (studentById.rows.length === 0) {
             return res.status(404).json({ msg: 'Siswa tidak ditemukan' });
         }

        const studentId = studentById.rows[0].id;

        if (!judul_pengaduan || !deskripsi_permasalahan || !bidang_bimbingan_id || !status_konseling_id || !request_date) {
            console.log(judul_pengaduan, deskripsi_permasalahan,bidang_bimbingan_id, status_konseling_id, request_date )
            return res.status(400).json({ msg: 'Semua field yang diperlukan harus diisi' });
          }
        
        console.log('Student ID:', studentId);

       

         // Query untuk mendapatkan jenis_kelamin_id dari tabel student
         const studentResult = await pool.query(queries.getJenisKelaminByStudents, [studentId]);
         console.log('Student Query Result:', studentResult.rows)
         if (studentResult.rows.length === 0) {
             return res.status(404).json({ msg: 'Siswa tidak ditemukan' });
         }
         const jenis_kelamin_id = studentResult.rows[0].jenis_kelamin_id;
        
       
        await pool.query(queries.addKonselingIndividu, [
            studentId, 
            jenis_kelamin_id, 
            judul_pengaduan, 
            deskripsi_permasalahan, 
            bidang_bimbingan_id, 
            lampiran, 
            status_konseling_id,
            request_date
        ]);
        res.status(201).json({msg: 'Konseling Individu berhasil diajukan'});
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan konseling individu', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Update konseling individu
const updateKonselingIndividu = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ msg: 'ID tidak valid' });
        }

        const {
            student_id,
            jenis_kelamin_id,
            judul_pengaduan,
            deskripsi_permasalahan,
            bidang_bimbingan_id,
            lampiran,
            status_konseling_id,
            arahan,
            tindak_lanjut
        } = req.body;

        console.log('Received data:', {
            student_id,
            jenis_kelamin_id,
            judul_pengaduan,
            deskripsi_permasalahan,
            bidang_bimbingan_id,
            lampiran,
            status_konseling_id,
            arahan,
            tindak_lanjut
        });

        const result = await pool.query(queries.updateKonselingIndividu, [
            student_id,
            jenis_kelamin_id,
            judul_pengaduan,
            deskripsi_permasalahan,
            bidang_bimbingan_id,
            lampiran,
            status_konseling_id,
            arahan,
            tindak_lanjut,
            id
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Pengaduan tidak ditemukan' });
        }

        res.status(200).json({ msg: 'Data konseling individu berhasil diperbarui' });
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui data konseling individu', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};



// Hapus data konseling Individu
const deleteKonselingIndividu = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const result = await pool.query(queries.deleteKonselingIndividu, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Pengaduan tidak ditemukan' });
        }
        res.status(204).json({ msg: 'Konseling individu berhasil dihapus' });
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui data konseling individu', error);
        res.status(500).send({msg:'Internal Server Error'});  
    };
};

module.exports = {
    getKonselingIndividuByStudentId,
    getStatusKonselingOptions,
    getKonselingIndividuById,
    addKonselingIndividu,
    updateKonselingIndividu,
    deleteKonselingIndividu
}
