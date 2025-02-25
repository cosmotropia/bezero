const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { createPostSale, getPostSaleBySaleId, getPostSaleByUserId, getPostSalesByCommerceId ,getAllPostSales, getAverageRatingByCommerceId, getCommentsByCommerceId } = require('../controllers/postSaleController')

const router = express.Router()

router.post('/', verifyToken, createPostSale)
router.get('/', verifyToken, getAllPostSales)
router.get('/user/:id_usuario', verifyToken, getPostSaleByUserId)
router.get('/:id_venta', verifyToken, getPostSaleBySaleId)
router.get('/:id_comercio/reviews', getAverageRatingByCommerceId)
router.get('/:id_comercio/comments', verifyToken, getPostSalesByCommerceId)

module.exports = router


