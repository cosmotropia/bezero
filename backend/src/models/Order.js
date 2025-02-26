const db = require('../config/db')

const getAllOrders = async () => {
  const result = await db.query('SELECT * FROM ocs ORDER BY id')
  return result.rows
}

const getOrderById = async (id) => {
  const result = await db.query('SELECT * FROM ocs WHERE id = $1', [id])
  return result.rows[0]
}

const getOrderByUserId = async (id) => {
  const result = await db.query('SELECT * FROM ocs WHERE id_usuario = $1', [id])
  return result.rows;
}

const createOrder = async ({ userId, cart }) => {
  const client = await db.getClient()
  try {
    await client.query('BEGIN')

    const total = cart.reduce((sum, item) => sum + item.precio_actual * item.quantity, 0);
    const orderResult = await client.query(
      'INSERT INTO ocs (id_usuario, total, timestamp) VALUES ($1, $2, NOW()) RETURNING id',
      [userId, total]
    );
    const id_oc = orderResult.rows[0].id
    console.log(id_oc)
    const insertSalesQuery = `
      INSERT INTO ventas (id_publicacion, quantity, id_oc, timestamp)
      VALUES ($1, $2, $3, NOW())
    `;

    for (const item of cart) {
      await client.query(insertSalesQuery, [item.id, item.quantity, id_oc]);
    }

    await client.query('COMMIT')
    return { id_oc, total }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error en createOrder:', error)
    throw new Error('Error al crear orden y ventas')
  } finally {
    client.release()
  }
}

const deleteOrder = async (id) => {
  await db.query('DELETE FROM ocs WHERE id = $1', [id])
}

module.exports = { getAllOrders, getOrderById, createOrder, deleteOrder, getOrderByUserId }

