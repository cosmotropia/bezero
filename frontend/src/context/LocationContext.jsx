import { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: -33.4372,
    lng: -70.6506,
    comuna: "Providencia, Santiago",
  })

  const [suggestions, setSuggestions] = useState([]);

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            comuna: "Ubicación actual",
          });
        },
        () => {
          console.warn("No se pudo obtener la ubicación, usando la ubicación por defecto.");
        }
      );
    }
  }

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=CL&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
    }
  }

  const updateLocation = async (comunaInput) => {
    if (!comunaInput.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(comunaInput)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocation({
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          comuna: display_name,
        });
        setSuggestions([]);
      } else {
        console.warn("Ubicación no encontrada");
      }
    } catch (error) {
      console.error("Error al buscar ubicación:", error);
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
        fetchLocationSuggestions,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;

