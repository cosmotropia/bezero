import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { getVentasByUserId, getCommerceById, createPostVenta, getPostSalesByUserId } from '../services/apiService'
import { PencilSquareIcon, CheckIcon, EyeIcon, StarIcon, HeartIcon, ArchiveBoxIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import CommerceBanner from '../components/CommerceBanner'
import { formatAmount } from '../utils/formatAmount';
import Modal from "../components/Modal"

const UserProfile = () => {
  const { user, getUser, token, favorites } = useContext(UserContext)
  const [favoritesWithCommerce, setFavoritesWithCommerce ] = useState([])
  console.log(favorites)
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
  const [showOrders, setShowOrders] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingCommerces, setPendingCommerces] = useState([]);
  const [currentCommerce, setCurrentCommerce] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log(user.id)
        const { orders, totalAhorro } = await getVentasByUserId(user.id)
        console.log('orders array', orders)
        setUserData({
          name: user.nombre,
          address: user.direccion,
          email: user.email,
          phone: user.telefono,
          saved: totalAhorro || 0,
          orders: orders || [],
        })
        const evaluationsData = await getPostSalesByUserId(user.id);
        setEvaluations(evaluationsData)
        console.log(evaluationsData)
        if (favorites.length > 0) {
          try {
            const favoritesWithCommerce = await Promise.all(
              favorites.map(async (f) => ({
                ...f,
                commerce: await getCommerceById(f),
              }))
            );
            console.log('favorito from profile user',favoritesWithCommerce)
            setFavoritesWithCommerce(favoritesWithCommerce);
          } catch (error) {
            console.error("Error al obtener comercios favoritos:", error);
          }
        }
      } else {
        getUser()
      }
    }
    fetchUserData()
  }, [user, getUser, token, favorites])

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
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }
  
  const openModal = (order) => {
    const commercesToEvaluate = order.items.filter(item =>
      !evaluations.some(evaluation => evaluation.id_venta === order.id_venta && evaluation.id_comercio === item.id_comercio)
    );
    
    if (commercesToEvaluate.length > 0) {
      setSelectedOrder(order);
      setPendingCommerces(commercesToEvaluate);
      setCurrentCommerce(commercesToEvaluate[0]);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setPendingCommerces([]);
    setCurrentCommerce(null);
    setRating(0);
    setComment("");
  };

  const submitReview = async () => {
    if (!currentCommerce) return;

    try {
      // Guarda la evaluación inmediatamente
      await createPostVenta(currentCommerce.id_publicacion, user.id, rating, comment);
      
      // Agrega la evaluación al estado
      setEvaluations(prev => [...prev, { id_venta: selectedOrder.id_venta, id_comercio: currentCommerce.id_comercio, calificacion: rating, comentario: comment }]);

      // Avanza al siguiente comercio
      const remainingCommerces = pendingCommerces.slice(1);
      setPendingCommerces(remainingCommerces);

      if (remainingCommerces.length > 0) {
        setCurrentCommerce(remainingCommerces[0]);
        setRating(0);
        setComment("");
      } else {
        closeModal(); // Cierra el modal si ya se evaluaron todos los comercios
      }
    } catch (error) {
      console.error("Error al enviar evaluación:", error);
    }
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
            {["name", "address", "email", "phone"].map((field) => (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-green-700 mb-1 capitalize">
                  {field === "name" ? "Nombre" : field === "address" ? "Dirección" : field === "email" ? "Email" : "Teléfono"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={userData[field]}
                  disabled={!editMode[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`w-full p-2 border rounded-lg focus:outline-none ${editMode[field] ? "border-gray-500" : "border-gray-300"}`}
                />
                {!editMode[field] && (
                  <PencilSquareIcon onClick={() => handleEdit(field)} className="absolute right-3 top-8 w-5 h-5 text-green-700 hover:text-green-800 cursor-pointer" />
                )}
                {editMode[field] && (
                  <CheckIcon onClick={() => handleSave(field)} className="absolute right-3 top-8 w-5 h-5 text-green-700 hover:text-green-800 cursor-pointer" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
              <BanknotesIcon className="h-6 w-6 text-green-700 mx-auto" />
              <h3 className="text-lg font-bold text-green-700">{`$${formatAmount(userData.saved)}`}</h3>
              <p className="text-sm text-green-700">Ahorrado</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
              <ArchiveBoxIcon className="h-6 w-6 text-green-700 mx-auto" />
              <h3 className="text-lg font-bold text-green-700">{userData.orders.length}</h3>
              <p className="text-sm text-green-700">Pedidos</p>
              <EyeIcon onClick={toggleOrderHistory} className="absolute top-2 right-2 h-6 w-6 text-green-700 hover:text-green-800 cursor-pointer" />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
              <HeartIcon className="h-6 w-6 text-green-700 mx-auto" />
              <h3 className="text-lg font-bold text-green-700">{favorites.length}</h3>
              <p className="text-sm text-green-700">Favoritos</p>
              <EyeIcon onClick={toggleFavorites} className="absolute top-2 right-2 h-6 w-6 text-green-700 hover:text-green-800 cursor-pointer" />
            </div>
          </div>
          {showOrders && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-green-700">Historial de pedidos</h3>
              
              {userData.orders.length === 0 ? (
          <p className="text-gray-600">No hay pedidos por mostrar</p>
        ) : (
          <ul className="space-y-4">
            {userData.orders.map((order, index) => {
              const evaluation = evaluations.find((e) => e.id_venta === order.id_venta);

              return (
                <li key={index} className="p-4 border-0 rounded-lg bg-white shadow-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold mb-2">Orden #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      <b>Fecha:</b> {new Date(order.timestamp).toLocaleDateString()}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {item.title} - <b>Cantidad:</b> {item.quantity} - <b>Precio pagado:</b> ${formatAmount(item.precio_pagado)}
                        </li>
                      ))}
                    </ul>
                  </div>
                    <div className="flex items-center space-x-4">
                      {evaluation ? (
                        <div className="text-green-700 flex items-center space-x-1">
                          <StarIcon className="h-6 w-6 text-yellow-500" />
                          <span className="font-semibold">{parseFloat(evaluation.calificacion).toFixed(1)}/5</span>
                          <p className="text-sm text-gray-600 italic">"{evaluation.comentario}"</p>
                        </div>
                      ) : (
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700" onClick={() => openModal(order)}>
                          Evaluar
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            )}
            </div>
          )}

          {showFavorites && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Favoritos</h3>
              {favorites.length === 0 ? (
                <p className="text-gray-600">No hay comercios agregados</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {favoritesWithCommerce.map((fav) => (
                    <CommerceBanner key={fav.id_comercio} comercio={fav.commerce} isFavorite={true} />
                  ))}
                </div>
              )}
            </div>
          )}
          <Modal title={`Evaluar Comercio ${currentCommerce?.id_comercio || ""}`} isOpen={modalOpen} onClose={closeModal} onConfirm={submitReview} confirmText="Siguiente">
            <p className="text-center text-gray-700">{currentCommerce?.title || "Cargando..."}</p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <StarIcon key={num} className={`h-8 w-8 cursor-pointer ${rating >= num ? "text-yellow-500" : "text-gray-300"}`} onClick={() => setRating(num)} />
              ))}
            </div>
            <textarea className="w-full p-2 border rounded-lg mt-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Deja tu comentario..." />
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default UserProfile



