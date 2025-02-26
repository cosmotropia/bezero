import { createContext, useState, useEffect } from 'react';
import { getCategories, getFormattedPublications } from '../services/apiService';
import { calcularDistancia } from '../utils/calcDistance'

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading ] = useState(true);

  const categoryImages = {
    "Alimentos": "/categories/ico-abastecimiento-01.png",
    "Alojamiento": "/categories/ico-alojamiento-01.png",
    "Animales": "/categories/ico-animal-01.png",
    "Automotriz": "/categories/ico-automotriz-01.png",
    "Bazar": "/categories/ico-bazar-01.png",
    "Belleza": "/categories/ico-belleza-01.png",
    "Comida preparada": "/categories/ico-comer-01.png",
    "Deportes": "/categories/ico-deportes-01.png",
    "Hogar": "/categories/ico-hogar-01.png",
    "Oficios": "/categories/ico-oficios-01.png",
    "Tecnología": "/categories/ico-tecnologia-01.png",
    "Vestuario": "/categories/ico-vestuario-01.png",
  }

  const fetchPublications = async () => {
    try {
      const data = await getFormattedPublications();
      setPublications(data);
      console.log('publications', data)
      setFilteredPublications(data);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("No se pudo obtener la ubicación, usando la ubicación por defecto.");
          setUserLocation(null);
        }
      );
    }
  }
  const filterPublications = (filters) => {
    let filtered = publications;
  
    if (filters.categoryId) {
      filtered = filtered.filter((pub) => pub.id_categoria === filters.categoryId);
    }
  
    if (filters.pickupStart !== null && filters.pickupEnd !== null) {
      filtered = filtered.filter((pub) => {
        const hourIni = parseInt(pub.hr_ini.split(":")[0], 10);
        const hourEnd = parseInt(pub.hr_end.split(":")[0], 10);
        return hourIni >= filters.pickupStart && hourEnd <= filters.pickupEnd;
      });
    }
  
    if (filters.distance && userLocation) {
      filtered = filtered.filter((pub) => {
        if (!pub.latitud || !pub.longitud) return false;
        const distance = calcularDistancia(userLocation.lat, userLocation.lng, pub.latitud, pub.longitud);
        return distance <= filters.distance;
      });
    }
  
    setFilteredPublications(filtered);
  }

  const fetchInitialData = async () => {
    try {
      const categoriesData = await getCategories();
      const categoriesWithImages = categoriesData.map(category => ({
        ...category,
        imageUrl: categoryImages[category.nombre],
      }));

      setCategories(categoriesWithImages)
      await fetchPublications();
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    getUserLocation();
  }, []);

  return (
    <ApiContext.Provider value={{ 
      publications, 
      filteredPublications, 
      categories, 
      loading,
      fetchPublications, 
      filterPublications }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;








