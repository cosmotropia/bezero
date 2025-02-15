import { Navigate, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RegisterUser from "./pages/RegisterUser"
import RegisterCommerce from "./pages/RegisterCommerce"
import ProfileUser from "./pages/ProfileUser"
import ProfileCommerce from "./pages/ProfileCommerce"
import ReviewsCommerce from "./pages/CommerceReviews"
import PublicationsCommerce from "./pages/PublicationsCommerce"
import SalesCommerce from "./pages/SalesCommerce"
import Store from "./pages/Store"
import PublicationDetail from "./pages/PublicationDetail"
import CreatePublication from "./pages/CreatePublication"
import Cart from "./pages/Cart"
import NotFound from "./pages/errors/404"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { useContext } from 'react';
import CartProvider from './context/CartContext';
import ApiProvider from './context/ApiContext';
import LocationProvider from './context/LocationContext';
import CommerceProvider from "./context/CommerceContext"
import { UserContext } from './context/UserContext';
import CommerceReviews from "./pages/CommerceReviews"

function App() {
  const {token} = useContext(UserContext); 
  return (
    <div className="flex flex-col min-h-screen">
      <ApiProvider>
      <CartProvider>
      <CommerceProvider>
      <LocationProvider>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/register-commerce" element={<RegisterCommerce />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile-commerce" element={token ? <ProfileCommerce/> : <Navigate to="/login" /> }/>
          <Route path="/reviews-commerce" element={token ? <ReviewsCommerce/> : <Navigate to="/login" /> }/>
          <Route path="/publications-commerce" element={token ? <PublicationsCommerce/> : <Navigate to="/login" /> }/>
          <Route path="/sales-commerce" element={token ? <SalesCommerce/> : <Navigate to="/login" /> }/>
          <Route path="/profile-user" element={token ? <ProfileUser/> : <Navigate to="/login" /> } />
          <Route path="/publication/:id" element={<PublicationDetail />} />
          <Route path="/create-publication" element={<CreatePublication />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <Footer />
      </LocationProvider>
      </CommerceProvider>
      </CartProvider>
      </ApiProvider>
    </div>
  );
}

export default App
