import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import FormField from '../components/FormField';
import { registerValidations } from '../utils/validations';

const RegisterUser = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { handleRegister, registerError } = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })
  
      await handleRegister(formData, false);
      console.log(registerError)
      if (!registerError) {
        alert('Usuario registrado exitosamente');
      } else {
        alert("Error al registrar el usuario: " + registerError);
      }
    } catch (error) {
      alert("Error al registrar el usuario: " + error.message);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Crea una cuenta gratuita</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormField
          label="Nombre completo"
          name="name"
          placeholder="Tu nombre completo"
          register={register}
          rules={registerValidations.fullName}
          errors={errors}
        />
        <FormField
          label="Dirección"
          name="address"
          placeholder="Tu dirección"
          register={register}
          rules={registerValidations.address}
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
          label="Teléfono"
          name="phone"
          type="tel"
          placeholder="Tu número de teléfono"
          register={register}
          rules={registerValidations.phone}
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
          Registrarme
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;

