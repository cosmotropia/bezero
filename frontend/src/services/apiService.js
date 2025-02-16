const BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  console.log('token from fetch with auth', token);
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!options.headers?.['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });

 /* if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error en fetchWithAuth: ${errorText}`);
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();*/
  return response;
}

// AUTH
export const loginUser = async (email, contrasena) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena }),
    })
  
    if (!response.ok) throw new Error('Credenciales incorrectas')
  
    return response.json()
  }
  
  export const registerUser = async (userData) => {
    console.log('from apiservice')
    console.log(userData)
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
  
    if (!response.ok) throw new Error('Error en el registro')
  
    return response.json()
  }

// USERS
export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error('Error al crear usuario');
  return response.json();
};

export const getUserProfile = async (token) => {
    console.log('api servie user profile');
    const response = await fetchWithAuth(`${API_URL}/users/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response)
    if (!response.ok) throw new Error('No autorizado');
    return response.json();
};

// CATEGORIES
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Error al cargar las categorías');
  return response.json();
};

// COMMERCE
/*
export const createCommerce = async (commerceData) => {
    console.log('commercedata from api service to back')
    console.log(commerceData)
    const response = await fetch(`${API_URL}/commerces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commerceData),
    })
  
    if (!response.ok) throw new Error('Error al registrar comercio')
  
    return response.json()
}
*/
export const createCommerce = async (formData) => {
  const response = await fetchWithAuth(`${API_URL}/commerces`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Error al registrar comercio");
  return response.json();
}

  
export const getCommerceByUserId = async (userId) => {
  const response = await fetchWithAuth(`${API_URL}/commerces/user/${userId}`);
  console.log('response commerce user');
  console.log(response);
  console.log('response')
  if (!response.ok) throw new Error('No se encontró comercio para este usuario');
  return response.json();
}

// PUBLICATIONS
export const createPublication = async (newPublication) => {
    console.log('publi fro api service', newPublication)
  const response = await fetchWithAuth(`${API_URL}/publications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPublication),
  })

  if (!response.ok) throw new Error('Error al crear publicación');
  return response.json();
}

export const getPublications = async () => {
  const response = await fetch(`${API_URL}/publications`);
  if (!response.ok) throw new Error('Error al obtener publicaciones');
  return response.json();
}

export const getPublicationsByCommerceId = async (commerceId) => {
    const response = await fetchWithAuth(`${API_URL}/publications/commerce/${commerceId}`);
    if (!response.ok) throw new Error('Error al obtener publicaciones');
    return response.json();
}
export const getPublicationById = async (id) => {
    const response = await fetch(`${API_URL}/publications/${id}`);
    if (!response.ok) throw new Error('Error al obtener publicacion');
    return response.json()
}
export const getCommerceLocation = async (direccion) => {
    const auxLocation = { lat: -33.4254, lng: -70.6063 } // Centro de Providencia, Santiago
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
        );

        if (!response.ok) throw new Error('Error al obtener la ubicación del comercio');

        const data = await response.json();
        
        if (data.length === 0) {
            console.warn(`No se encontró ubicación para: ${direccion}. Usando ubicación por defecto.`);
            return auxLocation
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
    } catch (error) {
        console.error('Error en getCommerceLocation:', error);
        return auxLocation
    }
};


export const getFormattedPublications = async (id = null) => {
    try {
      const url = id ? `${API_URL}/publications/${id}` : `${API_URL}/publications`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener publicaciones');

      const publications = id ? [await response.json()] : await response.json();

      const formattedPublications = await Promise.all(
        publications.map(async (pub) => {
          const commerceResponse = await fetch(`${API_URL}/commerces/${pub.id_comercio}`);
          const categoryResponse = await fetch(`${API_URL}/categories/${pub.id_categoria}`);

          const comercio = commerceResponse.ok ? await commerceResponse.json() : null;
          const categoria = categoryResponse.ok ? await categoryResponse.json() : null;
          const location = comercio?.direccion ? await getCommerceLocation(comercio.direccion) : { lat: null, lng: null };

          const recogidaText = `Recogida ${formatPickupDate(pub.dia_recogida_ini)} - ${formatPickupDate(pub.dia_recogida_end)} de ${pub.hr_ini.slice(0, 5)} a ${pub.hr_end.slice(0, 5)}`;
          
          return {
            id: pub.id,
            title: pub.nombre,
            description: pub.descripcion,
            precio_actual: parseInt(pub.precio_actual),
            precio_estimado: parseInt(pub.precio_estimado),
            comercio: {
              id_comercio: comercio?.id,
              nombre: comercio?.nombre || 'Comercio desconocido',
              direccion: comercio?.direccion || 'Dirección no disponible',
              lat: location.lat,
              lng: location.lng,
              rating: comercio?.calificacion ? parseFloat(comercio.calificacion).toFixed(1) : '0.0',
              url_img: BASE_URL.concat(comercio?.url_img),
            },
            categoria: categoria?.nombre || 'Sin categoría',
            pickup: recogidaText,
          };
        })
      );

      return id ? formattedPublications[0] : formattedPublications;
    } catch (error) {
      console.error('Error al obtener publicaciones formateadas:', error);
      return id ? null : [];
    }
};

const formatPickupDate = (date) => {
    return new Date(date).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long' });
}

  
// FAVORITOS
export const getFavoritesByUserId = async (userId) => {
  const response = await fetchWithAuth(`${API_URL}/favorites/${userId}`);
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return response.json();
}

export const getActivePublicationsByCommerceId = async (commerceId) => {
    const response = await fetchWithAuth(`${API_URL}/publications/commerce/${commerceId}/active`);
    if (!response.ok) throw new Error('Error al obtener publicaciones activas');
    return response.json();
}

export const addFavorite = async (favoriteData) => {
  const response = await fetchWithAuth(`${API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favoriteData),
  });

  if (!response.ok) throw new Error('Error al agregar a favoritos');
  return response.json();
}

export const removeFavorite = async (favoriteId) => {
  const response = await fetchWithAuth(`${API_URL}/favorites/${favoriteId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error al eliminar favorito');
}

export const isFavorite = async (userId, commerceId, token) => {
    const API_URL = 'http://localhost:3000/api';
  
    const response = await fetch(`${API_URL}/favorites/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, commerceId }),
    });
  
    if (!response.ok) throw new Error('Error al verificar el favorito');
  
    const result = await response.json();
    return result.isFavorite; 
  }
  
// ORDENES
export const createOrder = async (userId, cart) => {
  console.log('Enviando orden desde API Service', { userId, cart });

  const response = await fetchWithAuth(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cart }),
  });

  if (!response.ok) throw new Error('Error al crear orden');

  return response.json();
}

export const getVentasByUserId = async (userId) => {
  let totalAhorro = 0
  const response = await fetchWithAuth(`${API_URL}/orders/usuario/${userId}`)

  if (response.status === 204) {
    console.warn('No hay órdenes para este usuario.');
    return { orders: [], totalAhorro }
  }

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error al obtener órdenes:', errorText)
    throw new Error('Error al obtener órdenes')
  }

  let orders = await response.json();
  console.log('orders', orders);

  if (!Array.isArray(orders)) {
    orders = [orders]
  }
  const ordersWithPublications = await Promise.all(
    orders.map(async (order) => {
      const publicationsResponse = await fetchWithAuth(`${API_URL}/publications/order/${order.id}`);

      if (!publicationsResponse.ok) {
        console.warn(`No se encontraron publicaciones para la orden ${order.id}`);
        return { ...order, items: [] };
      }
      console.log('publications from apiservice')
      const publications = await publicationsResponse.json()
      console.log(publications)
      const items = publications.map((publication) => ({
        title: publication.nombre,
        precio_real: publication.precio_estimado,
        precio_pagado: publication.precio_actual,
        quantity: 1,
      }));

      return { ...order, items };
    })
  );

  totalAhorro = ordersWithPublications.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + (item.precio_real - item.precio_pagado) * item.quantity, 0);
  }, 0);

  return {
    orders: ordersWithPublications,
    totalAhorro,
  };
}

// VENTAS
export const createSale = async (saleData) => {
  const response = await fetchWithAuth(`${API_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) throw new Error('Error al registrar venta');
  return response.json();
}

export const getTotalSalesByCommerceId = async (id_comercio) => {
  const response = await fetchWithAuth(`${API_URL}/sales/${id_comercio}`);
  if (!response.ok) throw new Error('Error al obtener ventas totales');
  return response.json();
}

// POST-VENTA
export const createPostVenta = async (idVenta, calificacion, comentario) => {
  const response = await fetchWithAuth(`${API_URL}/postsales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idVenta, calificacion, comentario }),
  });

  if (!response.ok) throw new Error('Error al registrar post venta');
  return response.json();
}

export const getAverageRatingByCommerceId = async (id_comercio) => {
  const response = await fetchWithAuth(`${API_URL}/postsales/${id_comercio}/reviews`)
  if (!response.ok) throw new Error('Error al obtener calificación promedio')
  return response.json()
}

export const getCommentsByCommerceId = async (id_comercio) => {
  const response = await fetchWithAuth(`${API_URL}/postsales/${id_comercio}/comments`)
  console.log('responde from api service avrg',response)
  if (!response.ok) throw new Error('Error al obtener calificación promedio')
  return response.json()
}
// NOTIFICACIONES
export const getNotificationsByCommerce = async (commerceId) => {
  const response = await fetchWithAuth(`${API_URL}/notifications/${commerceId}`);
  if (!response.ok) throw new Error('Error al obtener notificaciones');
  return response.json();
}

export const createNotification = async (notificationData) => {
  const response = await fetchWithAuth(`${API_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) throw new Error('Error al crear notificación');
  return response.json();
}


  