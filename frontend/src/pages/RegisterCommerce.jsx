import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import FormField from '../components/FormField';
import { registerValidations } from '../utils/validations';

const RegisterCommerce = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { token, handleRegister, registerError } = useContext(UserContext);

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
      console.log('register error from front', registerError)
      if (!registerError && token) {
        alert('Usuario registrado exitosamente');
      }
      else{
        alert('Error al registrar el comercio')
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
        <button
          type="submit"
          className="col-span-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
        >
          Registrar mi comercio
        </button>
      </form>
    </div>
  );
};

export default RegisterCommerce;