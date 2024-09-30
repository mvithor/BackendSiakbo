const getRegu = "SELECT * FROM regu";
const getReguById = "SELECT id, nama_regu FROM regu WHERE id = $1";
const getJumlahRegu = "SELECT COUNT(*) AS count from regu";
const addRegu = "INSERT INTO regu (nama_regu) VALUES ($1) RETURNING *";
const deleteRegu = "DELETE FROM regu WHERE id = $1";
const updateRegu = "UPDATE regu SET nama_regu =$1 WHERE id = $2";
const checkReguTerdaftar = "SELECT * FROM regu WHERE nama_regu = $1";

module.exports = {
    getRegu,
    getReguById,
    getJumlahRegu,
    addRegu,
    deleteRegu,
    updateRegu,
    checkReguTerdaftar
}