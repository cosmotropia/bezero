import { useContext, useEffect } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { EyeIcon, StarIcon } from '@heroicons/react/24/solid';

const CommerceProfile = () => {
  const { commerce, ventasTotales, calificacionPromedio, publicacionesActivas, fetchCommerceData } = useContext(CommerceContext);
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

  const { nombre, direccion, url_img } = commerce;
  console.log(url_img)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="relative h-75 flex items-center justify-center"
        style={{
          backgroundImage: `url(${url_img || 'https://img.freepik.com/free-photo/stir-fry-noodles-with-vegetables-black-background_2829-14216.jpg?w=740'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="z-10 text-white text-center">
          <h1 className="text-4xl font-bold">{nombre}</h1>
          <p className="text-sm mt-2">{direccion}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center relative">
            <p className="text-3xl font-bold">{ventasTotales}</p>
            <p className="text-gray-600">Ventas totales</p>
            <Link to="/sales-commerce">
              <EyeIcon className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-green-600 cursor-pointer" />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center relative">
            <p className="text-3xl font-bold">{publicacionesActivas.length || 0}</p>
            <p className="text-gray-600">Publicaciones activas</p>
            <Link to="/publications-commerce">
              <EyeIcon className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-green-600 cursor-pointer" />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center relative">
            <div className="flex items-center justify-center space-x-2">
              <p className="text-3xl font-bold">{calificacionPromedio}</p>
              <StarIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-gray-600">Calificación promedio</p>
            <Link to="/reviews-commerce">
              <EyeIcon className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-green-600 cursor-pointer" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Gráfico de ventas</h2>
            <img
              src="https://via.placeholder.com/300x200"
              alt="Gráfico de ventas"
              className="w-full rounded-lg"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Información general</h2>
            <p className="text-gray-600">
              Este comercio ha ahorrado una cantidad significativa al vender
              productos excedentes.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/create-publication">
            <button className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-green-700">
              Crear nueva publicación
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommerceProfile










