import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, BanknotesIcon, GlobeAltIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard';
import InfoCard from '../components/InfoCard';
import { getFormattedPublications, getCategories } from '../services/apiService';

const Home = () => {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comunaInput, setComunaInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pubs, cats] = await Promise.all([getFormattedPublications(), getCategories()]);
        setPublications(pubs);
        setCategories(cats);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!comunaInput.trim()) return;
    navigate(`/store?comuna=${encodeURIComponent(comunaInput.trim())}`);
  };

  return (
    <div>
      <section className="bg-gray-100 py-10 px-2">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col items-center md:items-start">
            <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md">
              <MapPinIcon className="h-5 w-5 text-gray-800 ml-2" />
              <input
                type="text"
                value={comunaInput}
                onChange={(e) => setComunaInput(e.target.value)}
                className="flex-grow p-3 border-none focus:outline-none"
                placeholder="Ingresa un sector o dirección"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white rounded-lg px-3 py-2 mr-1 hover:bg-green-700 flex items-center"
              >
                Buscar
              </button>
            </div>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">Disfruta más, desperdicia menos</h1>
            <p className="text-gray-700 mb-6 text-justify">
              Encuentra desde alimentos hasta cosméticos y materiales pagando menos. Conecta
              con comercios, restaurantes y fabricantes que ofrecen excedentes de alimentos,
              productos y materiales a precios accesibles antes que se desperdicien. Juntos
              podemos disfrutar más, desperdiciar menos y construir un mundo más sostenible.
            </p>
            <Link to="/store">
              <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-600">
                Explora aquí
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <p className="text-sm font-medium">{category.nombre}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Cargando categorías...</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Recomendados</h2>
          <p className="text-gray-600 mb-6">Disfruta de estos productos cerca tuyo</p>
          {publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publications.map((publication) => (
                <Link key={publication.id} to={`/publication/${publication.id}`} className="block hover:shadow-lg transition-shadow duration-300">
                  <ProductCard {...publication} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center">
              <h3 className="text-lg font-medium text-gray-600">No hay publicaciones disponibles.</h3>
              <p className="text-sm text-gray-500">Por favor, verifica los filtros o vuelve más tarde.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">¿Por qué beZero?</h2>
          <p className="text-gray-600 mb-6">
            Cada producto rescatado es un paso hacia un futuro más sostenible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-2 p-4 border-1 border-gray-50 rounded-lg shadow-md">
              <BanknotesIcon className="h-12 w-12 text-green-600" />
              <p>Ahorra dinero</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border-1 border-gray-50 rounded-lg shadow-md">
              <GlobeAltIcon className="h-12 w-12 text-green-600" />
              <p>Cuida el planeta</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border-1 border-gray-50 rounded-lg shadow-md">
              <BuildingStorefrontIcon className="h-12 w-12 text-green-600" />
              <p>Apoya el comercio local</p>
            </div>
          </div>
          <Link to="/register">
            <button className="mt-6 bg-black text-white py-2 px-6 rounded hover:bg-gray-800">
              Regístrate
            </button>
          </Link>
        </div>
      </section>

      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Únete al cambio</h2>
          <p className="text-gray-600 mb-6">
            Forma parte de un movimiento que transforma excedentes en oportunidades.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              title="Haz una donación"
              description="Tu contribución puede marcar la diferencia"
              buttonText="Saber más"
              buttonLink="/"
            />
            <InfoCard
              title="Inscribe tu negocio"
              description="Transforma tus excedentes en oportunidades"
              buttonText="Saber más"
              buttonLink="/register-commerce"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home





