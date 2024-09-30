const pool = require('../config/connection');
const queries = require('../model/prestasiReguModel');

// Dapatkan data prestasi regu
const getPrestasiRegu = async (req, res) => {
    try {
        const result = await pool.query(queries.getPrestasiRegu);
        const prestasi_regu = result.rows;
        res.json(prestasi_regu);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data prestasi regu', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};




const getPrestasiReguByReguId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getPrestasiReguByReguById, [id]);
        const prestasi = result.rows;
        res.json(prestasi)
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil kelas by Id', error);
        res.status(500).send({msg:'Internal Server Error'});
    }
}
  



// Tambahkan data prestasi regu
const addPrestasiRegu = async (req, res) => {
    try {
        const { id, student_ids, tingkat_id, juara_id, penyelenggara, keterangan } = req.body;

        // validasi data
        if(! id || !student_ids || !tingkat_id || !juara_id || !penyelenggara || !keterangan) {
            return res.status(400).json({msg: "Data Prestasi tidak boleh kosong"});
        }

        // Menambahkan prestasi regu untuk setiap siswa
        const promises = student_ids.map(student_id => {
            return pool.query(queries.addPrestasiRegu, [
                id,
                student_id,
                tingkat_id,
                juara_id,
                penyelenggara,
                keterangan
            ]);
        });

        await Promise.all(promises)
        res.status(201).json({msg: "Prestasi berhasil ditambahkan"})
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data prestasi regu:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Update data prestasi regu
const updatePrestasiRegu = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { regu_id, student_id, tingkat_id, juara_id, penyelenggara, keterangan } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ msg: 'ID tidak valid' });
        }

        // Update data prestasi regu
       const result = await pool.query(queries.updatePrestasiRegu, [
            regu_id,
            student_id,
            tingkat_id,
            juara_id,
            penyelenggara,
            keterangan,
            id
        ]);
        
        if (result.rowCount > 0) {
            const updatedRegu = result.rows[0];
            const namaSiswa = updatedRegu.name; // Ambil nama siswa dari hasil query
            return res.json({ msg: `Data prestasi ${namaSiswa} berhasil diperbarui` });
        } else {
            return res.status(404).json({ msg: 'Regu tidak ditemukan' });
        };
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui data prestasi regu', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Hapus data prestasi regu
const deletePrestasiRegu = async (req, res) => {
    try {
        const { reguId, studentId } = req.params;

        // Pastikan ID valid
        if (!reguId || !studentId) {
            return res.status(400).json({ msg: "ID Regu atau ID Siswa tidak boleh kosong" });
        }

        // Hapus data prestasi regu siswa berdasarkan reguId dan studentId
        const result = await pool.query(queries.deletePrestasiReguByStudentId, [reguId, studentId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        res.status(200).json({ msg: "Data prestasi berhasil dihapus" });
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus data prestasi regu', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

module.exports = {
    getPrestasiRegu,
    getPrestasiReguByReguId,
    addPrestasiRegu,
    updatePrestasiRegu,
    deletePrestasiRegu
}