const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Category Routes', () => {
  let id_test_categoria = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM publicaciones');
    await db.query('DELETE FROM categorias');
    await db.query('DELETE FROM usuarios');
  
    const hashedPassword = await bcrypt.hash('password', 10);
  
    const usuarioResult = await db.query(`
      INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio)
      VALUES ('Admin Test', 'admin@email.com', '123456789', 'Calle Admin 123', $1, false)
      RETURNING id
    `, [hashedPassword]);
  
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@email.com', contrasena: 'password' });
  
    if (loginResponse.status !== 200) {
      console.error('Error en el login:', loginResponse.body);
    }
  
    token = loginResponse.body.token || '';
  
    const categoriaResult = await db.query(`
      INSERT INTO categorias (nombre, descripcion)
      VALUES ('Alimentos', 'Productos comestibles en oferta')
      RETURNING id
    `);
    id_test_categoria = categoriaResult.rows[0].id;
  })  

  it('GET /api/categories - Obtener todas las categorías', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/categories - Crear una categoría', async () => {
    const newCategory = {
      nombre: 'Electrodomésticos',
      descripcion: 'Artículos para el hogar en descuento'
    };

    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(newCategory.nombre);
    id_test_categoria = response.body.id;
  });

  it('GET /api/categories/:id - Obtener una categoría por ID', async () => {
    expect(id_test_categoria).toBeGreaterThan(0);

    const response = await request(app).get(`/api/categories/${id_test_categoria}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id_test_categoria);
  });

  it('PUT /api/categories/:id - Actualizar una categoría', async () => {
    expect(id_test_categoria).toBeGreaterThan(0);

    const updatedData = {
      nombre: 'Electrodomésticos Actualizados',
      descripcion: 'Nuevos artículos para el hogar'
    };

    const response = await request(app)
      .put(`/api/categories/${id_test_categoria}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(updatedData.nombre);
  });

  it('DELETE /api/categories/:id - Eliminar una categoría', async () => {
    expect(id_test_categoria).toBeGreaterThan(0);

    const response = await request(app)
      .delete(`/api/categories/${id_test_categoria}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app).get(`/api/categories/${id_test_categoria}`);
    expect(check.status).toBe(404);
  });
});

