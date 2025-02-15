import { Link } from 'react-router-dom';
const InfoCard = ({ title, description, buttonText, buttonLink }) => {
    return (
      <div className="p-6 border-0 rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={buttonLink} className="font-bold text-lg">
          <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
            {buttonText}
          </button>
        </Link>
      </div>
    );
  };
  
  export default InfoCard;