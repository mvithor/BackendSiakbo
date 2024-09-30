const pool = require('../config/connection');
const queriesUser = require('../model/userModel');
const { getUserByEmail,
        getUser,
        getUserById,
        updateUser,
        getRoleName,
        getGender,
        getRoleNameLogin,
        getGenderForm,
        deleteUser
      } = require('../model/userModel')
const queriesSiswa = require('../model/siswaModel');
const queriesKelas = require('../model/kelasModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');


// Ambil seluruh data user 
const getAllUser = async (req, res) => {
  try {
    const result = await pool.query(getUser);
    const AllUser = result.rows;
    res.json(AllUser);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data semua user:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  };
};

// Ambil option role id
const getRoleOptions = async (req, res) => {
  try {
    const {rows} = await pool.query(getRoleName);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching role options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
  };
};


// Function ambil data user
const getUsers = async (req, res) => {
  try {
    
    const result = await pool.query(queriesUser.getUserLogin);
    const user = result.rows;
    res.json(user)
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data user', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function ambil data usersById
const getUsersById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("Request params:", req.params);
    if (isNaN(id)) {
      return res.status(400).json({ msg: "ID tidak valid" });
    }
    const result = await pool.query(getUserById, [id]);
    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil user by Id', error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
};

// Dapatkan data jenis kelamin
const getJenisKelamin = async (req, res) => {
  try {
      const {rows} = await pool.query(getGenderForm);
      console.log(rows); 
      res.status(200).json(rows)
  } catch (error) {
      console.error("Error fetching gender options:", error);
      res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update data user
const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  role_id: Joi.number().integer().required(),
  updated_at: Joi.date().required()
});
const updatedUsers = async (req, res) => {
  try {
    // Validasi input menggunakan Joi
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const id = parseInt(req.params.id);
    const { name, email, role_id } = value;

    // Ambil data user yang ada di database untuk memeriksa email
    const currentUserResult = await pool.query(queriesUser.getUserById, [id]);
    const currentUser = currentUserResult.rows[0];

    // Jika email berubah, periksa apakah email baru sudah terdaftar
    if (email !== currentUser.email) {
      const userResult = await pool.query(queriesUser.getUserByEmail, [email]);
      if (userResult.rows.length > 0) {
        return res.status(400).json({ msg: "Email sudah terdaftar" });
      }
    }

    // Update user
    const result = await pool.query(updateUser, [
      name,
      email,
      role_id,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: `User tidak ditemukan` });
    }

    return res.json({ msg: `User ${name} berhasil diperbarui` });
  } catch (error) {
    console.error('Terjadi kesalahan saat update user', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// Function hapus user
const deleteUsers = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const checkUserTerdaftar = await pool.query(getUserById, [id]);
      if(checkUserTerdaftar.rows.length === 0 ) {
        return res.status(404).json({msg: "Pengguna tidak ditemuka"})
      };
      const userName = checkUserTerdaftar.rows[0].name;
      await pool.query(deleteUser, [id]);
      res.status(200).json({msg: `Akun pengguna ${userName} berhasil dihapus` });
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus pengguna', error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
  };

// Function Register
const Register = async (req, res) => {
  const { name, email, password, confPassword, jenis_kelamin_id, tanggal_lahir, kelas_id, alamat } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password Tidak Sama" });
  }

  try {
    console.log("Mengecek apakah email sudah terdaftar...");
    const userResult = await pool.query(queriesUser.getUserByEmail, [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      console.log("Menambahkan pengguna baru...");
      const addUserValues = [name, email, hashPassword, null, 3 ];
      console.log("addUserValues:", addUserValues);
      const newUserResult = await client.query(queriesUser.addUser, addUserValues);
      const newUserId = newUserResult.rows[0].id;

      console.log("Mengambil ID jenis kelamin...");
      console.log("jenis_kelamin_id yang diterima dari frontend:", jenis_kelamin_id);
      const genderResult = await client.query(getGender, [jenis_kelamin_id]);
      console.log("genderResult:", genderResult.rows);
      if (genderResult.rows.length === 0) {
        throw new Error("Invalid gender type");
      }
      const genderId = genderResult.rows[0].id;

      console.log("Validasi kelas ID...");
      const kelasResult = await client.query(queriesKelas.getKelasForm, [kelas_id]);
      console.log("kelasResult:", kelasResult.rows);
      if (kelasResult.rows.length === 0) {
        throw new Error("Invalid class ID");
      }
      const kelasId = kelasResult.rows[0].id;

      console.log("Jenis kelamin ID:", genderId);
      console.log("Kelas ID:", kelasId);
      console.log("Menambahkan siswa baru...");
      const addStudentValues = [newUserId, name, genderId, tanggal_lahir, kelasId, alamat];
      console.log("addStudentValues:", addStudentValues);
      await client.query(queriesSiswa.addStudent, addStudentValues);

      await client.query('COMMIT');

      res.status(201).json({ msg: "Registrasi berhasil" });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Terjadi kesalahan saat melakukan register:', error);
      res.status(500).json({ msg: "Internal Server Error" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan registrasi:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// Function Login

const Login = async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log(req.body);

      // Validasi email dan password harus diisi
      if (!email || !password) {
          return res.status(400).json({ msg: "Email dan password diperlukan" });
      }

      const userResult = await pool.query(getUserByEmail, [email]);

      // Cek apakah email terdaftar
      if (userResult.rows.length === 0) {
          return res.status(400).json({ msg: "Email tidak terdaftar" });
      }

      // Ambil data pengguna dari hasil query
      const user = userResult.rows[0];

      // Apakah passwordnya sama?
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ msg: "Password Salah" });

      // Ambil informasi pengguna termasuk role_name dari tabel role
      const roleResult = await pool.query(getRoleNameLogin, [user.role_id]);

      if (roleResult.rows.length === 0) {
          return res.status(400).json({ msg: "Role tidak ditemukan" });
      }

      const { role_name } = roleResult.rows[0];
      const { id: userId, name, email: userEmail } = user;

      // Variabel untuk menyimpan studentId
      let studentId = null;

      // Ambil studentId jika pengguna adalah siswa
      if (role_name === 'siswa') {
          const studentResult = await pool.query(queriesUser.getStudentById, [userId]);
          if (studentResult.rows.length === 0) {
              return res.status(400).json({ msg: "Siswa tidak ditemukan untuk pengguna ini" });
          }
          studentId = studentResult.rows[0].id;
      }

      // Buat akses token
      const payload = { id: userId, role: role_name, name, email: userEmail };
      if (studentId) {
          payload.studentId = studentId;
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '3600s'
      });

      console.log('Generated token:', accessToken); // Tambahkan log ini untuk melihat token yang dibuat
      res.json({ accessToken, name, role: role_name, userId, studentId });
      console.log(accessToken, name, role_name, userId, studentId);

  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Function Logout
const Logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');  
    return res.sendStatus(200);
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan logout', error);
    return res.status(500).json({ msg: "Internal Server Error" }); 
  }
};

module.exports = {
    getUsers,
    updatedUsers,
    getAllUser,
    getRoleOptions,
    getJenisKelamin,
    getUsersById,
    deleteUsers,
    Register,
    Login,
    Logout,
};