const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const upload = require("../middlewares/uploadHandler")
const { createCommerce, getAllCommerces, getCommerceById, getCommerceByUserId, updateCommerce, deleteCommerce } = require('../controllers/commerceController')

const router = express.Router()

router.post('/', verifyToken, upload.single('url_img'), createCommerce);
router.get('/', getAllCommerces)
router.get('/:id', getCommerceById)
router.get('/user/:userId', verifyToken, getCommerceByUserId)
router.put('/:id', verifyToken, updateCommerce)
router.delete('/:id', verifyToken, deleteCommerce)

module.exports = router
