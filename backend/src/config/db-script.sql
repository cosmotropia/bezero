-- Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    contrasena VARCHAR(255) NOT NULL
);

-- Comercios
CREATE TABLE comercios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    direccion VARCHAR(255),
    url_img TEXT,
    calificacion NUMERIC(3, 2) DEFAULT 0,
    es_comercio BOOLEAN DEFAULT FALSE NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Publicaciones
CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    dia_recogida_ini DATE NOT NULL,
    dia_recogida_end DATE NOT NULL,
    hr_ini TIME NOT NULL,
    hr_end TIME NOT NULL,
    precio_actual NUMERIC(10, 2) NOT NULL,
    precio_estimado NUMERIC(10, 2) NOT NULL,
    id_categoria INT NOT NULL,
    id_comercio INT NOT NULL,
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id) ON DELETE SET NULL,
    CONSTRAINT fk_comercio FOREIGN KEY (id_comercio) REFERENCES comercios (id) ON DELETE CASCADE
);

-- Ordenes de compra (OCs)
CREATE TABLE ocs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    total NUMERIC(10, 2) NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario_oc FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- Ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    id_publicacion INT NOT NULL,
    quantity INT NOT NULL,
    id_oc INT NOT NULL,
    CONSTRAINT fk_publicacion FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id) ON DELETE CASCADE,
    CONSTRAINT fk_oc FOREIGN KEY (id_oc) REFERENCES ocs (id) ON DELETE CASCADE
);

-- Post Ventas
CREATE TABLE post_ventas (
    id_transaccion SERIAL PRIMARY KEY,
    calificacion NUMERIC(3, 2) NOT NULL,
    comentario TEXT,
    id_venta INT NOT NULL,
    CONSTRAINT fk_venta FOREIGN KEY (id_venta) REFERENCES ventas (id) ON DELETE CASCADE
);

-- Notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    estado BOOLEAN DEFAULT FALSE,
    id_comercio INT NOT NULL,
    CONSTRAINT fk_comercio_notificacion FOREIGN KEY (id_comercio) REFERENCES comercios (id) ON DELETE CASCADE
);

-- Favoritos
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    id_comercio INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_comercio_favorito FOREIGN KEY (id_comercio) REFERENCES comercios (id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_favorito FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE
);
