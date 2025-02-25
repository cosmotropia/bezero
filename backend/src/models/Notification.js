const db = require('../config/db')

const getNotificationsByCommerceId = async (id_comercio) => {
  console.log(`Buscando notificaciones para comercio: ${id_comercio}`)
  const result = await db.query('SELECT * FROM notificaciones WHERE id_comercio = $1', [id_comercio])
  console.log(`Resultado de la consulta:`, result.rows)
  return result.rows
}

const markNotificationAsRead = async (notificationId) => {
  console.log(`Marcando notificación ${notificationId} como leída`);
  const result = await db.query(
    'UPDATE notificaciones SET estado = TRUE WHERE id = $1 RETURNING *',
    [notificationId]
  );
  return result.rows[0];
}

const createNotification = async ({ mensaje, estado = false, id_comercio }) => {
  console.log(`Insertando notificación con: mensaje=${mensaje}, estado=${estado}, id_comercio=${id_comercio}`)
  const result = await db.query(
    'INSERT INTO notificaciones (mensaje, estado, id_comercio) VALUES ($1, $2, $3) RETURNING *',
    [mensaje, estado, id_comercio]
  )
  console.log(`Notificación insertada:`, result.rows[0])
  return result.rows[0]
}

module.exports = { getNotificationsByCommerceId, createNotification, markNotificationAsRead }



