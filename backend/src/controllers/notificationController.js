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
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Solicitud para marcar notificación ${id} como leída`);
    const updatedNotification = await NotificationModel.markNotificationAsRead(id);
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error.message);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
}

const createNotification = async (req, res) => {
  try {
    const newNotification = await NotificationModel.createNotification(req.body)
    res.status(201).json(newNotification)
  } catch (error) {
    console.error(`Error al crear notificación: ${error.message}`)
    res.status(500).json({ error: 'Error al crear notificación' })
  }
}

module.exports = { getNotificationsByCommerceId, createNotification, markNotificationAsRead }


