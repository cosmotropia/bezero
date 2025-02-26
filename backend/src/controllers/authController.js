const db = require('../config/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/User')
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') })

const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

const login = async (req, res) => {
  const { email, contrasena } = req.body;
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
  const isMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = generateToken(user);

  res.json({ 
    token, 
    user: { 
      id: user.id, 
      email: user.email, 
      nombre: user.nombre,
      es_comercio: user.es_comercio,
      direccion: user.direccion,
      telefono: user.telefono
    } 
  });
}

const register = async (req, res) => {
  const { nombre, email, telefono, direccion, contrasena, es_comercio = false } = req.body;
  console.log('registrando usuario')
  const existingUser = await userModel.getUserByEmail(email);
  console.log(existingUser)
  if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });
  try {
    const hashedPass = await bcrypt.hash(contrasena, 10);
    console.log(hashedPass)
    console.log(req.body)
    const newUser = await userModel.createUser({ nombre, email, telefono, direccion, contrasena: hashedPass, es_comercio});
    console.log('new user', newUser)
    const token = generateToken(newUser);

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        nombre: newUser.nombre,
        es_comercio: newUser.es_comercio,
        direccion: newUser.direccion,
        telefono: newUser.telefono
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

module.exports = { login, register }


