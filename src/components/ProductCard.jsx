import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="aspect-square bg-neutral-100 overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={`http://localhost:4001${product.imageUrl}`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-neutral-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300"></div>

        {/* Quick Action */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium text-neutral-900">
            ดูรายละเอียด
            <HiOutlineArrowRight className="text-[#E87975]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </div>

        <p className="text-neutral-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description || "ไม่มีคำอธิบาย"}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-xl font-semibold text-neutral-900">
            ฿{parseFloat(product.price).toLocaleString()}
          </span>
          <span className="text-xs text-neutral-400">
            โดย {product.seller?.name || "ไม่ระบุ"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
