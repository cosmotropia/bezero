import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, checkout } = useContext(CartContext)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precio_actual * item.quantity, 0)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrito de compras ({cart.length})</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-700">Tu carrito está vacío</p>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{item.comercio.nombre}</h3>
                    <p className="text-gray-700">{item.title}</p>
                    <p className="text-gray-800 font-bold">${item.precio_actual.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-700 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-700 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6">
              <p className="text-lg font-bold">Total: ${calculateTotal().toLocaleString()}</p>
              <div className="flex space-x-4">
                <button
                  onClick={checkout}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Ir al pago
                </button>
                <Link
                  to="/store"
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Volver a la tienda
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart;

