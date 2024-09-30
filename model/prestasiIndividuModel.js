const getPrestasiIndividu = "SELECT * FROM prestasi_individu";
const getPrestasiIndividuById = "SELECT * FROM prestasi_individu WHERE id =$1";
const addPrestasiIndividu = `
    INSERT INTO prestasi_individu (student_id, tingkat_id, juara_id, penyelenggara, keterangan) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;
const getPrestasiIndividuAll = "SELECT COUNT(*) AS count FROM prestasi_individu";

const updatePrestasiIndividu = `
    UPDATE prestasi_individu
    SET student_id = $1, 
        tingkat_id = $2, 
        juara_id = $3, 
        penyelenggara = $4, 
        keterangan = $5
    WHERE id = $6
    RETURNING *;
`;
const deletePrestasiIndividu = `
    DELETE FROM prestasi_individu
    WHERE id = $1
    RETURNING *;
`;
const getNamaSiswa = "SELECT id, name FROM students"

module.exports = {
    getPrestasiIndividu,
    addPrestasiIndividu,
    getPrestasiIndividuById,
    getPrestasiIndividuAll,
    updatePrestasiIndividu,
    deletePrestasiIndividu,
    getNamaSiswa
}