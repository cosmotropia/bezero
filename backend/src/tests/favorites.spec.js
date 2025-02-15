const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Favorite Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let id_test_favorito = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM favoritos');
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM usuarios');

    // Hashear la contraseña antes de insertarla
    const hashedPassword = await bcrypt.hash('password', 10);

    // Insertar usuario
    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, false)
      RETURNING id
    `, [hashedPassword]);
    id_test_usuario = usuarioResult.rows[0].id;

    // Intentar obtener un token de autenticación
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    if (loginResponse.status !== 200) {
      console.error('Error en el login, respuesta:', loginResponse.body);
    }

    token = loginResponse.body.token || '';
    const comercioResult = await db.query(`
      INSERT INTO comercios (nombre, rut, direccion, id_usuario)
      VALUES ('Panadería Test', '12345678-9', 'Avenida Siempre Viva 742', $1)
      RETURNING id
    `, [id_test_usuario]);
    id_test_comercio = comercioResult.rows[0].id;
  });

  it('GET /api/favorites/:userId - Obtener favoritos de un usuario', async () => {
    const response = await request(app)
      .get(`/api/favorites/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/favorites - Agregar un favorito', async () => {
    const newFavorite = {
      id_comercio: id_test_comercio,
      id_usuario: id_test_usuario
    };

    const response = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send(newFavorite);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    id_test_favorito = response.body.id;
  });

  it('DELETE /api/favorites/:id - Eliminar un favorito', async () => {
    const response = await request(app)
      .delete(`/api/favorites/${id_test_favorito}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/favorites/${id_test_usuario}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(200);
    expect(check.body.find(fav => fav.id === id_test_favorito)).toBeUndefined();
  });
});


