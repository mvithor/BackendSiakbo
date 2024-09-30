const pool = require('../config/connection');
const { getStudentsAll } = require('../model/siswaModel');
const { getKelasAll } = require('../model/kelasModel');
const { getPelanggaranAll } = require('../model/pelanggaranModel');
const { getKonselorAll } = require('../model/konselorModel');
const { getWaliKelasAll } = require('../model/waliKelasModel');
const { getWaliSiswaAll } = require('../model/waliSiswaModel');
const { getPrestasiIndividuAll } = require('../model/prestasiIndividuModel');
const { getPrestasiReguAll } = require('../model/prestasiReguModel');
const { getPrestasiMadrasahAll } = require('../model/prestasiModel');
const { getKonselingIndividuAll } = require('../model/dashboardSiswa/konselingIndividuModel');
const { getKonsultasiAll } = require('../model/dashboardWaliSiswa/konsultasiModel');

// Dapatkan jumlah data siswa
const getCountStudent = async (req, res) => {
    try {
      const result = await pool.query(getStudentsAll);
      const count = result.rows[0].count;
      res.json({count})
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil jumlah siswa', error);
      res.status(500).json({msg: `Internal Server Error`});
    }
}

// Dapatkan jumlah data kelas
const getCountKelas = async (req, res) => {
    try {
        const result = await pool.query(getKelasAll);
        const count = result.rows[0].count;
        res.json({count});
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil jumlah kelas', error);
        res.status(500).json({msg: `Internal Server Error`});
    };
};

// Dapatkan jumlah data pelanggaran
const getCountPelanggaran = async (req, res) => {
    try {
        const result = await pool.query(getPelanggaranAll);
        const count = result.rows[0].count;
        res.json({count});
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil jumlah kelas', error);
        res.status(500).json({msg: `Internal Server Error`});
    };
};

// Dapatkan jumlah data konselor
const getCountKonselor = async (req, res) => {
    try {
      const result = await pool.query(getKonselorAll);
      const count = result.rows[0].count;
      res.json({count})
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil jumlah konselor', error);
      res.status(500).json({msg: `Internal Server Error`});
    };
  };

// Dapatkan jumlah wali kelas
const getCountWaliKelas = async (req, res) => {
  try {
    const result = await pool.query(getWaliKelasAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah wali kelas', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah wali siswa
const getCountWaliSiswa = async (req, res) => {
  try {
    const result = await pool.query(getWaliSiswaAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah wali siswa', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah prestasi Individu
const getCountPrestasiIndividu = async (req, res) => {
  try {
    const result = await pool.query(getPrestasiIndividuAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah prestasi individu', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah prestasi regu
const getCountPrestasiRegu = async (req, res) => {
  try {
    const result = await pool.query(getPrestasiReguAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah prestasi regu', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah prestasi madrasah
const getCountPrestasiMadrasah = async (req, res) => {
  try {
    const result = await pool.query(getPrestasiMadrasahAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah prestasi madrasah', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah sesi konseling
const getCountKonselingIndividu = async (req, res) => {
  try {
    const result = await pool.query(getKonselingIndividuAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah konseling individu', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Dapatkan jumlah sesi konsultasi
const getCountKonsultasiWaliSiswa = async (req, res) => {
  try {
    const result = await pool.query(getKonsultasiAll);
    const count = result.rows[0].count;
    res.json({count})
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil jumlah konsultasi wali siswa', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};





module.exports = {
    getCountStudent,
    getCountWaliSiswa,
    getCountWaliKelas,
    getCountKelas,
    getCountPelanggaran,
    getCountKonselor,
    getCountPrestasiIndividu,
    getCountPrestasiRegu,
    getCountPrestasiMadrasah,
    getCountKonselingIndividu,
    getCountKonsultasiWaliSiswa
};
