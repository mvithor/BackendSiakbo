// Dapatkan seluruh data konsultasi wali siswa (admin);
const getAllKonsultasiWaliSiswa = `
SELECT 
    kws.id,
    kws.wali_siswa_id,
    kws.topik,
    kws.pelaksana_dituju,
    kws.hasil_konsultasi,
    kws.bidang_bimbingan_id,
    kws.created_at,
    kws.status_konseling_id,
    kws.request_date,
    u.name AS waliSiswa_name,  -- Mengambil nama wali siswa dari tabel users
    s.name AS student_name,
    b.bidang_bimbingan AS bidang_bimbingan,
    st.status_konseling AS status_konseling
FROM 
    public.konsultasi_wali_siswa kws
JOIN 
    public.wali_siswa ws ON kws.wali_siswa_id = ws.id
JOIN 
    public.users u ON ws.user_id = u.id  -- Join ke tabel users untuk mendapatkan nama wali siswa
JOIN 
    public.students s ON ws.id = s.wali_siswa_id
JOIN 
    public.bimbingan b ON kws.bidang_bimbingan_id = b.id
JOIN 
    public.status st ON kws.status_konseling_id = st.id;


`;

// Dapatkan data konsultasi wali siswa berdasarkan yang login
const getKonsultasiWaliSiswaId = `
    SELECT 
    kws.wali_siswa_id,
    kws.topik,
    kws.pelaksana_dituju,
    b.bidang_bimbingan,
    kws.created_at,
    st.status_konseling
FROM 
    public.konsultasi_wali_siswa kws
JOIN 
    public.wali_siswa ws ON kws.wali_siswa_id = ws.id
JOIN 
    public.bimbingan b ON kws.bidang_bimbingan_id = b.id
JOIN 
    public.status st ON kws.status_konseling_id = st.id;
`
const getWaliSiswaIdByUserIdQuery = `SELECT id FROM wali_siswa WHERE user_id = $1`;

// Dapatkan data status konseling
const getStatusKonseling = "SELECT id, status_konseling FROM status";
// const getKonsultasiWaliSiswaById = `
// SELECT 
//     kws.id,
//     kws.wali_siswa_id,
//     kws.topik,
//     kws.pelaksana_dituju,
//     kws.hasil_konsultasi,
//     kws.bidang_bimbingan_id,
//     kws.created_at,
//     kws.status_konseling_id,
//     kws.request_date,
//     ws.user_id AS wali_nama,
//     s.name AS student_name,
//     b.bidang_bimbingan AS bidang_bimbingan,
//     st.status_konseling AS status_konseling
// FROM 
//     public.konsultasi_wali_siswa kws
// JOIN 
//     public.wali_siswa ws ON kws.wali_siswa_id = ws.id
// JOIN 
//     public.students s ON ws.id = s.wali_siswa_id
// JOIN 
//     public.bimbingan b ON kws.bidang_bimbingan_id = b.id
// JOIN 
//     public.status st ON kws.status_konseling_id = st.id
// WHERE
//     ws.id = $1;
// `;

const getKonsultasiWaliSiswaById = `
SELECT 
    kws.id,
    kws.wali_siswa_id,
    kws.topik,
    kws.pelaksana_dituju,
    kws.hasil_konsultasi,
    kws.bidang_bimbingan_id,
    kws.created_at,
    kws.status_konseling_id,
    kws.request_date,
    u.name AS wali_nama, -- Ambil nama wali siswa dari tabel users
    s.name AS student_name,
    b.bidang_bimbingan AS bidang_bimbingan,
    st.status_konseling AS status_konseling
FROM 
    public.konsultasi_wali_siswa kws
JOIN 
    public.wali_siswa ws ON kws.wali_siswa_id = ws.id
JOIN 
    public.users u ON ws.user_id = u.id -- Join dengan tabel users untuk mengambil nama wali siswa
JOIN 
    public.students s ON ws.id = s.wali_siswa_id
JOIN 
    public.bimbingan b ON kws.bidang_bimbingan_id = b.id
JOIN 
    public.status st ON kws.status_konseling_id = st.id
WHERE
    ws.id = $1;
`;

const getKonsultasiAll = "SELECT COUNT(*) AS count FROM konsultasi_wali_siswa";



const addKonsultasiWaliSiswa = `
INSERT INTO public.konsultasi_wali_siswa (
    wali_siswa_id, 
    topik, 
    pelaksana_dituju, 
    hasil_konsultasi,  
    bidang_bimbingan_id, 
    created_at, 
    status_konseling_id,
    request_date
) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
RETURNING *;
`;


const updateKonsultasiWaliSiswa = `
UPDATE konsultasi_wali_siswa
SET
    wali_siswa_id = $1, 
    topik = $2, 
    pelaksana_dituju = $3, 
    hasil_konsultasi = $4, 
    bidang_bimbingan_id = $5, 
    status_konseling_id = $6
WHERE id = $7
RETURNING *;`

// const updateKonsultasiWaliSiswa = `
// SELECT 
//     k.id, 
//     k.topik, 
//     k.pelaksana_dituju, 
//     k.hasil_konsultasi, 
//     k.bidang_bimbingan_id, 
//     k.status_konseling_id,
//     u.name AS waliSiswa_name, -- Ambil nama wali siswa dari tabel users
//     s."name" AS student_name
// FROM 
//     public.konsultasi_wali_siswa AS k
// JOIN 
//     public.wali_siswa AS ws ON k.wali_siswa_id = ws.id
// JOIN 
//     public.students AS s ON s.wali_siswa_id = ws.id
// JOIN 
//     public.users AS u ON ws.user_id = u.id -- Join dengan tabel users untuk mendapatkan nama
// WHERE 
//     k.id = $1;
// `


const getNamaSiswaByWaliSiswaId = `
  SELECT s.name 
  FROM public.students s
  JOIN public.wali_siswa ws ON s.wali_siswa_id = ws.id
  WHERE ws.id = $1;
`;
const getKonsultasiWaliSiswaAll = `SELECT COUNT (*) AS count FROM konsultasi_wali_siswa`;
const deleteKonsultasiWaliSiswa = `
DELETE FROM konsultasi_wali_siswa WHERE id = $1;`

module.exports = {
    getAllKonsultasiWaliSiswa,
    getNamaSiswaByWaliSiswaId,
    getKonsultasiWaliSiswaById,
    getKonsultasiWaliSiswaId,
    getStatusKonseling,
    getWaliSiswaIdByUserIdQuery,
    addKonsultasiWaliSiswa,
    updateKonsultasiWaliSiswa,
    getKonsultasiWaliSiswaAll,
    deleteKonsultasiWaliSiswa,
    getKonsultasiAll
}
