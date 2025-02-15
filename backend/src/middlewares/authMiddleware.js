const jwt = require('jsonwebtoken')
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') })

const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
  console.log('verificando token de acceso');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token)
  try {
    console.log('intrentando decodificar')
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    console.log('decoded', decoded)
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verifyToken }
