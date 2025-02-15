const FormField = ({ label, type = 'text', name, placeholder, register, rules, errors }) => {
  const error = errors?.[name]

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;