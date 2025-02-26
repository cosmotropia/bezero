import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, BanknotesIcon, GlobeAltIcon, BuildingStorefrontIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard';
import InfoCard from '../components/InfoCard';
import { ApiContext } from '../context/ApiContext';
import { LocationContext } from '../context/LocationContext';
import { DotLoader } from 'react-spinners';


const Home = () => {
  const {publications, fetchPublications, categories, loading } = useContext(ApiContext);
  const { location, suggestions, fetchLocationSuggestions, updateLocation } = useContext(LocationContext);
  const [comunaInput, setComunaInput] = useState('');
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchPublications();
  }, [])

  useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowSuggestions(false);
        }
      }
  
      function handleKeyDown(event) {
        if (event.key === "Escape") {
          setShowSuggestions(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [])
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setComunaInput(value);
      fetchLocationSuggestions(value);
    };
  
    const handleSuggestionClick = (suggestion) => {
      setComunaInput(suggestion.display_name);
    };

  const handleSearch = () => {
    const searchQuery = comunaInput.trim();
    if (!searchQuery) return;
    navigate(`/store?comuna=${encodeURIComponent(searchQuery)}`);
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }

  return (
    <div>
      <section className="relative bg-gray-100 py-20 px-2 bg-cover bg-center"
        style={{ backgroundImage: `url('/zero-waste.webp')` }}
      >
        <div className="absolute inset-0 bg-black opacity-65"></div>

        <div className="relative container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col items-center md:items-start">
      <div ref={dropdownRef} className="relative w-full max-w-md">
        <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden w-full">
          <MapPinIcon className="h-5 w-5 text-green-700 ml-2" />
          <input
            type="text"
            value={comunaInput}
            onChange={(e) => {
              setComunaInput(e.target.value);
              fetchLocationSuggestions(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="flex-grow p-3 border-none focus:outline-none"
            placeholder="Ingresa un sector o dirección"
          />
          <button
            onClick={handleSearch}
            className="bg-green-700 text-white rounded-lg px-3 py-2 mr-1 hover:bg-green-900 flex items-center"
          >
            Buscar
          </button>
        </div>

        {/* Lista de sugerencias corregida */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 w-full bg-white shadow-lg rounded-lg top-full mt-1 z-50 max-h-60 overflow-y-auto border border-gray-300">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => {
                  setComunaInput(suggestion.display_name);
                  setShowSuggestions(false);
                  updateLocation(suggestion.display_name);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200 truncate"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-4 text-white">Disfruta más, desperdicia menos</h1>
            <p className="text-gray-200 mb-6 text-justify">
              Encuentra desde alimentos hasta cosméticos y materiales pagando menos. Conecta
              con comercios, restaurantes y fabricantes que ofrecen excedentes de alimentos,
              productos y materiales a precios accesibles antes que se desperdicien. Juntos
              podemos disfrutar más, desperdiciar menos y construir un mundo más sostenible.
            </p>
            <Link to="/store">
              <button className="bg-green-700 font-bold text-white py-2 px-6 rounded-lg hover:bg-green-900">
                Explora aquí
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 relative">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Categorías</h2>

        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <div className="overflow-hidden relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4"
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="flex flex-col items-center space-y-2 min-w-[120px]">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                    <img src={category.imageUrl} alt={category.nombre} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium">{category.nombre}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Cargando categorías...</p>
            )}
          </div>
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </section>

      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Recomendados</h2>
          <p className="text-gray-600 mb-6">Disfruta de estos productos cerca tuyo</p>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <DotLoader color="#15803D" size={50} />
              <p className="text-gray-600 mt-4">Cargando publicaciones...</p>
            </div>
          ) :
          publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publications.map((publication) => (
                <Link key={publication.id} to={`/publication/${publication.id}`} className="block hover:shadow-lg transition-shadow duration-300">
                  <ProductCard {...publication} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center">
              <h3 className="text-lg font-medium text-gray-600">No hay publicaciones disponibles</h3>
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
              <BanknotesIcon className="h-12 w-12 text-green-800" />
              <p>Ahorra dinero</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border-1 border-gray-50 rounded-lg shadow-md">
              <GlobeAltIcon className="h-12 w-12 text-green-800" />
              <p>Cuida el planeta</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border-1 border-gray-50 rounded-lg shadow-md">
              <BuildingStorefrontIcon className="h-12 w-12 text-green-800" />
              <p>Apoya el comercio local</p>
            </div>
          </div>
          <Link to="/register">
            <button className="mt-6 bg-green-700 text-white py-2 px-6 rounded-lg hover:bg-gren-900">
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





