const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { getAllSales, getSalesByOrderId, createSale, deleteSale, getTotalSalesByCommerceId } = require('../controllers/saleController')

const router = express.Router()

router.get('/', verifyToken, getAllSales)
router.get('/order/:id_oc', verifyToken, getSalesByOrderId)
router.post('/', verifyToken, createSale)
router.delete('/:id', verifyToken, deleteSale)
router.get('/:id_comercio', verifyToken, getTotalSalesByCommerceId)

module.exports = router

