const db = require('../config/db')

const getAllCategories = async () => {
  const result = await db.query('SELECT * FROM categorias ORDER BY id')
  return result.rows
}

const getCategoryById = async (id) => {
  const result = await db.query('SELECT * FROM categorias WHERE id = $1', [id])
  return result.rows[0]
}

const createCategory = async ({ nombre, descripcion }) => {
  const result = await db.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion]
  )
  return result.rows[0]
}

const updateCategory = async (id, { nombre, descripcion }) => {
  const result = await db.query(
    'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
    [nombre, descripcion, id]
  )
  return result.rows[0]
}

const deleteCategory = async (id) => {
  await db.query('DELETE FROM categorias WHERE id = $1', [id])
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory }

