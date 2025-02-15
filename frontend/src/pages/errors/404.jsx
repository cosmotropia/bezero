import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
    return (
      <div className="not-found container mt-5">
        <h1>404</h1>
        <h2>Página no encontrada!</h2>
        <Link to="/" className="mt-3"><HomeIcon className="h-6 w-6 text-gray-800" /> Volver al Home</Link>
      </div>
    );
  };    
  export default NotFoundPage;