import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = () => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.error || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      toast.success(`${newStatus === "active" ? "เปิดใช้งาน" : "ระงับ"}ผู้ใช้เรียบร้อยแล้ว`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถอัพเดทสถานะผู้ใช้ได้");
    }
  };

  const toggleSellerCanPost = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}/seller_can_post`, {
        sellerCanPost: !current,
      });
      toast.success(`${!current ? "อนุญาต" : "เพิกถอน"}สิทธิ์การขายเรียบร้อยแล้ว`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "ไม่สามารถอัพเดทสิทธิ์ผู้ขายได้");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-pink-200/30 dark:border-pink-500/20 shadow-lg">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ผู้ดูแลระบบ - จัดการผู้ใช้งาน
        </h1>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาตาม ชื่อ, ID, หรืออีเมล..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 input-field pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg shadow border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                ชื่อ
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                อีเมล
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                บทบาท
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                สถานะ
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                ยอดเงิน
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users
              .filter((u) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  u.id.toString().includes(query) ||
                  u.name.toLowerCase().includes(query) ||
                  u.email.toLowerCase().includes(query)
                );
              })
              .map((u) => (
                <tr key={u.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-200">{u.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-200">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        u.role === "admin"
                          ? "badge-admin"
                          : u.role === "seller"
                            ? "badge-seller"
                            : "badge-buyer"
                      }
                    >
                      {u.role === "admin" ? "ผู้ดูแลระบบ" : u.role === "seller" ? "ผู้ขาย" : "ผู้ซื้อ"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${u.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                        }`}
                    >
                      {u.status === "active" ? "ใช้งาน" : "ระงับ"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    ฿{parseFloat(u.balance || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${u.status === "active"
                            ? "bg-red-600 hover:bg-red-500 text-white"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                            }`}
                        >
                          {u.status === "active" ? "ระงับ" : "เปิดใช้งาน"}
                        </button>
                      )}

                      {u.role === "seller" && (
                        <button
                          onClick={() =>
                            toggleSellerCanPost(u.id, u.sellerCanPost)
                          }
                          className={`px-3 py-1 rounded text-xs font-semibold ${u.sellerCanPost
                            ? "bg-orange-600 hover:bg-orange-500 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                            }`}
                        >
                          {u.sellerCanPost ? "เพิกถอนสิทธิ์ขาย" : "อนุญาตให้ขาย"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;