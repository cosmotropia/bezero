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

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}))

module.exports = app

