import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

// ✅ base url ของ backend สำหรับต่อรูป
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

// ✅ แปลง path รูปให้เป็น URL ใช้งานได้
const toImageUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/buyer/orders");
        const data = res.data?.items || res.data?.data || res.data;

        // debug เอาออกได้
        console.log("order sample:", data?.[0]);

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No orders yet.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Browse Games
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // ✅ รองรับรูปจากหลาย field
            const rawImg =
              order.product?.imageUrl ||
              order.product?.image_url ||
              order.product?.image ||
              order.product?.image_path ||
              order.product?.thumbnail ||
              order.product?.cover ||
              order.imageUrl ||
              order.image ||
              order.image_path;

            const imgSrc = toImageUrl(rawImg);

            return (
              <Link
                key={order.id}
                to={`/buyer/orders/${order.id}`}
                className="card flex items-center justify-between hover:border-indigo-500/50 transition-all block"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={order.product?.title || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // ถ้า url รูปผิด ให้ซ่อนรูปแล้วโชว์ไอคอนแทน
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-2xl">🎮</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {order.product?.title || "Product"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Seller: {order.seller?.name || "-"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-emerald-400 font-bold">
                    ฿{parseFloat(order.price || 0).toLocaleString()}
                  </p>
                  <span className="badge-approved">Paid</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
