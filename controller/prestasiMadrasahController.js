const pool = require('../config/connection');
const queries = require('../model/prestasiModel');

// Dapatkan data prestasi
const getPrestasiMadrasah = async (req, res) => {
    try {
        const result = await pool.query(queries.getPrestasiMadrasah);
        const prestasi_madrasah = result.rows;
        res.json(prestasi_madrasah);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data prestasi madrasah', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Dapatkan ID prestasi madrasah
const getPrestasiMadrasahById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getPrestasiMadrasahById, [id]);
        const prestasi_madrasah = result.rows[0];
        res.json(prestasi_madrasah);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data prestasi madrasah By Id', error);
        res.status(500).json({msg:'Internal Server Error'});
        
    };
};

// Tambahkan data prestasi madrasah
const addPrestasiMadrasah = async (req, res) => {
    try {
        const { lomba, tingkat_id, juara_id, penyelenggara, keterangan } = req.body;

        // Validasi data
        if (!lomba || !tingkat_id || !juara_id || !penyelenggara || !keterangan) {
            return res.status(400).json({ msg: "Data Prestasi Madrasah tidak boleh kosong" });
        }

        // Tambahkan data prestasi madrasah
        await pool.query(queries.addPrestasiMadrasah, [
            lomba,
            tingkat_id,
            juara_id,
            penyelenggara,
            keterangan
        ]);
        res.status(201).json({ msg: "Prestasi madrasah berhasil ditambahkan" });
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data prestasi madrasah:', error);
        res.status(500).json({msg:'Internal Server Error'});
    }
};

// Update data prestasi madrasah
const updatePrestasiMadrasah = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { lomba, tingkat_id, juara_id, penyelenggara, keterangan} = req.body;

        // Update data prestasi madrasah
        await pool.query(queries.updatePrestasiMadrasah, [
            lomba,
            tingkat_id,
            juara_id,
            penyelenggara,
            keterangan,
            id 
        ]);
        return res.json({msg: 'Data prestasi madrasah berhasil diperbarui'});
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate data prestasi madrasah', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Hapus data prestasi madrasah
const deletePrestasiMadrasah = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkPrestasiMadrasahTerdaftar = await pool.query(queries.getPrestasiMadrasahById, [id])
        if (checkPrestasiMadrasahTerdaftar.rows.length === 0) {
            return res.status(404).json({msg: "Prestasi madrasah tidak ditemukan"});
        };
        await pool.query(queries.deletePrestasiMadrasah, [id]);
        res.status(200).send("Data prestasi madrasah berhasil dihapus");
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus data prestasi madrasah', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

module.exports = {
    getPrestasiMadrasah,
    getPrestasiMadrasahById,
    addPrestasiMadrasah,
    updatePrestasiMadrasah,
    deletePrestasiMadrasah
}
