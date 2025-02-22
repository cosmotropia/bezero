const db = require('../config/db')

const getFavoritesByUserId = async (id_usuario) => {
  console.log('favorite from model', id_usuario)
  const result = await db.query('SELECT * FROM favoritos WHERE id_usuario = $1', [id_usuario])
  return result.rows
}

const addFavorite = async ({ id_comercio, id_usuario }) => {
  const result = await db.query(
    'INSERT INTO favoritos (id_comercio, id_usuario) VALUES ($1, $2) RETURNING *',
    [id_comercio, id_usuario]
  )
  return result.rows[0]
}

const removeFavorite = async (id) => {
  await db.query('DELETE FROM favoritos WHERE id = $1', [id])
}

const isFavorite = async (userId, commerceId) => {
  const result = await db.query(
    'SELECT 1 FROM favoritos WHERE id_usuario = $1 AND id_comercio = $2',
    [userId, commerceId]
  );
  return result.rows.length > 0
}

module.exports = { getFavoritesByUserId, addFavorite, removeFavorite, isFavorite }


