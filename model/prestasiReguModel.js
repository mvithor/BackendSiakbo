const getPrestasiRegu = "SELECT * FROM prestasi_regu";
const getPrestasiReguByReguById = ` SELECT 
        pr.id,
        pr.regu_id,
        pr.student_id,
        pr.tingkat_id,
        pr.juara_id,
        pr.penyelenggara,
        pr.keterangan,
        r.nama_regu,
        s.name AS student_name,
        t.nama_tingkatan,
        j.nama_juara
    FROM public.prestasi_regu pr
    JOIN public.regu r ON pr.regu_id = r.id
    JOIN public.students s ON pr.student_id = s.id
    JOIN public.tingkatan t ON pr.tingkat_id = t.id
    JOIN public.juara j ON pr.juara_id = j.id
    WHERE pr.regu_id = $1;`
;
// const getPrestasiReguById = "SELECT "
const addPrestasiRegu = `
    INSERT INTO prestasi_regu (regu_id, student_id, tingkat_id, juara_id, penyelenggara, keterangan) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
`;
const getPrestasiReguAll = "SELECT COUNT(*) AS count FROM prestasi_regu";

const updatePrestasiRegu = `
    UPDATE public.prestasi_regu
    SET regu_id = $1, student_id = $2, tingkat_id = $3, juara_id = $4, penyelenggara = $5, keterangan = $6
    WHERE id = $7
    RETURNING *;
`;

const deletePrestasiReguByStudentId = `
    DELETE FROM prestasi_regu 
    WHERE regu_id = $1 AND student_id = $2
    RETURNING *
`;

module.exports = {
    getPrestasiRegu,
    getPrestasiReguByReguById,
    getPrestasiReguAll,
    addPrestasiRegu,
    updatePrestasiRegu,
    deletePrestasiReguByStudentId
}
