const pool = require ('../config/connection');
const queries = require('../model/prestasiIndividuModel');

// Dapatkan data prestasi individu
const getPrestasiIndividu = async (req, res) => {
    try {
        const result = await pool.query(queries.getPrestasiIndividu);
        const prestasi_individu = result.rows;
        res.json(prestasi_individu);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data prestasi individu:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Dapatkan nama siswa dari tabel students
const getNameStudent = async (req, res) => {
    try {
        const result = await pool.query(queries.getNamaSiswa);
        const nama_siswa = result.rows;
        res.json(nama_siswa)
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil nama siswa', error);
        res.status(500).json({ msg:'Internal Server Error'});
    };
};

// Dapatkan ID prestasi individu
const getPrestasiIndividuById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getPrestasiIndividuById, [id]);
        const prestasi_individu = result.rows[0];
        res.json(prestasi_individu);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data prestasi individu By Id', error);
        res.status(500).send('Internal Server Error');
    };
};

// Tambahkan data prestasi individu 
const addPrestasiIndividu = async (req, res) => {
    try {
        const { student_ids, tingkat_id, juara_id, penyelenggara, keterangan } = req.body;

        // Validasi Data
        if (!student_ids || !tingkat_id || !juara_id || !penyelenggara || !keterangan) {
            return res.status(400).json({ msg: "Data Prestasi Individu tidak boleh kosong" });
        }

        // Menambahkan Prestasi Individu untuk setiap siswa
        const promises = student_ids.map(student_id => {
            return pool.query(queries.addPrestasiIndividu, [
                student_id,
                tingkat_id,
                juara_id,
                penyelenggara,
                keterangan
            ]);
        });

        await Promise.all(promises);
        res.status(201).json({ msg: "Prestasi Individu berhasil ditambahkan" });
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data prestasi individu:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Update data prestasi individu
const updatePrestasiIndividu = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { student_id, tingkat_id, juara_id, penyelenggara, keterangan } = req.body;

        // Update data prestasi individu
        await pool.query(queries.updatePrestasiIndividu, [
            student_id,
            tingkat_id,
            juara_id,
            penyelenggara,
            keterangan,
            id
        ]);
        return res.json({msg: 'Data prestasi individu berhasil diperbarui'})
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate data prestasi individu', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Hapus data prestasi individu 
const deletePrestasiIndividu = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkPrestasiIndividuTerdaftar = await pool.query(queries.getPrestasiIndividuById, [id])
        if (checkPrestasiIndividuTerdaftar.rows.length === 0) {
            return res.status(404).json({msg: "Prestasi individu tidak ditemukan"});
        };
        await pool.query(queries.deletePrestasiIndividu, [id]);
        res.status(200).send("Data prestasi individu berhasil di hapus")
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus data prestasi individu', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

module.exports = {
    getPrestasiIndividu,
    getNameStudent,
    getPrestasiIndividuById,
    addPrestasiIndividu,
    updatePrestasiIndividu,
    deletePrestasiIndividu
}


  