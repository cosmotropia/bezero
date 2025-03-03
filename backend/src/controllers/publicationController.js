const PublicationModel = require('../models/Publication')

const getAllPublications = async (req, res) => {
  try {
    const publications = await PublicationModel.getAllPublications()
    res.status(200).json(publications)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las publicaciones' })
  }
}

const getPublicationById = async (req, res) => {
  try {
    const publication = await PublicationModel.getPublicationById(req.params.id)
    if (!publication) return res.status(404).json({ error: 'Publicación no encontrada' })
    res.status(200).json(publication)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la publicación' })
  }
}

const getPublicationsByOrderId = async (req, res) => {
  try {
    const { id_oc } = req.params;
    const publications = await PublicationModel.getPublicationsByOrderId(id_oc);

    if (publications.length === 0) {
      return res.status(200).json({ message: 'No hay publicaciones asociadas a esta orden de compra' });
    }

    res.status(200).json(publications);
  } catch (error) {
    console.error('Error al obtener publicaciones por orderId:', error.message);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
}

const getActivePublicationsByCommerceId = async (req, res) => {
  try {
    const { id_comercio } = req.params;
    const publications = await PublicationModel.getActivePublicationsByCommerceId(id_comercio)

    res.status(200).json(publications);
  } catch (error) {
    console.error('Error al obtener publicaciones activas por comercio:', error.message);
    res.status(500).json({ error: 'Error al obtener publicaciones activas' });
  }
}

const getPublicationsByCommerceId = async (req, res) => {
  try {
    const { id_comercio } = req.params;
    const publications = await PublicationModel.getPublicationsByCommerceId(id_comercio);

    res.status(200).json(publications);
  } catch (error) {
    console.error('Error al obtener publicaciones por comercio:', error.message);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
}
const disablePublication = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Solicitud para marcar notificación ${id} como leída`);
    const updatedPublication = await PublicationModel.disablePublication(id);
    res.status(200).json(updatedPublication);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error.message);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
}
const createPublication = async (req, res) => {
  try {
    const newPublication = await PublicationModel.createPublication(req.body)
    res.status(201).json(newPublication)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la publicación' })
  }
}

const updatePublication = async (req, res) => {
  try {
    const updatedPublication = await PublicationModel.updatePublication(req.params.id, req.body)
    if (!updatedPublication) return res.status(404).json({ error: 'Publicación no encontrada' })
    res.status(200).json(updatedPublication)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la publicación' })
  }
}

const deletePublication = async (req, res) => {
  try {
    await PublicationModel.deletePublication(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la publicación' })
  }
}

module.exports = {
  getAllPublications,
  getPublicationById,
  getPublicationsByOrderId,
  getPublicationsByCommerceId ,
  getActivePublicationsByCommerceId,
  createPublication,
  updatePublication,
  deletePublication,
  disablePublication
}
