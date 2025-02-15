import { useContext, useEffect, useState } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { UserContext } from '../context/UserContext';
import { getVentasByUserId } from '../services/apiService';

const SalesCommerce = () => {
  const { commerce, ventasTotales, fetchCommerceData } = useContext(CommerceContext);
  const { user, getUser } = useContext(UserContext);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!user) {
      getUser();
    }
    if (user?.es_comercio && !commerce) {
      fetchCommerceData(user.id);
    }
  }, [user, commerce, fetchCommerceData, getUser]);

  useEffect(() => {
    if (commerce) {
      getVentasByUserId(commerce.id)
        .then((data) => setSales(data.orders))
        .catch((error) => console.error('Error obteniendo ventas:', error));
    }
  }, [commerce]);

  if (!user?.es_comercio) {
    return <p className="text-center py-10">No tienes acceso a esta página.</p>;
  }

  if (!commerce) {
    return <p className="text-center py-10">Cargando datos del comercio...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Ventas del Comercio</h1>
      <p className="text-center text-xl font-semibold mb-4">
        Total de Ventas: {ventasTotales}
      </p>

      {sales.length > 0 ? (
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Fecha: {new Date(sale.timestamp).toLocaleDateString()}</p>
              <p className="text-gray-700">Total: ${sale.total}</p>
              <p className="text-gray-700">Número de productos: {sale.items.length}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay ventas registradas.</p>
      )}
    </div>
  );
};

export default SalesCommerce;
