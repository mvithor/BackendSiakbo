// const getPrestasiIndividuByStudentId = `
//    SELECT 
//     pi.id,
//     pi.tingkat_id,
//     pi.juara_id,
//     pi.penyelenggara,
//     pi.keterangan,
//     pi.student_id,
//     t.nama_tingkatan AS tingkat_nama,
//     j.nama_juara AS juara_nama,
//     s.name AS student_nama
// FROM 
//     public.prestasi_individu pi
// JOIN 
//     public.tingkatan t ON pi.tingkat_id = t.id
// JOIN 
//     public.juara j ON pi.juara_id = j.id
// JOIN 
//     public.students s ON pi.student_id = s.id
// WHERE 
//     pi.student_id = $1

// `;
const getPrestasiIndividuByStudentId = `
    SELECT 
        pi.id,
        'Individu' AS jenis_prestasi,
        pi.tingkat_id,
        pi.juara_id,
        pi.penyelenggara,
        pi.keterangan,
        pi.student_id,
        t.nama_tingkatan AS tingkat_nama,
        j.nama_juara AS juara_nama,
        s.name AS student_nama
    FROM 
        public.prestasi_individu pi
    JOIN 
        public.tingkatan t ON pi.tingkat_id = t.id
    JOIN 
        public.juara j ON pi.juara_id = j.id
    JOIN 
        public.students s ON pi.student_id = s.id
    WHERE 
        pi.student_id = $1
    
    UNION ALL

    SELECT 
        pr.id,
        'Regu' AS jenis_prestasi,
        pr.tingkat_id,
        pr.juara_id,
        pr.penyelenggara,
        pr.keterangan,
        pr.student_id,
        t.nama_tingkatan AS tingkat_nama,
        j.nama_juara AS juara_nama,
        s.name AS student_nama
    FROM 
        public.prestasi_regu pr
    JOIN 
        public.tingkatan t ON pr.tingkat_id = t.id
    JOIN 
        public.juara j ON pr.juara_id = j.id
    JOIN 
        public.students s ON pr.student_id = s.id
    WHERE 
        pr.student_id = $1
`;


const getStudentIdByUserIdQuery = `
    SELECT id
    FROM public.students
    WHERE user_id = $1
`;

module.exports = {
    getPrestasiIndividuByStudentId,
    getStudentIdByUserIdQuery
};
