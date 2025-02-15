const { sequelize } = require('../config/db')
const User = require('./User')
const Category = require('./Category')
const Commerce = require('./Commerce')
const Favorite = require('./Favorite')
const Notification = require('./Notification')
const Order = require('./Order')
const PostSale = require('./PostSale')
const Publication = require('./Publication')
const Sale = require('./Sale')

User.hasOne(Commerce, { foreignKey: 'id_usuario', onDelete: 'CASCADE' })
Commerce.belongsTo(User, { foreignKey: 'id_usuario' })

User.hasMany(Order, { foreignKey: 'id_usuario', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'id_usuario' })

Commerce.hasMany(Publication, { foreignKey: 'id_comercio', onDelete: 'CASCADE' })
Publication.belongsTo(Commerce, { foreignKey: 'id_comercio' })

Category.hasMany(Publication, { foreignKey: 'id_categoria', onDelete: 'SET NULL' })
Publication.belongsTo(Category, { foreignKey: 'id_categoria' })

Order.hasMany(Sale, { foreignKey: 'id_oc', onDelete: 'CASCADE' })
Sale.belongsTo(Order, { foreignKey: 'id_oc' })

Publication.hasMany(Sale, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' })
Sale.belongsTo(Publication, { foreignKey: 'id_publicacion' })

Commerce.hasMany(Notification, { foreignKey: 'id_comercio', onDelete: 'CASCADE' })
Notification.belongsTo(Commerce, { foreignKey: 'id_comercio' })

User.hasMany(Favorite, { foreignKey: 'id_usuario', onDelete: 'CASCADE' })
Favorite.belongsTo(User, { foreignKey: 'id_usuario' })

Commerce.hasMany(Favorite, { foreignKey: 'id_comercio', onDelete: 'CASCADE' })
Favorite.belongsTo(Commerce, { foreignKey: 'id_comercio' })

Sale.hasOne(PostSale, { foreignKey: 'id_venta', onDelete: 'CASCADE' })
PostSale.belongsTo(Sale, { foreignKey: 'id_venta' })

module.exports = {
  sequelize,
  User,
  Category,
  Commerce,
  Favorite,
  Notification,
  Order,
  PostSale,
  Publication,
  Sale,
}
