const express = require('express')
const multer = require('multer')
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware')
const { createCommerce, getAllCommerces, getCommerceById, getCommerceByUserId, updateCommerce, deleteCommerce } = require('../controllers/commerceController')

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads')
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configurar `multer`
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('url_img'), createCommerce);
router.get('/', verifyToken, getAllCommerces)
router.get('/:id', getCommerceById)
router.get('/user/:userId', verifyToken, getCommerceByUserId)
router.put('/:id', verifyToken, updateCommerce)
router.delete('/:id', verifyToken, deleteCommerce)

module.exports = router
