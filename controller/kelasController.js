const pool = require('../config/connection');
const Joi = require('joi')
const queries = require('../model/kelasModel');
const { getNamaKelas, getKelasForm, getSiswaKelasById } = require('../model/kelasModel')



// Dapatkan data kelas
const getKelas = async (req, res) => {
    try {
        const result = await pool.query(queries.getKelas);
        const kelas = result.rows;
        res.json(kelas);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data kelas', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};
//Dapatkan ID Kelas 
const getKelasOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(getKelasForm);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching kelas options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Dapatkan nama kelas
const getClassName = async (req, res) => {
  try {
    const {rows} = await pool.query(getNamaKelas);
    console.log(rows)
    res.status(200).json(rows);
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil nama kelas:", error)
    res.status(500).json({ message: 'Error fetching class names' });
  }
};

// Dapatkan data kelas berdasarkan ID
const getKelasById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(queries.getKelasById, [id]);
        const kelas = result.rows[0];
        res.json(kelas)
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil kelas by Id', error);
        res.status(500).send({msg:'Internal Server Error'});
    };
};

// Dapatkan data siswa berdasarkan ID kelasnya
const SiswaKelasById = async (req, res) => {
    const { id } = req.params;  
    try {
       const client = await pool.connect();
       const result = await client.query(getSiswaKelasById, [id]);  
       const siswa = result.rows;
       client.release();
       res.json(siswa);
    } catch (error) {
       console.error('Terjadi kesalahan saat mengambil data siswa:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Tambahkan data Kelas
const schema = Joi.object({
    nama_kelas: Joi.string().trim().min(1).max(50).required(),
    wali_kelas_id: Joi.number().integer().required()
});

const addKelas = async (req, res) => {
    try {
        // Validasi input menggunakan Joi
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        let { nama_kelas, wali_kelas_id } = value;
        nama_kelas = nama_kelas.toUpperCase();

        // Cek apakah kelas sudah terdaftar
        const checkKelasResult = await pool.query(queries.cekKelasTerdaftar, [nama_kelas]);
        if (checkKelasResult.rows.length > 0) {
            return res.status(400).json({ msg: `Kelas ${nama_kelas} sudah terdaftar` });
        }

        // Jika kelas belum terdaftar, tambahkan ke database dan return data yang ditambahkan
        const result = await pool.query(queries.addKelas, [nama_kelas, wali_kelas_id]);
        const addedKelas = result.rows[0];

        res.status(201).json({ msg: `Kelas ${nama_kelas} Berhasil di Tambahkan`, data: addedKelas });
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data kelas:', error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Hapus data Kelas
const deleteKelas = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkKelasTerdaftar = await pool.query(queries.getKelasById, [id]);
        if (checkKelasTerdaftar.rows.length === 0) {
            return res.status(404).json({ msg: "Kelas tidak ditemukan" });
        };
        const namaKelas = checkKelasTerdaftar.rows[0].nama_kelas;
        await pool.query(queries.deleteKelas, [id]);
        res.status(200).json({ msg: `Kelas ${namaKelas} berhasil dihapus` });
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus kelas', error);
        res.status(500).json({ msg: "Internal Server Error" });
    };
};

// Fungsi untuk memperbarui data kelas
const updateKelas = async (req, res) => {
    try {
        // Validasi input menggunakan Joi
        const { error, value } = schema.validate(req.body, {
            allowUnknown: true, // Mengizinkan properti tambahan yang tidak dijelaskan dalam skema
        });

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const id = parseInt(req.params.id);
        let { nama_kelas, wali_kelas_id } = value;
        nama_kelas = nama_kelas.toUpperCase();

        // Cek apakah kelas dengan nama yang sama sudah terdaftar di kelas lain
        const checkKelasResult = await pool.query(queries.cekKelasTerdaftar, [nama_kelas]);
        if (checkKelasResult.rows.length > 0 && checkKelasResult.rows[0].id !== id) {
            return res.status(400).json({ msg: `Kelas ${nama_kelas} sudah terdaftar` });
        }

        // Jika belum terdaftar atau terdaftar dengan id yang sama, update data kelas
        const result = await pool.query(queries.updateKelas, [nama_kelas, wali_kelas_id, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: `Kelas dengan ID ${id} tidak ditemukan` });
        }

        return res.json({ msg: `Data kelas ${nama_kelas} berhasil diperbarui` });
    } catch (error) {
        console.error('Terjadi kesalahan saat update kelas', error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


module.exports = {
    getKelas,
    getKelasOptions,
    getClassName,
    SiswaKelasById,
    getKelasById,
    addKelas,
    deleteKelas,
    updateKelas
}
