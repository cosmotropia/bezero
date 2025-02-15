import { useContext, useState } from 'react';
import { ApiContext } from '../context/ApiContext';
import ProductCard from '../components/ProductCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'

const Store = () => {
  const { filteredPublications, categories, filterPublications } = useContext(ApiContext);
  const [filters, setFilters] = useState({
    categoryId: null,
    pickupStart: 18,
    pickupEnd: 21,
    distance: null,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value === 'all' ? null : parseInt(e.target.value);
    setFilters({ ...filters, categoryId });
    filterPublications({ ...filters, categoryId });
  };

  const handlePickupTimeChange = (e) => {
    const [pickupStart, pickupEnd] = e.target.value.split('-').map(Number);
    setFilters({ ...filters, pickupStart, pickupEnd });
    filterPublications({ ...filters, pickupStart, pickupEnd });
  };

  const handleDistanceChange = (e) => {
    const distance = parseInt(e.target.value);
    setFilters({ ...filters, distance });
    filterPublications({ ...filters, distance });
  };

  return (
    <div className="min-h-screen flex bg-white">
      <aside className={`transition-all duration-300 ease-in-out bg-white ${sidebarOpen ? 'w-64 p-4' : 'w-0 overflow-hidden'}`}>
        <h2 className="text-lg font-bold">Filtros</h2>
        {sidebarOpen && (
          <div >
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Categorías</label>
              <select onChange={handleCategoryChange} className="w-full border rounded-lg p-2">
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category.id_categoria} value={category.id_categoria}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Horario recogida</label>
              <select onChange={handlePickupTimeChange} className="w-full border rounded-lg p-2">
                <option value="18-21">Entre 18:00 y 21:00</option>
                <option value="12-15">Entre 12:00 y 15:00</option>
                <option value="8-11">Entre 8:00 y 11:00</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Rango ubicación (km)</label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                defaultValue={10}
                onChange={handleDistanceChange}
                className="w-full"
              />
              <p className="text-sm text-gray-700 mt-1">{filters.distance} km</p>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-grow bg-white p-4">
        <div className="container mx-auto">
          <div className="flex items-left mb-6">
          <button
              onClick={toggleSidebar}
              className="bg-gray-300 p-2 rounded-md shadow-sm transition-all duration-300 mr-2"
            >
              <FunnelIcon className="h-6 w-6 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold">Publicaciones</h2>
          </div>
          <div className='grid gap-6 transition-all duration-300 grid-cols-2 md:grid-cols-3'>
            { filterPublications ==! null ? filteredPublications.map((publication) => (
              <Link key={publication.id}
                to={`/publication/${publication.id}`}
                className="block hover:shadow-lg transition-shadow duration-300"
                >
                <ProductCard key={publication.id} {...publication} />
              </Link>
            )) : 
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-medium text-gray-600">No hay publicaciones disponibles.</h3>
              <p className="text-sm text-gray-500">Por favor, verifica los filtros o vuelve más tarde.</p>
            </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default Store
