const db = require('../config/db')

const getAllPostSales = async () => {
  const result = await db.query('SELECT * FROM post_ventas ORDER BY id_transaccion')
  return result.rows
}

const getPostSaleBySaleId = async (id_venta) => {
  const result = await db.query('SELECT * FROM post_ventas WHERE id_venta = $1', [id_venta])
  return result.rows
}

const getPostSaleByUserId = async (id_usuario) => {
  const result = await db.query('SELECT * FROM post_ventas WHERE id_usuario = $1', [id_usuario])
  return result.rows
}

const createPostSale = async ({ id_venta, id_usuario ,calificacion, comentario }) => {
  const result = await db.query(
    'INSERT INTO post_ventas (id_venta, id_usuario, calificacion, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
    [id_venta, id_usuario, calificacion, comentario]
  )
  return result.rows[0]
}
const getAverageRatingByCommerceId = async (id_comercio) => {
  try {
    const result = await db.query(
      `SELECT COALESCE(ROUND(AVG(pv.calificacion), 2), 0) AS promedio
       FROM post_ventas pv
       JOIN ventas v ON pv.id_venta = v.id
       JOIN publicaciones p ON v.id_publicacion = p.id
       WHERE p.id_comercio = $1`,
      [id_comercio]
    );

    return result.rows[0].promedio;
  } catch (error) {
    console.error('Error al obtener calificación promedio:', error);
    return 0;
  }
}
const getPostSalesByCommerceId = async (id_comercio) => {
  console.log('id_comercio post sales', id_comercio)
  try {
    const result = await db.query(
      `SELECT 
        pv.id_transaccion,
        pv.calificacion,
        pv.comentario,
        v.id_oc,
        v.id_publicacion,
        p.nombre AS nombre_publicacion
      FROM post_ventas pv
      JOIN ventas v ON pv.id_venta = v.id
      JOIN publicaciones p ON v.id_publicacion = p.id
      WHERE p.id_comercio = $1
      ORDER BY pv.id_transaccion DESC;`,
      [id_comercio]
    )
    return result.rows;
  } catch (error) {
    console.error(`Error obteniendo post ventas para comercio ${id_comercio}:`, error);
    throw new Error('Error al obtener post ventas.');
  }
}
const getCommentsByCommerceId = async (id_comercio) => {
  try {
    const result = await db.query(
      `SELECT COALESCE(JSON_AGG(pv.comentario) FILTER (WHERE pv.comentario IS NOT NULL), '[]') AS comentarios
       FROM post_ventas pv
       JOIN ventas v ON pv.id_venta = v.id
       JOIN publicaciones p ON v.id_publicacion = p.id
       WHERE p.id_comercio = $1`,
      [id_comercio]
    );

    return result.rows[0].comentarios || [];
  } catch (error) {
    console.error('Error al obtener comentarios del comercio:', error);
    return [];
  }
}
module.exports = { getAllPostSales, getPostSaleBySaleId, getPostSaleByUserId, createPostSale, getPostSalesByCommerceId, getAverageRatingByCommerceId, getCommentsByCommerceId }



