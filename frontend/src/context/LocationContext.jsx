import { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: -33.4372,
    lng: -70.6506,
    comuna: 'Providencia, Santiago'
  })

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            comuna: 'Ubicación actual'
          });
        },
        () => {
          console.log('No se pudo obtener la ubicación, usando la ubicación por defecto.');
        }
      );
    }
  }

  useEffect(() => {
    fetchUserLocation();
  }, [])

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export default LocationProvider;
