const pool = require('../config/connection');
const Joi = require('joi');
const queries = require('../model/statusKeluargaModel');
const { error } = require('pdf-lib');
const { Pool } = require('pg');

// Dapatkan data status keluarga
const getStatusKeluarga = async (req, res) => {
    try {
        const result = await pool.query(queries.getStatusKeluarga);
        const statusKeluarga = result.rows;
        res.json(statusKeluarga);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data status keluarga', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Dapatkan ID Status Keluarga
const getStatusKeluargaOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getNameStatusKeluarga);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching status keluarga options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    };
};

// Dapatkan data status keluarga By Id
const getStatusKeluargaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getStatusKeluargaById, [id]);
        const statusKeluarga = result.rows[0];
        res.json(statusKeluarga);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil status keluarga by Id', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Tambahkan status keluarga
const schema = Joi.object({
    nama_status: Joi.alternatives().try(
        Joi.string().trim().min(3).max(250).messages({
            'string.empty': 'Status keluarga tidak boleh kosong',
            'string.min': 'Status keluarga minimal 3 karakter',
            'string.max': 'Status keluarga maksimal 250 karakter',
        })
    ).required().messages({
        'any.required': 'Status keluarga tidak boleh kosong',
    })
});

const addStatusKeluarga = async (req, res) => {
    try {
        let { nama_status } = req.body;

        // validasi data menggunakan joi dengan menampilkan pesan
        const { error } = schema.validate({ nama_status }, {abortEarly: false})

        // Fungsi untuk kapitalisasi setiap kata
        function capitalizeWords(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ msg: `Status keluarga tidak valid: ${errorMessages.join(', ')}` });
        }

        nama_status = capitalizeWords(nama_status);

        // Cek apakah status keluarga terdaftar
        const checkStatusKeluargaTerdaftar = await pool.query(queries.cekStatusKeluargaTerdaftar, [nama_status]);
        if(checkStatusKeluargaTerdaftar.rows.length > 0) {
            return res.status(400).json({msg: `Status Keluarga ${nama_status} sudah Terdaftar`});
         };
        
        // Menambhahkan status keluarga
        await pool.query(queries.addStatusKeluarga, [
            nama_status
        ]);
        res.status(201).json({msg: `Status keluarga ${nama_status} berhasil di tambahkan`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan kategori poin:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Update status keluarga 
const updateStatusKeluarga = async (req, res) => {
    try {

        const { nama_status } = req.body;
        // Validasi Joi
        const { error } = schema.validate({ nama_status }, {abortEarly: false})

         // Fungsi untuk kapitalisasi setiap kata
         function capitalizeFirstLetterOfEachWord(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ msg: `Status keluarga tidak valid: ${errorMessages.join(', ')}` });
        }

        const id = parseInt(req.params.id);
        const capitalizedStatusKeluarga = capitalizeFirstLetterOfEachWord(nama_status);

         // Cek apakah status keluarga terdaftar
         const checkStatusKeluargaTerdaftar = await pool.query(queries.cekStatusKeluargaTerdaftar, [nama_status]);
         if(checkStatusKeluargaTerdaftar.rows.length > 0) {
             return res.status(400).json({msg: `Status Keluarga ${nama_status} sudah Terdaftar`});
          };

        // Jika belum terdaftar, update status keluarga
        await pool.query(queries.updateStatusKeluarga, [
            capitalizedStatusKeluarga,
            id
        ]);
        return res.json({msg: `Status keluarga ${capitalizedStatusKeluarga} berhasil diperbarui`})
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate status keluarga:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Hapus status keluarga
const deleteStatusKeluarga = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Mengambil nama status keluarga berdasarkan ID sebelum penghapusan
        const checkStatusKeluarga = await pool.query(queries.getStatusKeluargaById, [id]);

        // Mengecek apakah status keluarga ditemukan
        if (checkStatusKeluarga.rows.length === 0 ) {
            return res.status(404).json({msg: "Status keluarga tidak ditemukan"});
        }

        const statusKeluarga = checkStatusKeluarga.rows[0].nama_status;

        // Menghapus status keluarga berdasarkan ID
        await pool.query(queries.deleteStatusKeluarga, [id])
        res.status(200).json({msg: `Status keluarga ${statusKeluarga} berhasil dihapus`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus kategori poin', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };   
};

module.exports = {
    getStatusKeluarga,
    getStatusKeluargaById,
    getStatusKeluargaOptions,
    addStatusKeluarga,
    updateStatusKeluarga,
    deleteStatusKeluarga
}