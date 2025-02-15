import { useForm } from 'react-hook-form';
import FormField from '../components/FormField';
import { publicationValidations } from '../utils/validations';
import { useContext, useState, useEffect } from 'react';
import { CommerceContext } from '../context/CommerceContext';
import { ApiContext } from '../context/ApiContext';

const CreatePublication = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { commerce, createNewPublication } = useContext(CommerceContext);
  const { categories, fetchPublications } = useContext(ApiContext);
  console.log('commerce from create publi',commerce)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.nombre.toLowerCase() === selectedCategory.toLowerCase());
      setCategoryId(category ? category.id : null);
    }
  }, [selectedCategory, categories]);

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    if (selectedCategory === 'comida' && selectedStartDate) {
      const maxEndDate = new Date(selectedStartDate);
      maxEndDate.setDate(maxEndDate.getDate() + 1);
      setEndDate(maxEndDate.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      if (!startDate || !endDate) {
        alert('Debe seleccionar un rango de fechas válido');
        return;
      }

      if (!commerce?.id) {
        alert('Error: No se encontró el comercio. Verifica tu perfil.');
        return;
      }

      // **Validación del precio**
      const precioActual = parseFloat(data.precio_actual);
      const precioEstimado = parseFloat(data.precio_estimado);
      if (precioEstimado < precioActual) {
        alert('El precio estimado no puede ser menor que el precio actual.');
        return;
      }

      const formattedData = {
        ...data,
        dia_recogida_ini: startDate,
        dia_recogida_end: endDate,
        id_categoria: categoryId,
        id_comercio: commerce.id,
      };

      console.log('Enviando publicación:', formattedData);
      await createNewPublication(formattedData);
      await fetchPublications();
      alert('Publicación creada exitosamente');
      reset();
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert('Hubo un error al crear la publicación');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Crear publicación</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            label="Nombre"
            name="nombre"
            placeholder="Ingresa el nombre del producto o box"
            register={register}
            rules={publicationValidations.nombre}
            errors={errors}
          />

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="categoria"
              {...register('categoria', publicationValidations.tipo)}
              className="w-full p-2 border rounded-lg focus:outline-none"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory === 'comida' && (
            <p className="text-sm text-red-600 col-span-full">
              * Para la categoría <code>Comida</code>, la recogida solo puede realizarse hoy o mañana.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio de recogida
            </label>
            <input
              type="date"
              min={today}
              max={selectedCategory === 'comida' ? tomorrowDate : ''}
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full p-2 border rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de término de recogida
            </label>
            <input
              type="date"
              min={startDate || today}
              max={
                startDate
                  ? selectedCategory === 'comida'
                    ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString().split('T')[0]
                    : new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6)).toISOString().split('T')[0]
                  : ''
              }
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full p-2 border rounded-lg focus:outline-none"
              disabled={!startDate}
            />
          </div>

          <FormField
            label="Precio Actual"
            name="precio_actual"
            placeholder="Ingresa el precio actual"
            register={register}
            rules={publicationValidations.precio_actual}
            errors={errors}
            type="number"
          />

          <FormField
            label="Precio Estimado"
            name="precio_estimado"
            placeholder="Ingresa el precio estimado"
            register={register}
            rules={{
              ...publicationValidations.precio_estimado,
              validate: (value) =>
                parseFloat(value) >= parseFloat(watch('precio_actual')) ||
                'El precio estimado no puede ser menor que el actual',
            }}
            errors={errors}
            type="number"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horario recogida
            </label>
            <div className="flex space-x-2">
              <input
                type="time"
                {...register('hr_ini', publicationValidations.hr_ini)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="time"
                {...register('hr_end', publicationValidations.hr_end)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <FormField
            label="Descripción"
            name="descripcion"
            placeholder="Ingresa la descripción del producto o box"
            register={register}
            rules={publicationValidations.descripcion}
            errors={errors}
          />

          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="bg-black text-white py-2 px-6 rounded-lg font-bold hover:bg-gray-800"
            >
              Crear publicación
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePublication;




