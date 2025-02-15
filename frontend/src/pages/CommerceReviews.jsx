import { useContext, useEffect, useState } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { UserContext } from '../context/UserContext';
import { getCommentsByCommerceId } from '../services/apiService';

const CommerceReviews = () => {
  const { commerce, calificacionPromedio, fetchCommerceData } = useContext(CommerceContext);
  const { user, getUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);

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
      getCommentsByCommerceId(commerce.id)
        .then((data) => setComments(data))
        .catch((error) => console.error('Error obteniendo comentarios:', error));
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
      <h1 className="text-3xl font-bold text-center mb-6">Reseñas del Comercio</h1>
      <p className="text-center text-xl font-semibold mb-4">
        Calificación promedio: {calificacionPromedio}
      </p>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((review, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">⭐ {review.calificacion}</p>
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
