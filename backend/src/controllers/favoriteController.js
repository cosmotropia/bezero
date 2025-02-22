const FavoriteModel = require('../models/Favorite')

const getFavoritesByUserId = async (req, res) => {
  try {
    console.log('favorites controller',req.params.id_usuario )
    const favorites = await FavoriteModel.getFavoritesByUserId(req.params.id_usuario)
    res.status(200).json(favorites)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' })
  }
}

const addFavorite = async (req, res) => {
  try {
    const newFavorite = await FavoriteModel.addFavorite(req.body)
    res.status(201).json(newFavorite)
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar favorito' })
  }
}

const removeFavorite = async (req, res) => {
  try {
    await FavoriteModel.removeFavorite(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar favorito' })
  }
}
const checkIfFavorite = async (req, res) => {
  try {
    const { userId, commerceId } = req.body;

    if (!userId || !commerceId) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const isFavorite = await FavoriteModel.isFavorite(userId, commerceId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { getFavoritesByUserId, addFavorite, removeFavorite, checkIfFavorite }

