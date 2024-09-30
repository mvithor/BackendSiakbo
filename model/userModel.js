const getUser = `SELECT u.id, u.name, u.email, r.role_name, u.created_at, u.updated_at
                 FROM public.users u
                 JOIN public.role r ON u.role_id = r.id
                 LIMIT 100 OFFSET 0`; 

const getRoleName = `SELECT id, role_name FROM role`;
const getRoleNameLogin = `SELECT id, role_name FROM role WHERE id = $1`;
const getUserLogin = "SELECT id, name, email FROM users";
const getUserById = "SELECT * FROM users WHERE id =$1";
const getGenderForm = "SELECT id, jenis_kelamin FROM gender";




// const getGender = "SELECT id FROM gender WHERE user_id = $1";
const getGender = "SELECT id FROM gender WHERE id = $1";

const getStudentById = "SELECT id FROM students WHERE user_id = $1";
const getUserByEmail = "SELECT * FROM users WHERE email =$1";
const getUserByRefreshToken = "SELECT * FROM users WHERE refresh_token = $1";
const updateRefreshToken = "UPDATE users SET refresh_token = $1 WHERE id =$2";
const findUserToken = "SELECT id FROM users WHERE refresh_token = $1";
const deleteRefreshToken = "UPDATE users SET refresh_token = NULL WHERE id = $1";
const addUser = "INSERT INTO users (name, email, password, refresh_token, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id";
const deleteUser = "DELETE FROM users WHERE id =$1";
const updateUser = `UPDATE public.users
                    SET name = $1, email = $2, role_id = $3, updated_at = NOW()
                    WHERE id = $4;
`


module.exports = {
  getUser,
  getRoleName,
  getRoleNameLogin,
  getUserLogin,
  getStudentById,
  getUserById,
  getGenderForm,
  getGender,
  getUserByRefreshToken,
  getUserByEmail,
  updateRefreshToken,
  findUserToken,
  deleteRefreshToken,
  addUser,
  deleteUser,
  updateUser,
}