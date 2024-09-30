const pool = require('../config/connection');
const Joi = require('joi');
const queries = require('../model/waliSiswaModel');
const queriesUser = require('../model/userModel');
const bcrypt = require('bcrypt');

// Dapatkan seluruh data wali siswa
const getWaliSiswa = async (req, res) => {
    try {
        const result = await pool.query(queries.getWaliSiswa);
        const wali_siswa = result.rows;
        res.json(wali_siswa);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data wali siswa:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    };
};

// Dapatkan data wali siswa By Id
const getWaliSiswaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getWaliSiswaById, [id]);
        const wali_siswa = result.rows;
        res.json(wali_siswa);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data wali siswa By Id', error);
        res.status(500).send('Internal Server Error');
    };
};

// Dapatkan data status keluarga 
const getStatusKeluarga = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.getNameStatusKeluarga);
        console.log(rows);  // Log hasil query untuk verifikasi
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching gender options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Tambahkan data wali siswa melalui register
const registerWaliSiswa = async (req, res) => {
    const { name, email, password, confPassword, nik, pekerjaan, alamat, nomor_telepon, status_keluarga_id } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password Tidak Sama" });
      }

      try {
        console.log("Mengecek apakah email sudah terdaftar...");
    const userResult = await pool.query(queriesUser.getUserByEmail, [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    console.log("Mengecek apakah NIK sudah terdaftar...");
        const nikResult = await pool.query(queries.getWaliSiswaByNik, [nik]);
        if (nikResult.rows.length > 0) {
            return res.status(400).json({ msg: "NIK sudah terdaftar" });
        }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Menambahkan pengguna baru...");
        const addUserValues = [name, email, hashPassword, null, 4];
        console.log("addUserValues:", addUserValues);
        const newUserResult = await client.query(queriesUser.addUser, addUserValues);
        const newUserId = newUserResult.rows[0].id;

        console.log("Mengambil ID status keluarga....");
        console.log("status_keluarga_id yang diterima dari frontend:", status_keluarga_id);
        const statusKeluargaResult = await client.query(queries.getStatusKeluarga, [status_keluarga_id]);
        console.log("Hasil Status:", statusKeluargaResult);
        if (statusKeluargaResult.rows.length === 0) {
            throw new Error("Invalid status keluarga");
        }
        const statusKeluargaId = statusKeluargaResult.rows[0].id;

        console.log("Status Keluarga:", statusKeluargaId);
        console.log("Menambahkan wali siswa baru...");
        const addWaliSiswaValues = [newUserId, nik, pekerjaan, alamat, nomor_telepon, statusKeluargaId];
        console.log("addWaliSiswaValues:", addWaliSiswaValues);
        await client.query(queries.addWaliSiswa, addWaliSiswaValues)

        await client.query("COMMIT");

        res.status(201).json({msg: "Registrasi Berhasil"});
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Terjadi kesalahan saat melakukan register:', error);
      res.status(500).json({ msg: "Internal Server Error" });
    } finally{
        client.release();
    }
      } catch (error) {
        console.error('Terjadi kesalahan saat melakukan registrasi:', error);
        res.status(500).json({ msg: "Internal Server Error" });
      };
};

// Update wali siswa
const updateWaliSiswa = async (req, res) => {
    const client = await pool.connect();
    try {
        const id = parseInt(req.params.id);
        const { user_id, nik, pekerjaan, alamat, nomor_telepon, status_keluarga_id } = req.body;

        // Validasi backend
        if (!user_id || !nik || !pekerjaan || !alamat || !nomor_telepon || !status_keluarga_id) {
            return res.status(400).json({msg: "Semua kolom harus di isi"});
        }
        
        // Mulai transaksi
        await client.query('BEGIN');

        // Update data wali siswa
        const result = await client.query(queries.updateWaliSiswa, [
            user_id,
            nik,
            pekerjaan,
            alamat,
            nomor_telepon,
            status_keluarga_id,
            id
        ]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({msg: 'Wali siswa tidak ditemukan'});
        }

        await client.query('COMMIT');
        return res.json({msg: 'Data pribadi berhasil diperbarui'})
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate data wali kelas', error);
        await client.query('ROLLBACK');
        res.status(500).json({ msg: 'Internal Server Error' });
    } finally {
        client.release();
    };
};

module.exports = {
    getWaliSiswa,
    getStatusKeluarga,
    getWaliSiswaById,
    registerWaliSiswa,
    updateWaliSiswa
}
