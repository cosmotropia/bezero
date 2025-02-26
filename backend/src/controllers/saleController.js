const SaleModel = require('../models/Sale')

const getAllSales = async (req, res) => {
  try {
    const sales = await SaleModel.getAllSales()
    res.status(200).json(sales)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' })
  }
}

const getSalesByOrderId = async (req, res) => {
  try {
    const sales = await SaleModel.getSalesByOrderId(req.params.id_oc)
    if (sales.length === 0) {
      return res.status(404).json({ error: 'No hay ventas para esta orden' })
    }
    res.status(200).json(sales)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas de la orden' })
  }
}

const createSale = async (req, res) => {
  try {
    const { id_publicacion, quantity, id_oc } = req.body

    if (!id_publicacion || !quantity || !id_oc) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const newSale = await SaleModel.createSale(req.body)
    res.status(201).json(newSale)
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar venta' })
  }
}

const deleteSale = async (req, res) => {
  try {
    const deletedSale = await SaleModel.deleteSale(req.params.id)
    if (!deletedSale) return res.status(404).json({ error: 'Venta no encontrada' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar venta' })
  }
}

const getTotalSalesByCommerceId = async (req, res) => {
  try {
    const totalSales = await SaleModel.getTotalSalesByCommerceId(req.params.id_comercio);
    res.status(200).json(totalSales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el total de ventas' });
  }
}

module.exports = { getAllSales, getSalesByOrderId, createSale, deleteSale, getTotalSalesByCommerceId }

