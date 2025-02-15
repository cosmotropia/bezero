const db = require('../config/db')

const getAllCommerces = async () => {
  const result = await db.query('SELECT * FROM comercios ORDER BY id')
  return result.rows
}

const getCommerceById = async (id) => {
  const result = await db.query('SELECT * FROM comercios WHERE id = $1', [id])
  return result.rows[0] || null
}

const getCommerceByUserId = async (id_usuario) => {
  const result = await db.query('SELECT * FROM comercios WHERE id_usuario = $1', [id_usuario]);
  return result.rows[0] || null;
}

const createCommerce = async ({ nombre, rut, direccion, url_img, calificacion, id_usuario }) => {
  const query = `
    INSERT INTO comercios (nombre, rut, direccion, url_img, calificacion, id_usuario) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
  const values = [nombre, rut, direccion, url_img, calificacion || 0, id_usuario]

  const result = await db.query(query, values)
  return result.rows[0]
}

const updateCommerce = async (id, { nombre, direccion, url_img, calificacion }) => {
  const query = `
    UPDATE comercios 
    SET nombre = $1, direccion = $2, url_img = $3, calificacion = $4 
    WHERE id = $5 RETURNING *`
  const values = [nombre, direccion, url_img, calificacion, id]

  const result = await db.query(query, values)
  return result.rows[0] || null
}

const deleteCommerce = async (id) => {
  const result = await db.query('DELETE FROM comercios WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}

module.exports = { getAllCommerces, getCommerceById, getCommerceByUserId, createCommerce, updateCommerce, deleteCommerce }
