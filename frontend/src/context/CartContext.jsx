import { createContext, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { createOrder, createNotification, disablePublication } from "../services/apiService";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(UserContext);

  const addToCart = (product, quantity = 1) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una compra");
      return;
    }
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return
    }

    try {
      const orderData = await createOrder(user.id, cart)
  
      if (!orderData || !orderData.id_oc) {
        throw new Error("Error creando orden de compra");
      }
  
      const commercesIds = [...new Set(cart.map((item) => item.comercio.id_comercio))];

      const commerceNotifications = commercesIds.map(async (commerceId) => {
      const itemsVendidos = cart.filter((item) => item.comercio.id_comercio === commerceId);

      const mensaje = itemsVendidos
        .map((item) => 
          `Acabas de vender "${item.title}", con ${item.pickup}.`
        )
        .join("\n");
      const notification = {
        mensaje: `${mensaje} Revisa el detalle en tus ventas.`,
        id_comercio: commerceId,
      }
      return createNotification(notification);
      });

      await Promise.all(commerceNotifications)

      const publicationsIds = [...new Set(cart.map((item) => item.id))]; 
      const disablePublications = publicationsIds.map(async (publicationId) =>{
        console.log('disable publication con id: ', publicationId)
          return disablePublication(publicationId)
      })
      await Promise.all(disablePublications)

      clearCart()

      alert("Compra realizada exitosamente. Los comercios han sido notificados.");
    } catch (error) {
      console.error("Error en checkout:", error)
      alert("Hubo un error procesando el checkout");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;


