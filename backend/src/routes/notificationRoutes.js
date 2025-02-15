const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { createNotification, getNotificationsByCommerceId } = require('../controllers/notificationController')

const router = express.Router()

router.post('/', verifyToken, createNotification)
router.get('/:id_comercio', verifyToken, getNotificationsByCommerceId)

module.exports = router

