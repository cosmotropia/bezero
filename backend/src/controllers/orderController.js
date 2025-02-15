const OrderModel = require('../models/Order')

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getAllOrders()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' })
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden' })
  }
}
const getOrderByUserId = async (req, res) => {
  try {
    const orders = await OrderModel.getOrderByUserId(req.params.id)
    if (!orders || orders.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden' });
  }
} 

const createOrder = async (req, res) => {
  try {
    console.log('Creando orden con datos:', req.body);
    const newOrder = await OrderModel.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden y ventas' });
  }
}

const deleteOrder = async (req, res) => {
  try {
    await OrderModel.deleteOrder(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar orden' })
  }
}

module.exports = { getAllOrders, getOrderById, createOrder, deleteOrder, getOrderByUserId }

