const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('User Routes', () => {
  let id_test_usuario = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM usuarios')

    const hashedPassword = await bcrypt.hash('password', 10)

    const result = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, false)
      RETURNING id
    `, [hashedPassword])

    id_test_usuario = result.rows[0].id

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    if (loginResponse.status !== 200) {
      console.error('Error login usuario', loginResponse.body);
    }

    token = loginResponse.body.token || '';
  });

  it('GET /api/users - Obtener todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/users - Crear un usuario', async () => {
    const newUser = {
      nombre: 'Nuevo Usuario',
      email: 'nuevo@email.com',
      telefono: '987654321',
      direccion: 'Calle Nueva 456',
      contrasena: 'password123',
      es_comercio: false,
    };

    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(newUser.nombre);
  });

  it('GET /api/users/:id - Obtener un usuario por ID', async () => {
    const response = await request(app)
      .get(`/api/users/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id_test_usuario);
  });

  it('PUT /api/users/:id - Actualizar un usuario', async () => {
    const updatedData = {
      nombre: 'Usuario Modificado',
      email: 'modificado@email.com',
      telefono: '111222333',
      direccion: 'Calle Modificada 789',
    };

    const response = await request(app)
      .put(`/api/users/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(updatedData.nombre);
  });

  it('DELETE /api/users/:id - Eliminar un usuario', async () => {
    const response = await request(app)
      .delete(`/api/users/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/users/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(404);
  });
});




