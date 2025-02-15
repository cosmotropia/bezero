const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController')

const router = express.Router()

router.post('/', verifyToken, createCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', verifyToken, updateCategory)
router.delete('/:id', verifyToken, deleteCategory)

module.exports = router
