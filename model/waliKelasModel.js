const getWaliKelas = `SELECT 
    wl.id,
    u.name,
    u.email,
    wl.alamat,
    wl.nomor_telepon,
    wl.jabatan,
    wl.created_at
FROM 
    public.wali_kelas wl
JOIN 
    public.users u ON wl.user_id = u.id;
`
// const getWaliKelasById = "SELECT * FROM wali_kelas WHERE id = $1";
const getWaliKelasById = `
    SELECT w.id, w.user_id, u.name AS nama_wali, w.alamat, w.nomor_telepon, w.jabatan
    FROM public.wali_kelas w
    JOIN public.users u ON w.user_id = u.id
    WHERE w.id = $1;
`;
const getWaliKelasName = `SELECT u.name FROM public.users u WHERE u.id = $1`
const getWaliKelasAll = "SELECT COUNT(*) AS count FROM wali_kelas";
const addWaliKelas = `
    INSERT INTO wali_kelas (user_id, alamat, nomor_telepon, jabatan, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
const addUserQuery = 'INSERT INTO users (name, email, password, refresh_token, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id';
const updateWaliKelas = `
    UPDATE public.wali_kelas
    SET user_id = $1,
        alamat = $2,
        nomor_telepon = $3,
        jabatan = $4
    WHERE id = $5;
`;
const deleteWaliKelas = "DELETE FROM wali_kelas WHERE id = $1";
const cekWaliKelasTerdaftar = `SELECT wl.id, u.name
FROM wali_kelas wl
JOIN users u ON wl.user_id = u.id
WHERE wl.id = $1;
`;

const getWaliKelasWithKelas = `
  SELECT 
    wali_kelas.id AS wali_kelas_id, 
    wali_kelas.user_id, 
    wali_kelas.alamat, 
    wali_kelas.nomor_telepon, 
    wali_kelas.jabatan, 
    kelas.id AS kelas_id, 
    kelas.nama_kelas,
    students.id AS siswa_id,
    students.name AS nama_siswa
  FROM wali_kelas
  INNER JOIN kelas ON wali_kelas.id = kelas.wali_kelas_id
  LEFT JOIN students ON kelas.id = students.kelas_id
  WHERE wali_kelas.user_id = $1;
`;

module.exports = {
    getWaliKelas,
    getWaliKelasName,
    addUserQuery,
    getWaliKelasById,
    getWaliKelasAll,
    addWaliKelas,
    updateWaliKelas,
    deleteWaliKelas,
    cekWaliKelasTerdaftar,
    getWaliKelasWithKelas
}
