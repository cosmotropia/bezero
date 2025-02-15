import { createContext, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import { createOrder } from '../services/apiService'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { user } = useContext(UserContext)

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.id === product.id)
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const checkout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar una compra')
      return
    }
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    try {
      await createOrder(user.id, cart)
      clearCart()
      alert('Compra realizada exitosamente')
    } catch (error) {
      alert('Hubo un error procesando el checkout')
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
  )
}

export default CartProvider;


