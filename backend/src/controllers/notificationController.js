const NotificationModel = require('../models/Notification')

const getNotificationsByCommerceId = async (req, res) => {
  try {
    const { id_comercio } = req.params
    console.log(`Solicitud GET para notificaciones de comercio: ${id_comercio}`)
    const notifications = await NotificationModel.getNotificationsByCommerceId(id_comercio)
    
    if (!notifications.length) {
      console.log(`No se encontraron notificaciones para el comercio con id ${id_comercio}`)
    }

    res.status(200).json(notifications)
  } catch (error) {
    console.error(`Error al obtener notificaciones: ${error.message}`)
    res.status(500).json({ error: 'Error al obtener notificaciones' })
  }
}

const createNotification = async (req, res) => {
  try {
    console.log(`Solicitud POST para crear notificación:`, req.body)
    const newNotification = await NotificationModel.createNotification(req.body)
    res.status(201).json(newNotification)
  } catch (error) {
    console.error(`Error al crear notificación: ${error.message}`)
    res.status(500).json({ error: 'Error al crear notificación' })
  }
}

module.exports = { getNotificationsByCommerceId, createNotification }


