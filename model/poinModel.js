// Log Point
// const getLogPoints = `SELECT * FROM public.points WHERE student_id = $1 ORDER BY "date" DESC LIMIT $2 OFFSET $3`;
const getLogPoints = "SELECT * FROM points";
const getPointsById = "SELECT * FROM points WHERE id = $1";
const pointsByStudentId = "SELECT * FROM points WHERE student_id = $1";
const addPoints = `INSERT INTO points (student_id, kategori_poin_id, points, description )
                    VALUES ($1, $2, $3, $4) RETURNING *`;
const updatePoints = `UPDATE points
                      SET student_id = $1, kategori_poin_id = $2, points = $3, description = $4,
                      WHERE id = $5
                      RETURNING *;`
const updateLogPoints = `
  UPDATE total_poin_siswa
  SET total_points = $1
  WHERE student_id = $2 AND kategori_poin_id = $3
`;
const deletePoints = " DELETE FROM public.points WHERE id = $1 RETURNING *";
const getNamaSiswa ="SELECT id, name FROM students";

// Total Points
// const getJumlahPoints = `SELECT student_id, kategori_poin_id AS kategori, total_poin_siswa.total_points
//                          FROM public.total_poin_siswa
//                          JOIN public.students ON students.id = total_poin_siswa.student_id
//                          JOIN public.kategori_poin ON kategori_poin.id = total_poin_siswa.kategori_poin_id;`;
const getJumlahPoints = "SELECT * FROM total_poin_siswa";
const getTotalPoints = "SELECT * FROM total_poin_siswa WHERE student_id =$1 AND kategori_poin_id = $2";
const updateTotalPoints = "UPDATE total_poin_siswa SET total_points = total_points + $1 WHERE student_id = $2 AND kategori_poin_id = $3";
const addTotalPoints = "INSERT INTO total_poin_siswa (student_id, kategori_poin_id, total_points) VALUES ($1, $2, $3)";

// DELETER ALL TOTAL POIN AND POIN SISWA

// Delete all points data
const deleteAllPoints = "DELETE FROM points";

// Delete all total_poin_siswa data
const deleteAllTotalPoints = "DELETE FROM total_poin_siswa";

module.exports = {
    getLogPoints,
    updateLogPoints,
    getPointsById,
    pointsByStudentId,
    addPoints,
    updatePoints,
    deletePoints,
    getNamaSiswa,
    getJumlahPoints,
    getTotalPoints,
    updateTotalPoints,
    addTotalPoints,
    deleteAllPoints,
    deleteAllTotalPoints
}