const db = require('../config/db')

const getAllSales = async () => {
  const result = await db.query('SELECT * FROM ventas ORDER BY id')
  return result.rows
}

const getSalesByOrderId = async (id_oc) => {
  const result = await db.query('SELECT * FROM ventas WHERE id_oc = $1', [id_oc])
  return result.rows
}

const createSale = async ({ id_publicacion, quantity, id_oc }) => {
  const result = await db.query(
    'INSERT INTO ventas (id_publicacion, quantity, id_oc) VALUES ($1, $2, $3) RETURNING *',
    [id_publicacion, quantity, id_oc]
  )
  return result.rows[0]
}

const deleteSale = async (id) => {
  const result = await db.query('DELETE FROM ventas WHERE id = $1 RETURNING *', [id])
  return result.rowCount > 0 ? result.rows[0] : null
}


const getTotalSalesByCommerceId = async (id_comercio) => {
  console.log('model sales total')
  const result = await db.query(
    `SELECT COUNT(v.id) AS total_ventas, SUM(o.total) AS total_recaudado FROM ventas v
     JOIN publicaciones p ON v.id_publicacion = p.id
     JOIN ocs o ON v.id_oc = o.id
     WHERE p.id_comercio = $1`,
    [id_comercio]
  )
  return result.rows[0];
}

module.exports = { getAllSales, getSalesByOrderId, createSale, deleteSale, getTotalSalesByCommerceId }

