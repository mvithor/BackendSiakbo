const getKelas = "SELECT * FROM kelas";
const getKelasForm = "SELECT id FROM kelas WHERE id = $1";
// const getSiswaKelasById = "SELECT id, name FROM students WHERE kelas_id = $1";
const getSiswaKelasById = `
    SELECT
        s.id AS student_id,
        s.name AS student_name,
        u.name AS wali_kelas_name
    FROM
        students s
    JOIN
        kelas k ON s.kelas_id = k.id
    JOIN
        wali_kelas w ON k.wali_kelas_id = w.id
    JOIN
        users u ON w.user_id = u.id  -- Gabungkan dengan tabel users untuk mendapatkan nama wali kelas
    WHERE
        s.kelas_id = $1;
`;



const getNamaKelas = "SELECT id, nama_kelas FROM kelas";
const getKelasById = "SELECT * FROM kelas WHERE id =$1";
const getKelasAll = "SELECT COUNT(*) AS count FROM kelas";
const addKelas = "INSERT INTO kelas (nama_kelas, wali_kelas_id ) VALUES ($1, $2) RETURNING*";
const deleteKelas = "DELETE FROM kelas WHERE id = $1";
const updateKelas = "UPDATE kelas SET nama_kelas = $1, wali_kelas_id = $2 WHERE id = $3";
const cekKelasTerdaftar = "SELECT * FROM kelas WHERE LOWER(nama_kelas) = LOWER($1)";

module.exports = {
    getKelas,
    getKelasForm,
    getSiswaKelasById,
    getNamaKelas,
    getKelasById,
    getKelasAll,
    addKelas,
    deleteKelas,
    updateKelas,
    cekKelasTerdaftar
}
