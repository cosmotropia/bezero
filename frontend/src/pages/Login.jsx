import { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext";
import { loginValidations } from "../utils/validations";

const Login = () => {
  const { token, handleLogin, authError } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await handleLogin(data.email, data.password);
    if (!authError && token) {
      alert("Inicio de sesión exitoso");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl">
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Iniciar sesión</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: loginValidations.email.required,
                  pattern: loginValidations.email.pattern,
                })}
                className={`w-full p-2 border rounded-lg focus:outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Ingresa tu email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: loginValidations.password.required,
                  minLength: loginValidations.password.minLength,
                })}
                className={`w-full p-2 border rounded-lg focus:outline-none ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="*********"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                Recuérdame
              </label>
              <a href="#" className="text-sm text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-black transition"
            >
              Iniciar sesión
            </button>
          </form>
          {authError && (
            <p className="text-sm text-red-500 mt-4 text-center">{authError}</p>
          )}
          <p className="text-sm text-gray-600 mt-4 text-center">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-green-700 font-bold hover:underline">
              Regístrate
            </a>
          </p>
        </div>
        <div
          className="w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/four-salad-mix-bowls-healthy-food_79295-7200.jpg?w=740')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;