import { createContext, useState, useEffect } from "react";
import { fetchLocationSuggestions, updateLocation, reverseGeocode } from "../services/apiService";

export const LocationContext = createContext();

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: -33.4372,
    lng: -70.6506,
    comuna: "Providencia, Santiago",
  });

  const [suggestions, setSuggestions] = useState([]);

  const fetchUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const { comuna } = await reverseGeocode(latitude, longitude);

          setLocation({
            lat: latitude,
            lng: longitude,
            comuna, 
          });
        },
        () => {
          console.warn("No se pudo obtener la ubicación, usando la ubicación por defecto.");
        }
      );
    }
  }

  const handleFetchLocationSuggestions = async (query) => {
    const results = await fetchLocationSuggestions(query);
    setSuggestions(results);
  };

  const handleUpdateLocation = async (comunaInput) => {
    const newLocation = await updateLocation(comunaInput);
    if (newLocation) {
      setLocation(newLocation);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        suggestions,
        fetchLocationSuggestions: handleFetchLocationSuggestions,
        updateLocation: handleUpdateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;

