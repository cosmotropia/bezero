import { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getCommerceByUserId, 
  getAverageRatingByCommerceId, 
  getTotalSalesByCommerceId, 
  getActivePublicationsByCommerceId,
  getPublicationsByCommerceId,
  createPublication
} from '../services/apiService';

export const CommerceContext = createContext();

const CommerceProvider = ({ children }) => {
  const [commerce, setCommerce] = useState(null);
  const [ventasTotales, setVentasTotales] = useState(0);
  const [calificacionPromedio, setCalificacionPromedio] = useState(0);
  const [publicacionesActivas, setPublicacionesActivas] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);

  const fetchCommerceData = useCallback(async (userId) => {
    try {
      let commerceData = await getCommerceByUserId(userId);
  
      if (!commerceData) {
        console.warn('No se encontró el comercio para el usuario:', userId);
        return;
      }
  
      const BASE_URL = 'http://localhost:3000';
      commerceData.url_img = commerceData.url_img 
        ? `${BASE_URL}${commerceData.url_img}` 
        : 'https://img.freepik.com/free-photo/stir-fry-noodles-with-vegetables-black-background_2829-14216.jpg?w=740';
  
      setCommerce(commerceData);
    } catch (error) {
      console.error('Error obteniendo datos del comercio:', error);
    }
  }, []);

  const refreshCommercePublications = async (commerceId) => {
    try {
      const [ventas, calificacion, publicacionesActivas, publicaciones] = await Promise.all([
        getTotalSalesByCommerceId(commerceId),
        getAverageRatingByCommerceId(commerceId),
        getActivePublicationsByCommerceId(commerceId),
        getPublicationsByCommerceId(commerceId)
      ]);

      setVentasTotales(ventas.totalVentas || 0);
      setCalificacionPromedio(parseFloat(calificacion.promedio).toFixed(1) || '0.0');
      setPublicacionesActivas(publicacionesActivas);
      setPublicaciones(publicaciones);
    } catch (error) {
      console.error('Error actualizando publicaciones del comercio:', error);
    }
  };

  const createNewPublication = async (newPublication) => {
    try {
      await createPublication(newPublication);
      await refreshCommercePublications(commerce.id);
    } catch (error) {
      console.error('Error al crear publicación:', error);
    }
  };

  return (
    <CommerceContext.Provider value={{ 
      commerce, 
      ventasTotales, 
      calificacionPromedio, 
      publicacionesActivas, 
      publicaciones, 
      fetchCommerceData,
      createNewPublication
    }}>
      {children}
    </CommerceContext.Provider>
  );
};

export default CommerceProvider;
