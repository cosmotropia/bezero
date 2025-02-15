import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { getVentasByUserId } from '../services/apiService'
import { PencilSquareIcon, CheckIcon, EyeIcon } from '@heroicons/react/24/outline'

const UserProfile = () => {
  const { user, getUser, token } = useContext(UserContext)
  console.log('profile-user')
  console.log(user)
  console.log(token)
  const [editMode, setEditMode] = useState({
    name: false,
    address: false,
    email: false,
    phone: false,
  })
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    saved: 0,
    orders: [],
  })
  const [showOrders, setShowOrders] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log(user.id)
        const { orders, totalAhorro } = await getVentasByUserId(user.id)
        console.log(orders)
        setUserData({
          name: user.nombre,
          address: user.direccion,
          email: user.email,
          phone: user.telefono,
          saved: totalAhorro || 0,
          orders: orders || [],
        })
      } else {
        getUser()
      }
    }
    fetchUserData()
  }, [user, getUser, token])

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
  }

  const handleSave = (field) => {
    setEditMode({ ...editMode, [field]: false })
    const updatedUser = { ...user, [field]: userData[field] }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value })
  }

  const toggleOrderHistory = () => {
    setShowOrders(!showOrders)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-15 h-15 bg-gray-400 rounded-full flex items-center justify-center text-white">
                <span className="material-icons">photo</span>
              </div>
              <h2 className="ml-4 text-xl font-bold">{userData.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {['name', 'address', 'email', 'phone'].map((field) => (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field === 'name'
                    ? 'Nombre'
                    : field === 'address'
                    ? 'Dirección'
                    : field === 'email'
                    ? 'Email'
                    : 'Teléfono'}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={userData[field]}
                  disabled={!editMode[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`w-full p-2 border rounded-lg focus:outline-none ${
                    editMode[field] ? 'border-gray-500' : 'border-gray-300'
                  }`}
                />
                {!editMode[field] && (
                  <PencilSquareIcon
                    onClick={() => handleEdit(field)}
                    className="absolute right-3 top-8 w-5 h-5 text-gray-500 hover:text-green-600 cursor-pointer"
                  />
                )}
                {editMode[field] && (
                  <CheckIcon
                    onClick={() => handleSave(field)}
                    className="absolute right-3 top-8 w-5 h-5 text-gray-500 hover:text-green-600 cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
              <h3 className="text-lg font-bold">{`$${userData.saved.toLocaleString()}`}</h3>
              <p className="text-sm text-gray-600">Ahorrado</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
              <h3 className="text-lg font-bold">{userData.orders.length}</h3>
              <p className="text-sm text-gray-600">Pedidos</p>
              <EyeIcon
                onClick={toggleOrderHistory}
                className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-green-600 cursor-pointer"
              />
            </div>
          </div>

          {showOrders && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Historial de pedidos</h3>
              
              {(!userData.orders || userData.orders.length === 0) ? (
                <p className="text-gray-600">No hay pedidos por mostrar</p>
              ) : (
                <ul className="space-y-4">
                  {userData.orders.map((order, index) => (
                    <li key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                      <p className="font-bold mb-2">Orden #{order.id_oc}</p>
                      <p className="text-sm text-gray-600">
                        Fecha: {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : "Desconocida"}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {item.title} - Cantidad: {item.quantity}, Precio pagado: ${item.precio_pagado}, Ahorro: $
                            {(item.precio_real - item.precio_pagado)}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile



