// Dapatkan seluruh data konseling individu (Admin)
const getAllKonselingIndividu = `
SELECT 
    ki.id,
    ki.student_id,
    ki.jenis_kelamin_id,
    ki.judul_pengaduan,
    ki.deskripsi_permasalahan,
    ki.bidang_bimbingan_id,
    ki.lampiran,
    ki.created_at,
    ki.request_date,
    ki.arahan,
    ki.tindak_lanjut,
    s.name AS student_name,
    g.jenis_kelamin AS jenis_kelamin,
    b.bidang_bimbingan,
    st.status_konseling AS status_konseling
FROM 
    public.konseling_individu ki
JOIN 
    public.students s ON ki.student_id = s.id
JOIN 
    public.gender g ON ki.jenis_kelamin_id = g.id
JOIN 
    public.bimbingan b ON ki.bidang_bimbingan_id = b.id
JOIN 
    public.status st ON ki.status_konseling_id = st.id;
`;

// Dapatkan data konseling individu berdasarkan siswa yang login
const getKonselingIndividuByStudentId = `
SELECT 
    ki.id,
    ki.student_id,
    ki.jenis_kelamin_id,
    ki.judul_pengaduan,
    ki.deskripsi_permasalahan,
    ki.bidang_bimbingan_id,
    ki.lampiran,
    ki.created_at,
    ki.request_date,
    s.name AS student_name,
    g.jenis_kelamin AS jenis_kelamin,
    b.bidang_bimbingan,
    st.status_konseling AS status_konseling
FROM 
    public.konseling_individu ki
JOIN 
    public.students s ON ki.student_id = s.id
JOIN 
    public.gender g ON ki.jenis_kelamin_id = g.id
JOIN 
    public.bimbingan b ON ki.bidang_bimbingan_id = b.id
JOIN 
    public.status st ON ki.status_konseling_id = st.id
WHERE 
    ki.student_id = $1;
`;


// Dapatkan data status konseling
const getJenisKelaminByStudents = 'SELECT jenis_kelamin_id FROM students WHERE id = $1';
const getStatusKonseling = "SELECT id, status_konseling FROM status";


const getKonselingIndividuById = `
SELECT 
      ki.id,
      ki.student_id,
      ki.jenis_kelamin_id,
      ki.judul_pengaduan,
      ki.deskripsi_permasalahan,
      ki.bidang_bimbingan_id,
      ki.lampiran,
      ki.created_at,
      ki.request_date,
      ki.arahan,
      ki.tindak_lanjut,
      s.name AS student_name,
      g.jenis_kelamin AS jenis_kelamin,
      b.bidang_bimbingan,
      ki.status_konseling_id AS status_konseling_id
FROM 
      public.konseling_individu ki
JOIN 
      public.students s ON ki.student_id = s.id
JOIN 
      public.gender g ON ki.jenis_kelamin_id = g.id
JOIN 
      public.bimbingan b ON ki.bidang_bimbingan_id = b.id
JOIN 
      public.status st ON ki.status_konseling_id = st.id
WHERE 
      ki.id = $1;
`;

//   st.status_konseling AS status_konseling -- Mengambil nama status dari tabel status

const addKonselingIndividu = `
INSERT INTO public.konseling_individu (
    student_id, 
    jenis_kelamin_id, 
    judul_pengaduan, 
    deskripsi_permasalahan, 
    bidang_bimbingan_id, 
    lampiran,
    created_at,
    status_konseling_id,
    request_date
) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
RETURNING *;
`;



const updateKonselingIndividu = `
UPDATE konseling_individu
SET
    student_id = $1,
    jenis_kelamin_id = $2,
    judul_pengaduan = $3,
    deskripsi_permasalahan = $4,
    bidang_bimbingan_id = $5,
    lampiran = $6,
    status_konseling_id = $7,
    arahan = $8,
    tindak_lanjut = $9
WHERE id = $10
RETURNING *;`

const getKonselingIndividuAll = "SELECT COUNT(*) AS count FROM konseling_individu";

const deleteKonselingIndividu = `
DELETE FROM public.konseling_individu
WHERE id = $1;
`;

module.exports = {
    getAllKonselingIndividu,
    getKonselingIndividuByStudentId,
    getKonselingIndividuById,
    getStatusKonseling,
    getJenisKelaminByStudents,
    addKonselingIndividu,
    getKonselingIndividuAll,
    updateKonselingIndividu,
    deleteKonselingIndividu
};
