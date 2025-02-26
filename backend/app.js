const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage });

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const commerceRoutes = require('./src/routes/commerceRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const publicationRoutes = require('./src/routes/publicationRoutes')
const orderRoutes = require('./src/routes/orderRoutes')
const saleRoutes = require('./src/routes/saleRoutes')
const postSaleRoutes = require('./src/routes/postSaleRoutes')
const favoriteRoutes = require('./src/routes/favoriteRoutes')
const notificationRoutes = require('./src/routes/notificationRoutes')

const app = express()

// Middlewares
app.use(express.json())

const allowedOrigins = [
  process.env.FRONTEND_URL || process.env.FRONTEND_RENDER_URL || "http://localhost:5173",
];

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    origin: allowedOrigins,
    credentials: true,
  })
)
//app.use(cors())
app.use(morgan('dev'))
app.use(helmet())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/commerces', commerceRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/publications', publicationRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/postsales', postSaleRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' })
})

app.get('/api/location', async (req, res) => {
  console.log('api location from backend', req.query)
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Se requiere una dirección de búsqueda" });
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
    if (!response.ok) throw new Error("Error en la API de OpenStreetMap");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la ubicación" });
  }
})

app.get('/api/geocode/reverse', async (req, res) => {
  console.log('api geocode from backend', req.query);
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitud y longitud son requeridas" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos de geocodificación inversa");
    }
    const data = await response.json();
    console.log('api geocode response from backend', data);

    const comuna = data.address?.city || data.address?.town || data.address?.village || "Ubicación desconocida";
    const region = data.address?.state || "";

    return res.json({
      comuna: region ? `${comuna}, ${region}` : comuna,
      region,
    });

  } catch (error) {
    console.error("Error en la geocodificación inversa:", error);
    res.status(500).json({ error: "Error en la geocodificación inversa" });
  }
})

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}))

module.exports = app

