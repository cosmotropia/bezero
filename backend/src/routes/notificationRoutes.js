const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { createNotification, getNotificationsByCommerceId, markNotificationAsRead } = require('../controllers/notificationController')

const router = express.Router()

router.post('/', verifyToken, createNotification)
router.get('/:id_comercio', verifyToken, getNotificationsByCommerceId)
router.put('/:id', verifyToken, markNotificationAsRead)

module.exports = router

