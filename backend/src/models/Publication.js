const db = require('../config/db')

const getAllPublications = async () => {
  const result = await db.query('SELECT * FROM publicaciones ORDER BY id;')
  return result.rows
}

const getPublicationById = async (id) => {
  const result = await db.query('SELECT * FROM publicaciones WHERE id = $1', [id])
  return result.rows[0]
}

const getPublicationsByOrderId = async (id_oc) => {
  const query = `
    SELECT p.id, p.nombre, p.descripcion, p.precio_actual, p.precio_estimado,
           v.id, v.timestamp, v.id_oc
    FROM ventas v
    JOIN publicaciones p ON v.id_publicacion = p.id
    WHERE v.id_oc = $1;
  `;
  const result = await db.query(query, [id_oc]);
  return result.rows;
}

const getActivePublicationsByCommerceId = async (id_comercio) => {
  const query = `
    SELECT * FROM publicaciones WHERE activa = TRUE AND id_comercio = $1 ORDER BY id;
  `;
  const result = await db.query(query, [id_comercio]);
  return result.rows;
}

const disablePublication = async (id) => {
  const result = await db.query(
    'UPDATE publicaciones SET activa = FALSE WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

const getPublicationsByCommerceId = async (id_comercio) => {

  const query = `
    SELECT * FROM publicaciones WHERE id_comercio = $1 ORDER BY id;
  `;
  const result = await db.query(query, [id_comercio]);
  return result.rows;
}

const createPublication = async ({
  nombre,
  descripcion,
  dia_recogida_ini,
  dia_recogida_end,
  hr_ini,
  hr_end,
  precio_actual,
  precio_estimado,
  id_categoria,
  id_comercio
}) => {
  if (!nombre || !dia_recogida_ini || !dia_recogida_end || !hr_ini || !hr_end || !precio_actual || !precio_estimado || !id_categoria || !id_comercio) {
    throw new Error('Todos los campos requeridos deben estar presentes')
  }

  const result = await db.query(
    `INSERT INTO publicaciones 
    (nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado, id_categoria, id_comercio) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado, id_categoria, id_comercio]
  )
  return result.rows[0]
}

const updatePublication = async (id, { nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado }) => {
  const result = await db.query(
    `UPDATE publicaciones SET 
    nombre = $1, descripcion = $2, dia_recogida_ini = $3, dia_recogida_end = $4, 
    hr_ini = $5, hr_end = $6, precio_actual = $7, precio_estimado = $8 
    WHERE id = $9 RETURNING *`,
    [nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado, id]
  )
  return result.rows[0]
}

const deletePublication = async (id) => {
  await db.query('DELETE FROM publicaciones WHERE id = $1', [id])
}

module.exports = { 
  getAllPublications, 
  getPublicationById, 
  getPublicationsByOrderId, 
  getPublicationsByCommerceId , 
  getActivePublicationsByCommerceId,
  disablePublication,
  createPublication, 
  updatePublication, 
  deletePublication }

