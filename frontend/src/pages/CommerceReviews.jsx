import { useContext, useEffect, useState } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { UserContext } from '../context/UserContext';
import { getCommentsByCommerceId } from '../services/apiService';
import { StarIcon } from '@heroicons/react/24/solid';

const CommerceReviews = () => {
  const { commerce, fetchCommerceData } = useContext(CommerceContext);
  const { user, getUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!user) getUser();
    if (user?.es_comercio && !commerce) fetchCommerceData(user.id);
  }, [user, commerce, fetchCommerceData, getUser]);

  useEffect(() => {
    if (commerce?.id) {
      getCommentsByCommerceId(commerce.id)
        .then((data) => setComments(data))
        .catch((error) => console.error('Error obteniendo comentarios:', error));
    }
  }, [commerce])
  if (!user?.es_comercio) {
    return <p className="text-center py-10">No tienes acceso a esta página.</p>;
  }

  if (!commerce) {
    return <p className="text-center py-10">Cargando datos del comercio...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Reseñas del Comercio</h1>
      <p className="text-center text-xl font-semibold mb-4 flex items-center justify-center text-green-800">
        Calificación promedio: {commerce.calificacionPromedio} 
        <StarIcon className="h-6 w-6 text-green-700 ml-2" />
      </p>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((review, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-green-700 mr-2" />
                <p className="text-lg font-semibold text-green-700">{parseFloat(review.calificacion).toFixed(1)}</p>
              </div>
              <p className="text-gray-700">{review.comentario || 'Sin comentarios'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay reseñas disponibles.</p>
      )}
    </div>
  );
};

export default CommerceReviews;

