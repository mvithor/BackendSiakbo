const pool = require('../config/connection');
const queries = require('../model/namaReguModel');
const Joi = require('joi');

// Dapatkan data nama regu
const getRegu = async (req, res) => {
    try {
        const result = await pool.query(queries.getRegu)
        const nama_regu = result.rows;
        res.json(nama_regu);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data regu:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Dapatkan ID nama regu
const getReguById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getReguById, [id]);
        const nama_regu = result.rows[0];
        
        if (!nama_regu) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }
        
        res.json(nama_regu);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data regu By Id', error);
        res.status(500).send('Internal Server Error');
    }
};


// Tambah nama regu 
const schema = Joi.object({
    nama_regu: Joi.alternatives().try(
        Joi.string().trim().min(3).max(100),
        Joi.number().integer().min(1)
    ).required()
});

const addRegu = async (req, res) => {
    try {
         // Validasi input menggunakan Joi
         const { error, value } = schema.validate(req.body);

         // Fungsi untuk kapitalisasi setiap kata
        function capitalizeWords(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }
         if (error) {
             return res.status(400).json({ msg: error.details[0].message });
         }

        let { nama_regu } = value;
        nama_regu = capitalizeWords(nama_regu);

         // Cek Apakah nama regu sudah terdaftar
         const checkReguResult = await pool.query(queries.checkReguTerdaftar, [nama_regu]);
         if(checkReguResult.rows.length > 0) {
            return res.status(400).json({msg: `Nama Tim ${nama_regu} sudah Terdaftar`});
         };

        // Menambhkan nama regu
        const result = await pool.query(queries. addRegu, [
            nama_regu
        ]);
        res.status(201).json({msg: `Nama tim ${nama_regu} berhasil ditambahkan`, regu: result.rows[0] })
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan nama tim:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Update Nama regu
const updateRegu = async (req, res) => {
    try {
        // Validasi input menggunakan Joi
        const { error, value } = schema.validate(req.body, {
            allowUnknown: true, // Mengizinkan properti tambahan yang tidak dijelaskan dalam skema
        });

         // Fungsi untuk kapitalisasi setiap kata
         function capitalizeWords(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const id = parseInt(req.params.id);
        let { nama_regu } = value;
        nama_regu = capitalizeWords(nama_regu); 

        // Cek apakah nama regu/tim terdaftar
        const checkReguResult = await pool.query(queries.checkReguTerdaftar, [nama_regu]);
        if(checkReguResult.rows.length > 0) {
           return res.status(400).json({msg: `Nama Tim ${nama_regu} sudah Terdaftar`});
        };

        // Jika belum terdaftar, Update data regu
        await pool.query(queries.updateRegu, [
            nama_regu,
            id
        ]);
        return res.json({msg: `Nama tim ${nama_regu} berhasil diperbarui`})
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate nama regu', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Hapus data regu
const deleteRegu = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkReguTerdaftar = await pool.query(queries.getReguById, [id]);
        if(checkReguTerdaftar.rows.length === 0 ) {
            return res.status(404).json({msg: "Nama tim tidak ditemukan"})
        };
        const namaRegu = checkReguTerdaftar.rows[0].nama_regu;
        await pool.query(queries.deleteRegu, [id]);
        res.status(200).json({msg: `Nama tim ${namaRegu} berhasil dihapus`});
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus nama tim', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

module.exports = {
    getRegu,
    getReguById,
    addRegu,
    updateRegu,
    deleteRegu
}