const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { createPostSale, getPostSaleBySaleId, getAllPostSales, getAverageRatingByCommerceId, getCommentsByCommerceId } = require('../controllers/postSaleController')

const router = express.Router()

router.post('/', verifyToken, createPostSale)
router.get('/', verifyToken, getAllPostSales)
router.get('/:id_venta', verifyToken, getPostSaleBySaleId)
router.get('/:id_comercio/reviews', verifyToken, getAverageRatingByCommerceId)
router.get('/:id_comercio/comments', verifyToken, getCommentsByCommerceId)

module.exports = router


