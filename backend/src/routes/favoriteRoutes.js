const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { addFavorite, getFavoritesByUserId, removeFavorite, checkIfFavorite } = require('../controllers/favoriteController')

const router = express.Router()

router.post('/', verifyToken, addFavorite)
router.get('/:id_usuario', verifyToken, getFavoritesByUserId)
router.delete('/:id_favorito', verifyToken, removeFavorite)
router.post('/check', verifyToken, checkIfFavorite);

module.exports = router
