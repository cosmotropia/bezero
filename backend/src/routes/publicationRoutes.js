const express = require('express')
const { verifyToken } = require('../middlewares/authMiddleware')
const { createPublication, 
    getAllPublications, 
    getPublicationById,
    getPublicationsByOrderId, 
    getPublicationsByCommerceId,
    getActivePublicationsByCommerceId,
    updatePublication, 
    deletePublication,
    disablePublication } = require('../controllers/publicationController')

const router = express.Router()

router.post('/', verifyToken, createPublication)
router.get('/', getAllPublications)
router.get('/:id', getPublicationById)
router.get('/order/:id_oc', verifyToken, getPublicationsByOrderId)
router.get('/commerce/:id_comercio', verifyToken, getPublicationsByCommerceId)
router.get('/commerce/:id_comercio/active', verifyToken, getActivePublicationsByCommerceId)
router.put('/:id', verifyToken, updatePublication)
router.put('/disable/:id', verifyToken, disablePublication)
router.delete('/:id', verifyToken, deletePublication)

module.exports = router
