const pool = require('../config/connection');
const Joi = require('joi');
const queries = require('../model/kategoriPoinModel');

// Dapatkan data kategori poin
const getKategoriPoin = async (req, res) => {
    try {
        const result = await pool.query(queries.getKategoriPoin);
        const kategoriPoin = result.rows;
        res.json(kategoriPoin)
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data kategori poin', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Dapatkan ID Kategori Poin
const getKategoriPoinOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getNameKategori);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching kategori poin options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Dapatkan data katergori poin By ID
const getKategoriPoinById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getKategoriPoinById, [id]);
        const kategoriPoin = result.rows[0];
        res.json(kategoriPoin);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil kategori poin by Id', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Tambahkan kategori poin
const schema = Joi.object({
    nama_kategori:  Joi.alternatives().try(
        Joi.string().trim().min(3).max(250),
        Joi.number().integer().min(1)
    ).required()
});

const addKategoriPoin = async (req, res) => {
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

        let { nama_kategori } = value;
        nama_kategori = capitalizeWords(nama_kategori);

        // Cek apakah kategori poin terdaftar
        const checkKategoriPoinTerdaftar = await pool.query(queries.cekKategoriPoinTerdaftar, [nama_kategori]);
        if(checkKategoriPoinTerdaftar.rows.length > 0) {
            return res.status(400).json({msg: `Kategori poin ${nama_kategori} sudah Terdaftar`});
         };

        // Menambahkan kategori poin
        await pool.query(queries.addKategoriPoin, [
            nama_kategori
        ]);
        res.status(201).json({msg: `Kategori poin ${nama_kategori} berhasil ditambahkan`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan kategori poin:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Update kategori poin
const updateKategoriPoin = async (req, res) => {
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
        let { nama_kategori } = value;
        const capitalizedKategoriPoin = capitalizeFirstLetterOfEachWord(nama_kategori);

        // Cek apakah kategori poin terdaftar
        const checkKategoriPoinTerdaftar = await pool.query(queries.cekKategoriPoinTerdaftar, [capitalizedKategoriPoin]);
        if(checkKategoriPoinTerdaftar.rows.length > 0 ) {
            return res.status(400).json({msg: `Kategori poin ${capitalizedKategoriPoin} sudah terdaftar`});
        }

        // Jika belum terdaftar, update kategori poin
        await pool.query(queries.updateKategoriPoin, [
            capitalizedKategoriPoin,
            id
        ]);
        return res.json({msg: `Kategori poin ${capitalizedKategoriPoin} berhasil diperbarui`})
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate kategori poin:', error);
        res.status(500).json({msg:'Internal Server Error'});
    };
};

// Hapus kategori poin
const deleteKategoriPoin = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Mengambil nama kategori berdasarkan ID sebelum penghapusan
        const checkKategoriPoin = await pool.query(queries.getKategoriPoinById, [id]);
        
        // Mengecek apakah kategori poin ditemukan
        if (checkKategoriPoin.rows.length === 0) {
            return res.status(404).json({ msg: "Kategori poin tidak ditemukan" });
        }

        const kategoriPoin = checkKategoriPoin.rows[0].nama_kategori;

        // Menghapus kategori poin berdasarkan ID
        await pool.query(queries.deleteKategoriPoin, [id]);
        
        // Mengembalikan respon sukses
        res.status(200).json({ msg: `Kategori poin ${kategoriPoin} berhasil dihapus` });
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus kategori poin', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};


module.exports = {
    getKategoriPoin,
    getKategoriPoinOptions,
    getKategoriPoinById,
    addKategoriPoin,
    updateKategoriPoin,
    deleteKategoriPoin
}