const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Notification Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let id_test_notificacion = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM notificaciones');
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM usuarios');

    const hashedPassword = await bcrypt.hash('password', 10);

    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, true)
      RETURNING id
    `, [hashedPassword]);

    id_test_usuario = usuarioResult.rows[0].id;

    const comercioResult = await db.query(`
      INSERT INTO comercios (nombre, rut, direccion, id_usuario)
      VALUES ('Supermercado Test', '12345678-9', 'Calle Comercio 123', $1)
      RETURNING id
    `, [id_test_usuario]);

    id_test_comercio = comercioResult.rows[0].id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    token = loginResponse.body.token || '';
  });

  it('POST /api/notifications - Crear una notificación', async () => {
    const newNotification = {
      mensaje: 'Nuevo producto en oferta',
      estado: false,
      id_comercio: id_test_comercio
    };

    const response = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send(newNotification);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.mensaje).toBe(newNotification.mensaje);
    id_test_notificacion = response.body.id;
  });

  it('GET /api/notifications/:commerceId - Obtener notificaciones de un comercio', async () => {
    const response = await request(app)
      .get(`/api/notifications/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /api/notifications/:commerceId - Verificar notificación creada', async () => {
    const response = await request(app)
      .get(`/api/notifications/${id_test_comercio}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id).toBe(id_test_notificacion);
  });
})



