const pool = require('../config/connection');
const Joi = require('joi');
const queries = require('../model/bimbinganModel');

// Dapatkan data bidang bimbingan
const getBimbingan = async (req, res) => {
    try {
        const result = await pool.query(queries.getBimbingan);
        const bidang = result.rows;
        res.json(bidang);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data bidang bimbingan', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Dapatkan id bidang bimbingan
const getBimbinganById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getBimbinganById, [id]);
        const bidang = result.rows[0];
        res.json(bidang)
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil bidang bimbingan by Id', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Tambahkan bidang bimbingan
const schema = Joi.object({
    bidang_bimbingan: Joi.alternatives().try(
        Joi.string().trim().min(3).max(100),
        Joi.number().integer().min(1)
    ).required()
});

const addBimbingan = async (req, res) => {
    try {
        // Validasi Joi
        const { error, value } = schema.validate(req.body);

         // Fungsi untuk kapitalisasi setiap kata
         function capitalizeWords(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        let { bidang_bimbingan } = value;
        bidang_bimbingan = capitalizeWords(bidang_bimbingan);

        // Cek apakah bidang bimbingan terdaftar
        const checkBidangBimbinganTerdaftar = await pool.query(queries.cekBimbinganTerdaftar, [bidang_bimbingan]);
        if(checkBidangBimbinganTerdaftar.rows.length > 0) {
            return res.status(400).json({msg: `Bidang bimbingan ${bidang_bimbingan} sudah Terdaftar`});
         };

        // Menambahkan bidang bimbingan
        await pool.query(queries.addBimbingan, [
            bidang_bimbingan
        ]);
        res.status(201).json({msg: `Bidang bimbingan ${bidang_bimbingan} berhasil ditambahkan`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan bidang bimbingan:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Update bidang bimbingan 
const updateBimbingan = async (req, res) => {
    try {
        // Validasi menggunakan Joi
        const { error, value } = schema.validate(req.body, {
            allowUnknown: true, // Mengizinkan properti tambahan yang tidak dijelaskan dalam skema
        });

        // Fungsi untuk kapitalisasi setiap kata
        function capitalizeFirstLetterOfEachWord(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const id = parseInt(req.params.id);
        let { bidang_bimbingan } = value;
        const capitalizedBidangBimbingan = capitalizeFirstLetterOfEachWord(bidang_bimbingan);

        // Cek apakah bidang bimbingan terdaftar
        const checkBidangBimbinganTerdaftar = await pool.query(queries.cekBimbinganTerdaftar, [capitalizedBidangBimbingan]);
        if (checkBidangBimbinganTerdaftar.rows.length > 0) {
            return res.status(400).json({ msg: `Bidang bimbingan ${capitalizedBidangBimbingan} sudah terdaftar` });
        }
        
        // Jika belum terdaftar, update bidang bimbingan
        await pool.query(queries.updateBimbingan, [
            capitalizedBidangBimbingan,
            id
        ]);
        return res.json({ msg: `Bidang bimbingan ${capitalizedBidangBimbingan} berhasil diperbarui` });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate bidang bimbingan', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Hapus bidang bimbingan
const deleteBimbingan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkBidangBimbinganTerdaftar = await pool.query(queries.getBimbinganById, [id]);
        if(checkBidangBimbinganTerdaftar.rows.length === 0 ) {
            return res.status(404).json({msg: " Bidang bimbingan tidak ditemukan"})
        };
        const bidangBimbingan = checkBidangBimbinganTerdaftar.rows[0].bidang_bimbingan;
        await pool.query(queries.deleteBimbingan, [id]);
        res.status(200).json({msg: `Bidang bimbingan ${bidangBimbingan} berhasil dihapus`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus bidang bimbingan', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

module.exports = {
    getBimbingan,
    getBimbinganById,
    addBimbingan,
    updateBimbingan,
    deleteBimbingan
}