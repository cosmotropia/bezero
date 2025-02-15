const request = require('supertest');
const app = require('../../app');
const db = require('../config/db');
const bcrypt = require('bcrypt');

describe('Order Routes', () => {
  let id_test_usuario = 0;
  let id_test_order = 0;
  let token = '';

  beforeAll(async () => {
    await db.query('DELETE FROM ventas');
    await db.query('DELETE FROM ocs');
    await db.query('DELETE FROM publicaciones');
    await db.query('DELETE FROM categorias');
    await db.query('DELETE FROM comercios');
    await db.query('DELETE FROM usuarios');
  
    const hashedPassword = await bcrypt.hash('password', 10);
  
    const usuarioResult = await db.query(
      `INSERT INTO usuarios (nombre, email, telefono, direccion, contrasena, es_comercio) 
       VALUES ('Usuario Test', 'test@email.com', '123456789', 'Calle Falsa 123', $1, true) 
       RETURNING id`, 
      [hashedPassword]
    );
  
    id_test_usuario = usuarioResult.rows[0].id;
    console.log('Usuario creado con ID:', id_test_usuario);
  
    const categoriaResult = await db.query(
      `INSERT INTO categorias (nombre) VALUES ('Panadería') RETURNING id`
    );
  
    id_test_categoria = categoriaResult.rows[0].id;
    console.log('Categoría creada con ID:', id_test_categoria);
  
    const comercioResult = await db.query(
      `INSERT INTO comercios (nombre, rut, direccion, url_img, calificacion, id_usuario) 
       VALUES ('Panadería Test', '12345678-9', 'Avenida Siempre Viva 742', '/uploads/test.jpg', 5.0, $1) 
       RETURNING id`,
      [id_test_usuario]
    );
  
    id_test_comercio = comercioResult.rows[0].id;
    console.log('Comercio creado con ID:', id_test_comercio);
  
    const publicacionResult = await db.query(
      `INSERT INTO publicaciones (nombre, descripcion, dia_recogida_ini, dia_recogida_end, hr_ini, hr_end, 
        precio_actual, precio_estimado, id_categoria, id_comercio) 
       VALUES ('Caja Sorpresa de Panadería', 'Caja con panes y pasteles a precio reducido', '2025-02-15', 
       '2025-02-20', '08:00:00', '18:00:00', 4990, 7990, $1, $2) 
       RETURNING id`,
      [id_test_categoria, id_test_comercio]
    );
  
    id_test_publicacion = publicacionResult.rows[0].id;
    console.log('Publicación creada con ID:', id_test_publicacion);
  
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', contrasena: 'password' });
  
    token = loginResponse.body.token || '';
  
    if (!token) {
      throw new Error('Error: No se obtuvo un token en la autenticación de prueba.');
    }
  });
  

  it('GET /api/orders - Obtener todas las órdenes', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/orders - Crear una orden', async () => {
    const newOrder = {
      userId: id_test_usuario,
      cart: [
        {
          id: id_test_publicacion,
          precio_actual: 4990,
          quantity: 2
        }
      ]
    };
  
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder);
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id_oc');
    expect(response.body).toHaveProperty('total');
    id_test_order = response.body.id_oc;
  })  

  it('GET /api/orders/:id - Obtener una orden por ID', async () => {
    expect(id_test_order).toBeGreaterThan(0);
  
    const response = await request(app)
      .get(`/api/orders/${id_test_order}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(id_test_order);
  });

  it('DELETE /api/orders/:id - Eliminar una orden', async () => {
    const response = await request(app)
      .delete(`/api/orders/${id_test_order}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const check = await request(app)
      .get(`/api/orders/${id_test_order}`)
      .set('Authorization', `Bearer ${token}`);

    expect(check.status).toBe(404);
  });
});




