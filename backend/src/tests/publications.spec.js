const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Publication Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let id_test_categoria = 0;
  let id_test_publication = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM publicaciones');
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM categorias');
    await db.query('DELETE FROM usuarios');

    const hashedPassword = await bcrypt.hash('password', 10);

    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, true)
      RETURNING id
    `, [hashedPassword]);
    id_test_usuario = usuarioResult.rows[0].id;

    const categoriaResult = await db.query(`
      INSERT INTO categorias (nombre, descripcion)
      VALUES ('Alimentos', 'Comida en oferta')
      RETURNING id
    `);
    id_test_categoria = categoriaResult.rows[0].id;

    const comercioResult = await db.query(`
      INSERT INTO comercios (nombre, rut, direccion, id_usuario)
      VALUES ('Supermercado Test', '12345678-9', 'Avenida Siempre Viva 742', $1)
      RETURNING id
    `, [id_test_usuario]);
    id_test_comercio = comercioResult.rows[0].id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    token = loginResponse.body.token || '';
  });

  it('GET /api/publications - Obtener todas las publicaciones', async () => {
    const response = await request(app)
      .get('/api/publications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/publications - Crear una publicación', async () => {
    const newPublication = {
      nombre: 'Caja Sorpresa de Panadería',
      descripcion: 'Caja con panes y pasteles a precio reducido',
      dia_recogida_ini: '2025-02-15',
      dia_recogida_end: '2025-02-20',
      hr_ini: '08:00:00',
      hr_end: '18:00:00',
      precio_actual: 4990,
      precio_estimado: 7990,
      id_categoria: id_test_categoria,
      id_comercio: id_test_comercio
    };

    const response = await request(app)
      .post('/api/publications')
      .set('Authorization', `Bearer ${token}`)
      .send(newPublication);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(newPublication.nombre);
    expect(parseFloat(response.body.precio_actual)).toBe(newPublication.precio_actual);
    id_test_publication = response.body.id;
  });

  it('GET /api/publications/:id - Obtener una publicación por ID', async () => {
    const response = await request(app)
      .get(`/api/publications/${id_test_publication}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id_test_publication);
  });

  it('PUT /api/publications/:id - Actualizar una publicación', async () => {
    const updatedData = {
      nombre: 'Caja de Panadería Actualizada',
      descripcion: 'Caja con productos de panadería en promoción',
      dia_recogida_ini: '2025-02-16',
      dia_recogida_end: '2025-02-21',
      hr_ini: '09:00:00',
      hr_end: '19:00:00',
      precio_actual: 5990,
      precio_estimado: 8990
    };

    const response = await request(app)
      .put(`/api/publications/${id_test_publication}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(updatedData.nombre);
  });

  it('DELETE /api/publications/:id - Eliminar una publicación', async () => {
    const response = await request(app)
      .delete(`/api/publications/${id_test_publication}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/publications/${id_test_publication}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(404);
  });
});



