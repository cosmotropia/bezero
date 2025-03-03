import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MapPinIcon, ClockIcon, StarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { getFormattedPublications } from '../services/apiService';
import { formatAmount } from '../utils/formatAmount';
import { CartContext } from '../context/CartContext';
import { DotLoader } from 'react-spinners';

const PublicationDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const data = await getFormattedPublications(id);
        if (!data) throw new Error('Publicación no encontrada');
        setPublication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublication();
  }, [id]);

  if (loading) return (<div className="flex flex-col justify-center items-center h-40">
    <DotLoader color="#15803D" size={50} />
    <p className="text-gray-600 mt-4">Cargando publicacion</p>
  </div>);
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  const { title, description, precio_actual, comercio, pickup, activa } = publication;
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!publication) {
      alert('Error: No se pudo agregar la publicación al carrito.');
      return;
    }
    if (!activa) return;
    addToCart(publication, quantity);
    alert(`"${title}" añadida al carrito.`);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto flex flex-col md:flex-row py-10 px-4 gap-6">
        <div className="flex-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={comercio?.url_img || '/dummy-img.png'}
            alt={title}
            className="w-full h-full max-h-[400px] object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="text-gray-600 font-bold flex items-center space-x-2 mb-4">
            <BuildingStorefrontIcon className="h-6 w-6 text-gray-800" />
            <p>{comercio?.nombre || ''}</p>
          </div>
          <div className="text-gray-600 flex items-center space-x-2 mb-4">
            <MapPinIcon className="h-6 w-6 text-gray-800" />
            <p>{comercio?.direccion || 'Dirección no disponible'}</p>
          </div>

          <div className="text-gray-600 flex items-center space-x-2 mb-4">
            <ClockIcon className="h-6 w-6 text-gray-800" />
            <p>{pickup}</p>
          </div>
          <div className="flex items-center space-x-1 mb-4">
            <StarIcon className="h-6 w-6 text-green-800" />
            <p className="font-medium">{comercio?.calificacionPromedio || '0.0'}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            {/*
            <div className="flex items-center space-x-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">-</button>
              <span className="font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">+</button>
            </div>
            */}
            <p className="text-2xl font-bold">${formatAmount(precio_actual)}</p>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={!activa}
            className={`w-full mt-4 py-2 rounded-lg transition ${
              activa 
                ? "bg-green-800 text-white hover:bg-black"
                : "bg-gray-400 text-gray-700 cursor-not-allowed text-white"
            }`}
          >
            Agregar al carro
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;



