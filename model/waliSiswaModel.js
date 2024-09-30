// const getWaliSiswa = `SELECT 
//     ws.id,  
//     u.name,
//     ws.nik,
//     ws.pekerjaan,
//     ws.alamat,
//     ws.nomor_telepon,
//     ws.status_keluarga_id  
//     FROM 
//         wali_siswa ws
//     JOIN 
//         users u ON ws.user_id = u.id;
//     `;
const getWaliSiswa = `SELECT 
      ws.id,  
      u.name AS wali_name,
      ws.nik,
      ws.pekerjaan,
      ws.alamat,
      ws.nomor_telepon,
      ws.status_keluarga_id,
      s.name AS student_name
      FROM 
      wali_siswa ws
      JOIN 
      users u ON ws.user_id = u.id
      LEFT JOIN 
      students s ON s.wali_siswa_id = ws.id;
      `;


const getWaliSiswaById = `
    SELECT 
      ws.id, 
      u.name AS nama_wali, 
      ws.nik, 
      ws.pekerjaan, 
      ws.alamat, 
      ws.nomor_telepon, 
      sk.nama_status AS status_keluarga 
    FROM 
      wali_siswa ws
    JOIN 
      users u ON ws.user_id = u.id
    LEFT JOIN 
      status_keluarga sk ON ws.status_keluarga_id = sk.id
    WHERE 
      ws.id = $1;
  `;

const addWaliSiswa = 'INSERT INTO wali_siswa (user_id, nik, pekerjaan, alamat, nomor_telepon, status_keluarga_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
const updateWaliSiswa = `UPDATE wali_siswa 
                         SET user_id = $1,
                         nik = $2,
                         pekerjaan = $3,
                         alamat = $4,
                         nomor_telepon = $5,
                         status_keluarga_id = $6
                         WHERE id = $7`;
const cekWaliSiswaTerdaftar = `
  SELECT 
    ws.id, 
    u.name 
  FROM 
    wali_siswa ws
  JOIN 
    users u ON ws.user_id = u.id
  WHERE 
    ws.id = $1;
`;
const getWaliSiswaByNik = 'SELECT * FROM wali_siswa WHERE nik = $1';
const getStatusKeluarga = "SELECT id FROM status_keluarga WHERE id = $1";
const deleteWaliSiswa = "DELETE FROM wali_siswa WHERE id = $1";
const getWaliSiswaName = `SELECT u.name FROM public.users u WHERE u.id = $1`;
const getWaliSiswaAll = `SELECT COUNT(*) AS count FROM wali_siswa`;
const addUserQuery = 'INSERT INTO users (name, email, password, refresh_token, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id';
const getNameStatusKeluarga = "SELECT id, nama_status FROM status_keluarga";


module.exports = {
    getWaliSiswa,
    getWaliSiswaByNik,
    getStatusKeluarga,
    getWaliSiswaById,
    addWaliSiswa,
    updateWaliSiswa,
    cekWaliSiswaTerdaftar,
    deleteWaliSiswa,
    getWaliSiswaName,
    getWaliSiswaAll,
    addUserQuery,
    getNameStatusKeluarga
}



