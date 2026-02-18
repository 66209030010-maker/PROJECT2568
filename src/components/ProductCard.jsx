import { Link } from "react-router-dom";
import { FaGamepad } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="card hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 group block"
    >
      <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
        {product.videoUrl ? (
          <div className="relative w-full h-full">
            <video
              src={`http://localhost:4001${product.videoUrl}`}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <FaGamepad className="text-4xl text-white/80" />
            </div>
          </div>
        ) : product.imageUrl ? (
          <img
            src={`http://localhost:4001${product.imageUrl}`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <FaGamepad className="text-4xl text-gray-600 group-hover:text-indigo-500 transition-colors" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-1 truncate">
        {product.title}
      </h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {product.description || "No description"}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-emerald-400">
          ฿{parseFloat(product.price).toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">
          by {product.seller?.name || "Unknown"}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;