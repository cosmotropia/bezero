const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Post Sale Routes', () => {
  let id_test_usuario = 0;
  let id_test_comercio = 0;
  let id_test_categoria = 0;
  let id_test_publicacion = 0;
  let id_test_order = 0;
  let id_test_sale = 0;
  let id_test_postsale = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM post_ventas');
    await db.query('DELETE FROM ventas');
    await db.query('DELETE FROM ocs');
    await db.query('DELETE FROM publicaciones');
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM usuarios');
    await db.query('DELETE FROM categorias');

    const categoriaResult = await db.query(`
      INSERT INTO categorias (nombre, descripcion)
      VALUES ('Panadería', 'Productos de panadería y pastelería')
      RETURNING id
    `);
    id_test_categoria = categoriaResult.rows[0].id;

    const hashedPassword = await bcrypt.hash('password', 10);

    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, false)
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

    const publicacionResult = await db.query(`
      INSERT INTO publicaciones (nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, precio_actual, precio_estimado, id_categoria, id_comercio)
      VALUES ('Pack de Pan', 'Varias piezas de pan fresco', '2024-02-04', '2024-02-05', '08:00', '20:00', 4990, 7990, $1, $2)
      RETURNING id
    `, [id_test_categoria, id_test_comercio]);
    id_test_publicacion = publicacionResult.rows[0].id;

    const orderResult = await db.query(`
      INSERT INTO ocs (total, id_usuario)
      VALUES (4990, $1)
      RETURNING id
    `, [id_test_usuario]);
    id_test_order = orderResult.rows[0].id;

    const saleResult = await db.query(`
      INSERT INTO ventas (id_publicacion, quantity, id_oc)
      VALUES ($1, 2, $2)
      RETURNING id
    `, [id_test_publicacion, id_test_order]);
    id_test_sale = saleResult.rows[0].id;
  });

  it('POST /api/postsales - Crear una post venta', async () => {
    const newPostSale = {
      id_venta: id_test_sale,
      calificacion: 4.5,
      comentario: 'Excelente producto'
    };

    const response = await request(app)
      .post('/api/postsales')
      .set('Authorization', `Bearer ${token}`)
      .send(newPostSale);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id_transaccion');
    expect(Number(response.body.calificacion)).toBe(newPostSale.calificacion);
    id_test_postsale = response.body.id_transaccion;
  });

  it('GET /api/postsales/:saleId - Obtener post venta por ID de venta', async () => {
    const response = await request(app)
      .get(`/api/postsales/${id_test_sale}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id_venta).toBe(id_test_sale);
  });

  it('GET /api/postsales - Obtener todas las post ventas', async () => {
    const response = await request(app)
      .get('/api/postsales')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
})


