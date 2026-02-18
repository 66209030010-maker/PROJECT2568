import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/admin/products?status=${filter}`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.error || "ไม่สามารถโหลดข้อมูลสินค้าได้");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/approve`);
      toast.success("อนุมัติสินค้าเรียบร้อยแล้ว");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถอนุมัติสินค้าได้");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/reject`);
      toast.success("ปฏิเสธสินค้าเรียบร้อยแล้ว");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถปฏิเสธสินค้าได้");
    }
  };

  const statusLabels = {
    pending: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ",
    sold_out: "ขายแล้ว"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-pink-200/30 dark:border-pink-500/20 shadow-lg">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ผู้ดูแลระบบ - จัดการสินค้า
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected", "sold_out"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === s
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-400">ไม่พบสินค้า "{statusLabels[filter]}"</p>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-gray-800 rounded-lg shadow border border-gray-700 p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-100">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {p.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    ผู้ขาย: {p.seller?.name} ({p.seller?.email})
                  </p>
                  <p className="text-lg font-bold text-indigo-400 mt-2">
                    ฿{parseFloat(p.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    รหัสเกม: {p.gameCode}
                  </p>
                </div>

                {p.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      ✅ อนุมัติ
                    </button>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      ❌ ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;