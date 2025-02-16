import { createContext, useState, useEffect } from 'react';
import { getCategories, getFormattedPublications } from '../services/apiService';

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [categories, setCategories] = useState([]);

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
    }
  };

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
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <ApiContext.Provider value={{ publications, filteredPublications, categories, fetchPublications }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;








