const getBimbingan = "SELECT * FROM bimbingan";
const getBimbinganById = "SELECT * FROM bimbingan WHERE id = $1";
const addBimbingan = "INSERT INTO bimbingan (bidang_bimbingan) VALUES ($1)";
const deleteBimbingan = "DELETE FROM bimbingan WHERE id = $1";
const updateBimbingan = "UPDATE bimbingan SET bidang_bimbingan = $1 WHERE id = $2";
const cekBimbinganTerdaftar = "SELECT * FROM bimbingan WHERE LOWER(bidang_bimbingan) = LOWER($1)";

module.exports = {
    getBimbingan,
    getBimbinganById,
    addBimbingan,
    deleteBimbingan,
    updateBimbingan,
    cekBimbinganTerdaftar
}