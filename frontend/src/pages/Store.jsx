import { useContext, useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import ProductCard from '../components/ProductCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { DotLoader } from 'react-spinners';

const Store = () => {
  const { filteredPublications, categories, fetchPublications, filterPublications, loading } = useContext(ApiContext);
  const [filters, setFilters] = useState({
    categoryId: null,
    pickupStart: 0,
    pickupEnd: 0,
    distance: null,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleCategoryChange = (e) => {
    console.log('category filter')
    const categoryId = e.target.value === 'all' ? null : parseInt(e.target.value);
    setFilters((prevFilters) => ({ ...prevFilters, categoryId }));
    filterPublications({ ...filters, categoryId });
  };

  const handlePickupTimeChange = (e) => {
    const [pickupStart, pickupEnd] = e.target.value.split('-').map(Number);
    setFilters((prevFilters) => ({ ...prevFilters, pickupStart, pickupEnd }));
    filterPublications({ ...filters, pickupStart, pickupEnd });
  };
  const handlePickupRangeChange = (e, type) => {
    const value = parseInt(e.target.value);
  
    setFilters((prevFilters) => {
      let newFilters = { ...prevFilters };
  
      if (type === "start") {
        // Evita que la hora de inicio sea mayor que la de final
        if(prevFilters.pickupEnd == 0)
          prevFilters.pickupEnd = 24
        newFilters.pickupStart = Math.min(value, prevFilters.pickupEnd - 1);
      } else {
        // Evita que la hora final sea menor que la de inicio
        newFilters.pickupEnd = Math.max(value, prevFilters.pickupStart + 1);
      }
  
      filterPublications(newFilters);
      return newFilters;
    });
  }

  const handleDistanceChange = (e) => {
    const distance = parseInt(e.target.value);
    setFilters((prevFilters) => ({ ...prevFilters, distance }));
    filterPublications({ ...filters, distance });
  }
  const resetFilters = () => {
    setFilters({
      categoryId: null,
      pickupStart: null,
      pickupEnd: null,
      distance: null,
    });
    fetchPublications()
  }

  return (
    <div className="min-h-screen flex bg-white">
      <aside className={`transition-all duration-300 ease-in-out bg-white ${sidebarOpen ? 'w-64 p-4' : 'w-0 overflow-hidden'}`}>
        <h2 className="text-lg font-bold">Filtros</h2>
        {sidebarOpen && (
          <div>
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
              <label className="block mb-2 text-sm font-medium">Horario de recogida</label>
              <p className="text-md text-gray-800 text-center">
                {filters.pickupStart === 0 && filters.pickupEnd === 23
                  ? "Todo el día"
                  : `${String(filters.pickupStart).padStart(2, "0")}:00 - ${String(filters.pickupEnd).padStart(2, "0")}:00`}
              </p>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={filters.pickupStart || 0}
                  onChange={(e) => handlePickupRangeChange(e, 'start')}
                  className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={filters.pickupEnd || 23}
                  onChange={(e) => handlePickupRangeChange(e, 'end')}
                  className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
                />
                <div className="w-full h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="absolute h-2 bg-green-800 rounded-full"
                    style={{
                      left: `${(filters.pickupStart / 23) * 100}%`,
                      right: `${100 - (filters.pickupEnd / 23) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Rango ubicación (km)</label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={filters.distance !== null ? filters.distance : 10}
                onChange={handleDistanceChange}
                className="w-full appearance-none bg-gray-300 rounded-lg h-2 cursor-pointer 
               accent-green-800"
              />
              <p className="text-sm text-gray-700 mt-1">
                {filters.distance !== null ? `${filters.distance} km` : "Sin filtro de distancia"}
              </p>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={resetFilters}
                className="w-full bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Borrar filtros
              </button>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-grow bg-white p-4">
        <div className="container mx-auto">
          <div className="flex items-left mb-6">
            <button onClick={toggleSidebar} className="bg-gray-300 p-2 rounded-md shadow-sm transition-all duration-300 mr-2">
              <FunnelIcon className="h-6 w-6 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold">Publicaciones</h2>
          </div>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <DotLoader color="#15803D" size={50} />
              <p className="text-gray-600 mt-4">Cargando publicaciones...</p>
            </div>
          ) :
          filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPublications.map((publication) => (
                <Link key={publication.id} to={`/publication/${publication.id}`} className="block hover:shadow-lg transition-shadow duration-300">
                  <ProductCard {...publication} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-medium text-gray-600">No hay publicaciones disponibles.</h3>
              <p className="text-sm text-gray-500">Por favor, verifica los filtros o vuelve más tarde.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Store;


