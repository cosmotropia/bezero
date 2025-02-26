import { useNavigate } from "react-router-dom";

const RegisterType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ¿Cómo quieres registrarte?
        </h1>
        <p className="text-gray-600 mb-8">
          Elige una de las opciones para continuar con el registro.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/register-user")}
            className="w-full bg-green-800 text-white py-3 rounded-xl font-bold hover:bg-black transition"
          >
            Registrarme como Usuario
          </button>
          <button
            onClick={() => navigate("/register-commerce")}
            className="w-full bg-white border border-green-900 text-green-800 py-3 rounded-xl font-bold hover:bg-black hover:text-white transition"
          >
            Registrarme como Comercio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterType;