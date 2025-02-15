const db = require('../config/db')

const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM usuarios ORDER BY id')
  return result.rows
}

const getUserById = async (id) => {
  const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id])
  return result.rows[0]
}
const getUserByEmail = async (email) => {
  console.log('duplicated email', email)
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0] || null;
}

const createUser = async ({ nombre, email, telefono, direccion, contrasena, es_comercio }) => {
  console.log('creating user....')
  console.log({nombre, email, telefono, direccion, contrasena, es_comercio})
  const result = await db.query(
    'INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, email, telefono, direccion, contrasena, es_comercio]
  )
  console.log('return of model', result.rows[0])
  return result.rows[0]
}

const updateUser = async (id, { nombre, email, telefono, direccion }) => {
  const result = await db.query(
    'UPDATE usuarios SET nombre = $1, email = $2, telefono = $3, direccion = $4 WHERE id = $5 RETURNING *',
    [nombre, email, telefono, direccion, id]
  )
  return result.rows[0]
}

const deleteUser = async (id) => {
  await db.query('DELETE FROM usuarios WHERE id = $1', [id])
}

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser };

