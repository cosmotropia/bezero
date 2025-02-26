import { createContext, useState, useCallback } from 'react';
import { loginUser, registerUser, getUserProfile, createCommerce, getFavoritesByUserId, addFavorite, removeFavorite } from '../services/apiService';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [authError, setAuthError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const saveToken = (token) => {
    localStorage.setItem('token', token);
  };

  const handleLogin = async (email, contrasena) => {
    try {
      const data = await loginUser(email, contrasena);
      setToken(data.token)
      console.log(data.token)
      saveToken(data.token)
      setAuthError('')
      setUser(data.user)
      console.log('data user loigsadasdasdsadn', data.user)
      loadFavorites(data.user.id)
    } catch (error) {
      setAuthError('Credenciales incorrectas');
    }
  }

  const handleRegister = async (data, isCommerce = false) => {
    try {
      console.log('entra al handler register', data);

      const userData = {
        nombre: data.get("name"),
        email: data.get("email"),
        telefono: data.get("phone"),
        direccion: isCommerce ? data.get("businessAddress") : data.get("address"),
        contrasena: data.get("password"),
        es_comercio: isCommerce,
      }
      const userResponse = await registerUser(userData)
      console.log('user response', userResponse)
      if(userResponse.error){
        setToken(null)
        setRegisterError(userResponse.error)
        return;
      }
      setToken(userResponse.token)
      saveToken(userResponse.token)
      setUser(userResponse.user)
      if(isCommerce){
          const commerceData = new FormData();
          commerceData.append("id_usuario", userResponse.user.id);
          commerceData.append("nombre", data.get("businessName"));
          commerceData.append("rut", data.get("businessRUT"));
          commerceData.append("direccion", data.get("businessAddress"));
          commerceData.append("calificacion", 0.0);
  
          if (data.get("image")) {
            commerceData.append("url_img", data.get("image"));
          }
          const responseCommerce= await createCommerce(commerceData)
          if(responseCommerce.error){
            setToken(null)
            setRegisterError(responseCommerce.error)
            return;
          }
      }
      loadFavorites(userResponse.id)
      setRegisterError('')
    } 
    catch (e) {
      console.log('registerError log', e)
      setToken(null)
      setRegisterError('Error en la solicitud, intente nuevamente');
    }
}

  const getUser = useCallback(async() => {
    if (!user && token) {
      try {
        const userData = await getUserProfile(token)
        setUser(userData)
        loadFavorites(userData.id)
      } catch (error) {
        console.error('Error al obtener perfil del usuario:', error.message);
        handleLogout();
      }
    }}, [token, user])

    const loadFavorites = async (userId) => {
      console.log('entra al load favorites', userId)
      try {
        const favs = await getFavoritesByUserId(userId);
        console.log('favoritos from context',favs)
        setFavorites(favs.map(fav => fav.id_comercio));
        
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      }
    }
  
  const toggleFavorite = async (id_comercio) => {
    if (!user) {
      alert("Debes iniciar sesión para añadir a favoritos");
      return;
    }

    try {
      if (favorites.includes(id_comercio)) {
        await removeFavorite(id_comercio);
        setFavorites(favorites.filter(id => id !== id_comercio));
      } else {
        await addFavorite({ id_usuario: user.id, id_comercio });
        setFavorites([...favorites, id_comercio]);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  }

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        authError,
        registerError,
        favorites,
        handleLogin,
        handleRegister,
        toggleFavorite,
        handleLogout,
        getUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;






