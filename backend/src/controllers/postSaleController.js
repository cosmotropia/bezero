const PostSaleModel = require('../models/PostSale')

const getAllPostSales = async (req, res) => {
  try {
    const postSales = await PostSaleModel.getAllPostSales()
    res.status(200).json(postSales)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener post ventas' })
  }
}

const getPostSaleBySaleId = async (req, res) => {
  try {
    const postSale = await PostSaleModel.getPostSaleBySaleId(req.params.id_venta)
    if (!postSale.length) return res.status(404).json({ error: 'Post venta no encontrada' })
    res.status(200).json(postSale)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener post venta' })
  }
}
const getPostSaleByUserId = async(req, res) => {
  try {
    const postSale = await PostSaleModel.getPostSaleByUserId(req.params.id_usuario)
    res.status(200).json(postSale)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener post ventas' })
  }
}

const createPostSale = async (req, res) => {
  try {
    const { id_venta, id_usuario, calificacion, comentario } = req.body
    if (!id_venta || !id_usuario || !calificacion) {
      return res.status(400).json({ error: 'id_venta, id_usuario y calificación son obligatorios' })
    }

    const newPostSale = await PostSaleModel.createPostSale(req.body)
    res.status(201).json(newPostSale)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear post venta' })
  }
}

const getAverageRatingByCommerceId = async (req, res) => {
  try {
    const promedio = await PostSaleModel.getAverageRatingByCommerceId(req.params.id_comercio)
    res.status(200).json({ promedio })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la calificación promedio' })
  }
}

const getPostSalesByCommerceId = async (req, res) => {
  try {
    const post_ventas = await PostSaleModel.getPostSalesByCommerceId(req.params.id_comercio)
    res.status(200).json(post_ventas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener post ventas' })
  }
}

const getCommentsByCommerceId = async (req, res) => {
  try {
    const promedio = await PostSaleModel.getCommentsByCommerceId(req.params.id_comercio)
    res.status(200).json({ promedio })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios de post venta' })
  }
}

module.exports = { getAllPostSales, getPostSaleBySaleId, getPostSaleByUserId, createPostSale, getPostSalesByCommerceId ,getAverageRatingByCommerceId, getCommentsByCommerceId}


