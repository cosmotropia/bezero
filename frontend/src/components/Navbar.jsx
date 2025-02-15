import { Link } from "react-router-dom";
import { Bars2Icon, ShoppingCartIcon, MapPinIcon, ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from 'react';
import { LocationContext } from '../context/LocationContext';
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { location, setLocation } = useContext(LocationContext);
  const [comunaInput, setComunaInput] = useState(location?.comuna || '');
  const { token, handleLogout, user } = useContext(UserContext);
  const { cart } = useContext(CartContext)
  console.log(user);

  const handleLocationChange = () => {
    setLocation({
      ...location,
      comuna: comunaInput
    });
  }

  const logout = () => {
    handleLogout()
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-3">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-200">
            <Bars2Icon className="h-6 w-6 text-gray-800" />
          </button>
          <Link to="/" className="font-bold text-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300"></div>
              <span className="hidden md:block">Logo</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <MapPinIcon className="h-6 w-6 text-gray-800" />
          <input
            type="text"
            value={comunaInput}
            onChange={(e) => setComunaInput(e.target.value)}
            className="border rounded-lg p-2 text-sm"
            placeholder="Ej: Providencia, Santiago"
          />
          <button
            onClick={handleLocationChange}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Cambiar ubicación
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-8 w-8 text-gray-800" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <Link
                to={user?.es_comercio ? "/profile-commerce" : "/profile-user"}
                className="flex items-center bg-gray-800 text-white px-4 py-1 rounded-full hover:bg-gray-700"
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Perfil
              </Link>
              <button
                onClick={logout}
                className="flex items-center border border-gray-800 px-4 py-1 rounded-full hover:bg-gray-200 text-gray-800"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-gray-800 px-4 py-1 rounded-full hover:bg-gray-200"
              >
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
