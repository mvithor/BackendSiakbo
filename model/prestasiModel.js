const getPrestasiMadrasah = "SELECT * FROM prestasi_madrasah";
const getPrestasiMadrasahById = "SELECT * FROM prestasi_madrasah WHERE id = $1";
const getNamaLomba = "SELECT id, lomba FROM prestasi_madrasah";
const getJumlahPrestasiMadrasah = "SELECT COUNT(*) AS count FROM prestasi_madrasah";
const addPrestasiMadrasah = "INSERT INTO prestasi_madrasah ( lomba, tingkat_id, juara_id, penyelenggara, keterangan) VALUES ( $1, $2, $3, $4, $5)";
const deletePrestasiMadrasah = "DELETE FROM prestasi_madrasah WHERE id = $1";
const updatePrestasiMadrasah = "UPDATE prestasi_madrasah SET lomba = $1, tingkat_id = $2, juara_id = $3, penyelenggara = $4, keterangan = $5 WHERE id = $6";
const cekPrestasiMadrasahTerdaftar = "SELECT * FROM prestasi_madrasah WHERE LOWER(lomba) = LOWER($1)";
const getPrestasiMadrasahAll = "SELECT COUNT(*) AS count FROM prestasi_regu";
module.exports = {
    getPrestasiMadrasah,
    getPrestasiMadrasahById,
    getNamaLomba,
    getJumlahPrestasiMadrasah,
    addPrestasiMadrasah,
    deletePrestasiMadrasah,
    updatePrestasiMadrasah,
    cekPrestasiMadrasahTerdaftar,
    getPrestasiMadrasahAll
}