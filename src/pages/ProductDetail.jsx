import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaGamepad } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "buyer") {
      toast.error("Only buyers can purchase");
      return;
    }

    const confirmed = window.confirm(
      `ยืนยันการชำระเงินสินค้า "${product.title}" ราคาฯ ฿${parseFloat(product.price).toLocaleString()} ?`
    );
    if (!confirmed) return;

    setBuying(true);
    try {
      const res = await api.post("/buyer/orders", { productId: product.id });
      toast.success("Purchase successful! 🎮");
      await refreshUser();
      navigate("/buyer/orders");
    } catch (err) {
      toast.error(err.response?.data?.error || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) return null;

  const canBuy =
    user &&
    user.role === "buyer" &&
    parseFloat(user.balance) >= parseFloat(product.price);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        {/* Media Section - Video or Image */}
        <div className="aspect-video bg-gray-700 rounded-lg mb-6 overflow-hidden">
          {product.videoUrl ? (
            <video
              src={`http://localhost:4001${product.videoUrl}`}
              controls
              className="w-full h-full object-cover"
              poster={product.imageUrl ? `http://localhost:4001${product.imageUrl}` : undefined}
            >
              Your browser does not support the video tag.
            </video>
          ) : product.imageUrl ? (
            <img
              src={`http://localhost:4001${product.imageUrl}`}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaGamepad className="text-6xl text-gray-600" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>

        <p className="text-gray-400 text-sm mb-1">
          Sold by{" "}
          <span className="text-gray-300 font-medium">
            {product.seller?.name}
          </span>
        </p>

        <p className="text-gray-400 mt-4 mb-6 leading-relaxed">
          {product.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-3xl font-bold text-emerald-400">
              ฿{parseFloat(product.price).toLocaleString()}
            </p>
          </div>

          {user && user.role === "buyer" && (
            <div className="text-right">
              <p className="text-gray-400 text-sm">Your Balance</p>
              <p
                className={`text-xl font-bold ${canBuy ? "text-emerald-400" : "text-red-400"
                  }`}
              >
                ฿{parseFloat(user.balance || 0).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        {!user && (
          <button onClick={() => navigate("/login")} className="btn-primary w-full">
            Login to Purchase
          </button>
        )}

        {user && user.role === "buyer" && !canBuy && (
          <div className="space-y-3">
            <button disabled className="btn-primary w-full opacity-50">
              Insufficient Balance
            </button>
            <button
              onClick={() => navigate("/buyer/wallet")}
              className="btn-secondary w-full"
            >
              Top Up Wallet
            </button>
          </div>
        )}

        {user && user.role === "buyer" && canBuy && (
          <button
            onClick={handleBuy}
            disabled={buying}
            className="btn-success w-full text-lg py-3"
          >
            {buying ? "Processing..." : "🎮 Buy Now"}
          </button>
        )}

        {user && user.role !== "buyer" && (
          <p className="text-center text-gray-500 text-sm">
            Only buyers can purchase products
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
