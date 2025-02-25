import { XMarkIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Modal = ({ title, children, isOpen, onClose, onConfirm, confirmText = "Confirmar", showStars = false, rating, setRating }) => {
  if (!isOpen) return null;

  const handleStarClick = (index) => {
    setRating(index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {showStars && (
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <StarIcon
                key={index}
                className={`h-8 w-8 cursor-pointer transition-all ${
                  index <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(index)}
              />
            ))}
          </div>
        )}

        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

