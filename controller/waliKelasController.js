const pool = require('../config/connection');
const Joi = require('joi');
const queries = require('../model/waliKelasModel');
const bcrypt = require('bcrypt');

// Dapatkan seluruh data wali kelas 
const getWaliKelas = async (req, res) => {
    try {
        const result = await pool.query(queries.getWaliKelas);
        const wali_kelas = result.rows;
        res.json(wali_kelas);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data wali kelas:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Dapatkan wali kelas berdasarkan id nya
// const getWaliKelasById = async (req, res) => {
//     const id  = parseInt (req.params.id);
//     try {
//         const result = await pool.query(getWaliKelasById, [id]);
//         if (result.rows.length > 0) {
//             res.json(result.rows[0]);
//         } else {
//             res.status(404).json({ msg: 'Data wali kelas tidak ditemukan' });
//         }
//     } catch (error) {
//         console.error('Error fetching wali kelas:', error);
//         res.status(500).json({ msg: 'Terjadi kesalahan saat mengambil data wali kelas' });
//     }
// };

const getWaliKelasById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getWaliKelasById, [id]);
        const wali_kelas = result.rows[0];
        res.json(wali_kelas);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data wali kelas By Id', error);
        res.status(500).send('Internal Server Error');
    };
};

// Tambahkan data wali kelas
const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
        .messages({
            'string.base': 'Nama harus berupa teks.',
            'string.empty': 'Nama tidak boleh kosong.',
            'string.min': 'Nama harus memiliki minimal 3 karakter.',
            'string.max': 'Nama tidak boleh lebih dari 50 karakter.',
            'any.required': 'Nama wajib diisi.'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Format email tidak valid.',
            'string.empty': 'Email tidak boleh kosong.',
            'any.required': 'Email wajib diisi.'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password harus memiliki minimal 6 karakter.',
            'string.empty': 'Password tidak boleh kosong.',
            'any.required': 'Password wajib diisi.'
        }),
    alamat: Joi.string().max(255).required()
        .messages({
            'string.max': 'Alamat tidak boleh lebih dari 255 karakter.',
            'string.empty': 'Alamat tidak boleh kosong.',
            'any.required': 'Alamat wajib diisi.'
        }),
    nomor_telepon: Joi.string().pattern(/^[0-9]{10,15}$/).required()
        .messages({
            'string.pattern.base': 'Nomor telepon harus terdiri dari 10 hingga 15 digit angka.',
            'string.empty': 'Nomor telepon tidak boleh kosong.',
            'any.required': 'Nomor telepon wajib diisi.'
        }),
    jabatan: Joi.string().max(50).required()
        .messages({
            'string.max': 'Jabatan tidak boleh lebih dari 50 karakter.',
            'string.empty': 'Jabatan tidak boleh kosong.',
            'any.required': 'Jabatan wajib diisi.'
        }),
});



const addWaliKelas = async (req, res) => {
    // Validasi data menggunakan schema Joi
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, alamat, nomor_telepon, jabatan } = req.body;

    // Hash password
    const saltRounds = 10;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
        return res.status(500).json({ message: 'Error hashing password' });
    }

    // Mulai transaksi
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
    
        // Tambah user ke tabel users
        const userValues = [name, email, hashedPassword, null, 2];
        const userResult = await client.query(queries.addUserQuery, userValues);
        const userId = userResult.rows[0].id;

        // Tambah wali kelas ke tabel wali kelas
        const waliKelasValues = [userId, alamat, nomor_telepon, jabatan, new Date()];
        await client.query(queries.addWaliKelas, waliKelasValues);
        
        // Commit transaksi
        await client.query('COMMIT');
        res.status(201).json({ message: 'Wali kelas berhasil di tambahkan' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding wali kelas', error);
        res.status(500).json({ message: 'Error adding wali kelas' });
    } finally {
        client.release();
    } 
};


// const addWaliKelas = async (req, res) => {

//     // Validasi data menggunakan schema Joi
//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }

//     const { name, email, password, alamat, nomor_telepon, jabatan } = req.body;

//     // Mulai transaksi
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');
    
//     // Tambah user ke tabel users
//     const userValues = [name, email, password, null, 2];
//     const userResult = await client.query(queries.addUserQuery, userValues);
//     const userId = userResult.rows[0].id;

//     // Tambah wali kelas ke tabel wali kelas
//     const waliKelasValues = [userId, alamat, nomor_telepon, jabatan, new Date()];
//     await client.query(queries.addWaliKelas, waliKelasValues);
    
//     // Commit transaksi
//     await client.query('COMMIT');
//     res.status(201).json({ message: 'Wali kelas berhasil di tambahkan' });
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Error adding wali kelas', error);
//         res.status(500).json({ message: 'Error adding wali kelas' });
//       } finally {
//         client.release();
//     } 
// }

// Update wali kelas
const updateWaliKelas = async (req, res) => {
    const client = await pool.connect(); // Menggunakan connection pooling
    try {
        const id = parseInt(req.params.id);
        const { user_id, alamat, nomor_telepon, jabatan } = req.body;

        // Validasi input data (misalnya dengan Joi atau validasi manual)
        if (!user_id || !alamat || !nomor_telepon || !jabatan) {
            return res.status(400).json({ msg: 'Semua kolom harus diisi' });
        }

        // Mulai transaksi
        await client.query('BEGIN');

        // Lakukan update data wali kelas
        const result = await client.query(queries.updateWaliKelas, [
            user_id,
            alamat,
            nomor_telepon,
            jabatan,
            id
        ]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Wali kelas tidak ditemukan' });
        }

        // Ambil nama wali kelas dari tabel `users`
        const userResult = await client.query(queries.getWaliKelasName, [user_id]
        );
        
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
        }

        const userName = userResult.rows[0].name;

        // Commit transaksi
        await client.query('COMMIT');

        return res.json({ msg: `Data wali kelas ${userName} berhasil diperbarui` });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate data wali kelas', error);
        await client.query('ROLLBACK');
        res.status(500).json({ msg: 'Internal Server Error' });
    } finally {
        client.release(); 
    }
};

// // Hapus data wali kelas
const deleteWaliKelas = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkWaliKelasTerdaftar = await pool.query(queries.cekWaliKelasTerdaftar, [id]);
        if (checkWaliKelasTerdaftar.rows.length === 0) {
            return res.status(400).json({msg: "Wali kelas tidak ditemukan"});
        };
        const namaWali = checkWaliKelasTerdaftar.rows[0].name;
        await pool.query(queries.deleteWaliKelas, [id]);
        res.status(200).json({msg: `Wali kelas ${namaWali} berhasil dihapus`})
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus wali kelas', error);
        res.status(500).json({ msg: "Internal Server Error" });
    };
};

const getWaliKelasWithKelas = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(queries.getWaliKelasWithKelas, [userId]);
        const waliKelasWithKelas = result.rows;
        res.json(waliKelasWithKelas);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data wali kelas dan kelas:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

module.exports = {
    getWaliKelas,
    getWaliKelasById,
    addWaliKelas,
    updateWaliKelas,
    deleteWaliKelas,
    getWaliKelasWithKelas
}