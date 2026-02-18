import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  FaGamepad,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

// ✅ แปลง path รูปจาก backend ให้เป็น URL ที่เปิดได้จริง
const toImageUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const statusConfig = {
  pending: {
    bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/50",
    text: "text-yellow-300",
    icon: FaClock,
    label: "รออนุมัติ",
  },
  approved: {
    bg: "bg-gradient-to-r from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/50",
    text: "text-emerald-300",
    icon: FaCheckCircle,
    label: "อนุมัติแล้ว",
  },
  rejected: {
    bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
    border: "border-red-500/50",
    text: "text-red-300",
    icon: FaTimesCircle,
    label: "ไม่อนุมัติ",
  },
  sold_out: {
    bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20",
    border: "border-gray-500/50",
    text: "text-gray-300",
    icon: FaBoxOpen,
    label: "ขายแล้ว",
  },
};

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/seller/products");

        // ✅ รองรับหลายแบบ response
        const data = res.data?.items || res.data?.data || res.data;

        // debug (เอาออกได้)
        console.log("products:", data);
        console.log("first product:", data?.[0]);

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("โหลดสินค้าล้มเหลว:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <FaGamepad className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaGamepad className="text-4xl text-indigo-400" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            สินค้าของฉัน
          </h1>
        </div>
        <p className="text-gray-400 ml-14">
          จัดการและติดตามสถานะสินค้าทั้งหมดของคุณ
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/40 border border-gray-700/50 rounded-2xl">
          <FaGamepad className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">ยังไม่มีสินค้า</p>
          <p className="text-gray-500 text-sm mt-2">
            เริ่มสร้างสินค้าแรกของคุณเลย!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => {
            const status = statusConfig[p.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            // ✅ รองรับชื่อ field รูปหลายแบบ
            const rawImg =
              p.imageUrl ||
              p.image_url ||
              p.image ||
              p.image_path ||
              p.thumbnail ||
              p.cover ||
              p.picture;

            const imgSrc = toImageUrl(rawImg);

            return (
              <div
                key={p.id}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

                <div className="relative p-6">
                  {/* Title and Image */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-700 group-hover:border-indigo-500/50 transition-all duration-300 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <FaGamepad className="text-3xl text-gray-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {p.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <HiOutlineClock className="text-lg" />
                        <span>
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString("th-TH")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl">
                      <span className="text-2xl font-bold text-emerald-300">
                        ฿{parseFloat(p.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status + Lock */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Status */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} border ${status.border}`}
                    >
                      <StatusIcon className={`${status.text}`} />
                      <span className={`text-sm font-semibold ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Lock */}
                    {p.isLocked ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
                        <FaLock className="text-red-300" />
                        <span className="text-sm font-semibold text-red-300">
                          ล็อก
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                        <FaUnlock className="text-blue-300" />
                        <span className="text-sm font-semibold text-blue-300">
                          ปลดล็อก
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
