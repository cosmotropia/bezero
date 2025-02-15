import { useContext, useEffect } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { formatAmount } from '../utils/formatAmount';

const PublicationsCommerce = () => {
  const { commerce, publicaciones, publicacionesActivas, fetchCommerceData } = useContext(CommerceContext);
  const { user, getUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      getUser();
    }
    if (user?.es_comercio && !commerce) {
      fetchCommerceData(user.id);
    }
  }, [user, commerce, fetchCommerceData, getUser]);

  if (!user?.es_comercio) {
    return <p className="text-center py-10">No tienes acceso a esta página.</p>;
  }

  if (!commerce) {
    return <p className="text-center py-10">Cargando datos del comercio...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Publicaciones del Comercio</h1>
      <p className="text-center text-xl font-semibold mb-4">
        Total de Publicaciones: {publicaciones?.length || 0 } | Activas: {publicacionesActivas?.length || 0 }
      </p>

      {publicaciones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicaciones.map((pub) => {
            const isActive = publicacionesActivas.some((p) => p.id === pub.id);
            return (
              <div key={pub.id} className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${isActive ? 'border-green-500' : 'border-red-500'}`}>
                <img src={commerce.url_img} alt={pub.title} className="w-full h-40 object-cover rounded-md mb-4" />
                <h2 className="text-lg font-semibold">{pub.title}</h2>
                <p className="text-gray-700">{pub.description}</p>
                <p className="text-green-600 font-bold mt-2">Precio: ${formatAmount(pub.precio_actual)}</p>
                <p className={`mt-2 font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isActive ? 'Activa' : 'Inactiva'}
                </p>
                <Link
                  to={`/publication/${pub.id}`}
                  className="block mt-4 bg-black text-white py-2 text-center rounded-md hover:bg-gray-800"
                >
                  Ver Detalles
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay publicaciones registradas.</p>
      )}
    </div>
  );
};

export default PublicationsCommerce;


