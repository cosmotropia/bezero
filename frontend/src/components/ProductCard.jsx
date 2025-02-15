import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import { calcularDistancia } from '../utils/calcDistance';
import { formatAmount } from '../utils/formatAmount';
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';
import { addFavorite, removeFavorite, isFavorite } from '../services/apiService';
import { UserContext } from '../context/UserContext';

const ProductCard = ({ id, title, precio_actual, precio_estimado, comercio, pickup }) => {
  const { location } = useContext(LocationContext);
  const { user , token} = useContext(UserContext);
  const navigate = useNavigate();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (location?.lat && location?.lng && comercio?.lat && comercio?.lng) {
      setDistance(calcularDistancia(location.lat, location.lng, comercio.lat, comercio.lng).toFixed(1));
    }
  }, [location, comercio]);

  useEffect(() => {
    console.log(comercio)
    const checkFavorite = async () => {
      if (user && comercio?.id_comercio && token) {
        const favorite = await isFavorite(user.id, comercio.id_comercio, token);
        setIsFavoriteState(favorite);
      }
    };
    checkFavorite();
  }, [user, comercio, token]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para añadir a favoritos');
      return;
    }

    if (isFavoriteState) {
      await removeFavorite(comercio.id_comercio);
      setIsFavoriteState(false);
    } else {
      await addFavorite({ id_usuario: user.id, id_comercio: comercio.id_comercio });
      setIsFavoriteState(true);
    }
  };
  console.log(comercio?.url_img)
  const handleCardClick = () => {
    navigate(`/publication/${id}`);
  };

  return (
    <div className="relative rounded-lg shadow-md bg-white cursor-pointer overflow-hidden border border-gray-200" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={comercio?.url_img}
          alt={title}
          className="w-full h-36 object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
        >
          <HeartIcon
            className={`h-6 w-6 transition ${
              isFavoriteState ? 'text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          <StarIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm font-bold">{comercio?.calificacion?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-md font-bold text-gray-900">{comercio?.nombre || 'Comercio desconocido'}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-1">
          {pickup} {distance && `• ${distance} km`}
        </p>
        <div className="flex justify-between items-center mt-2">
          {precio_estimado && (
            <span className="text-xs text-gray-400 line-through">
              ${formatAmount(precio_estimado)}
            </span>
          )}
          <span className="text-lg font-bold text-black">
            ${formatAmount(precio_actual)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;







