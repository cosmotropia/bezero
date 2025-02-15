const CategoryModel = require('../models/Category')

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.getCategoryById(req.params.id)
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
}

const createCategory = async (req, res) => {
  try {
    const newCategory = await CategoryModel.createCategory(req.body)
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' })
  }
}

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryModel.updateCategory(req.params.id, req.body)
    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría' })
  }
}

const deleteCategory = async (req, res) => {
  try {
    await CategoryModel.deleteCategory(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' })
  }
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory }
