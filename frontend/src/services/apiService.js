import { BASE_URL, API_URL } from "./apiConfig";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token')
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
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return response.json();
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
    const response = await fetchWithAuth(`${API_URL}/users/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
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
  console.log('form data from api service', formData);
  const response = await fetchWithAuth(`${API_URL}/commerces`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Error al registrar comercio");
  return response.json();
}
/*
export const getCommerceById = async (commerceId) => {
  try {
    const commerceResponse = await fetch(`${API_URL}/commerces/${commerceId}`);
    if (!commerceResponse.ok) throw new Error('No se encontró comercio para este usuario');

    const commerceData = await commerceResponse.json()
    const ratingResponse = await fetch(`${API_URL}/postsales/${commerceId}/reviews`)
    const ratingData = ratingResponse.ok ? await ratingResponse.json() : { promedio: '0.0' }
    return {
      ...commerceData,
      calificacionPromedio: parseFloat(ratingData.promedio).toFixed(1) || '0.0',
    }
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    return null;
  }
}
export const getCommerces = async () => {
  try {
    const commerceResponse = await fetch(`${API_URL}/commerces`);
    if (!commerceResponse.ok) throw new Error('Error al obtener los comercios');

    const commerceData = await commerceResponse.json();

    const commercesWithRatings = await Promise.all(
      commerceData.map(async (commerce) => {
        try {
          const ratingResponse = await fetch(`${API_URL}/postsales/${commerce.id}/reviews`);
          const ratingData = ratingResponse.ok ? await ratingResponse.json() : { promedio: '0.0' };
          return {
            ...commerce,
            calificacionPromedio: parseFloat(ratingData.promedio).toFixed(1) || '0.0',
          };
        } catch (error) {
          console.error(`Error obteniendo rating para comercio ${commerce.id}:`, error);
          return {
            ...commerce,
            calificacionPromedio: '0.0',
          };
        }
      })
    );
    return commercesWithRatings;
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    return [];
  }
};*/
export const getCommerceById = async (commerceId) => {
  try {
    const commerceResponse = await fetch(`${API_URL}/commerces/${commerceId}`);
    if (!commerceResponse.ok) throw new Error('No se encontró comercio para este usuario');

    const commerceData = await commerceResponse.json();
    const calificacionPromedio = await getRatingByCommerceId(commerceId);

    return {
      ...commerceData,
      calificacionPromedio,
    };
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    return null;
  }
};
export const getCommerces = async () => {
  try {
    const commerceResponse = await fetch(`${API_URL}/commerces`);
    if (!commerceResponse.ok) throw new Error('Error al obtener los comercios');

    const commerceData = await commerceResponse.json();

    const commercesWithRatings = await Promise.all(
      commerceData.map(async (commerce) => ({
        ...commerce,
        calificacionPromedio: await getRatingByCommerceId(commerce.id),
      }))
    );

    return commercesWithRatings;
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    return [];
  }
}

export const getCommerceByUserId = async (userId) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/commerces/user/${userId}`);
    if (!response.ok) throw new Error('No se encontró comercio para este usuario');

    const commerceData = await response.json();
    if (!commerceData || !commerceData.id) {
      return null;
    }
    const calificacionPromedio = await getRatingByCommerceId(commerceData.id);

    return {
      ...commerceData,
      calificacionPromedio,
    };
  } catch (error) {
    console.error(`Error al obtener comercio para usuario ${userId}:`, error);
    return null;
  }
}

// PUBLICATIONS
export const createPublication = async (newPublication) => {
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
export const disablePublication = async (id) => {
  const response = await fetchWithAuth(`${API_URL}/publications/disable/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Error al deshabilitar publicacion');
  return response.json();
}

export const getCommerceLocation = async (direccion) => {
    const auxLocation = { lat: -33.4254, lng: -70.6063 } // Centro de Providencia, Santiago
    try {
        const response = await fetch(
            `${API_URL}/location?q=${encodeURIComponent(direccion)}`
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
        try {
          const [comercio, categoryResponse] = await Promise.all([
            await getCommerceById(pub.id_comercio),
            fetch(`${API_URL}/categories/${pub.id_categoria}`)
          ]);
          const categoria = categoryResponse.ok ? await categoryResponse.json() : null;
          const location = comercio?.direccion ? await getCommerceLocation(comercio.direccion) : { lat: null, lng: null }

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
              calificacionPromedio: comercio?.calificacionPromedio, 
              url_img: comercio?.url_img || '/dummy-img.png',
            },
            categoria: categoria?.nombre || 'Sin categoría',
            id_categoria: categoria?.id,
            pickup: recogidaText,
            hr_ini: pub.hr_ini,
            hr_end: pub.hr_end,
            activa: pub.activa
          };
        } catch (error) {
          console.error(`Error al obtener detalles de la publicación ${pub.id}:`, error);
          return null;
        }
      })
    );

    return id ? formattedPublications[0] : formattedPublications.filter((pub) => pub !== null);
  } catch (error) {
    console.error('Error al obtener publicaciones formateadas:', error);
    return id ? null : [];
  }
}

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
  const response = await fetchWithAuth(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cart }),
  });

  if (!response.ok) throw new Error('Error al crear orden');

  return response.json();
}
/*
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

  let orders = await response.json()
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
      const publications = await publicationsResponse.json()
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
}*/

export const getVentasByUserId = async (userId) => {
  let totalAhorro = 0;
  const response = await fetchWithAuth(`${API_URL}/orders/usuario/${userId}`);

  if (response.status === 204) {
    console.warn("No hay órdenes para este usuario.");
    return { orders: [], totalAhorro };
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al obtener órdenes:", errorText);
    throw new Error("Error al obtener órdenes");
  }

  let orders = await response.json();
  console.log('orders from apiservice', orders)
  if (!Array.isArray(orders)) {
    orders = [orders];
  }

  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      const publicationsResponse = await fetchWithAuth(`${API_URL}/publications/order/${order.id}`);

      if (!publicationsResponse.ok) {
        console.warn(`No se encontraron publicaciones para la orden ${order.id}`);
        return { ...order, items: [], id_venta: null };
      }

      const publications = await publicationsResponse.json();

      // Obtener la venta asociada a esta orden
      const salesResponse = await fetchWithAuth(`${API_URL}/sales/order/${order.id}`);
      let id_venta = null;
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        id_venta = salesData.length > 0 ? salesData[0].id : null;
      } else {
        console.warn(`No se encontró venta para la orden ${order.id}`);
      }

      const items = publications.map((publication) => ({
        id_publicacion: publication.id,
        id_comercio: publication.id_comercio,
        title: publication.nombre,
        precio_real: publication.precio_estimado,
        precio_pagado: publication.precio_actual,
        quantity: 1,
      }));

      return { ...order, items, id_venta };
    })
  );

  totalAhorro = ordersWithDetails.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + (item.precio_real - item.precio_pagado) * item.quantity, 0);
  }, 0);

  return {
    orders: ordersWithDetails,
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
export const createPostVenta = async (id_venta, id_usuario ,calificacion, comentario = '') => {
  console.log('id venta api service', id_venta)
  console.log('calificacion', calificacion)
  console.log('comentario', comentario)
  const response = await fetchWithAuth(`${API_URL}/postsales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_venta, id_usuario, calificacion, comentario }),
  });

  if (!response.ok) throw new Error('Error al registrar post venta');
  return response.json();
}
export const getPostSalesByUserId = async (userId) => {
  const response = await fetchWithAuth(`${API_URL}/postsales/user/${userId}`);

  if (!response.ok) {
    console.error("Error obteniendo evaluaciones:", await response.text());
    return [];
  }

  return response.json();
}
export const getRatingByCommerceId = async (commerceId) => {
  try {
    const ratingResponse = await fetch(`${API_URL}/postsales/${commerceId}/reviews`);
    const ratingData = ratingResponse.ok ? await ratingResponse.json() : { promedio: '0.0' };
    return parseFloat(ratingData.promedio).toFixed(1) || '0.0';
  } catch (error) {
    console.error(`Error obteniendo rating para comercio ${commerceId}:`, error);
    return '0.0';
  }
}

/*
export const getAverageRatingByCommerceId = async (id_comercio) => {
  const response = await fetchWithAuth(`${API_URL}/postsales/${id_comercio}/reviews`)
  if (!response.ok) throw new Error('Error al obtener calificación promedio')
  return response.json()
}*/

export const getCommentsByCommerceId = async (id_comercio) => {
  const response = await fetchWithAuth(`${API_URL}/postsales/${id_comercio}/comments`)
  if (!response.ok) throw new Error('Error al obtener comentarios del comercio')
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

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetchWithAuth(`${API_URL}/notifications/${notificationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
  });

  if (!response.ok) throw new Error('Error al marcar la notificación como leída');
  return response.json();
}

//LOCATION STUFFS
export const fetchLocationSuggestions = async (query) => {
  if (query.length < 3) return [];

  try {
    const response = await fetchWithAuth(`${API_URL}/location?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Error obteniendo sugerencias de ubicación");
    
    return response.json();
  } catch (error) {
    console.error("Error obteniendo sugerencias:", error);
    return [];
  }
};

export const updateLocation = async (comunaInput) => {
  if (!comunaInput.trim()) return null;

  try {
    const response = await fetchWithAuth(`${API_URL}/location?q=${encodeURIComponent(comunaInput)}`);
    if (!response.ok) throw new Error("Error obteniendo ubicación");

    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        comuna: data[0].display_name,
      };
    }
    
    console.warn("Ubicación no encontrada");
    return null;
  } catch (error) {
    console.error("Error al buscar ubicación:", error);
    return null;
  }
}

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/geocode/reverse?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) throw new Error("Error en la geocodificación inversa");

    return response.json();
  } catch (error) {
    console.error("Error al obtener ubicación inversa:", error);
    return { comuna: "Ubicación desconocida", region: "" };
  }
}