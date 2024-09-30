const getKategoriPoin = "SELECT * FROM kategori_poin";
const getNameKategori = "SELECT id, nama_kategori FROM kategori_poin"
const getKategoriPoinById = "SELECT * FROM kategori_poin WHERE id =$1";
const addKategoriPoin = "INSERT into kategori_poin (nama_kategori) VALUES ($1)";
const updateKategoriPoin = "UPDATE kategori_poin SET nama_kategori = $1 WHERE id = $2";
const cekKategoriPoinTerdaftar = "SELECT* FROM kategori_poin WHERE LOWER(nama_kategori) = LOWER($1)";
const deleteKategoriPoin = "DELETE FROM kategori_poin WHERE id = $1"

module.exports = {
    getKategoriPoin,
    getNameKategori,
    getKategoriPoinById,
    addKategoriPoin,
    updateKategoriPoin,
    cekKategoriPoinTerdaftar,
    deleteKategoriPoin
}