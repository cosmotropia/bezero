import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import FormField from '../components/FormField';
import { registerValidations } from '../utils/validations';
import { DotLoader } from 'react-spinners';

const RegisterCommerce = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { token, handleRegister, registerError, loading } = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })
  
      if (data.productImage.length > 0) {
        formData.append('image', data.productImage[0]);
      }
  
      await handleRegister(formData, true)
      if (!registerError && token) {
        alert('Usuario registrado exitosamente')
        reset()
      }
    } catch (error) {
      alert("Error al registrar el comercio");
    }
  }
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Quiero registrar mi comercio</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormField
          label="Tu nombre completo"
          name="name"
          placeholder="Tu nombre completo"
          register={register}
          rules={registerValidations.fullName}
          errors={errors}
        />
        <FormField
          label="Nombre del comercio"
          name="businessName"
          placeholder="Nombre del comercio"
          register={register}
          rules={registerValidations.businessName}
          errors={errors}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="ejemplo@correo.com"
          register={register}
          rules={registerValidations.email}
          errors={errors}
        />
        <FormField
          label="RUT del comercio"
          name="businessRUT"
          placeholder="11111111-1"
          register={register}
          rules={registerValidations.businessRUT}
          errors={errors}
        />
        <FormField
          label="Teléfono"
          name="phone"
          type="tel"
          placeholder="Tu número de teléfono"
          register={register}
          rules={registerValidations.phone}
          errors={errors}
        />
        <FormField
          label="Dirección del comercio"
          name="businessAddress"
          placeholder="Dirección del comercio"
          register={register}
          rules={registerValidations.businessAddress}
          errors={errors}
        />
        <FormField
          label="Contraseña"
          name="password"
          type="password"
          placeholder="********"
          register={register}
          rules={registerValidations.password}
          errors={errors}
        />
        <FormField
          label="Repetir contraseña"
          name="confirmPassword"
          type="password"
          placeholder="********"
          register={register}
          rules={{
            ...registerValidations.confirmPassword,
            validate: (value) =>
              value === watch("password") || "Las contraseñas no coinciden",
          }}
          errors={errors}
        />
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sube una foto de tus productos
          </label>
          <input
            type="file"
            {...register("productImage", registerValidations.productImage)}
            className={`w-full p-2 border rounded-lg ${
              errors.productImage
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />
          {errors.productImage && (
            <p className="text-sm text-red-500 mt-1">{errors.productImage.message}</p>
          )}
        </div>
        <div className="col-span-full flex items-center">
          <input
            type="checkbox"
            id="terms"
            {...register("terms", registerValidations.terms)}
            className="mr-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            Acepto los términos y condiciones
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500 mt-1 col-span-full">
            {errors.terms.message}
          </p>
        )}
        {registerError &&  
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Error de registro:</span> {registerError}
            </div>
          </div>
        }
        {loading ? (
          <div className="col-span-full flex flex-col items-center">
            <DotLoader color="#166534" size={40} />
            <p className="text-sm text-gray-700 mt-2">Registrando comercio...</p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`col-span-full py-2 rounded-lg font-bold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
          >
            Registrar mi comercio
          </button>
        )}
      </form>
    </div>
  );
};

export default RegisterCommerce;