const CommerceModel = require('../models/Commerce')

const getAllCommerces = async (req, res) => {
  try {
    const commerces = await CommerceModel.getAllCommerces()
    res.status(200).json(commerces)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comercios' })
  }
}

const getCommerceById = async (req, res) => {
  try {
    const commerce = await CommerceModel.getCommerceById(req.params.id)
    if (!commerce) return res.status(404).json({ error: 'Comercio no encontrado' })
    res.status(200).json(commerce)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el comercio' })
  }
}

const getCommerceByUserId = async (req, res) => {
  try {
    const commerce = await CommerceModel.getCommerceByUserId(req.params.userId);
    if (!commerce) return res.status(404).json({ error: 'Comercio no encontrado para este usuario' });
    res.status(200).json(commerce);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comercio del usuario' });
  }
}

const createCommerce = async (req, res) => {
  console.log('create commerce req',req.body)
  try {
    const { nombre, rut, direccion, id_usuario } = req.body;
    if (!nombre || !rut || !direccion || !id_usuario) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    let imageUrl = null;
    if (req.file) {
      imageUrl = process.env.NODE_ENV === "production"
        ? req.file.location 
        : `/uploads/${req.file.filename}`
    }
    const newCommerce = await CommerceModel.createCommerce({ 
      nombre, 
      rut, 
      direccion, 
      url_img: imageUrl, 
      id_usuario 
    });
    console.log('new commerce from controler model resp', newCommerce);
    res.status(201).json(newCommerce);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el comercio' });
  }
}

const updateCommerce = async (req, res) => {
  try {
    const { nombre, direccion, url_img, calificacion } = req.body
    if (!nombre || !direccion) {
      return res.status(400).json({ error: 'Nombre y dirección son obligatorios' })
    }

    const updatedCommerce = await CommerceModel.updateCommerce(req.params.id, { nombre, direccion, url_img, calificacion })
    if (!updatedCommerce) return res.status(404).json({ error: 'Comercio no encontrado' })

    res.status(200).json(updatedCommerce)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el comercio' })
  }
}

const deleteCommerce = async (req, res) => {
  try {
    const deletedCommerce = await CommerceModel.deleteCommerce(req.params.id)
    if (!deletedCommerce) return res.status(404).json({ error: 'Comercio no encontrado' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el comercio' })
  }
}

module.exports = { getAllCommerces, getCommerceById , getCommerceByUserId, createCommerce, updateCommerce, deleteCommerce }
