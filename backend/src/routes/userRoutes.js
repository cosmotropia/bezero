const express = require('express')
const { createUser, getAllUsers, getUserById, updateUser, deleteUser , getUserProfile} = require('../controllers/userController')
const { verifyToken } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', createUser)
router.get('/', verifyToken, getAllUsers)
router.get('/:id', verifyToken, getUserById)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)
router.get('/me', getUserProfile);

module.exports = router
