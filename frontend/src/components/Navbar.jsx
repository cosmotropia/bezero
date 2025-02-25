import { Link } from "react-router-dom";
import {
    Bars2Icon,
    ShoppingCartIcon,
    MapPinIcon,
    ArrowRightStartOnRectangleIcon,
    UserCircleIcon,
    HomeIcon,
    BuildingStorefrontIcon,
    MagnifyingGlassIcon,
    BellIcon,
    EyeIcon
} from "@heroicons/react/24/outline"
import { MdOutlineRecycling } from "react-icons/md";
import { useContext, useState, useEffect } from "react"
import { LocationContext } from "../context/LocationContext"
import { UserContext } from "../context/UserContext"
import { CartContext } from "../context/CartContext"
import { CommerceContext } from "../context/CommerceContext"

const Navbar = () => {
  const { location, suggestions, fetchLocationSuggestions, updateLocation } = useContext(LocationContext);
  const { token, handleLogout, user, getUser } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const { notificaciones, asyncNotificationsByUser } = useContext(CommerceContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comunaInput, setComunaInput] = useState(location?.comuna || "");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  useEffect(() => {
    if (user?.es_comercio && user?.id) {
      asyncNotificationsByUser(user.id);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setComunaInput(value);
    fetchLocationSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setComunaInput(suggestion.display_name);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notificaciones?.filter((notif) => !notif.estado) || [];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-6 px-4">
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md hover:bg-gray-200 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Bars2Icon className="h-6 w-6 text-gray-800" />
          </button>
          <Link to="/" className="font-bold text-lg flex items-center space-x-2">
            <MdOutlineRecycling className="h-10 w-10 text-green-900"/>
          </Link>
        </div>

        <div className={`md:flex items-center space-x-6 ${menuOpen ? "block absolute top-14 left-0 w-full bg-[#f0f9f4] p-4 shadow-lg md:relative md:w-auto md:p-0 md:shadow-none" : "hidden md:flex"}`}>
          <Link to="/" className="flex items-center space-x-1 text-green-900 hover:text-gray-800">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/store" className="flex items-center space-x-1 text-green-900 hover:text-gray-800">
            <BuildingStorefrontIcon className="h-5 w-5" />
            <span>Tienda</span>
          </Link>

          <div className="relative flex items-center bg-white shadow-md rounded-lg px-3 py-2">
            <MapPinIcon className="h-5 w-5 text-green-900" />
            <input
              type="text"
              value={comunaInput}
              onChange={handleInputChange}
              className="border-0 outline-none px-2 text-sm w-40 md:w-64 bg-transparent"
              placeholder="Ej: Providencia, Santiago"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-green-900 cursor-pointer" onClick={() => updateLocation(comunaInput)} />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user?.es_comercio && (
            <div className="relative">
              <button className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                <BellIcon className="h-8 w-8 text-green-900" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationDropdown
                  notifications={unreadNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-8 w-8 text-green-900" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {token ? (
            <>
              <Link to={user?.es_comercio ? "/profile-commerce" : "/profile-user"} className="flex items-center bg-green-900 text-white px-4 py-1 rounded-full hover:bg-black">
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center border text-green-900 border-green-900 px-4 py-1 rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-green-900 text-white px-4 py-1 rounded-full hover:bg-gray-800">
                Login
              </Link>
              <Link to="/register" className="border border-green-900 px-4 py-1 text-green-900 rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800">
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NotificationDropdown = ({ notifications, onClose }) => (
  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
    <h3 className="text-lg font-bold mb-2">Notificaciones</h3>
    {notifications.length > 0 ? (
      notifications.map((notif, index) => <p key={index} className="text-sm p-2 border-b">{notif.mensaje}</p>)
    ) : (
      <p className="text-sm text-gray-600">No tienes notificaciones nuevas.</p>
    )}
    <Link to="/sales-commerce" className="mt-3 flex items-center text-green-700 font-bold hover:underline">
      <EyeIcon className="h-5 w-5 mr-2" /> Ver todas las ventas
    </Link>
  </div>
);

export default Navbar;


