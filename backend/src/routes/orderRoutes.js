const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  createOrder,
  deleteOrder
} = require('../controllers/orderController')

const router = express.Router()

router.get('/', verifyToken, getAllOrders)
router.get('/:id', verifyToken, getOrderById)
router.get('/usuario/:id', verifyToken, getOrderByUserId)
router.post('/', verifyToken, createOrder)
router.delete('/:id', verifyToken, deleteOrder)

module.exports = router

