const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Sale Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let id_test_categoria = 0;
  let id_test_publicacion = 0;
  let id_test_order = 0;
  let id_test_sale = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM ventas');
    await db.query('DELETE FROM ocs');
    await db.query('DELETE FROM publicaciones');
    await db.query('DELETE FROM categorias');
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

    const categoriaResult = await db.query(`
      INSERT INTO categorias (nombre, descripcion)
      VALUES ('Categoría Test', 'Descripción de categoría de prueba')
      RETURNING id
    `);
    id_test_categoria = categoriaResult.rows[0].id;

    const publicacionResult = await db.query(`
      INSERT INTO publicaciones (nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado, id_categoria, id_comercio)
      VALUES ('Caja Sorpresa', 'Caja con productos variados', '2024-02-01', '2024-02-05', '10:00:00', '18:00:00', 4990, 7990, $1, $2)
      RETURNING id
    `, [id_test_categoria, id_test_comercio]);
    id_test_publicacion = publicacionResult.rows[0].id;

    const orderResult = await db.query(`
      INSERT INTO ocs (total, id_usuario)
      VALUES (4990, $1)
      RETURNING id
    `, [id_test_usuario]);
    id_test_order = orderResult.rows[0].id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });

    token = loginResponse.body.token || '';
  });

  it('POST /api/sales - Registrar una venta', async () => {
    const newSale = {
      id_publicacion: id_test_publicacion,
      quantity: 2,
      id_oc: id_test_order
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(newSale);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id_publicacion).toBe(newSale.id_publicacion);
    id_test_sale = response.body.id;
  });

  it('GET /api/sales - Obtener todas las ventas', async () => {
    const response = await request(app)
      .get('/api/sales')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/sales/order/:orderId - Obtener ventas por orden de compra', async () => {
    const response = await request(app)
      .get(`/api/sales/order/${id_test_order}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('DELETE /api/sales/:id - Eliminar una venta', async () => {
    const response = await request(app)
      .delete(`/api/sales/${id_test_sale}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/sales/order/${id_test_order}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(404);
  });
})
