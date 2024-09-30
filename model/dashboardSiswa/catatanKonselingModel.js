const getCatatanKonselingIndividuByStudentId = `
SELECT 
    ki.judul_pengaduan,
    ki.deskripsi_permasalahan,
    ki.arahan,
    ki.tindak_lanjut
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

module.exports = {
    getCatatanKonselingIndividuByStudentId
}