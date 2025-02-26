import { createContext, useState, useCallback } from 'react';
import { 
  getCommerceByUserId,
  getTotalSalesByCommerceId, 
  getActivePublicationsByCommerceId,
  getPublicationsByCommerceId,
  createPublication,
  getNotificationsByCommerce,
  markNotificationAsRead
} from '../services/apiService';

export const CommerceContext = createContext();

const CommerceProvider = ({ children }) => {
  const [commerce, setCommerce] = useState(null);
  const [ventasTotales, setVentasTotales] = useState([]);
  const [publicacionesActivas, setPublicacionesActivas] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading ] = useState(true);

  const fetchCommerceData = useCallback(async (userId) => {
    try {
      let commerceData = await getCommerceByUserId(userId);
  
      if (!commerceData) {
        console.warn('No se encontró el comercio para el usuario:', userId);
        return;
      }
      setCommerce(commerceData)
      refreshCommerceData(commerceData.id)
    } catch (error) {
      console.error('Error obteniendo datos del comercio:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCommerceData = async (commerceId) => {
    try {
      const [ventasTotales, publicacionesActivas, publicaciones, notificaciones] = await Promise.all([
        getTotalSalesByCommerceId(commerceId),
        getActivePublicationsByCommerceId(commerceId),
        getPublicationsByCommerceId(commerceId),
        getNotificationsByCommerce(commerceId)
      ]);

      setVentasTotales(ventasTotales);
      setPublicacionesActivas(publicacionesActivas);
      setPublicaciones(publicaciones);
      setNotificaciones(notificaciones)
    } catch (error) {
      console.error('Error actualizando publicaciones del comercio:', error);
    } finally {
      setLoading(false);
    }
  };
  const asyncNotificationsByUser = async (userId) => {
    try {
      const commerceData = await getCommerceByUserId(userId)
      const notifications = await getPublicationsByCommerceId(commerceData.id)
      setNotificaciones(notifications)
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  }
  const createNewPublication = async (newPublication) => {
    try {
      await createPublication(newPublication);
      await refreshCommerceData(commerce.id);
    } catch (error) {
      console.error('Error al crear publicación:', error);
    }
  }

  const markNotification = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotificaciones((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, estado: true } : notification
        )
      );
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  }

  return (
    <CommerceContext.Provider value={{ 
      commerce, 
      ventasTotales,
      publicacionesActivas, 
      publicaciones, 
      notificaciones,
      loading,
      fetchCommerceData,
      createNewPublication,
      markNotification,
      asyncNotificationsByUser
    }}>
      {children}
    </CommerceContext.Provider>
  );
};

export default CommerceProvider;
