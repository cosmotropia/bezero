import { StarIcon, MapPinIcon } from "@heroicons/react/24/solid";

const CommerceBanner = ({ comercio, isFavorite = false }) => {
  if (!comercio) return null;
  console.log("comercio from banner", comercio);

  return (
    <div
      className={`relative w-full ${
        isFavorite ? "h-32" : "h-48 md:h-64 lg:h-72"
      } rounded-lg overflow-hidden shadow-md`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${comercio?.url_img || "https://via.placeholder.com/1200x600"})`,
          filter: "brightness(0.6)",
        }}
      ></div>
      <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-green-600" />
          <span className="text-xs font-bold text-black">
            {parseFloat(comercio?.calificacionPromedio).toFixed(1) || '0.0'}
          </span>
        </div>
        <h1 className={`font-bold ${isFavorite ? "text-lg" : "text-2xl md:text-3xl"}`}>
          {comercio?.nombre || "Comercio Desconocido"}
        </h1>
        <p className={`flex items-center ${isFavorite ? "text-xs" : "text-sm md:text-lg"} mt-1`}>
          <MapPinIcon className="h-4 w-4 mr-2" /> {comercio?.direccion || "Ubicación no disponible"}
        </p>
      </div>
    </div>
  );
};

export default CommerceBanner;

