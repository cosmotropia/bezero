import { useContext, useEffect } from "react";
import { CommerceContext } from "../context/CommerceContext";
import { UserContext } from "../context/UserContext";
import { markNotificationAsRead } from "../services/apiService";
import { CheckIcon } from "@heroicons/react/24/outline";

const SalesCommerce = () => {
  const { commerce, ventasTotales, notificaciones, fetchCommerceData, setNotificaciones } = useContext(CommerceContext);
  const { user, getUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      getUser();
    }
    if (user?.es_comercio && !commerce) {
      fetchCommerceData(user.id);
    }
  }, [user, commerce, fetchCommerceData, getUser]);

  console.log("ventastotales from page", ventasTotales);
  console.log(notificaciones);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notif) =>
          notif.id === notificationId ? { ...notif, estado: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  if (!user?.es_comercio) {
    return <p className="text-center py-10">No tienes acceso a esta página.</p>;
  }

  if (!commerce) {
    return <p className="text-center py-10">Cargando datos del comercio...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Ventas del Comercio</h1>
      <p className="text-center text-xl font-semibold mb-4">Total de Ventas: {ventasTotales.length}</p>

      {ventasTotales.length > 0 ? (
        <div className="space-y-4">
          {ventasTotales.map((sale, index) => {
            const relatedNotification = notificaciones.find(
              (notif) => notif.id_comercio === commerce.id && notif.id_venta === sale.id && !notif.estado
            );
            const isUnread = !!relatedNotification;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-lg border ${isUnread ? "border-red-600" : "border-0"} bg-white`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Fecha: {new Date(sale.timestamp).toLocaleDateString()}</p>
                    <p className="text-gray-700">Total: ${sale.precio_actual}</p>
                    <p className="text-gray-700">Número de productos: {sale.quantity}</p>
                  </div>
                  {isUnread && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center hover:bg-green-700"
                      onClick={() => handleMarkAsRead(relatedNotification.id)}
                    >
                      <CheckIcon className="h-5 w-5 mr-1" /> Marcar como leído
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay ventas registradas.</p>
      )}
    </div>
  );
};

export default SalesCommerce;

