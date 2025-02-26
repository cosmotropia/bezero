const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') })

const JWT_SECRET = process.env.JWT_SECRET

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}

const getUserProfile = async (req, res) => {
  try {
    const token = req.body
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      es_comercio: user.es_comercio,
      telefono: user.telefono,
      direccion: user.address
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
}


const createUser = async (req, res) => {
  try {
    const newUser = await UserModel.createUser(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body)
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
}

const deleteUser = async (req, res) => {
  try {
    await UserModel.deleteUser(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
}

module.exports = { getAllUsers, getUserById, getUserProfile, createUser, updateUser, deleteUser }

