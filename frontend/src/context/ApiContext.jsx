import { createContext, useState, useEffect } from 'react';
import { getPublications, getCategories, getFormattedPublications } from '../services/apiService';

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [categories, setCategories] = useState([]);

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
      setCategories(categoriesData);
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








