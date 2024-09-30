const getStatusKeluarga = "SELECT * FROM status_keluarga";
const getNameStatusKeluarga = "SELECT id, nama_status FROM status_keluarga";
const getStatusKeluargaById = "SELECT * FROM status_keluarga WHERE id = $1";
const addStatusKeluarga = "INSERT into status_keluarga (nama_status) VALUES ($1)";
const updateStatusKeluarga = "UPDATE status_keluarga SET nama_status = $1 WHERE id = $2";
const cekStatusKeluargaTerdaftar = "SELECT * FROM status_keluarga WHERE LOWER(nama_status) = LOWER($1)";
const deleteStatusKeluarga = "DELETE FROM status_keluarga WHERE id = $1";

module.exports = {
    getStatusKeluarga,
    getNameStatusKeluarga,
    getStatusKeluargaById,
    addStatusKeluarga,
    updateStatusKeluarga,
    cekStatusKeluargaTerdaftar,
    deleteStatusKeluarga
}
