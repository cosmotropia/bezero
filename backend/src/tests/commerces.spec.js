const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Commerce Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM usuarios');

    const hashedPassword = await bcrypt.hash('password', 10);

    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, true)
      RETURNING id
    `, [hashedPassword]);

    id_test_usuario = usuarioResult.rows[0].id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    token = loginResponse.body.token || '';
  });

  it('POST /api/commerces - Crear un comercio', async () => {
    const newCommerce = {
      nombre: 'Panadería La Moderna',
      rut: '12345678-9',
      direccion: 'Avenida Siempre Viva 742',
      url_img: 'https://example.com/logo.jpg',
      calificacion: 4.5,
      id_usuario: id_test_usuario
    };

    const response = await request(app)
      .post('/api/commerces')
      .set('Authorization', `Bearer ${token}`)
      .send(newCommerce);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(newCommerce.nombre);

    id_test_comercio = response.body.id;
  });

  it('GET /api/commerces - Obtener todos los comercios', async () => {
    const response = await request(app)
      .get('/api/commerces')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/commerces/:id - Obtener un comercio por ID', async () => {
    const response = await request(app)
      .get(`/api/commerces/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id_test_comercio);
  });

  it('PUT /api/commerces/:id - Actualizar un comercio', async () => {
    const updatedData = {
      nombre: 'Supermercado X Renovado',
      direccion: 'Avenida Central 501',
      url_img: 'https://example.com/newlogo.jpg',
      calificacion: 4.8
    };

    const response = await request(app)
      .put(`/api/commerces/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(updatedData.nombre);
  });

  it('DELETE /api/commerces/:id - Eliminar un comercio', async () => {
    const response = await request(app)
      .delete(`/api/commerces/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/commerces/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(404);
  });
});



