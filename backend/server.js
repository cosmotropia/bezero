const app = require('./app')
require('dotenv').config({ path: require('path').resolve(__dirname, './.env') })

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
    process.exit(1)
  }
}

startServer()

